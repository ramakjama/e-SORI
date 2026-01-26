import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// DEMO_MODE = false para mostrar el flujo completo de login
const DEMO_MODE = false

// Rutas que requieren autenticación
const protectedRoutes = [
  '/dashboard',
  '/polizas',
  '/siniestros',
  '/recibos',
  '/documentos',
  '/pagos',
  '/mensajes',
  '/perfil',
  '/soriano-club',
]

// Rutas de autenticación
const authRoutes = ['/login', '/login-cliente', '/login-empleado', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // En DEMO_MODE, permitir acceso directo al dashboard
  if (DEMO_MODE) {
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Flujo normal: permitir acceso a login y rutas públicas
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sounds|images|assets).*)',
  ],
}
