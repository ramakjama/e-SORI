# 🔐 Sistema de Permisos y Progresión

## 📋 Resumen

El sistema de permisos controla qué funcionalidades están disponibles según el **nivel del cliente** (BRONCE, PLATA, ORO, PLATINO).

Es un sistema **escalable y progresivo**: a mayor nivel, más funcionalidades desbloqueadas.

---

## 🎯 Filosofía del Sistema

### Vinculación OAuth + Usuarios Existentes

Cuando un cliente de la agencia hace login con OAuth (Google, Microsoft, Apple):

1. ✅ **Sistema busca** si el email ya existe en la base de datos
2. ✅ Si **existe**: Vincula el OAuth account con el usuario existente (NO crea duplicado)
3. ✅ Si **no existe**: Crea nuevo usuario como CLIENTE con nivel BRONCE
4. ✅ El **rol y nivel** del usuario existente NO se modifican
5. ✅ Sirve para **trazabilidad** del registro de alta

### Progresión de Niveles

Los clientes suben de nivel ganando **puntos** mediante:

- ✅ Completar quizzes educativos
- ✅ Referir amigos
- ✅ Interactuar con la plataforma
- ✅ Renovar pólizas
- ✅ Logros y desafíos

**Umbrales de puntos:**
- BRONCE: 0 - 999 puntos
- PLATA: 1,000 - 4,999 puntos
- ORO: 5,000 - 14,999 puntos
- PLATINO: 15,000+ puntos

---

## 📊 Permisos por Nivel

### 🥉 BRONCE (Nivel Inicial)

**Disponible para todos los clientes nuevos**

| Categoría | Funcionalidad |
|-----------|---------------|
| Dashboard | Vista básica con métricas simples |
| Pólizas | Ver pólizas, cotizador básico |
| Siniestros | Ver y crear siniestros |
| Pagos | Ver historial de pagos |
| Documentos | Ver documentos, subir hasta 5/mes, 5GB storage |
| Mensajes | Ver y enviar mensajes |
| sori-hub | Acceso básico, quizzes, clasificación |
| Descuentos | 5% de descuento |
| Soporte | Email (respuesta en 24h) |

### 🥈 PLATA (1,000 puntos)

**Todo lo de BRONCE +**

| Categoría | Funcionalidad |
|-----------|---------------|
| Dashboard | Análisis avanzados y gráficas |
| Pólizas | Descargar PDFs, cotizador avanzado |
| Siniestros | Tracking en tiempo real |
| Pagos | Fraccionamiento de pagos |
| Documentos | Subidas ilimitadas, 20GB storage |
| Soporte | Chat en tiempo real (respuesta en 12h) |
| sori-hub | Referidos, logros, marketplace (vista) |
| Descuentos | 10% de descuento |

### 🏆 ORO (5,000 puntos)

**Todo lo de PLATA +**

| Categoría | Funcionalidad |
|-----------|---------------|
| Pólizas | Renovación automática |
| Siniestros | Atención prioritaria |
| Pagos | Domiciliación bancaria |
| Mensajes | Mensajes prioritarios |
| sori-hub | Marketplace (compras), contenido premium |
| Descuentos | 15% de descuento |
| Soporte | Prioritario (respuesta en 1h) |

### 👑 PLATINO (15,000 puntos)

**Todo lo de ORO +**

| Categoría | Funcionalidad |
|-----------|---------------|
| Documentos | Almacenamiento ilimitado |
| Mensajes | Videollamadas con tu gestor |
| Soporte | Gestor dedicado 24/7, respuesta inmediata |
| Descuentos | 20% de descuento |
| sori-hub | Acceso total a funcionalidades premium |

---

## 💻 Uso en Código

### 1. Importar Sistema de Permisos

```typescript
import { FeatureGate, FeatureBadge } from '@/components/permissions/FeatureGate'
import { usePermissions } from '@/hooks/usePermissions'
```

### 2. Proteger Funcionalidades con FeatureGate

```tsx
// En cualquier componente
export function AdvancedQuoteSection() {
  return (
    <FeatureGate feature="polizas.cotizar.advanced">
      {/* Este contenido solo se muestra a usuarios PLATA o superior */}
      <AdvancedQuoteForm />
    </FeatureGate>
  )
}
```

Si el usuario NO tiene acceso, se muestra automáticamente un mensaje visual:
- 🔒 Icono de candado
- Nivel requerido para desbloquear
- Botón para ver cómo subir de nivel
- Botón para comprar acceso directo (marketplace)

### 3. Mostrar Badge de Nivel Requerido

```tsx
<button>
  Cotizador Avanzado
  <FeatureBadge feature="polizas.cotizar.advanced" />
</button>
```

Si el usuario no tiene acceso, muestra: `🔒 🥈 Plata`

### 4. Verificar Permisos en Lógica

```tsx
function MyComponent() {
  const { hasFeature, canAccess, levelInfo, progress } = usePermissions()

  if (hasFeature('polizas.renovacion.auto')) {
    // Mostrar opción de renovación automática
  }

  return (
    <div>
      <h3>Tu nivel: {levelInfo.icon} {levelInfo.name}</h3>
      <p>Puntos: {progress.currentPoints}</p>
      <p>Progreso: {progress.progressPercentage}%</p>
      {progress.nextLevel && (
        <p>Faltan {progress.pointsToNext} puntos para {progress.nextLevel}</p>
      )}
    </div>
  )
}
```

### 5. Fallback Personalizado

```tsx
<FeatureGate
  feature="mensajes.video.call"
  fallback={<p>Las videollamadas están disponibles para clientes PLATINO</p>}
>
  <VideoCallButton />
</FeatureGate>
```

### 6. Ocultar sin Mensaje

```tsx
<FeatureGate feature="soporte.dedicated" showUpgrade={false}>
  <DedicatedManagerSection />
</FeatureGate>
```

Si no tiene acceso, NO muestra nada (ni mensaje de upgrade).

---

## 🔧 Añadir Nuevos Permisos

### Paso 1: Definir Feature en `src/lib/permissions.ts`

```typescript
export type Feature =
  | 'dashboard.view'
  | 'polizas.view'
  // ... existentes
  | 'nueva-funcionalidad.acceso' // ← Añadir aquí
```

### Paso 2: Asignar a Niveles

```typescript
export const LEVEL_PERMISSIONS: Record<UserLevel, Feature[]> = {
  BRONCE: [
    'dashboard.view',
    // ... no incluir la nueva
  ],
  PLATA: [
    // ... heredados
    'nueva-funcionalidad.acceso', // ← Añadir al nivel deseado
  ],
  // ...
}
```

### Paso 3: Usar en Componentes

```tsx
<FeatureGate feature="nueva-funcionalidad.acceso">
  <NuevaFuncionalidad />
</FeatureGate>
```

---

## 📈 Gamificación y Progresión

### Ganar Puntos

Los puntos se otorgan mediante acciones:

```typescript
// En cualquier API route o acción
import { prisma } from '@/lib/prisma'

// Otorgar puntos
await prisma.user.update({
  where: { id: userId },
  data: {
    points: { increment: 50 } // +50 puntos
  }
})

// Verificar si subió de nivel
const user = await prisma.user.findUnique({ where: { id: userId } })
const newLevel = calculateLevel(user.points)

if (newLevel !== user.level) {
  await prisma.user.update({
    where: { id: userId },
    data: { level: newLevel }
  })

  // Enviar notificación de subida de nivel
  await sendLevelUpNotification(userId, newLevel)
}
```

### Eventos que Otorgan Puntos

| Acción | Puntos |
|--------|--------|
| Completar quiz | 20-100 (según dificultad) |
| Referir amigo | 200 |
| Renovar póliza | 100 |
| Completar perfil | 50 |
| Primera póliza | 150 |
| Interacción diaria | 10 |
| Logro especial | Variable |

---

## 🚀 Ejemplos de Uso Real

### Ejemplo 1: Página de Pólizas

```tsx
// src/app/(dashboard)/polizas/page.tsx
'use client'

import { FeatureGate } from '@/components/permissions/FeatureGate'
import { usePermissions } from '@/hooks/usePermissions'

export default function PolizasPage() {
  const { hasFeature } = usePermissions()

  return (
    <div>
      <h1>Mis Pólizas</h1>

      {/* Todos pueden ver sus pólizas */}
      <PolicyList />

      {/* Solo PLATA+ pueden descargar PDFs */}
      <FeatureGate feature="polizas.download">
        <button>Descargar todas las pólizas (PDF)</button>
      </FeatureGate>

      {/* Solo ORO+ tienen renovación automática */}
      {hasFeature('polizas.renovacion.auto') && (
        <AutoRenewalSettings />
      )}

      {/* Cotizador */}
      <div>
        <h2>Cotizar Nueva Póliza</h2>

        {/* BRONCE: Cotizador básico */}
        <BasicQuoteForm />

        {/* PLATA+: Cotizador avanzado */}
        <FeatureGate feature="polizas.cotizar.advanced">
          <AdvancedQuoteForm />
        </FeatureGate>
      </div>
    </div>
  )
}
```

### Ejemplo 2: Página de Soporte

```tsx
// src/app/(dashboard)/soporte/page.tsx
'use client'

import { usePermissions } from '@/hooks/usePermissions'
import { FeatureGate } from '@/components/permissions/FeatureGate'

export default function SoportePage() {
  const { levelInfo } = usePermissions()

  return (
    <div>
      <h1>Soporte</h1>

      <div className="alert">
        <p>Tiempo de respuesta estimado: {levelInfo.supportResponseTime}</p>
      </div>

      {/* Todos: Email */}
      <EmailSupportForm />

      {/* PLATA+: Chat en vivo */}
      <FeatureGate feature="soporte.chat">
        <LiveChatWidget />
      </FeatureGate>

      {/* ORO+: Soporte prioritario */}
      <FeatureGate feature="soporte.priority">
        <PrioritySupportBadge />
      </FeatureGate>

      {/* PLATINO: Gestor dedicado */}
      <FeatureGate feature="soporte.dedicated">
        <DedicatedManagerCard />
        <ScheduleVideoCallButton />
      </FeatureGate>
    </div>
  )
}
```

### Ejemplo 3: Página de Documentos

```tsx
// src/app/(dashboard)/documentos/page.tsx
'use client'

import { usePermissions } from '@/hooks/usePermissions'
import { FeatureGate } from '@/components/permissions/FeatureGate'

export default function DocumentosPage() {
  const { hasFeature, levelInfo } = usePermissions()

  // Determinar límites según nivel
  const storageLimit = hasFeature('documentos.storage.unlimited')
    ? 'Ilimitado'
    : hasFeature('documentos.storage.20gb')
    ? '20 GB'
    : '5 GB'

  const uploadLimit = hasFeature('documentos.upload.unlimited')
    ? 'Ilimitadas'
    : '5 por mes'

  return (
    <div>
      <h1>Mis Documentos</h1>

      <div className="storage-info">
        <p>Almacenamiento: {storageLimit}</p>
        <p>Subidas permitidas: {uploadLimit}</p>
      </div>

      <DocumentList />

      {/* Formulario de subida con límites */}
      <FeatureGate feature="documentos.upload.basic">
        <UploadForm maxFiles={hasFeature('documentos.upload.unlimited') ? undefined : 5} />
      </FeatureGate>

      {/* Promoción para upgrade */}
      {!hasFeature('documentos.storage.unlimited') && (
        <div className="upgrade-prompt">
          <p>¿Necesitas más espacio?</p>
          <button>Subir a nivel {levelInfo.nextLevel}</button>
        </div>
      )}
    </div>
  )
}
```

---

## 🎨 Personalización Visual

### Badges de Nivel

Los badges usan clases CSS definidas en `globals.css`:

```css
.badge-bronce {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
  color: white;
}

.badge-plata {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: white;
}

.badge-oro {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
}

.badge-platino {
  background: linear-gradient(135deg, #E5E4E2, #9370DB);
  color: white;
}
```

### Colores por Nivel

```typescript
const levelColors = {
  BRONCE: 'from-amber-700 to-amber-900',
  PLATA: 'from-gray-400 to-gray-600',
  ORO: 'from-yellow-500 to-yellow-700',
  PLATINO: 'from-purple-500 to-purple-700',
}
```

---

## 🔒 Seguridad

### Validación en Backend

⚠️ **IMPORTANTE**: Las restricciones de frontend NO son suficientes.

**Siempre validar permisos en el backend:**

```typescript
// src/app/api/polizas/advanced-quote/route.ts
import { getServerSession } from 'next-auth'
import { authOptions, hasPermission } from '@/lib/auth-options'
import { hasPermission } from '@/lib/permissions'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Verificar permiso en backend
  if (!hasPermission(session.user.level, 'polizas.cotizar.advanced')) {
    return new Response(
      JSON.stringify({ error: 'Esta funcionalidad requiere nivel PLATA o superior' }),
      { status: 403 }
    )
  }

  // Procesar solicitud...
}
```

---

## 📚 Resumen

1. ✅ **OAuth vincula** usuarios existentes (no crea duplicados)
2. ✅ **Niveles progresan** con puntos: BRONCE → PLATA → ORO → PLATINO
3. ✅ **Cada nivel** desbloquea más funcionalidades
4. ✅ **FeatureGate** controla acceso en UI
5. ✅ **usePermissions** hook para lógica
6. ✅ **Backend valida** permisos (seguridad)
7. ✅ **Sistema escalable** - fácil añadir nuevas funcionalidades

---

**El sistema está listo para escalar con el crecimiento de tu plataforma** 🚀
