import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Handle Price Objections Without Discounting — withPOISE',
  description: 'The 5-step POISE framework for responding to "your price is too high" — without giving ground, losing confidence, or caving to pressure. A practical guide for consultants.',
  openGraph: {
    title: 'How to Handle Price Objections Without Discounting',
    description: 'The 5-step POISE framework for B2B consultants. Respond to "your price is too high" without discounting.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Handle Price Objections Without Discounting',
  description: 'The 5-step POISE framework for responding to "your price is too high" — without giving ground, losing confidence, or caving to pressure.',
  author: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  publisher: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  datePublished: '2026-03-01',
  dateModified: '2026-03-01',
  mainEntityOfPage: 'https://withpoise.net/blog/how-to-handle-price-objections',
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
            Objection Handling
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-3 mb-4 leading-tight">
            How to Handle Price Objections Without Discounting
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">March 2026 · 6 min read</p>
        </div>

        <div className="prose-custom space-y-6 text-[var(--color-text-muted)] leading-relaxed">

          <p className="text-lg text-[var(--color-text)]">
            If you've been selling consulting or agency services for more than a few months, you've heard it: <em>"Your price is too high."</em> And if you're like most consultants, your first instinct is to defend, justify, or — worse — discount.
          </p>

          <p>
            That instinct is costing you money, positioning, and client quality. Every time you discount, you're signaling that your original price was inflated. You're training clients to push back harder next time. And you're attracting clients who value price over outcomes.
          </p>

          <p>
            There's a better way. The <strong className="text-[var(--color-text)]">POISE framework</strong> is a 5-step structure for responding to price objections that holds your rate, reframes the conversation, and actually moves deals forward.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Why most objection responses fail</h2>

          <p>
            Most consultants respond to price objections in one of three ways: they get defensive ("but think about all the value you're getting…"), they panic and immediately offer a discount, or they ask what budget the client has in mind — which hands all control to the buyer.
          </p>

          <p>
            None of these work. Defensive responses feel like insecurity. Discounts destroy trust. And asking for their budget puts you in a race to the bottom.
          </p>

          <p>
            What actually works is a structured response that acknowledges the concern, shifts the frame, provides logical reasoning, sets a firm boundary, and ends with a clear next step. That's the POISE framework.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">The 5 steps of POISE</h2>

          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="font-bold text-[#6366f1] mb-1">P — Acknowledge</p>
              <p>Validate the concern without agreeing with it. Show the client they were heard — but don't give ground. "I understand price is a real factor in this decision" is very different from "You're right, it is expensive."</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="font-bold text-[#8b5cf6] mb-1">O — Reframe</p>
              <p>Shift the conversation from cost to value, from price to outcomes. Ask the client to consider what it costs them not to solve this problem. "What's the business impact if this doesn't get fixed in the next 6 months?"</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="font-bold text-[#a78bfa] mb-1">I — Logic of Decision</p>
              <p>Give the client a rational business framework for making their choice. Lower-priced alternatives often mean different scope, different accountability, or different risk. Help them see that clearly — without bashing competitors.</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="font-bold text-[#f59e0b] mb-1">S — Set Boundary</p>
              <p>Protect your pricing firmly and without apology. "This is the investment for the outcome we've discussed. I'm not able to deliver the same result at a lower price." Said calmly, this builds respect — not resistance.</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <p className="font-bold text-[#10b981] mb-1">E — Next Step</p>
              <p>End with a single, clear, forward-moving action. Not "let me know what you think" — something specific: a call, a decision deadline, a document. Ambiguity kills deals. Precision closes them.</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">An example response</h2>

          <p>Client says: <em>"We've seen other proposals and yours is significantly higher."</em></p>

          <div className="p-5 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/5 italic text-sm leading-relaxed">
            <p className="mb-3">I completely understand — when you're evaluating multiple proposals, the price difference stands out. That makes total sense to address directly.</p>
            <p className="mb-3">Before comparing on price, it's worth making sure we're comparing the same thing. Do the other proposals include the same scope, the same access, the same accountability structure — or are there differences that explain part of that gap?</p>
            <p className="mb-3">In most cases where we've seen lower proposals, the scope is lighter — fewer deliverables, a longer timeline, or limited revision rounds. Our investment covers full ownership and direct access throughout, which significantly reduces the risk your team carries.</p>
            <p className="mb-3">I'm not in a position to match a different price for the same scope — our pricing reflects the quality and reliability we stand behind.</p>
            <p>Would it help if I put together a one-page ROI summary for your review? I can have it to you by tomorrow morning.</p>
          </div>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">What makes this work</h2>

          <p>Notice what's not in that response: no apology, no justification of line items, no offer to "see what we can do." The response is warm but firm. It reframes before it defends. And it ends by moving the conversation forward — not backward.</p>

          <p>The POISE framework works because it mirrors how high-stakes business decisions actually get made. Buyers at the level you're targeting don't respond to pressure or panic. They respond to confidence, clarity, and logic.</p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">The rule that never breaks</h2>

          <p>
            One principle underlies every POISE response: <strong className="text-[var(--color-text)]">no discounts, ever.</strong> Not "let me see what I can do." Not "I could maybe knock 10% off." Every exception you make trains the next client to push harder.
          </p>

          <p>
            If the scope genuinely needs to change to fit a budget, that's a different conversation — and it involves removing deliverables, not cutting your margin.
          </p>

          <div className="mt-10 p-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-center">
            <p className="text-[var(--color-text)] font-semibold mb-2">Generate your own POISE response in seconds</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              Paste the client's objection, choose your tone, and get a ready-to-send response built on the POISE framework. No discounting. Ever.
            </p>
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              Try it free — 5 responses included <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
