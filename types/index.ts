export type ProspectStatus =
  | 'discovered'
  | 'qualified'
  | 'contact_found'
  | 'outreach_drafted'
  | 'in_review'
  | 'approved'
  | 'contacted'
  | 'follow_up'
  | 'negotiating'
  | 'won'
  | 'rejected'

export type OpportunityType =
  | 'guest_post'
  | 'resource_page'
  | 'broken_link'
  | 'unlinked_mention'
  | 'podcast_interview'
  | 'expert_roundup'

export type QualityTier = 'High' | 'Medium' | 'Low' | 'Flagged'

export interface ContactInfo {
  name?: string
  role?: string
  email?: string
  linkedin?: string
  twitter?: string
  isVerified?: boolean
}

export interface OutreachDraft {
  id: string
  prospectId: string
  templateId: string
  subject: string
  body: string
  sequenceStep: number // 1: Initial Pitch, 2: Follow-up #1, 3: Follow-up #2, 4: Breakup
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'rejected'
  scheduledDate?: string
  sentAt?: string
  requiresApproval: boolean
  safetyPassed: boolean
  safetyWarnings: string[]
}

export interface Prospect {
  id: string
  domain: string
  url: string
  pageTitle: string
  opportunityType: OpportunityType
  status: ProspectStatus
  niche: string
  domainAuthority: number // 1 - 100 (e.g. Moz DA / Ahrefs DR equivalent)
  spamScore: number // 0 - 100%
  monthlyTraffic: number
  relevanceScore: number // 1 - 100
  qualityTier: QualityTier
  contact: ContactInfo
  suggestedTopic?: string
  brokenLinkUrl?: string
  mentionSnippet?: string
  notes?: string
  outreachDraft?: OutreachDraft
  isApproved: boolean
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export interface EmailTemplate {
  id: string
  name: string
  opportunityType: OpportunityType
  subject: string
  body: string
  variables: string[]
  recommendedFollowUpDays: number
}

export interface CompetitorGapItem {
  id: string
  referringDomain: string
  referringUrl: string
  domainAuthority: number
  spamScore: number
  estimatedTraffic: number
  anchorText: string
  linkType: 'dofollow' | 'nofollow'
  competitorsLinked: string[] // e.g. ["competitor1.com", "competitor2.com"]
  opportunityType: OpportunityType
  niche: string
  alreadyInPipeline: boolean
  isDemo: boolean
}

export interface CompetitorDomainProfile {
  domain: string
  totalBacklinks: number
  referringDomains: number
  domainRating: number
  organicKeywords: number
  topAnchors: { anchor: string; percentage: number; type: 'branded' | 'exact' | 'partial' | 'generic' }[]
}

export interface ActivityLogItem {
  id: string
  timestamp: string
  action: string
  category: 'discovery' | 'competitor' | 'outreach' | 'safety' | 'system' | 'csv'
  severity: 'info' | 'success' | 'warning' | 'action_required'
  details: string
}

export interface AutomationSettings {
  dailyOutreachLimit: number
  maxPitchesPerDomain: number
  requireApprovalForEveryEmail: boolean
  enforceSpamScoreThreshold: boolean
  maxAllowedSpamScore: number
  minDomainAuthority: number
  followUpIntervalDays: number
  maxFollowUps: number
  senderName: string
  senderEmail: string
  senderCompany: string
  senderRole: string
  blacklistedTLDs: string[]
  blockedKeywords: string[]
  complianceFooter: string
  dataSourceMode: 'sandbox' | 'live'
  apiKeys: {
    serpApiKey?: string
    openAiKey?: string
    ahrefsKey?: string
    hunterKey?: string
    dataForSeoKey?: string
  }
}

export interface DiscoveryQueryCriteria {
  keyword: string
  niche: string
  opportunityType: OpportunityType
  targetCountry: string
  minDomainAuthority: number
  maxSpamScore: number
}

export interface GeneratedSearchQuery {
  title: string
  operatorString: string
  description: string
  expectedType: OpportunityType
}

export interface AnalyticsSummary {
  totalProspects: number
  qualifiedCount: number
  inReviewCount: number
  approvedCount: number
  contactedCount: number
  wonLiveCount: number
  rejectedCount: number
  averageDomainAuthority: number
  averageSpamScore: number
  winRatePercentage: number
  outreachSentCount: number
  activeSequences: number
  opportunityBreakdown: Record<OpportunityType, number>
  statusBreakdown: Record<ProspectStatus, number>
}

export interface Campaign {
  id: string
  name: string
  targetUrl: string
  targetKeyword: string
  targetAnchor: string
  status: 'active' | 'paused' | 'completed'
  prospectCount: number
  dispatchedCount: number
  wonCount: number
  createdAt: string
  lastDispatchedAt?: string
}

export interface BacklinkMonitorItem {
  id: string
  prospectDomain: string
  livePageUrl: string
  targetUrl: string
  anchorText: string
  linkType: 'dofollow' | 'nofollow'
  httpStatus: number
  lastChecked: string
  isVerified: boolean
  domainAuthority: number
}
