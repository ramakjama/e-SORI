import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Security } from '@/lib/security'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * Disable 2FA for user
 * POST /api/auth/2fa/disable
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { password } = await req.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      )
    }

    // Verify password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 400 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    })

    // Log audit event
    await Security.logAuditEvent({
      userId: session.user.id,
      email: session.user.email,
      eventType: 'TWO_FACTOR_DISABLED',
      ipAddress: Security.getClientIP(req.headers),
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[2FA] Disable error:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}
