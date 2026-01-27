# Server-Sent Events (SSE) Real-Time Notifications

This implementation provides real-time notifications for the Soriano eCliente application using Server-Sent Events (SSE).

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Dashboard      │   SSE   │  /api/           │  Store  │  In-Memory      │
│  Layout         │◄────────│  notifications/  │◄────────│  Connections    │
│  (Client)       │         │  stream          │         │  Map            │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            ▲
        │ useNotifications()         │
        │                            │
        ▼                            │
┌─────────────────┐                 │
│ GamificationToast│                 │
│ Component        │                 │
└─────────────────┘                 │
                                    │ sendNotificationToUser()
                                    │
                            ┌──────────────────┐
                            │  notification-   │
                            │  service.ts      │
                            └──────────────────┘
                                    ▲
                                    │
                            Any API/Service that
                            triggers notifications
```

## Files Created

### 1. `/src/app/api/notifications/stream/route.ts`
The main SSE endpoint that:
- Establishes and maintains SSE connections
- Stores active connections in an in-memory Map
- Sends heartbeat every 30 seconds to keep connections alive
- Handles connection cleanup on disconnect

**Endpoint:** `GET /api/notifications/stream?userId=xxx`

**Response Format:**
```
Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
Connection: keep-alive

data: {"type":"xp","title":"XP Ganado","description":"Has ganado puntos","value":50}

data: {"type":"level_up","title":"Nivel Alcanzado","description":"Has alcanzado el nivel ORO","value":"ORO"}
```

### 2. `/src/app/api/notifications/trigger/route.ts`
Internal API endpoint to trigger notifications:
- Accepts POST requests with userId and notification data
- Calls `sendNotificationToUser()` to push to SSE stream

**Endpoint:** `POST /api/notifications/trigger`

**Request Body:**
```json
{
  "userId": "user-123",
  "notification": {
    "type": "xp",
    "title": "XP Ganado",
    "description": "Completaste tu perfil",
    "value": 50
  }
}
```

### 3. `/src/lib/notification-service.ts`
Centralized service to send notifications:

```typescript
import { notificationService } from '@/lib/notification-service'

// Send XP notification
await notificationService.sendXP(userId, 50, 'Profile completed')

// Send coins notification
await notificationService.sendCoins(userId, 100, 'Payment received')

// Send level up notification
await notificationService.sendLevelUp(userId, 'ORO', 'Congratulations!')

// Send badge notification
await notificationService.sendBadge(userId, 'First Steps', 'Badge unlocked')

// Send streak notification
await notificationService.sendStreak(userId, 7, '7 day streak')

// Send mission notification
await notificationService.sendMission(userId, 'Daily Login', 'Mission completed')

// Send custom notification
await notificationService.sendToUser(userId, {
  type: 'badge',
  title: 'Custom Title',
  description: 'Custom description',
  value: 42
})
```

### 4. `/src/hooks/useNotifications.ts`
React hook to consume SSE notifications:

```typescript
import { useNotifications } from '@/hooks/useNotifications'

function MyComponent() {
  const { connected, error, reconnect } = useNotifications({
    userId: 'user-123',
    onNotification: (notification) => {
      console.log('Received:', notification)
      // Show toast, update UI, etc.
    },
    autoReconnect: true,
    reconnectDelay: 3000
  })

  return (
    <div>
      {connected ? '🟢 Connected' : '🔴 Disconnected'}
      {error && <span>Error: {error}</span>}
    </div>
  )
}
```

### 5. `/src/app/(dashboard)/layout.tsx` (Updated)
Integrated notifications into the dashboard layout:
- Automatically connects to SSE stream when user is logged in
- Shows gamification toasts for each notification
- Auto-reconnects on disconnect

## Notification Types

The system supports 6 notification types:

| Type | Icon | Use Case | Example |
|------|------|----------|---------|
| `xp` | ⚡ | User earns experience points | Profile completion, activities |
| `coins` | 💰 | User earns coins/money | Payments, rewards |
| `level_up` | 🏆 | User levels up | Reaching new tier |
| `badge` | 🏅 | User unlocks achievement | Milestones, goals |
| `streak` | 🔥 | User maintains streak | Daily login, activities |
| `mission` | 🎯 | User completes mission | Challenges, tasks |

## Usage Examples

### Example 1: Sending notification when user completes profile
```typescript
// In your API route or server action
import { notificationService } from '@/lib/notification-service'

export async function POST(request: Request) {
  const { userId } = await request.json()

  // Update profile in database
  // ...

  // Send notification
  await notificationService.sendXP(
    userId,
    50,
    'Perfil completado al 100%'
  )

  return Response.json({ success: true })
}
```

### Example 2: Chaining multiple notifications
```typescript
import { notificationService } from '@/lib/notification-service'

async function onMissionCompleted(userId: string, missionName: string) {
  // Mission completion
  await notificationService.sendMission(
    userId,
    missionName,
    'Misión completada exitosamente'
  )

  // Wait for better UX
  await new Promise(resolve => setTimeout(resolve, 1000))

  // XP reward
  await notificationService.sendXP(
    userId,
    100,
    'Recompensa de misión'
  )

  // Check if leveled up
  const newLevel = checkUserLevel(userId)
  if (newLevel) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    await notificationService.sendLevelUp(
      userId,
      newLevel,
      `¡Has alcanzado ${newLevel}!`
    )
  }
}
```

### Example 3: Integration with existing APIs
```typescript
// In your existing API route
import { notificationService } from '@/lib/notification-service'

export async function POST(request: Request) {
  const { userId, action } = await request.json()

  // Your existing logic
  const result = await performAction(action)

  // Send notification based on result
  if (result.success) {
    await notificationService.sendToUser(userId, {
      type: 'badge',
      title: 'Acción completada',
      description: result.message,
      value: result.points
    })
  }

  return Response.json(result)
}
```

## How It Works

1. **Client Connection**: When the dashboard loads, `useNotifications()` hook establishes an SSE connection to `/api/notifications/stream?userId=xxx`

2. **Connection Storage**: The server stores the connection's `ReadableStreamDefaultController` in an in-memory Map with userId as key

3. **Heartbeat**: Every 30 seconds, the server sends a heartbeat comment (`: heartbeat\n\n`) to keep the connection alive

4. **Sending Notifications**:
   - Any service calls `notificationService.sendXP()` or similar
   - This makes a POST to `/api/notifications/trigger`
   - The trigger endpoint calls `sendNotificationToUser(userId, notification)`
   - The notification is pushed through the stored controller to the SSE stream
   - Client receives the event and displays a GamificationToast

5. **Auto-Reconnect**: If connection drops, the client automatically reconnects after 3 seconds (configurable)

## Connection Management

- **In-Memory Storage**: Connections are stored in a Map. Note: This means connections are lost on server restart or in serverless environments with multiple instances.
- **Cleanup**: Connections are automatically cleaned up when:
  - Client disconnects
  - Connection errors occur
  - Request is aborted

## Production Considerations

For production deployments, consider:

1. **Redis or External Store**: Replace in-memory Map with Redis to support multiple server instances
2. **Database Fallback**: Store notifications in database so users can see missed notifications
3. **Rate Limiting**: Implement rate limits to prevent notification spam
4. **Authentication**: Add authentication middleware to verify userId
5. **Monitoring**: Add logging and metrics to track connection health

## Testing

Test the SSE implementation:

```typescript
// Open browser console on any dashboard page
// The connection status is logged automatically

// To manually trigger a test notification:
await fetch('/api/notifications/trigger', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'demo-user-001', // or your user ID
    notification: {
      type: 'xp',
      title: 'Test Notification',
      description: 'This is a test',
      value: 42
    }
  })
})
```

## Troubleshooting

### Notifications not appearing
- Check browser console for connection errors
- Verify userId matches between connection and trigger
- Check network tab for SSE connection (should be persistent)

### Connection keeps disconnecting
- Check server logs for errors
- Verify heartbeat is being sent every 30s
- Check for proxy/load balancer timeouts

### Multiple toasts for same notification
- Ensure notification service is only called once
- Check for duplicate event listeners
- Verify toast deduplication logic

## Future Enhancements

- [ ] Notification history/persistence
- [ ] Notification preferences (mute certain types)
- [ ] Sound effects for notifications
- [ ] Push notifications (web push API)
- [ ] Notification queue/batching
- [ ] Admin panel to send broadcasts
