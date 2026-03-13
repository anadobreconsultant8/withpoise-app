import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { sendRenewalReminderEmail } from '@/lib/email'
const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter',
  pro: 'Pro',
  elite: 'Elite',
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now)
  windowStart.setDate(windowStart.getDate() + 5)
  windowStart.setHours(0, 0, 0, 0)

  const windowEnd = new Date(windowStart)
  windowEnd.setDate(windowEnd.getDate() + 1)

  const users = await prisma.user.findMany({
    where: {
      plan: { not: 'free' },
      stripeCurrentPeriodEnd: {
        gte: windowStart,
        lt: windowEnd,
      },
      stripeCustomerId: { not: null },
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
    },
  })

  let sent = 0
  let failed = 0

  for (const user of users) {
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId!,
        return_url: `${process.env.NEXTAUTH_URL}/account`,
      })

      const renewalDate = user.stripeCurrentPeriodEnd!.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

      const planLabel = PLAN_LABELS[user.plan] ?? user.plan

      await sendRenewalReminderEmail(
        user.email!,
        user.name,
        5,
        planLabel,
        renewalDate,
        portalSession.url,
      )

      sent++
    } catch (err) {
      console.error(`[renewal-reminder] Failed for user ${user.id}:`, err)
      failed++
    }
  }

  console.log(`[renewal-reminder] Sent: ${sent}, Failed: ${failed}, Total: ${users.length}`)
  return NextResponse.json({ sent, failed, total: users.length })
}
