'use client'

import React, { useState } from 'react'
import {
  Prospect,
  ProspectStatus,
  OpportunityType,
  AutomationSettings,
} from '@/types'
import {
  Kanban,
  Table as TableIcon,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Mail,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ArrowUpDown,
} from 'lucide-react'
import {
  getStatusBadgeStyle,
  getStatusLabel,
  getOpportunityTypeLabel,
  formatNumber,
} from '@/lib/utils'
import { updateProspect, deleteProspect } from '@/lib/storage'

interface PipelineViewProps {
  prospects: Prospect[]
  settings: AutomationSettings
  onSelectProspect: (prospect: Prospect) => void
  onOpenNewProspect: () => void
}

const STAGES: { id: ProspectStatus; label: string; color: string }[] = [
  { id: 'discovered', label: 'Discovered', color: 'border-slate-300' },
  { id: 'qualified', label: 'Qualified', color: 'border-blue-300' },
  { id: 'contact_found', label: 'Contact Found', color: 'border-indigo-300' },
  { id: 'outreach_drafted', label: 'Draft Ready', color: 'border-purple-300' },
  { id: 'in_review', label: 'In Review (Pending)', color: 'border-amber-400 bg-amber-50/20' },
  { id: 'approved', label: 'Approved', color: 'border-teal-300' },
  { id: 'contacted', label: 'Contacted', color: 'border-cyan-300' },
  { id: 'follow_up', label: 'Follow-up Sent', color: 'border-sky-300' },
  { id: 'negotiating', label: 'Negotiating', color: 'border-orange-300' },
  { id: 'won', label: 'Won (Live Link)', color: 'border-emerald-400 bg-emerald-50/20' },
  { id: 'rejected', label: 'Rejected', color: 'border-rose-300' },
]

export const PipelineView: React.FC<PipelineViewProps> = ({
  prospects,
  settings,
  onSelectProspect,
  onOpenNewProspect,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProspects = prospects.filter((p) => {
    const matchesSearch =
      p.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.contact?.name && p.contact.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === 'all' || p.opportunityType === typeFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const handleStageChange = (e: React.MouseEvent, id: string, newStatus: ProspectStatus) => {
    e.stopPropagation()
    updateProspect(id, { status: newStatus })
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm('Delete this prospect from pipeline?')) {
      deleteProspect(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search domain, page title, contact name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
          />
        </div>

        {/* Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Opportunity Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="all">All Opportunity Types</option>
            <option value="guest_post">Guest Post</option>
            <option value="resource_page">Resource Page</option>
            <option value="broken_link">Broken Link</option>
            <option value="unlinked_mention">Unlinked Mention</option>
            <option value="podcast_interview">Podcast Interview</option>
            <option value="expert_roundup">Expert Roundup</option>
          </select>

          {/* Status Filter for Table */}
          {viewMode === 'table' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Stages</option>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={onOpenNewProspect}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[600px]">
          {STAGES.map((stage) => {
            const stageProspects = filteredProspects.filter((p) => p.status === stage.id)

            return (
              <div
                key={stage.id}
                className={`w-72 shrink-0 bg-slate-100/80 rounded-2xl border ${stage.color} p-3 flex flex-col max-h-[80vh] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                  <span className="font-bold text-xs text-slate-800 tracking-tight">
                    {stage.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white text-slate-600 font-bold border border-slate-200">
                    {stageProspects.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {stageProspects.map((prospect) => (
                    <div
                      key={prospect.id}
                      onClick={() => onSelectProspect(prospect)}
                      className="bg-white rounded-xl border border-slate-200/90 hover:border-brand-500 hover:shadow-xs p-3 transition cursor-pointer space-y-2.5 group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {getOpportunityTypeLabel(prospect.opportunityType)}
                        </span>
                        <span className="font-bold text-slate-700">
                          DA {prospect.domainAuthority}
                        </span>
                      </div>

                      {/* Domain & Title */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug">
                          {prospect.domain}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {prospect.pageTitle}
                        </p>
                      </div>

                      {/* Contact Preview */}
                      {prospect.contact?.name && (
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{prospect.contact.name}</span>
                        </div>
                      )}

                      {/* Footer Actions & Stage Mover */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <select
                          value={prospect.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStageChange(e as any, prospect.id, e.target.value as ProspectStatus)
                          }
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move: {s.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={(e) => handleDelete(e, prospect.id)}
                          className="text-slate-300 hover:text-rose-600 transition p-1"
                          title="Delete prospect"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageProspects.length === 0 && (
                    <div className="p-4 text-center text-xs text-slate-400 italic">
                      No prospects in {stage.label}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Domain & Page</th>
                  <th className="py-3 px-4">Opportunity Type</th>
                  <th className="py-3 px-4">Stage Status</th>
                  <th className="py-3 px-4">Metrics</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProspects.map((prospect) => (
                  <tr
                    key={prospect.id}
                    onClick={() => onSelectProspect(prospect)}
                    className="hover:bg-slate-50/70 transition cursor-pointer"
                  >
                    {/* Domain & URL */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{prospect.domain}</span>
                        {prospect.isDemo && (
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded uppercase font-mono">
                            Demo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {prospect.pageTitle}
                      </p>
                    </td>

                    {/* Opportunity Type */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {getOpportunityTypeLabel(prospect.opportunityType)}
                      </span>
                    </td>

                    {/* Stage Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(
                          prospect.status
                        )}`}
                      >
                        {getStatusLabel(prospect.status)}
                      </span>
                    </td>

                    {/* Metrics */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">DA {prospect.domainAuthority}</div>
                      <div className="text-[11px] text-slate-400">
                        Spam: {prospect.spamScore}% • {formatNumber(prospect.monthlyTraffic)} visits
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      {prospect.contact?.name ? (
                        <div>
                          <div className="font-medium text-slate-800">{prospect.contact.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                            {prospect.contact.email || 'No email found'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No contact attached</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={prospect.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStageChange(e as any, prospect.id, e.target.value as ProspectStatus)
                          }
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={(e) => handleDelete(e, prospect.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProspects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      No matching prospects found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
