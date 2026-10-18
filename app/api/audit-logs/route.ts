import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const severity = searchParams.get('severity')
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    let query = 'SELECT * FROM audit_logs WHERE 1=1'
    const params: any[] = []

    if (category && category !== 'all') {
      query += ' AND category = ?'
      params.push(category)
    }
    if (severity && severity !== 'all') {
      query += ' AND severity = ?'
      params.push(severity)
    }

    query += ' ORDER BY created_at DESC LIMIT ?'
    params.push(limit)

    const logs = db.prepare(query).all(...params)
    return NextResponse.json({ success: true, logs })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = getDatabase()
    db.prepare('DELETE FROM audit_logs').run()
    return NextResponse.json({ success: true, message: 'Audit logs cleared' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
