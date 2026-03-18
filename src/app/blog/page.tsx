import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { ArrowRight, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — withPOISE',
  description: 'Practical guides on handling price objections, protecting your rates, and closing high-ticket deals without discounting. For consultants and agency owners.',
  openGraph: {
    title: 'Blog — withPOISE',
    description: 'Practical guides on price objection handling for B2B consultants and agency owners.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
}

const POSTS = [
  {
    slug: 'how-to-handle-price-objections',
    title: 'How to Handle Price Objections Without Discounting',
    description: 'The 5-step POISE framework for responding to "your price is too high" — without giving ground, losing confidence, or caving to pressure.',
    readTime: '6 min read',
    date: 'March 2026',
    category: 'Objection Handling',
  },
  {
    slug: 'your-price-is-too-high-responses',
    title: '"Your Price Is Too High" — 7 Responses That Actually Work',
    description: 'Word-for-word responses to the most common price objection in B2B sales. Tested by consultants, built to hold the line.',
    readTime: '8 min read',
    date: 'March 2026',
    category: 'Scripts & Templates',
  },
  {
    slug: 'why-discounting-kills-your-business',
    title: 'Why Discounting Kills Your Consulting Business (And What to Do Instead)',
    description: 'Every discount you give trains your clients to expect the next one. Here\'s the real cost of discounting — and a better strategy.',
    readTime: '5 min read',
    date: 'March 2026',
    category: 'Strategy',
  },
  {
    slug: 'competitor-is-cheaper-objection',
    title: 'How to Respond When a Client Says "Your Competitor Is Cheaper"',
    description: 'A competitor undercutting your price doesn\'t mean you lose the deal. Here\'s how to reframe the comparison and close on value.',
    readTime: '6 min read',
    date: 'March 2026',
    category: 'Objection Handling',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-3">Blog</h1>
          <p className="text-lg text-[var(--color-text-muted)]">
            Practical guides on price objection handling, closing strategy, and protecting your rates.
          </p>
        </div>

        <div className="space-y-6">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block card hover:border-[var(--color-primary)]/50 transition-colors group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{post.date}</span>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
                {post.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
                Read article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
