'use client'

import React from 'react'
import { Search, Bell, Sparkles } from 'lucide-react'

interface AgentFlowHeaderProps {
  onSearchClick?: () => void
  onOpenNotifications?: () => void
  unreadCount?: number
}

export const AgentFlowHeader: React.FC<AgentFlowHeaderProps> = ({
  onSearchClick,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  return (
    <header className="px-6 py-5 bg-[#0B0F17] flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60">
      {/* Welcome Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Good morning Raza</span>
          <span className="text-xl">☀️</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Your AI agent is ready. What would you like to do today?
        </p>
      </div>

      {/* Search, Notifications & Online Pill */}
      <div className="flex items-center gap-3">
        {/* Search Bar with Ctrl + K */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search agents, tasks..."
            className="pl-10 pr-16 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-56 sm:w-64 transition"
          />
          <span className="absolute right-3 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            Ctrl + K
          </span>
        </div>

        {/* Bell Notification */}
        <button
          onClick={onOpenNotifications}
          className="relative w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0B0F17]"></span>
          )}
        </button>

        {/* Online Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-slate-300">Online</span>
        </div>
      </div>
    </header>
  )
}
