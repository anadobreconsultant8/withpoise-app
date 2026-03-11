'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { User, Lock, CreditCard, Zap, Check, AlertCircle, Loader2, Download, Trash2 } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface UserData {
  id: string
  name: string | null
  email: string
  plan: string
  creditsLeft: number
  creditsTotal: number
  hasPassword: boolean
  stripeSubscriptionId: string | null
  stripeCurrentPeriodEnd: string | null
  createdAt: string
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  pro: 'Pro',
  elite: 'Elite',
}

export function AccountClient() {
  const { data: session, update } = useSession()
  const router = useRouter()

  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Name form
  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [nameError, setNameError] = useState('')

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!session) return
    fetch('/api/user')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setUser(data)
          setName(data.name || '')
        }
        setLoading(false)
      })
  }, [session])

  useEffect(() => {
    if (!session && !loading) router.push('/login')
  }, [session, loading, router])

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    setSavingName(true)
    setNameError('')
    setNameSuccess(false)

    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    setSavingName(false)

    if (!res.ok) {
      setNameError(data.error || 'Failed to update name.')
    } else {
      setNameSuccess(true)
      setUser(prev => prev ? { ...prev, name } : prev)
      await update({ name })
      setTimeout(() => setNameSuccess(false), 3000)
    }
  }

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordError('')
    setPasswordSuccess(false)

    const res = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    const data = await res.json()
    setSavingPassword(false)

    if (!res.ok) {
      setPasswordError(data.error || 'Failed to update password.')
    } else {
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    }
  }

  async function handleExport() {
    window.location.href = '/api/account/export'
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    const res = await fetch('/api/account/delete', { method: 'DELETE' })
    if (res.ok) {
      await signOut({ callbackUrl: '/' })
    } else {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  async function handleBilling() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    )
  }

  if (!user) return null

  const isOAuthUser = !user.hasPassword
  const planLabel = PLAN_LABELS[user.plan] ?? user.plan
  const renewalDate = user.stripeCurrentPeriodEnd
    ? new Date(user.stripeCurrentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-8">Account Settings</h1>

        {/* Plan info */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Plan & Credits</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Current plan</p>
              <p className="text-sm font-semibold text-[var(--color-text)]">{planLabel}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Credits left</p>
              <p className="text-sm font-semibold text-[var(--color-text)]">{user.creditsLeft} / {user.creditsTotal}</p>
            </div>
            {renewalDate && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Renews on</p>
                <p className="text-sm font-semibold text-[var(--color-text)]">{renewalDate}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-wrap">
            {user.plan === 'free' ? (
              <a href="/pricing" className="btn-primary text-sm px-4 py-2">
                Upgrade plan
              </a>
            ) : (
              <button onClick={handleBilling} className="btn-secondary text-sm px-4 py-2">
                <CreditCard className="w-4 h-4" />
                Billing & receipts
              </button>
            )}
            {user.plan === 'free' && (
              <a href="/pricing" className="btn-secondary text-sm px-4 py-2">
                View plans
              </a>
            )}
          </div>
        </div>

        {/* Profile */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Profile</h2>
          </div>

          <div className="mb-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Email</p>
            <p className="text-sm text-[var(--color-text)]">{user.email}</p>
            {isOAuthUser && (
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Signed in with Google</p>
            )}
          </div>

          <form onSubmit={handleSaveName} className="space-y-3">
            <div>
              <label className="label" htmlFor="name">Display name</label>
              <input
                id="name"
                type="text"
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
              />
            </div>

            {nameError && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-danger)]">
                <AlertCircle className="w-4 h-4" /> {nameError}
              </div>
            )}
            {nameSuccess && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                <Check className="w-4 h-4" /> Name updated.
              </div>
            )}

            <button type="submit" className="btn-primary text-sm px-4 py-2" disabled={savingName}>
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save name'}
            </button>
          </form>
        </div>

        {/* Password — only for email/password users */}
        {!isOAuthUser && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/15 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">Change Password</h2>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3">
              <div>
                <label className="label" htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className="input"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div>
                <label className="label" htmlFor="newPassword">New password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-danger)]">
                  <AlertCircle className="w-4 h-4" /> {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-success)]">
                  <Check className="w-4 h-4" /> Password updated.
                </div>
              )}

              <button type="submit" className="btn-primary text-sm px-4 py-2" disabled={savingPassword}>
                {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
              </button>
            </form>
          </div>
        )}

        {/* Data & Privacy */}
        <div className="card mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-danger)]/10 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-[var(--color-danger)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text)]">Data & Privacy</h2>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            You can download all your data or permanently delete your account at any time.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 btn-secondary text-sm px-4 py-2"
            >
              <Download className="w-4 h-4" />
              Download my data
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-danger)]/40 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="mt-4 p-4 rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/5">
              <p className="text-sm font-semibold text-[var(--color-danger)] mb-1">This action is permanent and irreversible.</p>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                All your data, responses, and subscription will be deleted. If you have an active subscription, it will be cancelled immediately.
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mb-2">
                Type <strong className="text-[var(--color-text)]">DELETE</strong> to confirm:
              </p>
              <input
                type="text"
                className="input mb-3"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || deleting}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[var(--color-danger)] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, delete my account'}
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-xs text-[var(--color-text-muted)] text-center">
          Member since {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
