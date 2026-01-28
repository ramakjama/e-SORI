# 🔐 Credenciales de Acceso - Soriano e-Cliente

## Usuarios Creados

Se han creado **8 usuarios** para el equipo de Soriano Mediadores:

### Administradores (ADMIN)
1. **ramon.soriano@sorianomediadores.es**
2. **direccion@sorianomediadores.es**

### Empleados (EMPLEADO)
3. **laura.fernandez@sorianomediadores.es**
4. **pau.ripoll@sorianomediadores.es**
5. **toni.medina@sorianomediadores.es**
6. **juan.perez@sorianomediadores.es**
7. **hector.nolivos@sorianomediadores.es**
8. **tania.zhyla@sorianomediadores.es**

## Contraseña

**TODOS los usuarios tienen la misma contraseña:**

```
Soriano2024!
```

⚠️ **IMPORTANTE:** Los emails `ramon.soriano@sorianomediadores.es` y `direccion@sorianomediadores.es` tienen la MISMA contraseña y ambos son ADMIN.

## Cómo crear los usuarios en la base de datos

### Opción 1: Script Node.js (Recomendado)

```bash
node scripts/create-users.mjs
```

### Opción 2: SQL Directo

Si tienes acceso directo a PostgreSQL:

```bash
psql -d nombre_de_tu_base_de_datos -f scripts/create-users.sql
```

O desde DBeaver/pgAdmin, ejecuta el contenido del archivo `scripts/create-users.sql`

## Providers OAuth Configurados

El sistema ahora soporta login con:

- ✅ **Email/Contraseña** (credenciales)
- ✅ **Google** (OAuth)
- ✅ **Microsoft** (OAuth) - Requiere configurar MICROSOFT_CLIENT_ID y MICROSOFT_CLIENT_SECRET
- ✅ **Apple** (OAuth) - Requiere configurar APPLE_ID y APPLE_SECRET

## Variables de Entorno Necesarias

Para habilitar los providers OAuth, añade en tu `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_secret_de_google

# Microsoft OAuth
MICROSOFT_CLIENT_ID=tu_client_id_de_microsoft
MICROSOFT_CLIENT_SECRET=tu_secret_de_microsoft
MICROSOFT_TENANT_ID=common  # o tu tenant específico

# Apple OAuth
APPLE_ID=tu_apple_service_id
APPLE_SECRET=tu_apple_secret
```

## Estado de Autenticación

✅ **DEMO_MODE:** DESACTIVADO
✅ **Autenticación:** OBLIGATORIA
✅ **Middleware:** Activo y funcionando

Ahora **NO se puede acceder a ninguna página sin estar autenticado** (excepto login/register).

## Colores de Marca Actualizados

Se ha rediseñado todo el sistema de colores basado en el logo oficial de Soriano:

- **Gris Soriano (Primary):** `#808080`, `#a7a5a5` (del logo)
- **Azul Profesional (Accent):** `#4A90E2` (acción/botones)
- **Tema oscuro:** Negro verdadero con grises sutiles

## Primeros Pasos

1. Ejecuta el script para crear usuarios:
   ```bash
   node scripts/create-users.mjs
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Accede a `http://localhost:3000`

4. Inicia sesión con cualquiera de los emails y la contraseña `Soriano2024!`

## Notas de Seguridad

- 🔒 Todas las contraseñas están hasheadas con bcrypt (10 rounds)
- 🔒 Los usuarios tienen `emailVerified` activado por defecto
- 🔒 Todos los usuarios están marcados como `isActive: true`
- 🔒 Nivel inicial: **PLATINO** para todo el equipo
- 🔒 Wallets creadas automáticamente con 100 coins de bonus

---

**Fecha de creación:** Enero 2026
**Sistema:** Soriano e-Cliente v2.0
**Stack:** Next.js 14 + Prisma + NextAuth + PostgreSQL
