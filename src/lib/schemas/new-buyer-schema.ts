import * as z from 'zod'
import { City, PropertyType, BHK, Purpose, Timeline, Source } from '@/generated/prisma'

export const newBuyerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z
      .email()
      .optional(),
    phone: z
      .string()
      .min(10, 'Phone number is required')
      .max(15, 'Phone number is too long')
      .regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
    city: z.enum(City),
    propertyType: z.enum(PropertyType),
    bhk: z.enum(BHK).optional(),
    purpose: z.enum(Purpose),
    budgetMin: z.number().min(0, 'Budget must be positive').optional(),
    budgetMax: z.number().min(0, 'Budget must be positive').optional(),
    timeline: z.enum(Timeline),
    source: z.enum(Source),
    notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
    tags: z.array(z.string().min(2, 'Tag must be at least 2 characters')).optional(),
  })
  .refine(
    (data) => {
      // BHK required for Apartment and Villa
      if (
        data.propertyType === PropertyType.Apartment ||
        data.propertyType === PropertyType.Villa
      ) {
        return data.bhk !== undefined
      }
      return true
    },
    {
      message: 'BHK is required for Apartment and Villa property types',
      path: ['bhk'],
    }
  )
  .refine(
    (data) => {
      // budgetMax >= budgetMin when both present
      if (data.budgetMin && data.budgetMax) {
        return data.budgetMax >= data.budgetMin
      }
      return true
    },
    {
      message: 'Maximum budget must be greater than or equal to minimum budget',
      path: ['budgetMax'],
    }
  )

export type NewBuyerFormValues = z.infer<typeof newBuyerSchema>