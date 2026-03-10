import Link from 'next/link'
import { Zap, ArrowRight, Check, X, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'

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
          WHY NOT CHATGPT
          =================================================== */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
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
          PRICING CTA
          =================================================== */}
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
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
            <a href="mailto:ana@withpoise.com" className="hover:text-[var(--color-text)] transition-colors">Support</a>
          </div>
          <p>© {new Date().getFullYear()} withPOISE</p>
        </div>
      </footer>
    </div>
  )
}
