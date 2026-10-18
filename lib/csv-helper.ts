import { Prospect, OpportunityType, ProspectStatus, QualityTier } from '@/types'
import { generateId } from './utils'

// Robust CSV Line Parser that handles escaped quotes and internal commas
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length < 2) return []

  const parseLine = (line: string): string[] => {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // skip escaped quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())
    return values
  }

  const rawHeaders = parseLine(lines[0])
  const headers = rawHeaders.map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))

  const records: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const rawValues = parseLine(lines[i])
    if (rawValues.length === 0 || (rawValues.length === 1 && !rawValues[0])) continue

    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = rawValues[index] || ''
    })
    records.push(record)
  }

  return records
}

// Map parsed CSV record into a strongly-typed Prospect object
export function mapRecordToProspect(record: Record<string, string>): Partial<Prospect> {
  const getField = (keys: string[]): string => {
    for (const key of keys) {
      const cleaned = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (record[cleaned]) return record[cleaned]
    }
    return ''
  }

  let domain = getField(['domain', 'website', 'site', 'rootdomain'])
  const url = getField(['url', 'pageurl', 'link', 'targeturl']) || (domain ? `https://${domain}` : '')
  if (!domain && url) {
    try {
      domain = new URL(url).hostname
    } catch {
      domain = url
    }
  }

  const opportunityTypeRaw = getField(['opportunitytype', 'type', 'category', 'tactic']).toLowerCase()
  let opportunityType: OpportunityType = 'guest_post'
  if (opportunityTypeRaw.includes('broken')) opportunityType = 'broken_link'
  else if (opportunityTypeRaw.includes('resource')) opportunityType = 'resource_page'
  else if (opportunityTypeRaw.includes('mention') || opportunityTypeRaw.includes('unlinked')) opportunityType = 'unlinked_mention'
  else if (opportunityTypeRaw.includes('podcast') || opportunityTypeRaw.includes('interview')) opportunityType = 'podcast_interview'
  else if (opportunityTypeRaw.includes('roundup') || opportunityTypeRaw.includes('expert')) opportunityType = 'expert_roundup'

  const daRaw = parseInt(getField(['domainauthority', 'da', 'domainrating', 'dr', 'authority']), 10)
  const domainAuthority = isNaN(daRaw) ? 50 : Math.min(100, Math.max(1, daRaw))

  const spamRaw = parseInt(getField(['spamscore', 'spam', 'ss']), 10)
  const spamScore = isNaN(spamRaw) ? 2 : Math.min(100, Math.max(0, spamRaw))

  const trafficRaw = parseInt(getField(['monthlytraffic', 'traffic', 'visits', 'organicvisitors']), 10)
  const monthlyTraffic = isNaN(trafficRaw) ? 120000 : trafficRaw

  const statusRaw = getField(['status', 'stage', 'pipeline']).toLowerCase().replace(/\s+/g, '_')
  const validStatuses: ProspectStatus[] = [
    'discovered',
    'qualified',
    'contact_found',
    'outreach_drafted',
    'in_review',
    'approved',
    'contacted',
    'follow_up',
    'negotiating',
    'won',
    'rejected',
  ]
  const status: ProspectStatus = validStatuses.includes(statusRaw as ProspectStatus)
    ? (statusRaw as ProspectStatus)
    : 'discovered'

  const qualityTier: QualityTier =
    spamScore > 25 ? 'Flagged' : domainAuthority >= 80 ? 'High' : domainAuthority >= 50 ? 'Medium' : 'Low'

  return {
    id: generateId('prsp'),
    domain: domain || 'unknown-domain.com',
    url: url || `https://${domain}`,
    pageTitle: getField(['pagetitle', 'title', 'articletitle']) || `${domain} Editorial Page`,
    opportunityType,
    status,
    niche: getField(['niche', 'industry', 'vertical']) || 'General Technology',
    domainAuthority,
    spamScore,
    monthlyTraffic,
    relevanceScore: 85,
    qualityTier,
    contact: {
      name: getField(['contactname', 'name', 'author', 'editor']),
      role: getField(['contactrole', 'role', 'title']),
      email: getField(['contactemail', 'email']),
      linkedin: getField(['linkedin', 'profile']),
      isVerified: Boolean(getField(['contactemail', 'email'])),
    },
    suggestedTopic: getField(['suggestedtopic', 'topic', 'pitchangle']),
    notes: getField(['notes', 'comments', 'remarks']) || 'Imported via CSV',
    isApproved: status === 'approved' || status === 'won',
    isDemo: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Exports prospects to standard CSV format
export function prospectsToCSV(prospects: Prospect[]): string {
  const headers = [
    'Domain',
    'URL',
    'Page Title',
    'Opportunity Type',
    'Status',
    'Domain Authority',
    'Spam Score (%)',
    'Monthly Traffic',
    'Contact Name',
    'Contact Role',
    'Contact Email',
    'Suggested Topic',
    'Notes',
    'Created At',
  ]

  const escapeCSV = (str: string | number | undefined | null) => {
    if (str === undefined || str === null) return '""'
    const clean = String(str).replace(/"/g, '""')
    return `"${clean}"`
  }

  const rows = prospects.map((p) => [
    escapeCSV(p.domain),
    escapeCSV(p.url),
    escapeCSV(p.pageTitle),
    escapeCSV(p.opportunityType),
    escapeCSV(p.status),
    escapeCSV(p.domainAuthority),
    escapeCSV(p.spamScore),
    escapeCSV(p.monthlyTraffic),
    escapeCSV(p.contact?.name || ''),
    escapeCSV(p.contact?.role || ''),
    escapeCSV(p.contact?.email || ''),
    escapeCSV(p.suggestedTopic || ''),
    escapeCSV(p.notes || ''),
    escapeCSV(p.createdAt),
  ])

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n')
}

// Generates a beginner-friendly sample CSV file
export function generateSampleCSV(): string {
  return `Domain,URL,Page Title,Opportunity Type,Status,Domain Authority,Spam Score (%),Monthly Traffic,Contact Name,Contact Role,Contact Email,Suggested Topic,Notes
searchenginewatch.com,https://searchenginewatch.com/write-for-us,Search Engine Watch Contributor Guidelines,guest_post,qualified,85,2,450000,Sarah Miller,Editorial Director,editorial@searchenginewatch.com,Entity-First SEO Strategies in 2026,Target editorial calendar for Q4
backlinko.com,https://backlinko.com/hub/seo/link-building,Link Building Resources & Strategies,resource_page,discovered,90,1,1200000,Brian Dean,Founder,team@backlinko.com,Free benchmark tool addition,Top authority resource
quicksprout.com,https://quicksprout.com/best-seo-tools,Best SEO Software Roundup,broken_link,contact_found,78,3,310000,Lars Lofgren,Editor,lars@quicksprout.com,Fix dead link to discontinued indexer,Noticed 404 on outbound reference
saasweekly.io,https://saasweekly.io/archive/issue-210,SaaS Growth Case Studies & Unlinked Mention,unlinked_mention,in_review,71,1,190000,Hiten Shah,Curator,hiten@saasweekly.io,Add anchor link to cited benchmark study,Mentioned our study without hyperlinking`
}

// Browser-safe CSV file downloader
export function downloadCSVFile(filename: string, csvContent: string): void {
  if (typeof window === 'undefined') return
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
