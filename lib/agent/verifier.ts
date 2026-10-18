import { validateUrlForSSRF } from '@/lib/security/ssrf'
import { getDatabase } from '@/lib/db'

export interface BacklinkVerificationResult {
  backlinkId?: string
  sourcePageUrl: string
  targetLandingPage: string
  expectedAnchor: string
  httpStatus: number
  isAccessible: boolean
  linkFound: boolean
  extractedAnchor: string
  linkAttribute: 'dofollow' | 'nofollow' | 'sponsored' | 'ugc' | 'unknown'
  verificationStatus: 'verified' | 'submitted' | 'pending_moderation' | 'removed' | 'inaccessible' | 'rejected'
  qualityScore: number
  qualityAssessment: string
  evidenceText: string
  checkedAt: string
}

export async function verifyLiveBacklink(
  sourcePageUrl: string,
  targetLandingPage: string,
  expectedAnchor: string,
  backlinkId?: string
): Promise<BacklinkVerificationResult> {
  const db = getDatabase()
  const checkedAt = new Date().toISOString()

  // 1. SSRF Check
  const ssrfCheck = await validateUrlForSSRF(sourcePageUrl)
  if (!ssrfCheck.isValid) {
    return {
      backlinkId,
      sourcePageUrl,
      targetLandingPage,
      expectedAnchor,
      httpStatus: 0,
      isAccessible: false,
      linkFound: false,
      extractedAnchor: '',
      linkAttribute: 'unknown',
      verificationStatus: 'inaccessible',
      qualityScore: 0,
      qualityAssessment: `Security validation blocked target URL: ${ssrfCheck.reason}`,
      evidenceText: 'SSRF protection triggered. Target IP / host is reserved.',
      checkedAt,
    }
  }

  const cleanUrl = ssrfCheck.normalizedUrl || sourcePageUrl

  // Normalize target domain for matching
  let cleanTargetDomain = 'afimahclothingstore.com'
  try {
    cleanTargetDomain = new URL(targetLandingPage).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    cleanTargetDomain = targetLandingPage.toLowerCase()
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 RankWave-Backlink-Auditor/2.0',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 0 },
    })
    clearTimeout(timeout)

    const httpStatus = response.status

    if (!response.ok) {
      const result: BacklinkVerificationResult = {
        backlinkId,
        sourcePageUrl: cleanUrl,
        targetLandingPage,
        expectedAnchor,
        httpStatus,
        isAccessible: false,
        linkFound: false,
        extractedAnchor: '',
        linkAttribute: 'unknown',
        verificationStatus: httpStatus === 404 ? 'removed' : 'inaccessible',
        qualityScore: 0,
        qualityAssessment: `Page returned HTTP ${httpStatus}. The link cannot be verified.`,
        evidenceText: `HTTP response status ${httpStatus} received. Target URL could not be resolved.`,
        checkedAt,
      }
      if (backlinkId) persistVerification(db, result)
      return result
    }

    const html = await response.text()

    // 2. Extract DOM Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].trim() : cleanUrl

    // 3. Scan for Anchor Tags pointing to target landing page or domain
    const anchorRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
    let match
    let linkFound = false
    let extractedAnchor = ''
    let linkAttribute: BacklinkVerificationResult['linkAttribute'] = 'dofollow'
    let matchedTagSnippet = ''

    while ((match = anchorRegex.exec(html)) !== null) {
      const href = match[1].toLowerCase()
      const fullTag = match[0]
      const innerText = match[2].replace(/<[^>]*>/g, '').trim()

      if (href.includes(cleanTargetDomain)) {
        linkFound = true
        extractedAnchor = innerText || expectedAnchor
        matchedTagSnippet = fullTag

        const lowerTag = fullTag.toLowerCase()
        if (lowerTag.includes('rel="nofollow"') || lowerTag.includes("rel='nofollow'")) {
          linkAttribute = 'nofollow'
        } else if (lowerTag.includes('rel="sponsored"') || lowerTag.includes("rel='sponsored'")) {
          linkAttribute = 'sponsored'
        } else if (lowerTag.includes('rel="ugc"') || lowerTag.includes("rel='ugc'")) {
          linkAttribute = 'ugc'
        } else {
          linkAttribute = 'dofollow'
        }
        break
      }
    }

    let verificationStatus: BacklinkVerificationResult['verificationStatus'] = 'verified'
    let qualityScore = 85
    let qualityAssessment = ''
    let evidenceText = ''

    if (linkFound) {
      verificationStatus = 'verified'
      if (linkAttribute === 'dofollow') {
        qualityScore = 90
        qualityAssessment = `High-value verified contextual dofollow backlink on "${pageTitle}". Anchor text: "${extractedAnchor}".`
      } else {
        qualityScore = 70
        qualityAssessment = `Verified ${linkAttribute} backlink on "${pageTitle}". Provides brand authority and indexation signals.`
      }
      evidenceText = `DOM verified: "${matchedTagSnippet}". HTTP 200 OK. Page title: "${pageTitle}". Target destination matches "${cleanTargetDomain}".`
    } else {
      verificationStatus = 'removed'
      qualityScore = 0
      qualityAssessment = `Page is live (HTTP 200 OK), but no active link pointing to "${cleanTargetDomain}" was located in the published HTML.`
      evidenceText = `Scanned complete HTML document (${html.length} bytes). Zero anchor tags matching destination domain "${cleanTargetDomain}" were found.`
    }

    const result: BacklinkVerificationResult = {
      backlinkId,
      sourcePageUrl: cleanUrl,
      targetLandingPage,
      expectedAnchor,
      httpStatus,
      isAccessible: true,
      linkFound,
      extractedAnchor,
      linkAttribute,
      verificationStatus,
      qualityScore,
      qualityAssessment,
      evidenceText,
      checkedAt,
    }

    if (backlinkId) {
      persistVerification(db, result)
    }

    return result
  } catch (err: any) {
    const result: BacklinkVerificationResult = {
      backlinkId,
      sourcePageUrl: cleanUrl,
      targetLandingPage,
      expectedAnchor,
      httpStatus: 0,
      isAccessible: false,
      linkFound: false,
      extractedAnchor: '',
      linkAttribute: 'unknown',
      verificationStatus: 'inaccessible',
      qualityScore: 0,
      qualityAssessment: `Connection failed: ${err.message}`,
      evidenceText: `Verification probe failed with error: ${err.message}`,
      checkedAt,
    }
    if (backlinkId) persistVerification(db, result)
    return result
  }
}

function persistVerification(db: any, res: BacklinkVerificationResult) {
  if (!res.backlinkId) return

  // Update backlink record
  db.prepare(`
    UPDATE backlinks SET
      http_status = ?,
      verification_status = ?,
      link_attribute = ?,
      quality_score = ?,
      quality_assessment = ?,
      evidence_text = ?,
      last_checked_date = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    res.httpStatus,
    res.verificationStatus,
    res.linkAttribute,
    res.qualityScore,
    res.qualityAssessment,
    res.evidenceText,
    res.checkedAt,
    res.checkedAt,
    res.backlinkId
  )

  // Insert verification result log
  db.prepare(`
    INSERT INTO verification_results (
      id, backlink_id, checked_at, http_status, link_found,
      extracted_anchor, extracted_rel, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    `ver_${Date.now()}`,
    res.backlinkId,
    res.checkedAt,
    res.httpStatus,
    res.linkFound ? 1 : 0,
    res.extractedAnchor,
    res.linkAttribute,
    res.qualityAssessment
  )

  // Audit log
  db.prepare(`
    INSERT INTO audit_logs (id, campaign_id, action, category, severity, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    `log_ver_${Date.now()}`,
    'camp_master_default',
    'Backlink Verification Audit Completed',
    'verification',
    res.linkFound ? 'success' : 'warning',
    `Backlink verification on ${res.sourcePageUrl}: ${res.verificationStatus} (${res.linkAttribute}). Quality score: ${res.qualityScore}%.`,
    res.checkedAt
  )
}
