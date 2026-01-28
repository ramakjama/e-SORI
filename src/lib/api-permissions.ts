/**
 * Middleware y helpers para validar permisos en API routes
 *
 * IMPORTANTE: NUNCA confíes solo en validaciones del frontend.
 * Siempre valida permisos en el backend.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { hasPermission, Feature, UserLevel } from '@/lib/permissions'
import { UserRole } from '@prisma/client'

/**
 * Tipo para la sesión extendida con datos del usuario
 */
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    level: UserLevel
    points: number
    xp: number
    coins: number
    shields: number
  }
}

/**
 * Obtiene la sesión actual y valida que el usuario esté autenticado
 *
 * @returns Sesión del usuario o error 401
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ session: AuthSession } | NextResponse> {
  const session = (await getServerSession(authOptions)) as AuthSession | null

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'No autenticado', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }

  return { session }
}

/**
 * Valida que el usuario tenga un permiso específico
 *
 * @returns true si tiene permiso, NextResponse con error 403 si no
 */
export async function requirePermission(
  req: NextRequest,
  feature: Feature
): Promise<{ session: AuthSession } | NextResponse> {
  const authResult = await requireAuth(req)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { session } = authResult
  const userLevel = session.user.level

  if (!hasPermission(userLevel, feature)) {
    return NextResponse.json(
      {
        error: 'No tienes acceso a esta funcionalidad',
        code: 'FORBIDDEN',
        required_feature: feature,
        your_level: userLevel,
      },
      { status: 403 }
    )
  }

  return { session }
}

/**
 * Valida que el usuario tenga un rol específico
 */
export async function requireRole(
  req: NextRequest,
  requiredRole: UserRole | UserRole[]
): Promise<{ session: AuthSession } | NextResponse> {
  const authResult = await requireAuth(req)

  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { session } = authResult
  const userRole = session.user.role

  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  if (!allowedRoles.includes(userRole)) {
    return NextResponse.json(
      {
        error: 'No tienes permisos para realizar esta acción',
        code: 'INSUFFICIENT_ROLE',
        required_role: allowedRoles,
        your_role: userRole,
      },
      { status: 403 }
    )
  }

  return { session }
}

/**
 * Helper para crear respuestas estandarizadas
 */
export const ApiResponse = {
  /**
   * Respuesta de éxito
   */
  success<T>(data: T, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    )
  },

  /**
   * Respuesta de error
   */
  error(message: string, code: string, status = 400) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code,
      },
      { status }
    )
  },

  /**
   * No autenticado
   */
  unauthorized(message = 'Debes iniciar sesión') {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'UNAUTHORIZED',
      },
      { status: 401 }
    )
  },

  /**
   * Sin permisos
   */
  forbidden(message = 'No tienes permisos para realizar esta acción') {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'FORBIDDEN',
      },
      { status: 403 }
    )
  },

  /**
   * No encontrado
   */
  notFound(message = 'Recurso no encontrado') {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'NOT_FOUND',
      },
      { status: 404 }
    )
  },

  /**
   * Error del servidor
   */
  serverError(message = 'Error interno del servidor') {
    return NextResponse.json(
      {
        success: false,
        error: message,
        code: 'SERVER_ERROR',
      },
      { status: 500 }
    )
  },
}

/**
 * Decorator para proteger rutas con permisos
 *
 * @example
 * export const POST = withPermission('polizas.cotizar.advanced', async (req, session) => {
 *   // Tu lógica aquí
 *   return ApiResponse.success({ quote: data })
 * })
 */
export function withPermission(
  feature: Feature,
  handler: (req: NextRequest, session: AuthSession) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const result = await requirePermission(req, feature)

    if (result instanceof NextResponse) {
      return result
    }

    try {
      return await handler(req, result.session)
    } catch (error) {
      console.error(`[API] Error in protected route (${feature}):`, error)
      return ApiResponse.serverError()
    }
  }
}

/**
 * Decorator para proteger rutas por rol
 *
 * @example
 * export const DELETE = withRole('ADMIN', async (req, session) => {
 *   // Solo admins pueden eliminar
 *   return ApiResponse.success({ deleted: true })
 * })
 */
export function withRole(
  role: UserRole | UserRole[],
  handler: (req: NextRequest, session: AuthSession) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const result = await requireRole(req, role)

    if (result instanceof NextResponse) {
      return result
    }

    try {
      return await handler(req, result.session)
    } catch (error) {
      console.error(`[API] Error in role-protected route:`, error)
      return ApiResponse.serverError()
    }
  }
}

/**
 * Decorator para proteger rutas que requieren autenticación
 *
 * @example
 * export const GET = withAuth(async (req, session) => {
 *   // Usuario autenticado
 *   return ApiResponse.success({ user: session.user })
 * })
 */
export function withAuth(
  handler: (req: NextRequest, session: AuthSession) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const result = await requireAuth(req)

    if (result instanceof NextResponse) {
      return result
    }

    try {
      return await handler(req, result.session)
    } catch (error) {
      console.error('[API] Error in authenticated route:', error)
      return ApiResponse.serverError()
    }
  }
}
