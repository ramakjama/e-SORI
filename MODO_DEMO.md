# 🎮 Modo DEMO - Acceso Rápido

## ✨ ¿Qué es el Modo Demo?

El **Modo Demo** te permite probar la aplicación **sin necesidad de configurar OAuth** (Google, Microsoft, Apple).

Es perfecto para:
- 🚀 Probar la aplicación inmediatamente
- 🔧 Desarrollar mientras configuras las credenciales de Google
- 👀 Ver todas las funcionalidades sin crear cuenta real
- 🎯 Demostrar la app a clientes

---

## 🎯 Cómo Usar el Modo Demo

### Opción 1: Desde la Interfaz

1. Ve a `http://localhost:3000`
2. Verás la página de login con botones de OAuth
3. Baja hasta el botón **"Acceder en Modo Demo"** 🎮
4. Haz clic
5. ✅ **¡Entras automáticamente como cliente demo!**

### Opción 2: Credenciales Directas

También puedes usar las credenciales del usuario demo manualmente:

```
Email: demo@soriano-cliente.com
Contraseña: demo123
```

Haz clic en "Acceder con Email" y usa estas credenciales.

---

## 👤 Características del Usuario Demo

El usuario demo tiene:

| Propiedad | Valor |
|-----------|-------|
| **Email** | `demo@soriano-cliente.com` |
| **Contraseña** | `demo123` |
| **Nombre** | Usuario Demo |
| **Rol** | CLIENTE |
| **Nivel** | ORO (especial para demo) |
| **Puntos** | 500 |
| **XP** | 1000 |
| **COINS** | 500 |
| **SHIELDS** | 10 |

---

## 🔄 ¿Cómo Funciona?

### Primera vez que haces clic en "Modo Demo":

1. Se llama a `/api/auth/demo-login`
2. Se crea el usuario `demo@soriano-cliente.com` en la base de datos
3. Se le asignan wallets con saldo inicial
4. Se hace login automático
5. Te redirige al dashboard

### Siguientes veces:

1. Se reutiliza el usuario demo existente
2. Login automático
3. Dashboard

---

## 🎨 Interfaz Actualizada

La página de login ahora tiene:

```
┌─────────────────────────────────┐
│  [Google]  Continuar con Google │
│  [Microsoft] Continuar con MS   │
│  [Apple]  Continuar con Apple   │
│                                  │
│  ──── o con email ────          │
│                                  │
│  [Email] Acceder con Email      │
│                                  │
│  ──── o prueba sin cuenta ────  │
│                                  │
│  [✨] Acceder en Modo Demo      │
└─────────────────────────────────┘
```

---

## 🔐 Comparación: Demo vs OAuth Real

| Característica | Modo Demo | OAuth Real |
|----------------|-----------|------------|
| Requiere Google OAuth | ❌ No | ✅ Sí |
| Datos persistentes | ✅ Sí (en DB) | ✅ Sí (en DB) |
| Email verificado | ✅ Sí | ✅ Sí |
| Usuario único | ⚠️ Compartido | ✅ Personal |
| Acceso completo | ✅ Sí | ✅ Sí |
| Para producción | ❌ No | ✅ Sí |

---

## 🚀 Flujos de Login Disponibles

### 1. OAuth con Google (PRODUCCIÓN)
```
Usuario → Clic en Google → Autoriza → Dashboard
         ↓
    Crea cuenta real automáticamente
    Rol: CLIENTE
    Nivel: BRONCE
```

### 2. OAuth con Microsoft (PRODUCCIÓN)
```
Usuario → Clic en Microsoft → Autoriza → Dashboard
         ↓
    Crea cuenta real automáticamente
    Rol: CLIENTE
    Nivel: BRONCE
```

### 3. OAuth con Apple (PRODUCCIÓN)
```
Usuario → Clic en Apple → Autoriza → Dashboard
         ↓
    Crea cuenta real automáticamente
    Rol: CLIENTE
    Nivel: BRONCE
```

### 4. Email/Contraseña (EMPLEADOS)
```
Usuario → Email + Password → Dashboard
         ↓
    Para empleados/admins preexistentes
```

### 5. Modo Demo (DESARROLLO/PRUEBAS)
```
Usuario → Clic en Demo → Dashboard
         ↓
    Usuario compartido: demo@soriano-cliente.com
    Rol: CLIENTE
    Nivel: ORO
```

---

## 🛠️ Para Desarrolladores

### Crear el usuario demo manualmente

Si quieres resetear o crear el usuario demo:

```bash
# Eliminar usuario demo existente
npx prisma studio
# Buscar y eliminar demo@soriano-cliente.com

# O con SQL
psql -d tu_base_de_datos
DELETE FROM "users" WHERE email = 'demo@soriano-cliente.com';
```

La próxima vez que hagas clic en "Modo Demo", se creará automáticamente.

### Personalizar el usuario demo

Edita el archivo `src/app/api/auth/demo-login/route.ts`:

```typescript
demoUser = await prisma.user.create({
  data: {
    email: demoEmail,
    name: 'Usuario Demo',
    role: 'CLIENTE',
    level: 'PLATINO', // Cambiar nivel
    points: 1000,      // Cambiar puntos
    // ... más configuración
  }
})
```

---

## ⚠️ Advertencias

### Para Desarrollo
✅ **Usa el modo demo libremente** durante el desarrollo
✅ Perfecto para probar funcionalidades
✅ No necesitas configurar OAuth inmediatamente

### Para Producción
❌ **DESACTIVA el modo demo** antes de lanzar a producción
❌ No compartas credenciales del demo públicamente
❌ Los datos del usuario demo pueden ser modificados por cualquiera

### Cómo desactivar en producción

Comenta o elimina el botón de demo en `login-cliente/page.tsx`:

```typescript
// Comentar estas líneas:
// <motion.button onClick={handleDemoLogin}>
//   Acceder en Modo Demo
// </motion.button>
```

O añade una variable de entorno:

```env
ENABLE_DEMO_MODE=false
```

---

## 📊 Resumen

- ✅ **Modo Demo** agregado exitosamente
- ✅ Coexiste con **OAuth real** (Google, Microsoft, Apple)
- ✅ Usuario demo: `demo@soriano-cliente.com` / `demo123`
- ✅ Acceso inmediato sin configuración
- ✅ Perfecto para desarrollo y pruebas
- ⚠️ Desactivar antes de producción

**¡Ahora puedes probar la app inmediatamente mientras configuras Google OAuth! 🎉**
