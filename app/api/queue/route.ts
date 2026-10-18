import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'
import { processTaskQueue } from '@/lib/queue/task-orchestrator'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    let query = `
      SELECT q.*, t.website_name, t.normalized_domain, t.website_url, t.category
      FROM task_queues q
      LEFT JOIN target_websites t ON q.target_website_id = t.id
      WHERE 1=1
    `
    const params: any[] = []
    if (status && status !== 'all') {
      query += ' AND q.status = ?'
      params.push(status)
    }

    query += ' ORDER BY q.created_at DESC LIMIT ?'
    params.push(limit)

    const tasks = db.prepare(query).all(...params)

    // Summary counts
    const counts = db.prepare(`
      SELECT status, COUNT(*) as count FROM task_queues GROUP BY status
    `).all() as { status: string; count: number }[]

    const countMap: Record<string, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      paused: 0,
    }
    counts.forEach((c) => {
      countMap[c.status] = c.count
    })

    return NextResponse.json({ success: true, tasks, counts: countMap })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const batchSize = parseInt(body?.batchSize || '5', 10)

    const summary = await processTaskQueue(batchSize)
    return NextResponse.json({ success: true, summary })
  } catch (err: any) {
    console.error('Task queue error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
