/**
 * Rate Limiting Utility - Seguridad e-SORI
 *
 * Implementa rate limiting en memoria para desarrollo y produccion ligera.
 * Para produccion a gran escala, considerar usar Redis.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Map en memoria para almacenar los contadores de rate limit
const rateLimitMap = new Map<string, RateLimitEntry>()

// Limpiar entradas expiradas periodicamente (cada 5 minutos)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now >= entry.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  retryAfter?: number
}

/**
 * Verifica y aplica rate limiting para una clave dada
 *
 * @param key - Identificador unico (ej: IP, userId, endpoint:userId)
 * @param limit - Numero maximo de requests permitidos en la ventana
 * @param windowMs - Ventana de tiempo en milisegundos
 * @returns Resultado indicando si se permite la request
 *
 * @example
 * // Limitar a 10 requests por minuto por IP
 * const result = rateLimit(req.ip, 10, 60000)
 * if (!result.success) {
 *   return res.status(429).json({ error: 'Too many requests' })
 * }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  // Si no hay entrada o la ventana expiro, crear nueva
  if (!entry || now >= entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitMap.set(key, newEntry)

    return {
      success: true,
      remaining: limit - 1,
      resetTime: newEntry.resetTime,
    }
  }

  // Incrementar contador
  entry.count++

  // Verificar si se excedio el limite
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    }
  }

  return {
    success: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Configuraciones predefinidas de rate limiting por tipo de endpoint
 */
export const rateLimitConfigs = {
  // Login: 5 intentos por 15 minutos
  login: {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  },

  // Registro: 3 intentos por hora
  register: {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  },

  // Reset password: 3 intentos por hora
  passwordReset: {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  },

  // Chat API: 30 mensajes por minuto
  chat: {
    limit: 30,
    windowMs: 60 * 1000,
  },

  // API general: 100 requests por minuto
  api: {
    limit: 100,
    windowMs: 60 * 1000,
  },

  // Envio de formularios: 10 por hora
  formSubmit: {
    limit: 10,
    windowMs: 60 * 60 * 1000,
  },

  // Creacion de siniestros: 5 por dia
  createClaim: {
    limit: 5,
    windowMs: 24 * 60 * 60 * 1000,
  },

  // Descarga de documentos: 50 por hora
  documentDownload: {
    limit: 50,
    windowMs: 60 * 60 * 1000,
  },
} as const

/**
 * Helper para aplicar rate limiting con configuracion predefinida
 */
export function applyRateLimit(
  key: string,
  configName: keyof typeof rateLimitConfigs
): RateLimitResult {
  const config = rateLimitConfigs[configName]
  return rateLimit(key, config.limit, config.windowMs)
}

/**
 * Genera una clave de rate limit combinando multiples identificadores
 * Util para rate limiting por endpoint + usuario
 *
 * @example
 * const key = createRateLimitKey('login', userId, ip)
 * // Resultado: "login:user123:192.168.1.1"
 */
export function createRateLimitKey(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(':')
}

/**
 * Rate limiter para usar como middleware en API routes
 */
export function createRateLimiter(
  config: { limit: number; windowMs: number },
  keyGenerator: (req: Request) => string
) {
  return async (req: Request): Promise<RateLimitResult & { headers: Record<string, string> }> => {
    const key = keyGenerator(req)
    const result = rateLimit(key, config.limit, config.windowMs)

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': config.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.resetTime.toString(),
    }

    if (!result.success && result.retryAfter) {
      headers['Retry-After'] = result.retryAfter.toString()
    }

    return { ...result, headers }
  }
}

/**
 * Extrae la IP del request (compatible con Next.js)
 */
export function getClientIP(req: Request, headers?: Headers): string {
  const h = headers || req.headers

  // Cloudflare
  const cfConnectingIP = h instanceof Headers ? h.get('cf-connecting-ip') : undefined
  if (cfConnectingIP) return cfConnectingIP

  // Standard proxy headers
  const forwardedFor = h instanceof Headers ? h.get('x-forwarded-for') : undefined
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIP = h instanceof Headers ? h.get('x-real-ip') : undefined
  if (realIP) return realIP

  // Fallback
  return 'unknown'
}

/**
 * Respuesta estandar para rate limit excedido
 */
export function rateLimitExceededResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Demasiadas solicitudes. Por favor, intenta de nuevo mas tarde.',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': result.retryAfter?.toString() || '60',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': result.resetTime.toString(),
      },
    }
  )
}
