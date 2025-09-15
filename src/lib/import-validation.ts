import { City, PropertyType, BHK, Purpose, Timeline, Source, BuyerStatus } from '@/generated/prisma'

export interface ImportError {
  row: number
  field: string
  message: string
}

export interface BuyerCreateData {
  fullName: string
  email: string | null
  phone: string
  city: City
  propertyType: PropertyType
  bhk: BHK | null
  purpose: Purpose
  budgetMin: number | null
  budgetMax: number | null
  timeline: Timeline
  source: Source
  status: BuyerStatus
  notes: string | null
  tags: string[]
  ownerId: string
}

export function validateEnumValue<T>(value: string, enumObject: Record<string, T>): T | null {
  if (!value || value.trim().length === 0) {
    return null
  }
  
  const cleanValue = value.trim()
  const enumValues = Object.values(enumObject) as string[]
  const matchedValue = enumValues.find(enumValue => 
    enumValue.toLowerCase() === cleanValue.toLowerCase()
  )
  return matchedValue ? (matchedValue as T) : null
}

export function validateRow(row: Record<string, string>, rowIndex: number): {
  isValid: boolean
  errors: ImportError[]
  validatedRow: BuyerCreateData | null
} {
  const errors: ImportError[] = []
  const validatedRow: Partial<BuyerCreateData> = {}

  // Required fields validation
  if (!row.fullName || row.fullName.trim().length === 0) {
    errors.push({ row: rowIndex, field: 'fullName', message: 'Full name is required' })
  } else if (row.fullName.length > 80) {
    errors.push({ row: rowIndex, field: 'fullName', message: 'Full name must be 80 characters or less' })
  } else {
    validatedRow.fullName = row.fullName.trim()
  }

  if (!row.phone || row.phone.trim().length === 0) {
    errors.push({ row: rowIndex, field: 'phone', message: 'Phone is required' })
  } else if (row.phone.length > 15) {
    errors.push({ row: rowIndex, field: 'phone', message: 'Phone must be 15 characters or less' })
  } else {
    validatedRow.phone = row.phone.trim()
  }

  // Optional email validation
  if (row.email && row.email.trim().length > 0) {
    if (row.email.length > 255) {
      errors.push({ row: rowIndex, field: 'email', message: 'Email must be 255 characters or less' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: rowIndex, field: 'email', message: 'Invalid email format' })
    } else {
      validatedRow.email = row.email.trim()
    }
  } else {
    validatedRow.email = null
  }

  // City validation (required)
  if (!row.city) {
    errors.push({ row: rowIndex, field: 'city', message: 'City is required' })
  } else {
    const validatedCity = validateEnumValue(row.city, City)
    if (!validatedCity) {
      errors.push({ 
        row: rowIndex, 
        field: 'city', 
        message: `Invalid city. Valid values: ${Object.values(City).join(', ')}` 
      })
    } else {
      validatedRow.city = validatedCity
    }
  }

  // PropertyType validation (required)
  if (!row.propertyType) {
    errors.push({ row: rowIndex, field: 'propertyType', message: 'Property type is required' })
  } else {
    const validatedPropertyType = validateEnumValue(row.propertyType, PropertyType)
    if (!validatedPropertyType) {
      errors.push({ 
        row: rowIndex, 
        field: 'propertyType', 
        message: `Invalid property type. Valid values: ${Object.values(PropertyType).join(', ')}` 
      })
    } else {
      validatedRow.propertyType = validatedPropertyType
    }
  }

  // BHK validation (optional)
  if (row.bhk && row.bhk.trim().length > 0) {
    const validatedBhk = validateEnumValue(row.bhk, BHK)
    if (!validatedBhk) {
      errors.push({ 
        row: rowIndex, 
        field: 'bhk', 
        message: `Invalid BHK. Valid values: ${Object.values(BHK).join(', ')}` 
      })
    } else {
      validatedRow.bhk = validatedBhk
    }
  } else {
    validatedRow.bhk = null
  }

  // Purpose validation (required)
  if (!row.purpose) {
    errors.push({ row: rowIndex, field: 'purpose', message: 'Purpose is required' })
  } else {
    const validatedPurpose = validateEnumValue(row.purpose, Purpose)
    if (!validatedPurpose) {
      errors.push({ 
        row: rowIndex, 
        field: 'purpose', 
        message: `Invalid purpose. Valid values: ${Object.values(Purpose).join(', ')}` 
      })
    } else {
      validatedRow.purpose = validatedPurpose
    }
  }

  // Budget validation (optional)
  if (row.budgetMin && row.budgetMin.trim().length > 0) {
    const budgetMin = parseInt(row.budgetMin)
    if (isNaN(budgetMin) || budgetMin < 0) {
      errors.push({ row: rowIndex, field: 'budgetMin', message: 'Budget min must be a valid positive number' })
    } else {
      validatedRow.budgetMin = budgetMin
    }
  } else {
    validatedRow.budgetMin = null
  }

  if (row.budgetMax && row.budgetMax.trim().length > 0) {
    const budgetMax = parseInt(row.budgetMax)
    if (isNaN(budgetMax) || budgetMax < 0) {
      errors.push({ row: rowIndex, field: 'budgetMax', message: 'Budget max must be a valid positive number' })
    } else {
      validatedRow.budgetMax = budgetMax
    }
  } else {
    validatedRow.budgetMax = null
  }

  // Timeline validation (required)
  if (!row.timeline) {
    errors.push({ row: rowIndex, field: 'timeline', message: 'Timeline is required' })
  } else {
    const validatedTimeline = validateEnumValue(row.timeline, Timeline)
    if (!validatedTimeline) {
      errors.push({ 
        row: rowIndex, 
        field: 'timeline', 
        message: `Invalid timeline. Valid values: ${Object.values(Timeline).join(', ')}` 
      })
    } else {
      validatedRow.timeline = validatedTimeline
    }
  }

  // Source validation (required)
  if (!row.source) {
    errors.push({ row: rowIndex, field: 'source', message: 'Source is required' })
  } else {
    const validatedSource = validateEnumValue(row.source, Source)
    if (!validatedSource) {
      errors.push({ 
        row: rowIndex, 
        field: 'source', 
        message: `Invalid source. Valid values: ${Object.values(Source).join(', ')}` 
      })
    } else {
      validatedRow.source = validatedSource
    }
  }

  // Notes validation (optional)
  if (row.notes && row.notes.trim().length > 0) {
    if (row.notes.length > 1000) {
      errors.push({ row: rowIndex, field: 'notes', message: 'Notes must be 1000 characters or less' })
    } else {
      validatedRow.notes = row.notes.trim()
    }
  } else {
    validatedRow.notes = null
  }

  // Tags validation (optional)
  if (row.tags && row.tags.trim().length > 0) {
    try {
      const tags = row.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      validatedRow.tags = tags
    } catch {
      errors.push({ row: rowIndex, field: 'tags', message: 'Tags should be comma-separated values' })
    }
  } else {
    validatedRow.tags = []
  }

  // Status validation (optional, defaults to New)
  if (row.status && row.status.trim().length > 0) {
    const validatedStatus = validateEnumValue(row.status, BuyerStatus)
    if (!validatedStatus) {
      errors.push({ 
        row: rowIndex, 
        field: 'status', 
        message: `Invalid status. Valid values: ${Object.values(BuyerStatus).join(', ')}` 
      })
    } else {
      validatedRow.status = validatedStatus
    }
  } else {
    validatedRow.status = BuyerStatus.New
  }

  // Return null if validation failed, otherwise return the complete validated row
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      validatedRow: null
    }
  }
  
  // Ensure all required fields are present
  const completeRow: BuyerCreateData = {
    fullName: validatedRow.fullName as string,
    email: validatedRow.email as string | null,
    phone: validatedRow.phone as string,
    city: validatedRow.city as City,
    propertyType: validatedRow.propertyType as PropertyType,
    bhk: validatedRow.bhk as BHK | null,
    purpose: validatedRow.purpose as Purpose,
    budgetMin: validatedRow.budgetMin as number | null,
    budgetMax: validatedRow.budgetMax as number | null,
    timeline: validatedRow.timeline as Timeline,
    source: validatedRow.source as Source,
    status: validatedRow.status as BuyerStatus,
    notes: validatedRow.notes as string | null,
    tags: validatedRow.tags as string[],
    ownerId: '' // Will be set in the main function
  }
  
  return {
    isValid: true,
    errors: [],
    validatedRow: completeRow
  }
}

export function parseCSV(csvText: string): {
  headers: string[]
  rows: Record<string, string>[]
  errors: string[]
} {
  const errors: string[] = []
  const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0)

  if (lines.length === 0) {
    errors.push('File is empty')
    return { headers: [], rows: [], errors }
  }

  if (lines.length > 201) { // 200 data rows + 1 header row
    errors.push('File cannot have more than 200 data rows')
    return { headers: [], rows: [], errors }
  }

  // Parse CSV header
  const [headerLine, ...dataLines] = lines
  const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''))
  
  // Expected headers
  const expectedHeaders = [
    'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose', 
    'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
  ]

  // Validate headers
  const missingHeaders = expectedHeaders.filter(header => !headers.includes(header))
  if (missingHeaders.length > 0) {
    errors.push(`Missing required headers: ${missingHeaders.join(', ')}`)
    return { headers: [], rows: [], errors }
  }

  // Parse data rows
  const rows = dataLines.map(line => {
    // Handle CSV parsing more robustly
    let values: string[]
    if (line.includes('"')) {
      // Simple CSV parser for quoted fields
      const regex = /(?:,|^)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?=,|$)/g
      values = []
      let match
      while ((match = regex.exec(line)) !== null) {
        values.push((match[1] || match[2] || '').replace(/""/g, '"').trim())
      }
    } else {
      values = line.split(',').map(v => v.trim())
    }
    
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim()
    })
    
    return row
  })

  return { headers, rows, errors }
}