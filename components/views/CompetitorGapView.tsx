'use client'

import React, { useState } from 'react'
import {
  CompetitorGapItem,
  CompetitorDomainProfile,
  Prospect,
  AutomationSettings,
} from '@/types'
import {
  Crosshair,
  Globe,
  ExternalLink,
  Plus,
  Check,
  ShieldCheck,
  BarChart2,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import {
  INITIAL_COMPETITOR_GAPS,
  INITIAL_COMPETITOR_PROFILES,
} from '@/lib/sample-data'
import { addProspect, getProspects } from '@/lib/storage'
import { formatNumber, getOpportunityTypeLabel } from '@/lib/utils'

interface CompetitorGapViewProps {
  settings: AutomationSettings
  onProspectAdded: () => void
  onNavigateTab: (tabId: string) => void
}

export const CompetitorGapView: React.FC<CompetitorGapViewProps> = ({
  settings,
  onProspectAdded,
  onNavigateTab,
}) => {
  const [gaps, setGaps] = useState<CompetitorGapItem[]>(INITIAL_COMPETITOR_GAPS)
  const [profiles] = useState<CompetitorDomainProfile[]>(INITIAL_COMPETITOR_PROFILES)
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all')
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set())

  const filteredGaps = gaps.filter((item) => {
    if (selectedCompetitor === 'all') return true
    return item.competitorsLinked.includes(selectedCompetitor)
  })

  const handleClaimOpportunity = (gap: CompetitorGapItem) => {
    addProspect({
      domain: gap.referringDomain,
      url: gap.referringUrl,
      pageTitle: `Competitor Link Gap: ${gap.referringDomain}`,
      opportunityType: gap.opportunityType,
      status: 'discovered',
      niche: gap.niche,
      domainAuthority: gap.domainAuthority,
      spamScore: gap.spamScore,
      monthlyTraffic: gap.estimatedTraffic,
      relevanceScore: 92,
      qualityTier: gap.domainAuthority >= 80 ? 'High' : 'Medium',
      contact: {
        role: 'Editorial Curator',
      },
      suggestedTopic: `Gap opportunity linking to ${gap.competitorsLinked.join(', ')} with anchor "${gap.anchorText}"`,
      notes: `Extracted from Competitor Link Gap analysis. Overlap: ${gap.competitorsLinked.length} competitors.`,
      isApproved: false,
      isDemo: true,
    })

    setClaimedIds((prev) => {
      const next = new Set(prev)
      next.add(gap.id)
      return next
    })
    onProspectAdded()
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1 border border-indigo-200">
            <Crosshair className="w-3.5 h-3.5" /> Competitive Intelligence
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Competitor Backlink Gap & Anchor Distribution
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Identify high-authority domains that endorse 2 or more of your top rivals. One-click convert overlapping domains into prioritized outreach prospects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('pipeline')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <Layers className="w-4 h-4 text-slate-500" /> View Pipeline
          </button>
        </div>
      </div>

      {/* Competitor Profiles Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((comp) => (
          <div
            key={comp.domain}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-600" />
                <span className="font-bold text-slate-900 text-sm">{comp.domain}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                DR {comp.domainRating}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 block">Referring Domains</span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatNumber(comp.referringDomains)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Backlinks</span>
                <span className="font-bold text-slate-800 text-sm">
                  {formatNumber(comp.totalBacklinks)}
                </span>
              </div>
            </div>

            {/* Anchor Distribution */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Anchor Distribution
              </span>
              {comp.topAnchors.slice(0, 3).map((a, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-700 font-mono truncate max-w-[150px]">{a.anchor}</span>
                    <span className="text-slate-400 font-semibold">{a.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-full rounded-full ${
                        a.type === 'branded'
                          ? 'bg-brand-500'
                          : a.type === 'exact'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${a.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Backlink Gap Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Intersecting Referring Domains</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                {filteredGaps.length} Targets
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Domains currently linking to competitors that represent viable partnership opportunities
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter by Rival:</span>
            <select
              value={selectedCompetitor}
              onChange={(e) => setSelectedCompetitor(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Competitors Overlap</option>
              <option value="semrush.com">Links to Semrush</option>
              <option value="ahrefs.com">Links to Ahrefs</option>
              <option value="moz.com">Links to Moz</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Referring Domain</th>
                <th className="py-3 px-3">Competitors Linked</th>
                <th className="py-3 px-3">Authority / Traffic</th>
                <th className="py-3 px-3">Competitor Anchor</th>
                <th className="py-3 px-3">Opportunity</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGaps.map((gap) => {
                const isClaimed = claimedIds.has(gap.id)

                return (
                  <tr key={gap.id} className="hover:bg-slate-50/70 transition">
                    {/* Domain & URL */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{gap.referringDomain}</span>
                        <a
                          href={gap.referringUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-700"
                          title="Open live URL"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className="text-[11px] text-slate-400 block line-clamp-1">
                        {gap.referringUrl}
                      </span>
                    </td>

                    {/* Competitors Overlap */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {gap.competitorsLinked.map((comp) => (
                          <span
                            key={comp}
                            className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono text-[10px]"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Authority & Traffic */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">DA {gap.domainAuthority}</div>
                      <div className="text-[11px] text-slate-400">
                        {formatNumber(gap.estimatedTraffic)} visits/mo
                      </div>
                    </td>

                    {/* Competitor Anchor */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        &quot;{gap.anchorText}&quot;
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                        {gap.linkType}
                      </span>
                    </td>

                    {/* Opportunity Type */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {getOpportunityTypeLabel(gap.opportunityType)}
                      </span>
                    </td>

                    {/* Claim Button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleClaimOpportunity(gap)}
                        disabled={isClaimed}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold text-xs transition ${
                          isClaimed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-brand-600 hover:bg-brand-700 text-white'
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> In Pipeline
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Claim Prospect
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
