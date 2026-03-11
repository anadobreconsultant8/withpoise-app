import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, currentPassword, newPassword } = body

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, passwordHash: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ── Update name ──
    if (name !== undefined) {
      if (typeof name !== 'string' || name.length > 100) {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() || null },
      })
      return NextResponse.json({ success: true })
    }

    // ── Update password ──
    if (newPassword !== undefined) {
      if (!user.passwordHash) {
        return NextResponse.json({ error: 'Password change not available for OAuth accounts' }, { status: 400 })
      }

      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!valid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
      }

      if (newPassword.length > 128) {
        return NextResponse.json({ error: 'Password too long' }, { status: 400 })
      }

      const hash = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hash },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  } catch (error) {
    console.error('[account]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
