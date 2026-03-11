import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import { forgotPasswordLimiter, applyRateLimit } from '@/lib/ratelimit'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const limited = await applyRateLimit(forgotPasswordLimiter, `forgot-password:${ip}`)
    if (limited) return limited

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } })

    // Create new token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[forgot-password]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
