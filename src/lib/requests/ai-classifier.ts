// ============================================
// AI CLASSIFIER FOR REQUEST SYSTEM
// Classifies user requests and determines auto-resolution
// ============================================

export type RequestType =
  | 'DOCUMENT_REQUEST'
  | 'INFO_QUERY'
  | 'DATA_UPDATE'
  | 'POLICY_MODIFICATION'
  | 'QUOTE_REQUEST'
  | 'CLAIM_COMPLEX'
  | 'CANCELLATION'
  | 'ADVISORY'
  | 'COMPLAINT'
  | 'PAYMENT'
  | 'CONTRACT'
  | 'OTHER'

export type RequestCategory =
  | 'POLICY'
  | 'CLAIM'
  | 'DOCUMENT'
  | 'ACCOUNT'
  | 'PAYMENT'
  | 'COVERAGE'
  | 'CONTRACT'
  | 'GENERAL'

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface ExtractedEntities {
  policyNumber?: string
  policyType?: string // AUTO, HOGAR, VIDA, SALUD
  documentType?: string
  dateReference?: Date
  amount?: number
  vehicleInfo?: {
    plate?: string
    brand?: string
    model?: string
  }
  personInfo?: {
    name?: string
    dni?: string
  }
  queryType?: string
  fieldToUpdate?: string
  newValue?: string
}

export interface AIClassification {
  intent: RequestType
  category: RequestCategory
  priority: RequestPriority
  confidence: number // 0-1
  canAutoResolve: boolean
  suggestedAction: string
  extractedEntities: ExtractedEntities
  reasoning: string
}

// ============================================
// INTENT PATTERNS
// ============================================

const INTENT_PATTERNS: Record<RequestType, RegExp[]> = {
  DOCUMENT_REQUEST: [
    /necesito.*(?:tarjeta|certificado|recibo|comprobante)/i,
    /enviar.*documento/i,
    /solicito.*(?:copia|duplicado)/i,
    /descargar.*(?:poliza|seguro)/i,
    /quiero.*(?:tarjeta|certificado)/i,
    /mandame.*(?:documento|tarjeta|certificado)/i,
    /descargame.*recibo/i,
  ],

  INFO_QUERY: [
    /cuando.*(?:vence|caduca|renovar|proxima renovacion)/i,
    /cuanto.*(?:pago|cuesta|vale)/i,
    /que.*cobertura/i,
    /cual.*mi.*(?:poliza|numero)/i,
    /consultar.*(?:estado|informacion)/i,
    /esta.*(?:cubierto|garantia|incluido)/i,
    /cubre.*este.*seguro/i,
    /mi.*proxima.*renovacion/i,
  ],

  DATA_UPDATE: [
    /cambiar.*(?:telefono|email|direccion|datos)/i,
    /actualizar.*datos/i,
    /modificar.*contacto/i,
  ],

  POLICY_MODIFICATION: [
    /cambiar.*cobertura/i,
    /añadir.*conductor/i,
    /modificar.*poliza/i,
    /ampliar.*seguro/i,
    /cambiar.*vehiculo/i,
    /incluir.*(?:conductor|vehiculo)/i,
  ],

  QUOTE_REQUEST: [
    /presupuesto/i,
    /cotizacion/i,
    /cuanto.*costaria/i,
    /precio.*seguro/i,
    /quiero.*contratar/i,
  ],

  CLAIM_COMPLEX: [
    /siniestro/i,
    /accidente/i,
    /parte.*(?:amistoso|europeo)/i,
    /reclamar/i,
    /abrir.*siniestro/i,
    /reportar.*(?:accidente|dano)/i,
  ],

  CANCELLATION: [
    /cancelar.*poliza/i,
    /dar.*baja/i,
    /anular.*seguro/i,
  ],

  PAYMENT: [
    /pagar.*recibo/i,
    /abonar/i,
    /realizar.*pago/i,
    /metodo.*pago/i,
  ],

  CONTRACT: [
    /contratar.*(?:seguro|poliza)/i,
    /nueva.*poliza/i,
    /quiero.*un.*seguro/i,
    /contratar.*con.*agente/i,
  ],

  ADVISORY: [
    /asesoramiento/i,
    /aconsejar/i,
    /que.*seguro.*necesito/i,
    /recomendar/i,
  ],

  COMPLAINT: [
    /queja/i,
    /disconforme/i,
    /reclamacion/i,
    /problema.*(?:servicio|atencion)/i,
  ],

  OTHER: [],
}

// ============================================
// ENTITY EXTRACTION
// ============================================

function extractPolicyNumber(text: string): string | undefined {
  // Pattern: POL-YYYY-NNN or similar
  const match = text.match(/POL[-_]?\d{4}[-_]?\d+/i)
  return match ? match[0] : undefined
}

function extractPolicyType(text: string): string | undefined {
  const types = ['AUTO', 'HOGAR', 'VIDA', 'SALUD', 'VIAJE']
  for (const type of types) {
    if (new RegExp(type, 'i').test(text)) {
      return type
    }
  }
  return undefined
}

function extractDocumentType(text: string): string | undefined {
  const documentKeywords: Record<string, string> = {
    'tarjeta': 'INSURANCE_CARD',
    'certificado': 'CERTIFICATE',
    'recibo': 'RECEIPT',
    'poliza': 'POLICY_SUMMARY',
    'comprobante': 'PROOF',
  }

  for (const [keyword, docType] of Object.entries(documentKeywords)) {
    if (new RegExp(keyword, 'i').test(text)) {
      return docType
    }
  }
  return undefined
}

function extractAmount(text: string): number | undefined {
  // Pattern: números seguidos de € o EUR
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:€|EUR|euros?)/i)
  if (match) {
    return parseFloat(match[1].replace(',', '.'))
  }
  return undefined
}

function extractEntities(text: string): ExtractedEntities {
  return {
    policyNumber: extractPolicyNumber(text),
    policyType: extractPolicyType(text),
    documentType: extractDocumentType(text),
    amount: extractAmount(text),
  }
}

// ============================================
// CLASSIFICATION LOGIC
// ============================================

function classifyIntent(text: string): {
  intent: RequestType
  confidence: number
} {
  let bestMatch: { intent: RequestType; confidence: number } = {
    intent: 'OTHER',
    confidence: 0,
  }

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        // Calculate confidence based on pattern specificity
        const confidence = 0.7 + patterns.length * 0.05
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intent as RequestType,
            confidence: Math.min(confidence, 1.0),
          }
        }
      }
    }
  }

  return bestMatch
}

function determineCategory(intent: RequestType): RequestCategory {
  const categoryMap: Record<RequestType, RequestCategory> = {
    DOCUMENT_REQUEST: 'DOCUMENT',
    INFO_QUERY: 'POLICY',
    DATA_UPDATE: 'ACCOUNT',
    POLICY_MODIFICATION: 'POLICY',
    QUOTE_REQUEST: 'CONTRACT',
    CLAIM_COMPLEX: 'CLAIM',
    CANCELLATION: 'POLICY',
    ADVISORY: 'GENERAL',
    COMPLAINT: 'GENERAL',
    PAYMENT: 'PAYMENT',
    CONTRACT: 'CONTRACT',
    OTHER: 'GENERAL',
  }
  return categoryMap[intent]
}

function determinePriority(intent: RequestType): RequestPriority {
  const priorityMap: Record<RequestType, RequestPriority> = {
    DOCUMENT_REQUEST: 'LOW',
    INFO_QUERY: 'LOW',
    DATA_UPDATE: 'LOW',
    POLICY_MODIFICATION: 'MEDIUM',
    QUOTE_REQUEST: 'HIGH',
    CLAIM_COMPLEX: 'URGENT',
    CANCELLATION: 'MEDIUM',
    ADVISORY: 'LOW',
    COMPLAINT: 'HIGH',
    PAYMENT: 'MEDIUM',
    CONTRACT: 'HIGH',
    OTHER: 'MEDIUM',
  }
  return priorityMap[intent]
}

function canAutoResolve(
  intent: RequestType,
  entities: ExtractedEntities
): boolean {
  switch (intent) {
    case 'DOCUMENT_REQUEST':
      // Can auto-resolve if we know which document
      return !!entities.documentType

    case 'INFO_QUERY':
      // Can auto-resolve simple queries
      return true

    case 'DATA_UPDATE':
      // Can auto-resolve simple field updates
      return true

    default:
      return false
  }
}

function getSuggestedAction(
  intent: RequestType,
  canResolve: boolean
): string {
  if (canResolve) {
    switch (intent) {
      case 'DOCUMENT_REQUEST':
        return 'Generar y enviar documento automáticamente'
      case 'INFO_QUERY':
        return 'Proporcionar información desde la base de datos'
      case 'DATA_UPDATE':
        return 'Actualizar datos del usuario'
      default:
        return 'Procesar automáticamente'
    }
  } else {
    return 'Crear ticket para gestión manual por mediador'
  }
}

// ============================================
// MAIN CLASSIFIER FUNCTION
// ============================================

export function classifyRequest(
  title: string,
  description: string
): AIClassification {
  const fullText = `${title} ${description}`

  // Step 1: Classify intent
  const { intent, confidence } = classifyIntent(fullText)

  // Step 2: Extract entities
  const entities = extractEntities(fullText)

  // Step 3: Determine category
  const category = determineCategory(intent)

  // Step 4: Determine priority
  const priority = determinePriority(intent)

  // Step 5: Check if can auto-resolve
  const canResolve = canAutoResolve(intent, entities)

  // Step 6: Get suggested action
  const suggestedAction = getSuggestedAction(intent, canResolve)

  // Step 7: Generate reasoning
  const reasoning = `Clasificado como ${intent} con confianza ${(
    confidence * 100
  ).toFixed(0)}%. ` +
    `Categoría: ${category}. Prioridad: ${priority}. ` +
    (canResolve
      ? 'Puede resolverse automáticamente.'
      : 'Requiere intervención humana.')

  return {
    intent,
    category,
    priority,
    confidence,
    canAutoResolve: canResolve,
    suggestedAction,
    extractedEntities: entities,
    reasoning,
  }
}

// ============================================
// HELPER: Get human-readable intent
// ============================================

export function getIntentLabel(intent: RequestType): string {
  const labels: Record<RequestType, string> = {
    DOCUMENT_REQUEST: 'Solicitud de Documento',
    INFO_QUERY: 'Consulta de Información',
    DATA_UPDATE: 'Actualización de Datos',
    POLICY_MODIFICATION: 'Modificación de Póliza',
    QUOTE_REQUEST: 'Solicitud de Presupuesto',
    CLAIM_COMPLEX: 'Siniestro Complejo',
    CANCELLATION: 'Cancelación',
    ADVISORY: 'Asesoramiento',
    COMPLAINT: 'Queja/Reclamación',
    PAYMENT: 'Pago',
    CONTRACT: 'Contratar Seguro',
    OTHER: 'Otro',
  }
  return labels[intent]
}
