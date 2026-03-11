import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        creditsLeft: true,
        creditsTotal: true,
        createdAt: true,
        generations: {
          orderBy: { createdAt: 'desc' },
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
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        memberSince: user.createdAt,
      },
      credits: {
        left: user.creditsLeft,
        total: user.creditsTotal,
      },
      responses: user.generations,
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="withpoise-data-${user.id}.json"`,
      },
    })
  } catch (error) {
    console.error('[export]', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
