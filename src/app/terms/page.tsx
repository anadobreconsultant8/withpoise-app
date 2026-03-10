import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export const metadata = {
  title: 'Terms of Service — withPOISE',
}

const LAST_UPDATED = 'March 10, 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-legal">

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By creating an account or using withPOISE (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These Terms apply to all users, including free and paid accounts.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              withPOISE is an AI-powered tool that generates professional responses to pricing objections for consultants and agency owners. Responses are generated using the POISE framework via the Anthropic Claude API and are intended as drafts to be reviewed and adapted by the user before sending.
            </p>
          </section>

          <section>
            <h2>3. Account Registration</h2>
            <p>
              You must provide a valid email address and a secure password to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must notify us immediately at <a href="mailto:ana@withpoise.com">ana@withpoise.com</a> if you suspect unauthorized access.
            </p>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into a contract to use the Service.
            </p>
          </section>

          <section>
            <h2>4. Credits and Billing</h2>
            <p>
              The Service operates on a credit system. Each AI-generated response consumes one credit. Free accounts receive 5 credits upon registration. Additional credits are available through monthly subscription plans or one-time credit packs.
            </p>
            <p>
              All payments are processed securely by Stripe. Subscription fees are billed monthly in advance. One-time credit packs are charged at the time of purchase and credits are added to your account immediately upon successful payment.
            </p>
            <p>
              Credits included in subscription plans expire at the end of each billing period and do not roll over. One-time credit pack credits do not expire.
            </p>
          </section>

          <section>
            <h2>5. Refund Policy</h2>
            <p>
              We offer a 7-day money-back guarantee on all subscription plans from the date of first payment. To request a refund, contact us at <a href="mailto:ana@withpoise.com">ana@withpoise.com</a> within 7 days of your purchase. One-time credit packs are non-refundable once credits have been used.
            </p>
          </section>

          <section>
            <h2>6. Cancellation</h2>
            <p>
              You may cancel your subscription at any time through the billing portal accessible from your dashboard. Cancellation takes effect at the end of the current billing period. You will retain access to paid features and remaining credits until then.
            </p>
          </section>

          <section>
            <h2>7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to reverse-engineer, scrape, or extract the underlying AI prompts or system logic</li>
              <li>Use automated scripts or bots to generate responses in bulk beyond normal usage</li>
              <li>Share your account credentials with third parties or resell access to the Service</li>
              <li>Submit content that is abusive, defamatory, or violates the rights of others</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
            </p>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>
              The withPOISE platform, including its design, code, POISE framework implementation, and branding, is owned by the operator and protected by applicable intellectual property laws.
            </p>
            <p>
              AI-generated responses are provided to you for your personal business use. You own the content you input into the Service. You may use, edit, and send generated responses as you see fit, provided such use complies with these Terms.
            </p>
          </section>

          <section>
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not guarantee that generated responses will achieve any specific business outcome. All generated content is a starting point and should be reviewed by you before use.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, or free from security vulnerabilities.
            </p>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, withPOISE and its operator shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Service, including lost business, lost revenue, or data loss.
            </p>
            <p>
              Our total liability to you for any claim arising from your use of the Service shall not exceed the amount you paid us in the 3 months preceding the claim.
            </p>
          </section>

          <section>
            <h2>11. Third-Party Services</h2>
            <p>
              The Service uses Anthropic (AI generation), Stripe (payments), and Upstash (infrastructure). Your use of the Service is also subject to their respective terms of service. We are not responsible for the actions or policies of these third parties.
            </p>
          </section>

          <section>
            <h2>12. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify registered users of material changes by email or via an in-app notice. Continued use of the Service after the effective date of the updated Terms constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Romania. Any disputes shall be subject to the exclusive jurisdiction of the courts of Romania.
            </p>
          </section>

          <section>
            <h2>14. Contact</h2>
            <p>
              For questions about these Terms, contact us at <a href="mailto:ana@withpoise.com">ana@withpoise.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
