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
    
    const buyer = await prisma.buyer.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({ buyer })
  } catch (error) {
    console.error('Error updating buyer:', error)
    return NextResponse.json(
      { error: 'Failed to update buyer' },
      { status: 500 }
    )
  }
}