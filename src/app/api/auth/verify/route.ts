/**
 * API Route: Verificación de Código de Registro
 *
 * Verifica el código de 6 dígitos enviado al email del usuario
 * y completa el registro activando la cuenta
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/auth/verify
 *
 * Verifica el código y activa la cuenta del usuario
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, code } = body

    // Validación de entrada
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato del código (6 dígitos)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Código inválido. Debe ser de 6 dígitos.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Buscar código de verificación
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: code,
      }
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Código incorrecto o expirado' },
        { status: 400 }
      )
    }

    // Verificar que no haya expirado
    if (verificationToken.expires < new Date()) {
      // Eliminar código expirado
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: normalizedEmail,
            token: code,
          }
        }
      })

      return NextResponse.json(
        { error: 'Código expirado. Solicita uno nuevo.' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Marcar email como verificado
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        emailVerified: new Date(),
      }
    })

    // Crear wallets para el nuevo usuario
    const existingWallets = await prisma.wallet.findMany({
      where: { userId: user.id }
    })

    if (existingWallets.length === 0) {
      await prisma.wallet.createMany({
        data: [
          { userId: user.id, type: 'XP', balance: 0 },
          { userId: user.id, type: 'COINS', balance: 100 }, // Bonus bienvenida
          { userId: user.id, type: 'SHIELDS', balance: 0 },
        ]
      })
    }

    // Eliminar código usado
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token: code,
        }
      }
    })

    console.log(`[Verify] ✅ Usuario verificado exitosamente: ${normalizedEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Email verificado correctamente. Ya puedes iniciar sesión.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
      }
    })

  } catch (error) {
    console.error('[Verify] ❌ Error en verificación:', error)
    return NextResponse.json(
      { error: 'Error al verificar el código' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/auth/verify
 *
 * Reenvía código de verificación
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Verificar que el usuario existe y no está verificado
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Este email ya está verificado' },
        { status: 400 }
      )
    }

    // Eliminar códigos anteriores
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail }
    })

    // Redirigir a /api/auth/register para generar y enviar nuevo código
    return NextResponse.json({
      success: true,
      message: 'Solicita un nuevo código en /api/auth/register',
    })

  } catch (error) {
    console.error('[Verify] ❌ Error al reenviar código:', error)
    return NextResponse.json(
      { error: 'Error al reenviar código' },
      { status: 500 }
    )
  }
}
