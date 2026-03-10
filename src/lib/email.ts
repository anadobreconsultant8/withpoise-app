import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'withPOISE <noreply@withpoise.com>'

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
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
        <hr style="border: none; border-top: 1px solid #3d3857; margin: 28px 0;" />
        <p style="color: #9895ad; font-size: 12px;">
          withPOISE · <a href="${process.env.NEXTAUTH_URL}" style="color: #6366f1;">withpoise.com</a>
        </p>
      </div>
    `,
  })
}
