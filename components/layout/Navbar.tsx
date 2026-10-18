'use client'

import React from 'react'
import {
  Globe,
  Plus,
  RotateCcw,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  Inbox,
  Zap,
} from 'lucide-react'
import { Prospect } from '@/types'
import { resetToDemoData } from '@/lib/storage'

interface NavbarProps {
  prospects: Prospect[]
  onOpenNewProspect: () => void
  onOpenAgentCenter: () => void
  onNavigateTab: (tabId: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  prospects,
  onOpenNewProspect,
  onOpenAgentCenter,
  onNavigateTab,
}) => {
  const wonCount = prospects.filter((p) => p.status === 'won').length
  const pendingReviewCount = prospects.filter(
    (p) => p.status === 'in_review' || (p.outreachDraft && p.outreachDraft.status === 'pending_approval')
  ).length

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset local workspace to the curated demo dataset? This will restore realistic sample prospects, competitor gap benchmarks, and audit logs.'
      )
    ) {
      resetToDemoData()
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  RankWave
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
                  SEO Agent v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Off-Page Automation & Link Equity Pipeline
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Status Pills */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('pipeline')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition"
                title="View All Pipeline Prospects"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>{prospects.length} Prospects</span>
              </button>

              <button
                onClick={() => onNavigateTab('outreach')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  pendingReviewCount > 0
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
                title="View Approval Queue"
              >
                <Inbox className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingReviewCount} Needs Review</span>
              </button>

              <button
                onClick={() => onNavigateTab('pipeline')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium hover:bg-emerald-100 transition"
                title="Won Live Backlinks"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>{wonCount} Won</span>
              </button>
            </div>

            {/* Reset / Reload Demo Data */}
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
              title="Reload sample campaign with realistic demo data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* 1-Click Auto-Pilot Button */}
            <button
              onClick={onOpenAgentCenter}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition hover:shadow-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              title="Launch 1-Click Autonomous SEO Agent"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>⚡ 1-Click Auto-Pilot</span>
            </button>

            {/* Add Prospect Button */}
            <button
              onClick={onOpenNewProspect}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Prospect</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
