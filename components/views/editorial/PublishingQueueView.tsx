'use client'

import React, { useState } from 'react'
import {
  Send,
  Play,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Pause,
} from 'lucide-react'

export interface PublishingQueueViewProps {
  tasks: any[]
  counts: Record<string, number>
  settings: any
  onQueueUpdated: () => void
  onNavigateTab: (tab: string) => void
}

export const PublishingQueueView: React.FC<PublishingQueueViewProps> = ({
  tasks,
  counts,
  settings,
  onQueueUpdated,
  onNavigateTab,
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const handleRunBatch = async () => {
    setIsProcessing(true)
    try {
      const res = await fetch('/api/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 5 }),
      })
      const data = await res.json()
      if (data.success) {
        onQueueUpdated()
        alert(`Orchestrator completed: ${data.summary.processedCount} tasks processed (${data.summary.succeededCount} succeeded, ${data.summary.pausedCount} paused for human action).`)
      } else {
        alert(data.error || 'Failed to run queue')
      }
    } catch (err: any) {
      alert(`Queue dispatch error: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true
    return t.status === filterStatus
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Publishing Queue & Orchestration Engine</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
              Queue-Based Workers
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Orchestrates autonomous research, account onboarding, content generation, and publishing tasks with daily rate limits and crash recovery.
          </p>
        </div>

        <button
          onClick={handleRunBatch}
          disabled={isProcessing}
          className="px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
        >
          {isProcessing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
          )}
          <span>{isProcessing ? 'Processing Batch...' : 'Process Next 5 Tasks'}</span>
        </button>
      </div>

      {/* Queue Status Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'all' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Total Tasks</span>
          <span className="text-xl font-bold block">{tasks.length}</span>
        </div>

        <div
          onClick={() => setFilterStatus('pending')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'pending' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Pending</span>
          <span className="text-xl font-bold text-amber-600 block">{counts?.pending || 0}</span>
        </div>

        <div
          onClick={() => setFilterStatus('processing')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'processing' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Processing</span>
          <span className="text-xl font-bold text-sky-600 block">{counts?.processing || 0}</span>
        </div>

        <div
          onClick={() => setFilterStatus('paused')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'paused' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Paused (Challenge)</span>
          <span className="text-xl font-bold text-amber-700 block">{counts?.paused || 0}</span>
        </div>

        <div
          onClick={() => setFilterStatus('completed')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'completed' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Completed</span>
          <span className="text-xl font-bold text-emerald-700 block">{counts?.completed || 0}</span>
        </div>
      </div>

      {/* Task Queue Records Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
            Task Execution Records ({filteredTasks.length})
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Daily limit: {settings?.daily_task_limit || 15}/day
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Task ID</th>
                <th className="py-2.5 px-4 font-semibold">Target Domain</th>
                <th className="py-2.5 px-4 font-semibold">Task Type</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Attempts</th>
                <th className="py-2.5 px-4 font-semibold">Scheduled / Timestamp</th>
                <th className="py-2.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-stone-400 font-mono">
                    No tasks currently in this queue status.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-mono font-medium text-stone-900">
                      {t.id}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-900 block truncate">
                        {t.website_name || t.normalized_domain}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono block">
                        {t.normalized_domain}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-bold">
                        {t.task_type?.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          t.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-900'
                            : t.status === 'processing'
                            ? 'bg-sky-100 text-sky-900 animate-pulse'
                            : t.status === 'paused'
                            ? 'bg-amber-100 text-amber-900'
                            : t.status === 'failed'
                            ? 'bg-rose-100 text-rose-900'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {t.status?.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-stone-600">
                      {t.attempts} / {t.max_attempts || 3}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                      {new Date(t.created_at).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {t.status === 'paused' ? (
                        <button
                          onClick={() => onNavigateTab('human_action')}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-semibold"
                        >
                          Resolve Action
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-400 font-mono truncate max-w-xs block ml-auto">
                          {t.error_message || 'Normal execution'}
                        </span>
                      )}
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
