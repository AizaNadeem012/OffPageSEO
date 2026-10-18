'use client'

import React, { useState } from 'react'
import {
  Briefcase,
  CheckCircle2,
  PlusCircle,
  ExternalLink,
  Target,
  Sparkles,
  ArrowRight,
  Globe,
  Tag,
  Check,
  Bot,
  Sliders,
  Layers,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'

export interface CampaignsManagerViewProps {
  campaigns: any[]
  activeCampaign: any
  onSelectCampaign: (campaign: any) => void
  onCampaignCreated: () => void
  onNavigateTab: (tab: string) => void
}

export const CampaignsManagerView: React.FC<CampaignsManagerViewProps> = ({
  campaigns = [],
  activeCampaign,
  onSelectCampaign,
  onCampaignCreated,
  onNavigateTab,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick New Campaign Form State
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [niche, setNiche] = useState('Fashion & Apparel')
  const [anchorText, setAnchorText] = useState('sustainable luxury apparel')
  const [targetLanding, setTargetLanding] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateQuickCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !websiteUrl.trim()) {
      alert('Please provide Campaign Name and Website URL.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          website_url: websiteUrl.trim(),
          niche: niche.trim(),
          preferred_anchors: [anchorText.trim() || name.trim()],
          target_landing_pages: [targetLanding.trim() || websiteUrl.trim()],
          description: description.trim() || `Off-page SEO campaign for ${name}`,
          monthly_backlink_target: 50,
          daily_action_limit: 15,
        }),
      })

      const data = await res.json()
      if (data.success) {
        onCampaignCreated()
        if (data.campaign) {
          onSelectCampaign(data.campaign)
        }
        setShowCreateModal(false)
        setName('')
        setWebsiteUrl('')
        setTargetLanding('')
        setDescription('')
      } else {
        alert(`Failed to create campaign: ${data.error}`)
      }
    } catch (err: any) {
      alert(`Error creating campaign: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-900 text-white tracking-wider">
              CAMPAIGN CONTROL HUB
            </span>
            <span className="text-xs text-stone-500 font-mono">
              Total Campaigns: {campaigns.length}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            SEO Outreach Campaigns
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Select, switch, and manage your active brand campaigns. Switching a campaign updates target keywords, preferred anchor texts, and landing pages across the entire autonomous system.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('new_campaign')}
            className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span>AI Campaign Creator</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ New Campaign</span>
          </button>
        </div>
      </div>

      {/* Active Campaign Spotlight Card */}
      {activeCampaign && (
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 text-white rounded-xl p-6 border border-emerald-500/30 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-stone-950 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <span className="w-2 h-2 rounded-full bg-stone-950 animate-pulse" />
                  Currently Active Campaign
                </span>
                <span className="text-xs text-emerald-300 font-mono">
                  ID: {activeCampaign.id}
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {activeCampaign.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-300 mt-1.5 font-mono">
                  <a
                    href={activeCampaign.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{activeCampaign.website_url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>•</span>
                  <span>Niche: {activeCampaign.niche || 'General'}</span>
                  <span>•</span>
                  <span>Goal: {activeCampaign.monthly_backlink_target || 50} Backlinks/mo</span>
                </div>
              </div>

              {activeCampaign.description && (
                <p className="text-xs text-stone-300 line-clamp-2">
                  {activeCampaign.description}
                </p>
              )}

              {/* Anchors & Target Pages snippet */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-stone-400 font-mono">Anchors:</span>
                {(() => {
                  try {
                    const anchors = JSON.parse(activeCampaign.preferred_anchors || '[]')
                    return anchors.slice(0, 3).map((a: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-emerald-300 border border-stone-700 font-mono">
                        "{a}"
                      </span>
                    ))
                  } catch {
                    return (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-stone-800 text-emerald-300 border border-stone-700 font-mono">
                        "{activeCampaign.preferred_anchors || 'Afimah Clothing Store'}"
                      </span>
                    )
                  }
                })()}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                onClick={() => onNavigateTab('agent_cockpit')}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Autonomous Agent 🤖</span>
              </button>
              <button
                onClick={() => onNavigateTab('campaign_workspace')}
                className="px-4 py-2 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-xs font-medium transition flex items-center justify-center gap-1.5 border border-stone-700"
              >
                <Sliders className="w-3.5 h-3.5 text-stone-400" />
                <span>Open Campaign Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Switcher & Selector Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 font-mono">
            Available Campaigns ({campaigns.length})
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            Click "Select as Active" to switch campaign
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((camp) => {
            const isActive = activeCampaign?.id === camp.id
            return (
              <div
                key={camp.id}
                className={`bg-white rounded-xl border p-5 transition-all shadow-sm flex flex-col justify-between gap-4 ${
                  isActive
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : 'border-stone-200 hover:border-stone-300 hover:shadow'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-600 border border-stone-200">
                      {camp.niche || 'Fashion & Apparel'}
                    </span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-mono">
                        Ready
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1">
                      {camp.name}
                    </h3>
                    <a
                      href={camp.website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 hover:underline font-mono flex items-center gap-1 mt-0.5 truncate"
                    >
                      <span>{camp.website_url}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>

                  {camp.description && (
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {camp.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                    <span>Target: {camp.monthly_backlink_target || 50}/mo</span>
                    <span>Daily Limit: {camp.daily_action_limit || 15}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {isActive ? (
                    <button
                      disabled
                      className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm opacity-90 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Current Active Campaign</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCampaign(camp)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Select as Active</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSelectCampaign(camp)
                      onNavigateTab('agent_cockpit')
                    }}
                    className="py-1.5 px-3 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition"
                    title="Launch AI Agent with this campaign"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Create New SEO Campaign
                </h3>
                <p className="text-xs text-stone-500">
                  Quickly set up a new brand or client campaign.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afimah Luxury Outerwear Fall 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.afimahclothingstore.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Niche / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fashion, Apparel & Luxury Retail"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Preferred Anchor Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. sustainable luxury apparel"
                    value={anchorText}
                    onChange={(e) => setAnchorText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Target Landing Page
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.afimahclothingstore.com/collections"
                    value={targetLanding}
                    onChange={(e) => setTargetLanding(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description / Editorial Focus
                </label>
                <textarea
                  rows={2}
                  placeholder="Bespoke sustainable clothing, luxury fabric cuts, and ethical tailoring..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create & Activate Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
