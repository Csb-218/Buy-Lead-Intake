'use server'


import { prisma } from '@/lib/prisma'
import { newBuyerSchema, type NewBuyerFormValues } from '@/lib/schemas/new-buyer-schema'
import { BuyerStatus } from '@/generated/prisma'
import { revalidatePath } from 'next/cache'

// This would typically come from your auth system
// For now, we'll use a mock user ID in UUID format
const getCurrentUserId = async (): Promise<string> => {
  // TODO: Replace with actual auth logic
  return '00000000-0000-0000-0000-000000000000'
}

export async function createBuyer(data: NewBuyerFormValues) {
  try {
    // Validate the input data
    const validatedData = newBuyerSchema.parse(data)

    // Get current user ID
    const ownerId = await getCurrentUserId()

    // Create the buyer
    const newBuyer = await prisma.buyer.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email || null,
        phone: validatedData.phone,
        city: validatedData.city,
        propertyType: validatedData.propertyType,
        bhk: validatedData.bhk || null,
        purpose: validatedData.purpose,
        budgetMin: validatedData.budgetMin || null,
        budgetMax: validatedData.budgetMax || null,
        timeline: validatedData.timeline,
        source: validatedData.source,
        status: BuyerStatus.New,
        notes: validatedData.notes || null,
        tags: validatedData.tags || [],
        ownerId,
      },
    })

    // Create a history entry for the buyer creation
    await prisma.buyerHistory.create({
      data: {
        buyerId: newBuyer.id,
        changedBy: ownerId,
        diff: {
          action: 'created',
          data: {
            fullName: newBuyer.fullName,
            email: newBuyer.email,
            phone: newBuyer.phone,
            city: newBuyer.city,
            propertyType: newBuyer.propertyType,
            bhk: newBuyer.bhk,
            purpose: newBuyer.purpose,
            budgetMin: newBuyer.budgetMin,
            budgetMax: newBuyer.budgetMax,
            timeline: newBuyer.timeline,
            source: newBuyer.source,
            status: newBuyer.status,
            notes: newBuyer.notes,
            tags: newBuyer.tags,
          },
        },
      },
    })

    // Revalidate the buyers page to show the new buyer
    revalidatePath('/buyers')

    return { success: true, buyerId: newBuyer.id }
  } catch (error) {
    console.error('Error creating buyer:', error)
    
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    
    return { success: false, error: 'Failed to create buyer' }
  }
}

export async function updateBuyer(id: string, data: NewBuyerFormValues) {
  try {
     const response = await fetch(`/api/buyers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          email: data.email || null,
          budgetMin: data.budgetMin || null,
          budgetMax: data.budgetMax || null,
          notes: data.notes || null,
        }),
      })

      if (!response.ok) {
        return { success: false, error: 'Failed to update buyer' }
      }
      revalidatePath('/buyers')
      
  }
  catch (error) {
    console.error('Error updating buyer:', error)
    return { success: false, error: 'Failed to update buyer' }
  }
}