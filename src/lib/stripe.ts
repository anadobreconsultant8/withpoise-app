// SERVER-SIDE ONLY — do not import this in client components
import Stripe from 'stripe'
import { prisma } from './prisma'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder', {
  apiVersion: '2025-02-24.acacia' as const,
})

// Re-export plan helpers from plans.ts for convenience in server code
export { PLANS, getPlanByPriceId, getCreditsForPlan } from './plans'
export type { PlanName } from './plans'

/**
 * Returns a valid Stripe customer ID for the given user.
 * If the stored ID belongs to a different Stripe mode (e.g. test→live switch)
 * or no longer exists, it creates a fresh customer and persists it.
 */
export async function getOrCreateStripeCustomer(
  user: { id: string; email: string | null; name: string | null; stripeCustomerId: string | null },
): Promise<string> {
  if (user.stripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(user.stripeCustomerId)
      if (!('deleted' in existing && existing.deleted)) {
        return user.stripeCustomerId
      }
    } catch {
      // resource_missing or other error — fall through to create new customer
    }
  }

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id, stripeSubscriptionId: null, stripePriceId: null },
  })

  return customer.id
}
