import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// GET - Get Single Request Details
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const requestData = await prisma.request.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ticket: {
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
        policy: {
          select: {
            id: true,
            policyNumber: true,
            policyType: true,
            provider: true,
          },
        },
      },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Petición no encontrada.' },
        { status: 404 }
      )
    }

    // Check authorization
    if (
      requestData.userId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a esta petición.' },
        { status: 403 }
      )
    }

    return NextResponse.json({ request: requestData })
  } catch (error) {
    console.error('[Request GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH - Cancel Request
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const requestData = await prisma.request.findUnique({
      where: { id: params.id },
    })

    if (!requestData) {
      return NextResponse.json(
        { error: 'Petición no encontrada.' },
        { status: 404 }
      )
    }

    // Check authorization
    if (requestData.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar esta petición.' },
        { status: 403 }
      )
    }

    // Only allow cancelling pending requests
    if (requestData.status !== 'PENDING' && requestData.status !== 'PROCESSING') {
      return NextResponse.json(
        { error: 'Solo se pueden cancelar peticiones pendientes.' },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.request.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
      },
    })

    return NextResponse.json({
      message: 'Petición cancelada.',
      request: updatedRequest,
    })
  } catch (error) {
    console.error('[Request PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
