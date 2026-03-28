import { Resend } from 'resend'

const FROM = 'withPOISE <hello@withpoise.net>'
const BASE_URL = process.env.NEXTAUTH_URL || 'https://withpoise.net'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@withpoise.net'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function emailFooter(type: 'transactional' | 'commercial') {
  const unsubscribeLine = type === 'commercial'
    ? `<a href="${BASE_URL}/account" style="color: #6366f1;">Manage email preferences</a> · `
    : ''

  return `
    <hr style="border: none; border-top: 1px solid #3d3857; margin: 28px 0;" />
    <p style="color: #9895ad; font-size: 11px; line-height: 1.7;">
      ${unsubscribeLine}<a href="${BASE_URL}/privacy" style="color: #6366f1;">Privacy Policy</a> · <a href="${BASE_URL}" style="color: #6366f1;">withpoise.net</a><br/>
      PFA Dobre N Ana-Daniela · Teiu 36, Argeș, Romania
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

        <p style="color: #9895ad; font-size: 13px; line-height: 1.6; margin-bottom: 28px; padding: 12px 16px; background: #1e1b2e; border: 1px solid #3d3857; border-radius: 8px;">
          <strong style="color: #e2e0f0;">Good to know:</strong> once you use all 5 free responses, you'll be able to upgrade to a paid plan and get 30–300 responses/month.
        </p>

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

export async function sendFirstUseEmail(email: string, name?: string | null) {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const pricingUrl = `${BASE_URL}/pricing`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'You just handled your first objection — here\'s what\'s next',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          First objection handled. 🎯
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 16px;">
          Nice work, ${firstName}. You've just seen the POISE framework in action — a structured, professional response that holds your price and moves the deal forward.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          <strong style="color: #e2e0f0;">Pro tip:</strong> Paste your client's exact message in the "Client message" field. The more context you give, the more personalized and persuasive the response.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 28px;">
          You have <strong style="color: #f59e0b;">4 free responses</strong> left. When you're ready for unlimited access, our Starter plan is just $29/month.
        </p>

        <a href="${pricingUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          See plans & pricing
        </a>

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendRunningLowEmail(email: string, name?: string | null) {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const pricingUrl = `${BASE_URL}/pricing`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: '2 free responses left — don\'t run out mid-deal',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          You have 2 free responses left
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 16px;">
          Hi ${firstName}, you've used 3 of your 5 free responses. You're clearly handling objections — don't let a credit limit stop you when a deal is on the line.
        </p>

        <div style="background: #1e1b2e; border: 1px solid #3d3857; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #e2e0f0; font-weight: 600; margin: 0 0 12px 0; font-size: 15px;">Starter — $29/month</p>
          <ul style="color: #9895ad; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>30 responses/month</li>
            <li>All 19 objection types</li>
            <li>Full POISE framework</li>
            <li>Cancel anytime</li>
          </ul>
        </div>

        <a href="${pricingUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Upgrade now — from $29/mo
        </a>

        <p style="color: #9895ad; font-size: 12px; margin-top: 16px;">7-day money-back guarantee. No questions asked.</p>

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendCreditsExhaustedEmail(email: string, name?: string | null) {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const pricingUrl = `${BASE_URL}/pricing`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'You\'ve used all 5 free responses — upgrade to keep closing',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          You've used all 5 free responses
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 16px;">
          ${firstName}, your free responses are gone — which means you've been putting the POISE framework to work. That's exactly the point.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          The next price objection is coming. When it does, you can either improvise — or generate a structured, confident response in seconds. Upgrade now and be ready.
        </p>

        <div style="background: #1e1b2e; border: 2px solid #6366f1; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <p style="color: #e2e0f0; font-weight: 700; margin: 0; font-size: 16px;">Pro — Most Popular</p>
            <p style="color: #f59e0b; font-weight: 700; margin: 0; font-size: 16px;">$79/month</p>
          </div>
          <ul style="color: #9895ad; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong style="color: #e2e0f0;">100 responses/month</strong></li>
            <li>All 19 objection types</li>
            <li>Full POISE framework</li>
            <li>Cancel anytime</li>
          </ul>
        </div>

        <a href="${pricingUrl}" style="display: inline-block; padding: 14px 32px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px;">
          Upgrade and keep closing →
        </a>

        <p style="color: #9895ad; font-size: 12px; margin-top: 16px;">7-day money-back guarantee. Cancel anytime.</p>

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendReengagementEmail(email: string, name?: string | null, type: 'no-activity' | 'still-free' = 'no-activity') {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const dashboardUrl = `${BASE_URL}/dashboard`
  const pricingUrl = `${BASE_URL}/pricing`

  const isNoActivity = type === 'no-activity'

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: isNoActivity
      ? 'Your 5 free responses are still waiting, ' + firstName
      : 'Still handling price objections manually?',
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        ${isNoActivity ? `
        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          Your free responses are still waiting
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 16px;">
          Hi ${firstName}, you signed up for withPOISE but haven't generated a response yet. Your 5 free responses are still there — no card needed.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 28px;">
          It takes under 30 seconds: pick the objection type, choose your tone, paste your client's message if you have one, and get a ready-to-send POISE response.
        </p>

        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Try it now — it's free
        </a>
        ` : `
        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          Still handling price objections manually?
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 16px;">
          Hi ${firstName}, you tried withPOISE a few days ago. If you're still writing objection responses from scratch — or worse, thinking about discounts — there's a better way.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          Our Starter plan gives you <strong style="color: #e2e0f0;">30 responses/month</strong> for $29. That's less than one lost deal is worth.
        </p>

        <a href="${pricingUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          See plans — from $29/mo
        </a>
        `}

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendPaidWelcomeEmail(email: string, name: string | null, plan: 'starter' | 'pro' | 'elite') {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const dashboardUrl = `${BASE_URL}/dashboard`
  const pricingUrl = `${BASE_URL}/pricing`

  const planConfig = {
    starter: {
      label: 'Starter',
      credits: 30,
      upsell: {
        label: 'Pro',
        price: 79,
        credits: 100,
        reason: 'When you\'re closing deals consistently, 30 responses can go fast.',
      },
    },
    pro: {
      label: 'Pro',
      credits: 100,
      upsell: {
        label: 'Elite',
        price: 149,
        credits: 300,
        reason: 'High-volume closers on our Elite plan never have to think about credits.',
      },
    },
    elite: {
      label: 'Elite',
      credits: 300,
      upsell: null,
    },
  }

  const config = planConfig[plan]

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You're on ${config.label} — let's close some deals`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          You're on ${config.label}. ${config.credits} responses ready.
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          Welcome${plan === 'elite' ? ' to the top tier' : ''}, ${firstName}. Your <strong style="color: #e2e0f0;">${config.credits} monthly responses</strong> are active and ready to use. Every price objection you face from now on has a structured, confident answer.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 8px;"><strong style="color: #e2e0f0;">Make the most of it:</strong></p>
        <ul style="color: #9895ad; line-height: 1.8; margin: 0 0 28px 0; padding-left: 20px;">
          <li>Paste your client's exact message for a personalized response</li>
          <li>Try all 4 tones — Diplomatic, Balanced, Assertive, Very Firm</li>
          <li>Use your response history to track what's working</li>
        </ul>

        <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Go to dashboard →
        </a>

        ${config.upsell ? `
        <div style="margin-top: 32px; padding: 16px 20px; border: 1px solid #3d3857; border-radius: 10px; background: #1e1b2e;">
          <p style="color: #9895ad; font-size: 13px; line-height: 1.6; margin: 0;">
            ${config.upsell.reason} When you're ready, <a href="${pricingUrl}" style="color: #6366f1;">upgrade to ${config.upsell.label}</a> for ${config.upsell.credits} responses/month at $${config.upsell.price}/mo.
          </p>
        </div>
        ` : `
        <div style="margin-top: 32px; padding: 16px 20px; border: 1px solid #6366f1; border-radius: 10px; background: #1e1b2e;">
          <p style="color: #9895ad; font-size: 13px; line-height: 1.6; margin: 0;">
            You're on our highest tier. If you ever need custom volume or team access, reply to this email and we'll work something out.
          </p>
        </div>
        `}

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendCreditsLowPaidEmail(email: string, name: string | null, plan: 'starter' | 'pro') {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'
  const pricingUrl = `${BASE_URL}/pricing`

  const config = {
    starter: {
      label: 'Starter',
      creditsLeft: 6,
      total: 30,
      nextPlan: 'Pro',
      nextPrice: 79,
      nextCredits: 100,
    },
    pro: {
      label: 'Pro',
      creditsLeft: 20,
      total: 100,
      nextPlan: 'Elite',
      nextPrice: 149,
      nextCredits: 300,
    },
  }

  const c = config[plan]

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `${c.creditsLeft} responses left this month — keep your momentum`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          ${c.creditsLeft} responses left this month
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 16px;">
          Hi ${firstName}, you've used ${c.total - c.creditsLeft} of your ${c.total} ${c.label} responses — which means you've been busy closing. Good.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          If you're handling this volume of objections every month, <strong style="color: #e2e0f0;">${c.nextPlan}</strong> might be a better fit: <strong style="color: #e2e0f0;">${c.nextCredits} responses/month</strong> at $${c.nextPrice}/mo.
        </p>

        <div style="background: #1e1b2e; border: 2px solid #6366f1; border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <p style="color: #e2e0f0; font-weight: 700; margin: 0 0 8px 0;">${c.nextPlan} — $${c.nextPrice}/month</p>
          <p style="color: #9895ad; margin: 0; font-size: 14px;">${c.nextCredits} responses · All features · Cancel anytime</p>
        </div>

        <a href="${pricingUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Upgrade to ${c.nextPlan}
        </a>

        <p style="color: #9895ad; font-size: 12px; margin-top: 16px;">Your ${c.label} plan renews automatically — no action needed if you want to stay.</p>

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

export async function sendRenewalReminderEmail(email: string, name: string | null, daysLeft: number, plan: string, planLabel: string, renewalDate: string, portalUrl: string) {
  const resend = getResend()
  if (!resend) return

  const firstName = name?.split(' ')[0] || 'there'

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `Your ${planLabel} plan renews in ${daysLeft} day${daysLeft === 1 ? '' : 's'} — withPOISE`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0d1a; color: #e2e0f0;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 20px; font-weight: 700; color: #e2e0f0;">with<span style="color: #6366f1;">POISE</span></span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #e2e0f0;">
          Your subscription renews in ${daysLeft} day${daysLeft === 1 ? '' : 's'}
        </h1>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 24px;">
          Hi ${firstName}, just a heads-up: your <strong style="color: #e2e0f0;">${planLabel}</strong> plan will automatically renew on <strong style="color: #e2e0f0;">${renewalDate}</strong>.
        </p>

        <p style="color: #9895ad; line-height: 1.6; margin-bottom: 28px;">
          No action needed — your access and credits will continue uninterrupted. If you'd like to cancel or make changes before the renewal, you can do so from your billing portal.
        </p>

        <a href="${portalUrl}" style="display: inline-block; padding: 12px 28px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
          Manage billing
        </a>

        ${plan === 'starter' ? `
        <div style="margin-top: 28px; padding: 16px 20px; border: 1px solid #3d3857; border-radius: 10px; background: #1e1b2e;">
          <p style="color: #9895ad; font-size: 13px; line-height: 1.6; margin: 0 0 8px 0;">
            <strong style="color: #e2e0f0;">Closing more deals?</strong> Pro gives you 100 responses/month for $79 — over 3× more volume for less than 3× the price.
          </p>
          <a href="${BASE_URL}/pricing" style="color: #6366f1; font-size: 13px; font-weight: 600; text-decoration: none;">Upgrade to Pro →</a>
        </div>
        ` : plan === 'pro' ? `
        <div style="margin-top: 28px; padding: 16px 20px; border: 1px solid #3d3857; border-radius: 10px; background: #1e1b2e;">
          <p style="color: #9895ad; font-size: 13px; line-height: 1.6; margin: 0 0 8px 0;">
            <strong style="color: #e2e0f0;">Running a high-volume pipeline?</strong> Elite gives you 300 responses/month for $149 — so you never have to think about credits again.
          </p>
          <a href="${BASE_URL}/pricing" style="color: #6366f1; font-size: 13px; font-weight: 600; text-decoration: none;">Upgrade to Elite →</a>
        </div>
        ` : ''}

        ${emailFooter('commercial')}
      </div>
    `,
  })
}

// ─── ADMIN NOTIFICATIONS ─────────────────────────────────────────────────────

export async function sendAdminNewUserEmail(userEmail: string, userName: string | null, method: 'google' | 'email') {
  const resend = getResend()
  if (!resend) return

  const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', dateStyle: 'short', timeStyle: 'short' })
  const safeEmail = escapeHtml(userEmail)
  const safeName = userName ? escapeHtml(userName) : '—'

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🆕 New signup: ${safeEmail}`,
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0f0d1a; color: #e2e0f0;">
        <p style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">New user registered</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #9895ad; padding: 6px 0; width: 120px;">Email</td><td style="color: #e2e0f0;">${safeEmail}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">Name</td><td style="color: #e2e0f0;">${safeName}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">Method</td><td style="color: #e2e0f0;">${method === 'google' ? '🔵 Google OAuth' : '📧 Email/Password'}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">Plan</td><td style="color: #e2e0f0;">Free (5 credits)</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">Time</td><td style="color: #e2e0f0;">${now} (RO)</td></tr>
        </table>
      </div>
    `,
  })
}

export async function sendAdminSubscriptionEventEmail(
  event: 'upgrade' | 'downgrade' | 'cancel' | 'cancel_resumed' | 'expired',
  userEmail: string,
  userName: string | null,
  fromPlan: string,
  toPlan: string,
) {
  const resend = getResend()
  if (!resend) return

  const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', dateStyle: 'short', timeStyle: 'short' })

  const icons: Record<string, string> = {
    upgrade: '⬆️',
    downgrade: '⬇️',
    cancel: '❌',
    cancel_resumed: '✅',
    expired: '⏹️',
  }

  const labels: Record<string, string> = {
    upgrade: 'Plan upgraded',
    downgrade: 'Plan downgraded',
    cancel: 'Subscription cancelled',
    cancel_resumed: 'Cancellation reversed',
    expired: 'Subscription expired',
  }

  const safeEmail2 = escapeHtml(userEmail)
  const safeName2 = userName ? escapeHtml(userName) : '—'

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `${icons[event]} ${labels[event]}: ${safeEmail2}`,
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0f0d1a; color: #e2e0f0;">
        <p style="font-size: 18px; font-weight: 700; margin-bottom: 20px;">${icons[event]} ${labels[event]}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #9895ad; padding: 6px 0; width: 120px;">Email</td><td style="color: #e2e0f0;">${safeEmail2}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">Name</td><td style="color: #e2e0f0;">${safeName2}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">From</td><td style="color: #e2e0f0;">${fromPlan}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">To</td><td style="color: #e2e0f0;">${toPlan}</td></tr>
          <tr><td style="color: #9895ad; padding: 6px 0;">Time</td><td style="color: #e2e0f0;">${now} (RO)</td></tr>
        </table>
      </div>
    `,
  })
}

export async function sendAdminMonthlyReport(stats: {
  month: string
  totalUsers: number
  newUsersThisMonth: number
  free: number
  starter: number
  pro: number
  elite: number
  totalPaid: number
  estimatedMRR: number
}) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `📊 Monthly report — ${stats.month}`,
    html: `
      <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0f0d1a; color: #e2e0f0;">
        <p style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">Monthly Report</p>
        <p style="color: #9895ad; margin-bottom: 28px;">${stats.month}</p>

        <p style="color: #6366f1; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Users</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="color: #9895ad; padding: 5px 0; width: 180px;">Total accounts</td><td style="color: #e2e0f0; font-weight: 700;">${stats.totalUsers}</td></tr>
          <tr><td style="color: #9895ad; padding: 5px 0;">New this month</td><td style="color: #e2e0f0; font-weight: 700;">+${stats.newUsersThisMonth}</td></tr>
        </table>

        <p style="color: #6366f1; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Plans</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="color: #9895ad; padding: 5px 0; width: 180px;">Free</td><td style="color: #e2e0f0;">${stats.free}</td></tr>
          <tr><td style="color: #9895ad; padding: 5px 0;">Starter ($29/mo)</td><td style="color: #e2e0f0;">${stats.starter}</td></tr>
          <tr><td style="color: #9895ad; padding: 5px 0;">Pro ($79/mo)</td><td style="color: #e2e0f0;">${stats.pro}</td></tr>
          <tr><td style="color: #9895ad; padding: 5px 0;">Elite ($149/mo)</td><td style="color: #e2e0f0;">${stats.elite}</td></tr>
          <tr style="border-top: 1px solid #3d3857;"><td style="color: #9895ad; padding: 8px 0 5px;">Total paid</td><td style="color: #10b981; font-weight: 700;">${stats.totalPaid}</td></tr>
        </table>

        <p style="color: #6366f1; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Revenue</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #9895ad; padding: 5px 0; width: 180px;">Estimated MRR</td><td style="color: #f59e0b; font-weight: 700; font-size: 20px;">$${stats.estimatedMRR}</td></tr>
        </table>
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
