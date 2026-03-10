import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'withPOISE — AI Objection Response Generator',
  description:
    'Craft strategic, framework-based responses to client objections without discounting. Powered by the POISE framework and Claude AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
