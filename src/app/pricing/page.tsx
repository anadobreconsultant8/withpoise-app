'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Check, Star } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { PLANS } from '@/lib/plans'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(priceId: string, planKey: string) {
    if (!session) {
      router.push('/register')
      return
    }

    setLoading(planKey)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    { key: 'starter', ...PLANS.starter, popular: false },
    { key: 'pro', ...PLANS.pro, popular: true },
    { key: 'elite', ...PLANS.elite, popular: false },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto">
            Start free with 5 responses. Upgrade when you need more firepower.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.key}
              className={`card relative flex flex-col ${
                plan.popular
                  ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] glow'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text)]">{plan.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--color-text)]">${plan.price}</span>
                  <span className="text-[var(--color-text-muted)] text-sm">/month</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {plan.credits} responses per month
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-4 h-4 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.priceId, plan.key)}
                disabled={loading === plan.key}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'
                    : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.key ? 'Redirecting...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Free plan note */}
        <div className="mt-8 card flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[var(--color-primary)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Free — 5 responses included</p>
              <p className="text-xs text-[var(--color-text-muted)]">No credit card required to get started</p>
            </div>
          </div>
          {!session && (
            <Link href="/register" className="btn-secondary text-sm">
              Start for free
            </Link>
          )}
        </div>

        {/* Guarantee + contact */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            7-day money-back guarantee on all plans. No questions asked.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Need a custom plan?{' '}
            <a
              href="mailto:ana@withpoise.com"
              className="text-[var(--color-primary)] hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
