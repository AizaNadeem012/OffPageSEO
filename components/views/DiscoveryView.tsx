'use client'

import React, { useState } from 'react'
import {
  OpportunityType,
  Prospect,
  AutomationSettings,
  DiscoveryQueryCriteria,
  GeneratedSearchQuery,
} from '@/types'
import {
  Search,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { generateDiscoveryQueries, executeOpportunityDiscovery } from '@/lib/seo-engine'
import { addProspect } from '@/lib/storage'
import { getOpportunityTypeLabel, formatNumber, getQualityTierBadge } from '@/lib/utils'

interface DiscoveryViewProps {
  settings: AutomationSettings
  onProspectAdded: () => void
  onNavigateTab: (tabId: string) => void
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  settings,
  onProspectAdded,
  onNavigateTab,
}) => {
  const [criteria, setCriteria] = useState<DiscoveryQueryCriteria>({
    keyword: 'B2B SaaS Marketing',
    niche: 'Cloud Software & Analytics',
    opportunityType: 'guest_post',
    targetCountry: 'United States',
    minDomainAuthority: 40,
    maxSpamScore: 20,
  })

  const [queries, setQueries] = useState<GeneratedSearchQuery[]>(() =>
    generateDiscoveryQueries({
      keyword: 'B2B SaaS Marketing',
      niche: 'Cloud Software & Analytics',
      opportunityType: 'guest_post',
      targetCountry: 'United States',
      minDomainAuthority: 40,
      maxSpamScore: 20,
    })
  )

  const [discoveredCandidates, setDiscoveredCandidates] = useState<Prospect[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  const handleCriteriaChange = (updates: Partial<DiscoveryQueryCriteria>) => {
    const updated = { ...criteria, ...updates }
    setCriteria(updated)
    setQueries(generateDiscoveryQueries(updated))
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedQuery(text)
    setTimeout(() => setCopiedQuery(null), 2000)
  }

  const handleRunDiscovery = async () => {
    setIsSearching(true)
    try {
      const candidates = await executeOpportunityDiscovery(criteria, settings)
      setDiscoveredCandidates(candidates)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddToPipeline = (candidate: Prospect) => {
    addProspect({
      domain: candidate.domain,
      url: candidate.url,
      pageTitle: candidate.pageTitle,
      opportunityType: candidate.opportunityType,
      status: candidate.status === 'rejected' ? 'rejected' : 'discovered',
      niche: candidate.niche,
      domainAuthority: candidate.domainAuthority,
      spamScore: candidate.spamScore,
      monthlyTraffic: candidate.monthlyTraffic,
      relevanceScore: candidate.relevanceScore,
      qualityTier: candidate.qualityTier,
      contact: candidate.contact,
      suggestedTopic: candidate.suggestedTopic,
      notes: candidate.notes,
      isApproved: false,
      isDemo: true,
    })

    setAddedIds((prev) => {
      const next = new Set(prev)
      next.add(candidate.id)
      return next
    })
    onProspectAdded()
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1 border border-blue-200">
            <Search className="w-3.5 h-3.5" /> High-Intent Prospect Discovery
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Opportunity Discovery & SERP Query Engine
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Formulate targeted Google dorks for editorial submission pages, resource links, and broken URLs. Run discovery in local sandbox mode without requiring paid API tokens.
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

      {/* Discovery Criteria Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          Targeting Criteria & Prospect Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Target Keyword */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Target Keyword / Topic</label>
            <input
              type="text"
              value={criteria.keyword}
              onChange={(e) => handleCriteriaChange({ keyword: e.target.value })}
              placeholder="e.g. B2B SaaS Marketing"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Niche / Industry */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Niche / Industry</label>
            <input
              type="text"
              value={criteria.niche}
              onChange={(e) => handleCriteriaChange({ niche: e.target.value })}
              placeholder="e.g. Cloud Software"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Opportunity Type */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Tactic / Opportunity Type</label>
            <select
              value={criteria.opportunityType}
              onChange={(e) => handleCriteriaChange({ opportunityType: e.target.value as OpportunityType })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
            >
              <option value="guest_post">Guest Post / Contributor</option>
              <option value="resource_page">Resource Page Addition</option>
              <option value="broken_link">Broken Link Replacement</option>
              <option value="unlinked_mention">Unlinked Brand Mention</option>
              <option value="podcast_interview">Podcast / Expert Interview</option>
              <option value="expert_roundup">Expert Opinion Roundup</option>
            </select>
          </div>

          {/* Min DA */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="font-semibold text-slate-700">Min Domain Authority</label>
              <span className="text-brand-600 font-bold">{criteria.minDomainAuthority}</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={criteria.minDomainAuthority}
              onChange={(e) => handleCriteriaChange({ minDomainAuthority: parseInt(e.target.value, 10) })}
              className="w-full accent-brand-600 mt-2"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Safety Rule: Candidates with spam score &gt; {settings.maxAllowedSpamScore}% are automatically flagged.</span>
          </div>

          <button
            onClick={handleRunDiscovery}
            disabled={isSearching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Scanning Query SERP...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Autonomous Discovery</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Search Operators / Dorks */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            Google Dorks & Search Query Strings
          </h2>
          <span className="text-xs text-slate-400">
            Click copy to test directly in Google or Bing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {queries.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                  {q.title}
                </span>
                <code className="text-xs font-mono text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 block my-1.5 break-all">
                  {q.operatorString}
                </code>
                <p className="text-[11px] text-slate-500">{q.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(q.operatorString)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 transition"
                >
                  {copiedQuery === q.operatorString ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Dork</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(q.operatorString)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                >
                  Google <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovered Candidates Grid */}
      {discoveredCandidates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Discovered Prospects</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                {discoveredCandidates.length} Found
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              Clear labeling: Simulated local sandbox data
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveredCandidates.map((candidate) => {
              const isAdded = addedIds.has(candidate.id)
              const quality = getQualityTierBadge(candidate.qualityTier)

              return (
                <div
                  key={candidate.id}
                  className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 flex flex-col justify-between transition ${
                    candidate.qualityTier === 'Flagged'
                      ? 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header badges */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {getOpportunityTypeLabel(candidate.opportunityType)}
                      </span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${quality.classes}`}>
                        {quality.text}
                      </span>
                    </div>

                    {/* Domain & URL */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {candidate.domain}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {candidate.pageTitle}
                      </p>
                    </div>

                    {/* Authority & Spam metrics */}
                    <div className="grid grid-cols-3 gap-2 py-1.5 px-2 bg-slate-50 rounded-lg text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Authority</span>
                        <span className="font-bold text-slate-800">DA {candidate.domainAuthority}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Spam</span>
                        <span className={`font-bold ${candidate.spamScore > 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {candidate.spamScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Traffic</span>
                        <span className="font-bold text-slate-800">
                          {formatNumber(candidate.monthlyTraffic)}
                        </span>
                      </div>
                    </div>

                    {/* Contact & Angle */}
                    {candidate.contact?.name && (
                      <div className="text-xs text-slate-600">
                        <span className="text-slate-400">Contact: </span>
                        <span className="font-medium">{candidate.contact.name}</span>
                        {candidate.contact.role && ` (${candidate.contact.role})`}
                      </div>
                    )}

                    {candidate.suggestedTopic && (
                      <div className="text-xs text-slate-500 bg-slate-50/70 p-2 rounded border border-slate-100 italic">
                        &quot;{candidate.suggestedTopic}&quot;
                      </div>
                    )}
                  </div>

                  {/* Add action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      Sandbox Sim
                    </span>

                    {candidate.qualityTier === 'Flagged' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Spam Blocked
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToPipeline(candidate)}
                        disabled={isAdded}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isAdded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-brand-600 hover:bg-brand-700 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added to Pipeline
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Add to Pipeline
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
