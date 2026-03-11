import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateLimiter, applyRateLimit } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limited = await applyRateLimit(generateLimiter, `history:${session.user.id}`)
    if (limited) return limited

    const generations = await prisma.generation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        objectionType: true,
        tone: true,
        contractValue: true,
        relationshipLevel: true,
        objective: true,
        clientMessage: true,
        generatedReply: true,
        createdAt: true,
      },
    })

    return NextResponse.json(generations)
  } catch (error) {
    console.error('[history]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
