# ⚡ Quick Start Guide - e-SORI

Guía rápida para poner en marcha el proyecto en 5 minutos.

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Instalar Dependencias

```bash
npm install --legacy-peer-deps
```

> **Nota:** Usamos `--legacy-peer-deps` por compatibilidad con react-email.

### 2. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env.local

# Editar .env.local con tus valores mínimos
```

**Variables mínimas para desarrollo:**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esori_dev"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=cualquier-string-largo-aqui
RESEND_API_KEY=re_tu_key_de_resend
RESEND_EMAIL_FROM=test@test.com
CRON_SECRET=cualquier-secret-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb esori_dev

# Ejecutar migraciones
npx prisma migrate dev

# Generar cliente
npx prisma generate

# (Opcional) Poblar datos de ejemplo
npx prisma db seed
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 🔑 Acceso Demo

**Cliente Demo:**
- Email: `demo@soriano-cliente.com`
- Password: `demo123`

**Empleado Demo:**
- Email: `demo@soriano-empleado.com`
- Password: `demo123`

---

## 🎯 Funcionalidades Principales

### 📊 Dashboard
- [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Vista general, pólizas, siniestros, gamificación

### 🧮 Calculadora de Ahorro
- [http://localhost:3000/herramientas/calculadora-ahorro](http://localhost:3000/herramientas/calculadora-ahorro)
- Lead magnet con cálculo de ahorro potencial

### 📋 Comparador de Seguros
- [http://localhost:3000/herramientas/comparador](http://localhost:3000/herramientas/comparador)
- Comparación lado a lado de aseguradoras

### 🎮 Soriano Club
- [http://localhost:3000/soriano-club](http://localhost:3000/soriano-club)
- Gamificación, niveles, puntos, recompensas

### 🔒 Seguridad 2FA
- [http://localhost:3000/profile/security](http://localhost:3000/profile/security)
- Autenticación de dos factores (Google Authenticator)

### 📧 Preview Emails
```bash
# Terminal separada
npm run email:dev
```
Abre [http://localhost:3001](http://localhost:3001) para ver templates

---

## 🧪 Testing Rápido

### Exit Intent Modal

1. Ir a [http://localhost:3000/landing/seguro-auto](http://localhost:3000/landing/seguro-auto)
2. Hacer una de estas acciones:
   - Esperar 60 segundos
   - Scroll hasta 75% de la página
   - Mover ratón arriba (simular salida)
3. Debería aparecer modal con oferta

### Lead Capture

```bash
# Capturar un lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "600123456",
    "source": "calculator",
    "insuranceType": "auto"
  }'
```

### Email Automation (Manual Trigger)

```bash
# Trigger manualmente los emails
curl -X POST http://localhost:3000/api/cron/email-automation \
  -H "Authorization: Bearer tu-cron-secret" \
  -H "Content-Type: application/json" \
  -d '{"task": "all"}'
```

---

## 📁 Estructura del Proyecto

```
soriano-ecliente/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, registro
│   │   ├── (dashboard)/         # Dashboard principal
│   │   ├── (landing)/           # Landing pages
│   │   │   └── landing/
│   │   │       ├── seguro-auto/
│   │   │       ├── seguro-hogar/
│   │   │       └── ...
│   │   ├── herramientas/        # Nuevas herramientas
│   │   │   ├── calculadora-ahorro/
│   │   │   └── comparador/
│   │   └── api/
│   │       ├── auth/            # NextAuth
│   │       ├── leads/           # Captura de leads
│   │       └── cron/            # Email automation
│   ├── components/
│   │   ├── marketing/           # Lead magnets
│   │   │   ├── ExitIntentModal.tsx
│   │   │   └── LeadMagnets/
│   │   │       ├── CalculadoraAhorro.tsx
│   │   │       └── ComparadorPolizas.tsx
│   │   ├── auth/                # 2FA, seguridad
│   │   ├── landing/             # Componentes landing
│   │   └── dashboard/           # Componentes dashboard
│   ├── emails/                  # Templates react-email
│   │   ├── WelcomeEmail.tsx
│   │   ├── PolicyRenewalEmail.tsx
│   │   └── WinBackEmail.tsx
│   ├── lib/
│   │   ├── security.ts          # Sistema seguridad
│   │   ├── email-automation.ts  # Automatización emails
│   │   └── prisma.ts
│   └── prisma/
│       └── schema.prisma        # Modelos DB
├── .env.example                 # Template variables
├── vercel.json                  # Config cron jobs
├── DEPLOYMENT_GUIDE.md          # Guía deployment completa
└── QUICK_START.md              # Esta guía
```

---

## 🔧 Comandos Útiles

### Desarrollo

```bash
npm run dev              # Servidor desarrollo (port 3000)
npm run build            # Build producción
npm start                # Ejecutar build
npm run lint             # Linter
npm run email:dev        # Preview emails (port 3001)
```

### Base de Datos

```bash
npx prisma studio        # UI visual de la DB
npx prisma migrate dev   # Crear migración
npx prisma generate      # Generar cliente
npx prisma db push       # Push schema sin migración
npx prisma db seed       # Poblar datos
```

### Testing

```bash
npm run test             # Jest tests
npm run test:e2e         # Tests end-to-end
npm run test:watch       # Test watch mode
```

---

## 🐛 Troubleshooting Común

### "Cannot find module '@react-email/components'"

```bash
npm install react-email @react-email/components --legacy-peer-deps
```

### "Prisma Client not generated"

```bash
npx prisma generate
```

### "Port 3000 already in use"

```bash
# Matar proceso en puerto 3000
npx kill-port 3000

# O usar otro puerto
PORT=3001 npm run dev
```

### "NEXTAUTH_SECRET not set"

Añade a `.env.local`:
```env
NEXTAUTH_SECRET=cualquier-string-largo-random
```

### Webpack error "Cannot read properties of undefined"

```bash
# Limpiar caché y reinstalar
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run dev
```

---

## 📚 Documentación Completa

Para más detalles, consulta:

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment completo a producción
2. **[PLAN_MEJORAS_MARKETING_PRODUCTO.md](./PLAN_MEJORAS_MARKETING_PRODUCTO.md)** - Roadmap marketing
3. **[SEGURIDAD_IMPLEMENTADA.md](./SEGURIDAD_IMPLEMENTADA.md)** - Sistema de seguridad
4. **[IMPLEMENTACION_PRIORIDAD_ALTA.md](./IMPLEMENTACION_PRIORIDAD_ALTA.md)** - Features P1
5. **[RESUMEN_FINAL_SESION.md](./RESUMEN_FINAL_SESION.md)** - Resumen completo

---

## ✅ Checklist de Verificación

Después del setup, verifica:

- [ ] Servidor dev corriendo en http://localhost:3000
- [ ] Login demo funciona (`demo@soriano-cliente.com` / `demo123`)
- [ ] Dashboard carga correctamente
- [ ] Calculadora accesible en `/herramientas/calculadora-ahorro`
- [ ] Comparador accesible en `/herramientas/comparador`
- [ ] Exit Intent modal aparece en landing pages
- [ ] Email preview funciona en http://localhost:3001
- [ ] Prisma Studio abre correctamente (`npx prisma studio`)

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa los logs de la consola
2. Verifica que todas las variables de entorno están configuradas
3. Asegúrate de que PostgreSQL está corriendo
4. Consulta [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para troubleshooting detallado

---

## 🎉 ¡Listo para Desarrollar!

Ya tienes todo configurado. Empieza a explorar:

- Modifica componentes en `src/components/`
- Crea nuevas landing pages en `src/app/(landing)/landing/`
- Añade emails en `src/emails/`
- Personaliza estilos en `src/app/globals.css`

**Happy coding! 🚀**

---

**Última actualización:** 28 de Enero de 2026
