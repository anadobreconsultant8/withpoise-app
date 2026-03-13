import { Resend } from 'resend'

const FROM = 'withPOISE <hello@withpoise.net>'
const BASE_URL = process.env.NEXTAUTH_URL || 'https://withpoise.net'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function emailFooter(type: 'transactional' | 'commercial') {
  const unsubscribeLine = type === 'commercial'
    ? `<a href="${BASE_URL}/account" style="color: #6366f1;">Manage email preferences</a> · `
    : ''

  return `
    <hr style="border: none; border-top: 1px solid #3d3857; margin: 28px 0;" />
    <p style="color: #9895ad; font-size: 11px; line-height: 1.7;">
      ${unsubscribeLine}<a href="${BASE_URL}/privacy" style="color: #6366f1;">Privacy Policy</a> · <a href="${BASE_URL}" style="color: #6366f1;">withpoise.net</a><br/>
      withPOISE · hello@withpoise.net<br/>
      Romania · <a href="mailto:hello@withpoise.net" style="color: #6366f1;">hello@withpoise.net</a>
    </p>
    <p style="color: #6b6885; font-size: 11px; margin-top: 8px;">
      You're receiving this email because you created an account on withPOISE.
      To stop receiving emails, <a href="${BASE_URL}/account" style="color: #9895ad;">delete your account</a>.
    </p>
  `
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const dashboardUrl = `${BASE_URL}/dashboard`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Your 5 free responses are ready — withPOISE',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          Welcome, ${firstName}. Let's close some deals.
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          Your account is ready. You have <strong style="color: #e2e0f0;">5 free responses</strong> waiting — no credit card needed.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 8px;">Here's what you can do right now:</p>
        <ul style="color: #9895ad; line-height: 1.8; margin: 0 0 28px 0; padding-left: 20px;">
          <li>Pick any of 19 objection types across 5 categories</li>
          <li>Paste your client's exact message for a personalized response</li>
          <li>Choose your tone — Diplomatic, Balanced, Assertive, or Very Firm</li>
          <li>Get a ready-to-send POISE response in seconds</li>
        </ul>

        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Generate your first response →
        </a>

        <p style="color: #9895ad; font-size: 13px; margin-top: 32px; line-height: 1.6;">
          One rule we never break: <strong style="color: #e2e0f0;">no discounts, ever.</strong><br/>
          Every response holds your price and moves the deal forward.
        </p>

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your withPOISE password',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">Reset your password</h1>
        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 28px;">
          We received a request to reset the password for your withPOISE account. Click the button below to set a new password. This link expires in <strong style="color: #e2e0f0;">1 hour</strong>.
        </p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Reset password
        </a>
        <p style="color: #9895ad; font-size: 13px; margin-top: 28px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email. Your password will not change.
        </p>
        ${emailFooter('transactional')}
      </div>
    `,
  })
}
