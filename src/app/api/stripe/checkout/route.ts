import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, getOrCreateStripeCustomer } from '@/lib/stripe'
import { PLANS } from '@/lib/plans'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planKey } = await req.json()
    if (!planKey || !(planKey in PLANS)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = PLANS[planKey as keyof typeof PLANS].priceId
    if (!priceId) {
      return NextResponse.json({ error: 'Plan price not configured' }, { status: 500 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, stripeCustomerId: true, stripeSubscriptionId: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // ── User already has an active subscription → update it directly ──
    if (user.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)

        // Only update if the subscription is still active
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          const itemId = subscription.items.data[0].id
          await stripe.subscriptions.update(user.stripeSubscriptionId, {
            items: [{ id: itemId, price: priceId }],
            proration_behavior: 'create_prorations',
          })
          // customer.subscription.updated webhook updates the DB — no ?upgraded=true here
          // since that flag is reserved for the checkout.session.completed flow
          return NextResponse.json({ url: `${baseUrl}/dashboard` })
        }

        // Subscription exists but is not active (cancelled, expired) — clear it and fall through
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeSubscriptionId: null, stripePriceId: null },
        })
      } catch {
        // Subscription not found in Stripe (stale ID) — clear it and fall through to checkout
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeSubscriptionId: null, stripePriceId: null },
        })
      }
    }

    // ── No subscription yet → get/create valid Stripe customer + checkout session ──
    const customerId = await getOrCreateStripeCustomer(user)

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgraded=true`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('[stripe/checkout]', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
