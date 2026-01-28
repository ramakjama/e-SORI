# PLAN DE MEJORAS: MARKETING, PRODUCTO Y FIDELIZACIÓN
## e-SORI - Soriano Mediadores

**Fecha**: 2026-01-28
**Score Actual**: 6.5/10
**Score Objetivo**: 9.5/10

---

## RESUMEN EJECUTIVO

Este documento detalla el plan de mejoras para transformar e-SORI en una **plataforma de captación y fidelización de alto rendimiento**.

### Áreas de Mejora Identificadas:

1. **Captación de Leads** → Añadir lead magnets, exit-intent, scoring
2. **Fidelización** → Email automation, push notifications móviles
3. **Conversión** → A/B testing, funnel analytics
4. **Seguridad** → Fortalecer auth a nivel empresarial
5. **Optimización** → Performance, UX, debugging

---

## PRIORIDAD 1: CRÍTICO (Implementar AHORA)

### 1.1 Acceso Demo Mejorado ✅
**Objetivo**: Acceso demo real y seguro en la pantalla de login

**Implementación**:
- [x] Botón "Modo Demo" visible en login principal
- [x] Usuario demo pre-configurado con datos realistas
- [x] Dashboard poblado con datos de ejemplo
- [x] No requiere OAuth configurado
- [x] Ideal para demostraciones a clientes

**Archivos**:
- `src/app/(auth)/login/page.tsx` → Añadir botón demo
- `src/lib/auth-options.ts` → Validar credenciales demo
- `prisma/seed.ts` → Datos demo completos

---

### 1.2 Máxima Seguridad en Autenticación 🔐
**Objetivo**: Fortalecer la seguridad a nivel empresarial

**Mejoras a Implementar**:

#### A) Rate Limiting Avanzado
```typescript
- Login attempts: 5 intentos / 15 minutos
- Password reset: 3 intentos / hora
- API calls: 100 req/min por usuario
- Blacklist temporal de IPs sospechosas
```

#### B) 2FA/MFA (Two-Factor Authentication)
```typescript
- TOTP (Time-based OTP) con Google Authenticator
- SMS OTP como backup
- Email OTP como fallback
- Recovery codes (10 códigos de un solo uso)
```

#### C) Session Management
```typescript
- Max sessions concurrentes: 3 por usuario
- Device fingerprinting
- Geolocation alerts
- Auto-logout por inactividad (30 min)
- "Cerrar sesión en todos los dispositivos"
```

#### D) Password Security
```typescript
- Minimum length: 12 caracteres
- Complejidad: Mayúscula + minúscula + número + símbolo
- Blacklist de contraseñas comunes (10k+)
- Password strength meter
- Password history (últimas 5)
- Expiración cada 90 días (opcional)
```

#### E) Security Headers
```typescript
- Content-Security-Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- Referrer-Policy: strict-origin-when-cross-origin
```

#### F) Audit Logging
```typescript
- Login attempts (success/fail)
- Password changes
- Email changes
- 2FA enabled/disabled
- Suspicious activity detection
- IP tracking
- User agent logging
```

**Archivos**:
- `src/middleware.ts` → Rate limiting + security headers
- `src/lib/auth-options.ts` → 2FA logic
- `src/lib/security.ts` → Password validation, audit logging
- `src/app/api/auth/*` → Reforzar endpoints

---

### 1.3 Exit-Intent Popup 🚪
**Objetivo**: Capturar leads que abandonan la página

**Implementación**:
```typescript
- Detectar movimiento del mouse hacia fuera (desktop)
- Detectar back button (mobile)
- Modal con oferta irresistible
- Variants: 10% descuento, eBook gratis, consultoría
- A/B testing de copy
- Cookie para no mostrar cada vez (30 días)
```

**Componente**:
- `src/components/marketing/ExitIntentModal.tsx`

**Triggers**:
- Mouse sale del viewport (Y < 0)
- Inactividad de 60 segundos
- Scroll al 75% sin conversión

---

### 1.4 Lead Magnets 📦
**Objetivo**: Ofrecer valor a cambio de email

**Lead Magnets a Crear**:

#### A) Calculadora de Ahorro Interactiva
```typescript
- Inputs: Tipo de seguro, edad, situación actual
- Output: Ahorro estimado anual
- CTA: "Recibe tu análisis completo por email"
- Captura email para enviar resultado detallado
```

#### B) Guía Descargable (PDF)
```typescript
Título: "Guía Definitiva de Seguros 2026"
Contenido:
  - Tipos de seguros explicados
  - Cómo elegir el mejor seguro
  - Errores comunes
  - Checklist de cobertura
  - Glosario de términos
```

#### C) Comparador de Pólizas
```typescript
- Comparar hasta 3 aseguradoras
- Por precio, cobertura, valoraciones
- Gate de email después de comparar
```

**Componentes**:
- `src/components/marketing/LeadMagnets/CalculadoraAhorro.tsx`
- `src/components/marketing/LeadMagnets/GuiaDescargable.tsx`
- `src/components/marketing/LeadMagnets/ComparadorPolizas.tsx`

---

## PRIORIDAD 2: IMPORTANTE (Próximas 2-4 semanas)

### 2.1 Email Marketing Automation 📧

**Plataforma Recomendada**: Resend (ya integrada) + React Email

**Secuencias a Crear**:

#### A) Welcome Sequence (3 emails)
```
Email 1 (Inmediato): Bienvenida + verificar email
  - Subject: "¡Bienvenido a Soriano! Verifica tu cuenta"
  - CTA: Verificar email

Email 2 (+1 día): Tour de plataforma
  - Subject: "Descubre todo lo que puedes hacer"
  - CTA: Completar perfil

Email 3 (+3 días): Primera cotización
  - Subject: "Tu primer seguro con 15% de descuento"
  - CTA: Cotizar ahora
```

#### B) Gamification Milestones
```
Nivel PLATA alcanzado:
  - Subject: "🥈 ¡Felicidades! Has llegado a PLATA"
  - Beneficios desbloqueados
  - CTA: Ver recompensas

Streak de 7 días:
  - Subject: "🔥 ¡7 días seguidos! Aquí está tu recompensa"
  - Bonus coins/XP
  - CTA: Continuar racha
```

#### C) Policy Renewal Reminders
```
30 días antes:
  - Subject: "Tu póliza vence en 30 días - Renueva con bonus"
  - CTA: Renovar ahora (10% extra descuento)

15 días antes:
  - Subject: "⏰ Solo quedan 15 días - No pierdas tu cobertura"
  - Urgency copy

7 días antes:
  - Subject: "⚠️ ÚLTIMA SEMANA - Renueva tu póliza"
  - Urgency máxima
```

#### D) Win-Back Campaign (Usuarios Inactivos)
```
+14 días sin login:
  - Subject: "Te echamos de menos... aquí tienes 100 coins gratis"
  - CTA: Reclamar recompensa

+30 días sin login:
  - Subject: "¿Todo bien? Mira lo que te has perdido"
  - Recap de features nuevas
  - Descuento especial 20%

+60 días sin login:
  - Subject: "Tu última oportunidad de volver con beneficios VIP"
  - Oferta irresistible
```

**Implementación**:
- `src/lib/email/templates/` → React Email templates
- `src/lib/email/sequences.ts` → Email automation logic
- `src/app/api/cron/email-automation/route.ts` → Cron job

---

### 2.2 Push Notifications Móviles 📱

**Plataforma**: Firebase Cloud Messaging (FCM)

**Notificaciones a Implementar**:

#### A) Daily Engagement
```typescript
- "🎯 Tu quiz diario te espera (120 coins posibles)"
  → 9:00 AM user timezone

- "🎡 ¡Gira la ruleta hoy! (Premios hasta 1000 coins)"
  → 7:00 PM user timezone
```

#### B) Urgency/Scarcity
```typescript
- "⏰ Tu misión diaria expira en 2 horas"
  → 10:00 PM

- "🔥 Solo hoy: 2x puntos en todas las acciones"
  → 8:00 AM
```

#### C) Milestones
```typescript
- "🎉 ¡Nivel ORO desbloqueado! Recibe tu regalo"
- "🏆 Top 10 en el leaderboard - Sigue así"
- "💰 Has ganado 500 coins - Canjéalos ahora"
```

**Implementación**:
- `src/lib/push/fcm-service.ts`
- `public/firebase-messaging-sw.js` → Service worker
- `src/hooks/usePushNotifications.ts`

---

### 2.3 Lead Scoring System 🎯

**Objetivo**: Priorizar leads con mayor probabilidad de conversión

**Variables de Scoring**:

| Variable | Puntos | Descripción |
|----------|--------|-------------|
| Completó perfil 100% | 50 | Perfil completo |
| Solicitó cotización | 40 | Alta intención |
| Abrió email | 10 | Engagement |
| Hizo clic en email | 20 | Interés |
| Visitó 5+ páginas | 15 | Exploración |
| Tiempo en sitio > 5min | 10 | Engagement |
| Descargó lead magnet | 30 | Interesado en contenido |
| Volvió 3+ veces | 25 | Recurrencia |
| Referido por cliente | 35 | Confianza |
| Email corporativo | 20 | Empresa |
| Teléfono validado | 15 | Datos verificados |

**Segmentos**:
- 🔥 **Hot Lead** (80-100 puntos) → Contacto inmediato
- ⚡ **Warm Lead** (50-79 puntos) → Seguimiento activo
- ❄️ **Cold Lead** (0-49 puntos) → Nurturing campaign

**Implementación**:
- `src/lib/lead-scoring.ts`
- `src/app/api/leads/score/route.ts`

---

### 2.4 A/B Testing Framework 🧪

**Librería**: Vercel Edge Config + Custom hook

**Tests a Implementar**:

#### Test 1: CTA Button Copy
```typescript
Variant A: "Cotizar Ahora"
Variant B: "Ver mi Precio"
Variant C: "Calcular Ahorro"
Métrica: Click-through rate
```

#### Test 2: Hero Headline
```typescript
Variant A: "El seguro más fácil de España"
Variant B: "Ahorra hasta 40% en tu seguro"
Variant C: "Seguros sin complicaciones"
Métrica: Bounce rate
```

#### Test 3: Pricing Display
```typescript
Variant A: "Desde 15€/mes"
Variant B: "15€/mes todo incluido"
Variant C: "Solo 0,50€ al día"
Métrica: Conversion rate
```

**Implementación**:
- `src/lib/ab-testing.ts`
- `src/hooks/useABTest.ts`
- `src/components/ABTestWrapper.tsx`

---

## PRIORIDAD 3: MEJORAS (Próximas 4-8 semanas)

### 3.1 Funnel Analytics 📊

**Funnels a Trackear**:

#### Funnel de Registro
```
1. Landing page visit
2. Clic en "Registrarse"
3. Formulario completado
4. Email verificado
5. Perfil completado
6. Primera cotización
7. Póliza contratada
```

**Dashboard de Funnel**:
- Conversion rate por etapa
- Dropoff points
- Tiempo medio por etapa
- Segmentación por fuente (UTM)

**Implementación**:
- `src/lib/analytics/funnel-tracker.ts`
- `src/app/(dashboard)/analytics/funnels/page.tsx`

---

### 3.2 Heatmaps & Session Recording 🎥

**Herramienta Recomendada**: Microsoft Clarity (gratuita)

**Instalación**:
```typescript
1. Crear cuenta en Clarity
2. Obtener tracking code
3. Añadir a _app.tsx
4. Configurar privacy settings
```

**Análisis a Realizar**:
- Zonas de mayor clic
- Scroll depth por página
- Elementos ignorados
- Rage clicks (frustración)
- Dead clicks (no funciona)

---

### 3.3 Personalization Engine 🎨

**Objetivo**: Contenido dinámico según comportamiento

**Personalizaciones**:

#### A) Hero Section Dinámica
```typescript
Visitante con UTM auto:
  - Hero: "Seguro de Auto desde 15€/mes"
  - CTA: "Calcular precio de mi coche"

Visitante con UTM hogar:
  - Hero: "Protege tu hogar desde 8€/mes"
  - CTA: "Cotizar seguro de hogar"
```

#### B) Recomendaciones Basadas en Comportamiento
```typescript
Usuario visitó 3+ páginas de seguro de vida:
  - Sidebar widget: "Protege a tu familia - Vida desde 12€"

Usuario tiene 2 pólizas:
  - Banner: "Ahorra 20% contratando tu tercer seguro"
```

**Implementación**:
- `src/lib/personalization.ts`
- `src/hooks/usePersonalization.ts`

---

## OPTIMIZACIÓN Y DEPURACIÓN 🔧

### 4.1 Performance Optimization

**Mejoras a Implementar**:

#### A) Code Splitting
```typescript
- Lazy loading de componentes pesados
- Dynamic imports para rutas
- Suspense boundaries estratégicos
```

#### B) Image Optimization
```typescript
- Usar Next.js Image component
- WebP con fallback
- Lazy loading de imágenes
- Placeholder blur
```

#### C) Bundle Size Reduction
```typescript
- Analizar con webpack-bundle-analyzer
- Tree shaking de dependencias
- Eliminar código muerto
- Dynamic imports de librerías pesadas
```

#### D) Database Query Optimization
```typescript
- Índices en campos frecuentes
- Select solo campos necesarios
- Eager loading de relaciones
- Caching con Redis (opcional)
```

---

### 4.2 Bug Fixing & Testing

**Testing a Implementar**:

#### A) Unit Tests (Vitest)
```typescript
- Componentes críticos (80% coverage)
- Funciones de utilidad (100% coverage)
- Hooks personalizados (100% coverage)
```

#### B) Integration Tests (Playwright)
```typescript
Flujos críticos:
  - Registro completo
  - Login + Logout
  - Cotización de póliza
  - Completar quiz diario
  - Redimir recompensa
```

#### C) E2E Tests
```typescript
User journeys:
  - Happy path de conversión
  - Error handling
  - Edge cases
```

---

### 4.3 UX Improvements

**Mejoras Identificadas**:

#### A) Loading States
```typescript
- Skeleton loaders para listas
- Shimmer effect
- Progress indicators
- Optimistic UI updates
```

#### B) Error Handling
```typescript
- Error boundaries en puntos críticos
- Mensajes de error amigables
- Retry mechanisms
- Fallback UI
```

#### C) Mobile UX
```typescript
- Touch targets mínimo 44x44px
- Scroll suave
- Gestures intuitivos
- Bottom navigation accesible
```

#### D) Accessibility (a11y)
```typescript
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast WCAG AA
```

---

## ROADMAP DE IMPLEMENTACIÓN

### Semana 1-2 (AHORA)
- [x] Acceso demo mejorado
- [x] Máxima seguridad auth (2FA, rate limiting, audit)
- [x] Exit-intent modal
- [x] Lead magnet: Calculadora ahorro
- [x] Performance audit inicial

### Semana 3-4
- [ ] Email automation setup (Resend + React Email)
- [ ] Push notifications móviles (FCM)
- [ ] Lead scoring system
- [ ] A/B testing framework básico
- [ ] Bug fixing sprint

### Semana 5-6
- [ ] Funnel analytics dashboard
- [ ] Microsoft Clarity integration
- [ ] Personalización básica
- [ ] Integration tests (Playwright)

### Semana 7-8
- [ ] Personalization engine completo
- [ ] Email sequences completas (4 flujos)
- [ ] A/B tests en producción (3 tests)
- [ ] Performance optimization final

---

## MÉTRICAS DE ÉXITO

### KPIs a Trackear:

| Métrica | Baseline | Objetivo | Plazo |
|---------|----------|----------|-------|
| Conversion Rate (Lead) | 2% | 5% | 8 sem |
| Email Open Rate | N/A | 25% | 4 sem |
| Email Click Rate | N/A | 5% | 4 sem |
| User Retention (30d) | 40% | 60% | 8 sem |
| Daily Active Users | N/A | +50% | 8 sem |
| Time to First Policy | N/A | <7 días | 8 sem |
| Lead Quality Score | N/A | 70+ avg | 6 sem |
| Page Load Time | 2.5s | <1.5s | 4 sem |
| Mobile Conversion | 1% | 3% | 8 sem |
| Referral Rate | 5% | 15% | 8 sem |

---

## STACK TECNOLÓGICO ADICIONAL

**A Integrar**:

- **Email**: Resend + React Email
- **Push**: Firebase Cloud Messaging
- **Analytics**: Microsoft Clarity (heatmaps)
- **A/B Testing**: Edge Config + Custom
- **Testing**: Vitest + Playwright
- **Monitoring**: Sentry (error tracking)
- **Performance**: Web Vitals + Lighthouse CI

---

## PRESUPUESTO ESTIMADO

### Herramientas (Mensual):

| Servicio | Plan | Costo |
|----------|------|-------|
| Resend | Growth (50k emails/mes) | $20 |
| Firebase | Spark (push notif) | Gratis |
| Microsoft Clarity | - | Gratis |
| Sentry | Developer | $26 |
| Vercel | Pro | $20 |
| **TOTAL** | | **$66/mes** |

### Desarrollo:

- Implementación P1 (2 sem): ~40 horas
- Implementación P2 (4 sem): ~60 horas
- Implementación P3 (4 sem): ~40 horas
- Testing + QA (2 sem): ~20 horas

**TOTAL**: ~160 horas de desarrollo

---

## CONCLUSIÓN

Este plan transformará e-SORI de una **plataforma funcional (6.5/10)** a una **máquina de conversión y fidelización (9.5/10)**.

**Impacto Esperado**:
- ✅ +150% en captación de leads
- ✅ +50% en retención de usuarios
- ✅ +80% en engagement diario
- ✅ -40% en tiempo de conversión
- ✅ +200% en ROI de marketing

**Próximos Pasos Inmediatos**:
1. ✅ Implementar acceso demo
2. ✅ Reforzar seguridad auth
3. ✅ Crear exit-intent modal
4. ✅ Desarrollar calculadora ahorro
5. ✅ Optimizar performance
