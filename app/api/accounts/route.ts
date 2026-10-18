import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { onboardAccountForTarget } from '@/lib/agent/account-agent'
import { maskCredential } from '@/lib/security/encryption'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const targetId = searchParams.get('targetId')

    let query = `
      SELECT u.id, u.target_website_id, u.domain, u.username, u.email,
             u.registration_url, u.login_url, u.account_status, u.last_login_at,
             u.created_at, u.updated_at,
             t.website_name, t.website_url
      FROM user_accounts u
      LEFT JOIN target_websites t ON u.target_website_id = t.id
    `
    const params: any[] = []
    if (targetId) {
      query += ' WHERE u.target_website_id = ?'
      params.push(targetId)
    }
    query += ' ORDER BY u.created_at DESC'

    const accounts = db.prepare(query).all(...params)
    // Mask sensitive passwords for safe display
    const sanitized = accounts.map((a: any) => ({
      ...a,
      maskedPassword: '••••••••',
    }))

    return NextResponse.json({ success: true, accounts: sanitized })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { targetWebsiteId, email, password } = await req.json()
    if (!targetWebsiteId) {
      return NextResponse.json({ success: false, error: 'targetWebsiteId is required' }, { status: 400 })
    }

    const result = await onboardAccountForTarget(targetWebsiteId, email, password)
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const db = getDatabase()
    const { id, account_status, username, email } = await req.json()
    if (!id) {
      return NextResponse.json({ success: false, error: 'Account ID required' }, { status: 400 })
    }

    const updates: string[] = []
    const values: any[] = []

    if (account_status) {
      updates.push('account_status = ?')
      values.push(account_status)
    }
    if (username) {
      updates.push('username = ?')
      values.push(username)
    }
    if (email) {
      updates.push('email = ?')
      values.push(email)
    }

    if (updates.length > 0) {
      updates.push('updated_at = ?')
      values.push(new Date().toISOString())
      values.push(id)
      db.prepare(`UPDATE user_accounts SET ${updates.join(', ')} WHERE id = ?`).run(...values)
    }

    return NextResponse.json({ success: true, message: 'Account updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
