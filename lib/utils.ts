import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { OpportunityType, ProspectStatus, QualityTier } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

export function getOpportunityTypeLabel(type: OpportunityType): string {
  switch (type) {
    case 'guest_post':
      return 'Guest Post'
    case 'resource_page':
      return 'Resource Page'
    case 'broken_link':
      return 'Broken Link'
    case 'unlinked_mention':
      return 'Unlinked Mention'
    case 'podcast_interview':
      return 'Podcast / Interview'
    case 'expert_roundup':
      return 'Expert Roundup'
    default:
      return type
  }
}

export function getStatusLabel(status: ProspectStatus): string {
  switch (status) {
    case 'discovered':
      return 'Discovered'
    case 'qualified':
      return 'Qualified'
    case 'contact_found':
      return 'Contact Found'
    case 'outreach_drafted':
      return 'Draft Ready'
    case 'in_review':
      return 'In Review'
    case 'approved':
      return 'Approved'
    case 'contacted':
      return 'Contacted'
    case 'follow_up':
      return 'Follow-up Sent'
    case 'negotiating':
      return 'Negotiating'
    case 'won':
      return 'Won (Live)'
    case 'rejected':
      return 'Rejected'
    default:
      return status
  }
}

export function getStatusBadgeStyle(status: ProspectStatus): string {
  switch (status) {
    case 'discovered':
      return 'bg-slate-100 text-slate-700 border-slate-300'
    case 'qualified':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'contact_found':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'outreach_drafted':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'in_review':
      return 'bg-amber-50 text-amber-700 border-amber-300 ring-1 ring-amber-300/40'
    case 'approved':
      return 'bg-teal-50 text-teal-700 border-teal-200'
    case 'contacted':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200'
    case 'follow_up':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'negotiating':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'won':
      return 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold shadow-sm'
    case 'rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200 line-through decoration-rose-300'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export function getQualityTierBadge(tier: QualityTier): { text: string; classes: string } {
  switch (tier) {
    case 'High':
      return { text: 'High Quality', classes: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    case 'Medium':
      return { text: 'Medium Quality', classes: 'bg-blue-100 text-blue-800 border-blue-300' }
    case 'Low':
      return { text: 'Low Authority', classes: 'bg-amber-100 text-amber-800 border-amber-300' }
    case 'Flagged':
      return { text: 'Safety Risk', classes: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' }
  }
}
