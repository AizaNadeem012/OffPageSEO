'use client'

import React from 'react'
import {
  Home,
  Bot,
  CheckSquare,
  BookOpen,
  Zap,
  FileText,
  Settings,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  MailCheck,
} from 'lucide-react'

interface AgentFlowSidebarProps {
  currentTab: string
  onSelectTab: (tabId: string) => void
  onOpenAgentCenter?: () => void
  reviewCount: number
  senderEmail?: string
}

export const AgentFlowSidebar: React.FC<AgentFlowSidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAgentCenter,
  reviewCount,
  senderEmail = 'an3710828@gmail.com',
}) => {
  const navItems = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'outreach', label: 'Tasks', icon: CheckSquare, badge: reviewCount > 0 ? reviewCount : undefined },
    { id: 'discovery', label: 'Knowledge Base', icon: BookOpen },
    { id: 'campaigns', label: 'Automations', icon: Zap },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-full lg:w-64 bg-[#0B0F17] border-r border-slate-800/80 shrink-0 flex flex-col justify-between p-4 min-h-screen text-slate-300 select-none">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-tight leading-tight">
              AgentFlow
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Your AI Assistant, Works for You
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        {/* Upgrade / Agent Status Card */}
        <div className="rounded-2xl p-4 bg-gradient-to-b from-slate-900/90 to-[#0F1422] border border-indigo-900/40 space-y-2.5 relative overflow-hidden shadow-lg">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Autonomous Agent Suite</div>
            <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
              4 active agents mining backlinks, contacts & drafts.
            </p>
          </div>

          <button
            onClick={onOpenAgentCenter}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/25"
          >
            <span>Launch Auto-Pilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Account / Connected Status Row */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs hover:border-slate-700 transition cursor-pointer">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
              RZ
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-xs block truncate">
                Raza
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                SMTP Live
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
