import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// POST - Add Message to Ticket
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

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket no encontrado.' },
        { status: 404 }
      )
    }

    // Check authorization
    const isOwner = ticket.userId === session.user.id
    const isAssigned = ticket.assignedToId === session.user.id
    const isAdmin =
      session.user.role === 'ADMIN' || session.user.role === 'AGENT'

    if (!isOwner && !isAssigned && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permiso para responder en este ticket.' },
        { status: 403 }
      )
    }

    const body = await request.json()

    if (!body.message) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío.' },
        { status: 400 }
      )
    }

    // Determine sender type
    const senderType = isOwner ? 'USER' : 'MEDIATOR'

    // Create message
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderType,
        senderId: session.user.id,
        senderName: session.user.name || 'Usuario',
        message: body.message,
        attachments: body.attachments || null,
        read: false,
      },
    })

    // Update ticket status if needed
    if (ticket.status === 'WAITING_USER' && isOwner) {
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    // If first response from mediator, record it
    if (senderType === 'MEDIATOR' && !ticket.firstResponseAt) {
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { firstResponseAt: new Date() },
      })
    }

    // Send notification to the other party
    const recipientId = isOwner ? ticket.assignedToId : ticket.userId
    if (recipientId) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          type: 'TICKET_MESSAGE',
          title: `Nuevo mensaje en ticket ${ticket.ticketNumber}`,
          message: `${session.user.name || 'Usuario'}: ${
            body.message.length > 100
              ? body.message.substring(0, 100) + '...'
              : body.message
          }`,
          priority: 'MEDIUM',
          read: false,
          actionUrl: `/tickets/${ticket.id}`,
          actionLabel: 'Ver mensaje',
        },
      })
    }

    // Award 5 coins to user for responding
    if (isOwner) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          coins: { increment: 5 },
        },
      })
    }

    return NextResponse.json({
      message: 'Mensaje enviado exitosamente.',
      ticketMessage: message,
      coinsEarned: isOwner ? 5 : 0,
    })
  } catch (error) {
    console.error('[Ticket Message POST] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
