import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateObjectionResponse } from '@/lib/ai-engine'
import { generateLimiter, applyRateLimit } from '@/lib/ratelimit'
import { OBJECTION_CATEGORIES, TONES, RELATIONSHIP_LEVELS, OBJECTIVES } from '@/lib/objection-types'
import { sendFirstUseEmail, sendRunningLowEmail, sendCreditsExhaustedEmail, sendCreditsLowPaidEmail } from '@/lib/email'

const VALID_OBJECTION_IDS = OBJECTION_CATEGORIES.flatMap(c => c.objections.map(o => o.id))
const VALID_TONE_IDS = TONES.map(t => t.id)
const VALID_RELATIONSHIP_IDS = RELATIONSHIP_LEVELS.map(r => r.id)
const VALID_OBJECTIVE_IDS = OBJECTIVES.map(o => o.id)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const limited = await applyRateLimit(generateLimiter, `generate:${userId}`)
    if (limited) return limited

    // Read user info needed for AI prompt and email triggers
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsLeft: true, creditsTotal: true, name: true, email: true, plan: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { objectionType, tone, contractValue, relationshipLevel, objective, clientMessage } =
      await req.json()

    if (!objectionType || !tone) {
      return NextResponse.json({ error: 'objectionType and tone are required' }, { status: 400 })
    }

    if (!VALID_OBJECTION_IDS.includes(objectionType)) {
      return NextResponse.json({ error: 'Invalid objection type' }, { status: 400 })
    }

    if (!VALID_TONE_IDS.includes(tone)) {
      return NextResponse.json({ error: 'Invalid tone' }, { status: 400 })
    }

    if (relationshipLevel && !VALID_RELATIONSHIP_IDS.includes(relationshipLevel)) {
      return NextResponse.json({ error: 'Invalid relationship level' }, { status: 400 })
    }

    if (objective && !VALID_OBJECTIVE_IDS.includes(objective)) {
      return NextResponse.json({ error: 'Invalid objective' }, { status: 400 })
    }

    if (clientMessage && clientMessage.length > 2000) {
      return NextResponse.json({ error: 'Client message is too long (max 2000 characters)' }, { status: 400 })
    }

    if (contractValue && contractValue.length > 100) {
      return NextResponse.json({ error: 'Contract value is too long' }, { status: 400 })
    }

    // Atomically decrement credits with a guard — prevents race conditions where
    // two concurrent requests both pass the creditsLeft > 0 check
    const decremented = await prisma.user.updateMany({
      where: { id: userId, creditsLeft: { gt: 0 } },
      data: { creditsLeft: { decrement: 1 } },
    })

    if (decremented.count === 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Generate AI response — if it fails, refund the credit
    let reply: string
    try {
      reply = await generateObjectionResponse({
        objectionType,
        tone,
        contractValue: contractValue || undefined,
        relationshipLevel: relationshipLevel || undefined,
        objective: objective || undefined,
        clientMessage: clientMessage || undefined,
        userName: user.name || undefined,
      })
    } catch (aiError) {
      // Refund the credit so the user isn't charged for a failed generation
      await prisma.user.update({
        where: { id: userId },
        data: { creditsLeft: { increment: 1 } },
      })
      throw aiError
    }

    // Save generation record and get updated credit count
    const [generatedRecord, updatedUser] = await prisma.$transaction([
      prisma.generation.create({
        data: {
          userId,
          objectionType,
          tone,
          contractValue: contractValue || null,
          relationshipLevel: relationshipLevel || null,
          objective: objective || null,
          clientMessage: clientMessage || null,
          generatedReply: reply,
        },
      }),
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { creditsLeft: true },
      }),
    ])

    // Suppress unused variable warning
    void generatedRecord

    // Fire-and-forget upsell emails
    if (user.email) {
      const left = updatedUser.creditsLeft
      if (user.plan === 'free' && user.creditsTotal === 5) {
        if (left === 4) sendFirstUseEmail(user.email, user.name).catch(() => {})
        else if (left === 2) sendRunningLowEmail(user.email, user.name).catch(() => {})
        else if (left === 0) sendCreditsExhaustedEmail(user.email, user.name).catch(() => {})
      } else if (user.plan === 'starter' && left === 6) {
        sendCreditsLowPaidEmail(user.email, user.name, 'starter').catch(() => {})
      } else if (user.plan === 'pro' && left === 20) {
        sendCreditsLowPaidEmail(user.email, user.name, 'pro').catch(() => {})
      } else if (user.plan === 'elite' && left === 60) {
        sendCreditsLowPaidEmail(user.email, user.name, 'elite').catch(() => {})
      }
    }

    return NextResponse.json({ reply, creditsLeft: updatedUser.creditsLeft })
  } catch (error) {
    console.error('[generate]', error)
    return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 })
  }
}
