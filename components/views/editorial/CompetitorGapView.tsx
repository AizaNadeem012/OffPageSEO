'use client'

import React, { useState } from 'react'
import {
  GitFork,
  ExternalLink,
  Plus,
  Check,
  Search,
  Filter,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

export interface CompetitorGapViewProps {
  onTargetsUpdated: () => void
  onNavigateTab: (tab: string) => void
}

export const CompetitorGapView: React.FC<CompetitorGapViewProps> = ({
  onTargetsUpdated,
  onNavigateTab,
}) => {
  const [competitors, setCompetitors] = useState<string[]>([
    'zara.com',
    'asos.com',
    'reformation.com',
    'everlane.com',
  ])
  const [newCompetitor, setNewCompetitor] = useState('')
  const [importingId, setImportingId] = useState<string | null>(null)
  const [importedSet, setImportedSet] = useState<Set<string>>(new Set())

  // Realistic high-authority competitor backlink gaps
  const gapOpportunities = [
    {
      id: 'gap_1',
      domain: 'vogue.com',
      url: 'https://vogue.com/fashion/sustainable-luxury-guide-2026',
      da: 93,
      spam: 1,
      competitorsLinked: ['reformation.com', 'everlane.com'],
      opportunityType: 'Editorial Feature',
      category: 'Fashion & Luxury',
      anchor: 'sustainable luxury guide',
    },
    {
      id: 'gap_2',
      domain: 'harpersbazaar.com',
      url: 'https://harpersbazaar.com/fashion/bespoke-couture-designers',
      da: 90,
      spam: 1,
      competitorsLinked: ['zara.com', 'reformation.com'],
      opportunityType: 'Designer Spotlight',
      category: 'Haute Couture',
      anchor: 'bespoke couture designers',
    },
    {
      id: 'gap_3',
      domain: 'businessoffashion.com',
      url: 'https://businessoffashion.com/retail-case-studies/emerging-brands',
      da: 86,
      spam: 1,
      competitorsLinked: ['asos.com', 'everlane.com'],
      opportunityType: 'Industry Analysis',
      category: 'Fashion Business',
      anchor: 'emerging apparel brands',
    },
    {
      id: 'gap_4',
      domain: 'elle.com',
      url: 'https://elle.com/fashion/modest-contemporary-trends',
      da: 89,
      spam: 2,
      competitorsLinked: ['zara.com'],
      opportunityType: 'Style Index',
      category: 'Fashion & Lifestyle',
      anchor: 'modest contemporary trends',
    },
    {
      id: 'gap_5',
      domain: 'ecocult.com',
      url: 'https://ecocult.com/sustainable-textile-directory',
      da: 68,
      spam: 1,
      competitorsLinked: ['everlane.com', 'reformation.com'],
      opportunityType: 'Directory Listing',
      category: 'Sustainable Living',
      anchor: 'sustainable textile directory',
    },
  ]

  // Add Competitor Gap target directly into website inventory
  const handleImportGap = async (gap: any) => {
    setImportingId(gap.id)
    try {
      const res = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: 'camp_master_default',
          filename: 'competitor_gap_analysis.csv',
          rows: [
            {
              url: gap.url,
              name: gap.domain,
              category: gap.category,
              anchor: gap.anchor,
              priority: 'high',
              notes: `Discovered via Competitor Gap Analysis (Linked competitors: ${gap.competitorsLinked.join(', ')})`,
            },
          ],
          mapping: {
            website_url: 'url',
            website_name: 'name',
            category: 'category',
            preferred_anchor: 'anchor',
            priority: 'priority',
            notes: 'notes',
          },
        }),
      })

      const data = await res.json()
      if (data.success) {
        setImportedSet(new Set([...Array.from(importedSet), gap.id]))
        onTargetsUpdated()
      } else {
        alert(data.error || 'Failed to import gap')
      }
    } catch (err: any) {
      alert(`Import error: ${err.message}`)
    } finally {
      setImportingId(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <span>Competitor Link Gap Analysis</span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-medium">
            Authority Intersect
          </span>
        </h2>
        <p className="text-xs text-stone-500 max-w-3xl">
          Identifies authoritative publications and editorial resources that link to your major competitors but have not yet linked to your brand. Click "Import Target" to enqueue autonomous research.
        </p>

        {/* Competitor Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-700">Tracking:</span>
          {competitors.map((comp) => (
            <span
              key={comp}
              className="px-2.5 py-1 rounded bg-stone-100 text-stone-800 text-xs font-mono border border-stone-200"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>

      {/* Gap Opportunities Table */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 font-mono">
            High-Authority Gap Portals ({gapOpportunities.length})
          </h3>
          <span className="text-xs text-stone-500 font-mono">
            Sort: Highest Domain Authority
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-4 font-semibold">Referring Publication</th>
                <th className="py-2.5 px-4 font-semibold">Category</th>
                <th className="py-2.5 px-4 font-semibold">Authority</th>
                <th className="py-2.5 px-4 font-semibold">Competitors Linked</th>
                <th className="py-2.5 px-4 font-semibold">Opportunity Type</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {gapOpportunities.map((gap) => {
                const isImported = importedSet.has(gap.id)
                const isImporting = importingId === gap.id
                return (
                  <tr key={gap.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <span>{gap.domain}</span>
                      <a
                        href={gap.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-stone-500 hover:text-emerald-700 font-mono flex items-center gap-1 mt-0.5 truncate max-w-xs"
                      >
                        <span className="truncate">{gap.url}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      {gap.category}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      DA {gap.da}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {gap.competitorsLinked.map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-mono"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold border border-emerald-200">
                        {gap.opportunityType}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleImportGap(gap)}
                        disabled={isImported || isImporting}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1 ml-auto ${
                          isImported
                            ? 'bg-emerald-100 text-emerald-900 cursor-default'
                            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
                        }`}
                      >
                        {isImported ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Inventory</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isImporting ? 'Importing...' : 'Add to Pipeline'}</span>
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
