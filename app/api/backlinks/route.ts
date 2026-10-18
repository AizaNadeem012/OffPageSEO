import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { verifyLiveBacklink } from '@/lib/agent/verifier'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    let query = `
      SELECT b.*, t.website_name, t.domain_authority
      FROM backlinks b
      LEFT JOIN target_websites t ON b.target_website_id = t.id
      WHERE 1=1
    `
    const params: any[] = []

    if (campaignId) {
      query += ' AND b.campaign_id = ?'
      params.push(campaignId)
    }
    if (status && status !== 'all') {
      query += ' AND b.verification_status = ?'
      params.push(status)
    }

    query += ' ORDER BY b.created_at DESC LIMIT ?'
    params.push(limit)

    const backlinks = db.prepare(query).all(...params)
    return NextResponse.json({ success: true, backlinks })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { backlinkId, sourcePageUrl, targetLandingPage, expectedAnchor } = await req.json()
    const db = getDatabase()

    if (backlinkId) {
      const bl = db.prepare('SELECT * FROM backlinks WHERE id = ?').get(backlinkId) as any
      if (!bl) {
        return NextResponse.json({ success: false, error: 'Backlink record not found' }, { status: 404 })
      }

      const result = await verifyLiveBacklink(
        bl.source_page_url,
        bl.target_landing_page,
        bl.anchor_text,
        bl.id
      )
      return NextResponse.json({ success: true, result })
    }

    if (!sourcePageUrl || !targetLandingPage) {
      return NextResponse.json(
        { success: false, error: 'sourcePageUrl and targetLandingPage are required' },
        { status: 400 }
      )
    }

    const result = await verifyLiveBacklink(
      sourcePageUrl,
      targetLandingPage,
      expectedAnchor || 'Afimah Clothing Store'
    )

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
