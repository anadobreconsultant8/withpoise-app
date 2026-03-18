import { Suspense } from 'react'
import { RegisterClient } from './register-client'

export const metadata = {
  title: 'Create Account — withPOISE',
  robots: { index: false, follow: false },
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterClient />
    </Suspense>
  )
}
