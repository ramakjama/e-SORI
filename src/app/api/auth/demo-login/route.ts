import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * API para crear/obtener usuario DEMO
 * POST /api/auth/demo-login
 */
export async function POST(req: NextRequest) {
  try {
    const demoEmail = 'demo@soriano-cliente.com'
    const demoPassword = 'demo123'

    // Buscar si ya existe el usuario demo
    let demoUser = await prisma.user.findUnique({
      where: { email: demoEmail }
    })

    // Si no existe, crearlo
    if (!demoUser) {
      console.log('[Demo] Creating demo user...')

      const hashedPassword = await bcrypt.hash(demoPassword, 10)

      demoUser = await prisma.user.create({
        data: {
          email: demoEmail,
          name: 'Usuario Demo',
          password: hashedPassword,
          role: 'CLIENTE',
          level: 'ORO', // Nivel especial para demo
          points: 500,
          emailVerified: new Date(),
          isActive: true,
        }
      })

      // Crear wallets para el usuario demo
      await prisma.wallet.createMany({
        data: [
          { userId: demoUser.id, type: 'XP', balance: 1000 },
          { userId: demoUser.id, type: 'COINS', balance: 500 },
          { userId: demoUser.id, type: 'SHIELDS', balance: 10 },
        ]
      })

      console.log('[Demo] Demo user created successfully')
    }

    return NextResponse.json({
      success: true,
      email: demoEmail,
      message: 'Demo user ready'
    })

  } catch (error) {
    console.error('[Demo] Error creating demo user:', error)
    return NextResponse.json(
      { error: 'Failed to create demo user' },
      { status: 500 }
    )
  }
}
