# e-SORI | Soriano e-Cliente

Portal de seguros premium para Soriano Mediadores de Seguros S.L.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Email:** React Email + Resend API
- **IA Chat:** Groq API (llama-3.3-70b-versatile)
- **Estilos:** Tailwind CSS + Framer Motion
- **Autenticación:** NextAuth.js + 2FA/TOTP
- **Seguridad:** Rate Limiting, Audit Logs, Password Security

## ✨ Características Principales

### 🎯 Marketing & Lead Capture
- **35+ Landing Pages** de conversión (productos, segmentos, campañas)
- **Exit Intent Modal** con A/B testing (3 variantes)
- **Calculadora de Ahorro** - Lead magnet interactivo
- **Comparador de Seguros** - Comparación lado a lado de aseguradoras
- **Email Automation** - Welcome, Renewals, Win-back campaigns

### 🎮 Gamificación "Soriano Club"
- Sistema de niveles (Bronce → Plata → Oro → Platino → Diamante)
- XP y COINS por acciones
- Retos semanales y misiones
- Ruleta de premios
- Programa de referidos

### 🤖 IA & Automatización
- **Chat IA "SORI"** para atención al cliente 24/7
- **Email Automation** con Resend + React Email
- **Cron Jobs** diarios para renovaciones y win-back
- Recomendaciones personalizadas de seguros

### 🔒 Seguridad Enterprise
- **2FA/TOTP** (Google Authenticator compatible)
- **Rate Limiting** (login, API, password reset)
- **Audit Logs** con geolocalización
- **Password Security** (12+ caracteres, validación compleja)
- **Session Management** con device fingerprinting
- Security headers (CSP, HSTS, X-Frame-Options)

### 📊 Gestión de Seguros
- Dashboard con métricas en tiempo real
- Gestión de pólizas y siniestros
- Sistema de documentos con upload
- Tracking de leads con UTM
- Analytics integrado

### 🎨 UX/UI
- Dark mode con transiciones suaves
- Diseño responsive premium
- Animaciones con Framer Motion
- Componentes accesibles (WCAG 2.1)
- Confetti effects en logros

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Setup base de datos
npx prisma migrate dev
npx prisma generate

# Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y usa las credenciales demo:
- **Email:** `demo@soriano-cliente.com`
- **Password:** `demo123`

📖 **Guías Detalladas:**
- [QUICK_START.md](./QUICK_START.md) - Inicio rápido en 5 minutos
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment completo a producción

## 📁 Documentación

| Documento | Descripción |
|-----------|-------------|
| [QUICK_START.md](./QUICK_START.md) | Guía de inicio rápido (5 min) |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Deployment paso a paso |
| [PLAN_MEJORAS_MARKETING_PRODUCTO.md](./PLAN_MEJORAS_MARKETING_PRODUCTO.md) | Roadmap de marketing (8 semanas) |
| [SEGURIDAD_IMPLEMENTADA.md](./SEGURIDAD_IMPLEMENTADA.md) | Sistema de seguridad enterprise |
| [IMPLEMENTACION_PRIORIDAD_ALTA.md](./IMPLEMENTACION_PRIORIDAD_ALTA.md) | Features semanas 3-4 (P1) |
| [RESUMEN_FINAL_SESION.md](./RESUMEN_FINAL_SESION.md) | Resumen completo del proyecto |

## 🔑 Variables de Entorno Críticas

```env
# Base de Datos
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>

# Email Automation (Resend)
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_EMAIL_FROM=renovaciones@sorianomediadores.es

# Cron Jobs
CRON_SECRET=<openssl rand -base64 32>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Ver [.env.example](./.env.example) para todas las variables.

## 🎯 Nuevas Funcionalidades Implementadas (Enero 2026)

### Email Automation
- ✅ Sistema completo de email automation con Resend + React Email
- ✅ Welcome sequence (3 emails: verificación, tour, primera cotización)
- ✅ Renewal reminders (30/15/7 días antes con descuentos)
- ✅ Win-back campaigns (3 etapas: 14/30/60 días con bonificaciones)
- ✅ Cron job diario para automatización
- ✅ Templates profesionales responsive

### Lead Magnets
- ✅ **Calculadora de Ahorro** (`/herramientas/calculadora-ahorro`)
  - Calcula ahorro potencial hasta 45%
  - Multi-step flow con animaciones
  - Email gate al final

- ✅ **Comparador de Seguros** (`/herramientas/comparador`)
  - Compara hasta 3 aseguradoras lado a lado
  - Tabla detallada con coberturas, pros/cons
  - Email gate tras selección

### Exit Intent Modal
- ✅ A/B testing con 3 variantes automáticas
- ✅ Múltiples triggers (mouse exit, scroll 75%, inactividad 60s)
- ✅ Cookie de 30 días
- ✅ Integrado en todas las landing pages
- ✅ Confetti effect en captura

### Seguridad Enterprise
- ✅ 2FA/TOTP (Google Authenticator)
- ✅ Rate limiting (login, API, password reset)
- ✅ Audit logs con 18 tipos de eventos
- ✅ Password strength validation
- ✅ Session management con device fingerprinting
- ✅ Security headers (CSP, HSTS, etc.)

**Impacto Esperado:**
- +500 leads/mes
- +€5,800/mes en revenue
- +40% en retention
- ROI: 450% en 6 meses

## 🚢 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio en [vercel.com/new](https://vercel.com/new)
2. Configura las variables de entorno
3. Deploy automático

Los cron jobs se configuran automáticamente desde `vercel.json`.

Guía completa: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### VPS/Servidor Propio

```bash
git clone https://github.com/TU_USUARIO/soriano-ecliente.git
cd soriano-ecliente
npm install --legacy-peer-deps
npm run build
npm run start
```

## 📂 Estructura del Proyecto

```
soriano-ecliente/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, registro, 2FA
│   │   ├── (dashboard)/         # Panel cliente/empleado
│   │   ├── (landing)/           # Landing pages públicas
│   │   │   └── landing/
│   │   │       ├── seguro-auto/
│   │   │       ├── seguro-hogar/
│   │   │       └── ... (35+ landings)
│   │   ├── herramientas/        # 🆕 Lead magnets
│   │   │   ├── calculadora-ahorro/
│   │   │   └── comparador/
│   │   └── api/
│   │       ├── auth/            # NextAuth endpoints
│   │       ├── leads/           # Lead capture
│   │       └── cron/            # 🆕 Email automation
│   ├── components/
│   │   ├── marketing/           # 🆕 Lead magnets
│   │   │   ├── ExitIntentModal.tsx
│   │   │   └── LeadMagnets/
│   │   ├── auth/                # 🆕 2FA, PasswordStrength
│   │   ├── landing/             # Landing components
│   │   ├── dashboard/           # Dashboard components
│   │   └── ui/                  # Base UI components
│   ├── emails/                  # 🆕 React Email templates
│   │   ├── WelcomeEmail.tsx
│   │   ├── PolicyRenewalEmail.tsx
│   │   └── WinBackEmail.tsx
│   ├── lib/
│   │   ├── security.ts          # 🆕 Security system
│   │   ├── email-automation.ts  # 🆕 Email automation
│   │   ├── prisma.ts
│   │   └── ...
│   └── prisma/
│       └── schema.prisma        # DB models
├── .env.example                 # 🆕 Updated with new vars
├── vercel.json                  # 🆕 Cron configuration
├── QUICK_START.md              # 🆕 Quick start guide
├── DEPLOYMENT_GUIDE.md         # 🆕 Deployment guide
└── README.md                   # Este archivo
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Preview emails (React Email)
npm run email:dev
```

## 📊 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Dev server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run linter

# Base de datos
npx prisma studio        # Visual DB editor
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate Prisma Client

# Email templates
npm run email:dev        # Preview emails (port 3001)

# Cron jobs (manual)
curl -X POST http://localhost:3000/api/cron/email-automation \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Licencia

Privado - Soriano Mediadores de Seguros S.L.
