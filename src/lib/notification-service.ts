/**
 * Notification Service
 * Centralized service to send real-time notifications to users via SSE
 */

export type NotificationType = 'xp' | 'coins' | 'level_up' | 'badge' | 'streak' | 'mission'

export interface NotificationPayload {
  type: NotificationType
  title: string
  description?: string
  value?: number | string
}

/**
 * Send a notification to a specific user
 * This works by making a POST request to the internal API that manages SSE connections
 */
async function sendToUser(userId: string, notification: NotificationPayload): Promise<void> {
  try {
    // In a real implementation, this would trigger the SSE message
    // For now, we'll use a simple fetch to a trigger endpoint
    await fetch('/api/notifications/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        notification,
      }),
    })
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

/**
 * Send XP earned notification
 */
async function sendXP(userId: string, amount: number, description?: string): Promise<void> {
  await sendToUser(userId, {
    type: 'xp',
    title: 'XP Ganado',
    description: description || 'Has ganado puntos de experiencia',
    value: amount,
  })
}

/**
 * Send coins earned notification
 */
async function sendCoins(userId: string, amount: number, description?: string): Promise<void> {
  await sendToUser(userId, {
    type: 'coins',
    title: 'Monedas Ganadas',
    description: description || 'Has ganado monedas',
    value: amount,
  })
}

/**
 * Send level up notification
 */
async function sendLevelUp(userId: string, newLevel: string, description?: string): Promise<void> {
  await sendToUser(userId, {
    type: 'level_up',
    title: 'Nivel Alcanzado',
    description: description || `Has alcanzado el nivel ${newLevel}`,
    value: newLevel,
  })
}

/**
 * Send badge unlocked notification
 */
async function sendBadge(userId: string, badgeName: string, description?: string): Promise<void> {
  await sendToUser(userId, {
    type: 'badge',
    title: 'Insignia Desbloqueada',
    description: description || `Has desbloqueado: ${badgeName}`,
    value: badgeName,
  })
}

/**
 * Send streak notification
 */
async function sendStreak(userId: string, days: number, description?: string): Promise<void> {
  await sendToUser(userId, {
    type: 'streak',
    title: 'Racha Activa',
    description: description || `Racha de ${days} días`,
    value: days,
  })
}

/**
 * Send mission completed notification
 */
async function sendMission(userId: string, missionName: string, description?: string): Promise<void> {
  await sendToUser(userId, {
    type: 'mission',
    title: 'Misión Completada',
    description: description || `Has completado: ${missionName}`,
    value: missionName,
  })
}

export const notificationService = {
  sendToUser,
  sendXP,
  sendCoins,
  sendLevelUp,
  sendBadge,
  sendStreak,
  sendMission,
}
