'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Check, Star, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { PLANS } from '@/lib/plans'
import { pixelTrack } from '@/lib/meta-pixel'

const PLAN_ORDER = ['starter', 'pro', 'elite'] as const

export default function PricingPage() {
  return (
    <Suspense>
      <PricingPageContent />
    </Suspense>
  )
}

function PricingPageContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [creditsLeft, setCreditsLeft] = useState<number>(0)

  useEffect(() => {
    if (session) {
      fetch('/api/user')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            // Use effectivePlan which resolves data inconsistencies (e.g. webhook delays)
            setUserPlan(data.effectivePlan || data.plan)
            setCreditsLeft(data.creditsLeft)
          }
        })
    }
  }, [session])

  useEffect(() => {
    const autoCheckout = searchParams.get('autoCheckout')
    if (autoCheckout && session && userPlan === 'free') {
      handleCheckout(autoCheckout)
    }
  }, [session, userPlan]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCheckout(planKey: string) {
    if (!session) {
      router.push(`/register?plan=${planKey}`)
      return
    }

    setLoading(planKey)
    setCheckoutError(null)
    pixelTrack('InitiateCheckout', { content_name: planKey })
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setCheckoutError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setCheckoutError('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    { key: 'starter', ...PLANS.starter, popular: false },
    { key: 'pro', ...PLANS.pro, popular: true },
    { key: 'elite', ...PLANS.elite, popular: false },
  ]

  function getButtonState(planKey: string) {
    if (!session) return { label: 'Get Started', action: true, style: 'default' }
    if (!userPlan || userPlan === 'free') {
      return { label: 'Upgrade', action: true, style: 'default' }
    }
    if (userPlan === planKey) return { label: 'Current Plan', action: false, style: 'current' }
    const userIdx = PLAN_ORDER.indexOf(userPlan as typeof PLAN_ORDER[number])
    const planIdx = PLAN_ORDER.indexOf(planKey as typeof PLAN_ORDER[number])
    if (planIdx > userIdx) return { label: 'Upgrade', action: true, style: 'default' }
    return { label: 'Downgrade', action: true, style: 'muted' }
  }

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
            {session ? 'Upgrade when you need more firepower.' : 'Start free with 5 responses. Upgrade when you need more firepower.'}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => {
            const btn = getButtonState(plan.key)
            const isCurrent = btn.style === 'current'

            return (
              <div
                key={plan.key}
                className={`card relative flex flex-col ${
                  isCurrent
                    ? 'border-[var(--color-success)] ring-1 ring-[var(--color-success)]'
                    : plan.popular && !isCurrent
                    ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)] glow'
                    : ''
                }`}
              >
                {/* Badge */}
                {isCurrent ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-success)] text-white text-xs font-semibold">
                      <Check className="w-3 h-3" /> Your Plan
                    </span>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                ) : null}

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
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isCurrent ? 'text-[var(--color-success)]' : 'text-[var(--color-success)]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {btn.action ? (
                  <button
                    onClick={() => handleCheckout(plan.key)}
                    disabled={loading === plan.key}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      btn.style === 'muted'
                        ? 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                        : plan.popular
                        ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'
                        : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {loading === plan.key
                      ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</span>
                      : btn.label}
                  </button>
                ) : (
                  <div className="w-full py-2.5 rounded-lg text-sm font-semibold text-center bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/30">
                    ✓ Current Plan
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Checkout error */}
        {checkoutError && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-sm text-[var(--color-danger)] text-center">
            {checkoutError}
          </div>
        )}

        {/* Free plan note — only for non-logged-in visitors */}
        {!session && (
          <div className="mt-8 card flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Free — 5 responses included</p>
                <p className="text-xs text-[var(--color-text-muted)]">No credit card required to get started</p>
              </div>
            </div>
            <Link href="/register" className="btn-secondary text-sm">
              Start for free
            </Link>
          </div>
        )}

        {/* Manage billing */}
        {session && userPlan && userPlan !== 'free' && (
          <div className="mt-4 text-center">
            <button
              onClick={async () => {
                const res = await fetch('/api/stripe/portal', { method: 'POST' })
                const data = await res.json()
                if (data.url) window.location.href = data.url
                else setCheckoutError(data.error || 'Could not open billing portal. Please try again.')
              }}
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] underline underline-offset-2 transition-colors"
            >
              Manage or cancel subscription →
            </button>
          </div>
        )}

        {/* Guarantee + contact */}
        <div className="mt-10 text-center space-y-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            7-day money-back guarantee on all plans. No questions asked.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Need a custom plan?{' '}
            <a href="mailto:hello@withpoise.net" className="text-[var(--color-primary)] hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
