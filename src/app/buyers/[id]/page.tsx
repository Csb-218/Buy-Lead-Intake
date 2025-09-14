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
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href={`/buyers/${buyer.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget Range</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatBudget(buyer.budgetMin, buyer.budgetMax)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Property Type</p>
                    <p className="text-lg font-semibold text-gray-900">{buyer.propertyType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Timeline</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTimeline(buyer.timeline)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Purpose</p>
                    <p className="text-lg font-semibold text-gray-900">{buyer.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Phone Number</p>
                        <p className="font-mono text-gray-900">{buyer.phone}</p>
                        <Button size="sm" variant="ghost" className="h-6 px-2 mt-1">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                    
                    {buyer.email && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">Email Address</p>
                          <p className="text-gray-900">{buyer.email}</p>
                          <Button size="sm" variant="ghost" className="h-6 px-2 mt-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-gray-900">{buyer.city}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requirements & Details */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5 text-green-600" />
                    Property Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Property Type</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{buyer.propertyType}</p>
                      </div>
                      
                      {buyer.bhk && (
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-600">BHK Configuration</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">{buyer.bhk}</p>
                        </div>
                      )}
                      
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Purpose</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{buyer.purpose}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <IndianRupee className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Budget Range</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatBudget(buyer.budgetMin, buyer.budgetMax)}
                        </p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Timeline</span>
                        </div>
                        <Badge variant="outline" className="text-sm">
                          {formatTimeline(buyer.timeline)}
                        </Badge>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Source</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{buyer.source}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              {(buyer.tags.length > 0 || buyer.notes) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                      Additional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {buyer.tags.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {buyer.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-medium">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {buyer.notes && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Notes</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{buyer.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <History className="h-5 w-5 text-indigo-600" />
                    Timeline & History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Created On</p>
                        <p className="text-gray-900 font-medium">
                          {format(new Date(buyer.createdAt), 'PPPP')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(buyer.createdAt), 'p')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">Last Updated</p>
                        <p className="text-gray-900 font-medium">
                          {format(new Date(buyer.updatedAt), 'PPPP')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(buyer.updatedAt), 'p')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
