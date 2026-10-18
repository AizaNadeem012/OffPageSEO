'use client'

import React, { useState } from 'react'
import { Prospect, AutomationSettings } from '@/types'
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react'
import {
  parseCSV,
  mapRecordToProspect,
  prospectsToCSV,
  downloadCSVFile,
  generateSampleCSV,
} from '@/lib/csv-helper'
import { addProspect, addActivityLog } from '@/lib/storage'
import { formatNumber, getOpportunityTypeLabel } from '@/lib/utils'

interface CSVViewProps {
  prospects: Prospect[]
  settings: AutomationSettings
  onProspectsImported: () => void
  onNavigateTab: (tabId: string) => void
}

export const CSVView: React.FC<CSVViewProps> = ({
  prospects,
  settings,
  onProspectsImported,
  onNavigateTab,
}) => {
  const [csvRawText, setCsvRawText] = useState('')
  const [parsedPreview, setParsedPreview] = useState<Partial<Prospect>[]>([])
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCsvRawText(content)
      parseAndPreview(content)
    }
    reader.readAsText(file)
  }

  const handleTextChange = (text: string) => {
    setCsvRawText(text)
    parseAndPreview(text)
  }

  const parseAndPreview = (content: string) => {
    try {
      const records = parseCSV(content)
      const mapped = records.map(mapRecordToProspect)
      setParsedPreview(mapped)
      setImportStatus(`Parsed ${mapped.length} valid prospect rows ready for validation.`)
    } catch (err: any) {
      setImportStatus(`Error parsing CSV: ${err.message}`)
    }
  }

  const handleLoadSampleInEditor = () => {
    const sample = generateSampleCSV()
    setCsvRawText(sample)
    parseAndPreview(sample)
  }

  const handleExecuteImport = () => {
    if (parsedPreview.length === 0) return
    setIsProcessing(true)

    try {
      let importedCount = 0
      parsedPreview.forEach((item) => {
        if (!item.domain) return
        addProspect({
          domain: item.domain,
          url: item.url || `https://${item.domain}`,
          pageTitle: item.pageTitle || `${item.domain} Editorial Reference`,
          opportunityType: item.opportunityType || 'guest_post',
          status: item.status || 'discovered',
          niche: item.niche || 'General Industry',
          domainAuthority: item.domainAuthority || 50,
          spamScore: item.spamScore || 2,
          monthlyTraffic: item.monthlyTraffic || 100000,
          relevanceScore: item.relevanceScore || 80,
          qualityTier: item.qualityTier || 'Medium',
          contact: item.contact || {},
          suggestedTopic: item.suggestedTopic,
          notes: item.notes || 'Imported via CSV',
          isApproved: false,
          isDemo: false,
        })
        importedCount++
      })

      addActivityLog(
        `CSV Bulk Import Completed: ${importedCount} Prospects`,
        'csv',
        'success',
        `Successfully imported ${importedCount} rows into active pipeline.`
      )

      setImportStatus(`Successfully imported ${importedCount} prospects into your active pipeline!`)
      setParsedPreview([])
      setCsvRawText('')
      onProspectsImported()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleExportAll = () => {
    const csv = prospectsToCSV(prospects)
    downloadCSVFile(`RankWave_SEO_Pipeline_${new Date().toISOString().split('T')[0]}.csv`, csv)
    addActivityLog(
      `CSV Pipeline Exported`,
      'csv',
      'info',
      `Exported ${prospects.length} prospects to client spreadsheet.`
    )
  }

  const handleExportWon = () => {
    const wonList = prospects.filter((p) => p.status === 'won')
    const csv = prospectsToCSV(wonList)
    downloadCSVFile(`RankWave_Won_Backlinks_${new Date().toISOString().split('T')[0]}.csv`, csv)
  }

  const handleDownloadSample = () => {
    downloadCSVFile('RankWave_Sample_Prospects_Template.csv', generateSampleCSV())
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Data Portability Hub
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            CSV Import & Export Operations
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Migrate existing outreach lists from spreadsheets, export audit-ready client deliverables, or test with our pre-formatted CSV template.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Sample Template
          </button>
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" /> Export All ({prospects.length})
          </button>
        </div>
      </div>

      {/* Import Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload & Paste Area */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-brand-600" />
            Import Prospect Spreadsheet
          </h2>

          <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-xl p-6 text-center space-y-2 transition bg-slate-50/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs text-slate-600">
              <label className="font-semibold text-brand-600 hover:text-brand-700 cursor-pointer">
                <span>Upload a CSV file</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span> or drag and drop</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Supports standard CSV with Domain, URL, Contact Name, Email, and DA
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Or Paste Raw CSV Data</label>
              <button
                onClick={handleLoadSampleInEditor}
                className="text-brand-600 hover:text-brand-700 font-medium text-[11px] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Load Sample Data in Editor
              </button>
            </div>
            <textarea
              rows={5}
              value={csvRawText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Domain,URL,Contact Name,Contact Email,Domain Authority..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700 border border-slate-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {parsedPreview.length > 0 && (
            <button
              onClick={handleExecuteImport}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Upload className="w-4 h-4" />
              <span>Import {parsedPreview.length} Prospects to Pipeline</span>
            </button>
          )}
        </div>

        {/* Export Center & Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            Client Exports & Audit Reports
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Full Pipeline Master Export
                </h4>
                <p className="text-[11px] text-slate-500">
                  Complete dataset of all {prospects.length} prospects, contact info, notes, and stages
                </p>
              </div>
              <button
                onClick={handleExportAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
              >
                Export CSV
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Won Backlinks Proof Report
                </h4>
                <p className="text-[11px] text-slate-500">
                  Only secured, verified live editorial links for client monthly reporting
                </p>
              </div>
              <button
                onClick={handleExportWon}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
              >
                Export Won ({prospects.filter((p) => p.status === 'won').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Parsed Preview Table */}
      {parsedPreview.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Detected Rows Preview ({parsedPreview.length} prospects ready)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Domain</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">DA</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedPreview.slice(0, 5).map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{p.domain}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {getOpportunityTypeLabel(p.opportunityType as any)}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-700">DA {p.domainAuthority}</td>
                    <td className="py-2.5 px-3 text-slate-700">{p.contact?.name || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {p.contact?.email || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
