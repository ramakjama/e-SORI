/**
 * Server-side Auth Utilities
 *
 * Funciones para usar en Server Components y Server Actions
 * NO usar en Client Components (usar useAuth() en su lugar)
 */

import { getServerSession } from 'next-auth'
import { authOptions, hasRole as hasRolePermission } from './auth-options'
import { redirect } from 'next/navigation'
import type { UserRole } from '@prisma/client'
import type { Session } from 'next-auth'

// =====================================================
// SESSION HELPERS
// =====================================================

/**
 * Obtiene la sesión del usuario en el servidor
 * Usar en Server Components y Server Actions
 *
 * @example
 * ```typescript
 * // Server Component
 * export default async function ProfilePage() {
 *   const session = await getSession()
 *   if (!session) redirect('/login')
 *
 *   return <div>Hola {session.user.name}</div>
 * }
 * ```
 */
export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

/**
 * Obtiene el usuario actual del servidor
 * Retorna null si no hay sesión
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

/**
 * Verifica si el usuario está autenticado
 * Lanza error si no está autenticado
 *
 * @throws Error si no hay sesión
 */
export async function requireAuth() {
  const session = await getSession()

  if (!session?.user) {
    throw new Error('No autenticado')
  }

  return session.user
}

/**
 * Verifica si el usuario está autenticado y redirige si no
 * Usar en Server Components
 *
 * @example
 * ```typescript
 * export default async function DashboardPage() {
 *   const user = await requireAuthOrRedirect()
 *   return <Dashboard user={user} />
 * }
 * ```
 */
export async function requireAuthOrRedirect(redirectTo: string = '/login') {
  const session = await getSession()

  if (!session?.user) {
    redirect(redirectTo)
  }

  return session.user
}

// =====================================================
// ROLE VERIFICATION
// =====================================================

/**
 * Verifica si el usuario tiene un rol específico
 * Usar en Server Components y Server Actions
 *
 * @example
 * ```typescript
 * export default async function AdminPage() {
 *   const hasAccess = await hasRole('ADMIN')
 *   if (!hasAccess) redirect('/dashboard')
 *
 *   return <AdminPanel />
 * }
 * ```
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  return hasRolePermission(user.role, requiredRole)
}

/**
 * Verifica si el usuario tiene un rol y redirige si no
 *
 * @example
 * ```typescript
 * export default async function AdminPage() {
 *   await requireRole('ADMIN')
 *   return <AdminPanel />
 * }
 * ```
 */
export async function requireRole(
  requiredRole: UserRole,
  redirectTo: string = '/dashboard'
): Promise<void> {
  const user = await requireAuthOrRedirect()

  if (!hasRolePermission(user.role, requiredRole)) {
    redirect(redirectTo)
  }
}

/**
 * Verifica si el usuario es admin
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('ADMIN')
}

/**
 * Verifica si el usuario es empleado o admin
 */
export async function isEmployee(): Promise<boolean> {
  return await hasRole('EMPLEADO')
}

// =====================================================
// USER DATA ACCESS
// =====================================================

/**
 * Verifica si el usuario actual puede acceder a datos de otro usuario
 *
 * @param targetUserId ID del usuario cuyos datos se quieren acceder
 * @returns true si tiene acceso, false si no
 */
export async function canAccessUserData(targetUserId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  // Admin y Empleado pueden ver todos los datos
  if (user.role === 'ADMIN' || user.role === 'EMPLEADO') {
    return true
  }

  // Cliente solo puede ver sus propios datos
  return user.id === targetUserId
}

/**
 * Verifica acceso a datos de usuario y redirige si no tiene permiso
 */
export async function requireUserDataAccess(
  targetUserId: string,
  redirectTo: string = '/dashboard'
): Promise<void> {
  const hasAccess = await canAccessUserData(targetUserId)

  if (!hasAccess) {
    redirect(redirectTo)
  }
}

// =====================================================
// SERVER ACTIONS HELPERS
// =====================================================

/**
 * Wrapper para Server Actions que requieren autenticación
 *
 * @example
 * ```typescript
 * export const updateProfile = withAuth(async (name: string) => {
 *   // user está disponible como this.user
 *   const user = await requireAuth()
 *
 *   await prisma.user.update({
 *     where: { id: user.id },
 *     data: { name },
 *   })
 *
 *   return { success: true }
 * })
 * ```
 */
export function withAuth<T extends any[], R>(
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    await requireAuth()
    return handler(...args)
  }
}

/**
 * Wrapper para Server Actions que requieren un rol específico
 *
 * @example
 * ```typescript
 * export const deleteUser = withRole('ADMIN', async (userId: string) => {
 *   await prisma.user.delete({ where: { id: userId } })
 *   return { success: true }
 * })
 * ```
 */
export function withRole<T extends any[], R>(
  requiredRole: UserRole,
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const user = await requireAuth()

    if (!hasRolePermission(user.role, requiredRole)) {
      throw new Error('No tienes permisos para realizar esta acción')
    }

    return handler(...args)
  }
}

// =====================================================
// API RESPONSE HELPERS
// =====================================================

/**
 * Respuestas estandarizadas para APIs
 */
export const ApiResponse = {
  unauthorized: (message = 'No autenticado') => ({
    error: message,
    status: 401,
  }),

  forbidden: (message = 'No tienes permisos para esta acción') => ({
    error: message,
    status: 403,
  }),

  success: <T>(data: T, message?: string) => ({
    success: true,
    data,
    message,
    status: 200,
  }),

  error: (message: string, status = 500) => ({
    error: message,
    status,
  }),
} as const

// =====================================================
// EXAMPLE SERVER COMPONENT
// =====================================================

/**
 * Ejemplo de uso en Server Component:
 *
 * ```typescript
 * // app/profile/page.tsx
 * import { requireAuthOrRedirect, hasRole } from '@/lib/auth-server'
 *
 * export default async function ProfilePage() {
 *   // Requiere autenticación, redirige a /login si no
 *   const user = await requireAuthOrRedirect()
 *
 *   // Verificar rol
 *   const canManageUsers = await hasRole('ADMIN')
 *
 *   return (
 *     <div>
 *       <h1>Perfil de {user.name}</h1>
 *       <p>Email: {user.email}</p>
 *       <p>XP: {user.xp}</p>
 *       <p>Coins: {user.coins}</p>
 *
 *       {canManageUsers && (
 *         <Link href="/admin/users">Gestionar Usuarios</Link>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */

// =====================================================
// EXAMPLE SERVER ACTION
// =====================================================

/**
 * Ejemplo de uso en Server Action:
 *
 * ```typescript
 * // app/actions/profile.ts
 * 'use server'
 *
 * import { requireAuth } from '@/lib/auth-server'
 * import { prisma } from '@/lib/prisma'
 * import { revalidatePath } from 'next/cache'
 *
 * export async function updateProfileName(name: string) {
 *   // Requiere autenticación
 *   const user = await requireAuth()
 *
 *   // Validar entrada
 *   if (!name || name.length < 2) {
 *     throw new Error('Nombre inválido')
 *   }
 *
 *   // Actualizar en base de datos
 *   await prisma.user.update({
 *     where: { id: user.id },
 *     data: { name },
 *   })
 *
 *   // Revalidar cache
 *   revalidatePath('/profile')
 *
 *   return { success: true }
 * }
 * ```
 */

// =====================================================
// EXAMPLE API ROUTE
// =====================================================

/**
 * Ejemplo de uso en API Route:
 *
 * ```typescript
 * // app/api/users/route.ts
 * import { NextResponse } from 'next/server'
 * import { requireAuth, hasRole, ApiResponse } from '@/lib/auth-server'
 *
 * export async function GET() {
 *   try {
 *     // Verificar autenticación
 *     const user = await requireAuth()
 *
 *     // Verificar rol
 *     const isAuthorized = await hasRole('ADMIN')
 *     if (!isAuthorized) {
 *       return NextResponse.json(
 *         ApiResponse.forbidden(),
 *         { status: 403 }
 *       )
 *     }
 *
 *     // Obtener datos
 *     const users = await prisma.user.findMany()
 *
 *     return NextResponse.json(
 *       ApiResponse.success(users)
 *     )
 *   } catch (error) {
 *     return NextResponse.json(
 *       ApiResponse.unauthorized(),
 *       { status: 401 }
 *     )
 *   }
 * }
 * ```
 */
