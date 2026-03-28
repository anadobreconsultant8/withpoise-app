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

    const { packId } = await req.json()
    if (!packId) {
      return NextResponse.json({ error: 'packId is required' }, { status: 400 })
    }

    const { CREDIT_PACKS } = await import('@/lib/plans')
    const pack = CREDIT_PACKS.find(p => p.id === packId)
    if (!pack) {
      return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 })
    }

    const priceId = pack.priceId
    if (!priceId) {
      return NextResponse.json({ error: 'Credit pack price not configured' }, { status: 500 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, stripeCustomerId: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get or create Stripe customer
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

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // One-time payment checkout (mode: 'payment')
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?credits_added=true`,
      cancel_url: `${baseUrl}/dashboard`,
      metadata: {
        userId: user.id,
        type: 'credit_pack',
        packId: pack.id,
        credits: String(pack.credits),
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('[stripe/credits]', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
