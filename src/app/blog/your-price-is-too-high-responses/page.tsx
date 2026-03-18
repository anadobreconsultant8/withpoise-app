import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '"Your Price Is Too High" — 7 Responses That Work — withPOISE',
  description: 'Word-for-word responses to the most common price objection in B2B sales. Tested by consultants and agency owners, built to hold the line without discounting.',
  openGraph: {
    title: '"Your Price Is Too High" — 7 Responses That Actually Work',
    description: 'Word-for-word scripts for handling price objections in B2B consulting. No discounts, no apologies.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '"Your Price Is Too High" — 7 Responses That Actually Work',
  description: 'Word-for-word responses to the most common price objection in B2B sales.',
  author: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  publisher: { '@type': 'Organization', name: 'withPOISE', url: 'https://withpoise.net' },
  datePublished: '2026-03-05',
  dateModified: '2026-03-05',
  mainEntityOfPage: 'https://withpoise.net/blog/your-price-is-too-high-responses',
}

const RESPONSES = [
  {
    context: 'When they haven\'t seen the full value yet',
    response: `That's fair to raise — and I'd rather address it directly than dance around it. Before we talk price, I want to make sure we're clear on the outcome you're actually buying. The investment covers [X], which means [specific outcome]. When you look at the cost of not having that — [risk/cost] — the price looks different. What's your timeline for solving this?`,
  },
  {
    context: 'When they\'re comparing to a competitor',
    response: `I hear you. Before we compare on price, let's make sure we're comparing the same thing. Does their proposal include [scope item], [accountability structure], and [specific guarantee]? In most cases when we see a lower price, one of those is missing — and that's where the risk shows up later. What specifically is included in their offer?`,
  },
  {
    context: 'When they need to justify it to a board or boss',
    response: `That makes total sense — presenting this internally requires a clear business case. Let me make that easy for you. The ROI on this engagement comes from [specific outcome 1] and [specific outcome 2], which typically produces [result] within [timeframe]. I can put together a one-page summary that frames this for your leadership. Would that be useful to have before your next internal meeting?`,
  },
  {
    context: 'When they say they "just don\'t have the budget"',
    response: `I understand budget constraints are real. I want to be honest with you: I can't deliver the same result at a lower price — that would mean a different scope, and a different outcome. What I can do is help you think through whether this is the right time to move forward, or whether there's a phased approach that fits your current situation without compromising the outcome. What does your timeline look like for getting this resolved?`,
  },
  {
    context: 'When they push back hard and go silent',
    response: `I want to make sure I understand where you are. Is the concern purely the investment number, or is there something else — the timeline, the scope, the fit — that's making you hesitate? I'd rather know what's actually in the way so we can address it properly, rather than guess.`,
  },
  {
    context: 'When it\'s a repeat client asking for a loyalty discount',
    response: `I genuinely value the relationship we've built — and it's exactly because of that relationship that I want to be straight with you. My pricing reflects what I need to deliver the quality of work you've come to expect. Discounting that would mean either cutting scope or cutting corners, and neither serves you well. What I can offer is [priority scheduling / a streamlined onboarding / an extended payment schedule]. Would any of those help?`,
  },
  {
    context: 'When they ask "can you do any better on the price?"',
    response: `I appreciate you asking directly. The short answer is: the investment is what it is for the scope we've discussed. I put real thought into the pricing — it reflects the quality, the timeline, and the accountability I bring. What I can do is make sure you're fully confident in what you're getting before you decide. Is there anything in the proposal you'd like me to walk through in more detail?`,
  },
]

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
            Scripts & Templates
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mt-3 mb-4 leading-tight">
            "Your Price Is Too High" — 7 Responses That Actually Work
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">March 2026 · 8 min read</p>
        </div>

        <div className="space-y-6 text-[var(--color-text-muted)] leading-relaxed">

          <p className="text-lg text-[var(--color-text)]">
            "Your price is too high." It's the objection that makes most consultants either freeze or fold. Here are 7 word-for-word responses — each designed for a different context — that hold the line, reframe the conversation, and move deals forward.
          </p>

          <p>
            None of these responses involve discounting. If you're looking for ways to justify lowering your rate, this isn't that article. These are built for consultants who want to close at their price — or not close at all.
          </p>

          <div className="space-y-6 mt-8">
            {RESPONSES.map((item, i) => (
              <div key={i} className="card">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)] mb-3">
                  Response {i + 1} — {item.context}
                </p>
                <p className="text-sm text-[var(--color-text)] italic leading-relaxed">
                  "{item.response}"
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-[var(--color-text)] pt-6">What these responses have in common</h2>

          <p>Look at the pattern across all seven:</p>
          <ul className="space-y-2 list-none ml-0">
            {[
              'They acknowledge before they defend',
              'They shift from price to outcome',
              'They ask questions instead of making statements',
              'They end with a forward-moving action',
              'None of them apologize for the price',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-[var(--color-success)] mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <p>
            The structure behind these responses is the <strong className="text-[var(--color-text)]">POISE framework</strong> — a 5-step method built specifically for high-ticket B2B objection handling. Every response follows some version of: Acknowledge → Reframe → Logic → Boundary → Next Step.
          </p>

          <div className="mt-10 p-6 rounded-xl border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-center">
            <p className="text-[var(--color-text)] font-semibold mb-2">Get a custom response for your exact situation</p>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              Paste the client's message, choose your tone, and get a ready-to-send POISE response in seconds. 5 free responses — no card required.
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
