import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// POST - Resolve Ticket
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    // Only admins/agents can resolve tickets
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json(
        { error: 'Acceso denegado. Solo mediadores pueden resolver tickets.' },
        { status: 403 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado.' },
        { status: 404 }
      )
    }

    const body = await request.json()

    if (!body.resolution) {
      return NextResponse.json(
        { error: 'Debes proporcionar una resolución.' },
        { status: 400 }
      )
    }

    // Update ticket to resolved
    const resolvedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: {
        status: 'RESOLVED',
        resolution: body.resolution,
        resolvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Create system message
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderType: 'SYSTEM',
        senderId: session.user.id,
        senderName: 'Sistema',
        message: `Ticket resuelto por ${session.user.name || 'Mediador'}:\n\n${
          body.resolution
        }`,
        read: false,
      },
    })

    // Notify user
    await prisma.notification.create({
      data: {
        userId: ticket.userId,
        type: 'TICKET_RESOLVED',
        title: 'Ticket resuelto',
        message: `Tu ticket ${ticket.ticketNumber} ha sido resuelto. Por favor, valora el servicio.`,
        priority: 'HIGH',
        read: false,
        actionUrl: `/tickets/${ticket.id}`,
        actionLabel: 'Ver y valorar',
      },
    })

    // Update request status
    if (ticket.requestId) {
      await prisma.request.update({
        where: { id: ticket.requestId },
        data: {
          status: 'RESOLVED',
          resolvedAt: new Date(),
          resolution: body.resolution,
        },
      })
    }

    return NextResponse.json({
      message: 'Ticket resuelto exitosamente.',
      ticket: resolvedTicket,
    })
  } catch (error) {
    console.error('[Ticket Resolve POST] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
