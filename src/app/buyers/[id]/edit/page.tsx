import { notFound, redirect } from 'next/navigation'
import { BuyerEditForm } from '@/components/buyers/buyer-edit-form'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { canAccessBuyer } from '@/lib/admin'

interface EditBuyerPageProps {
  params: Promise<{ id: string }>
}

async function getBuyer(id: string) {
  const buyer = await prisma.buyer.findUnique({
    where: { id }
  })

  if (!buyer) {
    notFound()
  }

  return buyer
}

export default async function EditBuyerPage({ params }: EditBuyerPageProps) {
  // Get authenticated user first
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
  
  const { id } = await params
  const buyer = await getBuyer(id)
  
  // Check if user can edit this specific buyer record
  if (!canAccessBuyer(user, buyer.ownerId, 'edit')) {
    redirect('/buyers') // Redirect users who can't edit this record
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Buyer</h1>
          <p className="text-muted-foreground">
            Update {buyer.fullName}&apos;s information
          </p>
        </div>

        <BuyerEditForm buyer={buyer} />
      </div>
    </div>
  )
}