'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'What happens after I use my 5 free responses?',
    a: 'You can upgrade to any paid plan or buy a one-time credit pack. No automatic charges — you decide when and how to top up.',
  },
  {
    q: 'Will it ever suggest a discount?',
    a: 'Never. The no-discount rule is hardcoded into the AI engine. Every response is built to hold your price, reframe value, and move the deal forward — without giving ground.',
  },
  {
    q: 'Is this for freelancers or agencies too?',
    a: 'Both. withPOISE works for any consultant, coach, or agency owner who sells high-ticket services and deals with price objections on a regular basis.',
  },
  {
    q: 'How is this different from asking ChatGPT?',
    a: 'ChatGPT is a generalist. It will often suggest "offering a payment plan" or "being flexible on scope." withPOISE is purpose-built on the POISE framework — it knows the strategy, knows the boundaries, and produces responses that protect your positioning every time.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. Cancel from your billing portal with one click, no questions asked. Your credits remain active until the end of the billing period.',
  },
  {
    q: 'Is my client data safe?',
    a: 'Yes. Messages you paste in are used only to generate your response and are never stored long-term or used for training.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div key={i} className="card p-0 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
          >
            <span className="text-sm font-semibold text-[var(--color-text)]">{faq.q}</span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)]">
              <p className="pt-3">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
