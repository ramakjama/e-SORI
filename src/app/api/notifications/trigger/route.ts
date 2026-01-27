import { NextRequest, NextResponse } from 'next/server'
import { sendNotificationToUser } from '../stream/route'

/**
 * POST /api/notifications/trigger
 * Internal endpoint to trigger SSE notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notification } = body

    if (!userId || !notification) {
      return NextResponse.json(
        { error: 'Missing userId or notification' },
        { status: 400 }
      )
    }

    // Validate notification structure
    if (!notification.type || !notification.title) {
      return NextResponse.json(
        { error: 'Invalid notification format' },
        { status: 400 }
      )
    }

    // Send notification via SSE
    sendNotificationToUser(userId, notification)

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
    })
  } catch (error) {
    console.error('Trigger notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
