'use client'

import React, { useState } from 'react'
import {
  FileText,
  Filter,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react'

export interface ActivityLogsViewProps {
  logs: any[]
  onLogsCleared: () => void
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({
  logs,
  onLogsCleared,
}) => {
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const handleClear = async () => {
    if (!confirm('Clear all operational audit logs?')) return
    try {
      const res = await fetch('/api/audit-logs', { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        onLogsCleared()
      }
    } catch (err: any) {
      alert(`Clear logs error: ${err.message}`)
    }
  }

  const filteredLogs = logs.filter((l) => {
    const matchesSev = filterSeverity === 'all' || l.severity === filterSeverity
    const matchesCat = filterCategory === 'all' || l.category === filterCategory
    return matchesSev && matchesCat
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Operational Audit Trail & Activity Logs</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
              Tamper-Evident History
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Structured records of every research crawl, credential generation, content synthesis, email dispatch, and link verification.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded border border-stone-300 text-stone-700 hover:text-rose-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-semibold">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 border border-stone-300 rounded bg-stone-50 font-mono"
            >
              <option value="all">All Categories</option>
              <option value="research">Research</option>
              <option value="accounts">Accounts</option>
              <option value="content">Content</option>
              <option value="verification">Verification</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-semibold">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2 py-1 border border-stone-300 rounded bg-stone-50 font-mono"
            >
              <option value="all">All Severities</option>
              <option value="success">Success</option>
              <option value="action_required">Action Required</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        <span className="text-stone-500 font-mono text-[11px]">
          {filteredLogs.length} events recorded
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Severity</th>
                <th className="py-2.5 px-4 font-semibold">Action / Event</th>
                <th className="py-2.5 px-4 font-semibold">Execution Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-stone-400">
                    No activity logs recorded for this filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/80 transition text-[11px]">
                    <td className="py-2.5 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold">
                        {log.category?.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'success'
                            ? 'bg-emerald-100 text-emerald-900'
                            : log.severity === 'action_required'
                            ? 'bg-amber-100 text-amber-900'
                            : log.severity === 'warning'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {log.severity?.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-2.5 px-4 font-sans font-semibold text-stone-900">
                      {log.action}
                    </td>

                    <td className="py-2.5 px-4 font-sans text-stone-600 max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
