'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { GamificationToastType } from '@/components/gamification/GamificationToast'

export interface NotificationMessage {
  type: GamificationToastType
  title: string
  description?: string
  value?: number | string
}

interface UseNotificationsOptions {
  userId: string
  onNotification?: (notification: NotificationMessage) => void
  autoReconnect?: boolean
  reconnectDelay?: number
}

interface UseNotificationsReturn {
  connected: boolean
  error: string | null
  reconnect: () => void
}

/**
 * React hook to connect to SSE notification stream
 * Automatically handles reconnection on disconnect
 */
export function useNotifications({
  userId,
  onNotification,
  autoReconnect = true,
  reconnectDelay = 3000,
}: UseNotificationsOptions): UseNotificationsReturn {
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  const connect = useCallback(() => {
    if (!userId || !mountedRef.current) return

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      // Create new EventSource connection
      const eventSource = new EventSource(`/api/notifications/stream?userId=${encodeURIComponent(userId)}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        if (mountedRef.current) {
          setConnected(true)
          setError(null)
        }
      }

      eventSource.onmessage = (event) => {
        if (!mountedRef.current) return

        try {
          const data = JSON.parse(event.data)

          // Ignore connection and heartbeat messages
          if (data.type === 'connected') {
            return
          }

          // Call notification handler
          if (onNotification && data.type) {
            onNotification(data as NotificationMessage)
          }
        } catch (parseError) {
          console.error('Error parsing SSE message:', parseError)
        }
      }

      eventSource.onerror = (err) => {
        console.error('SSE connection error:', err)

        if (!mountedRef.current) return

        setConnected(false)
        setError('Connection lost')

        // Close the failed connection
        eventSource.close()

        // Auto-reconnect if enabled
        if (autoReconnect && mountedRef.current) {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect()
            }
          }, reconnectDelay)
        }
      }
    } catch (err) {
      console.error('Error creating EventSource:', err)
      setError('Failed to connect')
      setConnected(false)
    }
  }, [userId, onNotification, autoReconnect, reconnectDelay])

  const reconnect = useCallback(() => {
    connect()
  }, [connect])

  // Initial connection
  useEffect(() => {
    mountedRef.current = true
    connect()

    // Cleanup on unmount
    return () => {
      mountedRef.current = false

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [connect])

  return {
    connected,
    error,
    reconnect,
  }
}
