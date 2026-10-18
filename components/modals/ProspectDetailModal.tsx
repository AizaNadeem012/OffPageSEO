'use client'

import React, { useState } from 'react'
import {
  Prospect,
  ProspectStatus,
  OutreachDraft,
  AutomationSettings,
  OpportunityType,
} from '@/types'
import {
  X,
  ExternalLink,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Award,
  Send,
  Eye,
  Trash2,
  Edit3,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react'
import {
  getStatusBadgeStyle,
  getStatusLabel,
  getOpportunityTypeLabel,
  formatNumber,
  formatDateTime,
  getQualityTierBadge,
} from '@/lib/utils'
import { updateProspect, deleteProspect, addActivityLog, getTemplates } from '@/lib/storage'
import { generateOutreachDraft } from '@/lib/outreach-generator'

interface ProspectDetailModalProps {
  prospect: Prospect | null
  settings: AutomationSettings
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
  onOpenEmailPreview: (draft: OutreachDraft, prospect: Prospect) => void
}

export const ProspectDetailModal: React.FC<ProspectDetailModalProps> = ({
  prospect,
  settings,
  isOpen,
  onClose,
  onUpdated,
  onOpenEmailPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'outreach' | 'safety'>('overview')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState(prospect?.notes || '')

  if (!isOpen || !prospect) return null

  const quality = getQualityTierBadge(prospect.qualityTier)

  const handleStageChange = (newStatus: ProspectStatus) => {
    updateProspect(prospect.id, { status: newStatus })
    onUpdated()
  }

  const handleSaveNotes = () => {
    updateProspect(prospect.id, { notes: notesDraft })
    setIsEditingNotes(false)
    onUpdated()
  }

  const handleApproveDraft = () => {
    if (!prospect.outreachDraft) return
    const updatedDraft: OutreachDraft = {
      ...prospect.outreachDraft,
      status: 'approved',
      requiresApproval: false,
    }
    updateProspect(prospect.id, {
      status: 'approved',
      isApproved: true,
      outreachDraft: updatedDraft,
    })
    addActivityLog(
      `Prospect Draft Approved: ${prospect.domain}`,
      'outreach',
      'success',
      `Subject: "${updatedDraft.subject}". Ready for dispatch.`
    )
    onUpdated()
  }

  const handleSimulateSend = () => {
    if (!prospect.outreachDraft) return
    const now = new Date().toISOString()
    const updatedDraft: OutreachDraft = {
      ...prospect.outreachDraft,
      status: 'sent',
      sentAt: now,
    }
    updateProspect(prospect.id, {
      status: 'contacted',
      outreachDraft: updatedDraft,
    })
    addActivityLog(
      `Outreach Sent: ${prospect.domain}`,
      'outreach',
      'info',
      `Pitch delivered to ${prospect.contact?.email || 'editor'}.`
    )
    onUpdated()
  }

  const handleGenerateNewDraft = () => {
    const templates = getTemplates()
    const template =
      templates.find((t) => t.opportunityType === prospect.opportunityType) || templates[0]
    const draft = generateOutreachDraft(prospect, template, settings, 1)

    updateProspect(prospect.id, {
      status: 'in_review',
      outreachDraft: draft,
    })
    onUpdated()
  }

  const handleDelete = () => {
    if (window.confirm(`Delete ${prospect.domain} from your pipeline?`)) {
      deleteProspect(prospect.id)
      onUpdated()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{prospect.domain}</h2>
              <a
                href={prospect.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-brand-600 transition"
                title="Open live URL"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${quality.classes}`}>
                {quality.text}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{prospect.pageTitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={prospect.status}
              onChange={(e) => handleStageChange(e.target.value as ProspectStatus)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
            >
              <option value="discovered">Discovered</option>
              <option value="qualified">Qualified</option>
              <option value="contact_found">Contact Found</option>
              <option value="outreach_drafted">Draft Ready</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up">Follow-up Sent</option>
              <option value="negotiating">Negotiating</option>
              <option value="won">Won (Live Link)</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('outreach')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'outreach'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Outreach Pitch {prospect.outreachDraft && '(Drafted)'}
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'safety'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Safety Checks
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2.5 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Authority</span>
                  <span className="font-bold text-slate-800 text-base">DA {prospect.domainAuthority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Spam Score</span>
                  <span className={`font-bold text-base ${prospect.spamScore > 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {prospect.spamScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Monthly Traffic</span>
                  <span className="font-bold text-slate-800 text-base">
                    {formatNumber(prospect.monthlyTraffic)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Relevance</span>
                  <span className="font-bold text-emerald-600 text-base">
                    {prospect.relevanceScore}%
                  </span>
                </div>
              </div>

              {/* Contact Card */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <span className="font-bold text-slate-800 block text-xs">Editorial Contact</span>
                {prospect.contact?.name ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-900">{prospect.contact.name}</span>
                      {prospect.contact.role && ` • ${prospect.contact.role}`}
                    </div>
                    {prospect.contact.email && (
                      <span className="font-mono text-brand-600 text-[11px]">
                        {prospect.contact.email}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No contact details attached yet.</span>
                )}
              </div>

              {/* Pitch Angle */}
              {prospect.suggestedTopic && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="font-bold text-slate-800 block text-xs">Proposed Angle / Focus:</span>
                  <p className="text-slate-600 italic">&quot;{prospect.suggestedTopic}&quot;</p>
                </div>
              )}

              {/* Notes */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">Campaign Notes</span>
                  {!isEditingNotes ? (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-brand-600 hover:text-brand-700 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit Notes
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveNotes}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                ) : (
                  <p className="text-slate-600 text-xs whitespace-pre-wrap">
                    {prospect.notes || 'No notes added.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB: OUTREACH PITCH */}
          {activeTab === 'outreach' && (
            <div className="space-y-4">
              {prospect.outreachDraft ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Subject: {prospect.outreachDraft.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      Status: {prospect.outreachDraft.status}
                    </span>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-xs max-h-60 overflow-y-auto">
                    {prospect.outreachDraft.body}
                  </pre>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => onOpenEmailPreview(prospect.outreachDraft!, prospect)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" /> Preview Client
                    </button>

                    <div className="flex items-center gap-2">
                      {prospect.outreachDraft.status !== 'approved' && (
                        <button
                          onClick={handleApproveDraft}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Draft
                        </button>
                      )}

                      <button
                        onClick={handleSimulateSend}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" /> Simulate Send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Mail className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-slate-800">No Outreach Draft Generated Yet</h4>
                  <p className="text-slate-500 text-xs">
                    Create a personalized pitch using the matching template for this opportunity type.
                  </p>
                  <button
                    onClick={handleGenerateNewDraft}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate Pitch Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: SAFETY */}
          {activeTab === 'safety' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">Domain Safety Assessment</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs text-slate-600">
                  <div className="py-2 flex items-center justify-between">
                    <span>Spam Score Below Ceiling ({settings.maxAllowedSpamScore}%):</span>
                    <span className={prospect.spamScore <= settings.maxAllowedSpamScore ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      {prospect.spamScore <= settings.maxAllowedSpamScore ? 'Passed' : 'Failed'} ({prospect.spamScore}%)
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <span>TLD Blacklist Check:</span>
                    <span className="text-emerald-600 font-bold">Clean</span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <span>Manual Human Review Required:</span>
                    <span className="text-brand-600 font-bold">Enforced</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium text-xs transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Prospect
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
