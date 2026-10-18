import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { generatePlatformContent, ContentPlatformType } from '@/lib/ai/content-engine'

export async function POST(req: NextRequest) {
  try {
    const { campaignId, targetWebsiteId, contentType, intendedPlacement } = await req.json()

    if (!targetWebsiteId) {
      return NextResponse.json({ success: false, error: 'targetWebsiteId is required' }, { status: 400 })
    }

    const draft = await generatePlatformContent({
      campaignId: campaignId || 'camp_master_default',
      targetWebsiteId,
      contentType: (contentType || 'article') as ContentPlatformType,
      intendedPlacement,
    })

    return NextResponse.json({ success: true, draft })
  } catch (err: any) {
    console.error('Content generation error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const targetId = searchParams.get('targetId')
    const status = searchParams.get('status')

    let query = `
      SELECT d.*, t.website_name, t.normalized_domain, t.website_url
      FROM content_drafts d
      JOIN target_websites t ON d.target_website_id = t.id
      WHERE 1=1
    `
    const params: any[] = []

    if (targetId) {
      query += ' AND d.target_website_id = ?'
      params.push(targetId)
    }
    if (status && status !== 'all') {
      query += ' AND d.status = ?'
      params.push(status)
    }

    query += ' ORDER BY d.created_at DESC LIMIT 100'

    const drafts = db.prepare(query).all(...params)
    return NextResponse.json({ success: true, drafts })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = getDatabase()
    const { id, title, body, status, target_url, anchor_text } = await req.json()

    if (!id) {
      return NextResponse.json({ success: false, error: 'Draft ID required' }, { status: 400 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (title !== undefined) {
      updates.push('title = ?')
      values.push(title)
    }
    if (body !== undefined) {
      updates.push('body = ?')
      values.push(body)
    }
    if (status !== undefined) {
      updates.push('status = ?')
      values.push(status)
    }
    if (target_url !== undefined) {
      updates.push('target_url = ?')
      values.push(target_url)
    }
    if (anchor_text !== undefined) {
      updates.push('anchor_text = ?')
      values.push(anchor_text)
    }

    if (updates.length > 0) {
      updates.push('updated_at = ?')
      values.push(new Date().toISOString())
      values.push(id)
      db.prepare(`UPDATE content_drafts SET ${updates.join(', ')} WHERE id = ?`).run(...values)
    }

    return NextResponse.json({ success: true, message: 'Draft updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
