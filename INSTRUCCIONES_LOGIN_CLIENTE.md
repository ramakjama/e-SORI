# 🎯 Instrucciones de Login como Cliente

## ✅ Sistema Configurado para Clientes OAuth

El sistema ahora está **100% configurado** para que te conectes como **CLIENTE** usando tu cuenta de Google, Microsoft o Apple.

---

## 🚀 Cómo Iniciar Sesión

### Opción 1: Login con Google (Recomendado)

1. Ve a `http://localhost:3000`
2. Serás redirigido automáticamente a la página de login
3. Haz clic en **"Continuar con Google"**
4. Selecciona tu cuenta de Gmail
5. ✅ **Entrarás automáticamente como CLIENTE**

### Opción 2: Login con Microsoft

1. Ve a `http://localhost:3000`
2. Haz clic en **"Continuar con Microsoft"**
3. Inicia sesión con tu cuenta Microsoft
4. ✅ **Entrarás automáticamente como CLIENTE**

### Opción 3: Login con Apple

1. Ve a `http://localhost:3000`
2. Haz clic en **"Continuar con Apple"**
3. Inicia sesión con tu Apple ID
4. ✅ **Entrarás automáticamente como CLIENTE**

---

## 🔄 ¿Qué Pasa en el Primer Login?

Cuando te conectas por primera vez con OAuth:

1. **Se crea tu cuenta automáticamente** en la base de datos
2. **Tu rol es CLIENTE** (no empleado ni admin)
3. **Tu nivel inicial es BRONCE**
4. **Recibes 100 COINS de bienvenida**
5. **Se crean tus wallets** (XP, COINS, SHIELDS)
6. **Tu email queda verificado** automáticamente

---

## ⚙️ Configuración Requerida (Solo Primera Vez)

### Variables de Entorno

Para que Google OAuth funcione, necesitas configurar en `.env.local`:

```env
# NextAuth
NEXTAUTH_SECRET="tu_secret_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (REQUERIDO para login con Google)
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"

# Microsoft OAuth (Opcional)
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."
MICROSOFT_TENANT_ID="common"

# Apple OAuth (Opcional)
APPLE_ID="..."
APPLE_SECRET="..."
```

### Cómo Obtener Credenciales de Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto (o selecciona uno existente)
3. Ve a "APIs & Services" > "Credentials"
4. Clic en "Create Credentials" > "OAuth 2.0 Client ID"
5. Tipo de aplicación: **Web application**
6. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copia el **Client ID** y **Client Secret** a tu `.env.local`

---

## 🎮 Flujo Completo de Login

```
1. Usuario → http://localhost:3000
           ↓
2. Redirige automáticamente → /login-cliente
           ↓
3. Usuario hace clic → "Continuar con Google"
           ↓
4. NextAuth → Redirige a Google OAuth
           ↓
5. Usuario → Selecciona cuenta de Gmail
           ↓
6. Google → Autoriza y devuelve a la app
           ↓
7. Sistema → Busca usuario en DB por email
           ↓
8a. Si NO existe → Crea nuevo usuario como CLIENTE
                 → Crea wallets con 100 coins
8b. Si existe → Usa usuario existente
           ↓
9. Sistema → Crea sesión JWT
           ↓
10. Usuario → Redirigido a /dashboard
           ↓
11. ✅ CONECTADO COMO CLIENTE
```

---

## 🗑️ Usuarios Empleados Anteriores

Los usuarios empleados creados anteriormente (`ramon.soriano@...`, etc.) siguen en la base de datos pero **NO se usan para login de clientes**.

Si quieres eliminarlos de la base de datos:

```sql
-- Eliminar usuarios empleados/admins (OPCIONAL)
DELETE FROM "users"
WHERE email LIKE '%@sorianomediadores.es';
```

**Pero NO es necesario eliminarlos** - simplemente no los uses. Conéctate con tu Gmail personal y entrarás como CLIENTE.

---

## ✨ Características del Usuario CLIENTE

Cuando te conectas como CLIENTE, tienes acceso a:

✅ **Dashboard** - Ver tus pólizas y siniestros
✅ **Mis Pólizas** - Gestión de seguros
✅ **Mis Siniestros** - Reportar y seguir siniestros
✅ **Pagos** - Historial de pagos
✅ **Documentos** - Tus documentos de seguros
✅ **Peticiones** - Chat con IA y tickets
✅ **Soriano Club** - Gamificación y recompensas
✅ **Mi Perfil** - Configuración personal

❌ **Panel de Administración** - Solo para ADMIN
❌ **Gestión de Empleados** - Solo para EMPLEADO/ADMIN

---

## 🔒 Seguridad

- ✅ Autenticación OAuth 2.0 segura
- ✅ Sesiones JWT con expiración
- ✅ Cookies httpOnly y secure
- ✅ Email verificado automáticamente
- ✅ No se almacenan contraseñas (OAuth)

---

## 🆘 Problemas Comunes

### "Error al conectar con Google"

**Solución**: Verifica que:
1. Tienes `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` en `.env.local`
2. La URI de redirect está correctamente configurada en Google Cloud Console
3. Has reiniciado el servidor después de añadir las variables

### "No me redirige al dashboard"

**Solución**:
1. Abre DevTools (F12) > Console
2. Busca errores
3. Verifica que la base de datos está corriendo
4. Comprueba que Prisma está configurado correctamente

### "Quiero volver a la selección de tipo de usuario"

Ya no hay selección - el sistema está **optimizado para clientes**. Para login de empleados, ve directamente a `/login-empleado`.

---

## 📝 Resumen

1. ✅ **Login automático** con Google/Microsoft/Apple
2. ✅ **Creación automática** de cuenta como CLIENTE
3. ✅ **100 COINS de bienvenida**
4. ✅ **Acceso completo** a funciones de cliente
5. ✅ **No necesitas contraseña** - OAuth se encarga

**¡Ya puedes usar tu Gmail para entrar! 🎉**
