import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <Zap className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="font-bold text-lg text-[var(--color-text)]">
            with<span className="text-[var(--color-primary)]">POISE</span>
          </span>
        </Link>

        <p className="text-6xl font-black text-[var(--color-primary)]/20 mb-4">404</p>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">Page not found</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">
          This page doesn&apos;t exist. Maybe it was moved, or you followed a broken link.
        </p>

        <Link href="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  )
}
