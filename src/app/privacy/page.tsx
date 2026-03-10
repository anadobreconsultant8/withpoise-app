import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export const metadata = {
  title: 'Privacy Policy — withPOISE',
}

const LAST_UPDATED = 'March 10, 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-legal">

          <section>
            <h2>1. Who We Are</h2>
            <p>
              withPOISE is operated by Ana Dobre, a sole trader registered in Romania. We are the data controller for personal data collected through this Service.
            </p>
            <p>
              Contact: <a href="mailto:ana@withpoise.com">ana@withpoise.com</a>
            </p>
          </section>

          <section>
            <h2>2. Data We Collect</h2>
            <p>We collect the following categories of personal data:</p>

            <h3>Account data</h3>
            <ul>
              <li>Name (optional)</li>
              <li>Email address</li>
              <li>Hashed password (we never store your password in plain text)</li>
              <li>Account creation date</li>
            </ul>

            <h3>Usage data</h3>
            <ul>
              <li>Objection types selected</li>
              <li>Tone and context inputs</li>
              <li>Client messages you paste in (used only to generate the response)</li>
              <li>Generated responses and timestamps</li>
              <li>Credit balance and transaction history</li>
            </ul>

            <h3>Billing data</h3>
            <ul>
              <li>Stripe customer ID, subscription ID, and plan details</li>
              <li>Payment card details are handled entirely by Stripe — we never see or store your card number</li>
            </ul>

            <h3>Technical data</h3>
            <ul>
              <li>IP address (used for rate limiting, not stored long-term)</li>
              <li>Browser type and device information (via standard server logs)</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Data</h2>
            <table>
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Legal basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Providing and operating the Service</td>
                  <td>Contract performance</td>
                </tr>
                <tr>
                  <td>Processing payments and managing subscriptions</td>
                  <td>Contract performance</td>
                </tr>
                <tr>
                  <td>Generating AI responses via Anthropic API</td>
                  <td>Contract performance</td>
                </tr>
                <tr>
                  <td>Preventing abuse and rate limiting</td>
                  <td>Legitimate interest</td>
                </tr>
                <tr>
                  <td>Sending transactional emails (account, billing)</td>
                  <td>Contract performance</td>
                </tr>
                <tr>
                  <td>Complying with legal obligations</td>
                  <td>Legal obligation</td>
                </tr>
              </tbody>
            </table>
            <p>
              We do not sell your personal data. We do not use your data for advertising. We do not use your client messages to train AI models.
            </p>
          </section>

          <section>
            <h2>4. Third-Party Services</h2>
            <p>We share data with the following third parties only to the extent necessary to operate the Service:</p>
            <ul>
              <li>
                <strong>Anthropic</strong> — receives your selected objection type, tone, and optional client message to generate a response. Anthropic&apos;s privacy policy applies: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer">anthropic.com/privacy</a>
              </li>
              <li>
                <strong>Stripe</strong> — processes all payments. Stripe is PCI-DSS compliant. Stripe&apos;s privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
              </li>
              <li>
                <strong>Upstash</strong> — Redis infrastructure used for rate limiting. IP addresses are processed temporarily and not stored. Upstash&apos;s privacy policy: <a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener noreferrer">upstash.com/trust/privacy</a>
              </li>
              <li>
                <strong>Vercel</strong> — cloud hosting provider. Standard server logs may be retained per Vercel&apos;s policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Data Retention</h2>
            <ul>
              <li><strong>Account data</strong> — retained for as long as your account is active. Deleted within 30 days of account deletion request.</li>
              <li><strong>Generated responses</strong> — retained to power your response history. Deleted when your account is deleted.</li>
              <li><strong>Billing records</strong> — retained for 7 years as required by Romanian fiscal law.</li>
              <li><strong>IP addresses for rate limiting</strong> — not stored beyond the active rate limit window (maximum 1 hour).</li>
            </ul>
          </section>

          <section>
            <h2>6. Your Rights (GDPR)</h2>
            <p>As a resident of the EU/EEA, you have the following rights:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Rectification</strong> — request correction of inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your account and personal data</li>
              <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
              <li><strong>Objection</strong> — object to processing based on legitimate interest</li>
              <li><strong>Restriction</strong> — request that we limit how we process your data</li>
            </ul>
            <p>
              To exercise any of these rights, email us at <a href="mailto:ana@withpoise.com">ana@withpoise.com</a>. We will respond within 30 days.
            </p>
            <p>
              You also have the right to lodge a complaint with the Romanian data protection authority (ANSPDCP) at <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">dataprotection.ro</a>.
            </p>
          </section>

          <section>
            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data, including password hashing (bcrypt), encrypted data transmission (TLS/HTTPS), and access controls. No system is 100% secure — if you suspect a breach, contact us immediately at <a href="mailto:ana@withpoise.com">ana@withpoise.com</a>.
            </p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              withPOISE uses a minimal number of cookies:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Type</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>next-auth.session-token</code></td>
                  <td>Keeps you logged in</td>
                  <td>Essential</td>
                  <td>Session / 30 days</td>
                </tr>
                <tr>
                  <td><code>next-auth.csrf-token</code></td>
                  <td>Prevents cross-site request forgery</td>
                  <td>Essential</td>
                  <td>Session</td>
                </tr>
              </tbody>
            </table>
            <p>
              We do not use advertising cookies, tracking cookies, or third-party analytics cookies. Because we only use strictly necessary cookies, no cookie consent banner is required under the ePrivacy Directive.
            </p>
            <p>
              You can manage or delete cookies through your browser settings. Deleting the session cookie will log you out of the Service.
            </p>
          </section>

          <section>
            <h2>9. International Transfers</h2>
            <p>
              Some of our third-party providers (Anthropic, Stripe, Vercel) are based in the United States. Data transfers to the US are covered by Standard Contractual Clauses or equivalent safeguards as required by GDPR.
            </p>
          </section>

          <section>
            <h2>10. Children</h2>
            <p>
              The Service is not directed at children under 18. We do not knowingly collect personal data from minors. If you believe a minor has created an account, contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or via an in-app notice. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              For any privacy-related questions or requests, contact us at:<br />
              <a href="mailto:ana@withpoise.com">ana@withpoise.com</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
