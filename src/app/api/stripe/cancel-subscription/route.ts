import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

// Cancel at period end (or resume if already scheduled to cancel)
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { resume } = await req.json().catch(() => ({ resume: false }))

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true, stripeCancelAtPeriodEnd: true },
  })

  if (!user?.stripeSubscriptionId) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
  }

  const updated = await stripe.subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: !resume,
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { stripeCancelAtPeriodEnd: updated.cancel_at_period_end },
  })

  return NextResponse.json({ cancelAtPeriodEnd: updated.cancel_at_period_end })
}
