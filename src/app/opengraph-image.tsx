import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'withPOISE — AI Objection Response Generator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0d1a 0%, #1e1b2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#6366f1',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M13 3L4 14h7l-2 7 11-11h-7l2-7z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '28px', fontWeight: '700', color: '#e2e0f0' }}>
            with<span style={{ color: '#6366f1' }}>POISE</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: '64px',
          fontWeight: '800',
          color: '#e2e0f0',
          lineHeight: '1.1',
          marginBottom: '28px',
          maxWidth: '900px',
        }}>
          Never Lose a Deal to
          <br />
          <span style={{ color: '#6366f1' }}>Price Objections</span> Again
        </div>

        {/* Subline */}
        <div style={{
          fontSize: '26px',
          color: '#9895ad',
          maxWidth: '800px',
          lineHeight: '1.4',
          marginBottom: '48px',
        }}>
          AI-powered responses built on the POISE framework.
          Strategic, firm, ready to send in seconds.
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '100px',
          padding: '10px 20px',
        }}>
          <span style={{ fontSize: '18px', color: '#6366f1', fontWeight: '600' }}>
            ⚡ No discounting. Ever.
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
