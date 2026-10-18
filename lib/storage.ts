'use client'

import {
  Prospect,
  AutomationSettings,
  EmailTemplate,
  CompetitorGapItem,
  ActivityLogItem,
  AnalyticsSummary,
  OpportunityType,
  ProspectStatus,
} from '@/types'
import {
  DEFAULT_SETTINGS,
  DEFAULT_TEMPLATES,
  INITIAL_PROSPECTS,
  INITIAL_COMPETITOR_GAPS,
  INITIAL_ACTIVITY_LOGS,
} from './sample-data'
import { generateId } from './utils'

const STORAGE_KEYS = {
  PROSPECTS: 'offpage_seo_prospects_v1',
  SETTINGS: 'offpage_seo_settings_v1',
  TEMPLATES: 'offpage_seo_templates_v1',
  GAPS: 'offpage_seo_gaps_v1',
  LOGS: 'offpage_seo_logs_v1',
  HAS_INITIALIZED: 'offpage_seo_initialized_v1',
}

// Memory fallback for SSR or environments without localStorage
let memoryStorage: Record<string, string> = {}

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function getItem(key: string): string | null {
  if (isStorageAvailable()) {
    try {
      return localStorage.getItem(key)
    } catch {
      return memoryStorage[key] || null
    }
  }
  return memoryStorage[key] || null
}

function setItem(key: string, value: string): void {
  if (isStorageAvailable()) {
    try {
      localStorage.setItem(key, value)
    } catch {
      memoryStorage[key] = value
    }
  } else {
    memoryStorage[key] = value
  }
  notifySubscribers()
}

// Subscription mechanism for cross-component reactivity
type StorageListener = () => void
const subscribers = new Set<StorageListener>()

export function subscribeToStorage(listener: StorageListener): () => void {
  subscribers.add(listener)
  return () => {
    subscribers.delete(listener)
  }
}

function notifySubscribers() {
  subscribers.forEach((callback) => {
    try {
      callback()
    } catch (err) {
      console.error('Storage subscriber error:', err)
    }
  })
}

export function initializeStorageIfNeeded(): void {
  const initialized = getItem(STORAGE_KEYS.HAS_INITIALIZED)
  if (!initialized) {
    resetToDemoData()
  }
}

export function resetToDemoData(): void {
  setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify(INITIAL_PROSPECTS))
  setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS))
  setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES))
  setItem(STORAGE_KEYS.GAPS, JSON.stringify(INITIAL_COMPETITOR_GAPS))
  setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS))
  setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true')
}

export function clearAllData(): void {
  setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify([]))
  setItem(STORAGE_KEYS.GAPS, JSON.stringify([]))
  setItem(
    STORAGE_KEYS.LOGS,
    JSON.stringify([
      {
        id: generateId('log'),
        timestamp: new Date().toISOString(),
        action: 'Campaign Workspace Cleared',
        category: 'system',
        severity: 'info',
        details: 'User initiated complete workspace wipe. Ready for fresh imports.',
      },
    ])
  )
}

// Prospects
export function getProspects(): Prospect[] {
  initializeStorageIfNeeded()
  const data = getItem(STORAGE_KEYS.PROSPECTS)
  if (!data) return INITIAL_PROSPECTS
  try {
    return JSON.parse(data)
  } catch {
    return INITIAL_PROSPECTS
  }
}

export function saveProspects(prospects: Prospect[]): void {
  setItem(STORAGE_KEYS.PROSPECTS, JSON.stringify(prospects))
}

export function addProspect(prospect: Omit<Prospect, 'id' | 'createdAt' | 'updatedAt'>): Prospect {
  const current = getProspects()
  const now = new Date().toISOString()
  const newProspect: Prospect = {
    ...prospect,
    id: generateId('prsp'),
    createdAt: now,
    updatedAt: now,
  }
  saveProspects([newProspect, ...current])
  addActivityLog(
    `Discovered Prospect Added: ${newProspect.domain}`,
    'discovery',
    'info',
    `Opportunity type: ${newProspect.opportunityType}, DA: ${newProspect.domainAuthority}`
  )
  return newProspect
}

export function updateProspect(id: string, updates: Partial<Prospect>): Prospect | null {
  const current = getProspects()
  const index = current.findIndex((p) => p.id === id)
  if (index === -1) return null

  const updated: Prospect = {
    ...current[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  current[index] = updated
  saveProspects([...current])
  return updated
}

export function deleteProspect(id: string): boolean {
  const current = getProspects()
  const target = current.find((p) => p.id === id)
  if (!target) return false

  const filtered = current.filter((p) => p.id !== id)
  saveProspects(filtered)
  addActivityLog(
    `Prospect Removed: ${target.domain}`,
    'discovery',
    'info',
    `Removed ${target.domain} from pipeline.`
  )
  return true
}

// Settings
export function getSettings(): AutomationSettings {
  initializeStorageIfNeeded()
  const data = getItem(STORAGE_KEYS.SETTINGS)
  if (!data) return DEFAULT_SETTINGS
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AutomationSettings): void {
  setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  addActivityLog(
    'Automation Settings Updated',
    'safety',
    'info',
    `Daily sending limit: ${settings.dailyOutreachLimit}, Manual approval required: ${settings.requireApprovalForEveryEmail}`
  )
}

// Templates
export function getTemplates(): EmailTemplate[] {
  initializeStorageIfNeeded()
  const data = getItem(STORAGE_KEYS.TEMPLATES)
  if (!data) return DEFAULT_TEMPLATES
  try {
    return JSON.parse(data)
  } catch {
    return DEFAULT_TEMPLATES
  }
}

export function saveTemplates(templates: EmailTemplate[]): void {
  setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates))
}

// Competitor Gaps
export function getCompetitorGaps(): CompetitorGapItem[] {
  initializeStorageIfNeeded()
  const data = getItem(STORAGE_KEYS.GAPS)
  if (!data) return INITIAL_COMPETITOR_GAPS
  try {
    return JSON.parse(data)
  } catch {
    return INITIAL_COMPETITOR_GAPS
  }
}

export function saveCompetitorGaps(gaps: CompetitorGapItem[]): void {
  setItem(STORAGE_KEYS.GAPS, JSON.stringify(gaps))
}

// Activity Logs
export function getActivityLogs(): ActivityLogItem[] {
  initializeStorageIfNeeded()
  const data = getItem(STORAGE_KEYS.LOGS)
  if (!data) return INITIAL_ACTIVITY_LOGS
  try {
    return JSON.parse(data)
  } catch {
    return INITIAL_ACTIVITY_LOGS
  }
}

export function addActivityLog(
  action: string,
  category: ActivityLogItem['category'],
  severity: ActivityLogItem['severity'],
  details: string
): void {
  const current = getActivityLogs()
  const newLog: ActivityLogItem = {
    id: generateId('log'),
    timestamp: new Date().toISOString(),
    action,
    category,
    severity,
    details,
  }
  const updated = [newLog, ...current].slice(0, 150) // maintain last 150 items
  setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated))
}

// Analytics Generator
export function getAnalyticsSummary(prospects: Prospect[]): AnalyticsSummary {
  const totalProspects = prospects.length
  let qualifiedCount = 0
  let inReviewCount = 0
  let approvedCount = 0
  let contactedCount = 0
  let wonLiveCount = 0
  let rejectedCount = 0
  let sumDA = 0
  let sumSpam = 0

  const statusBreakdown: Record<ProspectStatus, number> = {
    discovered: 0,
    qualified: 0,
    contact_found: 0,
    outreach_drafted: 0,
    in_review: 0,
    approved: 0,
    contacted: 0,
    follow_up: 0,
    negotiating: 0,
    won: 0,
    rejected: 0,
  }

  const opportunityBreakdown: Record<OpportunityType, number> = {
    guest_post: 0,
    resource_page: 0,
    broken_link: 0,
    unlinked_mention: 0,
    podcast_interview: 0,
    expert_roundup: 0,
  }

  for (const p of prospects) {
    statusBreakdown[p.status] = (statusBreakdown[p.status] || 0) + 1
    opportunityBreakdown[p.opportunityType] = (opportunityBreakdown[p.opportunityType] || 0) + 1

    sumDA += p.domainAuthority || 0
    sumSpam += p.spamScore || 0

    if (p.status === 'qualified' || p.status === 'contact_found') qualifiedCount++
    if (p.status === 'in_review' || p.status === 'outreach_drafted') inReviewCount++
    if (p.status === 'approved') approvedCount++
    if (p.status === 'contacted' || p.status === 'follow_up' || p.status === 'negotiating') contactedCount++
    if (p.status === 'won') wonLiveCount++
    if (p.status === 'rejected') rejectedCount++
  }

  const averageDomainAuthority = totalProspects > 0 ? Math.round(sumDA / totalProspects) : 0
  const averageSpamScore = totalProspects > 0 ? Math.round(sumSpam / totalProspects) : 0
  const totalOutreached = contactedCount + wonLiveCount
  const winRatePercentage = totalOutreached > 0 ? Math.round((wonLiveCount / (totalOutreached + inReviewCount)) * 100) : 0

  return {
    totalProspects,
    qualifiedCount,
    inReviewCount,
    approvedCount,
    contactedCount,
    wonLiveCount,
    rejectedCount,
    averageDomainAuthority,
    averageSpamScore,
    winRatePercentage,
    outreachSentCount: contactedCount + wonLiveCount,
    activeSequences: contactedCount,
    opportunityBreakdown,
    statusBreakdown,
  }
}
