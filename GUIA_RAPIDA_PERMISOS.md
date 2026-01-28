# ⚡ Guía Rápida - Sistema de Permisos

## 🎯 Lo Esencial

### OAuth vincula usuarios existentes
- Si el email YA existe → Vincula OAuth (no crea duplicado)
- Si el email NO existe → Crea nuevo cliente BRONCE

### Niveles desbloquean funcionalidades
- BRONCE (0 pts): Básico
- PLATA (1K pts): Avanzado
- ORO (5K pts): Premium
- PLATINO (15K pts): VIP

---

## 💻 Código Básico

### Frontend: Proteger funcionalidad

```tsx
import { FeatureGate } from '@/components/permissions/FeatureGate'

<FeatureGate feature="polizas.cotizar.advanced">
  <AdvancedQuoteForm />
</FeatureGate>
```

### Frontend: Verificar permiso

```tsx
import { usePermissions } from '@/hooks/usePermissions'

const { hasFeature, levelInfo } = usePermissions()

if (hasFeature('polizas.renovacion.auto')) {
  // Mostrar función
}
```

### Backend: Proteger API

```typescript
import { withPermission, ApiResponse } from '@/lib/api-permissions'

export const POST = withPermission('polizas.cotizar.advanced', async (req, session) => {
  return ApiResponse.success(data)
})
```

---

## 🔧 Añadir Nueva Funcionalidad

### 1. Definir en `src/lib/permissions.ts`

```typescript
export type Feature =
  | 'mi.nueva.funcionalidad' // ← Añadir aquí
```

### 2. Asignar a nivel

```typescript
export const LEVEL_PERMISSIONS = {
  ORO: [
    'mi.nueva.funcionalidad', // ← Añadir al nivel deseado
  ],
}
```

### 3. Usar

```tsx
<FeatureGate feature="mi.nueva.funcionalidad">
  <MiComponente />
</FeatureGate>
```

---

## 📊 Permisos Principales

| Feature | Nivel |
|---------|-------|
| `polizas.view` | BRONCE |
| `polizas.cotizar.advanced` | PLATA |
| `polizas.renovacion.auto` | ORO |
| `documentos.storage.unlimited` | PLATINO |
| `mensajes.video.call` | PLATINO |
| `soporte.dedicated` | PLATINO |

---

## 🚀 Ejemplos Rápidos

### Mostrar badge de nivel requerido

```tsx
import { FeatureBadge } from '@/components/permissions/FeatureGate'

<button>
  Función Premium <FeatureBadge feature="mi.feature" />
</button>
```

### Obtener info de nivel actual

```tsx
const { levelInfo, progress } = usePermissions()

console.log(levelInfo.name) // "Oro"
console.log(levelInfo.discount) // "15%"
console.log(progress.pointsToNext) // 2500
```

### API con múltiples validaciones

```typescript
// Requiere autenticación
export const GET = withAuth(async (req, session) => {
  return ApiResponse.success({ user: session.user })
})

// Requiere permiso específico
export const POST = withPermission('feature.premium', async (req, session) => {
  return ApiResponse.success(data)
})

// Requiere rol ADMIN
export const DELETE = withRole('ADMIN', async (req, session) => {
  return ApiResponse.success({ deleted: true })
})
```

---

## 🔍 Debugging

### Ver nivel actual en consola

```tsx
const { levelInfo, permissions } = usePermissions()
console.log('Nivel:', levelInfo.level)
console.log('Permisos:', permissions)
```

### Cambiar nivel temporalmente (DEV)

```sql
UPDATE users SET level = 'ORO', points = 5000 WHERE email = 'tu@email.com';
```

---

## 📚 Archivos Clave

- `src/lib/permissions.ts` - Sistema central
- `src/lib/api-permissions.ts` - Middleware API
- `src/components/permissions/FeatureGate.tsx` - Componente UI
- `src/hooks/usePermissions.ts` - Hook React
- `SISTEMA_PERMISOS.md` - Documentación completa
- `IMPLEMENTACION_COMPLETA.md` - Resumen técnico

---

**¡Listo para usar! 🎉**
