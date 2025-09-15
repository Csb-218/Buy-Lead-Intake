import { describe, it, expect } from 'vitest'
import { parseCSV, validateRow } from '../import-validation'

describe('CSV Issue Debugging', () => {
  it('should parse and validate the problematic CSV data correctly', () => {
    // Exact CSV data from the user's issue
    const csvContent = `fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status
Rajesh Ku Bal,rajesh.kumar@email.com,919876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Looking for a well-ventilated 2BHK apartment in Sector 22,first-time-buyer;urgent,New
Rajesh Kumar,rajesh.kumar@email.com,919876543210,Chandigarh,Apartment,Two,Buy,5000000,8000000,ZeroToThreeMonths,Website,Looking for a well-ventilated 2BHK apartment in Sector 22,first-time-buyer;urgent,New`

    // Parse CSV
    const parsed = parseCSV(csvContent)
    
    console.log('Parsed CSV result:', {
      errors: parsed.errors,
      rowCount: parsed.rows.length,
      headers: parsed.headers
    })

    expect(parsed.errors).toHaveLength(0)
    expect(parsed.rows).toHaveLength(2)

    // Test each row
    parsed.rows.forEach((row, index) => {
      console.log(`\nTesting row ${index + 2}:`)
      console.log('Row data:', row)
      console.log('Status field:', JSON.stringify(row.status))
      console.log('Status length:', row.status?.length)
      console.log('Status trimmed:', JSON.stringify(row.status?.trim()))
      
      const result = validateRow(row, index + 2)
      
      console.log('Validation result:', {
        isValid: result.isValid,
        errors: result.errors,
        validatedStatus: result.validatedRow?.status
      })

      if (result.errors.length > 0) {
        result.errors.forEach(error => {
          console.log(`Error in row ${error.row}, field ${error.field}: ${error.message}`)
        })
      }

      expect(result.isValid).toBe(true)
      expect(result.validatedRow?.status).toBe('New')
    })
  })

  it('should handle tags with different separators', () => {
    const testCases = [
      'first-time-buyer,urgent',
      'first-time-buyer;urgent', 
      'first-time-buyer, urgent',
      'first-time-buyer ; urgent'
    ]

    testCases.forEach((tagsValue, index) => {
      const rowData = {
        fullName: 'Test User',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        purpose: 'Buy',
        timeline: 'ZeroToThreeMonths',
        source: 'Website',
        tags: tagsValue,
        status: 'New'
      }

      const result = validateRow(rowData, index + 2)
      console.log(`\nTags test ${index + 1}: "${tagsValue}"`)
      console.log('Parsed tags:', result.validatedRow?.tags)
      console.log('Validation errors:', result.errors)

      expect(result.isValid).toBe(true)
    })
  })

  it('should debug status validation step by step', () => {
    const statusValues = ['New', 'new', 'NEW', ' New ', '\tNew\t', 'Invalid']
    
    statusValues.forEach(status => {
      const rowData = {
        fullName: 'Test User',
        phone: '1234567890', 
        city: 'Chandigarh',
        propertyType: 'Apartment',
        purpose: 'Buy',
        timeline: 'ZeroToThreeMonths',
        source: 'Website',
        status: status
      }

      const result = validateRow(rowData, 2)
      
      console.log(`\nStatus: "${status}"`)
      console.log('Raw status:', JSON.stringify(status))
      console.log('Trimmed status:', JSON.stringify(status.trim()))
      console.log('Is valid:', result.isValid)
      console.log('Validated status:', result.validatedRow?.status)
      console.log('Errors:', result.errors)
      
      if (status.trim().toLowerCase() === 'invalid') {
        expect(result.isValid).toBe(false)
      } else {
        expect(result.isValid).toBe(true)
        expect(result.validatedRow?.status).toBe('New')
      }
    })
  })
})