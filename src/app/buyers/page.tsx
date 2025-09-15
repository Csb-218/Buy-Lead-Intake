import { BuyersPageClient } from '@/components/buyers/buyers-page-client'
import { prisma } from '@/lib/prisma'
import { City, PropertyType, BuyerStatus, Timeline } from '@/generated/prisma'
import { BuyerFilters, BuyersApiResponse } from '@/lib/types'

interface BuyersPageProps {
  searchParams: Promise<{
    search?: string
    city?: string
    propertyType?: string
    status?: string
    timeline?: string
    page?: string
    sortBy?: string
    sortOrder?: string
  }>
}

async function fetchBuyers(filters: BuyerFilters): Promise<BuyersApiResponse> {
  const {
    search = '',
    city,
    propertyType,
    status,
    timeline,
    page = 1,
    sortBy = 'updatedAt',
    sortOrder = 'desc'
  } = filters

  const limit = 10
  const offset = (page - 1) * limit

  // Build where clause
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
  if (city) where.city = city as City
  if (propertyType) where.propertyType = propertyType as PropertyType
  if (status) where.status = status as BuyerStatus
  if (timeline) where.timeline = timeline as Timeline

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

  return {
    buyers,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPreviousPage,
    }
  }
}

export default async function BuyersPage({ searchParams }: BuyersPageProps) {
  const params = await searchParams
  
  const filters: BuyerFilters = {
    search: params.search,
    city: params.city as City,
    propertyType: params.propertyType as PropertyType,
    status: params.status as BuyerStatus,
    timeline: params.timeline as Timeline,
    page: params.page ? parseInt(params.page) : 1,
    sortBy: params.sortBy,
    sortOrder: (params.sortOrder as 'asc' | 'desc') || 'desc',
  }

  const data = await fetchBuyers(filters)

  return (
    <BuyersPageClient 
      initialData={data}
      filters={filters}
    />
  )
}

