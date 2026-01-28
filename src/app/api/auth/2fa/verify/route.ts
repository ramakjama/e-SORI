import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Security } from '@/lib/security'
import { prisma } from '@/lib/prisma'

/**
 * Verify 2FA code and enable 2FA
 * POST /api/auth/2fa/verify
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

    const { code } = await req.json()

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorSecret: true },
    })

    if (!user?.twoFactorSecret) {
      return NextResponse.json(
        { error: '2FA not set up' },
        { status: 400 }
      )
    }

    // Verify TOTP code
    const isValid = await Security.verifyTOTPCode(user.twoFactorSecret, code)

    if (!isValid) {
      await Security.logAuditEvent({
        userId: session.user.id,
        email: session.user.email,
        eventType: 'TWO_FACTOR_FAILED',
        ipAddress: Security.getClientIP(req.headers),
        userAgent: req.headers.get('user-agent') || 'unknown',
        metadata: { reason: 'invalid_code' },
        timestamp: new Date(),
      })

      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorEnabled: true },
    })

    // Log success
    await Security.logAuditEvent({
      userId: session.user.id,
      email: session.user.email,
      eventType: 'TWO_FACTOR_VERIFIED',
      ipAddress: Security.getClientIP(req.headers),
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[2FA] Verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}
