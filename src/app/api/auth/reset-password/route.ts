import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { resetPasswordLimiter, applyRateLimit } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const limited = await applyRateLimit(resetPasswordLimiter, `reset-password:${ip}`)
    if (limited) return limited

    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json({ error: 'Invalid reset token' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (password.length > 128) {
      return NextResponse.json({ error: 'Password too long' }, { status: 400 })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } })
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    })

    await prisma.passwordResetToken.delete({ where: { token } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reset-password]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
