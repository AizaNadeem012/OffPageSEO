'use client'

import React from 'react'
import {
  Prospect,
  AutomationSettings,
  ActivityLogItem,
  AnalyticsSummary,
} from '@/types'
import {
  Sparkles,
  ArrowRight,
  Bot,
  Play,
  Share2,
  Database,
  Search,
  Code,
  FileText,
  PenTool,
  MoreVertical,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Activity,
  Globe,
  Mail,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

interface AgentFlowOverviewViewProps {
  prospects: Prospect[]
  settings: AutomationSettings
  logs: ActivityLogItem[]
  analytics: AnalyticsSummary
  onNavigateTab: (tabId: string) => void
  onSelectProspect: (prospect: Prospect) => void
  onOpenAgentCenter?: () => void
}

export const AgentFlowOverviewView: React.FC<AgentFlowOverviewViewProps> = ({
  prospects,
  settings,
  logs,
  analytics,
  onNavigateTab,
  onSelectProspect,
  onOpenAgentCenter,
}) => {
  const wonCount = prospects.filter((p) => p.status === 'won').length
  const pendingReviewCount = prospects.filter(
    (p) => p.status === 'in_review' || (p.outreachDraft && p.outreachDraft.status === 'pending_approval')
  ).length

  return (
    <div className="space-y-6 text-slate-100 pb-12">
      {/* 1. HERO CARD (Turn Your Ideas Into Real Results) */}
      <div className="bg-gradient-to-r from-slate-100 via-indigo-50/60 to-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI AGENT
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Turn Your Ideas Into Real Results
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-lg font-medium">
            Automate your work, analyze data, create content, manage tasks and much more — all with AI agents.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenAgentCenter}
              className="px-6 py-3.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition flex items-center gap-2 group cursor-pointer"
            >
              <span>Launch 1-Click Auto-Pilot</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3D Cute AI Robot Visual with Floating Badges */}
        <div className="relative w-full max-w-[280px] h-[200px] flex items-center justify-center shrink-0">
          {/* Subtle Ambient Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-indigo-300/40 blur-2xl -z-0"></div>

          {/* Floating Badges */}
          <div className="absolute top-2 left-4 w-9 h-9 rounded-xl bg-indigo-400 text-white flex items-center justify-center shadow-lg transform -rotate-6 animate-bounce">
            <FileText className="w-4 h-4" />
          </div>
          <div className="absolute top-4 right-6 w-9 h-9 rounded-xl bg-cyan-400 text-white flex items-center justify-center shadow-lg transform rotate-12">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="absolute bottom-4 left-6 w-9 h-9 rounded-xl bg-purple-400 text-white flex items-center justify-center shadow-lg transform rotate-6">
            <Mail className="w-4 h-4" />
          </div>
          <div className="absolute bottom-2 right-4 w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg transform -rotate-12">
            <Code className="w-4 h-4" />
          </div>

          {/* Central Stylized AI Robot Head */}
          <div className="relative z-10 w-32 h-32 rounded-3xl bg-gradient-to-tr from-white via-indigo-50 to-blue-100 border-4 border-white shadow-2xl flex flex-col items-center justify-center p-3">
            {/* Robot Face Screen */}
            <div className="w-24 h-16 rounded-2xl bg-slate-950 flex items-center justify-center gap-3 px-3 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
            </div>
            {/* Robot Mouth / Status Line */}
            <div className="w-8 h-1 rounded-full bg-indigo-400 mt-2"></div>
            {/* Robot Ear Pods */}
            <span className="absolute -left-2 top-10 w-2.5 h-6 rounded-full bg-indigo-300"></span>
            <span className="absolute -right-2 top-10 w-2.5 h-6 rounded-full bg-indigo-300"></span>
          </div>
        </div>
      </div>

      {/* 2. FOUR PASTEL ACTION CARDS (Matching AgentFlow) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Mint - Create Agent */}
        <div
          onClick={onOpenAgentCenter}
          className="bg-[#D1FAE5] text-emerald-950 rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between h-40 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-emerald-950 leading-tight">Create Agent</h3>
            <p className="text-xs text-emerald-800/80 mt-1 font-medium leading-snug">
              Launch autonomous 1-click SEO mission
            </p>
          </div>
          <div className="flex justify-end text-emerald-700 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: Lavender - Run Task */}
        <div
          onClick={onOpenAgentCenter}
          className="bg-[#EDE9FE] text-purple-950 rounded-2xl p-5 border border-purple-200/80 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between h-40 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-700 flex items-center justify-center">
            <Play className="w-5 h-5 fill-purple-700" />
          </div>
          <div>
            <h3 className="font-black text-base text-purple-950 leading-tight">Run Task</h3>
            <p className="text-xs text-purple-800/80 mt-1 font-medium leading-snug">
              Extract real verified emails from websites
            </p>
          </div>
          <div className="flex justify-end text-purple-700 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: Peach - Automate Workflow */}
        <div
          onClick={() => onNavigateTab('campaigns')}
          className="bg-[#FFEDD5] text-amber-950 rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between h-40 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-amber-950 leading-tight">Automate Workflow</h3>
            <p className="text-xs text-amber-800/80 mt-1 font-medium leading-snug">
              Set up scheduled crawls & auto-dispatch
            </p>
          </div>
          <div className="flex justify-end text-amber-700 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 4: Sky Blue - Manage Knowledge */}
        <div
          onClick={() => onNavigateTab('discovery')}
          className="bg-[#E0F2FE] text-sky-950 rounded-2xl p-5 border border-sky-200/80 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between h-40 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-base text-sky-950 leading-tight">Manage Knowledge</h3>
            <p className="text-xs text-sky-800/80 mt-1 font-medium leading-snug">
              Fashion search dorks, link indexes & criteria
            </p>
          </div>
          <div className="flex justify-end text-sky-700 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. MAIN SPLIT: "Your Active Agents" (Left) & "Recent Activity + Quick Stats" (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Your Active Agents */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Your Active Agents</h3>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Agent 1: SEO Outreach Agent */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    SEO Automation Agent
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Finds keywords, builds strategy, creates content
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-emerald-400 font-bold text-xs border border-emerald-900/40">
                  Running
                </span>
                <button
                  onClick={onOpenAgentCenter}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Agent 2: SERP Mining Agent */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    Web Development Agent
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Builds full stack projects & fixes bugs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-emerald-400 font-bold text-xs border border-emerald-900/40">
                  Running
                </span>
                <button
                  onClick={onOpenAgentCenter}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Agent 3: Research Agent */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    Research Agent
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Gathers data, summarizes and creates reports
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-emerald-400 font-bold text-xs border border-emerald-900/40">
                  Running
                </span>
                <button
                  onClick={onOpenAgentCenter}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Agent 4: Content Writer Agent */}
            <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-4 transition shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/25 flex items-center justify-center text-fuchsia-400 shrink-0">
                  <PenTool className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    Content Writer Agent
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Writes blogs, captions and social media posts
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-emerald-400 font-bold text-xs border border-emerald-900/40">
                  Running
                </span>
                <button
                  onClick={onOpenAgentCenter}
                  className="text-slate-500 hover:text-slate-300 p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recent Activity + Quick Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activity Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Recent Activity</h3>
              <button
                onClick={() => onNavigateTab('logs')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block">SEO Automation Agent</span>
                  <span className="text-[11px] text-slate-400 block">Completed 12 tasks • 10 min ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Code className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block">Web Development Agent</span>
                  <span className="text-[11px] text-slate-400 block">Generated 3 files • 25 min ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block">Research Agent</span>
                  <span className="text-[11px] text-slate-400 block">Found 8 relevant sources • 1 hour ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <PenTool className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block">Content Writer Agent</span>
                  <span className="text-[11px] text-slate-400 block">Created 5 blog drafts • 2 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white block">New Agent Created</span>
                  <span className="text-[11px] text-slate-400 block">Social Media Manager • 3 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats: 2x2 Grid of Smooth Pastel Colored Tiles */}
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Quick Stats
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Stat 1: Soft Purple -> 4 Active Agents */}
              <div className="bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-purple-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/30 text-purple-300 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">4</div>
                  <div className="text-[11px] text-purple-300 font-medium">Active Agents</div>
                </div>
              </div>

              {/* Stat 2: Soft Emerald Teal -> 18 Completed */}
              <div className="bg-[#10B981]/20 border border-[#10B981]/30 text-emerald-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/30 text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">18</div>
                  <div className="text-[11px] text-emerald-300 font-medium">Completed</div>
                </div>
              </div>

              {/* Stat 3: Soft Periwinkle Blue -> 6 Tasks Running */}
              <div className="bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-blue-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/30 text-blue-300 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">6</div>
                  <div className="text-[11px] text-blue-300 font-medium">Tasks Running</div>
                </div>
              </div>

              {/* Stat 4: Soft Peach Orange -> 99% Success Rate */}
              <div className="bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/30 text-amber-300 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">99%</div>
                  <div className="text-[11px] text-amber-300 font-medium">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quote & Sine Wave Banner */}
          <div className="bg-[#0F1424] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-semibold text-slate-300">
                Small steps with AI create big results.
              </span>
            </div>
            {/* Stylized Sine Wave Line */}
            <svg className="w-20 h-5 text-indigo-500 shrink-0 opacity-80" viewBox="0 0 100 20" fill="none">
              <path d="M0 10 Q 15 0, 30 10 T 60 10 T 90 10 T 100 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
