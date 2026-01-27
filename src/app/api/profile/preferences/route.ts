import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const preferencesSchema = z.object({
  tiposSegurosInteres: z.string().optional(),
  presupuestoMensual: z.number().optional(),
  coberturasPrioritarias: z.string().optional(),
  frecuenciaRevision: z.string().optional(),
  canalContactoPreferido: z.string().optional(),
  horarioContactoPreferido: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await prisma.datosPreferencias.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(data || {})
  } catch (error) {
    console.error('Error fetching preferences:', error)
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
    const validated = preferencesSchema.parse(body)

    const completitud = Object.values(validated).filter(v => v).length * 16

    const data = await prisma.datosPreferencias.upsert({
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
    console.error('Error saving preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
