'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Save,
  Check,
  RefreshCw,
  Globe,
  Tag,
  Target,
  FileText,
  Sliders,
  CheckSquare,
  Square,
  AlertCircle,
} from 'lucide-react'

export interface NewCampaignViewProps {
  onCampaignCreated: () => void
  onNavigateTab: (tab: string) => void
  existingCampaigns?: any[]
}

export const NewCampaignView: React.FC<NewCampaignViewProps> = ({
  onCampaignCreated,
  onNavigateTab,
  existingCampaigns = [],
}) => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('')
  const [isParsingAI, setIsParsingAI] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [parseNotice, setParseNotice] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: 'Afimah Clothing Q4 Global Expansion',
    website_url: 'https://www.afimahclothingstore.com',
    description: 'Direct-to-consumer sustainable luxury apparel, bespoke streetwear, and modern modest couture.',
    niche: 'Fashion, Apparel & Luxury Retail',
    target_countries: 'United States, United Kingdom, Canada, UAE, Pakistan',
    target_audience: 'Conscious fashion enthusiasts aged 22-45 seeking premium fabric craftsmanship and contemporary tailoring.',
    primary_keywords: 'luxury modest fashion, sustainable apparel brand, bespoke streetwear, designer apparel store',
    secondary_keywords: 'contemporary luxury dresses, ethical apparel manufacturing, designer ready to wear',
    target_landing_pages: 'https://www.afimahclothingstore.com, https://www.afimahclothingstore.com/collections/autumn-luxury',
    preferred_anchors: 'Afimah Clothing Store, luxury sustainable apparel, designer streetwear collection',
    brand_voice: 'Authoritative, refined, editorial, and value-focused',
    seo_objectives: 'Acquire high-DA contextual backlinks on top fashion portals, lifestyle magazines, and retail directories.',
    content_language: 'en',
    content_types: ['articles', 'business_profiles', 'directory_listings', 'guest_posts', 'community_contributions'],
    monthly_backlink_target: 50,
    daily_action_limit: 15,
    max_registrations_per_day: 5,
    link_quality_requirements: 'Domain Authority >= 40, Spam Score <= 10%, legitimate contextual editorial links only.',
    preferred_categories: 'Fashion & Apparel, Lifestyle & Culture, Sustainable Living, E-Commerce Retail',
    excluded_categories: 'Gambling, Adult, Pharma, Cryptocurrency, PBNs',
    raw_ai_instructions: '',
  })

  // Handle Natural Language AI Parsing
  const handleParseInstructions = async () => {
    if (!naturalLanguageInput.trim()) {
      alert('Please enter natural language instructions describing your business.')
      return
    }

    setIsParsingAI(true)
    setParseNotice(null)

    try {
      const res = await fetch('/api/campaigns/parse-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructions: naturalLanguageInput,
          brandName: formData.name,
          websiteUrl: formData.website_url,
        }),
      })

      const data = await res.json()
      if (data.success && data.configuration) {
        const c = data.configuration
        setFormData({
          ...formData,
          name: c.name || formData.name,
          website_url: c.websiteUrl || formData.website_url,
          description: c.description || formData.description,
          niche: c.niche || formData.niche,
          target_countries: Array.isArray(c.targetCountries) ? c.targetCountries.join(', ') : c.targetCountries || formData.target_countries,
          target_audience: c.targetAudience || formData.target_audience,
          primary_keywords: Array.isArray(c.primaryKeywords) ? c.primaryKeywords.join(', ') : c.primaryKeywords || formData.primary_keywords,
          secondary_keywords: Array.isArray(c.secondaryKeywords) ? c.secondaryKeywords.join(', ') : c.secondaryKeywords || formData.secondary_keywords,
          target_landing_pages: Array.isArray(c.targetLandingPages) ? c.targetLandingPages.join(', ') : c.targetLandingPages || formData.target_landing_pages,
          preferred_anchors: Array.isArray(c.preferredAnchors) ? c.preferredAnchors.join(', ') : c.preferredAnchors || formData.preferred_anchors,
          brand_voice: c.brandVoice || formData.brand_voice,
          seo_objectives: c.seoObjectives || formData.seo_objectives,
          content_language: c.contentLanguage || formData.content_language,
          content_types: c.contentTypes || formData.content_types,
          monthly_backlink_target: c.monthlyBacklinkTarget || formData.monthly_backlink_target,
          daily_action_limit: c.dailyActionLimit || formData.daily_action_limit,
          max_registrations_per_day: c.maxRegistrationsPerDay || formData.max_registrations_per_day,
          link_quality_requirements: c.linkQualityRequirements || formData.link_quality_requirements,
          preferred_categories: Array.isArray(c.preferredCategories) ? c.preferredCategories.join(', ') : c.preferredCategories || formData.preferred_categories,
          excluded_categories: Array.isArray(c.excludedCategories) ? c.excludedCategories.join(', ') : c.excludedCategories || formData.excluded_categories,
          raw_ai_instructions: naturalLanguageInput,
        })
        setParseNotice(`AI converted your instructions successfully into structured parameters via ${data.source}. Please review before saving.`)
      } else {
        alert(data.error || 'Failed to parse instructions')
      }
    } catch (err: any) {
      alert(`Error parsing instructions: ${err.message}`)
    } finally {
      setIsParsingAI(false)
    }
  }

  // Handle Save Campaign
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        name: formData.name,
        website_url: formData.website_url,
        description: formData.description,
        niche: formData.niche,
        target_countries: formData.target_countries.split(',').map((s) => s.trim()).filter(Boolean),
        target_audience: formData.target_audience,
        primary_keywords: formData.primary_keywords.split(',').map((s) => s.trim()).filter(Boolean),
        secondary_keywords: formData.secondary_keywords.split(',').map((s) => s.trim()).filter(Boolean),
        target_landing_pages: formData.target_landing_pages.split(',').map((s) => s.trim()).filter(Boolean),
        preferred_anchors: formData.preferred_anchors.split(',').map((s) => s.trim()).filter(Boolean),
        brand_voice: formData.brand_voice,
        seo_objectives: formData.seo_objectives,
        content_language: formData.content_language,
        content_types: formData.content_types,
        monthly_backlink_target: Number(formData.monthly_backlink_target),
        daily_action_limit: Number(formData.daily_action_limit),
        max_registrations_per_day: Number(formData.max_registrations_per_day),
        link_quality_requirements: formData.link_quality_requirements,
        preferred_categories: formData.preferred_categories.split(',').map((s) => s.trim()).filter(Boolean),
        excluded_categories: formData.excluded_categories.split(',').map((s) => s.trim()).filter(Boolean),
        raw_ai_instructions: formData.raw_ai_instructions || naturalLanguageInput,
        status: 'active',
      }

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        alert('Master Campaign successfully configured and saved to database!')
        onCampaignCreated()
        onNavigateTab('campaign_workspace')
      } else {
        alert(data.error || 'Failed to save campaign')
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleContentType = (type: string) => {
    if (formData.content_types.includes(type)) {
      setFormData({
        ...formData,
        content_types: formData.content_types.filter((t) => t !== type),
      })
    } else {
      setFormData({
        ...formData,
        content_types: [...formData.content_types, type],
      })
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* SECTION 1: Natural Language AI Campaign Architect */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Natural Language Campaign Architect
            </h2>
            <p className="text-xs text-stone-500">
              Explain your business, target audience, and link-building guidelines in plain English. The AI will synthesize all parameters.
            </p>
          </div>
        </div>

        <textarea
          rows={5}
          value={naturalLanguageInput}
          onChange={(e) => setNaturalLanguageInput(e.target.value)}
          placeholder="Example: We run Afimah Clothing Store (www.afimahclothingstore.com), a sustainable luxury apparel brand. We want high-DA dofollow backlinks on fashion magazines, apparel directories, and style blogs in the US, UK, and UAE. Our primary keywords are 'luxury modest fashion' and 'sustainable apparel brand'. Tone should be refined, authoritative, and polite. Exclude gambling, adult, and low-quality PBNs. Target 50 monthly backlinks with max 15 daily actions."
          className="w-full p-3.5 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-md placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-sans"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500">
            Clicking below runs semantic entity extraction and maps all fields into the form below.
          </span>
          <button
            type="button"
            onClick={handleParseInstructions}
            disabled={isParsingAI}
            className="px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
          >
            {isParsingAI ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isParsingAI ? 'Synthesizing with AI...' : 'Parse Instructions with AI'}</span>
          </button>
        </div>

        {parseNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{parseNotice}</span>
          </div>
        )}
      </div>

      {/* SECTION 2: Comprehensive Review & Edit Wizard */}
      <form onSubmit={handleSaveCampaign} className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-mono">
            Campaign Configuration Parameters
          </h3>
          <p className="text-xs text-stone-500">
            Review and adjust parameters before activating autonomous link acquisition
          </p>
        </div>

        {/* 1. Identity & Niche */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Niche & Industry
            </label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Brand Voice & Writing Tone
            </label>
            <input
              type="text"
              value={formData.brand_voice}
              onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* 2. Description & Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Business Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Audience
            </label>
            <textarea
              rows={3}
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              className="w-full p-2.5 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. Keywords & Anchors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Primary & Long-Tail Keywords (comma separated)
            </label>
            <input
              type="text"
              value={formData.primary_keywords}
              onChange={(e) => setFormData({ ...formData, primary_keywords: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Preferred Anchor Texts (comma separated)
            </label>
            <input
              type="text"
              value={formData.preferred_anchors}
              onChange={(e) => setFormData({ ...formData, preferred_anchors: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Landing Pages (comma separated)
            </label>
            <input
              type="text"
              value={formData.target_landing_pages}
              onChange={(e) => setFormData({ ...formData, target_landing_pages: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Countries & Geographies
            </label>
            <input
              type="text"
              value={formData.target_countries}
              onChange={(e) => setFormData({ ...formData, target_countries: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Supported Content Types */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Permitted Content Types for Autonomous Generation & Placement
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {[
              { id: 'articles', label: 'Editorial Articles' },
              { id: 'business_profiles', label: 'Business Profiles' },
              { id: 'directory_listings', label: 'Directory Listings' },
              { id: 'guest_posts', label: 'Guest Posts' },
              { id: 'community_contributions', label: 'Community Q&A' },
            ].map((ct) => {
              const isChecked = formData.content_types.includes(ct.id)
              return (
                <button
                  type="button"
                  key={ct.id}
                  onClick={() => toggleContentType(ct.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-md border text-xs text-left transition ${
                    isChecked
                      ? 'border-stone-900 bg-stone-900 text-white font-medium'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                  )}
                  <span className="truncate">{ct.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Limits & Quality Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Monthly Backlink Target
            </label>
            <input
              type="number"
              value={formData.monthly_backlink_target}
              onChange={(e) => setFormData({ ...formData, monthly_backlink_target: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Daily Action Limit
            </label>
            <input
              type="number"
              value={formData.daily_action_limit}
              onChange={(e) => setFormData({ ...formData, daily_action_limit: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Max Registrations / Day
            </label>
            <input
              type="number"
              value={formData.max_registrations_per_day}
              onChange={(e) => setFormData({ ...formData, max_registrations_per_day: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* 6. Exclusions & Quality Threshold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Link Quality Requirements
            </label>
            <input
              type="text"
              value={formData.link_quality_requirements}
              onChange={(e) => setFormData({ ...formData, link_quality_requirements: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Excluded Website Categories (Negative Filters)
            </label>
            <input
              type="text"
              value={formData.excluded_categories}
              onChange={(e) => setFormData({ ...formData, excluded_categories: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:border-stone-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab('command_center')}
            className="px-4 py-2 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 transition shadow-sm disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving Configuration...' : 'Save & Activate Campaign'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
