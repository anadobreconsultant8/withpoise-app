import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlanByPriceId } from '@/lib/plans'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        creditsLeft: true,
        creditsTotal: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
        stripeCancelAtPeriodEnd: true,
        createdAt: true,
        passwordHash: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If plan is still 'free' but user has an active Stripe subscription,
    // infer the real plan from stripePriceId to handle webhook delivery delays/failures
    const effectivePlan =
      user.plan !== 'free'
        ? user.plan
        : user.stripePriceId
        ? (getPlanByPriceId(user.stripePriceId) ?? 'free')
        : 'free'

    // Never expose passwordHash to client — return boolean instead
    const { passwordHash, ...safeUser } = user
    return NextResponse.json({ ...safeUser, hasPassword: !!passwordHash, effectivePlan })
  } catch (error) {
    console.error('[user]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
