import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { classifyRequest } from '@/lib/requests/ai-classifier'
import {
  attemptAutoResolve,
  awardCoinsForResolution,
} from '@/lib/requests/auto-resolver'

// ============================================
// GET - List User's Requests
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = { userId: session.user.id }
    if (status) where.status = status
    if (type) where.type = type

    const requests = await prisma.request.findMany({
      where,
      include: {
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            status: true,
          },
        },
        policy: {
          select: {
            id: true,
            policyNumber: true,
            policyType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
    })

    return NextResponse.json({
      requests,
      count: requests.length,
    })
  } catch (error) {
    console.error('[Requests GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Create New Request with AI
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, description.' },
        { status: 400 }
      )
    }

    // Step 1: Classify request using AI
    const classification = classifyRequest(body.title, body.description)

    console.log('[Request AI Classification]:', classification)

    // Step 2: Attempt auto-resolution
    let autoResolutionResult = null
    let finalStatus = 'PENDING'

    if (classification.canAutoResolve) {
      autoResolutionResult = await attemptAutoResolve(
        classification.intent,
        classification.extractedEntities,
        session.user.id,
        body.description
      )

      if (autoResolutionResult.resolved) {
        finalStatus = 'RESOLVED'
      }
    }

    // Step 3: Create request record
    const newRequest = await prisma.request.create({
      data: {
        userId: session.user.id,
        type: classification.intent,
        category: classification.category,
        priority: classification.priority,
        title: body.title,
        description: body.description,
        metadata: body.metadata || {},
        aiClassification: classification as any,
        aiResolved: autoResolutionResult?.resolved || false,
        aiResponse: autoResolutionResult?.response || null,
        status: finalStatus,
        resolvedAt: autoResolutionResult?.resolved ? new Date() : null,
        resolution: autoResolutionResult?.resolved
          ? autoResolutionResult.response
          : null,
        policyId: body.policyId || null,
      },
      include: {
        policy: {
          select: {
            id: true,
            policyNumber: true,
            policyType: true,
          },
        },
      },
    })

    // Step 4: If auto-resolved, award coins and notify
    if (autoResolutionResult?.resolved) {
      // Award coins asynchronously
      awardCoinsForResolution(session.user.id, newRequest.id).catch((err) =>
        console.error('[Request POST] Error awarding coins:', err)
      )

      // Create notification
      await prisma.notification
        .create({
          data: {
            userId: session.user.id,
            type: 'REQUEST_RESOLVED',
            title: 'Petición resuelta automáticamente',
            message: `Tu petición "${body.title}" ha sido resuelta. Ganaste 10 coins! 🎉`,
            priority: 'LOW',
            read: false,
            actionUrl: `/peticiones/${newRequest.id}`,
            actionLabel: 'Ver respuesta',
          },
        })
        .catch((err) =>
          console.error('[Request POST] Error creating notification:', err)
        )

      return NextResponse.json(
        {
          message: 'Petición resuelta automáticamente.',
          request: newRequest,
          autoResolved: true,
          response: autoResolutionResult.response,
          coinsEarned: 10,
        },
        { status: 201 }
      )
    }

    // Step 5: If not auto-resolved, create ticket
    if (!autoResolutionResult?.resolved) {
      // Calculate SLA deadline
      const slaHours: Record<string, number> = {
        LOW: 72,
        MEDIUM: 24,
        HIGH: 4,
        URGENT: 2,
      }

      const slaDeadline = new Date()
      slaDeadline.setHours(
        slaDeadline.getHours() + slaHours[classification.priority]
      )

      // Generate ticket number
      const ticketCount = await prisma.ticket.count()
      const ticketNumber = `TKT${String(ticketCount + 1).padStart(6, '0')}`

      // Create ticket
      const ticket = await prisma.ticket.create({
        data: {
          ticketNumber,
          requestId: newRequest.id,
          userId: session.user.id,
          type: classification.intent,
          category: classification.category,
          priority: classification.priority,
          title: body.title,
          description: body.description,
          slaDeadline,
          status: 'NEW',
          relatedPolicyId: body.policyId || null,
          tags: [],
        },
      })

      // Update request with ticket info
      await prisma.request.update({
        where: { id: newRequest.id },
        data: {
          ticketId: ticket.id,
          status: 'TICKET_CREATED',
        },
      })

      // Create notification for user
      await prisma.notification
        .create({
          data: {
            userId: session.user.id,
            type: 'TICKET_CREATED',
            title: 'Ticket creado',
            message: `Tu petición "${body.title}" ha sido asignada al ticket ${ticketNumber}. Un mediador te atenderá pronto.`,
            priority: classification.priority === 'URGENT' ? 'HIGH' : 'MEDIUM',
            read: false,
            actionUrl: `/tickets/${ticket.id}`,
            actionLabel: 'Ver ticket',
          },
        })
        .catch((err) =>
          console.error('[Request POST] Error creating notification:', err)
        )

      // Award 5 coins for creating request
      await prisma.user
        .update({
          where: { id: session.user.id },
          data: {
            coins: { increment: 5 },
          },
        })
        .catch((err) =>
          console.error('[Request POST] Error awarding coins:', err)
        )

      return NextResponse.json(
        {
          message: 'Ticket creado. Un mediador te atenderá pronto.',
          request: {
            ...newRequest,
            ticket: {
              id: ticket.id,
              ticketNumber: ticket.ticketNumber,
              status: ticket.status,
            },
          },
          autoResolved: false,
          ticketCreated: true,
          ticketNumber: ticket.ticketNumber,
          slaDeadline: slaDeadline.toISOString(),
          coinsEarned: 5,
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      {
        message: 'Petición creada.',
        request: newRequest,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Requests POST] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
