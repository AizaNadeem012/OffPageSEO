import { NextRequest, NextResponse } from 'next/server'

// Real-world Live Web Scraper & Contact Extractor for SEO Outreach
export async function POST(req: NextRequest) {
  try {
    const { url, domain } = await req.json()
    const rawTarget = domain || (url ? new URL(url).hostname : '')

    if (!rawTarget) {
      return NextResponse.json({ success: false, error: 'Domain or URL required' }, { status: 400 })
    }

    const cleanDomain = rawTarget
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim()

    // Candidate URL paths prioritizing Write-For-Us and Guest Post desks
    const pathsToTry = [
      '/write-for-us',
      '/write-for-us/',
      '/guest-post',
      '/guest-post/',
      '/guest-posts',
      '/submit-guest-post',
      '/contribute',
      '/contact-us',
      '/contact-us/',
      '/contact',
      '/about-us',
      '/about',
      '',
    ]

    const foundEmails = new Set<string>()
    let resolvedPageTitle = cleanDomain
    let workingPageUrl = `https://${cleanDomain}`
    let hasSubmissionForm = false
    let formActionUrl = `https://${cleanDomain}`

    for (const path of pathsToTry) {
      const targetUrl = `https://${cleanDomain}${path}`
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 4500)

        const res = await fetch(targetUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        })
        clearTimeout(timeout)

        if (res.ok) {
          workingPageUrl = targetUrl
          const html = await res.text()

          // Extract title if we don't have one yet
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          if (titleMatch && resolvedPageTitle === cleanDomain) {
            resolvedPageTitle = titleMatch[1].trim()
          }

          // Check if page contains an online submission form (e.g. Write For Us form)
          if (/<form[^>]*>/i.test(html) && !hasSubmissionForm) {
            hasSubmissionForm = true
            const actionMatch = html.match(/<form[^>]*action=["']([^"']+)["']/i)
            if (actionMatch && actionMatch[1] && !actionMatch[1].startsWith('#')) {
              formActionUrl = actionMatch[1].startsWith('http')
                ? actionMatch[1]
                : `https://${cleanDomain}${actionMatch[1].startsWith('/') ? '' : '/'}${actionMatch[1]}`
            } else {
              formActionUrl = targetUrl
            }
          }

          // 1. Check mailto: links (most reliable on real sites)
          const mailtoMatches = html.match(/href=["']mailto:\s*([^"'>\s]+)["']/gi)
          if (mailtoMatches) {
            mailtoMatches.forEach((m) => {
              const cleaned = m
                .replace(/href=["']mailto:\s*/i, '')
                .replace(/["']$/, '')
                .split('?')[0]
                .replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u2028\u2029\u202f\u205f\u3000]/g, '')
                .trim()
                .toLowerCase()

              if (isValidEmail(cleaned)) {
                foundEmails.add(cleaned)
              }
            })
          }

          // 2. Check general text regex for emails
          const textEmails = html.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g)
          if (textEmails) {
            textEmails.forEach((em) => {
              const cleaned = em.trim().toLowerCase()
              if (isValidEmail(cleaned)) {
                foundEmails.add(cleaned)
              }
            })
          }

          // If we found verified editorial/contact emails, we have what we need
          if (foundEmails.size >= 3) break
        }
      } catch {
        continue
      }
    }

    const emails = Array.from(foundEmails)

    // Sort: prioritize editor@, guest@, admin@, contact@, info@, and gmail accounts
    emails.sort((a, b) => {
      const priority = ['editor', 'editorial', 'guest', 'admin', 'write', 'contact', 'info', '@gmail.com', 'hello']
      const aScore = priority.findIndex((p) => a.includes(p))
      const bScore = priority.findIndex((p) => b.includes(p))
      if (aScore !== -1 && bScore === -1) return -1
      if (bScore !== -1 && aScore === -1) return 1
      return 0
    })

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      title: resolvedPageTitle,
      sourceUrl: workingPageUrl,
      emailsFound: emails,
      bestEmail: emails.length > 0 ? emails[0] : null,
      hasContactEmail: emails.length > 0,
      hasSubmissionForm,
      formActionUrl: formActionUrl || workingPageUrl,
      message:
        emails.length > 0
          ? `✓ Scraped ${cleanDomain}: Found ${emails.length} real email(s): ${emails.join(', ')}`
          : `⚠️ Scraped ${cleanDomain}: No direct public email displayed in HTML (detected online form: ${hasSubmissionForm ? 'yes' : 'no'}).`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Scrape failed' },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  if (!email || email.length < 5 || email.length > 50) return false
  if (!email.includes('@') || !email.includes('.')) return false

  const junkExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.js', '.css', '.woff', '.ttf']
  if (junkExtensions.some((ext) => email.endsWith(ext))) return false

  const junkSubstrings = [
    'example.com',
    'sentry.io',
    'wixpress.com',
    'schema.org',
    'domain.com',
    'yourdomain.com',
    'cloudflare',
    'w3.org',
  ]
  if (junkSubstrings.some((sub) => email.includes(sub))) return false

  return true
}
