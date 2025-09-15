'use client'

import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BuyerFilters } from '@/lib/types'

interface CsvExportProps {
  filters: BuyerFilters
  totalCount: number
}

export function CsvExport({ filters, totalCount }: CsvExportProps) {
  const [exporting, setExporting] = useState(false)

  const buildExportUrl = () => {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('search', filters.search)
    if (filters.city) params.set('city', filters.city)
    if (filters.propertyType) params.set('propertyType', filters.propertyType)
    if (filters.status) params.set('status', filters.status)
    if (filters.timeline) params.set('timeline', filters.timeline)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)

    return `/api/buyers/export?${params.toString()}`
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const url = buildExportUrl()
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a')
      link.href = url
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  const getFilterDescription = () => {
    const activeFilters = []
    if (filters.search) activeFilters.push(`Search: "${filters.search}"`)
    if (filters.city) activeFilters.push(`City: ${filters.city}`)
    if (filters.propertyType) activeFilters.push(`Property: ${filters.propertyType}`)
    if (filters.status) activeFilters.push(`Status: ${filters.status}`)
    if (filters.timeline) activeFilters.push(`Timeline: ${filters.timeline}`)
    
    if (activeFilters.length === 0) {
      return 'All buyers will be exported (no filters applied)'
    }
    
    return `Filtered results will be exported (${activeFilters.join(', ')})`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Buyers to CSV
        </CardTitle>
        <CardDescription>
          Export the current filtered list of buyers to a CSV file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <FileText className="h-8 w-8 text-blue-600" />
          <div className="flex-1">
            <h4 className="font-medium text-blue-900">Export Summary</h4>
            <p className="text-sm text-blue-700">
              {totalCount} buyer{totalCount !== 1 ? 's' : ''} ready for export
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {getFilterDescription()}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Export Details:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• All visible buyer information will be included</li>
            <li>• Current filters and search criteria will be applied</li>
            <li>• Sort order will be preserved</li>
            <li>• File format: CSV (Comma Separated Values)</li>
            <li>• File name: buyers-export-YYYY-MM-DD.csv</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleExport}
            disabled={exporting || totalCount === 0}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          
          {totalCount === 0 && (
            <p className="text-sm text-gray-500 py-2">
              No buyers to export with current filters
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}