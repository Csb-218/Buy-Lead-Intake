import { describe, it, expect } from 'vitest'
import { parseCSV, validateRow } from '../import-validation'

describe('User CSV Issue Reproduction', () => {
  it('should validate the exact user CSV data without status errors', () => {
    // Exact CSV content from user
    const csvContent = `fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
Rajesh Ku Bal,rajesh.kumar@email.com,919876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Looking for a well-ventilated 2BHK apartment in Sector 22,first-time-buyer;urgent,New
Rajesh Kumar,rajesh.kumar@email.com,919876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Looking for a well-ventilated 2BHK apartment in Sector 22,first-time-buyer;urgent,New`

    // Parse CSV
    const { headers, rows, errors } = parseCSV(csvContent)
    
    expect(errors).toHaveLength(0)
    expect(rows).toHaveLength(2)
    
    // Validate each row - both should pass without status errors
    const results = rows.map((row, index) => validateRow(row, index + 2))
    
    results.forEach((result, index) => {
      expect(result.isValid).toBe(true, `Row ${index + 2} should be valid`)
      expect(result.errors).toHaveLength(0, `Row ${index + 2} should have no errors`)
      expect(result.validatedRow?.status).toBe('New', `Row ${index + 2} status should be 'New'`)
    })
  })

  it('should identify the root cause of the original validation issue', () => {
    // Let's test various possible issues with the data
    const testRow = {
      fullName: 'Rajesh Ku Bal',
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
      notes: 'Looking for a well-ventilated 2BHK apartment in Sector 22',
      tags: 'first-time-buyer;urgent',
      status: 'New'
    }

    // Test with exact data
    const result1 = validateRow(testRow, 2)
    expect(result1.isValid).toBe(true)
    expect(result1.validatedRow?.status).toBe('New')

    // Test with potential encoding issues
    const testRowWithUnicodeSpaces = {
      ...testRow,
      status: 'New\u00A0' // Non-breaking space
    }
    const result2 = validateRow(testRowWithUnicodeSpaces, 2)
    expect(result2.isValid).toBe(true) // Should still work due to trimming
    expect(result2.validatedRow?.status).toBe('New')

    // Test with trailing carriage returns (common CSV issue)
    const testRowWithCarriageReturn = {
      ...testRow,
      status: 'New\r'
    }
    const result3 = validateRow(testRowWithCarriageReturn, 2)
    expect(result3.isValid).toBe(true) // Should still work due to trimming
    expect(result3.validatedRow?.status).toBe('New')
  })

  it('should demonstrate the validation works for all valid status values', () => {
    const validStatuses = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']
    
    const baseRow = {
      fullName: 'Test User',
      phone: '1234567890',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      purpose: 'Buy',
      timeline: 'ZeroToThreeMonths',
      source: 'Website'
    }

    validStatuses.forEach(status => {
      const testRow = { ...baseRow, status }
      const result = validateRow(testRow, 2)
      
      expect(result.isValid).toBe(true, `Status '${status}' should be valid`)
      expect(result.validatedRow?.status).toBe(status, `Status should be validated as '${status}'`)
    })
  })
})