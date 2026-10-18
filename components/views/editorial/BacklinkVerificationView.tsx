'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  FileCheck,
} from 'lucide-react'

export interface BacklinkVerificationViewProps {
  backlinks: any[]
  onVerificationCompleted: () => void
  onNavigateTab: (tab: string) => void
}

export const BacklinkVerificationView: React.FC<BacklinkVerificationViewProps> = ({
  backlinks,
  onVerificationCompleted,
  onNavigateTab,
}) => {
  // Live Auditor Input Form State
  const [sourceUrl, setSourceUrl] = useState('')
  const [targetLandingPage, setTargetLandingPage] = useState('https://www.afimahclothingstore.com')
  const [expectedAnchor, setExpectedAnchor] = useState('contemporary luxury dresses')
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResult, setAuditResult] = useState<any | null>(null)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  // Run Live Verification Form
  const handleRunLiveAudit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sourceUrl.trim()) {
      alert('Please enter a published page URL.')
      return
    }

    setIsAuditing(true)
    setAuditResult(null)

    try {
      const res = await fetch('/api/backlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePageUrl: sourceUrl,
          targetLandingPage,
          expectedAnchor,
        }),
      })

      const data = await res.json()
      if (data.success && data.result) {
        setAuditResult(data.result)
        onVerificationCompleted()
      } else {
        alert(data.error || 'Audit failed')
      }
    } catch (err: any) {
      alert(`Audit error: ${err.message}`)
    } finally {
      setIsAuditing(false)
    }
  }

  // Re-verify existing backlink
  const handleReverifyBacklink = async (id: string) => {
    setVerifyingId(id)
    try {
      const res = await fetch('/api/backlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backlinkId: id }),
      })
      const data = await res.json()
      if (data.success) {
        onVerificationCompleted()
        alert(`Verification updated: ${data.result.verificationStatus} (${data.result.linkAttribute})`)
      }
    } catch (err: any) {
      alert(`Verification error: ${err.message}`)
    } finally {
      setVerifyingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>Independent Backlink Verification & Quality Auditor</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
              Live DOM Inspector
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Performs autonomous live web fetches to independently locate target URLs, analyze anchor texts, inspect link attributes (<span className="font-mono">dofollow</span>, <span className="font-mono">nofollow</span>, <span className="font-mono">ugc</span>, <span className="font-mono">sponsored</span>), and compile verifiable proof.
          </p>
        </div>

        {/* Live URL Audit Tool */}
        <form onSubmit={handleRunLiveAudit} className="pt-3 border-t border-stone-100 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Published Source Page URL *
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://fashionmagazine.com/style-trends-2026"
                className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded font-mono focus:outline-none focus:border-stone-900"
                required
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Target Landing Page *
              </label>
              <input
                type="url"
                value={targetLandingPage}
                onChange={(e) => setTargetLandingPage(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded font-mono focus:outline-none focus:border-stone-900"
                required
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isAuditing}
                className="w-full px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm disabled:opacity-50"
              >
                {isAuditing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{isAuditing ? 'Auditing DOM...' : 'Verify Backlink Live'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Audit Observation Output */}
        {auditResult && (
          <div className={`p-4 rounded-md border text-xs space-y-2.5 ${
            auditResult.linkFound ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold flex items-center gap-1.5">
                {auditResult.linkFound ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>STATUS: {auditResult.verificationStatus?.toUpperCase()}</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/80 border border-current">
                HTTP {auditResult.httpStatus} • {auditResult.linkAttribute?.toUpperCase()}
              </span>
            </div>

            <p className="leading-relaxed">
              {auditResult.qualityAssessment}
            </p>

            <div className="p-2.5 rounded bg-black/10 font-mono text-[11px] break-all">
              {auditResult.evidenceText}
            </div>
          </div>
        )}
      </div>

      {/* Monitored Backlinks Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
            Monitored Verified Backlinks ({backlinks.length})
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Independent crawler verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Source Portal / Page</th>
                <th className="py-2.5 px-4 font-semibold">Anchor Text</th>
                <th className="py-2.5 px-4 font-semibold">Attribute</th>
                <th className="py-2.5 px-4 font-semibold">Quality Score</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Last Checked</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {backlinks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-stone-400 font-mono">
                    No verified backlinks recorded yet. Run the live verification auditor above or dispatch publishing jobs.
                  </td>
                </tr>
              ) : (
                backlinks.map((b) => {
                  const isReverifying = verifyingId === b.id
                  return (
                    <tr key={b.id} className="hover:bg-stone-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-900 block truncate max-w-xs">
                          {b.source_website}
                        </span>
                        <a
                          href={b.source_page_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-stone-500 hover:text-emerald-700 font-mono flex items-center gap-1 mt-0.5 truncate max-w-xs"
                        >
                          <span className="truncate">{b.source_page_url}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </td>

                      <td className="py-3 px-4 font-medium text-stone-800">
                        "{b.anchor_text}"
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.link_attribute === 'dofollow'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {b.link_attribute?.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {b.quality_score || 85}/100
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            b.verification_status === 'verified'
                              ? 'bg-emerald-100 text-emerald-900'
                              : b.verification_status === 'removed'
                              ? 'bg-rose-100 text-rose-900'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {b.verification_status?.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {new Date(b.last_checked_date).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleReverifyBacklink(b.id)}
                          disabled={isReverifying}
                          className="px-2.5 py-1 text-[11px] border border-stone-200 rounded text-stone-700 hover:bg-stone-100 font-mono transition disabled:opacity-50"
                        >
                          {isReverifying ? 'Auditing...' : 'Re-verify'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
