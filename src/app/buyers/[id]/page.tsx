import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  Building,
  IndianRupee,
  User,
  Tag,
  MessageSquare,
  History,
  ExternalLink,
  Save,
  X,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/prisma'
import { formatBudget, getStatusColor, formatTimeline } from '@/lib/types'
import { BuyerEditableView } from '@/components/buyers/buyer-editable-view'
import { BuyerHistoryTimeline } from '@/components/buyers/buyer-history-timeline'

interface BuyerPageProps {
  params: Promise<{ id: string }>
}

async function getBuyer(id: string) {
  const buyer = await prisma.buyer.findUnique({
    where: { id },
    include: {
      history: {
        orderBy: { changedAt: 'desc' },
        take: 5
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100">
                <Link href="/buyers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {buyer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{buyer.fullName}</h1>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(buyer.status)} border-0`}>
                        {buyer.status}
                      </Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{buyer.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Editable Buyer Information */}
          <BuyerEditableView buyer={buyer} />
          
          {/* History Timeline */}
          <div className="mt-8">
            <BuyerHistoryTimeline history={buyer.history} buyerId={buyer.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
