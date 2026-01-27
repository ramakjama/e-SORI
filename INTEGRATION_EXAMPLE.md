# Integration Example: Adding SSE Notifications to Existing APIs

This document shows how to integrate the SSE notification system with your existing API endpoints.

## Example 1: User Points API with Notifications

Here's how to enhance the existing `/api/user` POST endpoint to send real-time notifications:

### Before (existing code)
```typescript
// src/app/api/user/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, points } = body

    if (!userId || !action || !points) {
      return NextResponse.json({ error: 'userId, action y points son requeridos' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      newPoints: 750 + points,
      levelUp: null,
    })
  } catch (error) {
    console.error('Add Points API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
```

### After (with SSE notifications)
```typescript
// src/app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, points } = body

    if (!userId || !action || !points) {
      return NextResponse.json({ error: 'userId, action y points son requeridos' }, { status: 400 })
    }

    // Your existing logic
    const currentPoints = 750 // In real app, fetch from database
    const newPoints = currentPoints + points

    // Check if user leveled up
    const oldLevel = calculateLevel(currentPoints)
    const newLevel = calculateLevel(newPoints)
    const leveledUp = oldLevel !== newLevel

    // Send real-time XP notification
    await notificationService.sendXP(
      userId,
      points,
      `Acción: ${action}`
    )

    // If leveled up, send level up notification
    if (leveledUp) {
      // Delay slightly for better UX
      setTimeout(async () => {
        await notificationService.sendLevelUp(
          userId,
          newLevel,
          `¡Felicidades! Has alcanzado el nivel ${newLevel}`
        )
      }, 1500)
    }

    return NextResponse.json({
      success: true,
      newPoints,
      levelUp: leveledUp ? newLevel : null,
    })
  } catch (error) {
    console.error('Add Points API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

function calculateLevel(points: number): string {
  if (points >= 5000) return 'PLATINO'
  if (points >= 2500) return 'ORO'
  if (points >= 1000) return 'PLATA'
  return 'BRONCE'
}
```

## Example 2: Mission Completion API

```typescript
// src/app/api/gamification/missions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, missionId } = body

    // Your existing logic to complete mission
    const mission = await getMissionById(missionId)
    const completed = await completeMission(userId, missionId)

    if (completed) {
      // Send mission completion notification
      await notificationService.sendMission(
        userId,
        mission.name,
        mission.description
      )

      // Award XP
      if (mission.xpReward > 0) {
        setTimeout(async () => {
          await notificationService.sendXP(
            userId,
            mission.xpReward,
            `Recompensa de misión: ${mission.name}`
          )
        }, 1000)
      }

      // Award coins
      if (mission.coinReward > 0) {
        setTimeout(async () => {
          await notificationService.sendCoins(
            userId,
            mission.coinReward,
            `Recompensa de misión: ${mission.name}`
          )
        }, 2000)
      }

      // Check for badge unlock
      const unlockedBadges = await checkBadgeUnlocks(userId)
      if (unlockedBadges.length > 0) {
        setTimeout(async () => {
          for (const badge of unlockedBadges) {
            await notificationService.sendBadge(
              userId,
              badge.name,
              badge.description
            )
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }, 3000)
      }
    }

    return NextResponse.json({
      success: true,
      mission,
      rewards: {
        xp: mission.xpReward,
        coins: mission.coinReward,
      },
    })
  } catch (error) {
    console.error('Mission API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
```

## Example 3: Daily Login Streak

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Your existing authentication logic
    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Check and update login streak
    const streakData = await updateLoginStreak(user.id)

    // Send streak notification if streak is active
    if (streakData.currentStreak > 0) {
      setTimeout(async () => {
        await notificationService.sendStreak(
          user.id,
          streakData.currentStreak,
          `¡${streakData.currentStreak} días consecutivos!`
        )
      }, 2000) // Delay to show after login animation
    }

    // Award daily login XP
    if (streakData.earnedXP > 0) {
      setTimeout(async () => {
        await notificationService.sendXP(
          user.id,
          streakData.earnedXP,
          'Bono de inicio de sesión diario'
        )
      }, 3500)
    }

    return NextResponse.json({
      success: true,
      user,
      streak: streakData,
    })
  } catch (error) {
    console.error('Login API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
```

## Example 4: Payment Completion

```typescript
// src/app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, policyId, amount } = body

    // Process payment
    const payment = await processPayment(userId, policyId, amount)

    if (payment.success) {
      // Calculate coins reward (e.g., 1% of payment)
      const coinsReward = Math.floor(amount * 0.01)

      // Send coins notification
      await notificationService.sendCoins(
        userId,
        coinsReward,
        'Pago puntual de tu póliza'
      )

      // Check if this is a streak of on-time payments
      const paymentStreak = await getPaymentStreak(userId)
      if (paymentStreak >= 3) {
        setTimeout(async () => {
          await notificationService.sendBadge(
            userId,
            'Pagador Puntual',
            `${paymentStreak} pagos consecutivos a tiempo`
          )
        }, 1500)
      }
    }

    return NextResponse.json({
      success: payment.success,
      payment,
      coinsEarned: coinsReward,
    })
  } catch (error) {
    console.error('Payment API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
```

## Example 5: Profile Completion

```typescript
// src/app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { notificationService } from '@/lib/notification-service'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updates } = body

    // Update profile
    const updatedProfile = await updateUserProfile(userId, updates)

    // Calculate profile completion percentage
    const completionBefore = await getProfileCompletion(userId)
    await applyProfileUpdates(userId, updates)
    const completionAfter = await getProfileCompletion(userId)

    // If profile just became 100% complete
    if (completionBefore < 100 && completionAfter === 100) {
      // Award XP
      await notificationService.sendXP(
        userId,
        50,
        'Perfil completado al 100%'
      )

      // Unlock badge
      setTimeout(async () => {
        await notificationService.sendBadge(
          userId,
          'Perfil Completo',
          'Has completado toda tu información de perfil'
        )
      }, 1500)
    }
    // If profile completion increased significantly
    else if (completionAfter - completionBefore >= 20) {
      await notificationService.sendXP(
        userId,
        10,
        `Perfil actualizado: ${completionAfter}% completo`
      )
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      completion: completionAfter,
    })
  } catch (error) {
    console.error('Profile Update API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
```

## Best Practices

### 1. Use Delays for Better UX
Space out multiple notifications to avoid overwhelming users:

```typescript
// Send first notification
await notificationService.sendMission(userId, 'Mission Name', 'Description')

// Wait 1.5 seconds
await new Promise(resolve => setTimeout(resolve, 1500))

// Send second notification
await notificationService.sendXP(userId, 100, 'Reward')
```

### 2. Order Notifications Logically
Send notifications in order of importance:
1. Primary achievement (mission, streak, etc.)
2. XP rewards
3. Coin rewards
4. Level up
5. Badges

### 3. Don't Send Redundant Notifications
Check if user already has a badge before sending notification:

```typescript
const hasBadge = await userHasBadge(userId, badgeId)
if (!hasBadge) {
  await unlockBadge(userId, badgeId)
  await notificationService.sendBadge(userId, badge.name, badge.description)
}
```

### 4. Handle Errors Gracefully
Don't let notification errors break your main flow:

```typescript
try {
  await notificationService.sendXP(userId, points, description)
} catch (error) {
  console.error('Failed to send notification:', error)
  // Continue with main flow - notification failure shouldn't break API
}
```

### 5. Use Descriptive Messages
Make notifications clear and actionable:

```typescript
// Good
await notificationService.sendXP(userId, 50, 'Perfil completado al 100%')

// Bad
await notificationService.sendXP(userId, 50, 'Acción completada')
```

## Testing Integration

After integrating notifications, test with:

```javascript
// In browser console
await fetch('/api/user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'demo-user-001',
    action: 'PROFILE_COMPLETE',
    points: 50
  })
})

// You should see a notification toast appear in the dashboard
```
