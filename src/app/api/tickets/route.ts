import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// GET - List Tickets
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignedToMe = searchParams.get('assignedToMe') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    // If regular user, only show their tickets
    // If admin/agent, can see all or assigned tickets
    if (session.user.role === 'CLIENT') {
      where.userId = session.user.id
    } else if (assignedToMe) {
      where.assignedToId = session.user.id
    }

    if (status) where.status = status
    if (priority) where.priority = priority

    const tickets = await prisma.ticket.findMany({
      where,
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
        request: {
          select: {
            id: true,
            type: true,
            category: true,
            aiClassification: true,
          },
        },
        relatedPolicy: {
          select: {
            id: true,
            policyNumber: true,
            policyType: true,
          },
        },
        messages: {
          select: {
            id: true,
            read: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: Math.min(limit, 100),
    })

    // Calculate unread messages for each ticket
    const ticketsWithUnread = tickets.map((ticket) => ({
      ...ticket,
      unreadMessages: ticket.messages.filter((m) => !m.read).length,
      lastMessageAt:
        ticket.messages.length > 0 ? ticket.messages[0].createdAt : null,
    }))

    return NextResponse.json({
      tickets: ticketsWithUnread,
      count: ticketsWithUnread.length,
    })
  } catch (error) {
    console.error('[Tickets GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
