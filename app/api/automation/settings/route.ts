import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const settings = db.prepare('SELECT * FROM automation_settings LIMIT 1').get()
    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = getDatabase()
    const body = await req.json()
    const now = new Date().toISOString()

    const fields = [
      'mode', 'daily_task_limit', 'monthly_backlink_target', 'concurrent_browser_workers',
      'retry_limit', 'per_domain_cooldown_hours', 'duplicate_prevention', 'require_editorial_approval',
      'enforce_spam_threshold', 'max_allowed_spam_score', 'min_domain_authority',
      'sender_name', 'sender_email', 'sender_company', 'compliance_footer'
    ]

    const setClauses: string[] = []
    const values: any[] = []

    for (const f of fields) {
      if (body[f] !== undefined) {
        setClauses.push(`${f} = ?`)
        values.push(body[f])
      }
    }

    if (setClauses.length > 0) {
      setClauses.push('updated_at = ?')
      values.push(now)
      db.prepare(`UPDATE automation_settings SET ${setClauses.join(', ')} WHERE id = 'settings_default'`).run(...values)
    }

    const updated = db.prepare('SELECT * FROM automation_settings LIMIT 1').get()
    return NextResponse.json({ success: true, settings: updated })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
