'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ImportError {
  row: number
  field: string
  message: string
}

interface ImportResult {
  success: boolean
  importedCount: number
  totalRows: number
  errors: ImportError[]
}

interface CsvImportProps {
  onImportComplete: () => void
  ownerId: string
}

export function CsvImport({ onImportComplete, ownerId }: CsvImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [showResult, setShowResult] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file')
        return
      }
      setFile(selectedFile)
      setResult(null)
      setShowResult(false)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('ownerId', ownerId)

      const response = await fetch('/api/buyers/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data)
      setShowResult(true)
      
      if (data.success) {
        // Reset form on success
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        // Notify parent component
        onImportComplete()
      }
    } catch (error) {
      console.error('Import error:', error)
      alert(error instanceof Error ? error.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk', 'purpose',
      'budgetMin', 'budgetMax', 'timeline', 'source', 'notes', 'tags', 'status'
    ]
    
    const sampleData = [
      'John Doe', 'john@example.com', '9876543210', 'Chandigarh', 'Apartment', '2', 'Buy',
      '5000000', '7000000', '0-3m', 'Website', 'Looking for a 2BHK apartment', 'urgent,family', 'New'
    ]

    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'buyers-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setFile(null)
    setResult(null)
    setShowResult(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Buyers from CSV
        </CardTitle>
        <CardDescription>
          Upload a CSV file to import buyers. Maximum 200 rows allowed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showResult ? (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-file-input"
              />
              <label 
                htmlFor="csv-file-input" 
                className="cursor-pointer block"
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">
                  Choose CSV file or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  CSV files only, max 200 rows
                </p>
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{file.name}</p>
                    <p className="text-sm text-blue-700">
                      {Math.round(file.size / 1024)} KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleImport}
                    disabled={importing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {importing ? 'Importing...' : 'Import'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Required headers:</strong> fullName, phone, city, propertyType, purpose, timeline, source</li>
                <li>• <strong>Optional headers:</strong> email, bhk, budgetMin, budgetMax, notes, tags, status</li>
                <li>• <strong>Enum values:</strong></li>
                <li className="ml-4">- City: Chandigarh, Mohali, Zirakpur, Panchkula, Other</li>
                <li className="ml-4">- PropertyType: Apartment, Villa, Plot, Office, Retail</li>
                <li className="ml-4">- BHK: Studio, 1, 2, 3, 4</li>
                <li className="ml-4">- Purpose: Buy, Rent</li>
                <li className="ml-4">- Timeline: 0-3m, 3-6m, &gt;6m, Exploring</li>
                <li className="ml-4">- Source: Website, Referral, Walk-in, Call, Other</li>
                <li className="ml-4">- Status: New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {result?.success ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Import Successful!</h4>
                  <p className="text-sm text-green-700">
                    {result.importedCount} of {result.totalRows} buyers imported successfully.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Import Failed</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Found {result?.errors.length} errors in {result?.totalRows} rows. Please fix the errors and try again.
                  </p>
                  
                  {result?.errors && result.errors.length > 0 && (
                    <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-red-100 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left font-medium text-red-900">Row</th>
                              <th className="px-3 py-2 text-left font-medium text-red-900">Field</th>
                              <th className="px-3 py-2 text-left font-medium text-red-900">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.errors.map((error, index) => (
                              <tr key={index} className="border-t border-red-100">
                                <td className="px-3 py-2 text-red-800">
                                  <Badge variant="outline" className="text-red-700 border-red-300">
                                    {error.row}
                                  </Badge>
                                </td>
                                <td className="px-3 py-2 text-red-800 font-medium">
                                  {error.field}
                                </td>
                                <td className="px-3 py-2 text-red-700">
                                  {error.message}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={resetImport} variant="outline">
                Import Another File
              </Button>
              {result?.success && (
                <Button onClick={() => setShowResult(false)} variant="ghost">
                  Close
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}