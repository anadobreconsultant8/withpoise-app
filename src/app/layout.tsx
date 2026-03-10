import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'
import { Analytics } from '@vercel/analytics/next'

const BASE_URL = process.env.NEXTAUTH_URL || 'https://withpoise.net'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'withPOISE — AI Objection Response Generator for Consultants',
    template: '%s — withPOISE',
  },
  description:
    'Stop losing deals to price objections. withPOISE generates strategic, ready-to-send responses built on the POISE framework. No discounting. Ever.',
  keywords: [
    'price objection response',
    'B2B sales consultant',
    'objection handling',
    'POISE framework',
    'AI sales tool',
    'pricing objection',
    'consultant tools',
  ],
  authors: [{ name: 'withPOISE' }],
  creator: 'withPOISE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'withPOISE',
    title: 'withPOISE — Never Lose a Deal to Price Objections Again',
    description:
      'AI-powered objection responses for consultants and agency owners. Built on the POISE framework. Strategic, firm, ready to send in seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'withPOISE — Never Lose a Deal to Price Objections Again',
    description:
      'AI-powered objection responses built on the POISE framework. No discounting. Ever.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Analytics />
      </body>
    </html>
  )
}
