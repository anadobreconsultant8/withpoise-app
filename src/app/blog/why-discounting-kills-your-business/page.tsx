import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why Discounting Kills Your Consulting Business — withPOISE',
  description: 'Every discount trains your clients to expect the next one. Here\'s the real cost of discounting your consulting rates — and a better strategy for protecting your pricing.',
  openGraph: {
    title: 'Why Discounting Kills Your Consulting Business',
    description: 'The real cost of discounting and what to do instead. For consultants and agency owners.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Why Discounting Kills Your Consulting Business (And What to Do Instead)',
  description: 'Every discount you give trains your clients to expect the next one. Here\'s the real cost of discounting — and a better strategy.',
  author: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  publisher: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  datePublished: '2026-03-10',
  dateModified: '2026-03-10',
  mainEntityOfPage: 'https://withpoise.net/blog/why-discounting-kills-your-business',
}

export default function Article() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />

      <article className="max-w-2xl mx-auto px-4 py-20">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
        </Link>

        <div className="mb-8">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4 inline-block">
            Strategy
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-3 mb-4 leading-tight">
            Why Discounting Kills Your Consulting Business (And What to Do Instead)
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">March 2026 · 5 min read</p>
        </div>

        <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">

          <p className="text-lg text-[var(--color-text)]">
            It feels harmless in the moment. A client pushes back on price, you offer 10% off to close the deal, they accept, everyone moves on. But you've just made a decision with consequences that compound — and most consultants don't see the damage until it's already done.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">You're training your clients</h2>

          <p>
            When you discount, you're not just adjusting a number on a proposal. You're teaching your client how the game is played. They now know that your initial price is negotiable. They know that pushing back works. And they will push back again — on this project, on renewals, on referrals they send your way.
          </p>

          <p>
            The second discount is easier to justify than the first. The third becomes expected. Before long, your real price isn't the number on your proposal — it's whatever you'll agree to after the client objects. That's a terrible position to be in.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">The math is worse than you think</h2>

          <p>
            A 10% discount feels small. But think about what it actually costs:
          </p>

          <div className="card space-y-3">
            <div className="flex justify-between text-sm">
              <span>Project value</span>
              <span className="font-semibold text-[var(--color-text)]">$20,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Your margin (assume 60%)</span>
              <span className="font-semibold text-[var(--color-text)]">$12,000</span>
            </div>
            <div className="flex justify-between text-sm border-t border-[var(--color-border)] pt-3">
              <span>After 10% discount</span>
              <span className="font-semibold text-[var(--color-text)]">$18,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Your margin after discount</span>
              <span className="font-semibold text-[var(--color-danger)]">$10,000 (−17%)</span>
            </div>
          </div>

          <p>
            A 10% cut in revenue becomes a 17% cut in margin. And if your costs are higher, the impact is even worse. You're not giving up 10% — you're giving up 17% or more of what you actually earn.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Discounting attracts the wrong clients</h2>

          <p>
            Price-sensitive clients aren't just hard to close — they're hard to work with. They second-guess deliverables, push for scope creep, and are the first to leave when a cheaper option appears. Clients who choose you at full price are buying something different. They're buying confidence, expertise, and accountability. Those clients are more engaged, more profitable, and more likely to refer.
          </p>

          <p>
            Your pricing is a filter. When you drop it, you change who gets through.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">What to do instead</h2>

          <p>
            The answer isn't to be rigid or confrontational. It's to have a better response to the objection — one that reframes the conversation before it becomes a negotiation.
          </p>

          <p>
            When a client says "your price is too high," what they usually mean is one of three things: they don't see enough value yet, they're testing you to see if you'll fold, or the budget genuinely isn't there. Each of these requires a different response — but none of them require a discount.
          </p>

          <ul className="space-y-3">
            {[
              { label: 'If they don\'t see the value', action: 'Reframe the outcome, not the price. Make the ROI explicit.' },
              { label: 'If they\'re testing you', action: 'Hold firm, confidently. Caving confirms their suspicion that the price was padded.' },
              { label: 'If the budget isn\'t there', action: 'Explore scope reduction or phasing — never margin reduction.' },
            ].map(item => (
              <li key={item.label} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm">
                <p className="font-semibold text-[var(--color-text)] mb-1">{item.label}</p>
                <p>{item.action}</p>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">The one rule that changes everything</h2>

          <p>
            Make "no discounts, ever" a non-negotiable principle — and actually stick to it. Not "usually not." Not "except for good clients." Never. The clarity of that rule makes every objection conversation easier, because there's no internal debate about whether this situation qualifies for an exception.
          </p>

          <p>
            The first few times you hold the line, it will feel uncomfortable. Some prospects will walk. But the clients you close at full price will be better clients, at better margins, with better relationships. That's the trade.
          </p>

          <div className="mt-10 p-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-center">
            <p className="text-[var(--color-text)] font-semibold mb-2">Stop caving on price. Start closing at your rate.</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              withPOISE generates firm, strategic objection responses in seconds. Built on the no-discount principle. 5 free responses to start.
            </p>
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              Try it free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
