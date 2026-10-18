'use client'

import React, { useState } from 'react'
import { OpportunityType, ProspectStatus, QualityTier } from '@/types'
import { X, Plus, Globe, ShieldCheck } from 'lucide-react'
import { addProspect } from '@/lib/storage'

interface NewProspectModalProps {
  isOpen: boolean
  onClose: () => void
  onProspectAdded: () => void
}

export const NewProspectModal: React.FC<NewProspectModalProps> = ({
  isOpen,
  onClose,
  onProspectAdded,
}) => {
  const [domain, setDomain] = useState('')
  const [url, setUrl] = useState('')
  const [pageTitle, setPageTitle] = useState('')
  const [opportunityType, setOpportunityType] = useState<OpportunityType>('guest_post')
  const [status, setStatus] = useState<ProspectStatus>('discovered')
  const [niche, setNiche] = useState('Tech & Software')
  const [domainAuthority, setDomainAuthority] = useState(55)
  const [spamScore, setSpamScore] = useState(2)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactRole, setContactRole] = useState('')
  const [suggestedTopic, setSuggestedTopic] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!domain.trim()) return

    const cleanDomain = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const targetUrl = url.trim() || `https://${cleanDomain}`
    const title = pageTitle.trim() || `${cleanDomain} Editorial Target`

    const qualityTier: QualityTier =
      spamScore > 25 ? 'Flagged' : domainAuthority >= 80 ? 'High' : domainAuthority >= 50 ? 'Medium' : 'Low'

    addProspect({
      domain: cleanDomain,
      url: targetUrl,
      pageTitle: title,
      opportunityType,
      status,
      niche,
      domainAuthority,
      spamScore,
      monthlyTraffic: 150000,
      relevanceScore: 85,
      qualityTier,
      contact: {
        name: contactName.trim() || undefined,
        email: contactEmail.trim() || undefined,
        role: contactRole.trim() || undefined,
        isVerified: Boolean(contactEmail.trim()),
      },
      suggestedTopic: suggestedTopic.trim() || undefined,
      notes: notes.trim() || 'Manually added prospect',
      isApproved: status === 'approved' || status === 'won',
      isDemo: false,
    })

    onProspectAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">Add New Prospect to Pipeline</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Root Domain *</label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. techbeacon.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Specific Page URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://techbeacon.com/contribute"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Page / Article Title</label>
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Write for TechBeacon Contributor Guidelines"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Opportunity Type</label>
                <select
                  value={opportunityType}
                  onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="guest_post">Guest Post</option>
                  <option value="resource_page">Resource Page</option>
                  <option value="broken_link">Broken Link</option>
                  <option value="unlinked_mention">Unlinked Mention</option>
                  <option value="podcast_interview">Podcast Interview</option>
                  <option value="expert_roundup">Expert Roundup</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Domain Authority (DA)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={domainAuthority}
                  onChange={(e) => setDomainAuthority(parseInt(e.target.value, 10) || 50)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Spam Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={spamScore}
                  onChange={(e) => setSpamScore(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alex@techbeacon.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Role / Title</label>
                <input
                  type="text"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="Editorial Director"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Proposed Topic / Pitch Angle</label>
              <input
                type="text"
                value={suggestedTopic}
                onChange={(e) => setSuggestedTopic(e.target.value)}
                placeholder="e.g. High-performance API security benchmarks"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Internal Campaign Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Context, editorial requirements, deadlines..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save to Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
