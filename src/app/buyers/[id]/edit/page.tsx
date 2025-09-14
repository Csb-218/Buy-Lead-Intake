import { notFound } from 'next/navigation'
import { BuyerEditForm } from '@/components/buyers/buyer-edit-form'
import { prisma } from '@/lib/prisma'

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
  const { id } = await params
  const buyer = await getBuyer(id)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Edit Buyer</h1>
          <p className="text-muted-foreground">
            Update {buyer.fullName}'s information
          </p>
        </div>

        <BuyerEditForm buyer={buyer} />
      </div>
    </div>
  )
}