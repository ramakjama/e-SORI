# 🎨 PLAN COMPLETO FRONTEND - e-SORI (Soriano e-Cliente)

**Fecha**: 27 de enero de 2026
**Objetivo**: Frontend histórico, completo y profesional
**Alcance**: TODAS las páginas, subpáginas, modales, componentes

---

## 📐 Arquitectura Frontend

### Estructura de Carpetas
```
src/app/(dashboard)/
├── dashboard/                    # HOME principal
│   └── page.tsx                  # Dashboard overview
├── polizas/                      # PÓLIZAS
│   ├── page.tsx                  # Lista de pólizas
│   ├── [id]/
│   │   ├── page.tsx              # Detalle de póliza
│   │   ├── documentos/
│   │   │   └── page.tsx          # Documentos de la póliza
│   │   ├── siniestros/
│   │   │   └── page.tsx          # Siniestros de la póliza
│   │   ├── renovar/
│   │   │   └── page.tsx          # Renovar póliza
│   │   └── modificar/
│   │       └── page.tsx          # Modificar coberturas
│   └── cotizar/
│       └── page.tsx              # Cotizar nueva póliza
├── siniestros/                   # SINIESTROS
│   ├── page.tsx                  # Lista de siniestros
│   ├── nuevo/
│   │   └── page.tsx              # Reportar siniestro (wizard)
│   └── [id]/
│       ├── page.tsx              # Detalle + chat
│       ├── documentos/
│       │   └── page.tsx          # Docs del siniestro
│       └── seguimiento/
│           └── page.tsx          # Timeline del siniestro
├── peticiones/                   # PETICIONES Y TICKETS
│   ├── page.tsx                  # Lista de peticiones
│   ├── nueva/
│   │   └── page.tsx              # Nueva petición con IA
│   └── [id]/
│       └── page.tsx              # Detalle petición/ticket
├── tickets/                      # TICKETS (Mediadores)
│   ├── page.tsx                  # Dashboard de tickets
│   ├── [id]/
│   │   └── page.tsx              # Detalle ticket con chat
│   └── stats/
│       └── page.tsx              # Estadísticas de tickets
├── mis-documentos/               # DOCUMENTOS
│   ├── page.tsx                  # Gestor de documentos
│   ├── upload/
│   │   └── page.tsx              # Upload masivo
│   └── [id]/
│       └── page.tsx              # Visor de documento
├── perfil/                       # PERFIL (ya existe)
│   ├── page.tsx                  # Editar perfil
│   ├── seguridad/
│   │   └── page.tsx              # Cambiar contraseña
│   └── preferencias/
│       └── page.tsx              # Notificaciones, idioma
├── marketplace/                  # MARKETPLACE (ya existe)
│   └── page.tsx                  # Tienda de recompensas
├── quizzes/                      # QUIZZES (ya existe)
│   └── page.tsx                  # Quiz diario
├── referidos/                    # REFERIDOS (ya existe)
│   └── page.tsx                  # Sistema de referidos
├── mensajes/                     # MENSAJES
│   ├── page.tsx                  # Bandeja de entrada
│   └── [id]/
│       └── page.tsx              # Conversación
├── pagos/                        # PAGOS
│   ├── page.tsx                  # Historial de pagos
│   ├── pendientes/
│   │   └── page.tsx              # Recibos pendientes
│   └── metodos/
│       └── page.tsx              # Métodos de pago
└── ayuda/                        # AYUDA
    ├── page.tsx                  # Centro de ayuda
    ├── faq/
    │   └── page.tsx              # FAQs
    └── contacto/
        └── page.tsx              # Contactar soporte
```

---

## 🏠 MÓDULO 1: DASHBOARD PRINCIPAL

### `/dashboard` - Home Overview

**Objetivo**: Vista general del estado del cliente

**Secciones**:
1. **Hero Card** - Resumen personal
   - Avatar + nombre + nivel de gamificación
   - Coins, XP, racha de días activos
   - Botón "Crear petición rápida"

2. **Alerts críticas** (si hay)
   - Pólizas próximas a vencer (< 30 días)
   - Pagos pendientes
   - Siniestros en proceso
   - Documentos por firmar

3. **Resumen de Pólizas** (Grid 2x2)
   - Total de pólizas activas
   - Próxima renovación
   - Cobertura total
   - Ahorro del año (si aplica)

4. **Actividad Reciente** (Timeline)
   - Últimas 5 acciones: pagos, siniestros, documentos, etc.
   - Link a ver todo

5. **Acciones Rápidas** (Grid de iconos)
   - Reportar siniestro
   - Solicitar documento
   - Ver pólizas
   - Contactar mediador
   - Renovar póliza
   - Ver documentos

6. **Widgets**
   - Quiz diario (si no completado)
   - Recompensas destacadas
   - Consejos de prevención
   - Logros recientes

**Interacciones**:
- Click en cualquier alerta → navega a detalle
- Click en póliza → `/polizas/[id]`
- Click en siniestro → `/siniestros/[id]`
- Hover en actividad → preview

---

## 📋 MÓDULO 2: PÓLIZAS

### `/polizas` - Lista de Pólizas

**Layout**: Grid responsive (1 col mobile, 2 tablet, 3 desktop)

**Card de Póliza** incluye:
- Tipo (icon: Car, Home, Heart, Shield)
- Número de póliza
- Compañía aseguradora (logo)
- Estado (badge con color)
- Prima mensual
- Fecha de vencimiento
- Progreso circular hasta renovación
- Botón "Ver detalles"
- Menú de acciones rápidas (3 dots)

**Filtros** (Sidebar o top bar):
- Por tipo: AUTO, HOGAR, VIDA, SALUD
- Por estado: ACTIVA, PRÓXIMA A VENCER, VENCIDA
- Por compañía
- Búsqueda por número

**Vista alternativa**: Tabla con más detalles

**Acciones rápidas** (menú contextual):
- Ver detalle
- Descargar certificado
- Renovar
- Modificar
- Ver siniestros
- Contactar mediador

**Stats en header**:
- Total pólizas activas
- Gasto mensual total
- Próxima renovación
- Cobertura total

---

### `/polizas/[id]` - Detalle de Póliza

**Layout**: Multi-sección con tabs

**Hero Section**:
- Tipo de póliza + logo compañía
- Número de póliza (copiable)
- Estado prominente
- Botones de acción principales:
  - Descargar PDF
  - Renovar
  - Modificar
  - Reportar siniestro
  - Contactar

**Tabs**:

#### Tab 1: Información General
- Datos del asegurado
- Período de cobertura
- Prima y forma de pago
- Fecha de renovación
- Agente asignado

#### Tab 2: Coberturas
**Grid de coberturas** con:
- Nombre de cobertura
- Check si está incluida
- Límite de cobertura
- Franquicia
- Descripción (expandible)
- Botón "Ampliar cobertura"

**Comparador** (modal):
- Coberturas actuales vs paquetes superiores
- Diferencia de precio
- Botón "Solicitar cambio"

#### Tab 3: Documentos
- Lista de documentos asociados
- Categorías: Póliza, Recibos, Certificados, Otros
- Preview inline (PDFs)
- Descargar individual o masivo
- Upload de documentos del cliente

#### Tab 4: Siniestros
- Lista de siniestros asociados a esta póliza
- Estados, fechas, montos
- Link a detalle de cada siniestro
- Botón "Reportar nuevo siniestro"

#### Tab 5: Historial de Pagos
- Tabla de recibos pagados
- Estado (PAGADO, PENDIENTE, ATRASADO)
- Método de pago
- Descargar recibo
- Ver próximos pagos

#### Tab 6: Historial de Cambios
- Timeline de modificaciones
- Quién hizo el cambio
- Qué cambió (diff visual)
- Cuándo

**Sidebar derecho** (sticky):
- Resumen rápido
- Acciones rápidas
- Contacto del mediador
- FAQs relacionadas
- Recomendaciones IA

**Modales**:
- **Renovar póliza** - Wizard de renovación
- **Modificar cobertura** - Formulario con preview de cambios
- **Cancelar póliza** - Confirmación + razón
- **Compartir póliza** - Link o email

---

### `/polizas/[id]/renovar` - Renovar Póliza

**Wizard de 4 pasos**:

**Paso 1: Revisar datos**
- Datos actuales del asegurado
- Datos del vehículo/inmueble
- Botón "Editar" para cada sección

**Paso 2: Seleccionar coberturas**
- Coberturas actuales (pre-seleccionadas)
- Opciones de upgrade/downgrade
- Comparador de precios
- Recomendaciones IA según perfil

**Paso 3: Confirmar precio**
- Resumen de coberturas seleccionadas
- Desglose de precio
- Forma de pago (mensual/anual)
- Descuentos aplicables
- Precio final

**Paso 4: Firma y pago**
- Firma digital
- Método de pago
- Confirmación

**Features**:
- Guardar borrador
- Volver atrás sin perder datos
- Chat con mediador (sidebar)
- Progress bar superior

---

### `/polizas/cotizar` - Cotizar Nueva Póliza

**Wizard inteligente** según tipo de seguro

**Paso 0: Selector de tipo**
- Cards grandes con iconos
- AUTO, HOGAR, VIDA, SALUD, MOTO, VIAJE

**Para AUTO**:
- Datos del vehículo (matrícula, marca, modelo, año)
- Datos del conductor
- Uso del vehículo
- Parking habitual
- Conductores adicionales

**Para HOGAR**:
- Tipo (piso, casa)
- Ubicación
- Metros cuadrados
- Régimen (propiedad, alquiler)
- Contenido valorado
- Seguridad (alarma, puerta blindada)

**Resultado**:
- 3-4 opciones de póliza
- Comparador lado a lado
- Desglose de coberturas
- Precio mensual/anual
- Botón "Contratar" (crea petición)

---

## 🚨 MÓDULO 3: SINIESTROS

### `/siniestros` - Lista de Siniestros

**Layout**: Cards con timeline

**Card de Siniestro**:
- Número de siniestro (grande)
- Tipo (AUTO: Colisión, HOGAR: Incendio, etc.)
- Póliza asociada
- Fecha del incidente
- Monto reclamado
- Estado con color (PENDING, IN_PROGRESS, APPROVED, PAID)
- Última actualización
- Mediador asignado
- Botón "Ver detalles"

**Estados visuales**:
- PENDING: Amarillo
- IN_PROGRESS: Azul (con spinner)
- APPROVED: Verde
- REJECTED: Rojo
- PAID: Verde oscuro (con check)

**Filtros**:
- Por estado
- Por póliza
- Por tipo
- Por fecha

**Stats en header**:
- Total siniestros
- En proceso
- Resueltos
- Monto total reclamado

**Botón destacado**: "Reportar Siniestro" (sticky)

---

### `/siniestros/nuevo` - Reportar Siniestro

**Wizard de 5 pasos con auto-save**:

**Paso 1: Seleccionar póliza**
- Lista de pólizas activas
- Filtro por tipo
- Preview de coberturas

**Paso 2: Tipo de siniestro**
- Selector visual según tipo de póliza
  - AUTO: Colisión, Robo, Cristales, Daños terceros
  - HOGAR: Incendio, Robo, Agua, Responsabilidad civil
  - Cada tipo con icono y descripción

**Paso 3: Detalles del incidente**
- Fecha y hora
- Ubicación (mapa interactivo)
- Descripción detallada (textarea con contador)
- Circunstancias
- ¿Hubo heridos?
- ¿Intervino policía? (adjuntar parte)
- Testigos (opcional)

**Paso 4: Terceros involucrados** (si aplica)
- Datos del tercero
- Aseguradora del tercero
- Descripción de daños a terceros

**Paso 5: Documentación**
- Upload de fotos (drag & drop)
- Preview de imágenes
- Upload de documentos (parte amistoso, factura, presupuestos)
- Mínimo 2 fotos requeridas

**Paso 6: Revisión y envío**
- Resumen completo
- Editar cualquier paso
- Términos y condiciones
- Enviar

**Features especiales**:
- **Modo foto rápida**: Capturar desde móvil
- **Geolocalización automática**
- **Sugerencias IA**: Detectar qué fotos faltan
- **Borrador automático**: Guardar cada 30s
- **Chat con mediador** durante el proceso

**Después de enviar**:
- Número de siniestro generado
- +10 coins
- Timeline estimado de resolución
- Botón "Ver mi siniestro"

---

### `/siniestros/[id]` - Detalle de Siniestro

**Layout**: Chat-style + sidebar

**Sección principal - Chat**:
- Mensajes entre cliente y mediador
- Mensajes del sistema (cambios de estado)
- Input para escribir
- Adjuntar archivos
- Markdown support
- Indicador "escribiendo..."
- Indicador de leído
- Timestamp en cada mensaje

**Header del chat**:
- Número de siniestro
- Estado actual (badge)
- Mediador asignado (avatar + nombre)
- Menú de acciones

**Sidebar derecho** (sticky):

#### Información del Siniestro
- Tipo
- Fecha del incidente
- Póliza asociada
- Monto reclamado
- Monto aprobado (si aplica)

#### Timeline de Estados
- Reportado
- En revisión
- Documentación completa
- Aprobado
- Pago procesado
- Cerrado

Cada estado con:
- Fecha y hora
- Quién lo cambió
- Nota (si hay)

#### Documentos Adjuntos
- Lista de archivos
- Preview inline
- Descargar

#### Acciones
- Añadir documentos
- Solicitar actualización
- Cerrar siniestro (si resuelto)
- Valorar servicio

**Modales**:
- **Añadir documentos**: Upload múltiple
- **Valorar servicio**: 5 estrellas + comentario
- **Solicitar peritación**: Formulario específico

---

### `/siniestros/[id]/seguimiento` - Timeline Visual

**Vista alternativa del siniestro en formato timeline**:

- Línea temporal vertical
- Hitos clave con iconos grandes
- Expansión de detalles por hito
- Documentos asociados a cada hito
- Duración entre hitos
- SLA warnings si hay retrasos

**Hitos típicos**:
1. Siniestro reportado
2. Documentación recibida
3. Perito asignado
4. Peritación realizada
5. Valoración completada
6. Aprobación aseguradora
7. Pago autorizado
8. Pago realizado
9. Siniestro cerrado

**Export**:
- Descargar timeline como PDF
- Compartir link (con token)

---

## 📨 MÓDULO 4: PETICIONES Y TICKETS

### `/peticiones` - Lista de Peticiones
*(Ya creada - mejorar)*

**Añadir**:
- Vista de grid además de lista
- Quick actions en cada card
- Preview del resultado IA inline
- Indicador de coins ganados
- Feedback visual de estado

---

### `/peticiones/nueva` - Nueva Petición
*(Crear desde cero con más features)*

**Features avanzadas**:

#### Asistente IA conversacional
- Chatbot que guía la creación
- Preguntas dinámicas según el tipo
- Auto-completar campos
- Sugerencias contextuales

#### Detección inteligente
- Analizar texto mientras escribe
- Mostrar preview de clasificación
- "Detectamos que quieres..." con badge
- Sugerir campos adicionales

#### Quick templates
- Plantillas predefinidas
- 1-click para llenar formulario
- Personalizar después

#### Adjuntar archivos
- Drag & drop
- Preview
- Límite de tamaño

#### Relacionar con póliza
- Selector de póliza (si aplica)
- Auto-cargar datos de la póliza

#### Preview de resultado
- Antes de enviar, mostrar:
  - "Esta petición será resuelta automáticamente" ✅
  - O "Se creará un ticket" ℹ️
  - Tiempo estimado de respuesta
  - Coins que ganará

---

### `/peticiones/[id]` - Detalle Petición/Ticket

**Si fue auto-resuelta**:
- Hero con check verde grande
- Respuesta de IA destacada
- Coins ganados
- Botón "¿Te ayudó?" (feedback)
- Opciones:
  - Crear ticket si no satisfecho
  - Cerrar
  - Compartir

**Si se creó ticket**:
- Redirigir a `/tickets/[id]`
- O mostrar vista combinada

---

### `/tickets` - Dashboard de Tickets (Vista Cliente)

**Solo para clientes con tickets activos**

**Vista de Lista**:
- Tickets ordenados por prioridad
- Estados con colores
- Mensajes no leídos (badge)
- Último mensaje preview
- Mediador asignado
- SLA deadline con countdown

**Filtros**:
- Activos / Resueltos / Todos
- Por prioridad
- Por fecha

**Stats**:
- Tickets activos
- Tickets resueltos este mes
- Tiempo medio de resolución
- Satisfacción media

---

### `/tickets/[id]` - Detalle de Ticket

**Layout tipo Zendesk/Intercom**:

**Columna principal (70%)**: Chat
- Todos los mensajes
- Input con rich text
- Adjuntar archivos
- Emojis
- Indicadores de lectura
- Notificaciones de nuevo mensaje

**Columna lateral (30%)**:
- Info del ticket
- Estado actual
- Prioridad
- Mediador asignado (con disponibilidad)
- SLA countdown (si aplica)
- Ticket number
- Fecha creación
- Última actualización

**Timeline de estados** (colapsable)

**Documentos adjuntos** (section)

**Acciones rápidas**:
- Solicitar actualización
- Escalar ticket
- Valorar mediador
- Cerrar ticket

**Modales**:
- **Valorar mediador**: 5 estrellas + comentario
- **Escalar ticket**: Razón + urgencia
- **Cerrar ticket**: Confirmar resolución

---

### `/tickets/stats` - Estadísticas de Tickets (Admin/Mediador)

**Solo para ADMIN/AGENT role**

**KPIs**:
- Total tickets
- Abiertos / En proceso / Resueltos
- Tiempo medio de primera respuesta
- Tiempo medio de resolución
- % dentro de SLA
- Satisfacción media

**Gráficas**:
- Tickets por día (últimos 30 días)
- Tickets por categoría (pie chart)
- Tickets por prioridad
- Tickets por mediador

**Tabla de Tickets**:
- Todos los tickets del sistema
- Filtros avanzados
- Asignar/Reasignar
- Cambiar estado
- Cambiar prioridad
- Bulk actions

---

## 📁 MÓDULO 5: DOCUMENTOS

### `/mis-documentos` - Gestor de Documentos

**Vista principal**: Grid + List toggle

**Grid view**:
- Cards con preview (thumbnail)
- Tipo de archivo (icon)
- Nombre
- Tamaño
- Fecha
- Categoría (badge)
- Hover: acciones rápidas

**List view**: Tabla con columnas
- Nombre
- Tipo
- Categoría
- Tamaño
- Fecha subida
- Póliza relacionada (si aplica)
- Acciones

**Sidebar de filtros**:
- Por categoría:
  - Pólizas
  - Siniestros
  - Recibos
  - Certificados
  - Tarjetas de seguro
  - Personales
  - Otros
- Por tipo de archivo:
  - PDF
  - Imagen
  - Excel
  - Word
- Por póliza
- Por fecha

**Búsqueda avanzada**:
- Por nombre
- Por contenido (OCR si disponible)
- Por tags

**Acciones masivas** (multi-select):
- Descargar seleccionados (ZIP)
- Mover a carpeta
- Eliminar
- Compartir

**Botón destacado**: "Subir Documentos"

**Quick actions**:
- Crear carpeta
- Escanear documento (móvil)
- Solicitar documento a Soriano

**Stats en header**:
- Total documentos
- Espacio usado
- Documentos recientes (últimos 7 días)

---

### `/mis-documentos/upload` - Subir Documentos

**Zona de drag & drop grande**:
- "Arrastra archivos aquí"
- O "Seleccionar archivos"
- Soporte para múltiples archivos
- Preview de archivos antes de subir

**Formulario para cada archivo**:
- Nombre (editable)
- Categoría (selector)
- Póliza relacionada (opcional)
- Siniestro relacionado (opcional)
- Tags (input con autocompletado)
- Descripción (opcional)

**Upload con progress**:
- Barra de progreso por archivo
- Progress total
- Velocidad de subida
- Tiempo restante
- Cancelar individual

**Después de subir**:
- Lista de archivos subidos
- Links directos
- Botón "Subir más"
- Botón "Ver mis documentos"

---

### `/mis-documentos/[id]` - Visor de Documento

**Viewer integrado** según tipo:

**Para PDFs**:
- Visor PDF con zoom
- Navegación de páginas
- Búsqueda en el documento
- Modo pantalla completa
- Rotar páginas
- Descargar

**Para imágenes**:
- Lightbox con zoom
- Navegación si hay múltiples
- Rotar
- Descargar

**Para otros**:
- Preview si es posible
- Info del archivo
- Botón descargar

**Sidebar**:
- Metadata del documento
- Categoría
- Tags
- Relacionado con (póliza/siniestro)
- Fecha de subida
- Tamaño
- Tipo

**Acciones**:
- Editar información
- Compartir (generar link temporal)
- Eliminar
- Mover a carpeta
- Imprimir

---

## 💬 MÓDULO 6: MENSAJES

### `/mensajes` - Bandeja de Entrada

**Layout tipo email client**:

**Sidebar izquierdo**:
- Carpetas:
  - Recibidos (con contador no leídos)
  - Enviados
  - Importantes (starred)
  - Archivados
  - Spam
- Filtro por mediador
- Filtro por póliza

**Lista de conversaciones** (centro):
- Avatar del mediador
- Nombre
- Preview del último mensaje
- Fecha/hora
- Badge de no leído
- Star para marcar importante
- Checkbox para multi-select

**Panel de lectura** (derecha):
- Conversación completa
- Input para responder
- Adjuntar archivos
- Acciones:
  - Archivar
  - Marcar importante
  - Marcar como spam
  - Eliminar

**Botón**: "Nuevo mensaje"

**Features**:
- Búsqueda de mensajes
- Marcar como leído/no leído
- Notificaciones en tiempo real

---

### `/mensajes/[id]` - Conversación

**Vista detallada de una conversación**:
- Mensajes en orden cronológico
- Separador por fecha
- Avatar y nombre del remitente
- Hora del mensaje
- Archivos adjuntos inline
- Indicador de leído
- Reacciones (opcional)

**Input de respuesta**:
- Rich text editor
- Adjuntar archivos
- Emojis
- Mencionar (@)
- Guardar borrador

**Sidebar**:
- Participantes
- Archivos compartidos
- Pólizas relacionadas
- Links útiles

---

## 💳 MÓDULO 7: PAGOS

### `/pagos` - Historial de Pagos

**Vista principal**: Tabla de recibos

**Columnas**:
- Fecha de pago
- Póliza
- Concepto
- Monto
- Método de pago
- Estado (PAGADO, PENDIENTE, ATRASADO)
- Recibo (download)

**Filtros**:
- Por póliza
- Por estado
- Por rango de fechas
- Por método de pago

**Stats en cards**:
- Total pagado este año
- Total pendiente
- Próximo vencimiento
- Método de pago preferido

**Gráfica**:
- Pagos mensuales del último año

---

### `/pagos/pendientes` - Recibos Pendientes

**Lista de recibos pendientes**:
- Ordenados por fecha de vencimiento
- Alertas de vencimiento próximo
- Alertas de atraso

**Card por recibo**:
- Póliza
- Monto
- Fecha límite
- Días hasta vencimiento
- Botón "Pagar ahora"
- Botón "Programar pago"

**Modal de pago**:
- Resumen del recibo
- Método de pago:
  - Tarjeta guardada
  - Nueva tarjeta
  - Transferencia
  - Bizum
- Confirmación

**Domiciliación**:
- Opción de domiciliar
- Configurar pago automático

---

### `/pagos/metodos` - Métodos de Pago

**Lista de métodos guardados**:
- Tarjetas (últimos 4 dígitos)
- Cuentas bancarias
- Método por defecto (badge)

**Acciones**:
- Añadir nuevo método
- Editar
- Eliminar
- Establecer como predeterminado

**Modal añadir tarjeta**:
- Formulario seguro (Stripe/similar)
- CVV
- Fecha expiración
- Nombre en tarjeta
- Guardar para futuros pagos

---

## 🆘 MÓDULO 8: AYUDA Y SOPORTE

### `/ayuda` - Centro de Ayuda

**Hero search**:
- Buscador grande y prominente
- "¿En qué podemos ayudarte?"
- Sugerencias mientras escribe

**Categorías populares** (grid de cards):
- Pólizas
- Siniestros
- Pagos
- Documentos
- Mi cuenta
- Contacto

**Artículos destacados**:
- Lista de FAQs más visitados
- Cada uno con título, preview, link

**Contacto rápido**:
- Chat con IA
- Crear ticket
- Llamar por teléfono
- Email
- WhatsApp

**Videos tutoriales** (si hay)

---

### `/ayuda/faq` - Preguntas Frecuentes

**Categorías con acordeones**:
- Cada categoría expandible
- Búsqueda inline
- Breadcrumbs

**Formato de FAQ**:
- Pregunta (título)
- Respuesta (markdown con formato)
- ¿Te fue útil? (thumbs up/down)
- Botones:
  - Contactar si no resolvió
  - Artículos relacionados

---

### `/ayuda/contacto` - Contactar Soporte

**Formulario de contacto**:
- Nombre
- Email
- Teléfono
- Asunto
- Categoría
- Mensaje
- Adjuntar archivos

**O crear petición directamente**:
- Link a `/peticiones/nueva`

**Info de contacto**:
- Teléfono
- Email
- Horario de atención
- Dirección oficina

---

## 🎮 MÓDULO 9: GAMIFICACIÓN (Mejorar existentes)

### `/marketplace` - Mejorar

**Añadir**:
- Filtros por categoría
- Búsqueda
- Destacados de la semana
- History de canjes
- Wishlist
- Notificar cuando llegue a coins suficientes

---

### `/quizzes` - Mejorar

**Añadir**:
- Historial de quizzes
- Stats (racha, % aciertos)
- Leaderboard semanal
- Categorías de quiz
- Desafíos especiales

---

### `/referidos` - Mejorar

**Añadir**:
- Estadísticas detalladas
- Compartir en redes (botones)
- Email directo desde la app
- WhatsApp share
- Preview del link

---

### `/logros` - Página de Logros

**Nueva página**:
- Grid de todos los logros
- Desbloqueados vs bloqueados
- Progress bars
- Categorías
- Logros secretos
- Badges coleccionables

---

## 🎨 COMPONENTES REUTILIZABLES

### Crear estos componentes compartidos:

1. **PolicyCard** - Card de póliza reutilizable
2. **ClaimCard** - Card de siniestro
3. **DocumentCard** - Card de documento
4. **ChatMessage** - Mensaje de chat
5. **Timeline** - Línea temporal genérica
6. **FileUpload** - Componente de subida de archivos
7. **StatusBadge** - Badge de estado con colores
8. **ProgressRing** - Anillo de progreso
9. **EmptyState** - Estado vacío genérico
10. **LoadingState** - Estado de carga
11. **ErrorState** - Estado de error
12. **ConfirmDialog** - Modal de confirmación
13. **Toast** - Notificaciones toast
14. **Breadcrumbs** - Migas de pan
15. **Tabs** - Tabs reutilizable
16. **Table** - Tabla con sorting y filtrado
17. **Pagination** - Paginación
18. **SearchBar** - Barra de búsqueda
19. **FilterSidebar** - Sidebar de filtros
20. **ActionMenu** - Menú de acciones (3 dots)
21. **AvatarGroup** - Grupo de avatares
22. **StatCard** - Card de estadística
23. **ComparisonTable** - Tabla comparativa
24. **SignaturePad** - Pad de firma digital
25. **DateRangePicker** - Selector de rango de fechas

---

## 🔔 NOTIFICACIONES Y FEEDBACK

### Sistema de Notificaciones

**NotificationCenter** (ya existe - mejorar):
- Bell icon con badge
- Dropdown con lista
- Categorías:
  - Todas
  - Pólizas
  - Siniestros
  - Pagos
  - Sistema
- Marcar como leída
- Marcar todas
- Ver todas (página completa)
- Settings de notificaciones

**Toast Notifications**:
- Success
- Error
- Warning
- Info
- Con auto-dismiss
- Accionables (botones)

---

## 📱 RESPONSIVE & MOBILE

**Adaptaciones mobile**:
- Menú hamburguesa
- Bottom navigation (móvil)
- Swipe gestures
- Touch-friendly (botones grandes)
- Pull to refresh
- Scroll infinito
- Modales full-screen en móvil

---

## 🎨 TEMA Y DISEÑO

**Sistema de diseño**:
- Color primario: Red (Soriano Occident)
- Colores secundarios: Azul, Verde, Amarillo
- Modo oscuro completo
- Animaciones suaves (Framer Motion)
- Tipografía clara
- Espaciado consistente (Tailwind)
- Icons de Lucide React
- Skeleton loaders

---

## 🔐 SEGURIDAD Y PRIVACIDAD

**Features de seguridad**:
- 2FA (optional)
- Sesiones activas (ver y cerrar)
- Log de actividad
- Permisos granulares
- Términos y privacidad
- GDPR compliance
- Exportar mis datos
- Eliminar mi cuenta

---

## 📊 TOTAL DE PÁGINAS A CREAR

### Páginas principales: 35+
### Subpáginas: 20+
### Modales: 30+
### Componentes reutilizables: 25+

**Total estimado: ~110 archivos nuevos de frontend**

---

## ⏱️ TIEMPO ESTIMADO

**Por módulo**:
1. Dashboard: 2-3 horas
2. Pólizas: 6-8 horas
3. Siniestros: 6-8 horas
4. Peticiones/Tickets: 4-6 horas
5. Documentos: 4-5 horas
6. Mensajes: 3-4 horas
7. Pagos: 3-4 horas
8. Ayuda: 2-3 horas
9. Gamificación: 2-3 horas
10. Componentes: 4-5 horas

**TOTAL: 40-50 horas de desarrollo**

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

### Fase 1 (Crítica) - Core:
1. Dashboard principal ✅
2. Pólizas (lista + detalle)
3. Siniestros (lista + nuevo + detalle)
4. Peticiones/Tickets
5. Documentos básicos

### Fase 2 (Importante):
6. Cotizar póliza
7. Renovar póliza
8. Mensajes
9. Pagos
10. Componentes reutilizables

### Fase 3 (Mejoras):
11. Ayuda y FAQs
12. Mejoras gamificación
13. Stats y analytics
14. Perfil avanzado
15. Mobile optimizations

---

¿Empezamos a implementar? ¿Por dónde prefieres que empiece?
