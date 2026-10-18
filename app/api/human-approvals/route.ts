import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'pending'

    let query = `
      SELECT h.*, t.website_name, t.normalized_domain, t.website_url, u.username as account_username, u.email as account_email
      FROM human_approvals h
      LEFT JOIN target_websites t ON h.target_website_id = t.id
      LEFT JOIN user_accounts u ON h.target_website_id = u.target_website_id
      WHERE 1=1
    `
    const params: any[] = []
    if (status !== 'all') {
      query += ' AND h.status = ?'
      params.push(status)
    }

    query += ' ORDER BY h.created_at DESC'

    const approvals = db.prepare(query).all(...params)
    return NextResponse.json({ success: true, approvals })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDatabase()
    const { approvalId, action } = await req.json() // action: 'resolve_and_resume' | 'dismiss'

    if (!approvalId) {
      return NextResponse.json({ success: false, error: 'approvalId is required' }, { status: 400 })
    }

    const approval = db.prepare('SELECT * FROM human_approvals WHERE id = ?').get(approvalId) as any
    if (!approval) {
      return NextResponse.json({ success: false, error: 'Approval record not found' }, { status: 404 })
    }

    const now = new Date().toISOString()

    if (action === 'resolve_and_resume') {
      // Mark approval as resolved
      db.prepare("UPDATE human_approvals SET status = 'resolved', resolved_at = ? WHERE id = ?").run(now, approvalId)

      // Unpause any paused task in queue for this target
      if (approval.target_website_id) {
        db.prepare(`
          UPDATE task_queues SET status = 'pending', error_message = NULL
          WHERE target_website_id = ? AND status = 'paused'
        `).run(approval.target_website_id)

        // Update target status to eligible or in_progress
        db.prepare("UPDATE target_websites SET status = 'eligible', updated_at = ? WHERE id = ?").run(now, approval.target_website_id)

        // If it was an account challenge, mark account as verified
        db.prepare("UPDATE user_accounts SET account_status = 'verified', updated_at = ? WHERE target_website_id = ?").run(now, approval.target_website_id)
      }

      // Audit log
      db.prepare(`
        INSERT INTO audit_logs (id, campaign_id, action, category, severity, details, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `log_appr_${Date.now()}`,
        approval.campaign_id || 'camp_master_default',
        'Human Action Resolved & Resumed',
        'system',
        'success',
        `User confirmed completion of ${approval.approval_type} on target ${approval.target_website_id}. Task resumed.`,
        now
      )

      return NextResponse.json({
        success: true,
        message: 'Action resolved. Autonomous agent has resumed execution for this target.',
      })
    }

    if (action === 'dismiss') {
      db.prepare('UPDATE human_approvals SET status = "dismissed", resolved_at = ? WHERE id = ?').run(now, approvalId)
      return NextResponse.json({ success: true, message: 'Approval dismissed.' })
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
