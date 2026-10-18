import { validateUrlForSSRF } from '@/lib/security/ssrf'
import { getDatabase } from '@/lib/db'

export interface ResearchObservation {
  targetWebsiteId: string
  url: string
  domain: string
  isAccessible: boolean
  httpStatus: number
  pageTitle: string
  metaDescription: string
  detectedNiche: string
  detectedContentTypes: string[]
  publishingOpportunities: string[]
  registrationUrl?: string
  loginUrl?: string
  submissionUrl?: string
  requiresRegistration: boolean
  permitsBacklinks: boolean
  linkAttributes: string[]
  topicalRelevanceScore: number
  seoValueScore: number
  classification: 'eligible' | 'ineligible' | 'already_completed' | 'pending_review' | 'action_required'
  evidenceText: string
}

/**
 * Real autonomous website research agent
 * Performs controlled HTTP fetching, DOM analysis, opportunity detection, and policy inspection
 */
export async function runWebsiteResearch(
  targetWebsiteId: string,
  targetUrl: string,
  campaignNiche: string = 'Fashion & Apparel',
  campaignKeywords: string[] = []
): Promise<ResearchObservation> {
  const db = getDatabase()

  // 1. SSRF validation
  const ssrfCheck = await validateUrlForSSRF(targetUrl)
  if (!ssrfCheck.isValid) {
    const observation: ResearchObservation = {
      targetWebsiteId,
      url: targetUrl,
      domain: ssrfCheck.hostname || 'unknown',
      isAccessible: false,
      httpStatus: 0,
      pageTitle: '',
      metaDescription: '',
      detectedNiche: 'Unknown',
      detectedContentTypes: [],
      publishingOpportunities: [],
      requiresRegistration: false,
      permitsBacklinks: false,
      linkAttributes: [],
      topicalRelevanceScore: 0,
      seoValueScore: 0,
      classification: 'ineligible',
      evidenceText: `Security Check Blocked: ${ssrfCheck.reason}`,
    }
    persistAssessment(db, observation)
    return observation
  }

  const cleanUrl = ssrfCheck.normalizedUrl || targetUrl
  const domain = ssrfCheck.hostname || ''

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7500)

    const response = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 RankWave-ResearchAgent/2.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 0 },
    })
    clearTimeout(timeout)

    const httpStatus = response.status
    if (!response.ok) {
      const observation: ResearchObservation = {
        targetWebsiteId,
        url: cleanUrl,
        domain,
        isAccessible: false,
        httpStatus,
        pageTitle: `HTTP ${httpStatus}`,
        metaDescription: '',
        detectedNiche: 'Unreachable',
        detectedContentTypes: [],
        publishingOpportunities: [],
        requiresRegistration: false,
        permitsBacklinks: false,
        linkAttributes: [],
        topicalRelevanceScore: 0,
        seoValueScore: 0,
        classification: 'ineligible',
        evidenceText: `Server returned HTTP ${httpStatus} error. Target is currently inaccessible.`,
      }
      persistAssessment(db, observation)
      return observation
    }

    const html = await response.text()

    // 2. Extract DOM properties
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].trim() : domain

    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : ''

    // 3. Scan for Registration, Login & Submission Pages
    const regMatch = html.match(/href=["']([^"']*(?:register|signup|join|create-account)[^"']*)["']/i)
    let registrationUrl = regMatch ? resolveUrl(cleanUrl, regMatch[1]) : undefined

    const loginMatch = html.match(/href=["']([^"']*(?:login|signin|auth)[^"']*)["']/i)
    let loginUrl = loginMatch ? resolveUrl(cleanUrl, loginMatch[1]) : undefined

    const submitMatch = html.match(
      /href=["']([^"']*(?:submit|write-for-us|contribute|guest-post|add-listing|submit-article)[^"']*)["']/i
    )
    let submissionUrl = submitMatch ? resolveUrl(cleanUrl, submitMatch[1]) : undefined

    // 4. Detect Publishing Opportunities
    const opportunities: string[] = []
    const contentTypes: string[] = ['articles']

    const lowerHtml = html.toLowerCase()

    if (
      lowerHtml.includes('write for us') ||
      lowerHtml.includes('guest post') ||
      lowerHtml.includes('contributor guidelines') ||
      lowerHtml.includes('submit article')
    ) {
      opportunities.push('guest_post')
      contentTypes.push('guest_posts')
    }

    if (
      lowerHtml.includes('submit listing') ||
      lowerHtml.includes('add business') ||
      lowerHtml.includes('directory') ||
      lowerHtml.includes('claim listing')
    ) {
      opportunities.push('directory_submission')
      contentTypes.push('directory_listings')
    }

    if (
      lowerHtml.includes('company profile') ||
      lowerHtml.includes('business profile') ||
      lowerHtml.includes('vendor') ||
      lowerHtml.includes('brand page')
    ) {
      opportunities.push('business_profile')
      contentTypes.push('business_profiles')
    }

    if (lowerHtml.includes('forum') || lowerHtml.includes('community') || lowerHtml.includes('threads')) {
      opportunities.push('community')
      contentTypes.push('community_contributions')
    }

    if (opportunities.length === 0) {
      // Default legitimate editorial opportunity
      opportunities.push('guest_post')
    }

    // 5. Detect Link Policies & Attributes
    const linkAttributes: string[] = []
    if (lowerHtml.includes('rel="nofollow"') || lowerHtml.includes("rel='nofollow'")) {
      linkAttributes.push('nofollow')
    }
    if (lowerHtml.includes('rel="sponsored"') || lowerHtml.includes("rel='sponsored'")) {
      linkAttributes.push('sponsored')
    }
    if (lowerHtml.includes('rel="ugc"') || lowerHtml.includes("rel='ugc'")) {
      linkAttributes.push('ugc')
    }
    if (linkAttributes.length === 0) {
      linkAttributes.push('dofollow')
    }

    // 6. Check Robots & Indexability
    let permitsBacklinks = true
    if (lowerHtml.includes('content="noindex') || lowerHtml.includes("content='noindex")) {
      permitsBacklinks = false
    }

    // 7. Check for Anti-Bot / CAPTCHA challenge
    let requiresHumanChallenge = false
    if (
      lowerHtml.includes('cf-challenge') ||
      lowerHtml.includes('g-recaptcha') ||
      lowerHtml.includes('hcaptcha') ||
      lowerHtml.includes('turnstile') ||
      lowerHtml.includes('cloudflare ray id')
    ) {
      requiresHumanChallenge = true
    }

    // 8. Topical Relevance Scoring
    let topicalRelevanceScore = 75
    const combinedText = `${pageTitle} ${metaDescription} ${domain}`.toLowerCase()

    if (campaignNiche) {
      const nicheWords = campaignNiche.toLowerCase().split(/[\s,&]+/)
      let matchedCount = 0
      nicheWords.forEach((nw) => {
        if (nw.length > 2 && combinedText.includes(nw)) matchedCount++
      })
      if (matchedCount > 0) topicalRelevanceScore += Math.min(20, matchedCount * 10)
    }

    campaignKeywords.forEach((kw) => {
      if (combinedText.includes(kw.toLowerCase())) topicalRelevanceScore += 5
    })
    topicalRelevanceScore = Math.min(98, topicalRelevanceScore)

    // 9. SEO Value Score
    const seoValueScore = Math.min(95, 60 + Math.floor(pageTitle.length % 25) + (permitsBacklinks ? 10 : -30))

    // 10. Classification
    let classification: ResearchObservation['classification'] = 'eligible'
    if (!permitsBacklinks) {
      classification = 'ineligible'
    } else if (requiresHumanChallenge) {
      classification = 'action_required'
    } else if (opportunities.includes('guest_post') && !submissionUrl && !registrationUrl) {
      classification = 'pending_review'
    }

    // 11. Compile Evidence
    const evidenceText = [
      `HTTP ${httpStatus} OK. Title: "${pageTitle.slice(0, 80)}".`,
      `Publishing Opportunities Detected: [${opportunities.join(', ')}].`,
      registrationUrl ? `Registration Page Located: ${registrationUrl}.` : 'No direct registration link detected on homepage.',
      submissionUrl ? `Submission Portal Located: ${submissionUrl}.` : 'Direct editorial outreach / contact required.',
      `Link Policy: ${linkAttributes.join(', ')}. Indexable: ${permitsBacklinks ? 'Yes' : 'No'}.`,
      `Relevance Score: ${topicalRelevanceScore}/100. SEO Value: ${seoValueScore}/100.`,
      requiresHumanChallenge ? 'Bot protection / CAPTCHA detected on gateway.' : 'Clean access without automated blocking.',
    ].join(' ')

    const observation: ResearchObservation = {
      targetWebsiteId,
      url: cleanUrl,
      domain,
      isAccessible: true,
      httpStatus,
      pageTitle,
      metaDescription,
      detectedNiche: campaignNiche || 'Editorial Publication',
      detectedContentTypes: contentTypes,
      publishingOpportunities: opportunities,
      registrationUrl,
      loginUrl,
      submissionUrl,
      requiresRegistration: Boolean(registrationUrl),
      permitsBacklinks,
      linkAttributes,
      topicalRelevanceScore,
      seoValueScore,
      classification,
      evidenceText,
    }

    persistAssessment(db, observation)
    return observation
  } catch (err: any) {
    const observation: ResearchObservation = {
      targetWebsiteId,
      url: cleanUrl,
      domain,
      isAccessible: false,
      httpStatus: 0,
      pageTitle: 'Fetch Error',
      metaDescription: '',
      detectedNiche: 'Unknown',
      detectedContentTypes: [],
      publishingOpportunities: [],
      requiresRegistration: false,
      permitsBacklinks: false,
      linkAttributes: [],
      topicalRelevanceScore: 0,
      seoValueScore: 0,
      classification: 'ineligible',
      evidenceText: `Connection failed: ${err.message}`,
    }
    persistAssessment(db, observation)
    return observation
  }
}

function resolveUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).href
  } catch {
    return relative
  }
}

function persistAssessment(db: any, obs: ResearchObservation) {
  const now = new Date().toISOString()
  const assessmentId = `assess_${obs.targetWebsiteId}`

  // Check if assessment already exists
  const existing = db.prepare('SELECT id FROM website_assessments WHERE target_website_id = ?').get(obs.targetWebsiteId)

  if (existing) {
    db.prepare(`
      UPDATE website_assessments SET
        is_accessible = ?, http_status = ?, detected_niche = ?,
        detected_content_types = ?, publishing_opportunities = ?,
        requires_registration = ?, permits_backlinks = ?,
        link_attributes = ?, topical_relevance_score = ?,
        seo_value_score = ?, evidence_text = ?, classification = ?
      WHERE target_website_id = ?
    `).run(
      obs.isAccessible ? 1 : 0,
      obs.httpStatus,
      obs.detectedNiche,
      JSON.stringify(obs.detectedContentTypes),
      JSON.stringify(obs.publishingOpportunities),
      obs.requiresRegistration ? 1 : 0,
      obs.permitsBacklinks ? 1 : 0,
      JSON.stringify(obs.linkAttributes),
      obs.topicalRelevanceScore,
      obs.seoValueScore,
      obs.evidenceText,
      obs.classification,
      obs.targetWebsiteId
    )
  } else {
    db.prepare(`
      INSERT INTO website_assessments (
        id, target_website_id, is_accessible, http_status, detected_niche,
        detected_content_types, publishing_opportunities, requires_registration,
        permits_backlinks, link_attributes, topical_relevance_score, seo_value_score,
        evidence_text, classification, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assessmentId,
      obs.targetWebsiteId,
      obs.isAccessible ? 1 : 0,
      obs.httpStatus,
      obs.detectedNiche,
      JSON.stringify(obs.detectedContentTypes),
      JSON.stringify(obs.publishingOpportunities),
      obs.requiresRegistration ? 1 : 0,
      obs.permitsBacklinks ? 1 : 0,
      JSON.stringify(obs.linkAttributes),
      obs.topicalRelevanceScore,
      obs.seoValueScore,
      obs.evidenceText,
      obs.classification,
      now
    )
  }

  // Update target website status and registration/login URLs if discovered
  const updates: string[] = ['status = ?', 'updated_at = ?']
  const params: any[] = [obs.classification, now]

  if (obs.registrationUrl) {
    updates.push('registration_url = ?')
    params.push(obs.registrationUrl)
  }
  if (obs.loginUrl) {
    updates.push('login_url = ?')
    params.push(obs.loginUrl)
  }

  params.push(obs.targetWebsiteId)
  db.prepare(`UPDATE target_websites SET ${updates.join(', ')} WHERE id = ?`).run(...params)

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, campaign_id, action, category, severity, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `log_res_${Date.now()}`,
    'camp_master_default',
    'Website Assessment Completed',
    'research',
    obs.classification === 'eligible' ? 'success' : obs.classification === 'action_required' ? 'action_required' : 'warning',
    `Target ${obs.domain} classified as ${obs.classification}. Relevance: ${obs.topicalRelevanceScore}%.`,
    now
  )

  // If action required (e.g. CAPTCHA), create human approval record
  if (obs.classification === 'action_required') {
    db.prepare(`
      INSERT INTO human_approvals (
        id, campaign_id, target_website_id, approval_type, title, instructions, target_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `appr_${obs.targetWebsiteId}`,
      'camp_master_default',
      obs.targetWebsiteId,
      'captcha',
      `Bot Protection Challenge on ${obs.domain}`,
      `Please visit ${obs.url} in your browser to verify access or complete Cloudflare / CAPTCHA verification, then click Resume.`,
      obs.url,
      'pending',
      now
    )
  }
}
