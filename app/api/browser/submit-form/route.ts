import { NextRequest, NextResponse } from 'next/server'
import { executeBrowserFormSubmission } from '@/lib/agent/browser-automation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.url) {
      return NextResponse.json({ success: false, error: 'Target URL is required' }, { status: 400 })
    }

    const result = await executeBrowserFormSubmission({
      url: body.url,
      brandName: body.brandName || 'Afimah Clothing Store',
      authorName: body.authorName || 'Raza',
      email: body.email || 'an3710828@gmail.com',
      targetLandingPage: body.targetLandingPage || 'https://www.afimahclothingstore.com',
      anchorText: body.anchorText || 'sustainable luxury apparel',
      title: body.title || 'The 2026 Shift in Contemporary Fashion: Sustainable Luxury',
      content: body.content || '',
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
