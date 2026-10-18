import {
  DiscoveryQueryCriteria,
  GeneratedSearchQuery,
  Prospect,
  OpportunityType,
  QualityTier,
  AutomationSettings,
  CompetitorGapItem,
} from '@/types'
import { generateId } from './utils'

// Generates Google search operators / dorks tailored for Off-Page SEO prospecting
export function generateDiscoveryQueries(criteria: DiscoveryQueryCriteria): GeneratedSearchQuery[] {
  const kw = criteria.keyword.trim() || 'b2b saas'

  switch (criteria.opportunityType) {
    case 'guest_post':
      return [
        {
          title: 'Direct Editorial Guideline Pages',
          operatorString: `"${kw}" "write for us" OR "guest post guidelines"`,
          description: 'Targets editorial submission pages with published author guidelines.',
          expectedType: 'guest_post',
        },
        {
          title: 'Guest Contributor Signatures',
          operatorString: `"${kw}" "guest contributor" OR "guest author" -site:linkedin.com`,
          description: 'Finds live articles written by guest industry experts.',
          expectedType: 'guest_post',
        },
        {
          title: 'URL-Specific Submission Portals',
          operatorString: `"${kw}" inurl:contribute OR inurl:guest-post OR inurl:submit-article`,
          description: 'Locates dedicated contributor application URLs.',
          expectedType: 'guest_post',
        },
      ]

    case 'resource_page':
      return [
        {
          title: 'Resource & Tool Directories',
          operatorString: `"${kw}" "useful resources" OR "recommended tools" inurl:resources`,
          description: 'Locates curated tool and bookmark directories open to external submissions.',
          expectedType: 'resource_page',
        },
        {
          title: 'Curated Link Directories',
          operatorString: `"${kw}" "helpful links" OR "curated list" inurl:links`,
          description: 'Finds link hubs that aggregate authority sources in your niche.',
          expectedType: 'resource_page',
        },
      ]

    case 'broken_link':
      return [
        {
          title: 'High-Volume Comprehensive Lists',
          operatorString: `"${kw}" "best tools" OR "top resources" "updated 2024" OR "updated 2025"`,
          description: 'Targets older resource roundups prone to link rot and 404 dead links.',
          expectedType: 'broken_link',
        },
        {
          title: 'Defunct Domain Reference Hunts',
          operatorString: `"${kw}" inurl:links "directory"`,
          description: 'Finds broad industry directories for dead link checker tools.',
          expectedType: 'broken_link',
        },
      ]

    case 'unlinked_mention':
      return [
        {
          title: 'Brand Mention Without Direct Backlink',
          operatorString: `"${kw}" -site:${kw.toLowerCase().replace(/\s+/g, '')}.com`,
          description: 'Finds blog posts or reviews that cite your brand name without linking.',
          expectedType: 'unlinked_mention',
        },
        {
          title: 'Quote & Data Study Citations',
          operatorString: `"${kw}" "according to" OR "survey" OR "benchmark report"`,
          description: 'Finds articles referencing your published research data.',
          expectedType: 'unlinked_mention',
        },
      ]

    case 'podcast_interview':
      return [
        {
          title: 'Podcast Guest Pitch Targets',
          operatorString: `"${kw}" "podcast" inurl:episodes OR "be our guest"`,
          description: 'Finds niche audio shows actively booking subject matter guest experts.',
          expectedType: 'podcast_interview',
        },
      ]

    case 'expert_roundup':
      return [
        {
          title: 'Roundup & Expert Opinion Queries',
          operatorString: `"${kw}" "we asked experts" OR "expert roundup" OR "tips from"`,
          description: 'Locates recurring author roundups accepting expert commentary.',
          expectedType: 'expert_roundup',
        },
      ]

    default:
      return [
        {
          title: 'General SEO Prospect Query',
          operatorString: `"${kw}" "resources" OR "recommended"`,
          description: 'General authority domain discovery query.',
          expectedType: criteria.opportunityType,
        },
      ]
  }
}

// Simulates or performs safe discovery with realistic metric synthesis & safety auditing
export async function executeOpportunityDiscovery(
  criteria: DiscoveryQueryCriteria,
  settings: AutomationSettings
): Promise<Prospect[]> {
  // In sandbox/local mode, generate clean, realistic prospects tailored to the input keyword
  const kw = criteria.keyword.trim() || 'Digital Marketing'
  const niche = criteria.niche.trim() || 'Software & Tech'
  const sanitizedKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '')

  const candidateDomains = [
    {
      domain: `${sanitizedKw}-insights.org`,
      path: '/blog/contribute',
      title: `${kw}: Contributor & Thought Leadership Portal`,
      da: 76,
      spam: 2,
      traffic: 420000,
      contact: { name: 'Rachel Vance', role: 'Managing Editor', email: `editor@${sanitizedKw}-insights.org`, isVerified: true },
      topic: `The Evolution of ${kw} in 2026: Benchmark Report`,
    },
    {
      domain: `modern-${sanitizedKw}tech.com`,
      path: '/resources/top-industry-tools',
      title: `Curated Resources and Software for ${kw} Teams`,
      da: 82,
      spam: 1,
      traffic: 890000,
      contact: { name: 'David Chang', role: 'Resource Curator', email: `partnerships@modern-${sanitizedKw}tech.com`, isVerified: true },
      topic: `Inclusion of free verification tools for ${kw}`,
    },
    {
      domain: `the${sanitizedKw}guide.io`,
      path: '/articles/link-decay-analysis',
      title: `Complete Field Guide to ${kw} and Analytics`,
      da: 69,
      spam: 3,
      traffic: 210000,
      contact: { name: 'Elena Rostova', role: 'Staff Writer', email: `elena@the${sanitizedKw}guide.io`, isVerified: false },
      topic: `Replacement resource for dead link on 2024 benchmarks`,
    },
    {
      domain: `venture${sanitizedKw}.net`,
      path: '/podcast/founder-interviews',
      title: `The Venture ${kw} Podcast - Episode Archives`,
      da: 74,
      spam: 2,
      traffic: 340000,
      contact: { name: 'Marcus Brody', role: 'Producer', email: `producer@venture${sanitizedKw}.net`, isVerified: true },
      topic: `Podcast Guest: Practical Scaling Tactics for ${kw}`,
    },
    {
      domain: `sketchy-${sanitizedKw}-pbn-links.biz`,
      path: '/buy-links-fast',
      title: `Buy 1000 Cheap ${kw} Links Fast DA99 Guaranteed`,
      da: 18,
      spam: 79,
      traffic: 150,
      contact: { email: `spam@sketchy-${sanitizedKw}-pbn-links.biz` },
      topic: 'Unsolicited PBN link vendor',
    },
  ]

  const now = new Date().toISOString()
  const results: Prospect[] = []

  for (const candidate of candidateDomains) {
    const isSpammy = candidate.spam > settings.maxAllowedSpamScore || candidate.da < criteria.minDomainAuthority
    const qualityTier: QualityTier = isSpammy ? 'Flagged' : candidate.da >= 80 ? 'High' : candidate.da >= 50 ? 'Medium' : 'Low'
    const status = isSpammy ? 'rejected' : 'discovered'

    results.push({
      id: generateId('prsp'),
      domain: candidate.domain,
      url: `https://${candidate.domain}${candidate.path}`,
      pageTitle: candidate.title,
      opportunityType: criteria.opportunityType,
      status: status,
      niche: niche,
      domainAuthority: candidate.da,
      spamScore: candidate.spam,
      monthlyTraffic: candidate.traffic,
      relevanceScore: isSpammy ? 15 : Math.floor(Math.random() * 15) + 84,
      qualityTier,
      contact: candidate.contact,
      suggestedTopic: candidate.topic,
      notes: isSpammy
        ? `Safety check: flagged due to high spam score (${candidate.spam}%) or low authority.`
        : `Discovered for query [${kw}]. Safe for review.`,
      isApproved: false,
      isDemo: true, // Clearly labeled demo/simulated data
      createdAt: now,
      updatedAt: now,
    })
  }

  return results
}

// Safety check function for prospects before outbound outreach
export function validateProspectSafety(
  prospect: Partial<Prospect>,
  settings: AutomationSettings
): { isSafe: boolean; warnings: string[]; autoReject: boolean } {
  const warnings: string[] = []
  let autoReject = false

  // 1. Spam score check
  if (prospect.spamScore !== undefined && prospect.spamScore > settings.maxAllowedSpamScore) {
    warnings.push(`Spam score of ${prospect.spamScore}% exceeds safe limit of ${settings.maxAllowedSpamScore}%.`)
    autoReject = true
  }

  // 2. Blacklisted TLD check
  if (prospect.domain) {
    const domain = prospect.domain.toLowerCase()
    const matchesBlacklist = settings.blacklistedTLDs.some((tld) => domain.endsWith(tld.toLowerCase()))
    if (matchesBlacklist) {
      warnings.push(`Domain uses a high-risk TLD on your blacklist.`)
      autoReject = true
    }
  }

  // 3. Blocked keywords check
  if (prospect.pageTitle || prospect.suggestedTopic) {
    const textToCheck = `${prospect.pageTitle || ''} ${prospect.suggestedTopic || ''}`.toLowerCase()
    for (const kw of settings.blockedKeywords) {
      if (textToCheck.includes(kw.toLowerCase())) {
        warnings.push(`Contains prohibited keyword: "${kw}".`)
        autoReject = true
        break
      }
    }
  }

  // 4. Contact email verification
  if (!prospect.contact?.email) {
    warnings.push('No verified contact email detected. Needs research before drafting.')
  }

  // 5. Manual Approval Requirement
  if (settings.requireApprovalForEveryEmail) {
    warnings.push('Safety Policy: Manual approval is strictly required prior to any outbound transmission.')
  }

  return {
    isSafe: warnings.length === 0 || (!autoReject && warnings.length === 1 && warnings[0].startsWith('Safety Policy')),
    warnings,
    autoReject,
  }
}
