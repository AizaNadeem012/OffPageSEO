'use client'

import React, { useState } from 'react'
import {
  Search,
  Play,
  AlertTriangle,
  CheckCircle2,
  Bell,
  RefreshCw,
  Bot,
  Menu,
} from 'lucide-react'

export interface RankWaveHeaderProps {
  currentTab: string
  pendingApprovalsCount: number
  onNavigateTab: (tab: string) => void
  onTriggerQueueRun?: () => void
  isProcessingQueue?: boolean
  onToggleMobileMenu?: () => void
}

export const RankWaveHeader: React.FC<RankWaveHeaderProps> = ({
  currentTab,
  pendingApprovalsCount,
  onNavigateTab,
  onTriggerQueueRun,
  isProcessingQueue = false,
  onToggleMobileMenu,
}) => {
  const getTabTitle = (tab: string): { title: string; subtitle: string } => {
    switch (tab) {
      case 'agent_cockpit':
      case 'command_center':
        return { title: '🤖 Autonomous AI Agent Home (Prompt Box & Auto-Pilot)', subtitle: 'Provide your business prompt & backlink content once, then click Start Agent to execute autonomously' }
      case 'new_campaign':
        return { title: 'Master Campaign Setup', subtitle: 'Define comprehensive brand requirements & natural language AI rules' }
      case 'campaign_workspace':
        return { title: 'Campaign Workspace', subtitle: 'Lifecycle funnel, progression stages, and conversion tracking' }
      case 'inventory':
        return { title: 'Website Inventory', subtitle: 'Spreadsheet import (XLSX, XLS, CSV) & validated target repository' }
      case 'research':
        return { title: 'Website Research Agent', subtitle: 'Autonomous DOM exploration, opportunity detection & policy audit' }
      case 'accounts':
        return { title: 'Account Management', subtitle: 'Authorized user credentials, login states & encrypted vaults' }
      case 'content_studio':
        return { title: 'Content Studio', subtitle: 'AI-powered bespoke multi-format publishing & editorial drafts' }
      case 'publishing_queue':
        return { title: 'Publishing Queue', subtitle: 'Scheduled job dispatches, assisted submissions & worker states' }
      case 'verification':
        return { title: 'Backlink Verification', subtitle: 'Independent live DOM audits, link attributes & quality verification' }
      case 'competitor_gap':
        return { title: 'Competitor Gap Analysis', subtitle: 'Referring domain gaps and high-authority link reclamation' }
      case 'reports':
        return { title: 'Reports & Analytics', subtitle: 'Acquisition velocity, authority metrics & verifiable link records' }
      case 'automation_rules':
        return { title: 'Automation Rules', subtitle: 'Safe operational modes, rate limits, cooldowns & spam filters' }
      case 'credentials':
        return { title: 'Credentials & API Integrations', subtitle: 'AI providers, SMTP email settings & encrypted secrets' }
      case 'logs':
        return { title: 'Activity Logs', subtitle: 'Structured tamper-evident audit logs & execution history' }
      case 'human_action':
        return { title: 'Human Action Required', subtitle: 'Tasks paused for CAPTCHA, email verification, or editorial approval' }
      default:
        return { title: 'RankWave Operations', subtitle: 'Autonomous Off-Page SEO & Link Building Platform' }
    }
  }

  const tabInfo = getTabTitle(currentTab)

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 bg-white border-b border-stone-200 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-20">
      {/* Title & Subtitle with Mobile Hamburger Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition focus:outline-none shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
            <span className="truncate max-w-[150px] sm:max-w-none">{tabInfo.title}</span>
            <span className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono font-normal shrink-0">
              Production
            </span>
          </h1>
          <p className="text-xs text-stone-500 truncate hidden sm:block">
            {tabInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Human Action Alert Pill */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => onNavigateTab('human_action')}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md bg-amber-50 border border-amber-300 text-amber-800 text-[11px] sm:text-xs font-semibold hover:bg-amber-100 transition animate-pulse cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{pendingApprovalsCount} <span className="hidden sm:inline">Action{pendingApprovalsCount > 1 ? 's' : ''} Needed</span></span>
          </button>
        )}

        {/* Direct Link to AI Agent Prompt Box */}
        {currentTab !== 'agent_cockpit' && (
          <button
            onClick={() => onNavigateTab('agent_cockpit')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-emerald-400 text-xs font-semibold transition shadow-sm cursor-pointer"
            title="AI Agent Prompt Box"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="hidden md:inline">AI Agent Prompt Box</span>
            <span className="md:hidden">Agent</span>
          </button>
        )}

        {/* Execute Queue Run Button */}
        {onTriggerQueueRun && (
          <button
            onClick={onTriggerQueueRun}
            disabled={isProcessingQueue}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium transition shadow-sm cursor-pointer"
            title="Run Agent Queue"
          >
            {isProcessingQueue ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current shrink-0" />
            )}
            <span className="hidden sm:inline">{isProcessingQueue ? 'Processing...' : 'Run Agent Queue'}</span>
            <span className="sm:hidden">{isProcessingQueue ? '...' : 'Run'}</span>
          </button>
        )}

        {/* Engine Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-stone-50 border border-stone-200 text-xs text-stone-600 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Agent Live</span>
        </div>
      </div>
    </header>
  )
}
