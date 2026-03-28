import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerLimiter, applyRateLimit } from '@/lib/ratelimit'
import { sendWelcomeEmail, sendAdminNewUserEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const limited = await applyRateLimit(registerLimiter, `register:${ip}`)
    if (limited) return limited

    const { name, email, password, plan } = await req.json()
    const isPaidPlan = ['starter', 'pro', 'elite'].includes(plan)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (name && name.length > 100) {
      return NextResponse.json({ error: 'Name is too long (max 100 characters)' }, { status: 400 })
    }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (password.length > 128) {
      return NextResponse.json({ error: 'Password too long' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        passwordHash,
        plan: 'free',
        creditsLeft: isPaidPlan ? 0 : 5,
        creditsTotal: isPaidPlan ? 0 : 5,
      },
      select: { id: true, name: true, email: true, plan: true, creditsLeft: true },
    })

    // Send welcome email (non-blocking — don't fail registration if email fails)
    sendWelcomeEmail(email, name).catch(err => console.error('[welcome-email]', err))
    sendAdminNewUserEmail(email, name || null, 'email').catch(() => {})

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
