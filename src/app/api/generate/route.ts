import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateObjectionResponse } from '@/lib/ai-engine'
import { generateLimiter, applyRateLimit } from '@/lib/ratelimit'
import { OBJECTION_CATEGORIES, TONES, RELATIONSHIP_LEVELS, OBJECTIVES } from '@/lib/objection-types'
import { sendFirstUseEmail, sendRunningLowEmail, sendCreditsExhaustedEmail } from '@/lib/email'

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsLeft: true, creditsTotal: true, name: true, email: true, plan: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.creditsLeft <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 }
      )
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

    const reply = await generateObjectionResponse({
      objectionType,
      tone,
      contractValue: contractValue || undefined,
      relationshipLevel: relationshipLevel || undefined,
      objective: objective || undefined,
      clientMessage: clientMessage || undefined,
      userName: user.name || undefined,
    })

    // Decrement credits and save generation in one transaction
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { creditsLeft: { decrement: 1 } },
        select: { creditsLeft: true },
      }),
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
    ])

    // Fire-and-forget upsell emails for free plan users only
    if (user.plan === 'free' && user.creditsTotal === 5 && user.email) {
      const left = updatedUser.creditsLeft
      if (left === 4) {
        sendFirstUseEmail(user.email, user.name).catch(() => {})
      } else if (left === 2) {
        sendRunningLowEmail(user.email, user.name).catch(() => {})
      } else if (left === 0) {
        sendCreditsExhaustedEmail(user.email, user.name).catch(() => {})
      }
    }

    return NextResponse.json({ reply, creditsLeft: updatedUser.creditsLeft })
  } catch (error) {
    console.error('[generate]', error)
    return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 })
  }
}
