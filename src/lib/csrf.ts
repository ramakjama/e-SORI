import { randomBytes } from 'crypto'

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

export function setCSRFCookie(token: string): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${CSRF_COOKIE_NAME}=${token}; path=/; SameSite=Strict; Secure`
  }
}

export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === CSRF_COOKIE_NAME) {
      return value
    }
  }
  return null
}

export function validateCSRFToken(request: Request): boolean {
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  const cookieHeader = request.headers.get('cookie')
  
  if (!headerToken || !cookieHeader) return false
  
  const cookies = cookieHeader.split(';')
  let cookieToken: string | null = null
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === CSRF_COOKIE_NAME) {
      cookieToken = value
      break
    }
  }
  
  return headerToken === cookieToken && headerToken.length === CSRF_TOKEN_LENGTH * 2
}

export async function withCSRFProtection(
  request: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    if (!validateCSRFToken(request)) {
      return new Response(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  
  return handler()
}
