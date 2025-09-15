'use client'

import { useState, useEffect } from 'react'
import { Plus, FileUp } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BuyersTable } from './buyers-table'
import { BuyersFilters } from './buyers-filters'
import { BuyersPagination } from './buyers-pagination'
import { ImportExportDialog } from './import-export-dialog'
import { useAuth } from '@/components/auth-provider'
import { BuyerFilters, BuyersApiResponse } from '@/lib/types'
import { City, PropertyType, BuyerStatus, Timeline } from '@/generated/prisma'

interface BuyersPageClientProps {
  initialData: BuyersApiResponse
  filters: BuyerFilters
}

export function BuyersPageClient({ initialData }: BuyersPageClientProps) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const { user } = useAuth()
  const searchParams = useSearchParams()

  // Get current user ID from auth context
  const ownerId = user?.id || ""

  // Build current filters from URL params
  const currentFilters: BuyerFilters = {
    search: searchParams.get('search') || undefined,
    city: searchParams.get('city') as City || undefined,
    propertyType: searchParams.get('propertyType') as PropertyType || undefined,
    status: searchParams.get('status') as BuyerStatus || undefined,
    timeline: searchParams.get('timeline') as Timeline || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    sortBy: searchParams.get('sortBy') || 'updatedAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  }

  // Fetch buyers data based on current filters
  const fetchBuyers = async (filters: BuyerFilters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.city) params.set('city', filters.city)
      if (filters.propertyType) params.set('propertyType', filters.propertyType)
      if (filters.status) params.set('status', filters.status)
      if (filters.timeline) params.set('timeline', filters.timeline)
      if (filters.page) params.set('page', filters.page.toString())
      if (filters.sortBy) params.set('sortBy', filters.sortBy)
      if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)

      const response = await fetch(`/api/buyers?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch buyers')
      }
      const newData: BuyersApiResponse = await response.json()
      setData(newData)
    } catch (error) {
      console.error('Error fetching buyers:', error)
      // You might want to show an error toast here
    } finally {
      setLoading(false)
    }
  }

  // Effect to refetch data when URL params change (when filters are applied)
  useEffect(() => {
    const currentParams = searchParams.toString()
    // Only refetch if there are search params (meaning filters have been applied)
    // This prevents infinite loops and only fetches when user actually changes filters
    if (currentParams) {
      fetchBuyers(currentFilters)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]) // Only depend on the search params string

  const handleImportComplete = () => {
    // Refetch the current data after successful import
    fetchBuyers(currentFilters)
  }

  const openImportDialog = () => {
    if (!user) {
      alert('Please log in to import/export buyers')
      return
    }
    setShowImportExport(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buyers</h1>
          <p className="text-muted-foreground">
            Manage and track your property buyers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={openImportDialog}
            disabled={!user}
            className="flex items-center gap-2"
          >
            <FileUp className="h-4 w-4" />
            Import / Export
          </Button>
          <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Link href="/buyers/new">
              <Plus className="h-4 w-4 mr-2" />
              New Buyer
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <BuyersFilters filters={currentFilters} />
        
        <div className="rounded-md border">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading buyers...</p>
              </div>
            </div>
          ) : (
            <BuyersTable buyers={data.buyers} />
          )}
        </div>

        {!loading && <BuyersPagination pagination={data.pagination} />}
      </div>

      <ImportExportDialog
        open={showImportExport}
        onOpenChange={setShowImportExport}
        filters={currentFilters}
        totalCount={data.pagination.totalCount}
        ownerId={ownerId}
        onImportComplete={handleImportComplete}
      />
    </div>
  )
}