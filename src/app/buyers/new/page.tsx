import { NewBuyerForm } from '@/components/buyers/new-buyer-form'

export default function NewBuyerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Buyer</h1>
          <p className="text-muted-foreground">
            Add a new buyer to the system
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <NewBuyerForm />
      </div>
    </div>
  )
}