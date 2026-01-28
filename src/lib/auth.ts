'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UserRole, UserLevel } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
  level: UserLevel
  points: number
  xp: number
  coins: number
  shields: number
  referralCode: string | null
}

export interface AuthResponse {
  success: boolean
  error?: string
}

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user as AuthUser | undefined

  /**
   * Login con credenciales (email/password)
   */
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResponse> => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          return { success: false, error: result.error }
        }

        // Redirect después de login exitoso
        router.push('/dashboard')
        return { success: true }
      } catch (error) {
        console.error('[useAuth] Login error:', error)
        return { success: false, error: 'Error al iniciar sesión' }
      }
    },
    [router]
  )

  /**
   * Login con Google OAuth
   */
  const loginWithGoogle = useCallback(async () => {
    await signIn('google', { callbackUrl: '/dashboard' })
  }, [])

  /**
   * Login con Email Magic Link
   */
  const loginWithEmail = useCallback(
    async (email: string): Promise<AuthResponse> => {
      try {
        const result = await signIn('email', {
          email,
          redirect: false,
          callbackUrl: '/dashboard',
        })

        if (result?.error) {
          return { success: false, error: result.error }
        }

        return { success: true }
      } catch (error) {
        console.error('[useAuth] Email login error:', error)
        return { success: false, error: 'Error al enviar el enlace mágico' }
      }
    },
    []
  )

  /**
   * Logout del usuario
   */
  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/login' })
  }, [])

  /**
   * Refrescar sesión (útil después de actualizar wallets)
   */
  const refreshSession = useCallback(async () => {
    await update()
  }, [update])

  /**
   * Actualizar datos de la sesión (xp, coins, shields, etc.)
   */
  const updateSessionData = useCallback(
    async (data: Partial<AuthUser>) => {
      await update(data)
    },
    [update]
  )

  /**
   * Verificar si el usuario tiene un rol específico
   */
  const hasRole = useCallback(
    (requiredRole: UserRole): boolean => {
      if (!user) return false
      const roleHierarchy: Record<UserRole, number> = {
        CLIENTE: 1,
        EMPLEADO: 2,
        ADMIN: 3,
      }
      return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
    },
    [user]
  )

  /**
   * Verificar si el usuario es admin
   */
  const isAdmin = useCallback(() => user?.role === 'ADMIN', [user])

  /**
   * Verificar si el usuario es empleado o admin
   */
  const isEmployee = useCallback(() => hasRole('EMPLEADO'), [hasRole])

  return {
    // User data
    user,
    isLoading,
    isAuthenticated,

    // Authentication methods
    login,
    loginWithGoogle,
    loginWithEmail,
    logout,

    // Session management
    refreshSession,
    updateSessionData,

    // Role checks
    hasRole,
    isAdmin,
    isEmployee,
  }
}
