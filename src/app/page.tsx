import Link from 'next/link'
import { Zap, ArrowRight, Check, X, ChevronRight, Quote } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Faq } from '@/components/faq'

const POISE_STEPS = [
  { letter: 'P', name: 'Acknowledge', desc: 'Validate the concern. Show the client they were heard — without giving ground.' },
  { letter: 'O', name: 'Reframe', desc: 'Shift the conversation from cost to value, outcomes, and ROI.' },
  { letter: 'I', name: 'Logic of Decision', desc: 'Give the client a rational business framework for making their decision.' },
  { letter: 'S', name: 'Set Boundary', desc: 'Protect your pricing firmly and without apology.' },
  { letter: 'E', name: 'Next Step', desc: 'End with a single, clear, actionable next step.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose the objection', desc: 'Pick from 19 objection types across 5 categories.' },
  { step: '02', title: 'Add your context', desc: 'Optionally paste the client\'s message, contract value, and relationship level.' },
  { step: '03', title: 'Pick your tone', desc: 'Diplomatic, Balanced, Assertive, or Very Firm — you decide.' },
  { step: '04', title: 'Get your response', desc: 'A ready-to-send reply built on the POISE framework. Copy and close.' },
]

const DIFFERENTIATORS = [
  { label: 'Trained on POISE framework', withpoise: true, chatgpt: false },
  { label: 'Tone control (4 levels)', withpoise: true, chatgpt: false },
  { label: 'B2B consultant-specific', withpoise: true, chatgpt: false },
  { label: 'No-discount rule enforced', withpoise: true, chatgpt: false },
  { label: 'Instant, ready-to-send', withpoise: true, chatgpt: true },
  { label: 'Built for closers', withpoise: true, chatgpt: false },
]

const STATS = [
  { value: '3,200+', label: 'responses generated' },
  { value: '240+', label: 'consultants using it' },
  { value: '0', label: 'discounts suggested' },
  { value: '4.9★', label: 'average rating' },
]

const TESTIMONIALS = [
  {
    quote: 'I used to cave on price at least once a week. Now I copy the response, adjust two sentences, and send it. I haven\'t discounted in three months.',
    name: 'James R.',
    role: 'Brand Strategy Consultant',
  },
  {
    quote: 'The "Logic of Decision" step is what gets me. Clients stop arguing and start thinking. That shift alone is worth the subscription.',
    name: 'Mara T.',
    role: 'Growth Agency Owner',
  },
  {
    quote: 'I tried writing these myself, I tried ChatGPT. Nothing held the line like withPOISE does. It\'s the first tool that actually sounds like a confident closer.',
    name: 'David K.',
    role: 'B2B Sales Coach',
  },
]

const SAMPLE_OBJECTION = 'Your price is too high. We found someone who can do it for half the price.'

const SAMPLE_RESPONSE = `I hear you — and I'd want to explore that decision carefully before you move forward, because the gap between providers often shows up later in ways that are hard to reverse.

What you're comparing isn't the same thing. A lower price reflects a different scope, a different level of strategic input, and a different accountability structure. What we deliver isn't execution — it's a system that compounds over time. That ROI isn't visible on a proposal, but it shows up in client retention, pipeline quality, and how your business is positioned 12 months from now.

Ask yourself: what does it cost if this engagement underdelivers? If the strategy misses, if the work needs to be rebuilt in six months — that's not a saving. That's a more expensive problem.

My investment is what it is because of the results it produces. I'm not the cheapest option and I'm not trying to be. Every client who has committed to this has seen it returned.

I have one onboarding slot opening in the next two weeks. If you'd like to hold it, let's lock in your start date by Friday.`

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ===================================================
          HERO
          =================================================== */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold mb-8">
          <Zap className="w-3.5 h-3.5" />
          Powered by Claude AI + the POISE Framework
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text)] leading-tight tracking-tight mb-6">
          Never Lose a Deal to<br />
          <span className="gradient-text">Price Objections Again</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10">
          AI-powered objection responses for consultants and agency owners — built on the POISE framework.
          Strategic, firm, and ready to send in seconds. <strong className="text-[var(--color-text)]">No discounting. Ever.</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
            Start Free — 5 Responses Included
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing" className="btn-secondary px-8 py-3.5 text-base">
            See pricing
          </Link>
        </div>

        <p className="text-xs text-[var(--color-text-muted)] mt-4">No credit card required</p>
      </section>

      {/* ===================================================
          STATS BAR
          =================================================== */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/60">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-[var(--color-primary)]">{stat.value}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          LIVE EXAMPLE
          =================================================== */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3">
            See it in action
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Real objection. Real POISE response. Ready to send.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Input */}
          <div className="card border-[var(--color-danger)]/30">
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              Client&apos;s message
            </p>
            <div className="p-3 rounded-lg bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/20 text-sm text-[var(--color-text)] leading-relaxed italic">
              &ldquo;{SAMPLE_OBJECTION}&rdquo;
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                Objection: Competitor comparison
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                Tone: Balanced
              </span>
            </div>
          </div>

          {/* Output */}
          <div className="card border-[var(--color-primary)]/30">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[var(--color-primary)]" />
              <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                POISE Response
              </p>
            </div>
            <p className="text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-line">
              {SAMPLE_RESPONSE}
            </p>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              <span className="text-xs text-[var(--color-text-muted)]">No discount suggested · Boundary held · Clear next step</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/register" className="btn-primary px-8 py-3 text-sm">
            Try it free — no credit card needed
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ===================================================
          HOW IT WORKS
          =================================================== */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] text-center mb-14">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="card">
                <span className="text-4xl font-black text-[var(--color-primary)]/20">{item.step}</span>
                <h3 className="text-base font-bold text-[var(--color-text)] mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          POISE FRAMEWORK
          =================================================== */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3">
            The POISE Framework
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Every response is built on this exact 5-step structure. No improvisation. No discounts.
          </p>
        </div>

        <div className="space-y-3">
          {POISE_STEPS.map((step, i) => (
            <div key={step.letter} className="card flex items-start gap-5">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
                <span className="text-lg font-black text-[var(--color-primary)]">{step.letter}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[var(--color-text-muted)]">Step {i + 1}</span>
                  <ChevronRight className="w-3 h-3 text-[var(--color-border)]" />
                  <span className="text-sm font-bold text-[var(--color-text)]">{step.name}</span>
                </div>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          TESTIMONIALS
          =================================================== */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-3">
              Closers don&apos;t discount. They respond.
            </h2>
            <p className="text-[var(--color-text-muted)]">
              What consultants say after their first week with withPOISE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card flex flex-col gap-4">
                <Quote className="w-6 h-6 text-[var(--color-primary)]/40 flex-shrink-0" />
                <p className="text-sm text-[var(--color-text)] leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          WHY NOT CHATGPT
          =================================================== */}
      <section className="border-t border-[var(--color-border)]">
        <div className="max-w-2xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] text-center mb-3">
            Why not just use ChatGPT?
          </h2>
          <p className="text-[var(--color-text-muted)] text-center mb-10">
            Generic AI gives generic responses. withPOISE is purpose-built for one thing.
          </p>

          <div className="card">
            <div className="grid grid-cols-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider pb-3 border-b border-[var(--color-border)] mb-3">
              <span></span>
              <span className="text-center text-[var(--color-primary)]">withPOISE</span>
              <span className="text-center">ChatGPT</span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {DIFFERENTIATORS.map(d => (
                <div key={d.label} className="grid grid-cols-3 items-center py-3 text-sm">
                  <span className="text-[var(--color-text-muted)]">{d.label}</span>
                  <span className="flex justify-center">
                    {d.withpoise
                      ? <Check className="w-4 h-4 text-[var(--color-success)]" />
                      : <X className="w-4 h-4 text-[var(--color-danger)]" />}
                  </span>
                  <span className="flex justify-center">
                    {d.chatgpt
                      ? <Check className="w-4 h-4 text-[var(--color-success)]" />
                      : <X className="w-4 h-4 text-[var(--color-danger)]" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FAQ
          =================================================== */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="max-w-2xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-[var(--color-text)] text-center mb-12">
            Frequently asked questions
          </h2>
          <Faq />
        </div>
      </section>

      {/* ===================================================
          PRICING CTA
          =================================================== */}
      <section className="border-t border-[var(--color-border)] max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
          Ready to hold your price?
        </h2>
        <p className="text-[var(--color-text-muted)] mb-8">
          Start with 5 free responses. No credit card. No commitment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
            Start Free Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/pricing" className="btn-secondary px-8 py-3.5 text-base">
            View all plans
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="font-semibold text-[var(--color-text)]">
              with<span className="text-[var(--color-primary)]">POISE</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-[var(--color-text)] transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-[var(--color-text)] transition-colors">Sign in</Link>
            <a href="mailto:hello@withpoise.net" className="hover:text-[var(--color-text)] transition-colors">Support</a>
            <Link href="/terms" className="hover:text-[var(--color-text)] transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-[var(--color-text)] transition-colors">Privacy</Link>
          </div>
          <p>© {new Date().getFullYear()} withPOISE</p>
        </div>
      </footer>
    </div>
  )
}
