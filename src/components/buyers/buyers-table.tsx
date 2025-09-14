'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BuyerListItem, formatBudget, getStatusColor, formatTimeline } from '@/lib/types'

interface BuyersTableProps {
  buyers: BuyerListItem[]
}

export function BuyersTable({ buyers }: BuyersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentSort = params.get('sortBy')
    const currentOrder = params.get('sortOrder')
    
    if (currentSort === column) {
      params.set('sortOrder', currentOrder === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('sortBy', column)
      params.set('sortOrder', 'desc')
    }
    
    router.push(`/buyers?${params.toString()}`)
  }

  const handleView = (buyerId: string) => {
    router.push(`/buyers/${buyerId}`)
  }

  const handleEdit = (buyerId: string) => {
    router.push(`/buyers/${buyerId}/edit`)
  }

  if (buyers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No buyers found matching your criteria.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('fullName')}
              className="h-auto p-0 font-semibold"
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('city')}
              className="h-auto p-0 font-semibold"
            >
              City
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('propertyType')}
              className="h-auto p-0 font-semibold"
            >
              Property Type
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('timeline')}
              className="h-auto p-0 font-semibold"
            >
              Timeline
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('status')}
              className="h-auto p-0 font-semibold"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              onClick={() => handleSort('updatedAt')}
              className="h-auto p-0 font-semibold"
            >
              Updated
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {buyers.map((buyer) => (
          <TableRow key={buyer.id} className="hover:bg-muted/50">
            <TableCell>
              <div>
                <div className="font-medium">{buyer.fullName}</div>
                {buyer.email && (
                  <div className="text-sm text-muted-foreground">{buyer.email}</div>
                )}
              </div>
            </TableCell>
            <TableCell className="font-mono">{buyer.phone}</TableCell>
            <TableCell>{buyer.city}</TableCell>
            <TableCell>{buyer.propertyType}</TableCell>
            <TableCell className="text-sm">
              {formatBudget(buyer.budgetMin, buyer.budgetMax)}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {formatTimeline(buyer.timeline)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={`${getStatusColor(buyer.status)} text-xs`}>
                {buyer.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(buyer.updatedAt), 'MMM dd, yyyy')}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleView(buyer.id)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(buyer.id)}>
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}