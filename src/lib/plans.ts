// Plan definitions — safe to import on both client and server
// (no Stripe client initialization here)

export const PLANS = {
  starter: {
    name: 'Starter',
    credits: 30,
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? '',
    features: [
      '30 responses per month',
      'All 5 objection categories',
      'All 4 tone settings',
      'Response history (20)',
      'Copy to clipboard',
    ],
  },
  pro: {
    name: 'Pro',
    credits: 100,
    price: 79,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
    features: [
      '100 responses per month',
      'All Starter features',
      'Priority generation speed',
      'Full response history',
      'Email support',
    ],
  },
  elite: {
    name: 'Elite',
    credits: 300,
    price: 149,
    priceId: process.env.STRIPE_ELITE_PRICE_ID ?? '',
    features: [
      '300 responses per month',
      'All Pro features',
      'Dedicated support',
      'Early access to new features',
      'Custom tone fine-tuning',
    ],
  },
} as const

export type PlanName = keyof typeof PLANS

export function getPlanByPriceId(priceId: string): PlanName | null {
  for (const [name, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return name as PlanName
  }
  return null
}

export function getCreditsForPlan(plan: string): number {
  if (plan in PLANS) return PLANS[plan as PlanName].credits
  return 5 // free plan
}

// ─── CREDIT TOP-UP PACKS ────────────────────────────────────────────────────
// One-time purchases — credits are added on top of existing balance.
// Create these as one-time prices in Stripe Dashboard.

export const CREDIT_PACKS = [
  {
    id: 'boost',
    name: 'Boost',
    credits: 20,
    price: 7,
    priceId: process.env.STRIPE_CREDITS_BOOST_PRICE_ID ?? '',
    badge: null,
    anchor: 'Less than a coffee',
    perCredit: '0.35',
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 60,
    price: 17,
    priceId: process.env.STRIPE_CREDITS_GROWTH_PRICE_ID ?? '',
    badge: 'Best Value',
    anchor: 'Save 20% vs Boost',
    perCredit: '0.28',
  },
  {
    id: 'power',
    name: 'Power',
    credits: 120,
    price: 29,
    priceId: process.env.STRIPE_CREDITS_POWER_PRICE_ID ?? '',
    badge: null,
    anchor: 'Save 31% vs Boost',
    perCredit: '0.24',
  },
] as const

export type CreditPackId = typeof CREDIT_PACKS[number]['id']

export function getCreditPackByPriceId(priceId: string) {
  return CREDIT_PACKS.find(p => p.priceId === priceId) ?? null
}
