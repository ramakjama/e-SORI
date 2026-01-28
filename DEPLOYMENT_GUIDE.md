# 🚀 Guía de Deployment - e-SORI (Soriano Mediadores)

Esta guía te ayudará a desplegar todas las funcionalidades implementadas en producción.

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Variables de Entorno](#variables-de-entorno)
3. [Base de Datos](#base-de-datos)
4. [Servicios Externos](#servicios-externos)
5. [Deployment en Vercel](#deployment-en-vercel)
6. [Configuración Post-Deployment](#configuración-post-deployment)
7. [Testing](#testing)
8. [Monitoreo](#monitoreo)

---

## Pre-requisitos

Antes de comenzar, asegúrate de tener:

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ instalado y configurado
- [ ] Cuenta en Vercel (hobby o pro)
- [ ] Cuenta en Resend (para emails)
- [ ] Git configurado

---

## Variables de Entorno

### 1. Copiar el template

```bash
cp .env.example .env.local
```

### 2. Configurar variables críticas

#### Base de Datos (PostgreSQL)

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/esori_db?schema=public"
```

**Producción en Vercel:**
1. Ve a tu proyecto en Vercel
2. Settings → Storage → Create Database → PostgreSQL
3. Copia el `DATABASE_URL` generado

#### NextAuth

```bash
# Generar NEXTAUTH_SECRET
openssl rand -base64 32
```

```env
NEXTAUTH_URL=https://app.sorianomediadores.es
NEXTAUTH_SECRET=tu-secret-generado-aqui
```

#### Resend (Email Automation)

1. Crea una cuenta en [resend.com](https://resend.com)
2. Ve a API Keys → Create API Key
3. Copia la key:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_EMAIL_FROM=renovaciones@sorianomediadores.es
```

**IMPORTANTE:** Verifica tu dominio en Resend:
1. Settings → Domains → Add Domain
2. Añade los registros DNS que te proporcionen
3. Espera la verificación (puede tardar hasta 48h)

#### Cron Jobs

```bash
# Generar CRON_SECRET
openssl rand -base64 32
```

```env
CRON_SECRET=tu-cron-secret-aqui
```

#### URLs Base

```env
NEXT_PUBLIC_APP_URL=https://app.sorianomediadores.es
```

### 3. Variables Opcionales (OAuth Providers)

Si quieres habilitar login social:

**Google OAuth:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Create Project → APIs & Services → Credentials
3. Create OAuth Client ID (Web Application)
4. Authorized redirect URIs: `https://app.sorianomediadores.es/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

**Microsoft Azure AD:**
1. Ve a [Azure Portal](https://portal.azure.com)
2. Azure Active Directory → App registrations → New registration
3. Redirect URI: `https://app.sorianomediadores.es/api/auth/callback/azure-ad`

```env
MICROSOFT_CLIENT_ID=tu-microsoft-client-id
MICROSOFT_CLIENT_SECRET=tu-microsoft-client-secret
MICROSOFT_TENANT_ID=common
```

---

## Base de Datos

### 1. Ejecutar Migraciones

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy
```

### 2. Poblar datos de ejemplo (opcional)

```bash
npx prisma db seed
```

### 3. Verificar la estructura

```bash
# Abrir Prisma Studio
npx prisma studio
```

Deberías ver las siguientes tablas:
- `User` (con campos de 2FA)
- `Session` (con deviceFingerprint, ipAddress, etc.)
- `Policy`
- `Claim`
- `Lead`
- `AuditLog`
- `PasswordHistory`
- `Account`
- `VerificationToken`

---

## Servicios Externos

### Resend (Email Automation)

#### Verificar Dominio

1. Ir a [Resend Dashboard](https://resend.com/domains)
2. Click "Add Domain"
3. Ingresar: `sorianomediadores.es`
4. Añadir los registros DNS proporcionados:

```
Type: TXT
Name: _resend
Value: [el valor que te den]

Type: MX
Name: @
Value: feedback-smtp.resend.com
Priority: 10
```

5. Esperar verificación (hasta 48h)

#### Configurar Email From

Una vez verificado el dominio, puedes usar:
- `renovaciones@sorianomediadores.es`
- `noreply@sorianomediadores.es`
- `hola@sorianomediadores.es`

#### Templates de Email

Los templates están en `src/emails/`:
- `WelcomeEmail.tsx`
- `PolicyRenewalEmail.tsx`
- `WinBackEmail.tsx`

**Preview en desarrollo:**

```bash
npm run email:dev
```

Abre http://localhost:3000 para ver los templates.

---

## Deployment en Vercel

### 1. Conectar Repositorio

```bash
# Inicializar git (si no lo has hecho)
git init
git add .
git commit -m "feat: Complete marketing automation implementation"

# Push to GitHub
git remote add origin https://github.com/tu-usuario/soriano-ecliente.git
git push -u origin main
```

### 2. Importar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Import Git Repository
3. Selecciona tu repositorio
4. Framework Preset: **Next.js**
5. Root Directory: `./` (raíz)
6. Build Command: `npm run build`
7. Output Directory: `.next`

### 3. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, añade:

```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
RESEND_API_KEY
RESEND_EMAIL_FROM
CRON_SECRET
NEXT_PUBLIC_APP_URL
```

**IMPORTANTE:** Marca todas como disponibles en Production, Preview y Development.

### 4. Deploy

```bash
# Desde Vercel Dashboard, click "Deploy"
# O desde CLI:
vercel --prod
```

---

## Configuración Post-Deployment

### 1. Verificar Cron Jobs

Los cron jobs se configuran automáticamente desde `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/email-automation",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule:** Diario a las 9:00 AM UTC

**Verificar:**
1. Vercel Dashboard → Cron Jobs
2. Deberías ver: `email-automation` (Daily at 9:00 AM)

**Testing manual:**

```bash
curl -X POST https://app.sorianomediadores.es/api/cron/email-automation \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"task": "all"}'
```

### 2. Configurar DNS

Apunta tu dominio a Vercel:

**Opción A: Nameservers (Recomendado)**
1. Vercel Dashboard → Settings → Domains
2. Add Domain: `app.sorianomediadores.es`
3. Vercel te dará nameservers
4. Actualiza en tu registrador de dominio

**Opción B: CNAME**
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 3. SSL/TLS

Vercel provisiona automáticamente certificados SSL gratis con Let's Encrypt.

Verificar: https://app.sorianomediadores.es (debe mostrar candado verde)

### 4. Configurar Analytics (Opcional)

Si quieres analytics:

```env
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

Vercel Analytics se habilita automáticamente en el plan Pro.

---

## Testing

### 1. Smoke Tests Post-Deployment

```bash
# Health check
curl https://app.sorianomediadores.es/api/health

# Auth endpoints
curl https://app.sorianomediadores.es/api/auth/providers

# Lead capture
curl -X POST https://app.sorianomediadores.es/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "600123456",
    "source": "exit_intent"
  }'
```

### 2. Funcionalidades Críticas

#### a) Login Demo

1. Ir a https://app.sorianomediadores.es/login-cliente
2. Usar credenciales demo:
   - Email: `demo@soriano-cliente.com`
   - Password: `demo123`
3. Verificar acceso al dashboard

#### b) Lead Magnets

1. **Calculadora:** https://app.sorianomediadores.es/herramientas/calculadora-ahorro
   - Completar formulario
   - Verificar cálculo de ahorro
   - Verificar email gate
   - Confirmar lead en `/api/leads`

2. **Comparador:** https://app.sorianomediadores.es/herramientas/comparador
   - Seleccionar 2-3 aseguradoras
   - Verificar tabla comparativa
   - Verificar email gate
   - Confirmar lead en `/api/leads`

#### c) Exit Intent Modal

1. Ir a cualquier landing: https://app.sorianomediadores.es/landing/seguro-auto
2. Esperar 60 segundos O hacer scroll al 75% O mover ratón arriba
3. Verificar que aparece el modal
4. Completar formulario
5. Verificar que no aparece de nuevo (cookie 30 días)

#### d) Email Automation

**Test Manual:**

```bash
# Trigger welcome email
curl -X POST https://app.sorianomediadores.es/api/cron/email-automation \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -d '{"task": "welcome"}'

# Trigger renewal reminders
curl -X POST https://app.sorianomediadores.es/api/cron/email-automation \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -d '{"task": "renewals"}'

# Trigger win-back
curl -X POST https://app.sorianomediadores.es/api/cron/email-automation \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -d '{"task": "winback"}'
```

**Verificar en Resend Dashboard:**
1. Ve a [Resend Dashboard](https://resend.com/emails)
2. Deberías ver los emails enviados
3. Click para ver preview

### 3. Security Tests

#### a) 2FA Setup

1. Login con usuario
2. Ir a `/profile/security`
3. Click "Activar 2FA"
4. Escanear QR con Google Authenticator
5. Verificar con código de 6 dígitos
6. Guardar backup codes

#### b) Rate Limiting

```bash
# Intentar login 6 veces (debería bloquear al 6º)
for i in {1..6}; do
  curl -X POST https://app.sorianomediadores.es/api/auth/callback/credentials \
    -d "email=test@test.com&password=wrong"
  echo "Attempt $i"
done
```

Debería retornar `429 Too Many Requests` en el 6º intento.

#### c) Audit Logs

1. Login en app
2. Ir a panel admin
3. Ver `/admin/audit-logs`
4. Verificar que se registran:
   - LOGIN_SUCCESS
   - LOGIN_FAILED
   - 2FA_ENABLED
   - PASSWORD_CHANGED

---

## Monitoreo

### 1. Logs en Vercel

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de producción
vercel logs --prod

# Ver logs de una función específica
vercel logs --prod --output=/api/cron/email-automation
```

### 2. Métricas Clave

**Email Automation:**
- Emails enviados/día (target: 50-100)
- Tasa de error (target: <5%)
- Open rate (target: >20%)
- Click rate (target: >5%)

**Lead Magnets:**
- Visitas calculadora/mes (target: 1000+)
- Conversion rate (target: >30%)
- Leads capturados/mes (target: 300+)

**Exit Intent:**
- Impresiones (target: 500/día)
- Conversion rate (target: >10%)
- Variant performance (A/B test)

### 3. Alertas

Configurar en Vercel:
1. Settings → Integrations → Slack/Discord
2. Alertas para:
   - Errores 500 (> 10/hour)
   - Cron jobs fallidos
   - Build failures

### 4. Backup de Base de Datos

```bash
# Backup manual
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Automated backup (cron diario)
0 3 * * * pg_dump $DATABASE_URL | gzip > /backups/esori_$(date +\%Y\%m\%d).sql.gz
```

---

## Troubleshooting

### Error: "RESEND_API_KEY not found"

**Solución:**
1. Vercel Dashboard → Settings → Environment Variables
2. Añadir `RESEND_API_KEY`
3. Redeploy

### Error: "Cron job unauthorized"

**Solución:**
1. Verificar que `CRON_SECRET` está en Vercel env vars
2. Verificar que es el mismo en el curl/request
3. Formato: `Authorization: Bearer YOUR_SECRET`

### Emails no se envían

**Diagnóstico:**
1. Verificar dominio verificado en Resend
2. Verificar `RESEND_EMAIL_FROM` usa dominio verificado
3. Ver logs de Resend Dashboard
4. Verificar límites del plan (Free: 100/día)

### Exit Intent Modal no aparece

**Diagnóstico:**
1. Abrir DevTools → Console
2. Verificar que no hay errores JS
3. Verificar cookie `exit-intent-shown`
4. Borrar cookies y recargar
5. Intentar trigger alternativo (scroll 75%)

### Base de datos "relation does not exist"

**Solución:**
```bash
# Regenerar cliente
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Si persiste, reset (CUIDADO: borra datos)
npx prisma migrate reset
```

---

## Checklist Final de Deployment ✅

### Pre-Deploy
- [ ] `.env.local` configurado con todas las variables
- [ ] Base de datos creada y migraciones ejecutadas
- [ ] Dominio Resend verificado
- [ ] Tests locales pasados (`npm run build`)
- [ ] Código commiteado a Git

### Deploy
- [ ] Repositorio conectado a Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deployment exitoso (build verde)
- [ ] DNS apuntando a Vercel
- [ ] SSL activo (candado verde)

### Post-Deploy
- [ ] Cron job visible en Vercel Dashboard
- [ ] Login demo funciona
- [ ] Calculadora ahorro funciona
- [ ] Comparador funciona
- [ ] Exit Intent Modal funciona
- [ ] Email automation tested (manual)
- [ ] 2FA setup funciona
- [ ] Audit logs registrándose
- [ ] Analytics configurado

### Monitoreo
- [ ] Logs verificados (sin errores críticos)
- [ ] Alertas configuradas (Slack/Discord)
- [ ] Backup de DB configurado
- [ ] Métricas baseline registradas

---

## 🎉 ¡Todo Listo!

Tu aplicación e-SORI está ahora completamente desplegada con:

✅ **Email Automation** (welcome, renewals, win-back)
✅ **Lead Magnets** (calculadora + comparador)
✅ **Exit Intent Modal** (A/B testing)
✅ **Enterprise Security** (2FA, rate limiting, audit logs)
✅ **Gamification** (Soriano Club)

**Próximos Pasos Recomendados:**

1. **Semana 5-8:** Push Notifications, Lead Scoring, A/B Testing Framework
2. **Optimización:** Analizar métricas y optimizar conversion rates
3. **Contenido:** Crear guías para calculadora/comparador (blog posts)
4. **Marketing:** Promover herramientas en redes sociales
5. **Feedback:** Recoger feedback de usuarios reales

---

## Soporte

**Documentación adicional:**
- [PLAN_MEJORAS_MARKETING_PRODUCTO.md](./PLAN_MEJORAS_MARKETING_PRODUCTO.md)
- [SEGURIDAD_IMPLEMENTADA.md](./SEGURIDAD_IMPLEMENTADA.md)
- [IMPLEMENTACION_PRIORIDAD_ALTA.md](./IMPLEMENTACION_PRIORIDAD_ALTA.md)
- [RESUMEN_FINAL_SESION.md](./RESUMEN_FINAL_SESION.md)

**Contacto:**
- Email: tech@sorianomediadores.es
- Slack: #esori-tech
- GitHub Issues: [tu-repo]/issues

---

**Última actualización:** 28 de Enero de 2026
**Versión:** 1.0.0
**Autor:** Claude Sonnet 4.5 + Equipo Soriano Mediadores
