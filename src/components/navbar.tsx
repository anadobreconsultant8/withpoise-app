'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { Zap, LogOut, LayoutDashboard, User, CreditCard, ChevronDown } from 'lucide-react'

interface NavbarProps {
  creditsLeft?: number
  creditsTotal?: number
}

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  return email?.slice(0, 2).toUpperCase() ?? '?'
}

export function Navbar({ creditsLeft, creditsTotal }: NavbarProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = getInitials(session?.user?.name, session?.user?.email)
  const displayName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Account'

  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="font-bold text-lg text-[var(--color-text)] tracking-tight">
            with<span className="text-[var(--color-primary)]">POISE</span>
          </span>
        </Link>

        {/* Center nav — visitors only */}
        {!session && (
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">Blog</Link>
            <Link href="/about" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">About</Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              {/* Credits badge */}
              {creditsLeft !== undefined && creditsTotal !== undefined && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-sm">
                  <Zap className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-text)] font-semibold">{creditsLeft}</span>
                    /{creditsTotal} credits
                  </span>
                </div>
              )}

              {/* User dropdown */}
              <div className="relative" ref={ref}>
                <button
                  onClick={() => setOpen(v => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-[var(--color-text)] max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--color-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[var(--color-border)]">
                      <p className="text-sm font-semibold text-[var(--color-text)] truncate">{displayName}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{session.user?.email}</p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <Link
                        href="/account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Account settings
                      </Link>

                      <Link
                        href="/pricing"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        Plans & Upgrade
                      </Link>

                      <BillingLink onClose={() => setOpen(false)} />
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-[var(--color-border)] py-1">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-bg)] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function BillingLink({ onClose }: { onClose: () => void }) {
  async function handleBilling() {
    onClose()
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <button
      onClick={handleBilling}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
    >
      <CreditCard className="w-4 h-4" />
      Billing & receipts
    </button>
  )
}
