import { NextRequest } from 'next/server'

// Store active connections: userId -> ReadableStreamDefaultController
const connections = new Map<string, ReadableStreamDefaultController>()

// Heartbeat interval in milliseconds
const HEARTBEAT_INTERVAL = 30000

/**
 * SSE endpoint for real-time notifications
 * GET /api/notifications/stream?userId=xxx
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return new Response('Missing userId parameter', { status: 400 })
  }

  // Create a new ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Store connection
      connections.set(userId, controller)

      // Send initial connection message
      const encoder = new TextEncoder()
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to notification stream' })}\n\n`)
      )

      // Set up heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch (error) {
          // Connection closed, clean up
          clearInterval(heartbeatInterval)
          connections.delete(userId)
        }
      }, HEARTBEAT_INTERVAL)

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        connections.delete(userId)
        try {
          controller.close()
        } catch (e) {
          // Controller already closed
        }
      })
    },
    cancel() {
      // Clean up when client disconnects
      connections.delete(userId)
    },
  })

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}

/**
 * Send notification to a specific user
 * This function is called by the notification service
 */
export function sendNotificationToUser(
  userId: string,
  notification: {
    type: 'xp' | 'coins' | 'level_up' | 'badge' | 'streak' | 'mission'
    title: string
    description?: string
    value?: number | string
  }
) {
  const controller = connections.get(userId)
  if (controller) {
    try {
      const encoder = new TextEncoder()
      const data = JSON.stringify(notification)
      controller.enqueue(encoder.encode(`data: ${data}\n\n`))
    } catch (error) {
      console.error(`Error sending notification to user ${userId}:`, error)
      // Remove dead connection
      connections.delete(userId)
    }
  }
}

/**
 * Get number of active connections
 */
export function getActiveConnectionsCount(): number {
  return connections.size
}

/**
 * Get list of connected user IDs
 */
export function getConnectedUserIds(): string[] {
  return Array.from(connections.keys())
}
