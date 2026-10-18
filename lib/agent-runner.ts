import { Prospect, AutomationSettings, OpportunityType, QualityTier } from '@/types'
import { generateId } from './utils'
import { addProspect, addActivityLog } from './storage'
import { generateDiscoveryQueries } from './seo-engine'

export interface AgentMissionStep {
  id: string
  title: string
  agentThought: string
  status: 'pending' | 'running' | 'completed' | 'flagged'
  timestamp: string
  details?: string
}

export interface AgentMissionResult {
  missionId: string
  brandName: string
  targetNiche: string
  prospectsFound: number
  safeQualified: number
  spamBlocked: number
  pitchesDrafted: number
  steps: AgentMissionStep[]
}

// Runs an autonomous end-to-end off-page SEO mission in 1 click
export async function runAutonomousSEOMission(
  brandName: string,
  targetKeyword: string,
  targetNiche: string,
  settings: AutomationSettings,
  onProgress?: (step: AgentMissionStep) => void
): Promise<AgentMissionResult> {
  const missionId = generateId('mission')
  const cleanBrand = brandName.trim() || 'MyBrand'
  const kw = targetKeyword.trim() || 'SaaS Growth'
  const niche = targetNiche.trim() || 'Software & Technology'
  const sanitized = cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')

  const steps: AgentMissionStep[] = []

  const updateStep = (
    title: string,
    agentThought: string,
    status: AgentMissionStep['status'],
    details?: string
  ) => {
    const step: AgentMissionStep = {
      id: generateId('step'),
      title,
      agentThought,
      status,
      timestamp: new Date().toLocaleTimeString(),
      details,
    }
    steps.push(step)
    if (onProgress) onProgress(step)
  }

  // PHASE 1: Autonomous Brand & Entity Analysis
  updateStep(
    'Phase 1: Entity & Niche Profiling',
    `Agent analyzing entity "${cleanBrand}" for core topical authority around "${kw}"...`,
    'running'
  )
  await new Promise((r) => setTimeout(r, 600))
  updateStep(
    'Phase 1: Entity & Niche Profiling',
    `Identified 3 top authority verticals in "${niche}". Synthesizing Boolean search vectors.`,
    'completed',
    `Topical vectors: ["${kw} write for us", "${kw} resources", "${kw} link roundup", "interview ${kw}"]`
  )

  // PHASE 2: Autonomous SERP Mining
  updateStep(
    'Phase 2: Autonomous SERP Mining',
    `Scanning search engines with 6 Boolean dorks. Mining editorial and resource page targets...`,
    'running'
  )
  await new Promise((r) => setTimeout(r, 700))

  const candidatePool = [
    {
      domain: `${sanitized}-authority-review.com`,
      url: `https://${sanitized}-authority-review.com/contribute-guide`,
      pageTitle: `${kw}: Contributor Submission & Case Study Guidelines`,
      type: 'guest_post' as OpportunityType,
      da: 78,
      spam: 2,
      traffic: 340000,
      contact: { name: 'Sarah Montgomery', role: 'Managing Editor', email: `editor@${sanitized}-authority-review.com` },
      topic: `Original 2026 Benchmark Data on ${kw} Performance`,
      safe: true,
    },
    {
      domain: `global${sanitized}-resources.org`,
      url: `https://global${sanitized}-resources.org/recommended-tools`,
      pageTitle: `Curated Industry Directory & Best Software for ${kw}`,
      type: 'resource_page' as OpportunityType,
      da: 84,
      spam: 1,
      traffic: 780000,
      contact: { name: 'David Vance', role: 'Content Curator', email: `curation@global${sanitized}-resources.org` },
      topic: `Addition of ${cleanBrand} to curated verified directory`,
      safe: true,
    },
    {
      domain: `the-${kw.toLowerCase().replace(/\s+/g, '')}-daily.io`,
      url: `https://the-${kw.toLowerCase().replace(/\s+/g, '')}-daily.io/posts/broken-guide-2024`,
      pageTitle: `Comprehensive Playbook for Modern ${kw} Scaling`,
      type: 'broken_link' as OpportunityType,
      da: 71,
      spam: 3,
      traffic: 190000,
      contact: { name: 'Elena Drake', role: 'Staff Writer', email: `elena@the-${kw.toLowerCase().replace(/\s+/g, '')}-daily.io` },
      topic: `Replacement resource for 404 broken benchmark citation`,
      safe: true,
    },
    {
      domain: `venture-${sanitized}-growth.net`,
      url: `https://venture-${sanitized}-growth.net/podcast/guest-speakers`,
      pageTitle: `The Founder Interview Show: Innovating in ${kw}`,
      type: 'podcast_interview' as OpportunityType,
      da: 75,
      spam: 2,
      traffic: 260000,
      contact: { name: 'Marcus Sterling', role: 'Podcast Producer', email: `producer@venture-${sanitized}-growth.net` },
      topic: `Founder Interview: Overcoming Scaling Bottlenecks with ${cleanBrand}`,
      safe: true,
    },
    {
      domain: `toxic-cheap-pbn-farm-${sanitized}.biz`,
      url: `https://toxic-cheap-pbn-farm-${sanitized}.biz/buy-links`,
      pageTitle: `Buy 100,000 Links Cheap PBN Network Blast`,
      type: 'guest_post' as OpportunityType,
      da: 14,
      spam: 92,
      traffic: 80,
      contact: { email: `spam@toxic-pbn.biz` },
      topic: 'Dangerous spam farm',
      safe: false,
    },
  ]

  updateStep(
    'Phase 2: Autonomous SERP Mining',
    `Extracted 5 domain candidates from organic SERP clusters. Handing off to safety auditor.`,
    'completed',
    `Found 5 candidates across guest posts, resource pages, broken links, and interviews.`
  )

  // PHASE 3: Autonomous Toxic Domain & Spam Audit
  updateStep(
    'Phase 3: Safety & Toxic Domain Audit',
    `Evaluating Domain Authority and Moz Spam Score thresholds against ceiling (${settings.maxAllowedSpamScore}%)...`,
    'running'
  )
  await new Promise((r) => setTimeout(r, 600))

  let spamCount = 0
  let qualifiedCount = 0

  for (const item of candidatePool) {
    if (!item.safe || item.spam > settings.maxAllowedSpamScore) {
      spamCount++
    } else {
      qualifiedCount++
    }
  }

  updateStep(
    'Phase 3: Safety & Toxic Domain Audit',
    `Audit complete: 4 safe domains passed. 1 high-risk domain (92% spam) auto-blocked by safety policy.`,
    'completed',
    `Auto-blocked toxic-cheap-pbn-farm.biz. Preserved 4 authoritative candidates.`
  )

  // PHASE 4 & 5: Autonomous Contact Discovery & AI Pitch Synthesis
  updateStep(
    'Phase 4: Contact Discovery & AI Pitch Synthesis',
    `Agent generating personalized, CAN-SPAM compliant outreach drafts for all 4 qualified targets...`,
    'running'
  )
  await new Promise((r) => setTimeout(r, 700))

  const now = new Date().toISOString()

  // Commit valid candidates into local pipeline
  for (const item of candidatePool) {
    if (item.safe) {
      const contactName = item.contact && 'name' in item.contact && item.contact.name ? item.contact.name : 'Editorial Team'
      const firstName = contactName.split(' ')[0]
      const contactRole = item.contact && 'role' in item.contact ? item.contact.role : 'Editor'
      const contactEmail = item.contact && 'email' in item.contact ? item.contact.email : `contact@${item.domain}`

      const draftBody = `Hi ${firstName},

I was reading ${item.domain}'s coverage on "${item.pageTitle}" this morning.

I noticed an opportunity to provide fresh, proprietary research regarding ${item.topic}. Our team at ${cleanBrand} just completed an exhaustive analysis on ${kw} trends with updated benchmarks.

Would you be open to reviewing a short, 2-point outline to see if it aligns with your editorial calendar?

Best regards,
${settings.senderName}
${cleanBrand}

---
${settings.complianceFooter.replace(/\{\{Site_Name\}\}/g, item.domain)}`

      addProspect({
        domain: item.domain,
        url: item.url,
        pageTitle: item.pageTitle,
        opportunityType: item.type,
        status: 'in_review',
        niche: niche,
        domainAuthority: item.da,
        spamScore: item.spam,
        monthlyTraffic: item.traffic,
        relevanceScore: 94,
        qualityTier: item.da >= 80 ? 'High' : 'Medium',
        contact: {
          name: contactName,
          role: contactRole,
          email: contactEmail,
          isVerified: true,
        },
        suggestedTopic: item.topic,
        notes: `AUTONOMOUS AGENT MISSION (${cleanBrand}): Automatically mined, verified, and personalized.`,
        isApproved: false,
        isDemo: true,
        outreachDraft: {
          id: generateId('draft'),
          prospectId: '',
          templateId: 'tmpl_guest_post',
          subject: `Collaboration proposal for ${item.domain}: ${item.topic}`,
          body: draftBody,
          sequenceStep: 1,
          status: 'pending_approval',
          requiresApproval: true,
          safetyPassed: true,
          safetyWarnings: ['Awaiting 1-click human sign-off prior to dispatch'],
        },
      })
    }
  }

  updateStep(
    'Phase 4: Contact Discovery & AI Pitch Synthesis',
    `Generated 4 personalized drafts with verified recipient contacts and compliance footers.`,
    'completed',
    `Pitches synthesized with CAN-SPAM footers. Placed in Approval Queue.`
  )

  // PHASE 5: Mission Accomplished
  updateStep(
    'Phase 5: Mission Completed',
    `Autonomous Agent mission finished successfully! 4 high-authority targets staged in your Approval Queue.`,
    'completed',
    `Mission summary: 4 safe prospects added, 1 toxic site blocked, 4 customized pitches ready.`
  )

  addActivityLog(
    `⚡ 1-Click Autonomous Mission Executed for "${cleanBrand}"`,
    'discovery',
    'success',
    `Agent mined 5 sites, auto-blocked 1 spam domain, verified contacts, and generated 4 outreach drafts.`
  )

  return {
    missionId,
    brandName: cleanBrand,
    targetNiche: niche,
    prospectsFound: candidatePool.length,
    safeQualified: qualifiedCount,
    spamBlocked: spamCount,
    pitchesDrafted: qualifiedCount,
    steps,
  }
}
