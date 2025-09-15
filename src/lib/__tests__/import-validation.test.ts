import { describe, it, expect } from 'vitest'
import { validateEnumValue, validateRow, parseCSV } from '../import-validation'
import { City, PropertyType, BHK, Purpose, Timeline, Source, BuyerStatus } from '@/generated/prisma'

describe('validateEnumValue', () => {
  it('should validate BuyerStatus enum values correctly', () => {
    expect(validateEnumValue('New', BuyerStatus)).toBe('New')
    expect(validateEnumValue('new', BuyerStatus)).toBe('New')
    expect(validateEnumValue('NEW', BuyerStatus)).toBe('New')
    expect(validateEnumValue('Qualified', BuyerStatus)).toBe('Qualified')
    expect(validateEnumValue('qualified', BuyerStatus)).toBe('Qualified')
    expect(validateEnumValue('QUALIFIED', BuyerStatus)).toBe('Qualified')
    expect(validateEnumValue('Invalid', BuyerStatus)).toBeNull()
    expect(validateEnumValue('', BuyerStatus)).toBeNull()
    expect(validateEnumValue('  ', BuyerStatus)).toBeNull()
  })

  it('should validate City enum values correctly', () => {
    expect(validateEnumValue('Chandigarh', City)).toBe('Chandigarh')
    expect(validateEnumValue('chandigarh', City)).toBe('Chandigarh')
    expect(validateEnumValue('CHANDIGARH', City)).toBe('Chandigarh')
    expect(validateEnumValue('Mohali', City)).toBe('Mohali')
    expect(validateEnumValue('InvalidCity', City)).toBeNull()
  })

  it('should validate PropertyType enum values correctly', () => {
    expect(validateEnumValue('Apartment', PropertyType)).toBe('Apartment')
    expect(validateEnumValue('apartment', PropertyType)).toBe('Apartment')
    expect(validateEnumValue('Villa', PropertyType)).toBe('Villa')
    expect(validateEnumValue('InvalidType', PropertyType)).toBeNull()
  })

  it('should validate BHK enum values correctly', () => {
    expect(validateEnumValue('Two', BHK)).toBe('Two')
    expect(validateEnumValue('two', BHK)).toBe('Two')
    expect(validateEnumValue('Three', BHK)).toBe('Three')
    expect(validateEnumValue('InvalidBHK', BHK)).toBeNull()
  })

  it('should validate Purpose enum values correctly', () => {
    expect(validateEnumValue('Buy', Purpose)).toBe('Buy')
    expect(validateEnumValue('buy', Purpose)).toBe('Buy')
    expect(validateEnumValue('Rent', Purpose)).toBe('Rent')
    expect(validateEnumValue('InvalidPurpose', Purpose)).toBeNull()
  })

  it('should validate Timeline enum values correctly', () => {
    expect(validateEnumValue('ZeroToThreeMonths', Timeline)).toBe('ZeroToThreeMonths')
    expect(validateEnumValue('zerotothreemonths', Timeline)).toBe('ZeroToThreeMonths')
    expect(validateEnumValue('ThreeToSixMonths', Timeline)).toBe('ThreeToSixMonths')
    expect(validateEnumValue('InvalidTimeline', Timeline)).toBeNull()
  })

  it('should validate Source enum values correctly', () => {
    expect(validateEnumValue('Website', Source)).toBe('Website')
    expect(validateEnumValue('website', Source)).toBe('Website')
    expect(validateEnumValue('Referral', Source)).toBe('Referral')
    expect(validateEnumValue('InvalidSource', Source)).toBeNull()
  })

  it('should handle whitespace in enum values', () => {
    expect(validateEnumValue(' New ', BuyerStatus)).toBe('New')
    expect(validateEnumValue('  Chandigarh  ', City)).toBe('Chandigarh')
    expect(validateEnumValue('\tApartment\t', PropertyType)).toBe('Apartment')
  })
})

describe('validateRow', () => {
  const validRowData = {
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '919876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: 'Two',
    purpose: 'Buy',
    budgetMin: '5000000',
    budgetMax: '8000000',
    timeline: 'ZeroToThreeMonths',
    source: 'Website',
    notes: 'Looking for a well-ventilated apartment',
    tags: 'first-time-buyer,urgent',
    status: 'New'
  }

  it('should validate a complete valid row successfully', () => {
    const result = validateRow(validRowData, 2)
    
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.validatedRow).toBeTruthy()
    expect(result.validatedRow?.fullName).toBe('Rajesh Kumar')
    expect(result.validatedRow?.email).toBe('rajesh.kumar@email.com')
    expect(result.validatedRow?.phone).toBe('919876543210')
    expect(result.validatedRow?.city).toBe('Chandigarh')
    expect(result.validatedRow?.status).toBe('New')
  })

  it('should handle missing required fields', () => {
    const invalidRow: Partial<typeof validRowData> = { ...validRowData }
    delete invalidRow.fullName
    delete invalidRow.phone
    delete invalidRow.city

    const result = validateRow(invalidRow as Record<string, string>, 2)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(3)
    expect(result.errors.find(e => e.field === 'fullName')).toBeTruthy()
    expect(result.errors.find(e => e.field === 'phone')).toBeTruthy()
    expect(result.errors.find(e => e.field === 'city')).toBeTruthy()
  })

  it('should validate empty status field defaults to New', () => {
    const rowWithoutStatus: Partial<typeof validRowData> = { ...validRowData }
    delete rowWithoutStatus.status

    const result = validateRow(rowWithoutStatus as Record<string, string>, 2)
    
    expect(result.isValid).toBe(true)
    expect(result.validatedRow?.status).toBe('New')
  })

  it('should validate whitespace-only status field defaults to New', () => {
    const rowWithWhitespaceStatus = { ...validRowData, status: '   ' }

    const result = validateRow(rowWithWhitespaceStatus, 2)
    
    expect(result.isValid).toBe(true)
    expect(result.validatedRow?.status).toBe('New')
  })

  it('should reject invalid status values', () => {
    const invalidStatusRow = { ...validRowData, status: 'InvalidStatus' }

    const result = validateRow(invalidStatusRow, 2)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('status')
    expect(result.errors[0].message).toContain('Invalid status')
  })

  it('should validate case-insensitive status values', () => {
    const testCases = [
      { status: 'new', expected: 'New' },
      { status: 'NEW', expected: 'New' },
      { status: 'qualified', expected: 'Qualified' },
      { status: 'QUALIFIED', expected: 'Qualified' },
      { status: 'contacted', expected: 'Contacted' },
      { status: 'visited', expected: 'Visited' },
      { status: 'negotiation', expected: 'Negotiation' },
      { status: 'converted', expected: 'Converted' },
      { status: 'dropped', expected: 'Dropped' }
    ]

    testCases.forEach(({ status, expected }) => {
      const rowWithStatus = { ...validRowData, status }
      const result = validateRow(rowWithStatus, 2)
      
      expect(result.isValid).toBe(true)
      expect(result.validatedRow?.status).toBe(expected)
    })
  })

  it('should validate all BuyerStatus enum values', () => {
    const statusValues = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']
    
    statusValues.forEach(status => {
      const rowWithStatus = { ...validRowData, status }
      const result = validateRow(rowWithStatus, 2)
      
      expect(result.isValid).toBe(true)
      expect(result.validatedRow?.status).toBe(status)
    })
  })

  it('should handle invalid email format', () => {
    const invalidEmailRow = { ...validRowData, email: 'invalid-email' }

    const result = validateRow(invalidEmailRow, 2)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('email')
  })

  it('should handle invalid budget values', () => {
    const invalidBudgetRow = { ...validRowData, budgetMin: 'not-a-number', budgetMax: '-100' }

    const result = validateRow(invalidBudgetRow, 2)
    
    expect(result.isValid).toBe(false)
    expect(result.errors).toHaveLength(2)
    expect(result.errors.find(e => e.field === 'budgetMin')).toBeTruthy()
    expect(result.errors.find(e => e.field === 'budgetMax')).toBeTruthy()
  })

  it('should handle optional fields correctly', () => {
    const minimalRow = {
      fullName: 'John Doe',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      purpose: 'Buy',
      timeline: 'ZeroToThreeMonths',
      source: 'Website'
    }

    const result = validateRow(minimalRow, 2)
    
    expect(result.isValid).toBe(true)
    expect(result.validatedRow?.email).toBeNull()
    expect(result.validatedRow?.bhk).toBeNull()
    expect(result.validatedRow?.budgetMin).toBeNull()
    expect(result.validatedRow?.budgetMax).toBeNull()
    expect(result.validatedRow?.notes).toBeNull()
    expect(result.validatedRow?.tags).toEqual([])
    expect(result.validatedRow?.status).toBe('New')
  })

  it('should parse tags correctly', () => {
    const rowWithTags = { ...validRowData, tags: 'tag1, tag2 , tag3,tag4  ' }

    const result = validateRow(rowWithTags, 2)
    
    expect(result.isValid).toBe(true)
    expect(result.validatedRow?.tags).toEqual(['tag1', 'tag2', 'tag3', 'tag4'])
  })
})

describe('parseCSV', () => {
  const csvHeader = 'fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status'
  
  it('should parse valid CSV correctly', () => {
    const csvContent = `${csvHeader}
Rajesh Kumar,rajesh@email.com,919876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Some notes,tag1;tag2,New`

    const result = parseCSV(csvContent)
    
    expect(result.errors).toHaveLength(0)
    expect(result.headers).toEqual(['fullName','email','phone','city','propertyType','bhk','purpose','budgetMin','budgetMax','timeline','source','notes','tags','status'])
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].fullName).toBe('Rajesh Kumar')
    expect(result.rows[0].status).toBe('New')
  })

  it('should handle quoted CSV fields', () => {
    const csvContent = `${csvHeader}
"John, Doe","john@email.com","123456789","Chandigarh","Apartment","Two","Buy","5000000","8000000","ZeroToThreeMonths","Website","Notes with, comma","tag1,tag2","New"`

    const result = parseCSV(csvContent)
    
    expect(result.errors).toHaveLength(0)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].fullName).toBe('John, Doe')
    expect(result.rows[0].notes).toBe('Notes with, comma')
  })

  it('should handle missing headers', () => {
    const csvContent = 'fullName,email,phone\nJohn Doe,john@email.com,123456789'

    const result = parseCSV(csvContent)
    
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors[0]).toContain('Missing required headers')
  })

  it('should handle empty CSV', () => {
    const result = parseCSV('')
    
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toBe('File is empty')
  })

  it('should handle CSV with too many rows', () => {
    const rows = Array(202).fill('John Doe,john@email.com,123456789,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Notes,tags,New').join('\n')
    const csvContent = `${csvHeader}\n${rows}`

    const result = parseCSV(csvContent)
    
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toBe('File cannot have more than 200 data rows')
  })

  it('should handle CSV with whitespace and empty lines', () => {
    const csvContent = `${csvHeader}

Rajesh Kumar,rajesh@email.com,919876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Some notes,tag1;tag2,New

`

    const result = parseCSV(csvContent)
    
    expect(result.errors).toHaveLength(0)
    expect(result.rows).toHaveLength(1)
  })
})