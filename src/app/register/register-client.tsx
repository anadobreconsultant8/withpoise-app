'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Check, AlertCircle, Sparkles } from 'lucide-react'
import { PLANS, PlanName } from '@/lib/plans'
import { pixelTrack } from '@/lib/meta-pixel'

const BENEFITS = [
  '5 free responses — no credit card required',
  'All 5 objection categories included',
  'All 4 tone settings available',
  'Powered by Claude AI + POISE framework',
  'Cancel or upgrade anytime',
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.3441 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1023-1.17.2827-1.71V4.9582H.9573C.3477 6.1732 0 7.5482 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  )
}

const VALID_PLANS: PlanName[] = ['starter', 'pro', 'elite']

export function RegisterClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const planParam = searchParams.get('plan') as PlanName | null
  const selectedPlan = planParam && VALID_PLANS.includes(planParam) ? planParam : null
  const planData = selectedPlan ? PLANS[selectedPlan] : null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan: selectedPlan }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed.')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created, but sign-in failed. Please log in.')
        router.push('/login')
        return
      }

      pixelTrack('CompleteRegistration', { content_name: 'free' })

      if (selectedPlan) {
        router.push(`/pricing?autoCheckout=${selectedPlan}`)
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    // For Google OAuth with plan context, redirect to pricing after auth so they can checkout
    const callbackUrl = planData ? `/pricing` : `/dashboard`
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left: plan context or generic benefits */}
        <div className="hidden md:block pt-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-[var(--color-primary)]" />
            <span className="font-bold text-xl text-[var(--color-text)]">
              with<span className="text-[var(--color-primary)]">POISE</span>
            </span>
          </Link>

          {planData ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {planData.name} plan selected
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                One step away from closing more deals.
              </h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                Create your free account to continue. You&apos;ll get <strong className="text-[var(--color-text)]">5 trial credits</strong> to explore withPOISE right now — then activate your <strong className="text-[var(--color-text)]">{planData.name}</strong> plan to unlock {planData.credits} responses/month.
              </p>

              {/* Trial highlight */}
              <div className="p-4 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 mb-6">
                <p className="text-sm font-semibold text-[var(--color-text)] mb-2">What you get today:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                    <span><strong className="text-[var(--color-text)]">5 free credits</strong> — try it now, no card needed</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <Check className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                    <span><strong className="text-[var(--color-text)]">{planData.credits} credits/month</strong> — unlocked after payment</span>
                  </li>
                  {planData.features.slice(1).map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <Check className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-[var(--color-text-muted)]">
                ${planData.price}/month · Cancel anytime · 7-day money-back guarantee
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Stop losing deals to price objections.
              </h2>
              <p className="text-[var(--color-text-muted)] mb-8">
                Get AI-powered, framework-based responses that protect your pricing — starting today.
              </p>
              <ul className="space-y-3">
                {BENEFITS.map(benefit => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[var(--color-primary)]" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Right: form */}
        <div>
          <div className="text-center md:text-left mb-6">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:hidden">
              <Zap className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-bold text-lg text-[var(--color-text)]">
                with<span className="text-[var(--color-primary)]">POISE</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Create your account</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {planData
                ? `5 free trial credits included — then ${planData.credits}/month with ${planData.name}`
                : 'Free to start — 5 responses included'}
            </p>
          </div>

          <div className="card">
            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-white/5 hover:bg-white/10 text-[var(--color-text)] text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-4"
            >
              <GoogleIcon />
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">or</span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="label" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading
                  ? (planData ? 'Creating account...' : 'Creating account...')
                  : (planData
                      ? `Start free — then activate ${planData.name}`
                      : 'Start free — 5 responses included')}
              </button>

              <p className="text-xs text-center text-[var(--color-text-muted)]">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-[var(--color-primary)] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
