import { NextRequest, NextResponse } from 'next/server'
import { executeRemotePublishing } from '@/lib/agent/publishing-agent'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await executeRemotePublishing({
      targetWebsiteUrl: body.targetWebsiteUrl,
      loginUrl: body.loginUrl,
      submissionUrl: body.submissionUrl,
      username: body.username,
      password: body.password,
      title: body.title,
      bodyContent: body.bodyContent || body.content,
      targetLandingPage: body.targetLandingPage || 'https://www.afimahclothingstore.com',
      anchorText: body.anchorText || 'sustainable luxury apparel',
      category: body.category,
      platformType: body.platformType,
    })

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
