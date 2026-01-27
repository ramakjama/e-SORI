import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const healthSchema = z.object({
  grupoSanguineo: z.string().optional(),
  alergias: z.string().optional(),
  condicionesMedicas: z.string().optional(),
  medicacionHabitual: z.string().optional(),
  contactoEmergencia: z.string().optional(),
  telefonoEmergencia: z.string().optional(),
  relacionEmergencia: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await prisma.datosSalud.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching health data:', error)
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
    const validated = healthSchema.parse(body)

    const completitud = Object.values(validated).filter(v => v).length * 14

    const data = await prisma.datosSalud.upsert({
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
    console.error('Error saving health data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
