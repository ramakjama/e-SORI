/**
 * Notification Testing Utilities
 *
 * Helper functions to test the SSE notification system
 * These can be called from browser console or test files
 */

import { notificationService } from './notification-service'

/**
 * Send a test notification of each type
 * Usage: import { testAllNotificationTypes } from '@/lib/notification-test-utils'
 */
export async function testAllNotificationTypes(userId: string = 'demo-user-001') {
  console.log('🧪 Testing all notification types...')

  // Test XP notification
  console.log('📤 Sending XP notification...')
  await notificationService.sendXP(userId, 50, 'Test XP notification')
  await delay(2000)

  // Test Coins notification
  console.log('📤 Sending Coins notification...')
  await notificationService.sendCoins(userId, 100, 'Test Coins notification')
  await delay(2000)

  // Test Level Up notification
  console.log('📤 Sending Level Up notification...')
  await notificationService.sendLevelUp(userId, 'ORO', 'Test Level Up notification')
  await delay(2000)

  // Test Badge notification
  console.log('📤 Sending Badge notification...')
  await notificationService.sendBadge(userId, 'Test Badge', 'You unlocked a test badge!')
  await delay(2000)

  // Test Streak notification
  console.log('📤 Sending Streak notification...')
  await notificationService.sendStreak(userId, 7, 'Test 7-day streak')
  await delay(2000)

  // Test Mission notification
  console.log('📤 Sending Mission notification...')
  await notificationService.sendMission(userId, 'Test Mission', 'Test mission completed')

  console.log('✅ All notification types sent!')
}

/**
 * Send a rapid burst of notifications to test queue handling
 */
export async function testNotificationBurst(userId: string = 'demo-user-001', count: number = 5) {
  console.log(`🧪 Sending burst of ${count} notifications...`)

  const promises = []
  for (let i = 0; i < count; i++) {
    const type: Array<'xp' | 'coins' | 'badge' | 'streak' | 'mission'> = ['xp', 'coins', 'badge', 'streak', 'mission']
    const randomType = type[i % type.length]

    promises.push(
      notificationService.sendToUser(userId, {
        type: randomType,
        title: `Test Notification ${i + 1}`,
        description: `This is test notification number ${i + 1}`,
        value: (i + 1) * 10,
      })
    )
  }

  await Promise.all(promises)
  console.log('✅ Burst complete!')
}

/**
 * Simulate a complete user journey with notifications
 */
export async function testUserJourney(userId: string = 'demo-user-001') {
  console.log('🧪 Simulating user journey...')

  // Step 1: User logs in
  console.log('1️⃣ User logs in - daily streak')
  await notificationService.sendStreak(userId, 5, 'Racha de 5 días consecutivos')
  await delay(2000)

  // Step 2: User completes profile
  console.log('2️⃣ User completes profile - XP reward')
  await notificationService.sendXP(userId, 50, 'Perfil completado al 100%')
  await delay(1500)

  // Step 3: User unlocks badge
  console.log('3️⃣ User unlocks badge')
  await notificationService.sendBadge(userId, 'Perfil Completo', 'Has completado tu perfil')
  await delay(2000)

  // Step 4: User completes mission
  console.log('4️⃣ User completes mission')
  await notificationService.sendMission(userId, 'Explorador', 'Visitaste todas las secciones')
  await delay(1500)

  // Step 5: User earns coins
  console.log('5️⃣ User earns coins from mission')
  await notificationService.sendCoins(userId, 200, 'Recompensa de misión completada')
  await delay(2000)

  // Step 6: User levels up
  console.log('6️⃣ User levels up!')
  await notificationService.sendLevelUp(userId, 'ORO', '¡Felicidades! Has alcanzado el nivel ORO')

  console.log('✅ User journey simulation complete!')
}

/**
 * Test a single notification type
 */
export async function testSingleNotification(
  type: 'xp' | 'coins' | 'level_up' | 'badge' | 'streak' | 'mission',
  userId: string = 'demo-user-001'
) {
  console.log(`🧪 Testing ${type} notification...`)

  const notifications = {
    xp: () => notificationService.sendXP(userId, 42, 'Test XP reward'),
    coins: () => notificationService.sendCoins(userId, 100, 'Test Coins reward'),
    level_up: () => notificationService.sendLevelUp(userId, 'PLATINO', 'Test Level Up'),
    badge: () => notificationService.sendBadge(userId, 'Test Badge', 'Test Badge Description'),
    streak: () => notificationService.sendStreak(userId, 10, 'Test 10-day streak'),
    mission: () => notificationService.sendMission(userId, 'Test Mission', 'Test Mission Description'),
  }

  await notifications[type]()
  console.log(`✅ ${type} notification sent!`)
}

/**
 * Check SSE connection status
 */
export async function checkConnectionStatus(userId: string = 'demo-user-001') {
  console.log('🔍 Checking SSE connection status...')

  try {
    const response = await fetch(`/api/notifications/stream?userId=${userId}`)
    if (response.ok) {
      console.log('✅ SSE endpoint is accessible')
      console.log('Headers:', Object.fromEntries(response.headers.entries()))
    } else {
      console.error('❌ SSE endpoint returned error:', response.status)
    }
  } catch (error) {
    console.error('❌ Failed to connect to SSE endpoint:', error)
  }
}

/**
 * Test notification with custom payload
 */
export async function testCustomNotification(
  userId: string = 'demo-user-001',
  payload: {
    type: 'xp' | 'coins' | 'level_up' | 'badge' | 'streak' | 'mission'
    title: string
    description?: string
    value?: number | string
  }
) {
  console.log('🧪 Sending custom notification...')
  console.log('Payload:', payload)

  await notificationService.sendToUser(userId, payload)
  console.log('✅ Custom notification sent!')
}

// Helper function
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  // Make functions available in browser console
  ;(window as any).notificationTests = {
    testAllNotificationTypes,
    testNotificationBurst,
    testUserJourney,
    testSingleNotification,
    checkConnectionStatus,
    testCustomNotification,
  }

  console.log(
    '💡 Notification test utilities loaded! Use window.notificationTests to access them.'
  )
}
