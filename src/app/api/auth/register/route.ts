import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener mayúscula, minúscula y número'
    ),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos
    const validatedData = registerSchema.parse(body)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        role: 'CLIENTE',
        level: 'BRONCE',
        points: 0,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        level: true,
        points: true,
        createdAt: true,
      },
    })

    // Otorgar puntos de bienvenida
    await prisma.pointsHistory.create({
      data: {
        userId: user.id,
        action: 'PERFIL_COMPLETO',
        points: 50,
        description: 'Bienvenida: Registro completado',
      },
    })

    // Actualizar puntos del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { points: 50 },
    })

    return NextResponse.json({
      message: 'Usuario creado correctamente',
      user: { ...user, points: 50 },
    })
  } catch (error) {
    console.error('Register error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear el usuario' },
      { status: 500 }
    )
  }
}
