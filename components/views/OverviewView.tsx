'use client'

import React from 'react'
import {
  Prospect,
  AutomationSettings,
  ActivityLogItem,
  AnalyticsSummary,
} from '@/types'
import {
  Globe,
  Award,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
  Search,
  Crosshair,
  Mail,
  FileSpreadsheet,
  Zap,
} from 'lucide-react'
import { formatNumber, formatDateTime, getOpportunityTypeLabel } from '@/lib/utils'

interface OverviewViewProps {
  prospects: Prospect[]
  settings: AutomationSettings
  logs: ActivityLogItem[]
  analytics: AnalyticsSummary
  onNavigateTab: (tabId: string) => void
  onSelectProspect: (prospect: Prospect) => void
  onOpenAgentCenter?: () => void
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  prospects,
  settings,
  logs,
  analytics,
  onNavigateTab,
  onSelectProspect,
  onOpenAgentCenter,
}) => {
  const pendingApprovals = prospects.filter(
    (p) => p.status === 'in_review' || (p.outreachDraft && p.outreachDraft.status === 'pending_approval')
  )

  const flaggedCount = prospects.filter((p) => p.qualityTier === 'Flagged' || p.status === 'rejected').length

  const funnelSteps = [
    { label: 'Discovered', count: analytics.statusBreakdown.discovered, color: 'bg-slate-500' },
    { label: 'Qualified', count: analytics.statusBreakdown.qualified, color: 'bg-blue-500' },
    { label: 'Drafted / In Review', count: analytics.statusBreakdown.outreach_drafted + analytics.statusBreakdown.in_review, color: 'bg-purple-500' },
    { label: 'Contacted', count: analytics.statusBreakdown.contacted + analytics.statusBreakdown.follow_up, color: 'bg-cyan-500' },
    { label: 'Won Live', count: analytics.statusBreakdown.won, color: 'bg-emerald-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200/80">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> 1-Click Autonomous SEO Agent
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            High-Authority Outreach & Backlink Acquisition
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Ethical prospecting, live contact extraction, CAN-SPAM safe outreach, aur human approval control. Real fashion & clothing backlinks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {onOpenAgentCenter && (
            <button
              onClick={onOpenAgentCenter}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition shadow-md shadow-emerald-600/25 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-white" /> ⚡ 1-Click Auto-Pilot Agent
            </button>
          )}
          <button
            onClick={() => onNavigateTab('discovery')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition border border-slate-200"
          >
            <Search className="w-4 h-4 text-slate-500" /> Discovery
          </button>
          <button
            onClick={() => onNavigateTab('outreach')}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition border border-slate-200"
          >
            <Mail className="w-4 h-4 text-slate-500" /> Outreach ({pendingApprovals.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Prospects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Pipeline Total</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{analytics.totalProspects}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all active stages</div>
        </div>

        {/* Qualified Opportunities */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-blue-600 text-xs font-medium mb-1">
            <span>Qualified Targets</span>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{analytics.qualifiedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Ready for contact find/pitch</div>
        </div>

        {/* Pending Review / Approval Gate */}
        <div className={`p-4 rounded-xl border shadow-2xs transition ${
          pendingApprovals.length > 0
            ? 'bg-amber-50/70 border-amber-200 hover:border-amber-300'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold mb-1">
            <span>Approval Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900">{pendingApprovals.length}</div>
          <div className="text-[11px] text-amber-700 mt-1">Requires user sign-off</div>
        </div>

        {/* Won Live Links */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold mb-1">
            <span>Won Live Links</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{analytics.wonLiveCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Verified live editorial</div>
        </div>

        {/* Avg Domain Authority */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Avg Domain DA</span>
            <Globe className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{analytics.averageDomainAuthority}</div>
          <div className="text-[11px] text-slate-500 mt-1">Target range: &gt; 35 DA</div>
        </div>

        {/* Toxic / Safety Flagged */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-rose-600 text-xs font-medium mb-1">
            <span>Safety Filtered</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{flaggedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Spam &gt; {settings.maxAllowedSpamScore}% auto-blocked</div>
        </div>
      </div>

      {/* Funnel & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Acquisition Funnel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Outreach Pipeline Funnel
              </h2>
              <p className="text-xs text-slate-500">
                Conversion progress from initial SERP discovery to verified live backlink
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('pipeline')}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Kanban View <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Visual Bars */}
          <div className="space-y-3 pt-2">
            {funnelSteps.map((step) => {
              const maxCount = Math.max(analytics.totalProspects, 1)
              const percentage = Math.round((step.count / maxCount) * 100)

              return (
                <div key={step.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{step.label}</span>
                    <span className="text-slate-500 font-semibold">{step.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${step.color}`}
                      style={{ width: `${Math.max(percentage, 3)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Outreach Sent</span>
              <span className="text-base font-bold text-slate-800">{analytics.outreachSentCount}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Won Win Rate</span>
              <span className="text-base font-bold text-emerald-600">{analytics.winRatePercentage}%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block">Avg Spam Score</span>
              <span className="text-base font-bold text-slate-800">{analytics.averageSpamScore}%</span>
            </div>
          </div>
        </div>

        {/* Opportunity Types Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Opportunity Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Tactics utilized across your link building portfolio
            </p>
          </div>

          <div className="space-y-2.5">
            {Object.entries(analytics.opportunityBreakdown).map(([type, count]) => {
              const label = getOpportunityTypeLabel(type as any)
              return (
                <div
                  key={type}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition text-xs"
                >
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Modules */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Quick Actions
          </h2>

          <div
            onClick={() => onNavigateTab('discovery')}
            className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-xs transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition">
                  Boolean SERP Prospecting
                </h4>
                <p className="text-xs text-slate-500">
                  Generate search queries for guest posts, roundups & resource pages
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('competitor')}
            className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-xs transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <Crosshair className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  Competitor Link Gap
                </h4>
                <p className="text-xs text-slate-500">
                  Find sites linking to multiple competitors but not to you
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('csv')}
            className="cursor-pointer bg-white p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-xs transition group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition">
                  CSV Import & Export
                </h4>
                <p className="text-xs text-slate-500">
                  Bulk import prospect spreadsheets or download client reports
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Activity & Audit Log Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Audit Trail & Safety Logs
              </h2>
              <p className="text-xs text-slate-500">
                Transparent log of autonomous queries, checks, and manual reviews
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('logs')}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View Full Audit <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {logs.slice(0, 5).map((log) => {
              return (
                <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{log.action}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-slate-500">{log.details}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
