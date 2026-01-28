/**
 * MÓDULO DE SEGURIDAD EMPRESARIAL
 * Sistema completo de seguridad para e-SORI
 *
 * Características:
 * - Rate Limiting avanzado
 * - Password Security & Validation
 * - Audit Logging
 * - IP Tracking & Geolocation
 * - Device Fingerprinting
 * - Security Headers
 */

import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// =====================================================
// CONSTANTES DE SEGURIDAD
// =====================================================

export const SECURITY_CONFIG = {
  // Rate Limiting
  RATE_LIMIT: {
    LOGIN: { max: 5, window: 15 * 60 * 1000 }, // 5 intentos / 15 minutos
    PASSWORD_RESET: { max: 3, window: 60 * 60 * 1000 }, // 3 intentos / hora
    API: { max: 100, window: 60 * 1000 }, // 100 req/min por usuario
    REGISTRATION: { max: 3, window: 60 * 60 * 1000 }, // 3 registros / hora por IP
  },

  // Password Security
  PASSWORD: {
    MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SYMBOL: true,
    HISTORY_SIZE: 5, // No reutilizar últimas 5 contraseñas
    EXPIRATION_DAYS: 90, // Expiración opcional cada 90 días
  },

  // Session Management
  SESSION: {
    MAX_CONCURRENT: 3, // Máximo 3 sesiones simultáneas
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutos inactividad
    ABSOLUTE_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas máximo
  },

  // 2FA
  TWO_FACTOR: {
    TOTP_WINDOW: 1, // 30 segundos ventana
    BACKUP_CODES: 10, // 10 códigos de recuperación
    CODE_LENGTH: 6,
  },

  // Security Headers
  HEADERS: {
    CSP: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.groq.com https://api.resend.com;",
    HSTS: 'max-age=31536000; includeSubDomains; preload',
    X_FRAME: 'DENY',
    X_CONTENT_TYPE: 'nosniff',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
  },
} as const

// =====================================================
// PASSWORD SECURITY
// =====================================================

/**
 * Lista de las 10,000 contraseñas más comunes (top 100 por rendimiento)
 */
const COMMON_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567',
  'password1', '1234567890', 'qwerty', 'abc123', '111111', 'password123',
  '1234', 'qwerty123', '123123', 'welcome', 'monkey', '1q2w3e4r',
  'admin', 'letmein', 'dragon', 'master', 'sunshine', 'princess',
  'azerty', '000000', 'football', 'starwars', 'hello', 'charlie',
  'aa12345678', 'donald', 'password1', 'qwertyuiop',
]

/**
 * Validar fortaleza de contraseña
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number // 0-100
  errors: string[]
  suggestions: string[]
} {
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  // Longitud
  if (password.length < SECURITY_CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`La contraseña debe tener al menos ${SECURITY_CONFIG.PASSWORD.MIN_LENGTH} caracteres`)
  } else if (password.length < 16) {
    suggestions.push('Usa al menos 16 caracteres para mayor seguridad')
    score += Math.min(password.length * 4, 40)
  } else {
    score += 40
  }

  // Mayúsculas
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula')
  } else {
    score += 15
  }

  // Minúsculas
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula')
  } else {
    score += 15
  }

  // Números
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número')
  } else {
    score += 15
  }

  // Símbolos
  if (SECURITY_CONFIG.PASSWORD.REQUIRE_SYMBOL && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Debe contener al menos un símbolo especial (!@#$%^&*)')
  } else {
    score += 15
  }

  // Contraseñas comunes
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Esta contraseña es demasiado común y fácil de adivinar')
    score = Math.min(score, 20)
  }

  // Patrones repetitivos
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Evita caracteres repetidos consecutivos')
    score -= 10
  }

  // Secuencias
  if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789)/i.test(password)) {
    suggestions.push('Evita secuencias obvias (abc, 123, etc.)')
    score -= 10
  }

  // Palabras del diccionario básico
  const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'hello']
  if (commonWords.some(word => password.toLowerCase().includes(word))) {
    suggestions.push('Evita palabras comunes en tu contraseña')
    score -= 15
  }

  score = Math.max(0, Math.min(100, score))

  return {
    isValid: errors.length === 0,
    score,
    errors,
    suggestions,
  }
}

/**
 * Generar contraseña segura
 */
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?'
  const all = uppercase + lowercase + numbers + symbols

  let password = ''

  // Asegurar al menos un carácter de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Rellenar el resto
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  // Mezclar aleatoriamente
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// =====================================================
// RATE LIMITING
// =====================================================

interface RateLimitAttempt {
  timestamp: number
  ip: string
  userId?: string
}

// Cache en memoria (en producción usar Redis)
const rateLimitCache = new Map<string, RateLimitAttempt[]>()

/**
 * Verificar rate limit
 */
export async function checkRateLimit(
  key: string,
  config: { max: number; window: number },
  identifier: { ip: string; userId?: string }
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const now = Date.now()
  const attempts = rateLimitCache.get(key) || []

  // Limpiar intentos antiguos
  const validAttempts = attempts.filter(
    attempt => now - attempt.timestamp < config.window
  )

  // Verificar límite
  const allowed = validAttempts.length < config.max
  const remaining = Math.max(0, config.max - validAttempts.length)
  const resetAt = new Date(
    validAttempts.length > 0
      ? validAttempts[0].timestamp + config.window
      : now + config.window
  )

  // Registrar intento
  if (allowed) {
    validAttempts.push({
      timestamp: now,
      ip: identifier.ip,
      userId: identifier.userId,
    })
    rateLimitCache.set(key, validAttempts)
  }

  return { allowed, remaining, resetAt }
}

/**
 * Rate limit para login
 */
export async function checkLoginRateLimit(
  email: string,
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const key = `login:${email}:${ip}`
  return checkRateLimit(key, SECURITY_CONFIG.RATE_LIMIT.LOGIN, { ip })
}

/**
 * Rate limit para API general
 */
export async function checkAPIRateLimit(
  userId: string,
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const key = `api:${userId}`
  return checkRateLimit(key, SECURITY_CONFIG.RATE_LIMIT.API, { ip, userId })
}

/**
 * Rate limit para registro
 */
export async function checkRegistrationRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const key = `register:${ip}`
  return checkRateLimit(key, SECURITY_CONFIG.RATE_LIMIT.REGISTRATION, { ip })
}

// =====================================================
// AUDIT LOGGING
// =====================================================

export type AuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_SUCCESS'
  | 'EMAIL_CHANGE'
  | 'TWO_FACTOR_ENABLED'
  | 'TWO_FACTOR_DISABLED'
  | 'TWO_FACTOR_VERIFIED'
  | 'TWO_FACTOR_FAILED'
  | 'SESSION_CREATED'
  | 'SESSION_TERMINATED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'PERMISSION_DENIED'
  | 'DATA_EXPORT'
  | 'DATA_DELETION'

export interface AuditLogEntry {
  userId?: string
  email?: string
  eventType: AuditEventType
  ipAddress: string
  userAgent: string
  location?: string
  metadata?: Record<string, any>
  timestamp: Date
}

/**
 * Registrar evento de auditoría
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    // En desarrollo, solo hacer console.log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit]', entry.eventType, {
        userId: entry.userId,
        email: entry.email,
        ip: entry.ipAddress,
        metadata: entry.metadata,
      })
      return
    }

    // En producción, guardar en base de datos
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        email: entry.email,
        eventType: entry.eventType,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        location: entry.location,
        metadata: entry.metadata as any,
        timestamp: entry.timestamp,
      },
    })
  } catch (error) {
    console.error('[Audit] Error logging audit event:', error)
    // No fallar la operación principal por error de logging
  }
}

// =====================================================
// DEVICE FINGERPRINTING
// =====================================================

/**
 * Generar fingerprint del dispositivo
 */
export function generateDeviceFingerprint(userAgent: string, ip: string): string {
  return crypto
    .createHash('sha256')
    .update(`${userAgent}:${ip}`)
    .digest('hex')
    .substring(0, 32)
}

/**
 * Verificar si el dispositivo es reconocido
 */
export async function isKnownDevice(
  userId: string,
  fingerprint: string
): Promise<boolean> {
  try {
    const session = await prisma.session.findFirst({
      where: {
        userId,
        deviceFingerprint: fingerprint,
      },
    })
    return !!session
  } catch (error) {
    console.error('[Security] Error checking device fingerprint:', error)
    return false
  }
}

// =====================================================
// TWO-FACTOR AUTHENTICATION (2FA)
// =====================================================

/**
 * Generar secret para TOTP (Google Authenticator)
 */
export function generateTOTPSecret(): string {
  const buffer = crypto.randomBytes(20)
  return buffer.toString('base64').replace(/[^A-Z2-7]/gi, '').substring(0, 32)
}

/**
 * Generar códigos de recuperación
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

/**
 * Verificar código TOTP
 * (Requiere librería `otplib` - ya instalada en package.json)
 */
export async function verifyTOTPCode(
  secret: string,
  code: string
): Promise<boolean> {
  try {
    const { authenticator } = await import('otplib')
    authenticator.options = {
      window: SECURITY_CONFIG.TWO_FACTOR.TOTP_WINDOW,
    }
    return authenticator.verify({ token: code, secret })
  } catch (error) {
    console.error('[2FA] Error verifying TOTP:', error)
    return false
  }
}

/**
 * Generar QR code para Google Authenticator
 */
export async function generateTOTPQRCode(
  email: string,
  secret: string
): Promise<string> {
  try {
    const { authenticator } = await import('otplib')
    const QRCode = (await import('qrcode')).default

    const otpauthUrl = authenticator.keyuri(
      email,
      'Soriano e-Cliente',
      secret
    )

    return await QRCode.toDataURL(otpauthUrl)
  } catch (error) {
    console.error('[2FA] Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Obtener sesiones activas de un usuario
 */
export async function getActiveSessions(userId: string) {
  try {
    return await prisma.session.findMany({
      where: {
        userId,
        expires: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        deviceFingerprint: true,
        userAgent: true,
        ipAddress: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        expires: true,
      },
    })
  } catch (error) {
    console.error('[Security] Error fetching active sessions:', error)
    return []
  }
}

/**
 * Terminar sesión específica
 */
export async function terminateSession(sessionId: string, userId: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: {
        id: sessionId,
        userId, // Asegurar que solo termine sus propias sesiones
      },
    })

    await logAuditEvent({
      userId,
      eventType: 'SESSION_TERMINATED',
      ipAddress: 'system',
      userAgent: 'system',
      metadata: { sessionId },
      timestamp: new Date(),
    })

    return true
  } catch (error) {
    console.error('[Security] Error terminating session:', error)
    return false
  }
}

/**
 * Terminar todas las sesiones excepto la actual
 */
export async function terminateAllSessionsExceptCurrent(
  userId: string,
  currentSessionId: string
): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        userId,
        id: {
          not: currentSessionId,
        },
      },
    })

    await logAuditEvent({
      userId,
      eventType: 'SESSION_TERMINATED',
      ipAddress: 'system',
      userAgent: 'system',
      metadata: { action: 'terminate_all', count: result.count },
      timestamp: new Date(),
    })

    return result.count
  } catch (error) {
    console.error('[Security] Error terminating sessions:', error)
    return 0
  }
}

/**
 * Limitar sesiones concurrentes
 */
export async function enforceConcurrentSessionLimit(userId: string): Promise<void> {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        expires: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Si hay más sesiones que el límite, eliminar las más antiguas
    if (sessions.length > SECURITY_CONFIG.SESSION.MAX_CONCURRENT) {
      const sessionsToDelete = sessions.slice(SECURITY_CONFIG.SESSION.MAX_CONCURRENT)

      await prisma.session.deleteMany({
        where: {
          id: {
            in: sessionsToDelete.map(s => s.id),
          },
        },
      })

      await logAuditEvent({
        userId,
        eventType: 'SESSION_TERMINATED',
        ipAddress: 'system',
        userAgent: 'system',
        metadata: {
          reason: 'concurrent_limit',
          terminated: sessionsToDelete.length,
        },
        timestamp: new Date(),
      })
    }
  } catch (error) {
    console.error('[Security] Error enforcing concurrent session limit:', error)
  }
}

// =====================================================
// SECURITY HEADERS
// =====================================================

/**
 * Obtener headers de seguridad para respuestas
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': SECURITY_CONFIG.HEADERS.CSP,
    'Strict-Transport-Security': SECURITY_CONFIG.HEADERS.HSTS,
    'X-Frame-Options': SECURITY_CONFIG.HEADERS.X_FRAME,
    'X-Content-Type-Options': SECURITY_CONFIG.HEADERS.X_CONTENT_TYPE,
    'Referrer-Policy': SECURITY_CONFIG.HEADERS.REFERRER_POLICY,
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

// =====================================================
// IP & GEOLOCATION
// =====================================================

/**
 * Extraer IP real del request (considerando proxies)
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-vercel-forwarded-for') || // Vercel
    '0.0.0.0'
  )
}

/**
 * Obtener ubicación aproximada por IP (usando API gratuita)
 */
export async function getLocationByIP(ip: string): Promise<string | null> {
  try {
    // Usar API gratuita de ip-api.com (sin autenticación)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`)
    if (!response.ok) return null

    const data = await response.json()
    return data.city && data.country ? `${data.city}, ${data.country}` : data.country || null
  } catch (error) {
    console.error('[Security] Error fetching location:', error)
    return null
  }
}

// =====================================================
// SUSPICIOUS ACTIVITY DETECTION
// =====================================================

/**
 * Detectar actividad sospechosa
 */
export async function detectSuspiciousActivity(
  userId: string,
  eventType: string,
  metadata: Record<string, any>
): Promise<boolean> {
  try {
    // Obtener eventos recientes del usuario
    const recentEvents = await prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Última hora
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    // Reglas de detección
    let suspicious = false

    // Múltiples fallos de login
    const failedLogins = recentEvents.filter(e => e.eventType === 'LOGIN_FAILURE')
    if (failedLogins.length >= 5) {
      suspicious = true
    }

    // IPs muy diferentes
    const uniqueIPs = new Set(recentEvents.map(e => e.ipAddress))
    if (uniqueIPs.size >= 5) {
      suspicious = true
    }

    // Cambios críticos en sucesión rápida
    const criticalChanges = recentEvents.filter(e =>
      ['PASSWORD_CHANGE', 'EMAIL_CHANGE', 'TWO_FACTOR_DISABLED'].includes(e.eventType)
    )
    if (criticalChanges.length >= 2) {
      suspicious = true
    }

    if (suspicious) {
      await logAuditEvent({
        userId,
        eventType: 'SUSPICIOUS_ACTIVITY',
        ipAddress: metadata.ipAddress || 'unknown',
        userAgent: metadata.userAgent || 'unknown',
        metadata: {
          reason: 'multiple_triggers',
          failedLogins: failedLogins.length,
          uniqueIPs: uniqueIPs.size,
          criticalChanges: criticalChanges.length,
        },
        timestamp: new Date(),
      })
    }

    return suspicious
  } catch (error) {
    console.error('[Security] Error detecting suspicious activity:', error)
    return false
  }
}

// =====================================================
// PASSWORD HISTORY
// =====================================================

/**
 * Verificar si la contraseña ya fue usada antes
 */
export async function isPasswordReused(
  userId: string,
  newPasswordHash: string
): Promise<boolean> {
  try {
    const passwordHistory = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: SECURITY_CONFIG.PASSWORD.HISTORY_SIZE,
    })

    // Comparar con historial
    for (const entry of passwordHistory) {
      if (entry.passwordHash === newPasswordHash) {
        return true
      }
    }

    return false
  } catch (error) {
    console.error('[Security] Error checking password reuse:', error)
    return false
  }
}

/**
 * Guardar contraseña en historial
 */
export async function savePasswordToHistory(
  userId: string,
  passwordHash: string
): Promise<void> {
  try {
    await prisma.passwordHistory.create({
      data: {
        userId,
        passwordHash,
      },
    })

    // Limpiar historial antiguo (mantener solo HISTORY_SIZE)
    const allHistory = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    if (allHistory.length > SECURITY_CONFIG.PASSWORD.HISTORY_SIZE) {
      const toDelete = allHistory.slice(SECURITY_CONFIG.PASSWORD.HISTORY_SIZE)
      await prisma.passwordHistory.deleteMany({
        where: {
          id: {
            in: toDelete.map(h => h.id),
          },
        },
      })
    }
  } catch (error) {
    console.error('[Security] Error saving password to history:', error)
  }
}

// =====================================================
// EXPORTS
// =====================================================

export const Security = {
  // Password
  validatePasswordStrength,
  generateSecurePassword,
  isPasswordReused,
  savePasswordToHistory,

  // Rate Limiting
  checkRateLimit,
  checkLoginRateLimit,
  checkAPIRateLimit,
  checkRegistrationRateLimit,

  // Audit
  logAuditEvent,

  // Device
  generateDeviceFingerprint,
  isKnownDevice,

  // 2FA
  generateTOTPSecret,
  generateBackupCodes,
  verifyTOTPCode,
  generateTOTPQRCode,

  // Session
  getActiveSessions,
  terminateSession,
  terminateAllSessionsExceptCurrent,
  enforceConcurrentSessionLimit,

  // Headers
  getSecurityHeaders,

  // IP & Location
  getClientIP,
  getLocationByIP,

  // Detection
  detectSuspiciousActivity,
}

export default Security
