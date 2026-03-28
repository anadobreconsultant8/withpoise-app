import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    // Validate customer still exists in the current Stripe mode
    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId)
      if ('deleted' in customer && customer.deleted) throw new Error('deleted')
    } catch {
      // Customer from test mode — clear stale IDs so user can re-subscribe
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: null, stripeSubscriptionId: null, stripePriceId: null, plan: 'free' },
      })
      return NextResponse.json({ error: 'Your billing account was reset. Please subscribe again from the pricing page.' }, { status: 404 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('[stripe/portal]', error)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}
