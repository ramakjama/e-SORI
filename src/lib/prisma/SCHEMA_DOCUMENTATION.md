# Documentación del Schema Prisma - e-SORI

## Resumen Ejecutivo

Este schema implementa una base de datos completa para e-SORI, la aplicación de gestión de seguros con gamificación de Soriano Mediadores.

**Total de Modelos:** 13
**Base de Datos:** PostgreSQL
**Framework ORM:** Prisma

---

## Modelos Principales

### 1. User (Usuario)
**Propósito:** Gestión completa de usuarios con sistema de gamificación integrado.

**Campos de Gamificación:**
- `xp` - Puntos de experiencia
- `coins` - Moneda virtual
- `level` - Nivel del usuario
- `streak` - Días consecutivos de actividad
- `lastActiveDate` - Última actividad registrada

**Relaciones:**
- 1:N con Policy (pólizas)
- 1:N con Claim (siniestros)
- 1:N con Document (documentos)
- 1:1 con RiskProfile (perfil de riesgo)
- 1:N con Notification (notificaciones)
- 1:N con Reminder (recordatorios)
- 1:N con QuizResult (resultados de quizzes)
- 1:N con Referral (referidos hechos y recibidos)
- 1:N con ClaimMessage (mensajes de siniestros)
- 1:N con UserAchievement (logros)
- 1:N con Transaction (transacciones)
- 1:N con RewardPurchase (compras de recompensas)

**Índices:**
- `email` (único)
- `status`
- `level`

---

### 2. Policy (Póliza)
**Propósito:** Gestión de pólizas de seguros del cliente.

**Tipos Soportados:**
- AUTO - Seguros de automóvil
- HOME - Seguros de hogar
- HEALTH - Seguros de salud
- LIFE - Seguros de vida
- BUSINESS - Seguros de negocio
- TRAVEL - Seguros de viaje
- PET - Seguros de mascotas
- OTHER - Otros tipos

**Campos JSON Flexibles:**
- `vehicleInfo` - Información específica de vehículos
- `propertyInfo` - Información de propiedades
- `healthInfo` - Información de salud

**Frecuencias de Pago:**
- MONTHLY (Mensual)
- QUARTERLY (Trimestral)
- SEMI_ANNUAL (Semestral)
- ANNUAL (Anual)

**Estados:**
- ACTIVE - Activa
- EXPIRED - Expirada
- CANCELLED - Cancelada
- PENDING - Pendiente
- SUSPENDED - Suspendida

**Índices:**
- `userId`
- `policyNumber` (único)
- `status`
- `endDate` (para alertas de vencimiento)

---

### 3. Claim (Siniestro)
**Propósito:** Gestión de siniestros y reclamaciones.

**Estados del Siniestro:**
- SUBMITTED - Enviado
- UNDER_REVIEW - En revisión
- PENDING_INFO - Esperando información
- APPROVED - Aprobado
- REJECTED - Rechazado
- PAID - Pagado
- CLOSED - Cerrado

**Prioridades:**
- LOW - Baja
- NORMAL - Normal
- HIGH - Alta
- URGENT - Urgente

**Campos Financieros:**
- `claimedAmount` - Monto solicitado
- `approvedAmount` - Monto aprobado
- `paidAmount` - Monto pagado

**Relaciones:**
- N:1 con User
- N:1 con Policy
- 1:N con Document (documentos del siniestro)
- 1:N con ClaimMessage (chat del siniestro)

**Índices:**
- `userId`
- `policyId`
- `claimNumber` (único)
- `status`
- `incidentDate`

---

### 4. Document (Documento)
**Propósito:** Gestión de archivos y documentos.

**Tipos de Documento:**
- POLICY_CONTRACT - Contrato de póliza
- ID_CARD - Documento de identidad
- DRIVER_LICENSE - Licencia de conducir
- VEHICLE_REGISTRATION - Registro de vehículo
- CLAIM_PHOTO - Fotos del siniestro
- MEDICAL_REPORT - Informe médico
- POLICE_REPORT - Parte policial
- INVOICE - Factura
- RECEIPT - Recibo
- OTHER - Otros

**Campos de Storage:**
- `fileUrl` - URL principal del archivo
- `thumbnailUrl` - URL de miniatura (opcional)
- `fileSize` - Tamaño en bytes
- `fileType` - MIME type

**Verificación:**
- `isVerified` - Si está verificado
- `verifiedBy` - Quién lo verificó
- `verifiedAt` - Cuándo se verificó

**Relaciones:**
- N:1 con User
- N:1 con Policy (opcional)
- N:1 con Claim (opcional)

---

### 5. RiskProfile (Perfil de Riesgo)
**Propósito:** Análisis y scoring de riesgo del cliente.

**Datos Demográficos:**
- Edad, género, ocupación
- Estado civil, dependientes

**Datos de Salud:**
- Fumador/no fumador
- Condiciones de salud
- Medicamentos
- Última revisión médica

**Datos de Vehículos:**
- Información de vehículos (JSON)
- Historial de conducción (JSON)

**Datos de Propiedad:**
- Tipo y valor de la vivienda
- Antigüedad
- Características de seguridad

**Risk Scoring:**
- `riskScore` - Puntuación de 0-100
- `riskCategory` - LOW, MEDIUM, HIGH, VERY_HIGH
- `lastAssessed` - Última evaluación

**Relación:**
- 1:1 con User (único)

---

### 6. Notification (Notificación)
**Propósito:** Sistema de notificaciones en tiempo real.

**Tipos de Notificación:**
- POLICY_RENEWAL - Renovación de póliza
- CLAIM_UPDATE - Actualización de siniestro
- PAYMENT_DUE - Pago pendiente
- DOCUMENT_REQUEST - Solicitud de documento
- SYSTEM - Sistema
- ACHIEVEMENT - Logro desbloqueado
- REWARD - Recompensa disponible
- REFERRAL - Referido
- REMINDER - Recordatorio

**Prioridades:**
- LOW, NORMAL, HIGH, URGENT

**Estados:**
- `read` - Si fue leída
- `readAt` - Cuándo se leyó
- `dismissed` - Si fue descartada
- `dismissedAt` - Cuándo se descartó

**Acciones:**
- `actionUrl` - URL de acción
- `actionLabel` - Etiqueta del botón

**Índices:**
- `userId`
- `read`
- `type`
- `createdAt`

---

### 7. Reminder (Recordatorio)
**Propósito:** Alertas programadas de vencimientos y eventos.

**Tipos de Recordatorio:**
- POLICY_RENEWAL - Renovación de póliza
- PAYMENT_DUE - Pago pendiente
- DOCUMENT_EXPIRY - Vencimiento de documento
- CLAIM_FOLLOWUP - Seguimiento de siniestro
- CUSTOM - Personalizado

**Canales de Envío:**
- `sendEmail` - Enviar por email
- `sendPush` - Notificación push
- `sendSms` - SMS

**Estado:**
- `sent` - Si fue enviado
- `sentAt` - Cuándo se envió
- `dismissed` - Si fue descartado

**Campos Específicos:**
- `daysBeforeExpiry` - Días antes del vencimiento
- `reminderDate` - Fecha programada

---

### 8. QuizResult (Resultado de Quiz)
**Propósito:** Gamificación educativa mediante quizzes.

**Tipos de Quiz:**
- RISK_ASSESSMENT - Evaluación de riesgo
- INSURANCE_KNOWLEDGE - Conocimiento de seguros
- SAFETY_TIPS - Consejos de seguridad
- PRODUCT_EDUCATION - Educación de productos

**Resultados:**
- `score` - Puntuación obtenida
- `maxScore` - Puntuación máxima
- `percentage` - Porcentaje
- `passed` - Si aprobó

**Recompensas:**
- `xpEarned` - XP ganado
- `coinsEarned` - Coins ganados

**Datos Adicionales:**
- `answers` - Respuestas (JSON)
- `timeSpent` - Tiempo en segundos

---

### 9. Referral (Referido)
**Propósito:** Programa de referidos con sistema de recompensas.

**Estados:**
- PENDING - Pendiente
- COMPLETED - Completado
- EXPIRED - Expirado
- CANCELLED - Cancelado

**Stages (Etapas del Funnel):**
- INVITED - Invitado
- SIGNED_UP - Registrado
- VERIFIED - Verificado
- FIRST_POLICY - Primera póliza
- COMPLETED - Completado

**Tracking:**
- `invitedAt` - Fecha de invitación
- `signedUpAt` - Fecha de registro
- `firstPolicyAt` - Primera póliza
- `completedAt` - Completado

**Recompensas:**
- `referrerReward` - Coins para quien refiere
- `referredReward` - Coins para el referido
- `rewardPaidAt` - Cuándo se pagó

**Campos Únicos:**
- `referralCode` - Código único de referido

---

### 10. ClaimMessage (Mensaje de Siniestro)
**Propósito:** Sistema de chat para siniestros.

**Metadata:**
- `senderRole` - Rol del remitente
- `attachments` - Archivos adjuntos (JSON)

**Estados:**
- `read` - Si fue leído
- `readAt` - Cuándo se leyó

**Tipos de Mensaje:**
- `isInternal` - Solo visible para agentes
- `isSystem` - Mensaje automático del sistema

**Relaciones:**
- N:1 con Claim
- N:1 con User

---

### 11. Achievement (Logro)
**Propósito:** Sistema de logros desbloqueables.

**Categorías:**
- POLICY_MANAGEMENT - Gestión de pólizas
- CLAIMS - Siniestros
- LEARNING - Aprendizaje
- REFERRALS - Referencias
- ENGAGEMENT - Compromiso
- SPECIAL - Especiales

**Rareza:**
- COMMON - Común
- RARE - Raro
- EPIC - Épico
- LEGENDARY - Legendario

**Recompensas:**
- `points` - Puntos de XP
- `coinReward` - Coins otorgados

**Configuración:**
- `criteria` - Criterios para desbloquear (JSON)
- `isHidden` - Si está oculto
- `isActive` - Si está activo

---

### 12. UserAchievement (Logros de Usuario)
**Propósito:** Tracking de progreso de logros por usuario.

**Progreso:**
- `progress` - Progreso actual
- `maxProgress` - Progreso máximo
- `completed` - Si está completado

**Timing:**
- `unlockedAt` - Cuándo se desbloqueó
- `claimedAt` - Cuándo se reclamó

**Restricción:**
- Unique constraint en (userId, achievementId)

---

### 13. Reward (Recompensa)
**Propósito:** Marketplace de recompensas.

**Categorías:**
- DISCOUNT - Descuento
- GIFT_CARD - Tarjeta de regalo
- INSURANCE_BENEFIT - Beneficio de seguro
- PHYSICAL_ITEM - Artículo físico
- DIGITAL_CONTENT - Contenido digital
- EXPERIENCE - Experiencia
- DONATION - Donación

**Inventario:**
- `stock` - Stock total (null = ilimitado)
- `availableStock` - Stock disponible

**Validez:**
- `startDate` - Fecha de inicio
- `endDate` - Fecha de fin
- `isActive` - Si está activo

**Costo:**
- `coinCost` - Costo en coins

---

### 14. RewardPurchase (Compra de Recompensa)
**Propósito:** Tracking de compras del marketplace.

**Estados:**
- PENDING - Pendiente
- PROCESSING - Procesando
- COMPLETED - Completado
- DELIVERED - Entregado
- CANCELLED - Cancelado
- REFUNDED - Reembolsado

**Entrega:**
- `deliveryMethod` - Método de entrega
- `deliveryAddress` - Dirección
- `trackingNumber` - Número de seguimiento

**Redención:**
- `redemptionCode` - Código de redención (único)
- `redeemedAt` - Cuándo se canjeó
- `expiresAt` - Cuándo expira

---

### 15. Transaction (Transacción)
**Propósito:** Historial completo de movimientos de coins.

**Tipos de Transacción:**
- EARNED - Ganado
- SPENT - Gastado
- BONUS - Bonificación
- REFUND - Reembolso
- ADJUSTMENT - Ajuste
- STREAK_BONUS - Bonus de racha
- REFERRAL_REWARD - Recompensa de referido
- ACHIEVEMENT_REWARD - Recompensa de logro
- QUIZ_REWARD - Recompensa de quiz
- DAILY_LOGIN - Login diario

**Campos de Balance:**
- `amount` - Cantidad (+ o -)
- `balanceBefore` - Balance antes
- `balanceAfter` - Balance después

**Referencias:**
- `referenceId` - ID de la entidad relacionada
- `referenceType` - Tipo de entidad

---

## Estrategia de Índices

### Índices de Performance
1. **User:** email, status, level
2. **Policy:** userId, policyNumber, status, endDate
3. **Claim:** userId, policyId, claimNumber, status, incidentDate
4. **Document:** userId, policyId, claimId, documentType
5. **Notification:** userId, read, type, createdAt
6. **Reminder:** userId, policyId, reminderDate, sent
7. **QuizResult:** userId, quizId, passed
8. **Referral:** referrerId, referredId, status, referralCode
9. **ClaimMessage:** claimId, userId, createdAt
10. **Achievement:** category, rarity
11. **UserAchievement:** userId, achievementId, completed
12. **Reward:** category, isActive, coinCost
13. **RewardPurchase:** userId, rewardId, status
14. **Transaction:** userId, type, createdAt

---

## Cascades y Eliminación

### OnDelete: Cascade
- User → Policy, Claim, Document, Notification, Reminder, etc.
- Policy → Claim, Document, Reminder
- Claim → Document, ClaimMessage

### OnDelete: Restrict
- RewardPurchase → Reward (no se puede eliminar una recompensa con compras)

### OnDelete: SetNull
- Referral → User (referred) - Si se elimina el referido, el registro persiste

---

## Campos JSON Flexibles

1. **Policy:**
   - `vehicleInfo` - Datos específicos de vehículos
   - `propertyInfo` - Datos de propiedades
   - `healthInfo` - Información de salud

2. **Claim:**
   - `witnesses` - Testigos del incidente

3. **RiskProfile:**
   - `vehicles` - Array de vehículos
   - `drivingRecord` - Historial de conducción

4. **Document:**
   - `tags` - Array de etiquetas

5. **Notification:**
   - `metadata` - Datos adicionales

6. **QuizResult:**
   - `answers` - Respuestas del quiz

7. **ClaimMessage:**
   - `attachments` - Archivos adjuntos

8. **Achievement:**
   - `criteria` - Criterios de desbloqueo

9. **Transaction:**
   - `metadata` - Datos adicionales

---

## Enums Definidos

### 17 Enums en Total:

1. **UserRole** - CLIENT, ADMIN, AGENT, SUPER_ADMIN
2. **UserStatus** - ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION
3. **PolicyType** - AUTO, HOME, HEALTH, LIFE, BUSINESS, TRAVEL, PET, OTHER
4. **PaymentFrequency** - MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL
5. **PolicyStatus** - ACTIVE, EXPIRED, CANCELLED, PENDING, SUSPENDED
6. **ClaimStatus** - SUBMITTED, UNDER_REVIEW, PENDING_INFO, APPROVED, REJECTED, PAID, CLOSED
7. **ClaimPriority** - LOW, NORMAL, HIGH, URGENT
8. **DocumentType** - POLICY_CONTRACT, ID_CARD, DRIVER_LICENSE, etc.
9. **RiskCategory** - LOW, MEDIUM, HIGH, VERY_HIGH
10. **NotificationType** - POLICY_RENEWAL, CLAIM_UPDATE, PAYMENT_DUE, etc.
11. **NotificationPriority** - LOW, NORMAL, HIGH, URGENT
12. **ReminderType** - POLICY_RENEWAL, PAYMENT_DUE, DOCUMENT_EXPIRY, etc.
13. **QuizType** - RISK_ASSESSMENT, INSURANCE_KNOWLEDGE, SAFETY_TIPS, etc.
14. **ReferralStatus** - PENDING, COMPLETED, EXPIRED, CANCELLED
15. **ReferralStage** - INVITED, SIGNED_UP, VERIFIED, FIRST_POLICY, COMPLETED
16. **AchievementCategory** - POLICY_MANAGEMENT, CLAIMS, LEARNING, etc.
17. **AchievementRarity** - COMMON, RARE, EPIC, LEGENDARY
18. **RewardCategory** - DISCOUNT, GIFT_CARD, INSURANCE_BENEFIT, etc.
19. **PurchaseStatus** - PENDING, PROCESSING, COMPLETED, DELIVERED, etc.
20. **TransactionType** - EARNED, SPENT, BONUS, REFUND, etc.

---

## Comandos de Migración

### Inicializar Prisma
```bash
npx prisma init
```

### Generar Cliente
```bash
npx prisma generate
```

### Crear Migración
```bash
npx prisma migrate dev --name init
```

### Aplicar Migración en Producción
```bash
npx prisma migrate deploy
```

### Abrir Prisma Studio
```bash
npx prisma studio
```

### Resetear Base de Datos (desarrollo)
```bash
npx prisma migrate reset
```

---

## Consideraciones de Producción

### 1. Seguridad
- Todos los campos sensibles deben ser encriptados en la capa de aplicación
- Implementar Row Level Security (RLS) en PostgreSQL
- Usar prepared statements (Prisma lo hace automáticamente)

### 2. Performance
- Los índices están optimizados para las queries más comunes
- Considerar particionar tablas grandes (Claim, Transaction)
- Implementar caching para datos frecuentemente consultados

### 3. Backups
- Configurar backups automáticos diarios
- Retención mínima de 30 días
- Testear restauración regularmente

### 4. Monitoreo
- Implementar logging de queries lentas
- Monitorear uso de índices
- Alertas en errores de base de datos

---

## Próximos Pasos

1. Configurar variables de entorno (.env)
2. Ejecutar primera migración
3. Poblar datos de prueba (seeds)
4. Implementar servicios de base de datos
5. Crear tests de integración
6. Documentar APIs

---

**Versión del Schema:** 1.0.0
**Última Actualización:** 2026-01-27
**Mantenedor:** Soriano Mediadores - Equipo de Desarrollo
