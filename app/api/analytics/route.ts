import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase()

    const targetCounts = db.prepare(`
      SELECT status, COUNT(*) as count FROM target_websites GROUP BY status
    `).all() as { status: string; count: number }[]

    const totalWebsites = db.prepare('SELECT COUNT(*) as count FROM target_websites').get() as { count: number }
    const totalBacklinks = db.prepare('SELECT COUNT(*) as count FROM backlinks').get() as { count: number }
    const verifiedBacklinks = db.prepare("SELECT COUNT(*) as count FROM backlinks WHERE verification_status = 'verified'").get() as { count: number }
    const pendingApprovals = db.prepare("SELECT COUNT(*) as count FROM human_approvals WHERE status = 'pending'").get() as { count: number }
    const totalDrafts = db.prepare('SELECT COUNT(*) as count FROM content_drafts').get() as { count: number }
    const totalAccounts = db.prepare('SELECT COUNT(*) as count FROM user_accounts').get() as { count: number }
    const activeTasks = db.prepare("SELECT COUNT(*) as count FROM task_queues WHERE status = 'pending' OR status = 'processing'").get() as { count: number }

    // Average DA
    const avgDA = db.prepare('SELECT AVG(domain_authority) as avg_da FROM target_websites').get() as { avg_da: number }

    const statusMap: Record<string, number> = {}
    targetCounts.forEach((tc) => {
      statusMap[tc.status] = tc.count
    })

    return NextResponse.json({
      success: true,
      analytics: {
        totalWebsites: totalWebsites.count,
        totalBacklinks: totalBacklinks.count,
        verifiedBacklinks: verifiedBacklinks.count,
        pendingApprovals: pendingApprovals.count,
        totalDrafts: totalDrafts.count,
        totalAccounts: totalAccounts.count,
        activeTasks: activeTasks.count,
        averageDomainAuthority: Math.round(avgDA.avg_da || 50),
        statusBreakdown: statusMap,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
