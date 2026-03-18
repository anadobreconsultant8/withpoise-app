'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import {
  Zap, ChevronDown, ChevronRight, Copy, Check, RotateCcw,
  Clock, Loader2, AlertCircle, Sparkles, X, Plus, PlayCircle, TrendingUp
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { OBJECTION_CATEGORIES, TONES, RELATIONSHIP_LEVELS, OBJECTIVES } from '@/lib/objection-types'
import { CREDIT_PACKS, PLANS } from '@/lib/plans'
import { pixelTrack } from '@/lib/meta-pixel'

interface UserData {
  id: string
  name: string | null
  email: string
  plan: string
  creditsLeft: number
  creditsTotal: number
  stripeCustomerId: string | null
}

interface HistoryItem {
  id: string
  objectionType: string
  tone: string
  generatedReply: string
  createdAt: string
}

interface PoiseStep {
  key: 'P' | 'O' | 'I' | 'S' | 'E'
  text: string
}

const POISE_META: Record<string, { label: string; color: string; bg: string }> = {
  P: { label: 'Acknowledge', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  O: { label: 'Reframe',     color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  I: { label: 'Logic',       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  S: { label: 'Boundary',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  E: { label: 'Next Step',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
}

function parsePoiseSteps(text: string): PoiseStep[] | null {
  const regex = /\[([POISE])\]\s*([\s\S]*?)(?=\n?\s*\[[POISE]\]|$)/g
  const steps: PoiseStep[] = []
  let match
  while ((match = regex.exec(text)) !== null) {
    const key = match[1] as PoiseStep['key']
    const content = match[2].trim()
    if (content) steps.push({ key, text: content })
  }
  return steps.length === 5 ? steps : null
}

function stripPoiseMarkers(text: string): string {
  return text.replace(/\[[POISE]\]\s*/g, '').trim()
}

const EXAMPLE_SCENARIO = {
  objectionType: 'too_expensive',
  categoryId: 'price_budget',
  tone: 'balanced',
  clientMessage: "We've compared a few proposals and honestly your price is significantly higher than the others we received. We really like your work but it's hard to justify this gap to our board.",
  contractValue: '$18,000',
  relationshipLevel: 'warm',
  objective: 'close',
}

export function DashboardClient() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()

  const [user, setUser] = useState<UserData | null>(null)

  // Form state
  const [selectedObjection, setSelectedObjection] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [tone, setTone] = useState('balanced')
  const [contractValue, setContractValue] = useState('')
  const [relationshipLevel, setRelationshipLevel] = useState('')
  const [objective, setObjective] = useState('')
  const [clientMessage, setClientMessage] = useState('')

  // Output state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReply, setGeneratedReply] = useState('')
  const [poiseSteps, setPoiseSteps] = useState<PoiseStep[] | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [exampleLoaded, setExampleLoaded] = useState(false)

  // History
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Credits modal
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [buyingPack, setBuyingPack] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    const res = await fetch('/api/user')
    if (res.ok) setUser(await res.json())
  }, [])

  const fetchHistory = useCallback(async () => {
    const res = await fetch('/api/history')
    if (res.ok) setHistory(await res.json())
  }, [])

  useEffect(() => {
    fetchUser()
    fetchHistory()
  }, [fetchUser, fetchHistory])

  const upgraded = searchParams.get('upgraded')
  const creditsAdded = searchParams.get('credits_added')
  const subscribeFired = useRef(false)
  useEffect(() => {
    if (!upgraded && !creditsAdded) return
    let attempts = 0
    let initialPlan: string | null = null
    let initialCreditsTotal: number | null = null
    const poll = setInterval(async () => {
      attempts++
      const res = await fetch('/api/user')
      if (!res.ok) return
      const data = await res.json()

      // Capture baseline on first poll
      if (attempts === 1) {
        initialPlan = data.plan
        initialCreditsTotal = data.creditsTotal
      }

      setUser(data)

      // Fire Subscribe pixel event once when plan change is confirmed
      if (upgraded && !subscribeFired.current && data.plan && data.plan !== 'free' && data.plan !== initialPlan) {
        const planInfo = PLANS[data.plan as keyof typeof PLANS]
        if (planInfo) {
          pixelTrack('Subscribe', {
            value: planInfo.price,
            currency: 'USD',
            predicted_ltv: planInfo.price,
            content_name: data.plan,
          })
          subscribeFired.current = true
        }
      }

      // Stop when plan or credits changed, or max attempts reached
      const planChanged = initialPlan !== null && data.plan !== initialPlan
      const creditsChanged = initialCreditsTotal !== null && data.creditsTotal !== initialCreditsTotal
      if (planChanged || creditsChanged || attempts >= 10) clearInterval(poll)
    }, 1000)
    return () => clearInterval(poll)
  }, [upgraded, creditsAdded])

  function loadExample() {
    setSelectedObjection(EXAMPLE_SCENARIO.objectionType)
    setExpandedCategory(EXAMPLE_SCENARIO.categoryId)
    setTone(EXAMPLE_SCENARIO.tone)
    setClientMessage(EXAMPLE_SCENARIO.clientMessage)
    setContractValue(EXAMPLE_SCENARIO.contractValue)
    setRelationshipLevel(EXAMPLE_SCENARIO.relationshipLevel)
    setObjective(EXAMPLE_SCENARIO.objective)
    setGeneratedReply('')
    setPoiseSteps(null)
    setError('')
    setExampleLoaded(true)
  }

  async function handleGenerate(toneOverride?: string) {
    if (!selectedObjection) {
      setError('Please select an objection type.')
      return
    }

    const activeTone = toneOverride ?? tone

    setError('')
    setIsGenerating(true)
    setGeneratedReply('')
    setPoiseSteps(null)
    setExampleLoaded(false)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectionType: selectedObjection,
          tone: activeTone,
          contractValue: contractValue || undefined,
          relationshipLevel: relationshipLevel || undefined,
          objective: objective || undefined,
          clientMessage: clientMessage || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Generation failed.')
        return
      }

      setGeneratedReply(data.reply)
      setPoiseSteps(parsePoiseSteps(data.reply))
      setUser(prev => prev ? { ...prev, creditsLeft: data.creditsLeft } : prev)
      fetchHistory()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleRegenerateWithTone(newTone: string) {
    setTone(newTone)
    handleGenerate(newTone)
  }

  async function handleCopy() {
    const textToCopy = stripPoiseMarkers(generatedReply)
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleReset() {
    setGeneratedReply('')
    setPoiseSteps(null)
    setError('')
    setExampleLoaded(false)
  }

  function loadHistoryItem(item: HistoryItem) {
    setGeneratedReply(item.generatedReply)
    setPoiseSteps(parsePoiseSteps(item.generatedReply))
    setSelectedObjection(item.objectionType)
    setTone(item.tone)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const noCredits = user ? user.creditsLeft <= 0 : false

  // Stats
  const now = new Date()
  const thisMonthCount = history.filter(item => {
    const d = new Date(item.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const otherTones = TONES.filter(t => t.id !== tone)

  async function handleBuyCredits(priceId: string, packId: string) {
    setBuyingPack(packId)
    try {
      const res = await fetch('/api/stripe/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error(err)
    } finally {
      setBuyingPack(null)
    }
  }

  async function handleBillingPortal() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar creditsLeft={user?.creditsLeft} creditsTotal={user?.creditsTotal} />

      {noCredits && (
        <div className="bg-[var(--color-accent)]/10 border-b border-[var(--color-accent)]/30 px-4 py-2.5 text-center text-sm">
          <span className="text-[var(--color-accent)] font-medium">You&apos;re out of credits.</span>{' '}
          <a href="/pricing" className="text-[var(--color-accent)] underline font-semibold">Upgrade now</a>
          {' '}to keep generating responses.
        </div>
      )}

      {user && user.plan === 'free' && !noCredits && !upgraded && (
        <div className="bg-[var(--color-primary)]/8 border-b border-[var(--color-primary)]/20 px-4 py-2.5 text-center text-sm">
          <span className="text-[var(--color-text-muted)]">
            You&apos;re on the free trial —{' '}
            <span className="text-[var(--color-text)] font-medium">{user.creditsLeft} credit{user.creditsLeft !== 1 ? 's' : ''} left.</span>
            {' '}
          </span>
          <a href="/pricing" className="text-[var(--color-primary)] font-semibold hover:underline">
            Upgrade to get 30–300 responses/month →
          </a>
        </div>
      )}

      {upgraded && (
        <div className="bg-[var(--color-success)]/10 border-b border-[var(--color-success)]/30 px-4 py-2.5 text-center text-sm text-[var(--color-success)] font-medium">
          Your plan has been upgraded successfully. Welcome to the next level!
        </div>
      )}

      {creditsAdded && (
        <div className="bg-[var(--color-success)]/10 border-b border-[var(--color-success)]/30 px-4 py-2.5 text-center text-sm text-[var(--color-success)] font-medium">
          Credits added to your account. Keep closing!
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── LEFT PANEL — FORM ── */}
          <div className="space-y-5">

            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text)]">Generate a response</h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                  {session?.user?.name ? `Hi ${session.user.name.split(' ')[0]}.` : 'Hi.'} Choose an objection and get your POISE response.
                </p>
              </div>
              <button
                onClick={loadExample}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-primary)]/40 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Try an example
              </button>
            </div>

            {exampleLoaded && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/25 text-xs text-[var(--color-primary)]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                Example scenario loaded — click <strong className="mx-0.5">Generate</strong> to see POISE in action.
              </div>
            )}

            {/* Step 1 */}
            <div className="card">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Step 1 — Select the objection
              </p>

              {selectedObjection && (
                <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-sm text-[var(--color-primary)]">
                  <Check className="w-3.5 h-3.5" />
                  <span className="font-medium">{
                    OBJECTION_CATEGORIES.flatMap(c => c.objections).find(o => o.id === selectedObjection)?.label
                  }</span>
                  <button onClick={() => setSelectedObjection('')} className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs">
                    Clear
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {OBJECTION_CATEGORIES.map(cat => (
                  <div key={cat.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <span>{cat.label}</span>
                      {expandedCategory === cat.id
                        ? <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                        : <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                      }
                    </button>
                    {expandedCategory === cat.id && (
                      <div className="ml-3 mt-1 space-y-0.5 pb-1">
                        {cat.objections.map(obj => (
                          <button
                            key={obj.id}
                            type="button"
                            onClick={() => setSelectedObjection(obj.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedObjection === obj.id
                                ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-medium'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                            }`}
                          >
                            {obj.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="card">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Step 2 — Client&apos;s message (optional)
              </p>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Paste the client's exact message for a personalized response..."
                value={clientMessage}
                onChange={e => setClientMessage(e.target.value)}
              />
            </div>

            {/* Step 3 */}
            <div className="card">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Step 3 — Context (optional)
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label" htmlFor="contractValue">Contract value</label>
                  <input
                    id="contractValue"
                    type="text"
                    className="input"
                    placeholder="e.g. $12,000 / year"
                    value={contractValue}
                    onChange={e => setContractValue(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label" htmlFor="relationship">Relationship</label>
                    <select id="relationship" className="input" value={relationshipLevel} onChange={e => setRelationshipLevel(e.target.value)}>
                      <option value="">Select...</option>
                      {RELATIONSHIP_LEVELS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="objective">Objective</label>
                    <select id="objective" className="input" value={objective} onChange={e => setObjective(e.target.value)}>
                      <option value="">Select...</option>
                      {OBJECTIVES.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="card">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Step 4 — Select your tone
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      tone === t.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${tone === t.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || noCredits || !selectedObjection}
              className="btn-primary w-full py-3 text-base"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Generating...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Generate POISE Response{user && <span className="ml-auto text-xs opacity-70">{user.creditsLeft} left</span>}</>
              )}
            </button>

            {user && user.creditsLeft <= 3 && (
              <button
                onClick={() => setShowCreditsModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                {user.creditsLeft === 0 ? 'Buy credits to continue' : 'Running low — buy more credits'}
              </button>
            )}

            {user?.stripeCustomerId && (
              <button onClick={handleBillingPortal} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 w-full text-center">
                Manage billing
              </button>
            )}
          </div>

          {/* ── RIGHT PANEL — OUTPUT + STATS + HISTORY ── */}
          <div className="space-y-5">

            {/* Stats bar */}
            {history.length > 0 && (
              <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <TrendingUp className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] divide-x divide-[var(--color-border)]">
                  <span>
                    <strong className="text-[var(--color-text)]">{history.length}</strong> objection{history.length !== 1 ? 's' : ''} handled
                  </span>
                  {thisMonthCount > 0 && (
                    <span className="pl-3">
                      <strong className="text-[var(--color-success)]">{thisMonthCount}</strong> this month
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Output card */}
            <div className="card min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--color-primary)]" />
                  <p className="text-sm font-semibold text-[var(--color-text)]">POISE Response</p>
                </div>
                {generatedReply && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[var(--color-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--color-text-muted)]">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
                  <p className="text-sm">Crafting your POISE response...</p>
                </div>
              ) : generatedReply ? (
                <div className="flex-1 flex flex-col gap-3">
                  {poiseSteps ? (
                    // ── POISE step view ──
                    poiseSteps.map(step => {
                      const meta = POISE_META[step.key]
                      return (
                        <div
                          key={step.key}
                          className="rounded-lg p-3"
                          style={{ background: meta.bg, border: `1px solid ${meta.color}30` }}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                              style={{ background: meta.color }}
                            >
                              {step.key}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                              {meta.label}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--color-text)] leading-relaxed">{step.text}</p>
                        </div>
                      )
                    })
                  ) : (
                    // ── Fallback: plain text ──
                    <div className="flex-1 text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                      {generatedReply}
                    </div>
                  )}

                  {/* Regenerate with different tone */}
                  {!noCredits && (
                    <div className="mt-2 pt-3 border-t border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-muted)] mb-2">Try a different tone <span className="opacity-60">(-1 credit each)</span>:</p>
                      <div className="flex flex-wrap gap-2">
                        {otherTones.map(t => (
                          <button
                            key={t.id}
                            onClick={() => handleRegenerateWithTone(t.id)}
                            disabled={isGenerating}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-40"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-1">
                    <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Your response will appear here</p>
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    Select an objection type and click Generate
                  </p>
                  <button
                    onClick={loadExample}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-primary)]/40 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Try an example
                  </button>
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                  <p className="text-sm font-semibold text-[var(--color-text)]">Recent responses</p>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {history.map(item => {
                    const label = OBJECTION_CATEGORIES
                      .flatMap(c => c.objections)
                      .find(o => o.id === item.objectionType)?.label || item.objectionType
                    return (
                      <button
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="w-full flex items-start gap-3 p-2.5 rounded-lg text-left hover:bg-[var(--color-bg)] transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                            {label}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {item.tone} · {formatDate(item.createdAt)}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Buy Credits Modal ── */}
      {showCreditsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowCreditsModal(false) }}
        >
          <div className="card w-full max-w-md relative">
            <button onClick={() => setShowCreditsModal(false)} className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[var(--color-text)]">Top up your credits</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                One-time purchase. Credits never expire. You have{' '}
                <span className="font-semibold text-[var(--color-text)]">{user?.creditsLeft ?? 0}</span> left.
              </p>
            </div>
            <div className="space-y-3">
              {CREDIT_PACKS.map(pack => (
                <div
                  key={pack.id}
                  className={`relative flex items-center justify-between p-4 rounded-xl border transition-colors ${
                    pack.badge ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  {pack.badge && (
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wide">
                      {pack.badge}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-sm">{pack.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{pack.credits} credits · ${pack.perCredit}/credit</p>
                    <p className="text-xs text-[var(--color-primary)] mt-0.5">{pack.anchor}</p>
                  </div>
                  <button
                    onClick={() => handleBuyCredits(pack.priceId, pack.id)}
                    disabled={buyingPack === pack.id}
                    className={`ml-4 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      pack.badge ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]' : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {buyingPack === pack.id ? <Loader2 className="w-4 h-4 animate-spin" /> : `$${pack.price}`}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">Secure checkout via Stripe. Instant delivery.</p>
          </div>
        </div>
      )}
    </div>
  )
}
