'use client'

import React, { useState } from 'react'
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Play,
  ArrowRight,
  Filter,
  ExternalLink,
  Users,
  PenTool,
  Send,
  Layers,
} from 'lucide-react'

export interface CampaignWorkspaceViewProps {
  campaign: any
  targets: any[]
  backlinks: any[]
  approvals: any[]
  onNavigateTab: (tab: string) => void
  onRunQueue: () => void
  isProcessingQueue: boolean
}

export const CampaignWorkspaceView: React.FC<CampaignWorkspaceViewProps> = ({
  campaign,
  targets,
  backlinks,
  approvals,
  onNavigateTab,
  onRunQueue,
  isProcessingQueue,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const eligibleCount = targets.filter((t) => t.status === 'eligible').length
  const completedCount = targets.filter((t) => t.status === 'completed').length
  const actionCount = approvals.filter((a) => a.status === 'pending').length
  const failedCount = targets.filter((t) => t.status === 'ineligible' || t.status === 'failed').length

  const filteredTargets = targets.filter((t) => {
    if (filterStatus === 'all') return true
    return t.status === filterStatus
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Campaign Workspace Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-900 text-white">
              CAMPAIGN WORKSPACE
            </span>
            <span className="text-xs text-stone-500 font-mono">
              ID: {campaign?.id || 'camp_master_default'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {campaign?.name || 'Afimah Clothing Q4 Global Expansion'}
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Target URL: <span className="font-mono text-stone-800">{campaign?.website_url}</span> • Monthly Backlink Goal: {campaign?.monthly_backlink_target || 50} • Daily Action Limit: {campaign?.daily_action_limit || 15}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('inventory')}
            className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium transition"
          >
            Import Targets
          </button>
          <button
            onClick={onRunQueue}
            disabled={isProcessingQueue}
            className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isProcessingQueue ? 'Orchestrating...' : 'Run Automation'}</span>
          </button>
        </div>
      </div>

      {/* Campaign Progress KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setFilterStatus('all')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'all' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">All Targets</span>
          <span className="text-xl font-bold block">{targets.length}</span>
        </div>

        <div
          onClick={() => setFilterStatus('eligible')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'eligible' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Eligible Sites</span>
          <span className="text-xl font-bold block">{eligibleCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus('completed')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'completed' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Published</span>
          <span className="text-xl font-bold block">{completedCount}</span>
        </div>

        <div
          onClick={() => onNavigateTab('verification')}
          className="p-3 rounded-lg border bg-white border-stone-200 text-stone-800 hover:bg-stone-50 cursor-pointer transition"
        >
          <span className="text-[10px] uppercase font-mono block text-stone-500">Verified Links</span>
          <span className="text-xl font-bold text-emerald-700 block">{backlinks.length}</span>
        </div>

        <div
          onClick={() => onNavigateTab('human_action')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            actionCount > 0 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Action Required</span>
          <span className="text-xl font-bold block">{actionCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus('ineligible')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            filterStatus === 'ineligible' ? 'bg-rose-700 text-white border-rose-700' : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
          }`}
        >
          <span className="text-[10px] uppercase font-mono block opacity-75">Ineligible</span>
          <span className="text-xl font-bold block">{failedCount}</span>
        </div>
      </div>

      {/* Target Websites Tracking Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Target Website Pipeline
            </h3>
            <p className="text-xs text-stone-500">
              Showing {filteredTargets.length} websites assigned to this campaign
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 text-xs border border-stone-300 rounded-md bg-stone-50 text-stone-700 font-medium focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="eligible">Eligible</option>
              <option value="completed">Completed / Published</option>
              <option value="pending_assessment">Pending Assessment</option>
              <option value="ineligible">Ineligible</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Website / Domain</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Authority</th>
                <th className="py-2.5 px-4 font-semibold">Registration</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTargets.map((target) => (
                <tr key={target.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-900 block truncate">
                      {target.website_name || target.normalized_domain}
                    </span>
                    <a
                      href={target.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-stone-500 hover:text-emerald-700 font-mono flex items-center gap-1 mt-0.5"
                    >
                      <span>{target.normalized_domain}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </td>

                  <td className="py-3 px-4 text-stone-600">
                    {target.category || 'Editorial'}
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-stone-900">DA {target.domain_authority || 50}</span>
                    <span className="text-[10px] text-stone-400 block">Spam {target.spam_score || 1}%</span>
                  </td>

                  <td className="py-3 px-4">
                    {target.account_username ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Users className="w-3 h-3" />
                        <span>{target.account_username}</span>
                      </span>
                    ) : target.registration_url ? (
                      <span className="text-[11px] text-stone-500 font-mono">Available</span>
                    ) : (
                      <span className="text-[11px] text-stone-400 font-mono">Direct / Outreach</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        target.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-900'
                          : target.status === 'eligible'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : target.status === 'action_required'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {target.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => onNavigateTab('research')}
                      className="px-2 py-1 text-[11px] border border-stone-200 rounded text-stone-700 hover:bg-stone-100 transition"
                    >
                      Research
                    </button>
                    <button
                      onClick={() => onNavigateTab('content_studio')}
                      className="px-2 py-1 text-[11px] bg-stone-900 text-white rounded hover:bg-stone-800 transition"
                    >
                      Draft Content
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
