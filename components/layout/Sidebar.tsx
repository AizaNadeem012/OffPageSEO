'use client'

import React from 'react'
import {
  LayoutDashboard,
  Search,
  Crosshair,
  Kanban,
  MailCheck,
  FileSpreadsheet,
  ScrollText,
  Sliders,
  Shield,
  ExternalLink,
  Zap,
  Rocket,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  badgeColor?: string
}

interface SidebarProps {
  currentTab: string
  onSelectTab: (tabId: string) => void
  onOpenAgentCenter?: () => void
  reviewCount: number
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAgentCenter,
  reviewCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview & Analytics',
      icon: LayoutDashboard,
    },
    {
      id: 'campaigns',
      label: 'Campaigns & Dispatcher',
      icon: Rocket,
    },
    {
      id: 'discovery',
      label: 'Opportunity Discovery',
      icon: Search,
    },
    {
      id: 'competitor',
      label: 'Competitor Gap',
      icon: Crosshair,
    },
    {
      id: 'pipeline',
      label: 'Prospect Pipeline',
      icon: Kanban,
    },
    {
      id: 'outreach',
      label: 'Outreach & Approvals',
      icon: MailCheck,
      badge: reviewCount > 0 ? reviewCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'csv',
      label: 'CSV Import & Export',
      icon: FileSpreadsheet,
    },
    {
      id: 'logs',
      label: 'Activity & Audit Logs',
      icon: ScrollText,
    },
    {
      id: 'settings',
      label: 'Automation & Safety',
      icon: Sliders,
    },
  ]

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* 1-Click Auto-Pilot Callout */}
        {onOpenAgentCenter && (
          <button
            onClick={onOpenAgentCenter}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 transition group border border-emerald-200 text-left shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition shadow-2xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-xs block text-emerald-950 leading-tight">
                  1-Click Auto-Pilot
                </span>
                <span className="text-[10px] text-emerald-700 block font-medium">
                  Autonomous Agent
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
              Run
            </span>
          </button>
        )}

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Agent Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-800 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Safety Policy Card */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Ethical Outreach Guard</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Automated submissions & CAPTCHA bypasses are permanently disabled. All outreach drafts require your approval.
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
            <span>Daily Cap:</span>
            <span className="font-semibold text-slate-700">12 pitches/day</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
