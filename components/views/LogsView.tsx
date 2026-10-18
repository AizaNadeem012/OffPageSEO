'use client'

import React, { useState } from 'react'
import { ActivityLogItem } from '@/types'
import {
  ScrollText,
  Filter,
  Trash2,
  Download,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface LogsViewProps {
  logs: ActivityLogItem[]
  onClearLogs: () => void
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, onClearLogs }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = logs.filter((log) => {
    const matchesCat = filterCategory === 'all' || log.category === filterCategory
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  const getSeverityBadge = (severity: ActivityLogItem['severity']) => {
    switch (severity) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Success
          </span>
        )
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        )
      case 'action_required':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
            <Clock className="w-3 h-3" /> Action Required
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-semibold">
            <Info className="w-3 h-3" /> Info
          </span>
        )
    }
  }

  const handleExportLogs = () => {
    const json = JSON.stringify(logs, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RankWave_Audit_Trail_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-1 border border-slate-200">
            <ScrollText className="w-3.5 h-3.5 text-slate-500" /> Operational Audit Trail
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Activity Logs & Safety Compliance History
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Immutable, timestamped record of every autonomous search query, toxic domain block, draft generation, and human editorial approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export JSON
          </button>
          <button
            onClick={onClearLogs}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Clear Logs
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'safety', 'discovery', 'competitor', 'outreach', 'csv', 'system'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search log messages..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  {getSeverityBadge(log.severity)}
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {log.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.details}</p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                {formatDateTime(log.timestamp)}
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic text-xs">
              No matching activity logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
