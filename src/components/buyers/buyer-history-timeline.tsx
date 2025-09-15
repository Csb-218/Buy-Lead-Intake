'use client'

import { format, formatDistanceToNow } from 'date-fns'
import { History, Calendar, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BuyerHistory } from '@/generated/prisma'

interface BuyerHistoryTimelineProps {
  history: BuyerHistory[]
  buyerId: string
}

interface HistoryChange {
  field: string
  oldValue: any
  newValue: any
}

const getFieldDisplayName = (field: string): string => {
  const fieldNames: Record<string, string> = {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    city: 'City',
    propertyType: 'Property Type',
    bhk: 'BHK',
    purpose: 'Purpose',
    budgetMin: 'Budget Min',
    budgetMax: 'Budget Max',
    timeline: 'Timeline',
    source: 'Source',
    status: 'Status',
    notes: 'Notes',
    tags: 'Tags',
  }
  return fieldNames[field] || field
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'Not set'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

const getChangeIcon = (field: string) => {
  switch (field) {
    case 'status':
      return '🔄'
    case 'phone':
    case 'email':
      return '📞'
    case 'city':
      return '📍'
    case 'budgetMin':
    case 'budgetMax':
      return '💰'
    case 'notes':
      return '📝'
    case 'tags':
      return '🏷️'
    default:
      return '✏️'
  }
}

export function BuyerHistoryTimeline({ history, buyerId }: BuyerHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-indigo-600" />
            Change History
          </CardTitle>
          <CardDescription>
            Track all changes made to this buyer record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No changes recorded yet</p>
            <p className="text-sm text-gray-400">Changes will appear here when the buyer information is updated</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-indigo-600" />
          Change History
        </CardTitle>
        <CardDescription>
          Last {history.length} changes made to this buyer record
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {history.map((record, index) => {
            const changes = record.diff as unknown as Record<string, HistoryChange>
            const changeEntries = Object.entries(changes)
            
            return (
              <div key={record.id} className="relative">
                {/* Timeline connector */}
                {index < history.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}
                
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                  </div>
                  
                  {/* Change content */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            User ID: {record.changedBy.slice(0, 8)}...
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {format(new Date(record.changedAt), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(record.changedAt), 'h:mm a')} • {formatDistanceToNow(new Date(record.changedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Changes */}
                      <div className="space-y-3">
                        {changeEntries.map(([field, change]) => (
                          <div key={field} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-lg">{getChangeIcon(field)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {getFieldDisplayName(field)}
                                </span>
                                <Badge variant="outline" className="text-xs px-2 py-0">
                                  Updated
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-mono text-xs max-w-[120px] truncate" title={formatValue(change.oldValue)}>
                                  {formatValue(change.oldValue)}
                                </span>
                                <ArrowRight className="h-3 w-3 text-gray-400" />
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-mono text-xs max-w-[120px] truncate" title={formatValue(change.newValue)}>
                                  {formatValue(change.newValue)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Summary */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          {changeEntries.length} field{changeEntries.length > 1 ? 's' : ''} changed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <History className="h-4 w-4" />
              Showing last {history.length} changes
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}