# 🤖 Sistema Inteligente de Peticiones y Gestiones Automatizadas

**Versión**: 1.0
**Fecha**: 27 de enero de 2026
**Estado**: Diseño e Implementación

---

## 📋 Visión General

Sistema inteligente que permite a los clientes realizar peticiones y gestiones a través de un asistente con IA que:
1. **Clasifica automáticamente** el tipo de petición
2. **Resuelve instantáneamente** las gestiones automatizables
3. **Crea tickets** para gestiones que requieren intervención humana
4. **Asigna automáticamente** tickets a mediadores según expertise y carga

---

## 🎯 Casos de Uso

### Gestiones Automatizadas Instantáneas ⚡

**1. Solicitud de Documentos Digitales**
- Tarjeta de seguro
- Certificado de póliza
- Recibo de último pago
- Historial de siniestros
- **Resolución**: Generación y envío automático por email

**2. Consulta de Información**
- Estado de póliza
- Fecha de renovación
- Prima actual
- Coberturas contratadas
- **Resolución**: Respuesta inmediata desde BD

**3. Actualización de Datos Simples**
- Teléfono de contacto
- Email
- Dirección postal
- **Resolución**: Actualización directa en BD

**4. Gestión de Preferencias**
- Notificaciones
- Comunicaciones comerciales
- Idioma preferido
- **Resolución**: Actualización instantánea

**5. Consulta de Saldo de Gamificación**
- Coins disponibles
- XP y nivel
- Logros desbloqueados
- **Resolución**: Respuesta inmediata

---

### Gestiones con Ticket (Requieren Mediador) 🎫

**1. Modificación de Póliza**
- Cambio de coberturas
- Inclusión/exclusión de conductores
- Cambio de vehículo
- **Prioridad**: MEDIA
- **SLA**: 24 horas

**2. Solicitud de Presupuesto**
- Nueva póliza
- Ampliación de coberturas
- Comparativa de productos
- **Prioridad**: ALTA
- **SLA**: 4 horas

**3. Reclamaciones Complejas**
- Siniestro con terceros
- Daños importantes
- Discrepancias en valoración
- **Prioridad**: URGENTE
- **SLA**: 2 horas

**4. Cancelación de Póliza**
- Baja de póliza
- Cambio a otra aseguradora
- **Prioridad**: MEDIA
- **SLA**: 48 horas

**5. Asesoramiento Personalizado**
- Revisión integral de seguros
- Optimización de coberturas
- Planificación financiera
- **Prioridad**: BAJA
- **SLA**: 72 horas

**6. Quejas y Reclamaciones**
- Disconformidad con servicio
- Problemas con tramitación
- **Prioridad**: ALTA
- **SLA**: 24 horas

---

## 🧠 Árbol de Decisiones con IA

### Flujo de Clasificación

```
Usuario ingresa petición
    ↓
┌─────────────────────────────────────┐
│   IA Analiza Intent y Entidades     │
│   (NLP + Pattern Matching)          │
└─────────────────────────────────────┘
    ↓
    ├─→ ¿Es consulta de información? → SÍ → Respuesta automática
    │
    ├─→ ¿Es solicitud de documento? → SÍ → Generación automática
    │
    ├─→ ¿Es actualización simple? → SÍ → Update BD + Confirmación
    │
    ├─→ ¿Requiere validación manual? → SÍ → Crear Ticket
    │                                          ↓
    │                                    Clasificar categoría
    │                                          ↓
    │                                    Asignar prioridad
    │                                          ↓
    │                                    Calcular SLA
    │                                          ↓
    │                                    Asignar mediador
    │                                          ↓
    │                                    Notificar ambas partes
    │
    └─→ ¿No se entiende? → SÍ → Solicitar aclaración
                                 ↓
                           Ofrecer opciones guiadas
```

---

## 📊 Modelos de Datos

### Request (Petición)

```prisma
model Request {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])

  // Clasificación
  type              RequestType        // DOCUMENT, INFO_QUERY, UPDATE, MODIFICATION, etc.
  category          RequestCategory    // POLICY, CLAIM, DOCUMENT, ACCOUNT, etc.
  priority          RequestPriority    // LOW, MEDIUM, HIGH, URGENT

  // Contenido
  title             String
  description       String
  metadata          Json               // Datos adicionales específicos del tipo

  // IA Classification
  aiClassification  Json?              // Intent, entidades, confidence score
  aiResolved        Boolean @default(false)
  aiResponse        String?            // Respuesta automática si fue resuelta por IA

  // Estado
  status            RequestStatus      // PENDING, PROCESSING, RESOLVED, TICKET_CREATED
  resolvedAt        DateTime?
  resolution        String?

  // Relaciones
  ticketId          String?   @unique
  ticket            Ticket?   @relation(fields: [ticketId], references: [id])
  policyId          String?
  policy            Policy?   @relation(fields: [policyId], references: [id])

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId, status])
  @@index([type, category])
  @@index([createdAt])
}

enum RequestType {
  DOCUMENT_REQUEST        // Solicitud de documento
  INFO_QUERY             // Consulta de información
  DATA_UPDATE            // Actualización de datos
  POLICY_MODIFICATION    // Modificación de póliza
  QUOTE_REQUEST          // Solicitud de presupuesto
  CLAIM_COMPLEX          // Reclamación compleja
  CANCELLATION           // Cancelación
  ADVISORY               // Asesoramiento
  COMPLAINT              // Queja/reclamación
  OTHER                  // Otro
}

enum RequestCategory {
  POLICY                 // Relacionado con pólizas
  CLAIM                  // Relacionado con siniestros
  DOCUMENT               // Relacionado con documentos
  ACCOUNT                // Relacionado con cuenta de usuario
  PAYMENT                // Relacionado con pagos
  COVERAGE               // Relacionado con coberturas
  GENERAL                // General
}

enum RequestPriority {
  LOW                    // 72h SLA
  MEDIUM                 // 24h SLA
  HIGH                   // 4h SLA
  URGENT                 // 2h SLA
}

enum RequestStatus {
  PENDING                // Pendiente de procesamiento
  PROCESSING             // En procesamiento por IA
  RESOLVED               // Resuelta automáticamente
  TICKET_CREATED         // Se creó ticket
  ESCALATED              // Escalada
  CANCELLED              // Cancelada
}
```

### Ticket (Para gestiones manuales)

```prisma
model Ticket {
  id                String   @id @default(cuid())
  ticketNumber      String   @unique        // TKT000001

  // Relaciones
  requestId         String   @unique
  request           Request  @relation
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  assignedToId      String?
  assignedTo        User?    @relation("AssignedTickets", fields: [assignedToId], references: [id])

  // Clasificación
  type              RequestType
  category          RequestCategory
  priority          RequestPriority

  // Contenido
  title             String
  description       String

  // SLA y tiempos
  slaDeadline       DateTime         // Deadline según prioridad
  firstResponseAt   DateTime?        // Primera respuesta del mediador
  resolvedAt        DateTime?

  // Estado
  status            TicketStatus     // NEW, ASSIGNED, IN_PROGRESS, WAITING_USER, RESOLVED, CLOSED
  resolution        String?
  satisfactionScore Int?             // 1-5, evaluación del usuario

  // Comunicación
  messages          TicketMessage[]
  internalNotes     TicketNote[]

  // Metadata
  tags              String[]
  relatedPolicyId   String?
  relatedPolicy     Policy?   @relation(fields: [relatedPolicyId], references: [id])

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  closedAt          DateTime?

  @@index([userId, status])
  @@index([assignedToId, status])
  @@index([status, priority])
  @@index([slaDeadline])
  @@index([createdAt])
}

enum TicketStatus {
  NEW                    // Nuevo, sin asignar
  ASSIGNED               // Asignado a mediador
  IN_PROGRESS            // En proceso
  WAITING_USER           // Esperando respuesta del usuario
  WAITING_THIRD_PARTY    // Esperando aseguradora/tercero
  RESOLVED               // Resuelto
  CLOSED                 // Cerrado
  CANCELLED              // Cancelado
}

model TicketMessage {
  id                String   @id @default(cuid())
  ticketId          String
  ticket            Ticket   @relation(fields: [ticketId], references: [id])

  senderType        String           // USER, MEDIATOR, SYSTEM
  senderId          String
  senderName        String

  message           String
  attachments       Json?            // URLs de archivos adjuntos

  read              Boolean @default(false)
  readAt            DateTime?

  createdAt         DateTime @default(now())

  @@index([ticketId, createdAt])
}

model TicketNote {
  id                String   @id @default(cuid())
  ticketId          String
  ticket            Ticket   @relation(fields: [ticketId], references: [id])

  authorId          String
  author            User     @relation(fields: [authorId], references: [id])

  note              String           // Nota interna (no visible para cliente)

  createdAt         DateTime @default(now())

  @@index([ticketId])
}
```

---

## 🤖 Sistema de IA para Clasificación

### Categorías de Intent

```typescript
const INTENT_PATTERNS = {
  // Documentos
  DOCUMENT_REQUEST: [
    /necesito.*(?:tarjeta|certificado|recibo|comprobante)/i,
    /enviar.*documento/i,
    /solicito.*(?:copia|duplicado)/i,
    /descargar.*(?:poliza|seguro)/i,
  ],

  // Información
  INFO_QUERY: [
    /cuando.*(?:vence|caduca|renovar)/i,
    /cuanto.*(?:pago|cuesta|vale)/i,
    /que.*cobertura/i,
    /cual.*mi.*(?:poliza|numero)/i,
    /consultar.*(?:estado|informacion)/i,
  ],

  // Actualización de datos
  DATA_UPDATE: [
    /cambiar.*(?:telefono|email|direccion)/i,
    /actualizar.*datos/i,
    /modificar.*contacto/i,
  ],

  // Modificación de póliza
  POLICY_MODIFICATION: [
    /cambiar.*cobertura/i,
    /añadir.*conductor/i,
    /modificar.*poliza/i,
    /ampliar.*seguro/i,
    /cambiar.*vehiculo/i,
  ],

  // Presupuesto
  QUOTE_REQUEST: [
    /presupuesto/i,
    /cotizacion/i,
    /cuanto.*costaria/i,
    /precio.*seguro/i,
  ],

  // Siniestro
  CLAIM_COMPLEX: [
    /siniestro/i,
    /accidente/i,
    /parte.*(?:amistoso|europeo)/i,
    /reclamar/i,
  ],

  // Cancelación
  CANCELLATION: [
    /cancelar.*poliza/i,
    /dar.*baja/i,
    /anular.*seguro/i,
  ],

  // Queja
  COMPLAINT: [
    /queja/i,
    /disconforme/i,
    /reclamacion/i,
    /problema.*(?:servicio|atencion)/i,
  ],
}
```

### Extracción de Entidades

```typescript
interface ExtractedEntities {
  policyNumber?: string      // POL-2026-001
  policyType?: string        // AUTO, HOGAR, VIDA
  documentType?: string      // INSURANCE_CARD, CERTIFICATE
  dateReference?: Date       // Fechas mencionadas
  amount?: number           // Cantidades mencionadas
  vehicleInfo?: {           // Matrícula, marca, modelo
    plate?: string
    brand?: string
    model?: string
  }
  personInfo?: {            // Información de personas
    name?: string
    dni?: string
  }
}
```

### Confidence Score

```typescript
interface AIClassification {
  intent: RequestType
  category: RequestCategory
  priority: RequestPriority
  confidence: number              // 0-1
  canAutoResolve: boolean
  suggestedAction: string
  extractedEntities: ExtractedEntities
  reasoning: string              // Explicación del razonamiento
}
```

---

## ⚡ Reglas de Auto-Resolución

```typescript
const AUTO_RESOLUTION_RULES = {
  // Documentos digitales
  DOCUMENT_REQUEST: {
    canResolve: (request) => {
      const validDocs = ['INSURANCE_CARD', 'CERTIFICATE', 'RECEIPT', 'POLICY_SUMMARY']
      return request.entities.documentType && validDocs.includes(request.entities.documentType)
    },
    action: async (request) => {
      // Generar documento
      const document = await generateDocument(request.entities.documentType, request.userId)
      // Enviar por email
      await sendEmail(request.user.email, document)
      return {
        resolved: true,
        response: `Tu ${request.entities.documentType} ha sido generado y enviado a tu email.`,
        metadata: { documentId: document.id }
      }
    }
  },

  // Consultas de información
  INFO_QUERY: {
    canResolve: (request) => {
      const simpleQueries = ['RENEWAL_DATE', 'PREMIUM_AMOUNT', 'POLICY_STATUS', 'COVERAGE_INFO']
      return request.entities.queryType && simpleQueries.includes(request.entities.queryType)
    },
    action: async (request) => {
      const policy = await getPolicy(request.entities.policyNumber || request.userId)
      const answer = formatAnswer(request.entities.queryType, policy)
      return {
        resolved: true,
        response: answer,
        metadata: { policyId: policy.id }
      }
    }
  },

  // Actualización de datos simples
  DATA_UPDATE: {
    canResolve: (request) => {
      const simpleFields = ['phone', 'email', 'address']
      return request.entities.fieldToUpdate && simpleFields.includes(request.entities.fieldToUpdate)
    },
    action: async (request) => {
      await updateUserData(request.userId, {
        [request.entities.fieldToUpdate]: request.entities.newValue
      })
      return {
        resolved: true,
        response: `Tu ${request.entities.fieldToUpdate} ha sido actualizado correctamente.`,
      }
    }
  },
}
```

---

## 🎫 Sistema de Asignación Automática de Tickets

### Criterios de Asignación

```typescript
interface MediatorProfile {
  userId: string
  expertise: RequestCategory[]     // Categorías en las que es experto
  maxConcurrentTickets: number     // Máximo de tickets simultáneos
  currentTickets: number           // Tickets actuales asignados
  averageResponseTime: number      // Tiempo medio de respuesta (minutos)
  satisfactionScore: number        // Puntuación media de satisfacción
  availability: {
    online: boolean
    workingHours: { start: string, end: string }
    timezone: string
  }
}

function assignTicket(ticket: Ticket): string {
  // 1. Filtrar mediadores por expertise
  const expertMediators = mediators.filter(m =>
    m.expertise.includes(ticket.category)
  )

  // 2. Filtrar por disponibilidad
  const available = expertMediators.filter(m =>
    m.availability.online &&
    m.currentTickets < m.maxConcurrentTickets
  )

  // 3. Calcular score de cada mediador
  const scored = available.map(m => ({
    mediator: m,
    score: calculateAssignmentScore(m, ticket)
  }))

  // 4. Ordenar por score y asignar al mejor
  scored.sort((a, b) => b.score - a.score)

  return scored[0]?.mediator.userId || null
}

function calculateAssignmentScore(mediator: MediatorProfile, ticket: Ticket): number {
  let score = 100

  // Penalizar por carga actual
  score -= (mediator.currentTickets / mediator.maxConcurrentTickets) * 30

  // Bonificar por satisfacción
  score += (mediator.satisfactionScore / 5) * 20

  // Bonificar por velocidad de respuesta
  score += Math.max(0, 20 - (mediator.averageResponseTime / 10))

  // Priorizar urgentes a mediadores rápidos
  if (ticket.priority === 'URGENT') {
    score += mediator.averageResponseTime < 30 ? 20 : -10
  }

  return score
}
```

---

## 📈 Gamificación Integrada

**Coins por acciones**:
- ✅ Crear petición: +5 coins
- ✅ Petición resuelta automáticamente: +10 coins
- ✅ Cerrar ticket con satisfacción 5: +25 coins
- ✅ Responder rápido a mediador: +5 coins

---

## 🔔 Notificaciones Automáticas

**Para el cliente**:
- Petición creada
- Petición resuelta automáticamente
- Ticket creado
- Ticket asignado
- Nueva respuesta del mediador
- Ticket resuelto
- Solicitud de valoración

**Para el mediador**:
- Nuevo ticket asignado
- Cliente respondió
- SLA próximo a vencerse
- Ticket escalado

---

## 📊 Métricas y Analytics

**KPIs del sistema**:
- % de peticiones auto-resueltas
- Tiempo medio de resolución
- % de tickets dentro de SLA
- Satisfacción media de clientes
- Carga por mediador
- Categorías más solicitadas

---

## 🚀 Implementación

### APIs a crear:
1. `POST /api/requests` - Crear petición (con IA)
2. `GET /api/requests` - Listar peticiones del usuario
3. `GET /api/requests/[id]` - Detalle de petición
4. `POST /api/tickets` - Crear ticket manual (admin)
5. `GET /api/tickets` - Listar tickets (usuario/mediador)
6. `GET /api/tickets/[id]` - Detalle de ticket con mensajes
7. `PATCH /api/tickets/[id]` - Actualizar ticket
8. `POST /api/tickets/[id]/messages` - Añadir mensaje
9. `POST /api/tickets/[id]/notes` - Añadir nota interna (mediador)
10. `POST /api/tickets/[id]/resolve` - Resolver ticket

### Frontend a crear:
1. Formulario de petición con sugerencias IA
2. Lista de peticiones del usuario
3. Detalle de petición/ticket con chat
4. Dashboard de tickets para mediadores
5. Panel de asignación automática (admin)

---

**Siguiente paso**: Implementar modelos Prisma y APIs
