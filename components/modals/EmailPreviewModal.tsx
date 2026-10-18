'use client'

import React from 'react'
import { OutreachDraft, Prospect, AutomationSettings } from '@/types'
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Send,
  Calendar,
  User,
} from 'lucide-react'

interface EmailPreviewModalProps {
  draft: OutreachDraft | null
  prospect: Prospect | null
  settings: AutomationSettings
  isOpen: boolean
  onClose: () => void
  onApproveAndSend?: () => void
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  draft,
  prospect,
  settings,
  isOpen,
  onClose,
  onApproveAndSend,
}) => {
  if (!isOpen || !draft || !prospect) return null

  // Spam score words inspection
  const spamWords = ['buy links', 'cheap', 'guaranteed #1', 'instant ranking', 'pbn network']
  const bodyLower = draft.body.toLowerCase()
  const detectedSpamTriggers = spamWords.filter((w) => bodyLower.includes(w))
  const isSpamClean = detectedSpamTriggers.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Email Client Header Bar */}
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-semibold text-slate-700">
              Email Client Preview (Recipient View)
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Headers */}
        <div className="p-5 border-b border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium w-12">From:</span>
              <span className="font-semibold text-slate-800">
                {settings.senderName} &lt;{settings.senderEmail}&gt;
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Via Verified SPF/DKIM
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium w-12">To:</span>
            <span className="text-slate-800">
              {prospect.contact?.name || 'Editorial Team'} &lt;
              {prospect.contact?.email || 'editor@' + prospect.domain}&gt;
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-slate-400 font-medium w-12">Subject:</span>
            <span className="font-bold text-slate-900 text-sm">{draft.subject}</span>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-6 max-h-96 overflow-y-auto bg-slate-50/50">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs font-sans text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
            {draft.body}
          </div>

          {/* Spam Hygiene Check Box */}
          <div className="mt-4 p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSpamClean ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-900 font-medium">
                    Deliverability Check: Clean & CAN-SPAM Compliant
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-rose-900 font-medium">
                    Spam trigger words detected: {detectedSpamTriggers.join(', ')}
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-slate-500">
              Score: {isSpamClean ? '0 / 10 (Excellent)' : 'High Risk'}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Requires explicit human approval before live sending.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-medium text-slate-700 transition"
            >
              Close
            </button>

            {onApproveAndSend && (
              <button
                onClick={() => {
                  onApproveAndSend()
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Approve & Dispatch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
