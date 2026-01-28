/**
 * API Route: Registro de Nuevos Usuarios
 *
 * Flujo de registro autónomo:
 * 1. Usuario proporciona email y nombre
 * 2. Sistema genera código de verificación de 6 dígitos
 * 3. Envía código al email del usuario
 * 4. Usuario introduce código para verificar
 * 5. Usuario queda registrado y puede hacer login
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

/**
 * POST /api/auth/register
 *
 * Inicia el proceso de registro enviando código de verificación
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name } = body

    // Validación de entrada
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim()

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      // Si ya existe y está verificado
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'Este email ya está registrado. Por favor, inicia sesión.' },
          { status: 400 }
        )
      }

      // Si existe pero no verificado, permitir reenvío del código
      console.log(`[Register] Usuario no verificado, reenviando código: ${normalizedEmail}`)
    }

    // Generar código de verificación de 6 dígitos
    const verificationCode = crypto.randomInt(100000, 999999).toString()

    // Guardar código en la base de datos (temporal, expira en 15 minutos)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    if (existingUser) {
      // Usuario existe pero no verificado - actualizar código
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail }
      })

      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: verificationCode,
          expires: expiresAt,
        }
      })
    } else {
      // Usuario nuevo - crear usuario temporal y código
      await prisma.user.create({
        data: {
          email: normalizedEmail,
          name,
          role: 'CLIENTE',
          level: 'BRONCE',
          points: 0,
          isActive: true,
          emailVerified: null, // No verificado aún
        }
      })

      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: verificationCode,
          expires: expiresAt,
        }
      })
    }

    // Enviar email con código de verificación
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
          to: normalizedEmail,
          subject: 'Código de verificación - Soriano e-Cliente',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #4A90E2 0%, #6FA8EC 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Soriano e-Cliente</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #4A90E2; margin-top: 0;">¡Bienvenido, ${name}!</h2>
                  <p style="font-size: 16px; margin-bottom: 25px;">
                    Gracias por registrarte en Soriano e-Cliente. Para completar tu registro, introduce el siguiente código de verificación en la aplicación:
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #4A90E2 0%, #6FA8EC 100%); color: white; padding: 20px 40px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
                      ${verificationCode}
                    </div>
                  </div>
                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    Este código expirará en <strong>15 minutos</strong>.
                  </p>
                  <p style="font-size: 14px; color: #666;">
                    Si no solicitaste este registro, puedes ignorar este correo de forma segura.
                  </p>
                </div>
                <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                  <p>&copy; ${new Date().getFullYear()} Soriano Mediadores de Seguros. Todos los derechos reservados.</p>
                </div>
              </body>
            </html>
          `,
        })

        console.log(`[Register] ✅ Código de verificación enviado a: ${normalizedEmail}`)
      } catch (emailError) {
        console.error('[Register] ❌ Error al enviar email:', emailError)
        return NextResponse.json(
          { error: 'No se pudo enviar el email de verificación' },
          { status: 500 }
        )
      }
    } else {
      // Sin Resend configurado - devolver código para desarrollo
      console.log(`[Register] ⚠️ Resend no configurado. Código: ${verificationCode}`)
      return NextResponse.json({
        success: true,
        message: 'Código de verificación generado (modo desarrollo)',
        code: verificationCode, // Solo para desarrollo
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Código de verificación enviado a tu email',
      email: normalizedEmail,
    })

  } catch (error) {
    console.error('[Register] ❌ Error en registro:', error)
    return NextResponse.json(
      { error: 'Error al procesar el registro' },
      { status: 500 }
    )
  }
}
