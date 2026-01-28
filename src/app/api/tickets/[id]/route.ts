import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// GET - Get Ticket Details
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

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        request: {
          select: {
            id: true,
            type: true,
            category: true,
            aiClassification: true,
            aiResolved: true,
            aiResponse: true,
          },
        },
        relatedPolicy: {
          select: {
            id: true,
            policyNumber: true,
            policyType: true,
            provider: true,
            status: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        internalNotes: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
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
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'AGENT'

    if (!isOwner && !isAssigned && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a este ticket.' },
        { status: 403 }
      )
    }

    // Mark messages as read if user is viewing
    if (isOwner || isAssigned) {
      const unreadMessages = ticket.messages.filter((m) => !m.read)
      if (unreadMessages.length > 0) {
        await prisma.ticketMessage.updateMany({
          where: {
            ticketId: ticket.id,
            read: false,
            // Don't mark own messages as read
            senderType: isOwner ? 'MEDIATOR' : 'USER',
          },
          data: {
            read: true,
            readAt: new Date(),
          },
        })
      }
    }

    // Hide internal notes from regular users
    if (session.user.role === 'CLIENT') {
      return NextResponse.json({
        ticket: {
          ...ticket,
          internalNotes: undefined,
        },
      })
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('[Ticket GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH - Update Ticket
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

    // Only admins/agents can update tickets
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json(
        { error: 'Acceso denegado.' },
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

    const updateData: any = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.assignedToId !== undefined)
      updateData.assignedToId = body.assignedToId
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.resolution !== undefined) updateData.resolution = body.resolution

    // If changing to IN_PROGRESS and no first response, set it
    if (body.status === 'IN_PROGRESS' && !ticket.firstResponseAt) {
      updateData.firstResponseAt = new Date()
    }

    // If resolving, set resolvedAt
    if (body.status === 'RESOLVED' && !ticket.resolvedAt) {
      updateData.resolvedAt = new Date()
    }

    // If closing, set closedAt
    if (body.status === 'CLOSED' && !ticket.closedAt) {
      updateData.closedAt = new Date()
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Notify user of status change
    if (body.status && body.status !== ticket.status) {
      const statusMessages: Record<string, string> = {
        ASSIGNED: 'Tu ticket ha sido asignado a un mediador',
        IN_PROGRESS: 'Tu ticket está siendo atendido',
        RESOLVED: 'Tu ticket ha sido resuelto',
        CLOSED: 'Tu ticket ha sido cerrado',
      }

      if (statusMessages[body.status]) {
        await prisma.notification.create({
          data: {
            userId: ticket.userId,
            type: 'TICKET_STATUS_UPDATE',
            title: 'Estado de ticket actualizado',
            message: `${statusMessages[body.status]}: ${ticket.ticketNumber}`,
            priority: 'MEDIUM',
            read: false,
            actionUrl: `/tickets/${ticket.id}`,
            actionLabel: 'Ver ticket',
          },
        })
      }
    }

    return NextResponse.json({
      message: 'Ticket actualizado exitosamente.',
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error('[Ticket PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
