// SERVER-SIDE ONLY — do not import this in client components
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as const,
})

// Re-export plan helpers from plans.ts for convenience in server code
export { PLANS, getPlanByPriceId, getCreditsForPlan } from './plans'
export type { PlanName } from './plans'
