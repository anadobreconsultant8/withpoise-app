import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, stripeSubscriptionId: true, stripeCustomerId: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Cancel Stripe subscription if active
    if (user.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId)
      } catch (err) {
        console.error('[delete-account] Failed to cancel subscription:', err)
      }
    }

    // Delete all user data (cascade handles generations, sessions, accounts)
    await prisma.user.delete({ where: { id: user.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[delete-account]', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
