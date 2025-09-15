import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseCSV, validateRow, ImportError, BuyerCreateData } from '@/lib/import-validation'

interface ImportResult {
  success: boolean
  importedCount: number
  totalRows: number
  errors: ImportError[]
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const ownerId = formData.get('ownerId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    // Parse CSV using the extracted function
    const text = await file.text()
    const { headers, rows, errors: parseErrors } = parseCSV(text)

    if (parseErrors.length > 0) {
      return NextResponse.json({ error: parseErrors[0] }, { status: 400 })
    }

    // Validate all rows
    const allErrors: ImportError[] = []
    const validRows: BuyerCreateData[] = []

    rows.forEach((row, index) => {
      const { isValid, errors, validatedRow } = validateRow(row, index + 2) // +2 because row 1 is header
      
      allErrors.push(...errors)
      
      if (isValid && validatedRow) {
        // Set the ownerId for this validated row
        validatedRow.ownerId = ownerId
        validRows.push(validatedRow)
      }
    })

    // If there are any errors, return them without importing anything
    if (allErrors.length > 0) {
      return NextResponse.json({
        success: false,
        importedCount: 0,
        totalRows: rows.length,
        errors: allErrors
      } as ImportResult)
    }

    // Import valid rows in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdBuyers = await Promise.all(
        validRows.map(row => 
          tx.buyer.create({
            data: row
          })
        )
      )
      return createdBuyers
    })

    return NextResponse.json({
      success: true,
      importedCount: result.length,
      totalRows: rows.length,
      errors: []
    } as ImportResult)

  } catch (error) {
    console.error('Error importing buyers:', error)
    return NextResponse.json(
      { error: 'Failed to import buyers' },
      { status: 500 }
    )
  }
}
