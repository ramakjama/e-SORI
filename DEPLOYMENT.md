# 🚀 Guía de Despliegue - e-SORI

## Información del Proyecto

**Nombre**: e-SORI - Portal Soriano Mediadores  
**Dominio Producción**: https://app.sorianomediadores.es  
**Framework**: Next.js 14 (App Router)  
**Base de Datos**: PostgreSQL  
**Autenticación**: NextAuth.js v4  
**Hosting Recomendado**: Vercel / AWS / DigitalOcean

---

## 📋 Pre-requisitos

### Servicios Necesarios

1. **Base de Datos PostgreSQL**
   - Versión: 14+
   - Extensiones: uuid-ossp
   - Recomendado: Supabase, Railway, o Neon

2. **Variables de Entorno**
   - Copiar `.env.example` a `.env`
   - Configurar todas las variables requeridas

3. **OAuth Providers**
   - Google Cloud Console
   - Microsoft Azure Portal
   - Apple Developer (opcional)

---

## 🔧 Configuración de Variables de Entorno

Ver archivo `.env.example` para la configuración completa.

### OAuth Callbacks

**Google OAuth**:
- Redirect URI: `https://app.sorianomediadores.es/api/auth/callback/google`

**Microsoft Azure AD**:
- Redirect URI: `https://app.sorianomediadores.es/api/auth/callback/azure-ad`

**Apple** (opcional):
- Redirect URI: `https://app.sorianomediadores.es/api/auth/callback/apple`

---

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/ramakjama/e-SORI.git
cd e-SORI

# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma migrate deploy

# Build
npm run build

# Iniciar
npm start
```

---

## 🌐 Despliegue en Vercel

### Deploy Automático

1. Conectar repositorio GitHub a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a main

### Configurar Dominio

1. Project Settings → Domains
2. Agregar: `app.sorianomediadores.es`
3. Configurar DNS CNAME apuntando a Vercel

---

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos creada y migraciones ejecutadas
- [ ] OAuth providers configurados
- [ ] Dominio DNS configurado
- [ ] SSL/HTTPS habilitado
- [ ] Build exitoso (`npm run build`)

---

## 📞 Soporte

**Repositorio**: https://github.com/ramakjama/e-SORI  
**Email**: soporte@sorianomediadores.es

---

Última actualización: 2026-01-28
