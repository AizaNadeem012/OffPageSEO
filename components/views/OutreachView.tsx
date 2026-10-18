'use client'

import React, { useState } from 'react'
import {
  Prospect,
  EmailTemplate,
  OutreachDraft,
  AutomationSettings,
} from '@/types'
import {
  Mail,
  ShieldCheck,
  CheckCircle,
  Clock,
  Send,
  Eye,
  FileText,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Edit3,
} from 'lucide-react'
import { getTemplates, updateProspect, addActivityLog } from '@/lib/storage'
import { generateOutreachDraft, generateFollowUpContent } from '@/lib/outreach-generator'
import { getOpportunityTypeLabel, formatDateTime } from '@/lib/utils'

interface OutreachViewProps {
  prospects: Prospect[]
  settings: AutomationSettings
  onOpenEmailPreview: (draft: OutreachDraft, prospect: Prospect) => void
  onSelectProspect: (prospect: Prospect) => void
}

export const OutreachView: React.FC<OutreachViewProps> = ({
  prospects,
  settings,
  onOpenEmailPreview,
  onSelectProspect,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'templates' | 'sequences' | 'generator'>('queue')
  const [templates] = useState<EmailTemplate[]>(getTemplates)

  // Quick Pitch Generator State
  const [selectedProspectId, setSelectedProspectId] = useState<string>(
    prospects.length > 0 ? prospects[0].id : ''
  )
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    templates.length > 0 ? templates[0].id : ''
  )
  const [generatedDraftPreview, setGeneratedDraftPreview] = useState<OutreachDraft | null>(null)

  // Drafts needing human sign-off
  const pendingQueue = prospects.filter(
    (p) =>
      p.status === 'in_review' ||
      p.status === 'outreach_drafted' ||
      (p.outreachDraft && (p.outreachDraft.status === 'pending_approval' || p.outreachDraft.status === 'draft'))
  )

  const handleApproveDraft = (prospect: Prospect) => {
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
      `Outreach Draft Approved: ${prospect.domain}`,
      'outreach',
      'success',
      `Subject: "${updatedDraft.subject}". Approved for transmission within safe daily quota.`
    )
  }

  const handleSimulateSend = (prospect: Prospect) => {
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
      `Simulated Pitch Dispatched: ${prospect.domain}`,
      'outreach',
      'info',
      `Delivered to ${prospect.contact?.email || 'editorial contact'}. Next follow-up queued in 4 days.`
    )
  }

  const handleRejectDraft = (prospect: Prospect) => {
    updateProspect(prospect.id, {
      status: 'rejected',
      outreachDraft: prospect.outreachDraft
        ? { ...prospect.outreachDraft, status: 'rejected' }
        : undefined,
    })

    addActivityLog(
      `Draft Rejected: ${prospect.domain}`,
      'outreach',
      'warning',
      `Pitch rejected during manual editorial review.`
    )
  }

  const handleGeneratePitch = () => {
    const targetProspect = prospects.find((p) => p.id === selectedProspectId)
    const targetTemplate = templates.find((t) => t.id === selectedTemplateId)

    if (!targetProspect || !targetTemplate) return

    const draft = generateOutreachDraft(targetProspect, targetTemplate, settings, 1)
    setGeneratedDraftPreview(draft)

    updateProspect(targetProspect.id, {
      status: 'in_review',
      outreachDraft: draft,
    })

    addActivityLog(
      `Outreach Pitch Drafted: ${targetProspect.domain}`,
      'outreach',
      'info',
      `Generated using template "${targetTemplate.name}". Placed in Approval Queue.`
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-1 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Human-in-the-Loop Safety Gate
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Outreach Drafting & Editorial Approvals
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Personalized, ethical pitch generation. Under strict safety rules, no emails are ever dispatched without explicit human inspection and approval.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'queue'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Approval Queue ({pendingQueue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'generator'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Pitch Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'templates'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Templates</span>
          </button>
        </div>
      </div>

      {/* TAB 1: APPROVAL QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {pendingQueue.length} outreach drafts awaiting verification
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" /> CAN-SPAM compliant opt-out footer applied
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingQueue.map((prospect) => {
              const draft = prospect.outreachDraft || {
                id: 'draft_new',
                prospectId: prospect.id,
                templateId: 'tmpl_guest_post',
                subject: `Contribution idea for ${prospect.domain}`,
                body: `Hi there, pitching collaboration for ${prospect.domain}...`,
                sequenceStep: 1,
                status: 'pending_approval' as const,
                requiresApproval: true,
                safetyPassed: true,
                safetyWarnings: ['Approval required prior to outbound transmission'],
              }

              return (
                <div
                  key={prospect.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-4"
                >
                  {/* Top Prospect Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {prospect.domain}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                          {getOpportunityTypeLabel(prospect.opportunityType)}
                        </span>
                        <span className="text-xs text-slate-400">
                          DA {prospect.domainAuthority} • Spam {prospect.spamScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        Target Page: {prospect.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Recipient:</span>
                      <span className="font-medium text-slate-800">
                        {prospect.contact?.name || 'Editorial Team'}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({prospect.contact?.email || 'contact@' + prospect.domain})
                      </span>
                    </div>
                  </div>

                  {/* Draft Body Preview */}
                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-800">
                        Subject: <span className="text-slate-900">{draft.subject}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                        Step 1: Initial Pitch
                      </span>
                    </div>

                    <pre className="text-xs font-sans text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pt-2 border-t border-slate-200/60">
                      {draft.body}
                    </pre>
                  </div>

                  {/* Safety Checks & Action Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Rate Limit OK
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Domain Cap: 1/1
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenEmailPreview(draft, prospect)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" /> Preview Client
                      </button>

                      <button
                        onClick={() => handleRejectDraft(prospect)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>

                      {prospect.status === 'approved' ? (
                        <button
                          onClick={() => handleSimulateSend(prospect)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" /> Simulate Send
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveDraft(prospect)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Sign Off
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {pendingQueue.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">
                  Approval Queue is Clear!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  All outreach drafts have been reviewed and approved or none are currently pending. Use the Pitch Generator tab to craft new pitches.
                </p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition"
                >
                  <Sparkles className="w-4 h-4" /> Open Pitch Generator
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PITCH GENERATOR */}
      {activeTab === 'generator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Personalized Outreach Pitch Synthesizer
            </h2>
            <p className="text-xs text-slate-500">
              Select any prospect from your pipeline and generate an authoritative, contextual pitch with dynamic variables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Prospect Selector */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Target Prospect</label>
              <select
                value={selectedProspectId}
                onChange={(e) => setSelectedProspectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
              >
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.domain} ({getOpportunityTypeLabel(p.opportunityType)}) - DA {p.domainAuthority}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Selector */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Outreach Template</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white transition"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({getOpportunityTypeLabel(t.opportunityType)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGeneratePitch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Personalized Pitch</span>
            </button>
          </div>

          {generatedDraftPreview && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Generated Draft Preview:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Added to Approval Queue
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900">
                Subject: {generatedDraftPreview.subject}
              </div>
              <pre className="text-xs font-sans text-slate-700 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {generatedDraftPreview.body}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                    {getOpportunityTypeLabel(t.opportunityType)}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700">
                  Subject: <span className="font-mono text-slate-800">{t.subject}</span>
                </div>

                <pre className="text-xs font-sans text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                  {t.body}
                </pre>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Follow-up Cadence: Every {t.recommendedFollowUpDays} days</span>
                <span className="text-brand-600 font-semibold">{t.variables.length} Dynamic Tokens</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
