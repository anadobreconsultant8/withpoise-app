'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Zap className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="font-bold text-lg text-[var(--color-text)]">
            with<span className="text-[var(--color-primary)]">POISE</span>
          </span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Forgot your password?</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="card">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Check your inbox</p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  If an account exists for <strong>{email}</strong>, you&apos;ll receive a password reset link shortly. Check your spam folder if you don&apos;t see it.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-[var(--color-primary)] hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
