import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole, UserLevel } from '@prisma/client'

// =====================================================
// CONSTANTES DE SEGURIDAD
// =====================================================
const VALID_ROLES: UserRole[] = ['USER', 'AGENT', 'ADMIN']
const VALID_LEVELS: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 dias
const SESSION_UPDATE_AGE = 24 * 60 * 60 // Refrescar token cada 24 horas

// =====================================================
// FUNCIONES DE VALIDACION DE ROLES Y TOKENS
// =====================================================

/**
 * Valida que el rol sea uno de los permitidos
 */
function isValidRole(role: unknown): role is UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole)
}

/**
 * Valida que el nivel sea uno de los permitidos
 */
function isValidLevel(level: unknown): level is UserLevel {
  return typeof level === 'string' && VALID_LEVELS.includes(level as UserLevel)
}

/**
 * Valida la estructura del token JWT
 */
function validateTokenStructure(token: Record<string, unknown>): boolean {
  // Verificar campos requeridos
  if (!token.id || typeof token.id !== 'string') {
    return false
  }

  // Verificar que el rol sea valido
  if (token.role && !isValidRole(token.role)) {
    console.warn(`[Auth] Invalid role in token: ${token.role}`)
    return false
  }

  // Verificar que el nivel sea valido
  if (token.level && !isValidLevel(token.level)) {
    console.warn(`[Auth] Invalid level in token: ${token.level}`)
    return false
  }

  // Verificar que los puntos sean un numero valido
  if (token.points !== undefined && (typeof token.points !== 'number' || token.points < 0)) {
    console.warn(`[Auth] Invalid points in token: ${token.points}`)
    return false
  }

  return true
}

/**
 * Sanitiza los datos del usuario antes de incluirlos en el token
 */
function sanitizeUserForToken(user: Record<string, unknown>) {
  return {
    id: String(user.id || ''),
    role: isValidRole(user.role) ? user.role : 'USER' as UserRole,
    level: isValidLevel(user.level) ? user.level : 'BRONCE' as UserLevel,
    points: typeof user.points === 'number' && user.points >= 0 ? user.points : 0,
  }
}

/**
 * Verifica si el usuario sigue activo en la base de datos
 * Util para invalidar sesiones de usuarios desactivados
 */
async function verifyUserIsActive(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    })
    return user?.isActive ?? false
  } catch (error) {
    console.error('[Auth] Error verifying user status:', error)
    return false
  }
}

// =====================================================
// CONFIGURACION DE NEXTAUTH
// =====================================================
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google OAuth (opcional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // Credenciales (email/password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validacion de entrada
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contrasena son requeridos')
        }

        // Validar formato de email basico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(credentials.email)) {
          throw new Error('Formato de email invalido')
        }

        // Limitar longitud de credenciales para prevenir ataques
        if (credentials.email.length > 100 || credentials.password.length > 128) {
          throw new Error('Credenciales invalidas')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user || !user.password) {
          // Usar tiempo constante para prevenir timing attacks
          await bcrypt.compare(credentials.password, '$2b$10$invalidhashtopreventtimingattacks')
          throw new Error('Credenciales invalidas')
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Credenciales invalidas')
        }

        if (!user.isActive) {
          throw new Error('Tu cuenta esta desactivada. Contacta con soporte.')
        }

        // Validar rol antes de incluir en sesion
        if (!isValidRole(user.role)) {
          console.error(`[Auth] User ${user.id} has invalid role: ${user.role}`)
          throw new Error('Error de configuracion de cuenta')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          level: user.level,
          points: user.points,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
    updateAge: SESSION_UPDATE_AGE,
  },
  jwt: {
    // Tiempo maximo de vida del JWT
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Usuario recien autenticado
      if (user) {
        const sanitized = sanitizeUserForToken(user as Record<string, unknown>)
        token.id = sanitized.id
        token.role = sanitized.role
        token.level = sanitized.level
        token.points = sanitized.points
        token.lastVerified = Date.now()
      }

      // Actualizar datos del usuario si se solicita
      if (trigger === 'update' && session) {
        // Validar que los datos de actualizacion sean seguros
        const updateData: Record<string, unknown> = {}

        if (session.name && typeof session.name === 'string') {
          updateData.name = session.name.slice(0, 100)
        }
        if (session.level && isValidLevel(session.level)) {
          updateData.level = session.level
        }
        if (session.points !== undefined && typeof session.points === 'number' && session.points >= 0) {
          updateData.points = session.points
        }

        // NO permitir actualizar el rol desde el cliente
        if (session.role) {
          console.warn(`[Auth] Attempted role update rejected for user ${token.id}`)
        }

        token = { ...token, ...updateData }
      }

      // Verificar periodicamente que el usuario sigue activo (cada hora)
      const lastVerified = token.lastVerified as number || 0
      const oneHour = 60 * 60 * 1000
      if (Date.now() - lastVerified > oneHour && token.id) {
        const isActive = await verifyUserIsActive(token.id as string)
        if (!isActive) {
          // Invalida el token retornando un token vacio
          console.warn(`[Auth] User ${token.id} is no longer active, invalidating session`)
          return { ...token, invalid: true }
        }
        token.lastVerified = Date.now()
      }

      return token
    },
    async session({ session, token }) {
      // Verificar si el token fue marcado como invalido
      if (token.invalid) {
        // Retornar sesion sin datos de usuario para forzar logout
        return { ...session, user: undefined }
      }

      // Validar estructura del token antes de usar
      if (!validateTokenStructure(token as Record<string, unknown>)) {
        console.error('[Auth] Invalid token structure detected')
        return { ...session, user: undefined }
      }

      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.level = token.level as UserLevel
        session.user.points = token.points as number
      }
      return session
    },
    async signIn({ user, account }) {
      // Validaciones adicionales para OAuth
      if (account?.provider === 'google') {
        // Verificar que el email este verificado
        if (!(user as any).emailVerified) {
          console.warn(`[Auth] Google sign-in with unverified email: ${user.email}`)
          // Permitir pero registrar
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Configuracion de cookies seguras
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}

// =====================================================
// HELPERS PARA VERIFICACION DE ROLES EN APIs
// =====================================================

/**
 * Verifica si el usuario tiene un rol especifico o superior
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    AGENT: 2,
    ADMIN: 3,
  }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Verifica si el usuario puede acceder a datos de otro usuario
 * Admins pueden ver todo, Agents pueden ver usuarios, Users solo a si mismos
 */
export function canAccessUserData(
  currentUserId: string,
  currentUserRole: UserRole,
  targetUserId: string
): boolean {
  if (currentUserRole === 'ADMIN') return true
  if (currentUserRole === 'AGENT') return true
  return currentUserId === targetUserId
}

/**
 * Lista de roles permitidos para acciones especificas
 */
export const rolePermissions = {
  viewAllUsers: ['ADMIN', 'AGENT'] as UserRole[],
  editAnyUser: ['ADMIN'] as UserRole[],
  viewAllPolicies: ['ADMIN', 'AGENT'] as UserRole[],
  viewAllClaims: ['ADMIN', 'AGENT'] as UserRole[],
  manageClaims: ['ADMIN', 'AGENT'] as UserRole[],
  systemSettings: ['ADMIN'] as UserRole[],
} as const
