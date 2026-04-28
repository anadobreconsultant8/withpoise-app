import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReengagementEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()

  const oneDayAgo = new Date(now)
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const fourDaysAgo = new Date(now)
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4)

  let sent = 0
  let failed = 0

  // Email 2: signed up > 24h ago, 0 generations, never sent this email
  const noActivityUsers = await prisma.user.findMany({
    where: {
      plan: 'free',
      createdAt: { lt: oneDayAgo },
      emailSentNoActivity: false,
      generations: { none: {} },
    },
    select: { id: true, email: true, name: true },
  })

  for (const user of noActivityUsers) {
    try {
      await sendReengagementEmail(user.email!, user.name, 'no-activity')
      await prisma.user.update({
        where: { id: user.id },
        data: { emailSentNoActivity: true },
      })
      sent++
    } catch (err) {
      console.error(`[reengagement] no-activity failed for ${user.id}:`, err)
      failed++
    }
  }

  // Email 6: signed up > 4 days ago, still on free plan, never sent this email
  // Requires emailSentNoActivity: true to avoid sending both emails in the same cron run
  const stillFreeUsers = await prisma.user.findMany({
    where: {
      plan: 'free',
      createdAt: { lt: fourDaysAgo },
      emailSentReengage: false,
      emailSentNoActivity: true,
    },
    select: { id: true, email: true, name: true },
  })

  for (const user of stillFreeUsers) {
    try {
      await sendReengagementEmail(user.email!, user.name, 'still-free')
      await prisma.user.update({
        where: { id: user.id },
        data: { emailSentReengage: true },
      })
      sent++
    } catch (err) {
      console.error(`[reengagement] still-free failed for ${user.id}:`, err)
      failed++
    }
  }

  console.log(`[reengagement] Sent: ${sent}, Failed: ${failed}`)
  return NextResponse.json({ sent, failed })
}
