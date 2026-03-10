import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getPlanByPriceId, getCreditsForPlan, PLANS } from '@/lib/plans'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id
        const planName = getPlanByPriceId(priceId)
        if (!planName) break

        const credits = getCreditsForPlan(planName)

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan: planName,
            creditsLeft: credits,
            creditsTotal: credits,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        // Only reset credits on renewal, not on initial payment
        if (invoice.billing_reason !== 'subscription_cycle') break

        const customerId = invoice.customer as string
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0].price.id
        const planName = getPlanByPriceId(priceId)
        if (!planName) break

        const credits = getCreditsForPlan(planName)

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            creditsLeft: credits,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0].price.id
        const planName = getPlanByPriceId(priceId)
        if (!planName) break

        const newCredits = PLANS[planName].credits
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
          select: { creditsLeft: true, creditsTotal: true },
        })

        if (!user) break

        // On upgrade: add the difference; on downgrade: cap credits at new plan limit
        const creditDiff = newCredits - user.creditsTotal
        const newCreditsLeft =
          creditDiff > 0
            ? user.creditsLeft + creditDiff
            : Math.min(user.creditsLeft, newCredits)

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan: planName,
            creditsLeft: newCreditsLeft,
            creditsTotal: newCredits,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: {
            plan: 'free',
            creditsLeft: 0,
            creditsTotal: 0,
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        })
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[webhook] Handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
