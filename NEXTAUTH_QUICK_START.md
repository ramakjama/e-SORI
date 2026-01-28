# NextAuth.js - Quick Start Guide

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://user:password@localhost:5432/soriano_ecliente
```

### 2. Instalar Dependencias (Ya instalado)

```bash
npm install next-auth @auth/prisma-adapter bcryptjs resend
```

### 3. Usar en Client Component

```typescript
'use client'

import { useAuth } from '@/lib/auth'

export default function MyComponent() {
  const { user, login, logout } = useAuth()

  if (!user) return <div>No autenticado</div>

  return (
    <div>
      <h1>Hola {user.name}</h1>
      <p>XP: {user.xp} | Coins: {user.coins}</p>
      <button onClick={logout}>Salir</button>
    </div>
  )
}
```

### 4. Usar en Server Component

```typescript
import { requireAuthOrRedirect } from '@/lib/auth-server'

export default async function ProfilePage() {
  const user = await requireAuthOrRedirect()

  return (
    <div>
      <h1>Perfil de {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
```

### 5. Proteger Ruta con Componente

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

### 6. API Route Protegida

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ data: 'Protected data' })
}
```

## 📚 Archivos Principales

### Cliente (Client Components)
- `@/lib/auth` - Hook `useAuth()`
- `@/lib/auth-helpers` - Helpers de formateo y validación
- `@/components/auth/ProtectedRoute` - Componente protector

### Servidor (Server Components/Actions)
- `@/lib/auth-server` - Funciones de servidor
- `@/lib/auth-options` - Configuración de NextAuth

## 🔑 API del Hook useAuth()

```typescript
const {
  user,              // Datos completos del usuario
  isLoading,         // Estado de carga
  isAuthenticated,   // Si está autenticado
  login,             // Login con email/password
  loginWithGoogle,   // Login con Google
  loginWithEmail,    // Magic link por email
  logout,            // Cerrar sesión
  refreshSession,    // Actualizar wallets (XP, Coins)
  hasRole,           // Verificar rol
  isAdmin,           // Es admin?
  isEmployee,        // Es empleado o admin?
} = useAuth()
```

## 💾 Datos del Usuario

```typescript
interface AuthUser {
  id: string
  email: string
  name?: string
  role: 'CLIENTE' | 'EMPLEADO' | 'ADMIN'
  level: 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'
  points: number      // Puntos v1
  xp: number         // Experiencia (Wallet)
  coins: number      // Monedas (Wallet)
  shields: number    // Escudos (Wallet)
  referralCode: string | null
}
```

## 🎮 Actualizar Wallets

Después de cualquier acción que modifique XP, Coins o Shields:

```typescript
const { refreshSession } = useAuth()

// Completar quiz, comprar en tienda, etc.
await fetch('/api/quiz/submit', { method: 'POST', body: ... })

// Actualizar sesión para reflejar nuevos valores
await refreshSession()

// Ahora user.xp y user.coins están actualizados
```

## 🔐 Verificar Roles

```typescript
// En Client Component
const { hasRole, isAdmin } = useAuth()

if (hasRole('ADMIN')) {
  // Mostrar opciones de admin
}

if (isAdmin()) {
  // Mostrar panel de admin
}
```

```typescript
// En Server Component
import { hasRole, isAdmin } from '@/lib/auth-server'

const canManage = await hasRole('EMPLEADO')
const isAdminUser = await isAdmin()
```

## 📖 Documentación Completa

- `NEXTAUTH_SETUP_COMPLETE.md` - Setup completo y checklist
- `NEXTAUTH_USAGE_EXAMPLES.md` - Ejemplos detallados de uso

## ⚡ Snippets Útiles

### Login Form

```typescript
const { login } = useAuth()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const result = await login(email, password)

  if (!result.success) {
    alert(result.error)
  }
  // Redirect automático a /dashboard si es exitoso
}
```

### Botón de Logout

```typescript
const { logout } = useAuth()

<button onClick={logout}>Cerrar Sesión</button>
```

### Mostrar Stats de Gamificación

```typescript
const { user } = useAuth()

<div>
  <StatCard label="XP" value={user?.xp || 0} />
  <StatCard label="Coins" value={user?.coins || 0} />
  <StatCard label="Nivel" value={user?.level || 'BRONCE'} />
</div>
```

## 🐛 Troubleshooting

### Session undefined
Asegúrate de tener `SessionProvider` en el layout raíz.

### Wallets no actualizan
Llama a `refreshSession()` después de modificar wallets.

### Error de autenticación
Verifica que `NEXTAUTH_SECRET` esté configurado en `.env.local`.

---

**¿Necesitas más ayuda?** Ver `NEXTAUTH_USAGE_EXAMPLES.md`
