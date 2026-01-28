import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const claim = await prisma.claim.findUnique({
      where: { id: params.id },
      include: {
        policy: {
          select: { id: true, policyNumber: true, type: true, company: true },
        },
        documents: {
          select: { id: true, name: true, type: true, url: true, size: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
        messages: {
          select: { id: true, message: true, senderType: true, senderName: true, read: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!claim) {
      return NextResponse.json({ error: 'Siniestro no encontrado.' }, { status: 404 })
    }

    if (claim.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No tienes permiso para acceder a este siniestro.' }, { status: 403 })
    }

    return NextResponse.json({ claim })
  } catch (error) {
    console.error('[Claim GET] Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado. Solo administradores pueden actualizar siniestros.' }, { status: 403 })
    }

    const body = await request.json()

    const existingClaim = await prisma.claim.findUnique({
      where: { id: params.id },
    })

    if (!existingClaim) {
      return NextResponse.json({ error: 'Siniestro no encontrado.' }, { status: 404 })
    }

    const updateData: any = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.amount !== undefined) updateData.amount = body.amount
    if (body.description !== undefined) updateData.description = body.description

    const claim = await prisma.claim.update({
      where: { id: params.id },
      data: updateData,
      include: {
        policy: {
          select: { id: true, policyNumber: true, type: true, company: true },
        },
      },
    })

    if (body.status && body.status !== existingClaim.status) {
      await prisma.notification.create({
        data: {
          userId: claim.userId,
          type: 'CLAIM_STATUS_UPDATE',
          title: 'Estado de siniestro actualizado',
          message: `Tu siniestro ${claim.claimNumber} ha cambiado a estado ${body.status}.`,
          priority: 'HIGH',
          read: false,
          actionUrl: `/claims/${claim.id}`,
          actionLabel: 'Ver siniestro',
        },
      })
    }

    return NextResponse.json({
      message: 'Siniestro actualizado exitosamente.',
      claim,
    })
  } catch (error) {
    console.error('[Claim PATCH] Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
