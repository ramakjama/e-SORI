import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import AppleProvider from 'next-auth/providers/apple'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole, UserLevel } from '@prisma/client'
import { Resend } from 'resend'

// =====================================================
// CONSTANTES DE SEGURIDAD
// =====================================================
const VALID_ROLES: UserRole[] = ['CLIENTE', 'EMPLEADO', 'ADMIN']
const VALID_LEVELS: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO']
const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 dias
const SESSION_UPDATE_AGE = 24 * 60 * 60 // Refrescar token cada 24 horas

// Initialize Resend for email provider
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

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
    role: isValidRole(user.role) ? user.role : 'CLIENTE' as UserRole,
    level: isValidLevel(user.level) ? user.level : 'BRONCE' as UserLevel,
    points: typeof user.points === 'number' && user.points >= 0 ? user.points : 0,
    xp: typeof user.xp === 'number' && user.xp >= 0 ? user.xp : 0,
    coins: typeof user.coins === 'number' && user.coins >= 0 ? user.coins : 0,
    shields: typeof user.shields === 'number' && user.shields >= 0 ? user.shields : 0,
    referralCode: typeof user.referralCode === 'string' ? user.referralCode : null,
  }
}

/**
 * Obtiene los balances de las wallets del usuario
 */
async function getUserWallets(userId: string): Promise<{ xp: number; coins: number; shields: number }> {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      select: { type: true, balance: true },
    })

    const balances = {
      xp: 0,
      coins: 0,
      shields: 0,
    }

    wallets.forEach((wallet) => {
      if (wallet.type === 'XP') balances.xp = wallet.balance
      if (wallet.type === 'COINS') balances.coins = wallet.balance
      if (wallet.type === 'SHIELDS') balances.shields = wallet.balance
    })

    return balances
  } catch (error) {
    console.error('[Auth] Error fetching user wallets:', error)
    return { xp: 0, coins: 0, shields: 0 }
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
    // Google OAuth
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            }
          }),
        ]
      : []),
    // Microsoft OAuth
    ...(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET
      ? [
          AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            tenantId: process.env.MICROSOFT_TENANT_ID || 'common',
          }),
        ]
      : []),
    // Apple OAuth
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET,
          }),
        ]
      : []),
    // Email (Magic Link with Resend)
    ...(resend
      ? [
          EmailProvider({
            server: '', // Not needed with custom sendVerificationRequest
            from: process.env.EMAIL_FROM || 'noreply@soriano.com',
            sendVerificationRequest: async ({ identifier: email, url }) => {
              try {
                await resend!.emails.send({
                  from: process.env.EMAIL_FROM || 'noreply@soriano.com',
                  to: email,
                  subject: 'Inicia sesión en Soriano e-Cliente',
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      </head>
                      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 28px;">Soriano e-Cliente</h1>
                        </div>
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                          <h2 style="color: #667eea; margin-top: 0;">Inicia sesión en tu cuenta</h2>
                          <p style="font-size: 16px; margin-bottom: 25px;">Haz clic en el botón de abajo para iniciar sesión en tu cuenta de Soriano e-Cliente:</p>
                          <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Iniciar Sesión</a>
                          </div>
                          <p style="font-size: 14px; color: #666; margin-top: 30px;">
                            Si no solicitaste este enlace, puedes ignorar este correo de forma segura.
                          </p>
                          <p style="font-size: 14px; color: #666;">
                            Este enlace expirará en 24 horas por motivos de seguridad.
                          </p>
                        </div>
                        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                          <p>&copy; ${new Date().getFullYear()} Soriano Mediadores de Seguros. Todos los derechos reservados.</p>
                        </div>
                      </body>
                    </html>
                  `,
                })
              } catch (error) {
                console.error('[Auth] Error sending magic link email:', error)
                throw new Error('No se pudo enviar el correo de inicio de sesión')
              }
            },
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

        // Obtener wallets del usuario
        const wallets = await getUserWallets(user.id)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          level: user.level,
          points: user.points,
          xp: wallets.xp,
          coins: wallets.coins,
          shields: wallets.shields,
          referralCode: user.referralCode,
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
    async jwt({ token, user, trigger, session, account }) {
      // Usuario recien autenticado
      if (user) {
        // Para usuarios OAuth, obtener datos completos de la DB
        if (account?.provider && account.provider !== 'credentials') {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (dbUser) {
            const wallets = await getUserWallets(dbUser.id)
            token.id = dbUser.id
            token.role = dbUser.role
            token.level = dbUser.level
            token.points = dbUser.points
            token.xp = wallets.xp
            token.coins = wallets.coins
            token.shields = wallets.shields
            token.referralCode = dbUser.referralCode
            token.lastVerified = Date.now()
          }
        } else {
          // Para credentials, usar datos del usuario
          const sanitized = sanitizeUserForToken(user as Record<string, unknown>)
          token.id = sanitized.id
          token.role = sanitized.role
          token.level = sanitized.level
          token.points = sanitized.points
          token.xp = sanitized.xp
          token.coins = sanitized.coins
          token.shields = sanitized.shields
          token.referralCode = sanitized.referralCode
          token.lastVerified = Date.now()
        }
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
        if (session.xp !== undefined && typeof session.xp === 'number' && session.xp >= 0) {
          updateData.xp = session.xp
        }
        if (session.coins !== undefined && typeof session.coins === 'number' && session.coins >= 0) {
          updateData.coins = session.coins
        }
        if (session.shields !== undefined && typeof session.shields === 'number' && session.shields >= 0) {
          updateData.shields = session.shields
        }

        // NO permitir actualizar el rol desde el cliente
        if (session.role) {
          console.warn(`[Auth] Attempted role update rejected for user ${token.id}`)
        }

        token = { ...token, ...updateData }
      }

      // Verificar periodicamente que el usuario sigue activo y actualizar wallets (cada 5 minutos)
      const lastVerified = token.lastVerified as number || 0
      const fiveMinutes = 5 * 60 * 1000
      if (Date.now() - lastVerified > fiveMinutes && token.id) {
        const isActive = await verifyUserIsActive(token.id as string)
        if (!isActive) {
          // Invalida el token retornando un token vacio
          console.warn(`[Auth] User ${token.id} is no longer active, invalidating session`)
          return { ...token, invalid: true }
        }

        // Actualizar wallets del usuario
        const wallets = await getUserWallets(token.id as string)
        token.xp = wallets.xp
        token.coins = wallets.coins
        token.shields = wallets.shields
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
        session.user.xp = token.xp as number
        session.user.coins = token.coins as number
        session.user.shields = token.shields as number
        session.user.referralCode = token.referralCode as string | null
      }
      return session
    },
    async signIn({ user, account, profile }) {
      /**
       * Sistema de Autenticación OAuth:
       *
       * IMPORTANTE: Solo usuarios REGISTRADOS pueden hacer login.
       *
       * 1. Si el usuario YA EXISTE en la BD:
       *    - Verifica que el email esté verificado
       *    - Vincula el OAuth provider con el usuario existente
       *    - El PrismaAdapter crea el registro en la tabla Account
       *    - NO se modifica el rol/nivel del usuario existente
       *    - Permite el acceso
       *
       * 2. Si el usuario NO EXISTE:
       *    - RECHAZA el acceso
       *    - El usuario debe registrarse primero en /registro
       *    - Sistema de registro autónomo con verificación de email
       */
      if (account && user.email) {
        try {
          // Buscar usuario existente por email
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: {
              accounts: true,
            }
          })

          if (!dbUser) {
            // Usuario NO EXISTE - RECHAZAR acceso
            console.log(`[Auth] ❌ Login OAuth rechazado: ${user.email} no está registrado`)
            console.log(`[Auth] 💡 El usuario debe registrarse primero en /registro`)
            return false // Esto impedirá el login
          }

          // Usuario existe - verificar email verificado
          if (!dbUser.emailVerified) {
            console.log(`[Auth] ❌ Login rechazado: ${user.email} no ha verificado su email`)
            return false
          }

          // Usuario existe y está verificado - permitir acceso
          console.log(`[Auth] 🔗 Vinculando OAuth ${account.provider} con usuario registrado: ${dbUser.email} (${dbUser.role} - ${dbUser.level})`)

          // Verificar si ya tiene wallets, si no, crearlas
          const existingWallets = await prisma.wallet.findMany({
            where: { userId: dbUser.id }
          })

          if (existingWallets.length === 0) {
            console.log(`[Auth] 💰 Creando wallets para usuario: ${dbUser.email}`)
            await prisma.wallet.createMany({
              data: [
                { userId: dbUser.id, type: 'XP', balance: 0 },
                { userId: dbUser.id, type: 'COINS', balance: 100 }, // Bonus por vincular OAuth
                { userId: dbUser.id, type: 'SHIELDS', balance: 0 },
              ]
            })
          }

          // El PrismaAdapter vinculará automáticamente el account con el user
          console.log(`[Auth] ✅ Usuario autenticado con ${account.provider}`)
          return true

        } catch (error) {
          console.error('[Auth] ❌ Error en signIn callback:', error)
          return false
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
    CLIENTE: 1,
    EMPLEADO: 2,
    ADMIN: 3,
  }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Verifica si el usuario puede acceder a datos de otro usuario
 * Admins pueden ver todo, Empleados pueden ver usuarios, Clientes solo a si mismos
 */
export function canAccessUserData(
  currentUserId: string,
  currentUserRole: UserRole,
  targetUserId: string
): boolean {
  if (currentUserRole === 'ADMIN') return true
  if (currentUserRole === 'EMPLEADO') return true
  return currentUserId === targetUserId
}

/**
 * Lista de roles permitidos para acciones especificas
 */
export const rolePermissions = {
  viewAllUsers: ['ADMIN', 'EMPLEADO'] as UserRole[],
  editAnyUser: ['ADMIN'] as UserRole[],
  viewAllPolicies: ['ADMIN', 'EMPLEADO'] as UserRole[],
  viewAllClaims: ['ADMIN', 'EMPLEADO'] as UserRole[],
  manageClaims: ['ADMIN', 'EMPLEADO'] as UserRole[],
  systemSettings: ['ADMIN'] as UserRole[],
} as const
