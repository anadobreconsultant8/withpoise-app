import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendAdminMonthlyReport } from '@/lib/email'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalUsers, newUsersThisMonth, planCounts] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: firstOfLastMonth, lt: firstOfThisMonth } } }),
    prisma.user.groupBy({ by: ['plan'], _count: { _all: true } }),
  ])

  const counts: Record<string, number> = { free: 0, starter: 0, pro: 0, elite: 0 }
  for (const row of planCounts) {
    counts[row.plan] = row._count._all
  }

  const totalPaid = counts.starter + counts.pro + counts.elite
  const estimatedMRR = counts.starter * 29 + counts.pro * 79 + counts.elite * 149

  const month = firstOfLastMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  await sendAdminMonthlyReport({
    month,
    totalUsers,
    newUsersThisMonth,
    free: counts.free,
    starter: counts.starter,
    pro: counts.pro,
    elite: counts.elite,
    totalPaid,
    estimatedMRR,
  })

  return NextResponse.json({ ok: true, totalUsers, totalPaid, estimatedMRR })
}
