import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/session-provider'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'

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
      <head>
        <Script id="meta-pixel" strategy="beforeInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2376244492879795');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2376244492879795&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        <SessionProvider>{children}</SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
