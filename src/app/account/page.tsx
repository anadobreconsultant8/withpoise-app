import { Suspense } from 'react'
import { AccountClient } from './account-client'
import { Loader2 } from 'lucide-react'

export const metadata = { title: 'Account Settings — withPOISE', robots: { index: false, follow: false } }

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    }>
      <AccountClient />
    </Suspense>
  )
}
