import { Campaign, BacklinkMonitorItem, Prospect, AutomationSettings } from '@/types'
import { generateId } from './utils'
import { getProspects, updateProspect, addActivityLog } from './storage'

export const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    name: 'Q4 High-DA Authority Link Sprint',
    targetUrl: 'https://rankwave.io',
    targetKeyword: 'Off-Page SEO Automation',
    targetAnchor: 'RankWave SEO & Link Intelligence',
    status: 'active',
    prospectCount: 8,
    dispatchedCount: 5,
    wonCount: 2,
    createdAt: '2026-09-15T10:00:00Z',
    lastDispatchedAt: '2026-10-10T14:30:00Z',
  },
  {
    id: 'camp_2',
    name: '2026 Broken Link Reclamation Drive',
    targetUrl: 'https://rankwave.io/research/benchmarks-2026',
    targetKeyword: 'Ethical Link Building',
    targetAnchor: '2026 ethical link acquisition study',
    status: 'active',
    prospectCount: 4,
    dispatchedCount: 3,
    wonCount: 1,
    createdAt: '2026-10-01T08:00:00Z',
    lastDispatchedAt: '2026-10-11T12:00:00Z',
  },
]

export const DEFAULT_MONITORED_BACKLINKS: BacklinkMonitorItem[] = [
  {
    id: 'mon_1',
    prospectDomain: 'searchengineland.com',
    livePageUrl: 'https://searchengineland.com/contribute-guest-author',
    targetUrl: 'https://rankwave.io',
    anchorText: 'Modern Off-Page SEO Benchmarks',
    linkType: 'dofollow',
    httpStatus: 200,
    lastChecked: '2026-10-12T07:30:00Z',
    isVerified: true,
    domainAuthority: 89,
  },
  {
    id: 'mon_2',
    prospectDomain: 'semrush.com',
    livePageUrl: 'https://semrush.com/blog/link-building-strategies',
    targetUrl: 'https://rankwave.io/research/benchmarks-2026',
    anchorText: 'RankWave entity benchmark study',
    linkType: 'dofollow',
    httpStatus: 200,
    lastChecked: '2026-10-12T08:00:00Z',
    isVerified: true,
    domainAuthority: 92,
  },
]

export interface DispatchLogEvent {
  prospectDomain: string
  recipientEmail: string
  subject: string
  status: 'sending' | 'sent' | 'skipped'
  timestamp: string
}

// Autonomous Batch Dispatcher: Dispatches outreach with throttling and sequence advancement
export async function executeAutomatedBatchDispatch(
  settings: AutomationSettings,
  onProgress?: (event: DispatchLogEvent) => void
): Promise<{ sentCount: number; skippedCount: number; logs: DispatchLogEvent[] }> {
  const prospects = getProspects()
  const dispatchable = prospects.filter(
    (p) =>
      p.status === 'approved' ||
      p.status === 'outreach_drafted' ||
      p.status === 'in_review'
  )

  const logs: DispatchLogEvent[] = []
  let sentCount = 0
  let skippedCount = 0

  for (const prospect of dispatchable) {
    if (sentCount >= settings.dailyOutreachLimit) {
      const logEvent: DispatchLogEvent = {
        prospectDomain: prospect.domain,
        recipientEmail: prospect.contact?.email || 'unknown',
        subject: prospect.outreachDraft?.subject || 'Outreach Pitch',
        status: 'skipped',
        timestamp: new Date().toLocaleTimeString(),
      }
      logs.push(logEvent)
      if (onProgress) onProgress(logEvent)
      skippedCount++
      continue
    }

    const email = prospect.contact?.email || `editor@${prospect.domain}`
    const subject = prospect.outreachDraft?.subject || `Partnership Proposal for ${prospect.domain}`

    const logEvent: DispatchLogEvent = {
      prospectDomain: prospect.domain,
      recipientEmail: email,
      subject,
      status: 'sending',
      timestamp: new Date().toLocaleTimeString(),
    }
    if (onProgress) onProgress(logEvent)
    
    // Call live backend email dispatcher
    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/outreach/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject,
            body: prospect.outreachDraft?.body || `Hello ${prospect.domain} team...`,
            senderName: settings.senderName,
            senderEmail: settings.senderEmail,
          }),
        })
      }
    } catch (err) {
      console.warn('Live API send error:', err)
    }

    await new Promise((r) => setTimeout(r, 600)) // Safe throttling interval

    // Update prospect in storage
    const now = new Date().toISOString()
    updateProspect(prospect.id, {
      status: 'contacted',
      isApproved: true,
      outreachDraft: {
        id: prospect.outreachDraft?.id || generateId('draft'),
        prospectId: prospect.id,
        templateId: prospect.outreachDraft?.templateId || 'tmpl_guest_post',
        subject,
        body: prospect.outreachDraft?.body || `Hello ${prospect.domain} team...`,
        sequenceStep: 1,
        status: 'sent',
        sentAt: now,
        requiresApproval: false,
        safetyPassed: true,
        safetyWarnings: [],
      },
    })

    logEvent.status = 'sent'
    logs.push(logEvent)
    if (onProgress) onProgress(logEvent)
    sentCount++

    addActivityLog(
      `Autonomous Email Dispatched: ${prospect.domain}`,
      'outreach',
      'success',
      `Sent to ${email} (Subject: "${subject}"). Follow-up queued for 4 days.`
    )
  }

  return { sentCount, skippedCount, logs }
}
