'use client'

import React, { useState } from 'react'
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Layers,
  Search,
  Users,
  PenTool,
  Send,
  CheckCircle2,
  GitFork,
  BarChart3,
  Sliders,
  KeyRound,
  FileText,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Bot,
  ChevronDown,
  Check,
  X,
} from 'lucide-react'

export interface RankWaveSidebarProps {
  currentTab: string
  onSelectTab: (tab: string) => void
  pendingApprovalsCount?: number
  activeCampaignName?: string
  campaigns?: any[]
  activeCampaign?: any
  onSelectCampaign?: (campaign: any) => void
  onCloseMobile?: () => void
}

export const RankWaveSidebar: React.FC<RankWaveSidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount = 0,
  activeCampaignName = 'Afimah Q4 Expansion',
  campaigns = [],
  activeCampaign,
  onSelectCampaign,
  onCloseMobile,
}) => {
  interface NavItem {
    id: string
    label: string
    icon: any
    badge?: number
    alert?: boolean
  }

  const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'Off-Page SEO Agent',
      items: [
        { id: 'agent_cockpit', label: '🤖 AI Agent (Prompt & Upload)', icon: Bot },
      ],
    },
    {
      title: 'Campaign Management',
      items: [
        { id: 'campaigns', label: '📁 All Campaigns', icon: Briefcase },
        { id: 'new_campaign', label: '➕ New Campaign', icon: PlusCircle },
        { id: 'campaign_workspace', label: '📊 Campaign Workspace', icon: Sliders },
      ],
    },
    {
      title: 'History & Audits',
      items: [
        { id: 'logs', label: 'Activity Logs', icon: FileText },
      ],
    },
  ]

  return (
    <aside className="w-full md:w-64 bg-white md:border-r border-stone-200 flex flex-col shrink-0 h-full md:h-screen overflow-y-auto text-stone-700 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm">
              RW
            </div>
            <div>
              <span className="font-bold text-base text-stone-900 tracking-tight block leading-tight">
                RankWave
              </span>
              <span className="text-[11px] text-stone-500 font-mono block">
                SEO Automation Agent
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Interactive Campaign Switcher Dropdown */}
        <div className="mt-3.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
            <span>Active Campaign</span>
            <span className="flex items-center gap-1 text-emerald-600 font-sans text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>

          <div className="relative">
            <select
              value={activeCampaign?.id || ''}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  onSelectTab('new_campaign')
                } else if (e.target.value === '__all__') {
                  onSelectTab('campaigns')
                } else {
                  const found = campaigns.find((c) => c.id === e.target.value)
                  if (found && onSelectCampaign) {
                    onSelectCampaign(found)
                  }
                }
              }}
              className="w-full bg-stone-50 hover:bg-stone-100/80 border border-stone-200 hover:border-stone-300 text-stone-900 text-xs rounded-md px-2.5 py-1.5 font-medium appearance-none pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs"
            >
              {campaigns.length > 0 ? (
                campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option value={activeCampaign?.id || 'default'}>
                  {activeCampaignName}
                </option>
              )}
              <option disabled>──────────</option>
              <option value="__all__">📁 View All Campaigns...</option>
              <option value="__new__">➕ Create New Campaign...</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-wider text-stone-400 uppercase font-mono">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = currentTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id)
                      onCloseMobile?.()
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-stone-900 text-white font-semibold shadow-sm'
                        : item.alert
                        ? 'bg-amber-50 text-amber-900 hover:bg-amber-100/80 border border-amber-200/60 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : item.alert
                            ? 'text-amber-600'
                            : 'text-stone-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="p-3 border-t border-stone-200 bg-stone-50/70">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-300">
              RZ
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-stone-900 text-xs block truncate leading-tight">
                Raza
              </span>
              <span className="text-[10px] text-emerald-700 font-mono block truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Agent Ready
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-stone-400 bg-white border border-stone-200 px-1.5 py-0.5 rounded">
            v2.1
          </span>
        </div>
      </div>
    </aside>
  )
}
