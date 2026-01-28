/**
 * Auth Helpers - Funciones auxiliares para trabajar con autenticación
 *
 * Este archivo contiene helpers útiles para:
 * - Verificación de permisos
 * - Formateo de datos de usuario
 * - Cálculos de nivel/XP
 * - Validaciones de sesión
 */

import { UserRole, UserLevel } from '@prisma/client'
import type { AuthUser } from './auth'

// =====================================================
// ROLE & PERMISSIONS HELPERS
// =====================================================

/**
 * Jerarquía de roles para comparaciones
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  CLIENTE: 1,
  EMPLEADO: 2,
  ADMIN: 3,
}

/**
 * Verifica si un rol tiene permisos suficientes
 *
 * @example
 * hasRolePermission('EMPLEADO', 'CLIENTE') // true
 * hasRolePermission('CLIENTE', 'ADMIN') // false
 */
export function hasRolePermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Obtiene el nivel de jerarquía de un rol
 */
export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY[role]
}

/**
 * Lista de permisos por rol
 */
export const PERMISSIONS = {
  // Usuarios
  VIEW_ALL_USERS: ['ADMIN', 'EMPLEADO'] as UserRole[],
  EDIT_ANY_USER: ['ADMIN'] as UserRole[],
  DELETE_USER: ['ADMIN'] as UserRole[],

  // Pólizas
  VIEW_ALL_POLICIES: ['ADMIN', 'EMPLEADO'] as UserRole[],
  MANAGE_POLICIES: ['ADMIN', 'EMPLEADO'] as UserRole[],

  // Siniestros
  VIEW_ALL_CLAIMS: ['ADMIN', 'EMPLEADO'] as UserRole[],
  MANAGE_CLAIMS: ['ADMIN', 'EMPLEADO'] as UserRole[],
  ASSIGN_CLAIMS: ['ADMIN', 'EMPLEADO'] as UserRole[],

  // Sistema
  SYSTEM_SETTINGS: ['ADMIN'] as UserRole[],
  VIEW_ANALYTICS: ['ADMIN', 'EMPLEADO'] as UserRole[],
  MANAGE_GAMIFICATION: ['ADMIN'] as UserRole[],
} as const

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(
  userRole: UserRole,
  permission: keyof typeof PERMISSIONS
): boolean {
  return PERMISSIONS[permission].includes(userRole)
}

// =====================================================
// USER LEVEL & XP HELPERS
// =====================================================

/**
 * Umbrales de XP para cada nivel
 */
export const LEVEL_THRESHOLDS: Record<UserLevel, { min: number; max: number }> = {
  BRONCE: { min: 0, max: 999 },
  PLATA: { min: 1000, max: 4999 },
  ORO: { min: 5000, max: 14999 },
  PLATINO: { min: 15000, max: Infinity },
}

/**
 * Calcula el nivel basado en XP
 */
export function calculateLevel(xp: number): UserLevel {
  if (xp >= LEVEL_THRESHOLDS.PLATINO.min) return 'PLATINO'
  if (xp >= LEVEL_THRESHOLDS.ORO.min) return 'ORO'
  if (xp >= LEVEL_THRESHOLDS.PLATA.min) return 'PLATA'
  return 'BRONCE'
}

/**
 * Calcula el progreso hacia el siguiente nivel (0-100)
 */
export function calculateLevelProgress(xp: number, currentLevel: UserLevel): number {
  const { min, max } = LEVEL_THRESHOLDS[currentLevel]

  if (max === Infinity) return 100 // Nivel máximo alcanzado

  const progress = ((xp - min) / (max - min)) * 100
  return Math.min(Math.max(progress, 0), 100)
}

/**
 * Obtiene el siguiente nivel
 */
export function getNextLevel(currentLevel: UserLevel): UserLevel | null {
  const levels: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
  const currentIndex = levels.indexOf(currentLevel)

  if (currentIndex === levels.length - 1) return null // Ya está en el nivel máximo

  return levels[currentIndex + 1]
}

/**
 * Calcula XP necesario para el siguiente nivel
 */
export function getXPForNextLevel(xp: number, currentLevel: UserLevel): number {
  const nextLevel = getNextLevel(currentLevel)
  if (!nextLevel) return 0 // Ya está en el nivel máximo

  const nextThreshold = LEVEL_THRESHOLDS[nextLevel].min
  return Math.max(0, nextThreshold - xp)
}

// =====================================================
// USER DATA FORMATTING
// =====================================================

/**
 * Formatea el nombre del usuario para mostrar
 */
export function formatUserName(user: AuthUser | null | undefined): string {
  if (!user) return 'Usuario'
  return user.name || user.email.split('@')[0] || 'Usuario'
}

/**
 * Obtiene las iniciales del usuario
 */
export function getUserInitials(user: AuthUser | null | undefined): string {
  if (!user) return 'U'

  const name = user.name || user.email
  const parts = name.split(' ')

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
}

/**
 * Obtiene el color del nivel
 */
export function getLevelColor(level: UserLevel): string {
  const colors: Record<UserLevel, string> = {
    BRONCE: '#CD7F32',
    PLATA: '#C0C0C0',
    ORO: '#FFD700',
    PLATINO: '#E5E4E2',
  }
  return colors[level]
}

/**
 * Obtiene el icono del rol
 */
export function getRoleIcon(role: UserRole): string {
  const icons: Record<UserRole, string> = {
    CLIENTE: '👤',
    EMPLEADO: '👔',
    ADMIN: '👑',
  }
  return icons[role]
}

/**
 * Obtiene la etiqueta del rol en español
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    CLIENTE: 'Cliente',
    EMPLEADO: 'Empleado',
    ADMIN: 'Administrador',
  }
  return labels[role]
}

// =====================================================
// VALIDATION HELPERS
// =====================================================

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida si una contraseña es segura
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Obtiene mensajes de error de validación de contraseña
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe tener al menos una letra mayúscula')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Debe tener al menos una letra minúscula')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe tener al menos un número')
  }

  return errors
}

// =====================================================
// SESSION HELPERS
// =====================================================

/**
 * Verifica si la sesión está próxima a expirar (menos de 1 día)
 */
export function isSessionExpiringSoon(lastVerified: number | undefined): boolean {
  if (!lastVerified) return false

  const oneDayInMs = 24 * 60 * 60 * 1000
  const timeSinceVerified = Date.now() - lastVerified
  const sessionMaxAge = 30 * 24 * 60 * 60 * 1000 // 30 días

  return sessionMaxAge - timeSinceVerified < oneDayInMs
}

/**
 * Calcula días hasta que expire la sesión
 */
export function getDaysUntilSessionExpires(lastVerified: number | undefined): number {
  if (!lastVerified) return 0

  const sessionMaxAge = 30 * 24 * 60 * 60 * 1000 // 30 días
  const timeSinceVerified = Date.now() - lastVerified
  const timeUntilExpiry = sessionMaxAge - timeSinceVerified

  return Math.max(0, Math.ceil(timeUntilExpiry / (24 * 60 * 60 * 1000)))
}

// =====================================================
// GAMIFICATION HELPERS
// =====================================================

/**
 * Formatea números grandes (1000 -> 1K, 1000000 -> 1M)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Obtiene el mensaje de felicitación por nivel
 */
export function getLevelUpMessage(newLevel: UserLevel): string {
  const messages: Record<UserLevel, string> = {
    BRONCE: '¡Bienvenido al nivel Bronce!',
    PLATA: '¡Felicidades! Has alcanzado el nivel Plata 🥈',
    ORO: '¡Increíble! Has alcanzado el nivel Oro 🥇',
    PLATINO: '¡Eres una leyenda! Has alcanzado el nivel Platino 💎',
  }
  return messages[newLevel]
}

/**
 * Calcula el multiplicador de recompensas por nivel
 */
export function getLevelMultiplier(level: UserLevel): number {
  const multipliers: Record<UserLevel, number> = {
    BRONCE: 1,
    PLATA: 1.25,
    ORO: 1.5,
    PLATINO: 2,
  }
  return multipliers[level]
}

// =====================================================
// EXPORT TYPES
// =====================================================

export type Permission = keyof typeof PERMISSIONS
