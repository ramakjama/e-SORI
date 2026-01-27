import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const hobbiesSchema = z.object({
  deportesPracticados: z.string().optional(),
  viajesFrecuentes: z.boolean().optional(),
  destinosFrecuentes: z.string().optional(),
  actividadesRiesgo: z.string().optional(),
  hobbies: z.string().optional(),
  mascotasTipo: z.string().optional(),
  mascotasCantidad: z.number().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await prisma.datosAficiones.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching hobbies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = hobbiesSchema.parse(body)

    const completitud = Object.values(validated).filter(v => v !== undefined && v !== null && v !== '').length * 14

    const data = await prisma.datosAficiones.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...validated,
        completitud
      },
      update: {
        ...validated,
        completitud
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error saving hobbies:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
