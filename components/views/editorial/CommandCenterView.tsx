'use client'

import React from 'react'
import {
  Layers,
  CheckCircle2,
  TrendingUp,
  Clock,
  Play,
  Upload,
  Search,
  PenTool,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export interface CommandCenterViewProps {
  analytics: {
    totalWebsites: number
    totalBacklinks: number
    verifiedBacklinks: number
    pendingApprovals: number
    totalDrafts: number
    totalAccounts: number
    activeTasks: number
    averageDomainAuthority: number
    statusBreakdown: Record<string, number>
  }
  campaign: any
  settings: any
  logs: any[]
  onNavigateTab: (tab: string) => void
  onRunQueue: () => void
  isProcessingQueue: boolean
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  analytics,
  campaign,
  settings,
  logs,
  onNavigateTab,
  onRunQueue,
  isProcessingQueue,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Active Campaign Headline Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Active Campaign
            </span>
            <span className="text-xs text-stone-500 font-mono">
              Target: {campaign?.website_url || 'https://www.afimahclothingstore.com'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {campaign?.name || 'Afimah Clothing Q4 Global Expansion'}
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            {campaign?.description || 'Autonomous link building and editorial outreach across verified fashion publications and directories.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('campaign_workspace')}
            className="px-3 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium transition"
          >
            View Workspace
          </button>
          <button
            onClick={onRunQueue}
            disabled={isProcessingQueue}
            className="px-4 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isProcessingQueue ? 'Running...' : 'Dispatch Queue'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1.5">
            <span>Target Inventory</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {analytics.totalWebsites}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{analytics.statusBreakdown?.eligible || 0} eligible</span>
            <span>targets in queue</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1.5">
            <span>Verified Backlinks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {analytics.verifiedBacklinks}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{analytics.totalBacklinks}</span>
            <span>total live submissions</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1.5">
            <span>Average Domain Rating</span>
            <TrendingUp className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            DA {analytics.averageDomainAuthority || 50}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            High editorial authority filter active
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-1.5">
            <span>Active Task Queue</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {analytics.activeTasks}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Throttled daily cap: {settings?.daily_task_limit || 15}/day</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Funnel & Rapid Action Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Autonomous Pipeline Stages */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                End-to-End Link Building Funnel
              </h3>
              <p className="text-xs text-stone-500">
                Live progression of target websites through the 10-step automation pipeline
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {settings?.mode?.replace(/_/g, ' ').toUpperCase() || 'MAXIMUM SAFE'}
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                step: '01',
                title: 'Target Inventory & Deduplication',
                count: analytics.totalWebsites,
                desc: 'Normalized domains, validated against SSRF and duplicate entries',
                status: 'Completed',
                tab: 'inventory',
              },
              {
                step: '02',
                title: 'Autonomous Research & Policy Audit',
                count: analytics.statusBreakdown?.eligible || 0,
                desc: 'Controlled HTTP & DOM observation, opportunity classification',
                status: 'Active',
                tab: 'research',
              },
              {
                step: '03',
                title: 'Account Onboarding & Credentials',
                count: analytics.totalAccounts,
                desc: 'Legitimate registration, encrypted credentials (AES-256), CAPTCHA protection',
                status: 'Active',
                tab: 'accounts',
              },
              {
                step: '04',
                title: 'Bespoke AI Content Generation',
                count: analytics.totalDrafts,
                desc: 'Tailored articles, directory listings, guest posts with natural anchor placement',
                status: 'Active',
                tab: 'content_studio',
              },
              {
                step: '05',
                title: 'Verified Published Backlinks',
                count: analytics.verifiedBacklinks,
                desc: 'Independent DOM checks verifying target URL, anchor text, and rel attributes',
                status: 'Verified Live',
                tab: 'verification',
              },
            ].map((f) => (
              <div
                key={f.step}
                onClick={() => onNavigateTab(f.tab)}
                className="flex items-center justify-between p-3 rounded-md bg-stone-50/70 border border-stone-200/80 hover:bg-stone-100/60 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    {f.step}
                  </span>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-stone-900 block truncate">
                      {f.title}
                    </span>
                    <span className="text-[11px] text-stone-500 block truncate">
                      {f.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-stone-800">
                    {f.count}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Actions & Audit Stream */}
        <div className="space-y-6">
          {/* Quick Action Buttons */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('inventory')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-stone-200 hover:border-stone-300 bg-white text-xs text-stone-800 font-medium transition text-left"
              >
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Upload XLSX / CSV Spreadsheet</span>
              </button>
              <button
                onClick={() => onNavigateTab('new_campaign')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-stone-200 hover:border-stone-300 bg-white text-xs text-stone-800 font-medium transition text-left"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>New Campaign Wizard (AI Parser)</span>
              </button>
              <button
                onClick={() => onNavigateTab('content_studio')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-stone-200 hover:border-stone-300 bg-white text-xs text-stone-800 font-medium transition text-left"
              >
                <PenTool className="w-4 h-4 text-stone-500" />
                <span>Generate Bespoke Content Drafts</span>
              </button>
              <button
                onClick={() => onNavigateTab('verification')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-stone-200 hover:border-stone-300 bg-white text-xs text-stone-800 font-medium transition text-left"
              >
                <CheckCircle2 className="w-4 h-4 text-stone-500" />
                <span>Audit & Verify Published Backlinks</span>
              </button>
            </div>
          </div>

          {/* Recent Operational Audit Stream */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
                Recent Audit Trail
              </h3>
              <button
                onClick={() => onNavigateTab('logs')}
                className="text-[11px] text-emerald-700 hover:underline font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs border-b border-stone-100 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-stone-400 text-[10px] font-mono">
                    <span>{log.category?.toUpperCase()}</span>
                    <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="font-medium text-stone-800 block truncate mt-0.5">
                    {log.action}
                  </span>
                  <span className="text-stone-500 text-[11px] block truncate">
                    {log.details}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
