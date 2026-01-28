'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import type { UserRole } from '@prisma/client'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  fallback?: ReactNode
}

/**
 * Componente para proteger rutas que requieren autenticación
 *
 * @example
 * ```tsx
 * <ProtectedRoute requiredRole="ADMIN">
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  requiredRole,
  fallback = <LoadingScreen />
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state
  if (isLoading) {
    return <>{fallback}</>
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Acceso Denegado
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            No tienes permisos para acceder a esta página.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary w-full"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-occident border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Verificando autenticación...
        </p>
      </div>
    </div>
  )
}
