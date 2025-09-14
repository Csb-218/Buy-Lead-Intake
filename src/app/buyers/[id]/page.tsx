import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Edit, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { formatBudget, getStatusColor, formatTimeline } from '@/lib/types'

interface BuyerPageProps {
  params: Promise<{ id: string }>
}

async function getBuyer(id: string) {
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
    notFound()
  }

  return buyer
}

export default async function BuyerPage({ params }: BuyerPageProps) {
  const { id } = await params
  const buyer = await getBuyer(id)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/buyers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buyers
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{buyer.fullName}</h1>
          <p className="text-muted-foreground">Buyer Details</p>
        </div>
        <Button asChild>
          <Link href={`/buyers/${buyer.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Primary contact details for {buyer.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-mono">{buyer.phone}</div>
                <div className="text-sm text-muted-foreground">Phone</div>
              </div>
            </div>
            {buyer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div>{buyer.email}</div>
                  <div className="text-sm text-muted-foreground">Email</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <div>{buyer.city}</div>
                <div className="text-sm text-muted-foreground">City</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              Property requirements and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium">{buyer.propertyType}</div>
              <div className="text-sm text-muted-foreground">Property Type</div>
            </div>
            {buyer.bhk && (
              <div>
                <div className="font-medium">{buyer.bhk}</div>
                <div className="text-sm text-muted-foreground">BHK</div>
              </div>
            )}
            <div>
              <div className="font-medium">{buyer.purpose}</div>
              <div className="text-sm text-muted-foreground">Purpose</div>
            </div>
            <div>
              <div className="font-medium">{formatBudget(buyer.budgetMin, buyer.budgetMax)}</div>
              <div className="text-sm text-muted-foreground">Budget</div>
            </div>
            <div>
              <Badge variant="outline">
                {formatTimeline(buyer.timeline)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Timeline</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Details</CardTitle>
            <CardDescription>
              Current status and additional information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge className={getStatusColor(buyer.status)}>
                {buyer.status}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Status</div>
            </div>
            <div>
              <div className="font-medium">{buyer.source}</div>
              <div className="text-sm text-muted-foreground">Source</div>
            </div>
            {buyer.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {buyer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Tags</div>
              </div>
            )}
            {buyer.notes && (
              <div>
                <div className="text-sm whitespace-pre-wrap">{buyer.notes}</div>
                <div className="text-sm text-muted-foreground mt-1">Notes</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>
              Important dates and history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-medium">
                {format(new Date(buyer.createdAt), 'PPP p')}
              </div>
              <div className="text-sm text-muted-foreground">Created</div>
            </div>
            <div>
              <div className="font-medium">
                {format(new Date(buyer.updatedAt), 'PPP p')}
              </div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}