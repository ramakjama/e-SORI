import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Security } from '@/lib/security'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * Setup 2FA for user
 * POST /api/auth/2fa/setup
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

    // Generate TOTP secret
    const secret = Security.generateTOTPSecret()

    // Generate backup codes
    const backupCodes = Security.generateBackupCodes(10)

    // Hash backup codes before storing
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => bcrypt.hash(code, 10))
    )

    // Update user with 2FA secret (not enabled yet until verified)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        backupCodes: hashedBackupCodes,
      },
    })

    // Generate QR code
    const qrCode = await Security.generateTOTPQRCode(
      session.user.email!,
      secret
    )

    // Log audit event
    await Security.logAuditEvent({
      userId: session.user.id,
      email: session.user.email,
      eventType: 'TWO_FACTOR_ENABLED',
      ipAddress: Security.getClientIP(req.headers),
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
    })

    return NextResponse.json({
      qrCode,
      secret,
      backupCodes, // Plain text codes to show to user (only time they'll see them)
    })

  } catch (error) {
    console.error('[2FA] Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    )
  }
}
