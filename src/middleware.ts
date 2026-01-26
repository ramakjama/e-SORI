import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// DEMO_MODE = true para saltar autenticación y acceder directo al dashboard
const DEMO_MODE = true

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // En DEMO_MODE, redirigir login al dashboard directamente
  if (DEMO_MODE) {
    if (pathname === '/login' || pathname === '/login-cliente' || pathname === '/login-empleado') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/login-cliente', '/login-empleado'],
}
