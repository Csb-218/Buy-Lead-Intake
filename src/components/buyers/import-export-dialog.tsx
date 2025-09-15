'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CsvImport } from './csv-import'
import { CsvExport } from './csv-export'
import { BuyerFilters } from '@/lib/types'

interface ImportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: BuyerFilters
  totalCount: number
  ownerId: string
  onImportComplete: () => void
}

export function ImportExportDialog({ 
  open, 
  onOpenChange, 
  filters, 
  totalCount, 
  ownerId,
  onImportComplete 
}: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState('import')

  const handleImportComplete = () => {
    onImportComplete()
    // Switch to export tab or close dialog after successful import
    setActiveTab('export')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import / Export Buyers</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import CSV</TabsTrigger>
            <TabsTrigger value="export">Export CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="mt-4">
            <CsvImport 
              onImportComplete={handleImportComplete}
              ownerId={ownerId}
            />
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <CsvExport 
              filters={filters}
              totalCount={totalCount}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}