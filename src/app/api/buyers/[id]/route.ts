import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: { changedAt: 'desc' },
          take: 10
        }
      }
    })

    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyer' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const { updatedAt: clientUpdatedAt, ...updateData } = data
    
    // Get current buyer for concurrency check
    const currentBuyer = await prisma.buyer.findUnique({
      where: { id }
    })
    
    if (!currentBuyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      )
    }
    
    // Check for concurrent updates
    if (clientUpdatedAt && new Date(clientUpdatedAt).getTime() !== currentBuyer.updatedAt.getTime()) {
      return NextResponse.json(
        { error: 'Record has been modified by another user. Please refresh and try again.' },
        { status: 409 }
      )
    }
    
    // Calculate changes for history
    const changes: Record<string, { oldValue: unknown; newValue: unknown }> = {}
    const fieldsToTrack = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
      'budgetMin', 'budgetMax', 'timeline', 'source', 'status', 'notes', 'tags'
    ]
    
    fieldsToTrack.forEach(field => {
      const oldValue = (currentBuyer as unknown as Record<string, unknown>)[field]
      const newValue = updateData[field]
      
      // Compare values (handle arrays and nulls properly)
      let hasChanged = false
      if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        hasChanged = JSON.stringify(oldValue.sort()) !== JSON.stringify(newValue.sort())
      } else {
        hasChanged = oldValue !== newValue
      }
      
      if (hasChanged) {
        changes[field] = { oldValue, newValue }
      }
    })
    
    // Update buyer and create history record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedBuyer = await tx.buyer.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        }
      })
      
      // Create history record if there are changes
      if (Object.keys(changes).length > 0) {
        await tx.buyerHistory.create({
          data: {
            buyerId: id,
            changedBy: '00000000-0000-4000-8000-000000000001', // TODO: Get from auth context
            diff: JSON.parse(JSON.stringify(changes)),
          }
        })
      }
      
      return updatedBuyer
    })

    return NextResponse.json({ buyer: result })
  } catch (error) {
    console.error('Error updating buyer:', error)
    return NextResponse.json(
      { error: 'Failed to update buyer' },
      { status: 500 }
    )
  }
}
