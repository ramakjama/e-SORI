import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

interface AnalyticsEventPayload {
  category: string
  action: string
  label?: string
  value?: number
  userId?: string
  metadata?: Record<string, any>
  timestamp?: string
}

interface TrackRequest {
  events?: AnalyticsEventPayload[]
  event?: AnalyticsEventPayload
}

// ============================================
// POST - Track Analytics Events
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get session for user context
    const session = await getServerSession(authOptions)

    // Parse request body
    let body: TrackRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      )
    }

    // Support both single event and batch events
    const events = body.events || (body.event ? [body.event] : [])

    if (events.length === 0) {
      return NextResponse.json(
        { error: 'No events to track.' },
        { status: 400 }
      )
    }

    // Validate events
    for (const event of events) {
      if (!event.category || !event.action) {
        return NextResponse.json(
          { error: 'Each event must have category and action.' },
          { status: 400 }
        )
      }

      // Validate category length
      if (event.category.length > 100) {
        return NextResponse.json(
          { error: 'Category too long (max 100 characters).' },
          { status: 400 }
        )
      }

      // Validate action length
      if (event.action.length > 100) {
        return NextResponse.json(
          { error: 'Action too long (max 100 characters).' },
          { status: 400 }
        )
      }
    }

    // Prepare events for database
    const eventsToCreate = events.map(event => ({
      userId: event.userId || session?.user?.id || null,
      eventType: 'TRACK', // Generic event type
      category: event.category,
      action: event.action,
      label: event.label || null,
      value: event.value || null,
      metadata: event.metadata || null,
      sessionId: null, // Could be enhanced with session tracking
      createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
    }))

    // Batch insert events
    await prisma.analyticsEvent.createMany({
      data: eventsToCreate,
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      message: `${events.length} event(s) tracked successfully.`,
      count: events.length,
    })
  } catch (error) {
    console.error('[Analytics Track] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

// ============================================
// GET - Get User's Analytics Events (optional)
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get session for user context
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (category) {
      where.category = category
    }

    // Fetch user's recent events
    const events = await prisma.analyticsEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 100), // Max 100 events
      select: {
        id: true,
        category: true,
        action: true,
        label: true,
        value: true,
        metadata: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      events,
      count: events.length,
    })
  } catch (error) {
    console.error('[Analytics Track GET] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
