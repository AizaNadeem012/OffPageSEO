import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id)
      if (!campaign) {
        return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, campaign })
    }

    const campaigns = db.prepare('SELECT * FROM campaigns ORDER BY created_at DESC').all()
    return NextResponse.json({ success: true, campaigns })
  } catch (err: any) {
    console.error('Failed to get campaigns:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDatabase()
    const body = await req.json()

    const id = body.id || `camp_${Date.now()}`
    const now = new Date().toISOString()

    const name = body.name || 'New Off-Page SEO Campaign'
    const website_url = body.website_url || 'https://www.afimahclothingstore.com'
    const description = body.description || ''
    const niche = body.niche || 'General Business'
    const target_countries = typeof body.target_countries === 'string' ? body.target_countries : JSON.stringify(body.target_countries || ['United States'])
    const target_audience = body.target_audience || ''
    const primary_keywords = typeof body.primary_keywords === 'string' ? body.primary_keywords : JSON.stringify(body.primary_keywords || [])
    const secondary_keywords = typeof body.secondary_keywords === 'string' ? body.secondary_keywords : JSON.stringify(body.secondary_keywords || [])
    const target_landing_pages = typeof body.target_landing_pages === 'string' ? body.target_landing_pages : JSON.stringify(body.target_landing_pages || [website_url])
    const preferred_anchors = typeof body.preferred_anchors === 'string' ? body.preferred_anchors : JSON.stringify(body.preferred_anchors || [name])
    const brand_voice = body.brand_voice || 'Authoritative and Professional'
    const seo_objectives = body.seo_objectives || 'Increase authority and organic rankings'
    const content_language = body.content_language || 'en'
    const content_types = typeof body.content_types === 'string' ? body.content_types : JSON.stringify(body.content_types || ['articles', 'directory_listings', 'guest_posts'])
    const monthly_backlink_target = parseInt(body.monthly_backlink_target || '50', 10)
    const daily_action_limit = parseInt(body.daily_action_limit || '15', 10)
    const max_registrations_per_day = parseInt(body.max_registrations_per_day || '5', 10)
    const link_quality_requirements = body.link_quality_requirements || 'DA >= 40, Spam <= 10%'
    const preferred_categories = typeof body.preferred_categories === 'string' ? body.preferred_categories : JSON.stringify(body.preferred_categories || [])
    const excluded_categories = typeof body.excluded_categories === 'string' ? body.excluded_categories : JSON.stringify(body.excluded_categories || ['Gambling', 'Adult', 'Pharma'])
    const raw_ai_instructions = body.raw_ai_instructions || ''
    const status = body.status || 'active'

    db.prepare(`
      INSERT INTO campaigns (
        id, name, website_url, description, niche,
        target_countries, target_audience, primary_keywords, secondary_keywords,
        target_landing_pages, preferred_anchors, brand_voice, seo_objectives,
        content_language, content_types, monthly_backlink_target, daily_action_limit,
        max_registrations_per_day, link_quality_requirements, preferred_categories,
        excluded_categories, raw_ai_instructions, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, website_url, description, niche,
      target_countries, target_audience, primary_keywords, secondary_keywords,
      target_landing_pages, preferred_anchors, brand_voice, seo_objectives,
      content_language, content_types, monthly_backlink_target, daily_action_limit,
      max_registrations_per_day, link_quality_requirements, preferred_categories,
      excluded_categories, raw_ai_instructions, status, now, now
    )

    // Audit log
    db.prepare(`
      INSERT INTO audit_logs (id, campaign_id, action, category, severity, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `log_${Date.now()}`,
      id,
      'Master Campaign Created',
      'system',
      'success',
      `Campaign "${name}" initialized with monthly target of ${monthly_backlink_target} backlinks.`,
      now
    )

    const created = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id)
    return NextResponse.json({ success: true, campaign: created })
  } catch (err: any) {
    console.error('Failed to create campaign:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = getDatabase()
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Campaign ID required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const fieldsToUpdate = [
      'name', 'website_url', 'description', 'niche', 'target_countries',
      'target_audience', 'primary_keywords', 'secondary_keywords',
      'target_landing_pages', 'preferred_anchors', 'brand_voice', 'seo_objectives',
      'content_language', 'content_types', 'monthly_backlink_target', 'daily_action_limit',
      'max_registrations_per_day', 'link_quality_requirements', 'preferred_categories',
      'excluded_categories', 'raw_ai_instructions', 'status'
    ]

    const setClauses: string[] = []
    const values: any[] = []

    for (const field of fieldsToUpdate) {
      if (body[field] !== undefined) {
        setClauses.push(`${field} = ?`)
        let val = body[field]
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val)
        }
        values.push(val)
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ success: true, message: 'No fields to update' })
    }

    setClauses.push('updated_at = ?')
    values.push(now)
    values.push(id)

    db.prepare(`UPDATE campaigns SET ${setClauses.join(', ')} WHERE id = ?`).run(...values)

    const updated = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id)
    return NextResponse.json({ success: true, campaign: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
