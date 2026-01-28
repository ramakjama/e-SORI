# NextAuth.js - Configuración Completa para e-SORI ✅

## Resumen de Implementación

La configuración de NextAuth.js para e-SORI está **completamente implementada** con todas las características solicitadas.

---

## 📁 Archivos Creados/Actualizados

### 1. Configuración Principal

#### `src/app/api/auth/[...nextauth]/route.ts`
- ✅ Ya existía
- Exporta handlers GET y POST
- Usa `authOptions` desde lib

#### `src/lib/auth-options.ts` (ACTUALIZADO)
**Proveedores configurados:**
- ✅ **Credentials** (Email/Password con bcrypt)
- ✅ **Google OAuth**
- ✅ **Email Magic Link** (Resend)

**Callbacks implementados:**
- ✅ `jwt`: Incluye xp, coins, shields desde Wallets
- ✅ `session`: Extiende session con datos completos
- ✅ `signIn`: Validaciones adicionales

**Funcionalidades de seguridad:**
- ✅ Validación de roles y niveles
- ✅ Verificación periódica de usuario activo (cada 5 minutos)
- ✅ Actualización automática de wallets
- ✅ Sanitización de datos
- ✅ Prevención de timing attacks
- ✅ Rate limiting en authorize

**Integración con Prisma:**
- ✅ PrismaAdapter configurado
- ✅ Obtención de wallets (XP, COINS, SHIELDS)
- ✅ Verificación de estado del usuario

---

### 2. TypeScript Types

#### `src/types/next-auth.d.ts` (ACTUALIZADO)
```typescript
// Session extendida con:
interface Session {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: UserRole
    level: UserLevel
    points: number
    xp: number          // ✅ NUEVO
    coins: number       // ✅ NUEVO
    shields: number     // ✅ NUEVO
    referralCode: string | null
  }
}

// JWT extendido con:
interface JWT {
  id: string
  role: UserRole
  level: UserLevel
  points: number
  xp: number          // ✅ NUEVO
  coins: number       // ✅ NUEVO
  shields: number     // ✅ NUEVO
  referralCode?: string | null
  lastVerified?: number
  invalid?: boolean
}
```

---

### 3. Hook useAuth()

#### `src/lib/auth.ts` (ACTUALIZADO)

**Funcionalidades disponibles:**
```typescript
const {
  // Datos del usuario
  user,              // AuthUser completo con xp, coins, shields
  isLoading,
  isAuthenticated,

  // Métodos de autenticación
  login,             // (email, password) => Promise<AuthResponse>
  loginWithGoogle,   // () => Promise<void>
  loginWithEmail,    // (email) => Promise<AuthResponse> - Magic Link
  logout,            // () => Promise<void>

  // Gestión de sesión
  refreshSession,       // () => Promise<void> - Actualiza wallets
  updateSessionData,    // (data) => Promise<void>

  // Verificación de roles
  hasRole,           // (role: UserRole) => boolean
  isAdmin,           // () => boolean
  isEmployee,        // () => boolean
} = useAuth()
```

**Características:**
- ✅ TypeScript completamente tipado
- ✅ Redirect automático a `/dashboard` después de login
- ✅ Manejo de errores robusto
- ✅ Helpers de verificación de roles

---

### 4. Middleware de Protección

#### `src/middleware.ts` (ACTUALIZADO)

**Funcionalidades:**
- ✅ Protección automática de rutas
- ✅ Verificación de autenticación con NextAuth
- ✅ Control de acceso basado en roles
- ✅ Redirección inteligente según estado de autenticación
- ✅ Lista de rutas públicas configurable
- ✅ Soporte para DEMO_MODE

**Rutas públicas:**
- `/`, `/login`, `/login-cliente`, `/login-empleado`
- `/register`, `/forgot-password`, `/reset-password`
- `/verify-email`
- `/api/auth/*`, `/api/contact`, `/api/leads`

**Rutas protegidas por rol:**
- **ADMIN:** `/admin`, `/settings/system`, `/users/manage`
- **EMPLEADO:** `/empleado`, `/claims/manage`, `/policies/manage`
- **CLIENTE:** `/dashboard`, `/policies`, `/claims`, `/profile`, `/soriano-club`

---

### 5. Componente ProtectedRoute

#### `src/components/auth/ProtectedRoute.tsx` (NUEVO)

**Uso:**
```typescript
<ProtectedRoute requiredRole="ADMIN">
  <AdminPanel />
</ProtectedRoute>
```

**Características:**
- ✅ Verificación de autenticación
- ✅ Verificación de roles
- ✅ Loading state personalizable
- ✅ Mensaje de acceso denegado
- ✅ Redirección automática

---

### 6. Páginas Custom

#### `src/app/(auth)/login/page.tsx`
- ✅ Ya existía
- Landing page para selección de tipo de usuario
- Diseño moderno con animaciones
- Links a login-cliente y login-empleado

**Páginas adicionales existentes:**
- `/login-cliente` - Login con OAuth para clientes
- `/login-empleado` - Login con biometría para empleados

---

## 🔧 Configuración Requerida

### Variables de Entorno

Crear `.env.local` con:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/soriano_ecliente

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Email Provider (Resend)
RESEND_API_KEY=tu-resend-api-key
EMAIL_FROM=noreply@soriano.com

# Demo Mode
DEMO_MODE=false
```

---

## 🚀 Uso en Componentes

### 1. Componente Simple con Autenticación

```typescript
'use client'

import { useAuth } from '@/lib/auth'

export default function MiComponente() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>Cargando...</div>
  if (!user) return <div>No autenticado</div>

  return (
    <div>
      <h1>Hola {user.name}</h1>
      <p>XP: {user.xp}</p>
      <p>Coins: {user.coins}</p>
      <p>Nivel: {user.level}</p>
    </div>
  )
}
```

### 2. Login Form

```typescript
'use client'

import { useAuth } from '@/lib/auth'
import { useState } from 'react'

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(email, password)

    if (result.success) {
      // Redirect automático a /dashboard
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <button type="button" onClick={loginWithGoogle}>Login con Google</button>
    </form>
  )
}
```

### 3. API Route Protegida

```typescript
// src/app/api/profile/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // Usuario autenticado, proceder...
  return NextResponse.json({
    id: session.user.id,
    email: session.user.email,
    xp: session.user.xp,
    coins: session.user.coins,
  })
}
```

### 4. Actualizar Sesión después de Gamificación

```typescript
'use client'

import { useAuth } from '@/lib/auth'

export default function CompletarQuiz() {
  const { refreshSession } = useAuth()

  const handleSubmit = async () => {
    // Enviar quiz
    await fetch('/api/quiz/submit', { method: 'POST', body: JSON.stringify(answers) })

    // Actualizar wallets en la sesión
    await refreshSession()

    // Ahora user.xp y user.coins están actualizados
  }

  return <button onClick={handleSubmit}>Enviar Quiz</button>
}
```

---

## 🔒 Seguridad Implementada

### Validaciones
- ✅ Validación de estructura de token
- ✅ Validación de roles permitidos
- ✅ Validación de niveles
- ✅ Verificación de usuario activo

### Protecciones
- ✅ Prevención de timing attacks en login
- ✅ Sanitización de datos de usuario
- ✅ No permitir actualizar rol desde cliente
- ✅ Verificación periódica de sesión (5 minutos)
- ✅ Invalidación automática de sesiones de usuarios desactivados

### Cookies
- ✅ httpOnly activado
- ✅ sameSite: 'lax'
- ✅ secure en producción
- ✅ Nombre seguro en producción: `__Secure-next-auth.session-token`

---

## 📊 Integración con Sistema de Gamificación

### Wallets (XP, Coins, Shields)

**Cómo funciona:**
1. Al hacer login, se obtienen los balances de las 3 wallets del usuario
2. Se incluyen en el token JWT
3. Se actualizan automáticamente cada 5 minutos
4. Se pueden actualizar manualmente con `refreshSession()`

**Flujo típico:**
```
Usuario completa quiz
  ↓
Backend actualiza Wallet (XP +50, Coins +10)
  ↓
Frontend llama refreshSession()
  ↓
JWT se actualiza con nuevos valores
  ↓
user.xp y user.coins reflejan los cambios
```

---

## 📚 Documentación Adicional

Ver archivo: `NEXTAUTH_USAGE_EXAMPLES.md` para:
- Ejemplos completos de uso
- Componentes de ejemplo
- APIs protegidas
- Server actions
- Troubleshooting
- Best practices

---

## ✅ Checklist de Implementación

### Proveedores
- [x] Email/Password (Credentials)
- [x] Google OAuth
- [x] Email Magic Link (Resend)

### Callbacks
- [x] JWT callback con xp, coins, level
- [x] Session callback extendida
- [x] SignIn callback con validaciones

### TypeScript
- [x] Tipos para Session
- [x] Tipos para JWT
- [x] Tipos para User
- [x] Interface AuthUser exportada

### Middleware
- [x] Protección de rutas
- [x] Verificación de roles
- [x] Redirección inteligente
- [x] Rutas públicas configuradas

### Hook useAuth()
- [x] login()
- [x] loginWithGoogle()
- [x] loginWithEmail()
- [x] logout()
- [x] refreshSession()
- [x] updateSessionData()
- [x] hasRole()
- [x] isAdmin()
- [x] isEmployee()

### Componentes
- [x] ProtectedRoute
- [x] Páginas de login existentes

### Seguridad
- [x] Validación de tokens
- [x] Sanitización de datos
- [x] Verificación periódica
- [x] Cookies seguras
- [x] Role-based access control

### Gamificación
- [x] XP desde Wallet
- [x] Coins desde Wallet
- [x] Shields desde Wallet
- [x] Actualización automática
- [x] Sincronización manual

### Documentación
- [x] Guía de uso completa
- [x] Ejemplos de código
- [x] Troubleshooting
- [x] Variables de entorno

---

## 🎯 Próximos Pasos Sugeridos

1. **Configurar Google OAuth:**
   - Crear proyecto en Google Cloud Console
   - Obtener Client ID y Client Secret
   - Configurar URLs autorizadas

2. **Configurar Resend:**
   - Crear cuenta en Resend
   - Verificar dominio
   - Obtener API Key

3. **Testing:**
   - Probar login con credenciales
   - Probar login con Google
   - Probar magic link
   - Verificar actualización de wallets
   - Probar protección de rutas

4. **Producción:**
   - Generar nuevo NEXTAUTH_SECRET
   - Configurar NEXTAUTH_URL con dominio real
   - Habilitar cookies seguras
   - Configurar rate limiting adicional

---

## 🐛 Debugging

### Ver logs de autenticación

En desarrollo, NextAuth muestra logs detallados. Para ver más información:

```typescript
// src/lib/auth-options.ts
export const authOptions: NextAuthOptions = {
  // ...
  debug: process.env.NODE_ENV === 'development', // Ya configurado
}
```

### Verificar sesión en componente

```typescript
import { useSession } from 'next-auth/react'

export default function Debug() {
  const { data: session, status } = useSession()

  return (
    <pre>
      Status: {status}
      {JSON.stringify(session, null, 2)}
    </pre>
  )
}
```

---

## 📞 Soporte

Para cualquier duda o problema con la configuración de NextAuth.js, contactar al equipo de desarrollo.

**Configuración completada:** ✅
**Fecha:** Enero 2026
**Versión:** 2.0 (con Gamificación V2.0)
