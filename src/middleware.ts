// Simple middleware without next-auth for now (NextResponse import issues in Next.js 14.2.29)
// Using native Response instead of NextResponse to avoid module resolution errors

const DEMO_MODE = process.env.DEMO_MODE === 'true' || true

export function middleware(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url

  // In DEMO_MODE, redirect login pages to dashboard
  if (DEMO_MODE) {
    if (pathname === '/login' || pathname === '/login-cliente' || pathname === '/login-empleado') {
      return Response.redirect(new URL('/dashboard', request.url))
    }
  }

  // Root redirect
  if (pathname === '/') {
    if (DEMO_MODE) {
      return Response.redirect(new URL('/dashboard', request.url))
    }
    return Response.redirect(new URL('/login', request.url))
  }

  // Allow everything else to pass through
  return undefined
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/login-cliente',
    '/login-empleado',
  ],
}
