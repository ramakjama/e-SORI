/**
 * Notification Service Usage Examples
 *
 * This file demonstrates how to use the notification service
 * to send real-time notifications to users
 */

import { notificationService } from './notification-service'

/**
 * Example 1: Send XP notification when user completes a profile
 */
export async function onProfileCompleted(userId: string) {
  await notificationService.sendXP(
    userId,
    50,
    'Perfil completado al 100%'
  )
}

/**
 * Example 2: Send coins notification when user makes a payment
 */
export async function onPaymentMade(userId: string, amount: number) {
  await notificationService.sendCoins(
    userId,
    amount,
    'Pago puntual de tu póliza'
  )
}

/**
 * Example 3: Send level up notification
 */
export async function onLevelUp(userId: string, newLevel: string) {
  await notificationService.sendLevelUp(
    userId,
    newLevel,
    `¡Felicidades! Has alcanzado el nivel ${newLevel}`
  )
}

/**
 * Example 4: Send badge unlocked notification
 */
export async function onBadgeUnlocked(userId: string, badgeName: string) {
  await notificationService.sendBadge(
    userId,
    badgeName,
    `Nueva insignia desbloqueada: ${badgeName}`
  )
}

/**
 * Example 5: Send streak notification
 */
export async function onStreakAchieved(userId: string, days: number) {
  await notificationService.sendStreak(
    userId,
    days,
    `¡Increíble! ${days} días consecutivos`
  )
}

/**
 * Example 6: Send mission completed notification
 */
export async function onMissionCompleted(userId: string, missionName: string, reward: number) {
  await notificationService.sendMission(
    userId,
    missionName,
    `Has ganado ${reward} puntos`
  )
}

/**
 * Example 7: Send custom notification
 */
export async function sendCustomNotification(userId: string) {
  await notificationService.sendToUser(userId, {
    type: 'badge',
    title: 'Notificación Personalizada',
    description: 'Este es un mensaje personalizado',
    value: '⭐',
  })
}

/**
 * Example 8: Chain multiple notifications (e.g., mission completion + XP + level up)
 */
export async function onMissionCompletedWithRewards(
  userId: string,
  missionName: string,
  xpReward: number,
  newLevel?: string
) {
  // Send mission completion
  await notificationService.sendMission(
    userId,
    missionName,
    'Misión completada exitosamente'
  )

  // Wait a bit for better UX
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Send XP reward
  await notificationService.sendXP(
    userId,
    xpReward,
    `Has ganado ${xpReward} puntos de experiencia`
  )

  // If level up, send level up notification
  if (newLevel) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    await notificationService.sendLevelUp(
      userId,
      newLevel,
      `¡Increíble! Has alcanzado el nivel ${newLevel}`
    )
  }
}
