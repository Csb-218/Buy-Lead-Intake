import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { City, PropertyType, BuyerStatus, Timeline } from '@/generated/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get search and filter parameters
    const search = searchParams.get('search') || ''
    const city = searchParams.get('city') as City | null
    const propertyType = searchParams.get('propertyType') as PropertyType | null
    const status = searchParams.get('status') as BuyerStatus | null
    const timeline = searchParams.get('timeline') as Timeline | null
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: Record<string, unknown> = {}
    
    // Search functionality - debounced search by fullName, phone, email
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

    // Get total count for pagination
    const totalCount = await prisma.buyer.count({ where })
    
    // Get buyers with pagination and sorting
    const buyers = await prisma.buyer.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        city: true,
        propertyType: true,
        budgetMin: true,
        budgetMax: true,
        timeline: true,
        status: true,
        ownerId: true,
        updatedAt: true,
        createdAt: true,
      }
    })

    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPreviousPage = page > 1

    return NextResponse.json({
      buyers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
      }
    })

  } catch (error) {
    console.error('Error fetching buyers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    )
  }
}