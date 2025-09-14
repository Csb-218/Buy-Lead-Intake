'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { City, PropertyType, BuyerStatus, Timeline } from '@/generated/prisma'
import { BuyerFilters } from '@/lib/types'

interface BuyersFiltersProps {
  filters: BuyerFilters
}

export function BuyersFilters({ filters }: BuyersFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(filters.search || '')
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  // Update searchValue when filters.search changes (but don't trigger search)
  useEffect(() => {
    if (!hasUserInteracted) {
      setSearchValue(filters.search || '')
    }
  }, [filters.search, hasUserInteracted])

  // Debounced search
  const updateSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset to first page when searching
    router.push(`/buyers?${params.toString()}`)
  }, [searchParams, router])

  useEffect(() => {
    if (!hasUserInteracted) return

    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        updateSearch(searchValue)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchValue, filters.search, updateSearch, hasUserInteracted])

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to first page when filtering
    router.push(`/buyers?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchValue('')
    setHasUserInteracted(false)
    router.push('/buyers')
  }

  const hasActiveFilters = Boolean(
    filters.search || 
    filters.city || 
    filters.propertyType || 
    filters.status || 
    filters.timeline
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchValue}
            onChange={(e) => {
              setHasUserInteracted(true)
              setSearchValue(e.target.value)
            }}
            className="pl-9"
          />
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="h-10"
          >
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={filters.city || 'all'}
          onValueChange={(value) => updateFilter('city', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {Object.values(City).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.propertyType || 'all'}
          onValueChange={(value) => updateFilter('propertyType', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Property Types</SelectItem>
            {Object.values(PropertyType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(BuyerStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.timeline || 'all'}
          onValueChange={(value) => updateFilter('timeline', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Timelines</SelectItem>
            <SelectItem value={Timeline.ZeroToThreeMonths}>0-3 months</SelectItem>
            <SelectItem value={Timeline.ThreeToSixMonths}>3-6 months</SelectItem>
            <SelectItem value={Timeline.MoreThanSixMonths}>6+ months</SelectItem>
            <SelectItem value={Timeline.Exploring}>Exploring</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}