import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BuyersTable } from '@/components/buyers/buyers-table'
import { BuyersFilters } from '@/components/buyers/buyers-filters'
import { BuyersPagination } from '@/components/buyers/buyers-pagination'
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
  const where: any = {}
  
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyers</h1>
          <p className="text-muted-foreground">
            Manage and track your property buyers
          </p>
        </div>
        <div>
          <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Link href="/buyers/new">
              <Plus className="h-4 w-4 mr-2" />
              New Buyer
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <BuyersFilters filters={filters} />
        
        <div className="rounded-md border">
          <BuyersTable buyers={data.buyers} />
        </div>

        <BuyersPagination pagination={data.pagination} />
      </div>
    </div>
  )
}

// Loading component for Suspense
function BuyersLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}