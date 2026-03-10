'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import {
  Zap, ChevronDown, ChevronRight, Copy, Check, RotateCcw,
  Clock, Loader2, AlertCircle, Sparkles, X, Plus
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { OBJECTION_CATEGORIES, TONES, RELATIONSHIP_LEVELS, OBJECTIVES } from '@/lib/objection-types'
import { CREDIT_PACKS } from '@/lib/plans'

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

export default function DashboardPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()

  // User state
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
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

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

  // Show success toast if redirected from Stripe
  const upgraded = searchParams.get('upgraded')
  const creditsAdded = searchParams.get('credits_added')
  useEffect(() => {
    if (upgraded || creditsAdded) fetchUser()
  }, [upgraded, creditsAdded, fetchUser])

  async function handleGenerate() {
    if (!selectedObjection) {
      setError('Please select an objection type.')
      return
    }

    setError('')
    setIsGenerating(true)
    setGeneratedReply('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectionType: selectedObjection,
          tone,
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

      // Update credits locally
      setUser(prev => prev ? { ...prev, creditsLeft: data.creditsLeft } : prev)

      // Refresh history
      fetchHistory()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedReply)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleReset() {
    setGeneratedReply('')
    setError('')
  }

  function loadHistoryItem(item: HistoryItem) {
    setGeneratedReply(item.generatedReply)
    setSelectedObjection(item.objectionType)
    setTone(item.tone)
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const noCredits = user ? user.creditsLeft <= 0 : false

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
      <Navbar
        creditsLeft={user?.creditsLeft}
        creditsTotal={user?.creditsTotal}
      />

      {/* Upgrade banner if no credits */}
      {noCredits && (
        <div className="bg-[var(--color-accent)]/10 border-b border-[var(--color-accent)]/30 px-4 py-2.5 text-center text-sm">
          <span className="text-[var(--color-accent)] font-medium">You&apos;re out of credits.</span>{' '}
          <a href="/pricing" className="text-[var(--color-accent)] underline font-semibold">Upgrade now</a>
          {' '}to keep generating responses.
        </div>
      )}

      {/* Upgrade success banner */}
      {upgraded && (
        <div className="bg-[var(--color-success)]/10 border-b border-[var(--color-success)]/30 px-4 py-2.5 text-center text-sm text-[var(--color-success)] font-medium">
          Your plan has been upgraded successfully. Welcome to the next level!
        </div>
      )}

      {/* Credits added banner */}
      {creditsAdded && (
        <div className="bg-[var(--color-success)]/10 border-b border-[var(--color-success)]/30 px-4 py-2.5 text-center text-sm text-[var(--color-success)] font-medium">
          Credits added to your account. Keep closing!
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* =====================================================
              LEFT PANEL — FORM
              ===================================================== */}
          <div className="space-y-5">

            {/* Header */}
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text)]">
                Generate a response
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                {session?.user?.name ? `Hi ${session.user.name.split(' ')[0]}.` : 'Hi.'} Choose an objection and get your POISE response.
              </p>
            </div>

            {/* Step 1: Objection Type */}
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
                  <button
                    onClick={() => setSelectedObjection('')}
                    className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs"
                  >
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

            {/* Step 2: Client message */}
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

            {/* Step 3: Context */}
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
                    <select
                      id="relationship"
                      className="input"
                      value={relationshipLevel}
                      onChange={e => setRelationshipLevel(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {RELATIONSHIP_LEVELS.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="objective">Objective</label>
                    <select
                      id="objective"
                      className="input"
                      value={objective}
                      onChange={e => setObjective(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {OBJECTIVES.map(o => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Tone */}
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

            {/* Generate button */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || noCredits || !selectedObjection}
              className="btn-primary w-full py-3 text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate POISE Response
                  {user && <span className="ml-auto text-xs opacity-70">{user.creditsLeft} left</span>}
                </>
              )}
            </button>

            {/* Buy more credits CTA */}
            {user && user.creditsLeft <= 3 && (
              <button
                onClick={() => setShowCreditsModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-semibold text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                {user.creditsLeft === 0 ? 'Buy credits to continue' : `Running low — buy more credits`}
              </button>
            )}

            {user?.stripeCustomerId && (
              <button
                onClick={handleBillingPortal}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] underline underline-offset-2 w-full text-center"
              >
                Manage billing
              </button>
            )}
          </div>

          {/* =====================================================
              RIGHT PANEL — OUTPUT + HISTORY
              ===================================================== */}
          <div className="space-y-5">

            {/* Generated output */}
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
                <div className="flex-1 text-sm text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                  {generatedReply}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-1">
                    <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Your response will appear here</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Select an objection type and click Generate
                  </p>
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
            <button
              onClick={() => setShowCreditsModal(false)}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
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
                    pack.badge
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  {pack.badge && (
                    <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wide">
                      {pack.badge}
                    </span>
                  )}

                  <div>
                    <p className="font-semibold text-[var(--color-text)] text-sm">{pack.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {pack.credits} credits · ${pack.perCredit}/credit
                    </p>
                    <p className="text-xs text-[var(--color-primary)] mt-0.5">{pack.anchor}</p>
                  </div>

                  <button
                    onClick={() => handleBuyCredits(pack.priceId, pack.id)}
                    disabled={buyingPack === pack.id}
                    className={`ml-4 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      pack.badge
                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                        : 'border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {buyingPack === pack.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `$${pack.price}`
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">
              Secure checkout via Stripe. Instant delivery.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
