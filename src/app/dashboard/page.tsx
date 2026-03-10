import { Suspense } from 'react'
import { DashboardClient } from './dashboard-client'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    }>
      <DashboardClient />
    </Suspense>
  )
}
