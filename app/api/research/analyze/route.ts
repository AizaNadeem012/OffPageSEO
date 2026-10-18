import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { runWebsiteResearch } from '@/lib/agent/research-agent'

export async function POST(req: NextRequest) {
  try {
    const { targetWebsiteId, targetWebsiteIds } = await req.json()
    const db = getDatabase()

    // Get default campaign settings for context
    const campaign = db.prepare("SELECT * FROM campaigns WHERE status = 'active' LIMIT 1").get() as any
    const niche = campaign?.niche || 'Fashion & Apparel'
    let keywords: string[] = []
    try {
      keywords = JSON.parse(campaign?.primary_keywords || '[]')
    } catch {
      keywords = ['fashion', 'apparel']
    }

    // Single target
    if (targetWebsiteId) {
      const target = db.prepare('SELECT * FROM target_websites WHERE id = ?').get(targetWebsiteId) as any
      if (!target) {
        return NextResponse.json({ success: false, error: 'Target website not found' }, { status: 404 })
      }

      const observation = await runWebsiteResearch(target.id, target.website_url, niche, keywords)
      return NextResponse.json({ success: true, observation })
    }

    // Batch targets
    if (Array.isArray(targetWebsiteIds) && targetWebsiteIds.length > 0) {
      const observations = []
      for (const id of targetWebsiteIds.slice(0, 10)) {
        const target = db.prepare('SELECT * FROM target_websites WHERE id = ?').get(id) as any
        if (target) {
          const obs = await runWebsiteResearch(target.id, target.website_url, niche, keywords)
          observations.push(obs)
        }
      }
      return NextResponse.json({ success: true, count: observations.length, observations })
    }

    return NextResponse.json({ success: false, error: 'targetWebsiteId or targetWebsiteIds required' }, { status: 400 })
  } catch (err: any) {
    console.error('Research route error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const targetId = searchParams.get('targetId')

    if (targetId) {
      const assessment = db.prepare('SELECT * FROM website_assessments WHERE target_website_id = ?').get(targetId)
      return NextResponse.json({ success: true, assessment })
    }

    const assessments = db.prepare(`
      SELECT a.*, t.website_url, t.normalized_domain, t.website_name, t.priority
      FROM website_assessments a
      JOIN target_websites t ON a.target_website_id = t.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `).all()

    return NextResponse.json({ success: true, assessments })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
