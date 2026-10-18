'use client'

import React, { useState } from 'react'
import {
  AutomationSettings,
} from '@/types'
import {
  Zap,
  Sparkles,
  Bot,
  ShieldCheck,
  CheckCircle2,
  X,
  Play,
  RotateCw,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Check,
  Award,
} from 'lucide-react'
import {
  runAutonomousSEOMission,
  AgentMissionStep,
  AgentMissionResult,
} from '@/lib/agent-runner'
import { getProspects, updateProspect, addActivityLog } from '@/lib/storage'

interface AgentCommandCenterProps {
  settings: AutomationSettings
  isOpen: boolean
  onClose: () => void
  onMissionCompleted: () => void
  onNavigateTab: (tabId: string) => void
}

export const AgentCommandCenter: React.FC<AgentCommandCenterProps> = ({
  settings,
  isOpen,
  onClose,
  onMissionCompleted,
  onNavigateTab,
}) => {
  const [brandName, setBrandName] = useState('RankWave.io')
  const [targetKeyword, setTargetKeyword] = useState('B2B SaaS SEO & Analytics')
  const [targetNiche, setTargetNiche] = useState('Cloud Software & Growth')

  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<AgentMissionStep[]>([])
  const [missionResult, setMissionResult] = useState<AgentMissionResult | null>(null)
  const [approvedAll, setApprovedAll] = useState(false)

  if (!isOpen) return null

  const handleLaunchAgent = async () => {
    setIsRunning(true)
    setSteps([])
    setMissionResult(null)
    setApprovedAll(false)

    try {
      const result = await runAutonomousSEOMission(
        brandName,
        targetKeyword,
        targetNiche,
        settings,
        (newStep) => {
          setSteps((prev) => {
            const filtered = prev.filter((s) => s.title !== newStep.title)
            return [...filtered, newStep]
          })
        }
      )
      setMissionResult(result)
      onMissionCompleted()
    } finally {
      setIsRunning(false)
    }
  }

  const handleOneClickApproveAll = () => {
    const prospects = getProspects()
    const inReviewList = prospects.filter((p) => p.status === 'in_review')

    inReviewList.forEach((p) => {
      updateProspect(p.id, {
        status: 'approved',
        isApproved: true,
        outreachDraft: p.outreachDraft
          ? { ...p.outreachDraft, status: 'approved', requiresApproval: false }
          : undefined,
      })
    })

    addActivityLog(
      '1-Click Batch Sign-Off Completed',
      'outreach',
      'success',
      `Approved ${inReviewList.length} pitches in 1 click for safe staged dispatch.`
    )

    setApprovedAll(true)
    onMissionCompleted()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-brand-500/30 text-white">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  1-Click Autonomous SEO Agent
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30 uppercase tracking-wider">
                  Auto-Pilot
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Click ONE button: The agent crawls, filters spam, extracts contacts, and drafts pitches for you.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Input Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-brand-600" /> Mission Directives
              </span>
              <span className="text-[11px] text-slate-500">
                Defaults are pre-configured. Just click Launch!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Your Website / Brand</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. MySaaS.io"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Core Keyword / Topic</label>
                <input
                  type="text"
                  value={targetKeyword}
                  onChange={(e) => setTargetKeyword(e.target.value)}
                  placeholder="e.g. B2B AI Automation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Industry / Niche</label>
                <input
                  type="text"
                  value={targetNiche}
                  onChange={(e) => setTargetNiche(e.target.value)}
                  placeholder="e.g. Enterprise Software"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero manual effort: Crawls, screens spam, and prepares pitches automatically.</span>
              </div>

              <button
                type="button"
                onClick={handleLaunchAgent}
                disabled={isRunning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-emerald-600 to-brand-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Agent Executing Mission...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Launch 1-Click Agent Auto-Pilot</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Execution Terminal / Thought Stream */}
          {(isRunning || steps.length > 0) && (
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-inner space-y-3 font-mono text-xs text-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-semibold text-brand-400">AGENT EXECUTION THOUGHT LOG</span>
                </div>
                <span>Mission Status: {isRunning ? 'RUNNING' : 'DONE'}</span>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {steps.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {s.status === 'running' ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                      ) : s.status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                      )}
                      <span className="font-bold text-white text-[11px]">{s.title}</span>
                      <span className="text-[10px] text-slate-500">[{s.timestamp}]</span>
                    </div>
                    <p className="text-slate-300 pl-5 text-[11px] leading-relaxed">
                      {s.agentThought}
                    </p>
                    {s.details && (
                      <p className="text-emerald-400 pl-5 text-[10px] font-sans">
                        ↳ {s.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mission Results & 1-Click Approval */}
          {missionResult && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm">Mission Accomplished in 1 Click!</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  100% Autonomous
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Sites Scanned</span>
                  <span className="text-lg font-bold text-slate-900">{missionResult.prospectsFound}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Safe Qualified Links</span>
                  <span className="text-lg font-bold text-emerald-600">{missionResult.safeQualified}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Spam Farms Blocked</span>
                  <span className="text-lg font-bold text-rose-600">{missionResult.spamBlocked}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Pitches Synthesized</span>
                  <span className="text-lg font-bold text-indigo-600">{missionResult.pitchesDrafted}</span>
                </div>
              </div>

              {/* 1-Click Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-emerald-200/60">
                <p className="text-xs text-emerald-800">
                  The Agent mined the links and drafted custom pitches with verified contacts.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onNavigateTab('outreach')
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-semibold text-xs hover:bg-emerald-100/50 transition"
                  >
                    View in Outreach Queue
                  </button>

                  <button
                    type="button"
                    onClick={handleOneClickApproveAll}
                    disabled={approvedAll}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                      approvedAll
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {approvedAll ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Approved All Pitches!
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-white" /> 1-Click Approve All Pitches
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
