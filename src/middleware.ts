import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/polizas',
  '/siniestros',
  '/documentos',
  '/pagos',
  '/mensajes',
  '/perfil',
  '/soriano-club',
]

// Rutas solo para empleados/admin
const employeeRoutes = ['/admin', '/empleados']

// Rutas públicas (no redirigir si está autenticado)
const authRoutes = ['/login', '/login-cliente', '/login-empleado', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener token de sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isEmployeeRoute = employeeRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Si intenta acceder a rutas de auth estando autenticado
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si intenta acceder a rutas protegidas sin autenticación
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si intenta acceder a rutas de empleados sin ser empleado/admin
  if (isEmployeeRoute && isAuthenticated) {
    const userRole = token?.role as string
    if (!['EMPLEADO', 'ADMIN'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sounds|images).*)',
  ],
}
