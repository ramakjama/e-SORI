# 📝 Sistema de Registro Autónomo

## 🎯 Resumen

Sistema de registro independiente con verificación por email mediante código de 6 dígitos.

**Flujo:**
1. Usuario proporciona nombre + email
2. Sistema envía código de 6 dígitos al email
3. Usuario introduce código en la app
4. ✅ Registro completado, puede hacer login

---

## 🔐 Seguridad y Autenticación

### OAuth Requiere Registro Previo

**IMPORTANTE**: OAuth (Google/Microsoft/Apple) ahora **SOLO funciona para usuarios ya registrados**.

```
Usuario intenta login con Google:
         ↓
¿Existe en BD?
         ↓
    ┌────┴────┐
   NO        SÍ
    ↓         ↓
Rechazar   ¿Email verificado?
    ↓         ↓
Redirigir  ┌──┴──┐
a /registro NO  SÍ
            ↓    ↓
         Rechazar Permitir
                  ↓
              Dashboard
```

### Cambios en auth-options.ts

```typescript
async signIn({ user, account, profile }) {
  if (account && user.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    })

    if (!dbUser) {
      // ❌ RECHAZAR - Usuario debe registrarse primero
      console.log(`❌ Login OAuth rechazado: ${user.email} no está registrado`)
      return false
    }

    if (!dbUser.emailVerified) {
      // ❌ RECHAZAR - Email no verificado
      console.log(`❌ Login rechazado: email no verificado`)
      return false
    }

    // ✅ Permitir acceso
    return true
  }
}
```

---

## 📋 Flujo de Registro Completo

### Paso 1: Solicitud de Registro

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

**Proceso:**
1. Valida formato de email
2. Verifica si ya existe:
   - Si existe y verificado → Error "Ya registrado"
   - Si existe y NO verificado → Reenvía código
   - Si NO existe → Crea usuario temporal
3. Genera código aleatorio de 6 dígitos
4. Guarda en `verificationToken` (expira en 15 min)
5. Envía email con código

**Response (éxito):**
```json
{
  "success": true,
  "message": "Código de verificación enviado a tu email",
  "email": "juan@example.com"
}
```

**Response (desarrollo sin Resend):**
```json
{
  "success": true,
  "message": "Código de verificación generado (modo desarrollo)",
  "code": "123456"  // Solo visible en desarrollo
}
```

### Paso 2: Verificación de Código

**Endpoint:** `POST /api/auth/verify`

**Request:**
```json
{
  "email": "juan@example.com",
  "code": "123456"
}
```

**Proceso:**
1. Busca código en BD
2. Verifica que no haya expirado (15 min)
3. Si válido:
   - Marca `emailVerified = NOW()`
   - Crea wallets (XP: 0, COINS: 100, SHIELDS: 0)
   - Elimina código usado
4. Usuario puede hacer login

**Response (éxito):**
```json
{
  "success": true,
  "message": "Email verificado correctamente. Ya puedes iniciar sesión.",
  "user": {
    "id": "user_123",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "level": "BRONCE"
  }
}
```

**Response (error):**
```json
{
  "error": "Código incorrecto o expirado"
}
```

### Paso 3: Login

Después de verificar el email, el usuario puede:
- Hacer login con OAuth (Google/Microsoft/Apple)
- O usar modo demo (temporal)

---

## 📧 Email de Verificación

### Template

El email enviado contiene:

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Soriano e-Cliente</h1>
    <h2>¡Bienvenido, Juan!</h2>
    <p>Tu código de verificación es:</p>

    <div style="font-size: 32px; font-weight: bold;">
      123456
    </div>

    <p>Este código expirará en 15 minutos.</p>
  </body>
</html>
```

### Configuración de Resend

**Variables de entorno necesarias:**

```env
# Resend (envío de emails)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@sorianomediadores.es
```

Si `RESEND_API_KEY` no está configurado, el sistema funciona en **modo desarrollo** y devuelve el código en la respuesta JSON.

---

## 🖥️ Interfaz de Usuario

### Página de Registro

**Ruta:** `/registro`

**Componente:** `src/app/(auth)/registro/page.tsx`

#### Paso 1: Información

```
┌─────────────────────────────┐
│      [🛡️ Logo]             │
│                              │
│      Registro                │
│                              │
│  Nombre completo             │
│  [👤] ___________________   │
│                              │
│  Email                       │
│  [📧] ___________________   │
│                              │
│  [ Continuar → ]             │
│                              │
│  ¿Ya tienes cuenta?          │
│  Inicia sesión               │
└─────────────────────────────┘
```

#### Paso 2: Verificación

```
┌─────────────────────────────┐
│  [← Volver]                 │
│                              │
│      [📧]                   │
│  Verifica tu email           │
│                              │
│  Código enviado a:           │
│  juan@example.com            │
│                              │
│  [1] [2] [3] [4] [5] [6]    │
│                              │
│  [ Verificar ✓ ]             │
│                              │
│  Reenviar código             │
└─────────────────────────────┘
```

#### Paso 3: Éxito

```
┌─────────────────────────────┐
│      [✓ Verde]              │
│  ¡Registro completado!       │
│                              │
│  Tu cuenta ha sido creada    │
│  exitosamente.               │
│                              │
│  Redirigiendo al login...    │
│  [⏳]                        │
└─────────────────────────────┘
```

### Página de Login Actualizada

**Cambios:**

```tsx
// Manejo de error OAuth si no está registrado
if (result?.error === 'Callback') {
  toast.error('No tienes una cuenta registrada. Regístrate primero.')
  setTimeout(() => {
    router.push('/registro')
  }, 2000)
}

// Link a registro
<div className="mt-6">
  <span>¿Primera vez aquí?</span>
  <Link href="/registro">
    Regístrate gratis →
  </Link>
</div>
```

---

## 🔧 APIs Disponibles

### 1. POST /api/auth/register

Inicia el proceso de registro.

**Validaciones:**
- Email válido (formato)
- Nombre no vacío
- Email no registrado (o no verificado)

**Acciones:**
- Crea usuario temporal
- Genera código de 6 dígitos
- Envía email
- Expira en 15 minutos

### 2. POST /api/auth/verify

Verifica el código y activa la cuenta.

**Validaciones:**
- Código de 6 dígitos
- Código válido en BD
- No expirado (< 15 min)

**Acciones:**
- Marca `emailVerified = NOW()`
- Crea wallets
- Elimina código usado

### 3. PUT /api/auth/verify

Reenvía código de verificación.

**Validaciones:**
- Usuario existe
- Email NO verificado

**Respuesta:**
```json
{
  "success": true,
  "message": "Solicita un nuevo código en /api/auth/register"
}
```

---

## 🗃️ Base de Datos

### Tabla: users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  emailVerified TIMESTAMP NULL,  -- NULL hasta verificar
  role TEXT NOT NULL DEFAULT 'CLIENTE',
  level TEXT NOT NULL DEFAULT 'BRONCE',
  points INTEGER NOT NULL DEFAULT 0,
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Tabla: verificationToken

```sql
CREATE TABLE verificationToken (
  identifier TEXT NOT NULL,  -- Email
  token TEXT NOT NULL,       -- Código de 6 dígitos
  expires TIMESTAMP NOT NULL, -- 15 minutos desde creación
  PRIMARY KEY (identifier, token)
);
```

### Tabla: wallet

```sql
CREATE TABLE wallet (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,     -- 'XP', 'COINS', 'SHIELDS'
  balance INTEGER NOT NULL DEFAULT 0,
  UNIQUE(userId, type)
);
```

---

## 🧪 Testing

### Flujo Completo en Desarrollo

```bash
# 1. Iniciar servidor
npm run dev

# 2. Ir a http://localhost:3000/registro

# 3. Introducir datos
# Nombre: Test User
# Email: test@example.com

# 4. Ver código en consola del servidor o en respuesta JSON
# Console: [Register] ⚠️ Resend no configurado. Código: 123456

# 5. Introducir código en la app
# [1] [2] [3] [4] [5] [6]

# 6. ✅ Registro completado

# 7. Ir a /login-cliente

# 8. Hacer login con Google usando test@example.com
# ✅ Funciona porque ya está registrado y verificado
```

### Testing con Resend Configurado

```bash
# 1. Configurar .env.local
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=noreply@sorianomediadores.es

# 2. Registrarse
POST /api/auth/register
{
  "name": "Test User",
  "email": "tu-email-real@gmail.com"
}

# 3. Revisar tu email real
# Recibirás un email con el código

# 4. Verificar código
POST /api/auth/verify
{
  "email": "tu-email-real@gmail.com",
  "code": "123456"
}

# 5. ✅ Verificado
```

### Testing de Rechazo OAuth

```bash
# 1. Intenta login con Google usando email NO registrado
# Resultado: ❌ Error "No estás registrado"

# 2. Usuario es redirigido a /registro

# 3. Registrarse con ese email

# 4. Verificar email

# 5. Volver a intentar login con Google
# Resultado: ✅ Funciona
```

---

## 📊 Estados del Usuario

### Estado 1: Usuario Temporal (NO verificado)

```javascript
{
  email: "juan@example.com",
  name: "Juan Pérez",
  emailVerified: null,  // ← NO verificado
  role: "CLIENTE",
  level: "BRONCE",
  isActive: true
}
```

**Puede:**
- ❌ NO puede hacer login
- ✅ Puede solicitar nuevo código

### Estado 2: Usuario Verificado

```javascript
{
  email: "juan@example.com",
  name: "Juan Pérez",
  emailVerified: "2026-01-27T10:30:00Z",  // ← Verificado
  role: "CLIENTE",
  level: "BRONCE",
  isActive: true
}
```

**Puede:**
- ✅ Hacer login con OAuth
- ✅ Hacer login con modo demo
- ✅ Acceder a todas las funcionalidades

---

## 🔒 Seguridad

### Protecciones Implementadas

1. **Códigos de un solo uso**
   - Eliminados después de usarse
   - No reutilizables

2. **Expiración temporal**
   - Códigos expiran en 15 minutos
   - Códigos expirados se eliminan automáticamente

3. **Validación de email**
   - Formato válido requerido
   - Normalización (lowercase, trim)

4. **Límite de longitud**
   - Código exactamente 6 dígitos
   - No más, no menos

5. **OAuth seguro**
   - Solo usuarios verificados pueden usar OAuth
   - No se crean cuentas automáticamente

### Consideraciones de Producción

⚠️ **Para producción, añadir:**

1. **Rate limiting**
   - Máx 3 intentos de verificación por código
   - Máx 5 solicitudes de código por hora por email

2. **CAPTCHA**
   - En formulario de registro
   - Prevenir bots

3. **Lista de dominios bloqueados**
   - Emails temporales no permitidos
   - Lista negra de dominios sospechosos

4. **Logs de seguridad**
   - Registrar intentos fallidos
   - Alertar sobre patrones sospechosos

---

## 📚 Resumen

1. ✅ **Registro autónomo** con código de 6 dígitos
2. ✅ **Verificación por email** obligatoria
3. ✅ **OAuth requiere** usuario registrado previamente
4. ✅ **Flujo UX completo** con 3 pasos visuales
5. ✅ **Modo desarrollo** sin necesidad de Resend
6. ✅ **Seguridad robusta** con expiración y validaciones
7. ✅ **Bonus de bienvenida** (100 COINS)

---

**Sistema de registro completamente funcional y seguro** 🚀
