import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await req.json()
    if (!priceId) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 })
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
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)
      const itemId = subscription.items.data[0].id

      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        items: [{ id: itemId, price: priceId }],
        proration_behavior: 'create_prorations',
      })

      return NextResponse.json({ url: `${baseUrl}/dashboard?upgraded=true&creditsAdded=1` })
    }

    // ── No subscription yet → create Stripe customer if needed + checkout session ──
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

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
