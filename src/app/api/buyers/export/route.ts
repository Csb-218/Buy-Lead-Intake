import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { City, PropertyType, BuyerStatus, Timeline } from '@/generated/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get search and filter parameters (same as the main buyers page)
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city') as City | null
    const propertyType = searchParams.get('propertyType') as PropertyType | null
    const status = searchParams.get('status') as BuyerStatus | null
    const timeline = searchParams.get('timeline') as Timeline | null
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause (same logic as the main buyers page)
    const where: Record<string, unknown> = {}
    
    // Search functionality
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Filters
    if (city) where.city = city
    if (propertyType) where.propertyType = propertyType
    if (status) where.status = status
    if (timeline) where.timeline = timeline

    // Get all buyers matching the filters (no pagination for export)
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      },
      select: {
        fullName: true,
        email: true,
        phone: true,
        city: true,
        propertyType: true,
        bhk: true,
        purpose: true,
        budgetMin: true,
        budgetMax: true,
        timeline: true,
        source: true,
        notes: true,
        tags: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Convert data to CSV format
    const headers = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
      'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
    ]

    const csvRows = [
      headers.join(','), // Header row
      ...buyers.map(buyer => {
        const row = headers.map(header => {
          let value = buyer[header as keyof typeof buyer]
          
          // Handle special cases
          if (header === 'tags' && Array.isArray(value)) {
            value = value.join(',')
          }
          
          // Handle null/undefined values
          if (value === null || value === undefined) {
            value = ''
          }
          
          // Escape values that contain commas or quotes
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          
          return stringValue
        })
        return row.join(',')
      })
    ]

    const csvContent = csvRows.join('\n')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `buyers-export-${timestamp}.csv`

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (error) {
    console.error('Error exporting buyers:', error)
    return NextResponse.json(
      { error: 'Failed to export buyers' },
      { status: 500 }
    )
  }
}