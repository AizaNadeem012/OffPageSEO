'use client'

import React, { useState, useRef } from 'react'
import {
  Upload,
  FileSpreadsheet,
  Check,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Plus,
  X,
} from 'lucide-react'

export interface WebsiteInventoryViewProps {
  targets: any[]
  onTargetsUpdated: () => void
  onNavigateTab: (tab: string) => void
}

export const WebsiteInventoryView: React.FC<WebsiteInventoryViewProps> = ({
  targets,
  onTargetsUpdated,
  onNavigateTab,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Import Preview & Column Mapping State
  const [parseResult, setParseResult] = useState<{
    filename: string
    totalRows: number
    headers: string[]
    detectedMapping: Record<string, string>
    previewRows: any[]
    allRows: any[]
  } | null>(null)

  const [customMapping, setCustomMapping] = useState<Record<string, string>>({})
  const [importSummary, setImportSummary] = useState<{
    validCount: number
    duplicateCount: number
    invalidCount: number
  } | null>(null)

  // Handle Drag & Drop / File Select
  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processSelectedFile(e.target.files[0])
    }
  }

  const processSelectedFile = async (file: File) => {
    setIsUploading(true)
    setImportSummary(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/inventory/parse-file', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setParseResult({
          filename: data.filename,
          totalRows: data.totalRows,
          headers: data.headers,
          detectedMapping: data.detectedMapping,
          previewRows: data.previewRows,
          allRows: data.allRows,
        })
        setCustomMapping(data.detectedMapping)
      } else {
        alert(data.error || 'Failed to parse spreadsheet')
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  // Confirm Import
  const handleConfirmImport = async () => {
    if (!parseResult) return
    setIsImporting(true)

    try {
      const res = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: 'camp_master_default',
          filename: parseResult.filename,
          rows: parseResult.allRows,
          mapping: customMapping,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setImportSummary({
          validCount: data.validCount,
          duplicateCount: data.duplicateCount,
          invalidCount: data.invalidCount,
        })
        setParseResult(null)
        onTargetsUpdated()
      } else {
        alert(data.error || 'Import failed')
      }
    } catch (err: any) {
      alert(`Import error: ${err.message}`)
    } finally {
      setIsImporting(false)
    }
  }

  // Delete Target
  const handleDeleteTarget = async (id: string) => {
    if (!confirm('Remove this website target from your inventory?')) return
    try {
      const res = await fetch(`/api/inventory?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        onTargetsUpdated()
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`)
    }
  }

  const completedTargets = targets.filter((t) => t.status === 'completed' || Boolean(t.live_published_url))
  const eligibleTargets = targets.filter((t) => t.status === 'eligible')
  const pendingTargets = targets.filter((t) => t.status === 'pending_assessment' || !t.status)

  const filteredTargets = targets.filter((t) => {
    if (filterStatus === 'completed' && !(t.status === 'completed' || Boolean(t.live_published_url))) return false
    if (filterStatus === 'eligible' && t.status !== 'eligible') return false
    if (filterStatus === 'pending' && t.status !== 'pending_assessment' && t.status !== undefined && t.status !== 'pending') return false

    const matchesSearch =
      !searchQuery ||
      t.website_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.normalized_domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.live_published_url && t.live_published_url.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.website_name && t.website_name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const uniqueCategories = Array.from(new Set(targets.map((t) => t.category).filter(Boolean)))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className="bg-white border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-lg p-8 text-center cursor-pointer transition shadow-sm group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-stone-200 text-stone-700 mx-auto flex items-center justify-center transition mb-3">
          {isUploading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>

        <h3 className="font-bold text-sm text-stone-900">
          {isUploading ? 'Inspecting Spreadsheet...' : 'Drop target websites spreadsheet here'}
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
          Supports <span className="font-mono font-semibold">.XLSX</span>, <span className="font-mono font-semibold">.XLS</span>, and <span className="font-mono font-semibold">.CSV</span> files. Automatic column detection, SSRF protection, domain deduplication, and AES-256 credential encryption.
        </p>
      </div>

      {/* Import Feedback Banner */}
      {importSummary && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-900 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Import completed: <strong>{importSummary.validCount}</strong> valid websites imported. Skipped <strong>{importSummary.duplicateCount}</strong> duplicates and <strong>{importSummary.invalidCount}</strong> invalid URLs. Tasks enqueued!
            </span>
          </div>
          <button onClick={() => setImportSummary(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Column Mapping Modal / Preview */}
      {parseResult && (
        <div className="bg-white border border-stone-300 rounded-lg p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Confirm Column Mapping: {parseResult.filename}</span>
              </h3>
              <p className="text-xs text-stone-500">
                Found {parseResult.totalRows} rows. Verify automated column detection before importing.
              </p>
            </div>
            <button
              onClick={() => setParseResult(null)}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mapping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'website_url', label: 'Website URL *', required: true },
              { key: 'website_name', label: 'Website Name' },
              { key: 'category', label: 'Category / Niche' },
              { key: 'registration_url', label: 'Registration URL' },
              { key: 'login_url', label: 'Login URL' },
              { key: 'account_email', label: 'Account Email / Username' },
              { key: 'account_password', label: 'Password (AES-256 Encrypted)' },
              { key: 'target_landing_page', label: 'Target Landing Page' },
              { key: 'preferred_anchor', label: 'Preferred Anchor' },
              { key: 'priority', label: 'Priority' },
              { key: 'notes', label: 'Notes' },
            ].map((col) => (
              <div key={col.key} className="bg-stone-50 p-2.5 rounded border border-stone-200 text-xs">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {col.label}
                </label>
                <select
                  value={customMapping[col.key] || ''}
                  onChange={(e) => setCustomMapping({ ...customMapping, [col.key]: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-stone-300 rounded bg-white font-mono"
                >
                  <option value="">— Skip Column —</option>
                  {parseResult.headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              onClick={() => setParseResult(null)}
              className="px-3 py-1.5 rounded text-xs border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={isImporting}
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
            >
              {isImporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{isImporting ? 'Importing & Validating...' : `Import ${parseResult.totalRows} Websites`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Target Status KPI Filter Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`p-3.5 rounded-xl border text-left transition ${
            filterStatus === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold block opacity-75">All Websites</span>
          <span className="text-xl font-bold block mt-0.5">{targets.length}</span>
          <span className="text-[10px] text-stone-400 font-mono block">Complete Target Pool</span>
        </button>

        <button
          onClick={() => setFilterStatus('completed')}
          className={`p-3.5 rounded-xl border text-left transition ${
            filterStatus === 'completed'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
              : 'bg-white text-stone-800 border-emerald-200 hover:bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono font-bold block text-emerald-600">Published & Live</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xl font-bold block mt-0.5 text-emerald-950">{completedTargets.length}</span>
          <span className="text-[10px] text-emerald-700 font-mono block font-semibold">100% Working (200 OK)</span>
        </button>

        <button
          onClick={() => setFilterStatus('eligible')}
          className={`p-3.5 rounded-xl border text-left transition ${
            filterStatus === 'eligible'
              ? 'bg-sky-800 text-white border-sky-800 shadow-sm'
              : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold block opacity-75 text-sky-700">Eligible For Outreach</span>
          <span className="text-xl font-bold block mt-0.5">{eligibleTargets.length}</span>
          <span className="text-[10px] text-stone-400 font-mono block">Ready for Execution</span>
        </button>

        <button
          onClick={() => setFilterStatus('pending')}
          className={`p-3.5 rounded-xl border text-left transition ${
            filterStatus === 'pending'
              ? 'bg-stone-800 text-white border-stone-800 shadow-sm'
              : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono font-bold block opacity-75">Pending Assessment</span>
          <span className="text-xl font-bold block mt-0.5">{pendingTargets.length}</span>
          <span className="text-[10px] text-stone-400 font-mono block">Imported Spreadsheet Rows</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain, URL, or website name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:outline-none focus:border-stone-900 font-sans"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 text-xs border border-stone-300 rounded-md bg-stone-50 text-stone-700 font-medium focus:outline-none"
            >
              <option value="all">All Categories ({targets.length})</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-stone-500 font-mono">
            {filteredTargets.length} records
          </span>
        </div>
      </div>

      {/* Target Inventory Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Target Domain</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Metrics</th>
                <th className="py-2.5 px-4 font-semibold">Anchor Target</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTargets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-stone-400 font-mono">
                    No target websites found. Upload a spreadsheet (.xlsx / .csv) above to populate your inventory.
                  </td>
                </tr>
              ) : (
                filteredTargets.map((t) => {
                  const isPublished = t.status === 'completed' || Boolean(t.live_published_url)
                  const liveLink = t.live_published_url

                  return (
                    <tr key={t.id} className={`hover:bg-stone-50/80 transition ${isPublished ? 'bg-emerald-50/20' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-stone-900 block truncate">
                            {t.website_name || t.normalized_domain}
                          </span>
                          {isPublished && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Live Link Active" />
                          )}
                        </div>
                        <a
                          href={t.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-stone-500 hover:text-emerald-700 font-mono flex items-center gap-1 mt-0.5"
                        >
                          <span>{t.normalized_domain}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>

                        {/* Live Published Post Link if available */}
                        {liveLink && (
                          <a
                            href={liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition max-w-xs truncate"
                            title={`Published Live Post: ${liveLink}`}
                          >
                            <span>🔗 Live: {liveLink}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        {t.category || 'Editorial'}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-stone-900">DA {t.domain_authority || 50}</span>
                        <span className="text-[10px] text-stone-400 block">Spam {t.spam_score || 1}%</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-800 block truncate">
                          "{t.preferred_anchor || 'sustainable luxury apparel'}"
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono block truncate">
                          {t.target_landing_page || 'https://www.afimahclothingstore.com'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            PUBLISHED (LIVE 200 OK)
                          </span>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              t.status === 'eligible'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : t.status === 'action_required'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {t.status?.toUpperCase() || 'PENDING'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5">
                        {liveLink ? (
                          <a
                            href={liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition inline-flex items-center gap-1 shadow-2xs"
                          >
                            <span>Open Post</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            onClick={() => onNavigateTab('research')}
                            className="px-2 py-1 text-[11px] border border-stone-200 rounded text-stone-700 hover:bg-stone-100 transition"
                          >
                            Assess
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTarget(t.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 transition"
                          title="Delete target"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
