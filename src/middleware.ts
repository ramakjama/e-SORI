import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect root to appropriate page based on authentication
    if (pathname === '/') {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      } else {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Allow authenticated users to access protected routes
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl

        // Public routes - always allow
        if (
          pathname === '/login' ||
          pathname === '/login-cliente' ||
          pathname === '/login-empleado' ||
          pathname.startsWith('/api/auth/')
        ) {
          return true
        }

        // Root route - allow (will be handled by middleware function above)
        if (pathname === '/') {
          return true
        }

        // Protected dashboard routes - require authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        // All other routes are public by default
        return true
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
)

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/login-cliente',
    '/login-empleado',
  ],
}
