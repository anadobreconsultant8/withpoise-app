'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Check, AlertCircle } from 'lucide-react'

const BENEFITS = [
  '5 free responses — no credit card required',
  'All 5 objection categories included',
  'All 4 tone settings available',
  'Powered by Claude AI + POISE framework',
  'Cancel or upgrade anytime',
]

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed.')
        setLoading(false)
        return
      }

      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created, but sign-in failed. Please log in.')
        router.push('/login')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left: benefits */}
        <div className="hidden md:block pt-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-[var(--color-primary)]" />
            <span className="font-bold text-xl text-[var(--color-text)]">
              with<span className="text-[var(--color-primary)]">POISE</span>
            </span>
          </Link>
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
            <p className="text-[var(--color-text-muted)] text-sm mt-1">Free to start — 5 responses included</p>
          </div>

          <div className="card">
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
                {loading ? 'Creating account...' : 'Start free — 5 responses included'}
              </button>

              <p className="text-xs text-center text-[var(--color-text-muted)]">
                No credit card required. Cancel anytime.
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
