'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Zap, LogOut, LayoutDashboard } from 'lucide-react'

interface NavbarProps {
  creditsLeft?: number
  creditsTotal?: number
}

export function Navbar({ creditsLeft, creditsTotal }: NavbarProps) {
  const { data: session } = useSession()

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

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <Link
                href="/pricing"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                Upgrade
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
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
