import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { pageUrl, targetDomain } = await req.json()

    if (!pageUrl) {
      return NextResponse.json(
        { success: false, error: 'pageUrl is required for verification' },
        { status: 400 }
      )
    }

    const cleanTarget = (targetDomain || 'afimahclothingstore.com').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '')

    // Perform real live web fetch
    const response = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RankWave-SEO-Monitor/1.0',
      },
      next: { revalidate: 0 },
    })

    const httpStatus = response.status
    if (!response.ok) {
      return NextResponse.json({
        success: true,
        httpStatus,
        isLive: false,
        foundBacklink: false,
        message: `Page returned HTTP ${httpStatus}.`,
      })
    }

    const html = await response.text()

    // Inspect HTML for anchor tags containing the target domain
    const linkRegex = new RegExp(`<a\\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\\/a>`, 'gi')
    let foundBacklink = false
    let isDofollow = true
    let extractedAnchor = ''
    let match

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1].toLowerCase()
      const tagContent = match[0]
      const anchorInner = match[2].replace(/<[^>]*>/g, '').trim()

      if (href.includes(cleanTarget)) {
        foundBacklink = true
        extractedAnchor = anchorInner || cleanTarget

        if (/rel=["'][^"']*nofollow[^"']*["']/i.test(tagContent)) {
          isDofollow = false
        }
        break
      }
    }

    return NextResponse.json({
      success: true,
      httpStatus,
      isLive: httpStatus === 200,
      foundBacklink,
      isDofollow,
      anchorText: extractedAnchor || 'No anchor',
      checkedAt: new Date().toISOString(),
      message: foundBacklink
        ? `Live backlink verified on ${pageUrl}! Anchor: "${extractedAnchor}", Type: ${isDofollow ? 'Dofollow' : 'Nofollow'}.`
        : `Page is live (200 OK), but target link to "${cleanTarget}" was not found in the HTML.`,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      isLive: false,
      foundBacklink: false,
      error: err.message || 'Could not reach target page',
    })
  }
}
