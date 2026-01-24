'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          return { success: false, error: result.error }
        }

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Error al iniciar sesión' }
      }
    },
    []
  )

  const loginWithGoogle = useCallback(async () => {
    await signIn('google', { callbackUrl: '/dashboard' })
  }, [])

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/login' })
  }, [])

  const refreshSession = useCallback(async () => {
    await update()
  }, [update])

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    refreshSession,
  }
}
