import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'
import { Analytics } from '@vercel/analytics/next'
import { Analytics as TrackingAnalytics } from '@/components/analytics'

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
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'withPOISE — AI Objection Response Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'withPOISE — Never Lose a Deal to Price Objections Again',
    description:
      'AI-powered objection responses built on the POISE framework. No discounting. Ever.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'google639b739a871f15e6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'withPOISE',
              url: 'https://withpoise.net',
              logo: 'https://withpoise.net/opengraph-image',
              contactPoint: { '@type': 'ContactPoint', email: 'hello@withpoise.net', contactType: 'customer support' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'withPOISE',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              url: 'https://withpoise.net',
              description: 'AI-powered price objection response generator for B2B consultants and agency owners, built on the proprietary POISE framework.',
              offers: [
                { '@type': 'Offer', name: 'Free',    price: '0',   priceCurrency: 'USD', description: '5 responses' },
                { '@type': 'Offer', name: 'Starter', price: '29',  priceCurrency: 'USD', description: '30 responses/month' },
                { '@type': 'Offer', name: 'Pro',     price: '79',  priceCurrency: 'USD', description: '100 responses/month' },
                { '@type': 'Offer', name: 'Elite',   price: '149', priceCurrency: 'USD', description: '300 responses/month' },
              ],
            },
          ]) }}
        />
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
        <TrackingAnalytics />
      </body>
    </html>
  )
}
