import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Respond When a Client Says "Your Competitor Is Cheaper" — withPOISE',
  description: 'A competitor undercutting your price doesn\'t mean you lose the deal. Here\'s how to respond to the "competitor is cheaper" objection and close on value — without discounting.',
  openGraph: {
    title: 'How to Respond When a Client Says "Your Competitor Is Cheaper"',
    description: 'Handle the competitor price comparison objection without discounting. Scripts and strategy for consultants.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Respond When a Client Says "Your Competitor Is Cheaper"',
  description: 'A competitor undercutting your price doesn\'t mean you lose the deal. Here\'s how to reframe the comparison and close on value.',
  author: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  publisher: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  datePublished: '2026-03-15',
  dateModified: '2026-03-15',
  mainEntityOfPage: 'https://withpoise.net/blog/competitor-is-cheaper-objection',
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
            How to Respond When a Client Says "Your Competitor Is Cheaper"
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">March 2026 · 6 min read</p>
        </div>

        <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">

          <p className="text-lg text-[var(--color-text)]">
            "We got another proposal and it's about 40% lower than yours." If you've been in consulting or agency work for any length of time, you've been in this conversation. It's uncomfortable — and it's one of the easiest situations to mishandle.
          </p>

          <p>
            The wrong response is to immediately justify your price, attack the competitor, or offer to "see what you can do." All of these weaken your position. Here's what actually works.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Step 1: Don't panic or defend — get curious</h2>

          <p>
            The moment you hear "competitor is cheaper," your first instinct might be to explain why you're worth more. Resist it. Before you defend anything, you need to understand what you're actually being compared to.
          </p>

          <p>
            Ask: <em className="text-[var(--color-text)]">"Before we talk about the price difference, can I ask what's included in their proposal? Specifically — the scope, the timeline, the revision structure, and what happens if the project runs over?"</em>
          </p>

          <p>
            Most of the time, you'll find the proposals aren't comparing the same thing. Scope, accountability, risk distribution — these vary enormously across providers at different price points. Making that visible shifts the entire conversation.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Step 2: Acknowledge honestly, not defensively</h2>

          <p>
            Once you've asked your questions, acknowledge the situation directly: "Yes, our investment is higher — and I'd rather tell you why that is than pretend the difference doesn't exist."
          </p>

          <p>
            This kind of directness builds trust. It signals confidence. And it sets up the reframe that comes next.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Step 3: Reframe the comparison</h2>

          <p>
            You're not more expensive. You're a different offer. The price difference reflects a different level of accountability, a different quality of output, and a different risk profile for the client.
          </p>

          <p>
            The key insight to plant: <em className="text-[var(--color-text)]">"The cheapest option often becomes the most expensive one."</em> Not because of malice, but because lower-cost engagements typically involve more client time, more revisions, more back-and-forth, and a higher risk of needing to redo the work later.
          </p>

          <p>
            You can say this directly: <em className="text-[var(--color-text)]">"We've had clients come to us after working with lower-cost alternatives — not because those providers were bad, but because the project required significantly more of their team's time to manage. That time has a real cost. Our price includes a level of accountability that reduces that cost substantially."</em>
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Step 4: Hold the line</h2>

          <p>
            At some point in this conversation, the client will either accept the reframe or explicitly ask if you can match the other price. That's the moment where most consultants fold.
          </p>

          <p>
            The right answer: <em className="text-[var(--color-text)]">"Price-matching isn't something I do — not because I'm being rigid, but because our offer genuinely isn't the same offer. Reducing our price would mean reducing what we deliver, and that doesn't serve you."</em>
          </p>

          <p>
            Said calmly, this is not confrontational. It's simply honest. And it communicates something that matters: you know exactly what you're worth, and you're not negotiating from insecurity.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">Step 5: Move forward or move on</h2>

          <p>
            End every version of this conversation with a clear next step — not "let me know what you decide." Something specific: a 15-minute call to compare the proposals side by side, a deadline for their decision, a document you'll send.
          </p>

          <p>
            And if the client ultimately chooses the cheaper option? Let them. The clients who choose you on price alone are not the clients you want. The ones who choose you despite the price difference are the clients worth having.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-4">A complete response you can use today</h2>

          <div className="p-5 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/5 italic text-sm leading-relaxed">
            <p className="mb-3">I appreciate you being direct — a 40% gap is significant and it deserves an honest answer.</p>
            <p className="mb-3">Before we compare on price, I want to make sure we're comparing the same thing. What does their proposal include specifically — in terms of scope, revisions, timeline, and what happens if the project needs to go beyond the original brief?</p>
            <p className="mb-3">In most cases where we see lower proposals, there are meaningful differences in scope or accountability — and those differences matter when things get complicated. Our price reflects a delivery model that removes risk from your team, not just a deliverable.</p>
            <p className="mb-3">Matching their price isn't something I do — because our offer isn't the same offer. What I can do is make sure you're comparing these two options with complete information.</p>
            <p>Would it be useful to do a 15-minute call where we go through both proposals side by side? I'll show you exactly where the differences lie — and then the decision is fully yours.</p>
          </div>

          <div className="mt-10 p-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-center">
            <p className="text-[var(--color-text)] font-semibold mb-2">Get a custom response for your exact scenario</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              Describe the objection, choose your tone, and get a ready-to-send POISE response tailored to your situation. 5 responses free.
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
