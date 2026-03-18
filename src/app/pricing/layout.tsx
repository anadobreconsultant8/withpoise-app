import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — withPOISE',
  description: 'Start free with 5 AI objection responses. Upgrade to Starter ($29/mo, 30 responses), Pro ($79/mo, 100 responses), or Elite ($149/mo, 300 responses). 7-day money-back guarantee.',
  openGraph: {
    title: 'Pricing — withPOISE',
    description: 'Simple, transparent pricing for AI-powered objection handling. Start free, upgrade when you\'re ready.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const PRICING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'withPOISE',
  description: 'AI-powered price objection response generator for B2B consultants, built on the POISE framework.',
  url: 'https://withpoise.net',
  offers: [
    { '@type': 'Offer', name: 'Free',    price: '0',   priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: '5 responses included' },
    { '@type': 'Offer', name: 'Starter', price: '29',  priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: '30 responses per month', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Pro',     price: '79',  priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: '100 responses per month', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Elite',   price: '149', priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: '300 responses per month', billingIncrement: 'P1M' },
  ],
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_SCHEMA) }} />
      {children}
    </>
  )
}
