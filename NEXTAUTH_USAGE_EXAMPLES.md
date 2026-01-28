# NextAuth.js - Guía de Uso Completa para e-SORI

Esta guía proporciona ejemplos completos de cómo usar el sistema de autenticación en e-SORI.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Variables de Entorno](#variables-de-entorno)
3. [Hook useAuth()](#hook-useauth)
4. [Protección de Rutas](#protección-de-rutas)
5. [Componentes con Autenticación](#componentes-con-autenticación)
6. [APIs Protegidas](#apis-protegidas)
7. [Actualizar Sesión](#actualizar-sesión)
8. [Ejemplos Completos](#ejemplos-completos)

---

## Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-super-seguro-generado-con-openssl

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/soriano_ecliente

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Email Provider (Resend)
RESEND_API_KEY=tu-resend-api-key
EMAIL_FROM=noreply@soriano.com

# Demo Mode (para desarrollo)
DEMO_MODE=false
```

### 2. Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Hook useAuth()

El hook `useAuth()` proporciona toda la funcionalidad de autenticación.

### Importación

```typescript
import { useAuth } from '@/lib/auth'
```

### API Completa

```typescript
const {
  // Datos del usuario
  user,                  // AuthUser | undefined
  isLoading,            // boolean
  isAuthenticated,      // boolean

  // Métodos de autenticación
  login,                // (email, password) => Promise<AuthResponse>
  loginWithGoogle,      // () => Promise<void>
  loginWithEmail,       // (email) => Promise<AuthResponse>
  logout,               // () => Promise<void>

  // Gestión de sesión
  refreshSession,       // () => Promise<void>
  updateSessionData,    // (data) => Promise<void>

  // Verificación de roles
  hasRole,              // (role) => boolean
  isAdmin,              // () => boolean
  isEmployee,           // () => boolean
} = useAuth()
```

### Tipos

```typescript
interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole          // 'CLIENTE' | 'EMPLEADO' | 'ADMIN'
  level: UserLevel        // 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'
  points: number          // Puntos del sistema V1
  xp: number             // Experiencia (Wallet)
  coins: number          // Monedas (Wallet)
  shields: number        // Escudos (Wallet)
  referralCode: string | null
}
```

---

## Protección de Rutas

### Opción 1: Middleware (Automático)

El middleware en `src/middleware.ts` protege automáticamente todas las rutas no públicas.

Rutas públicas por defecto:
- `/`
- `/login`, `/login-cliente`, `/login-empleado`
- `/register`
- `/forgot-password`, `/reset-password`
- `/verify-email`
- `/api/auth/*`
- `/api/contact`, `/api/leads`

### Opción 2: Componente ProtectedRoute

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPanel />
    </ProtectedRoute>
  )
}
```

### Opción 3: Hook useAuth() en el componente

```typescript
'use client'

import { useAuth } from '@/lib/auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return <div>Cargando...</div>
  if (!isAuthenticated) return null

  return <ProfileContent />
}
```

---

## Componentes con Autenticación

### 1. Componente de Login

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, loginWithGoogle, loginWithEmail } = useAuth()

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        toast.success('¡Bienvenido!')
        // Redirect automático a /dashboard
      } else {
        toast.error(result.error || 'Error al iniciar sesión')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      toast.error('Error al iniciar sesión con Google')
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await loginWithEmail(email)

      if (result.success) {
        toast.success('¡Revisa tu email! Te hemos enviado un enlace mágico.')
      } else {
        toast.error(result.error || 'Error al enviar el enlace')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Login con Credenciales */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      {/* Login con Google */}
      <button onClick={handleGoogleLogin} className="btn-secondary w-full">
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          {/* Google icon SVG */}
        </svg>
        Continuar con Google
      </button>

      {/* Magic Link */}
      <form onSubmit={handleMagicLink} className="space-y-4">
        <button type="submit" disabled={isLoading} className="btn-secondary w-full">
          Enviar enlace mágico por email
        </button>
      </form>
    </div>
  )
}
```

### 2. Componente de Perfil con Datos de Usuario

```typescript
'use client'

import { useAuth } from '@/lib/auth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || 'Avatar'}
                className="w-20 h-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{user.name || 'Usuario'}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Información de Gamificación */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Nivel</div>
              <div className="text-2xl font-bold">{user.level}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">XP</div>
              <div className="text-2xl font-bold">{user.xp.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Coins</div>
              <div className="text-2xl font-bold">{user.coins.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
              <div className="text-sm opacity-80">Shields</div>
              <div className="text-2xl font-bold">{user.shields}</div>
            </div>
          </div>

          {/* Rol y Permisos */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Rol y Permisos</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-occident/10 text-occident rounded-full text-sm font-medium">
                {user.role}
              </span>
              {user.referralCode && (
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  Código: {user.referralCode}
                </span>
              )}
            </div>
          </div>

          <button onClick={logout} className="btn-secondary w-full">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
```

### 3. Componente con Verificación de Rol

```typescript
'use client'

import { useAuth } from '@/lib/auth'

export default function AdminButton() {
  const { isAdmin, isEmployee } = useAuth()

  // Solo mostrar para admin
  if (!isAdmin()) return null

  return (
    <button className="btn-primary">
      Panel de Administración
    </button>
  )
}

// O con hasRole
export function EmployeeFeature() {
  const { hasRole } = useAuth()

  if (!hasRole('EMPLEADO')) return null

  return <EmployeePanel />
}
```

---

## APIs Protegidas

### 1. API Route con getServerSession

```typescript
// src/app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        level: true,
        points: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('[API] Profile error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### 2. API Route con verificación de rol

```typescript
// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hasRole } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar que el usuario sea admin
    if (!hasRole(session.user.role, 'ADMIN')) {
      return NextResponse.json(
        { error: 'No tienes permisos para esta acción' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('[API] Admin users error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

### 3. Server Action con autenticación

```typescript
// src/app/actions/updateProfile.ts
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProfile(name: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error('No autenticado')
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  })

  revalidatePath('/profile')
  return { success: true }
}
```

---

## Actualizar Sesión

### Después de cambios en Wallets (XP, Coins, Shields)

```typescript
'use client'

import { useAuth } from '@/lib/auth'
import { useState } from 'react'

export default function CompleteQuiz() {
  const { refreshSession } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true)

    try {
      // Enviar respuestas del quiz
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ answers }),
      })

      const data = await response.json()

      // El backend actualiza las wallets
      // Ahora necesitamos refrescar la sesión para obtener los nuevos valores
      await refreshSession()

      toast.success(`¡Ganaste ${data.xpEarned} XP y ${data.coinsEarned} Coins!`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button onClick={handleSubmitQuiz} disabled={isSubmitting}>
      {isSubmitting ? 'Enviando...' : 'Completar Quiz'}
    </button>
  )
}
```

### Actualizar datos específicos

```typescript
const { updateSessionData } = useAuth()

// Actualizar solo el nombre
await updateSessionData({ name: 'Nuevo Nombre' })

// NO se puede actualizar el rol desde el cliente (bloqueado por seguridad)
// await updateSessionData({ role: 'ADMIN' }) // ❌ Esto será rechazado
```

---

## Ejemplos Completos

### Dashboard Completo con Autenticación

```typescript
'use client'

import { useAuth } from '@/lib/auth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Trophy, Coins, Shield, Star } from 'lucide-react'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-600">Bienvenido, {user.name || user.email}</p>
            </div>
            <button onClick={logout} className="btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Star className="w-8 h-8" />}
              label="Nivel"
              value={user.level}
              gradient="from-purple-500 to-purple-600"
            />
            <StatCard
              icon={<Trophy className="w-8 h-8" />}
              label="XP"
              value={user.xp.toLocaleString()}
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={<Coins className="w-8 h-8" />}
              label="Coins"
              value={user.coins.toLocaleString()}
              gradient="from-yellow-500 to-yellow-600"
            />
            <StatCard
              icon={<Shield className="w-8 h-8" />}
              label="Shields"
              value={user.shields}
              gradient="from-emerald-500 to-emerald-600"
            />
          </div>

          {/* Content based on role */}
          {user.role === 'ADMIN' && <AdminContent />}
          {user.role === 'EMPLEADO' && <EmployeeContent />}
          {user.role === 'CLIENTE' && <ClienteContent />}
        </main>
      </div>
    </ProtectedRoute>
  )
}

function StatCard({ icon, label, value, gradient }: any) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-80">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}
```

---

## Resumen de Características

✅ **Proveedores Implementados:**
- Email/Password (Credentials)
- Google OAuth
- Email Magic Link (Resend)

✅ **Seguridad:**
- JWT con expiración automática
- Validación de roles y permisos
- Verificación periódica de usuario activo
- Cookies seguras en producción
- Rate limiting en Credentials provider

✅ **Gamificación:**
- XP, Coins y Shields desde Wallets
- Actualización automática cada 5 minutos
- Sincronización en tiempo real con `refreshSession()`

✅ **Middleware:**
- Protección automática de rutas
- Redirección basada en autenticación
- Control de acceso por roles

✅ **TypeScript:**
- Tipos completamente tipados
- Autocompletado completo
- Validación en tiempo de desarrollo

---

## Troubleshooting

### "Session undefined" en componente

Asegúrate de que el componente esté envuelto en SessionProvider:

```typescript
// src/app/layout.tsx
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

### Wallets no se actualizan

Llama a `refreshSession()` después de cualquier operación que modifique las wallets:

```typescript
const { refreshSession } = useAuth()

// Después de completar quiz, comprar en tienda, etc.
await refreshSession()
```

### Error "NEXTAUTH_SECRET not defined"

Asegúrate de tener `NEXTAUTH_SECRET` en tu `.env.local`:

```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

---

## Contacto y Soporte

Para más información o problemas, contacta al equipo de desarrollo de Soriano Mediadores.

**Versión:** 2.0
**Última actualización:** Enero 2026
