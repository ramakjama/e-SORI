import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes (no authentication required)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/login-cliente',
  '/login-empleado',
  '/registro',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/auth',
  '/api/contact',
  '/api/leads',
  '/landing',
  '/club',
  '/herramientas',
  '/legal',
  '/promo',
]

// Role-based route permissions
const ROLE_ROUTES = {
  ADMIN: ['/admin', '/settings/system', '/users/manage'],
  EMPLEADO: ['/empleado', '/claims/manage', '/policies/manage'],
  CLIENTE: ['/dashboard', '/policies', '/claims', '/profile', '/soriano-club'],
}

/**
 * Security headers for all responses
 */
const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.groq.com https://api.resend.com wss://api.groq.com;",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1))
    }
    return pathname === route || pathname.startsWith(route + '/')
  })
}

/**
 * Check if user has access to a route based on their role
 */
function hasRouteAccess(pathname: string, userRole: string): boolean {
  // Admin has access to everything
  if (userRole === 'ADMIN') return true

  // Check role-specific routes
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    const roleRoutes = routes as string[]
    const hasAccess = roleRoutes.some((route) => pathname.startsWith(route))

    if (hasAccess) {
      // If route requires a specific role, check if user has it
      const roleHierarchy = { CLIENTE: 1, EMPLEADO: 2, ADMIN: 3 }
      return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[role as keyof typeof roleHierarchy]
    }
  }

  // Default: CLIENTE routes are accessible to all authenticated users
  return true
}

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token?: any } }) {
    const token = req.nextauth?.token
    const { pathname } = req.nextUrl

    // Crear respuesta base
    let response = NextResponse.next()

    // Añadir security headers a todas las respuestas
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Redirect root to login or dashboard
    if (pathname === '/') {
      if (token) {
        response = NextResponse.redirect(new URL('/dashboard', req.url))
      } else {
        response = NextResponse.redirect(new URL('/login-cliente', req.url))
      }
      // Añadir headers también a redirects
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Redirect authenticated users away from auth pages
    if (token && (pathname === '/login' || pathname === '/login-cliente' || pathname === '/registro')) {
      response = NextResponse.redirect(new URL('/dashboard', req.url))
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Check role-based access
    if (token?.role) {
      if (!hasRouteAccess(pathname, token.role)) {
        console.warn(`[Middleware] Access denied for user ${token.id} (${token.role}) to ${pathname}`)
        response = NextResponse.redirect(new URL('/dashboard', req.url))
        Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }
    }

    // If token is invalid, redirect to login
    if (token?.invalid) {
      response = NextResponse.redirect(new URL('/login-cliente?error=SessionExpired', req.url))
      Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes are always authorized
        if (isPublicRoute(pathname)) return true

        // All other routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login-cliente',
      error: '/login-cliente',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
