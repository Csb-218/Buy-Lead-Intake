import { City, PropertyType, BuyerStatus, Timeline } from '@/generated/prisma'

export interface BuyerListItem {
  id: string
  fullName: string
  phone: string
  email: string | null
  city: City
  propertyType: PropertyType
  budgetMin: number | null
  budgetMax: number | null
  timeline: Timeline
  status: BuyerStatus
  ownerId: string
  updatedAt: Date
  createdAt: Date
}

export interface BuyerFilters {
  search?: string
  city?: City
  propertyType?: PropertyType
  status?: BuyerStatus
  timeline?: Timeline
  page?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface BuyersApiResponse {
  buyers: BuyerListItem[]
  pagination: PaginationInfo
}

// Helper functions
export const formatBudget = (min?: number | null, max?: number | null): string => {
  if (!min && !max) return 'Not specified'
  if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
  if (min) return `₹${min.toLocaleString()}+`
  if (max) return `Up to ₹${max.toLocaleString()}`
  return 'Not specified'
}

export const getStatusColor = (status: BuyerStatus): string => {
  const colors = {
    [BuyerStatus.New]: 'bg-blue-100 text-blue-800',
    [BuyerStatus.Qualified]: 'bg-green-100 text-green-800',
    [BuyerStatus.Contacted]: 'bg-yellow-100 text-yellow-800',
    [BuyerStatus.Visited]: 'bg-purple-100 text-purple-800',
    [BuyerStatus.Negotiation]: 'bg-orange-100 text-orange-800',
    [BuyerStatus.Converted]: 'bg-emerald-100 text-emerald-800',
    [BuyerStatus.Dropped]: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const formatTimeline = (timeline: Timeline): string => {
  const labels = {
    [Timeline.ZeroToThreeMonths]: '0-3 months',
    [Timeline.ThreeToSixMonths]: '3-6 months',
    [Timeline.MoreThanSixMonths]: '6+ months',
    [Timeline.Exploring]: 'Exploring',
  }
  return labels[timeline] || timeline
}