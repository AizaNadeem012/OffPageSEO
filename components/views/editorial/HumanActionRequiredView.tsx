'use client'

import React, { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Play,
  RefreshCw,
  X,
  Lock,
} from 'lucide-react'

export interface HumanActionRequiredViewProps {
  approvals: any[]
  onApprovalResolved: () => void
  onNavigateTab: (tab: string) => void
}

export const HumanActionRequiredView: React.FC<HumanActionRequiredViewProps> = ({
  approvals,
  onApprovalResolved,
  onNavigateTab,
}) => {
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const handleResolveAndResume = async (approvalId: string) => {
    setResolvingId(approvalId)
    try {
      const res = await fetch('/api/human-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId,
          action: 'resolve_and_resume',
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert(data.message)
        onApprovalResolved()
      } else {
        alert(data.error || 'Failed to resolve approval')
      }
    } catch (err: any) {
      alert(`Resolution error: ${err.message}`)
    } finally {
      setResolvingId(null)
    }
  }

  const handleDismiss = async (approvalId: string) => {
    try {
      const res = await fetch('/api/human-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId,
          action: 'dismiss',
        }),
      })
      const data = await res.json()
      if (data.success) {
        onApprovalResolved()
      }
    } catch (err: any) {
      alert(`Dismiss error: ${err.message}`)
    }
  }

  const pendingApprovals = approvals.filter((a) => a.status === 'pending')

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-1">
        <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Human Action Required & Safeguards Gateway</span>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-mono font-bold">
            {pendingApprovals.length} Pending
          </span>
        </h2>
        <p className="text-xs text-stone-500">
          RankWave strictly complies with website access terms, anti-bot controls, and CAPTCHAs. Whenever a verification challenge or manual confirmation is required, the task pauses here safely.
        </p>
      </div>

      {/* Approvals Cards */}
      <div className="space-y-4">
        {pendingApprovals.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-stone-900 text-sm">
              All Autonomous Pipelines Clear
            </h3>
            <p className="text-stone-500 font-mono max-w-md mx-auto">
              No tasks are currently paused for human action. The autonomous agent is executing all eligible operations according to your safety rules.
            </p>
          </div>
        ) : (
          pendingApprovals.map((appr) => {
            const isResolving = resolvingId === appr.id
            return (
              <div
                key={appr.id}
                className="bg-white border border-amber-300 rounded-lg p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {appr.approval_type?.replace(/_/g, ' ')}
                      </span>
                      <h3 className="text-sm font-bold text-stone-900 mt-1">
                        {appr.title}
                      </h3>
                      <span className="text-xs text-stone-500 font-mono block">
                        Portal: {appr.normalized_domain} ({appr.target_url})
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-stone-400 font-mono shrink-0">
                    Paused: {new Date(appr.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Instructions */}
                <div className="p-3.5 bg-stone-50 rounded border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans">
                  <strong>Instructions:</strong> {appr.instructions}
                </div>

                {/* Direct Action Link & Resume Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  {appr.target_url && (
                    <a
                      href={appr.target_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold font-mono underline"
                    >
                      <span>Open {appr.normalized_domain} in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleDismiss(appr.id)}
                      className="px-3 py-1.5 text-xs border border-stone-300 text-stone-600 hover:bg-stone-50 rounded font-medium transition"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => handleResolveAndResume(appr.id)}
                      disabled={isResolving}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                    >
                      {isResolving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isResolving ? 'Resuming Agent...' : 'Confirm Done & Resume Agent'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
