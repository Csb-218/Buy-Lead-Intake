import { redirect } from 'next/navigation'
import { NewBuyerForm } from '@/components/buyers/new-buyer-form'
import { createClient } from '@/lib/supabase/server'

export default async function NewBuyerPage() {
  // Check authentication
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }
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