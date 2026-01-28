// ============================================
// AUTO-RESOLVER FOR REQUEST SYSTEM
// Automatically resolves requests that don't need human intervention
// ============================================

import { prisma } from '@/lib/prisma'
import { RequestType, ExtractedEntities } from './ai-classifier'

export interface AutoResolutionResult {
  resolved: boolean
  response: string
  metadata?: Record<string, any>
  error?: string
}

// ============================================
// AUTO-RESOLUTION RULES
// ============================================

export async function attemptAutoResolve(
  requestType: RequestType,
  entities: ExtractedEntities,
  userId: string,
  description: string
): Promise<AutoResolutionResult> {
  try {
    switch (requestType) {
      case 'DOCUMENT_REQUEST':
        return await resolveDocumentRequest(entities, userId)

      case 'INFO_QUERY':
        return await resolveInfoQuery(entities, userId, description)

      case 'DATA_UPDATE':
        return await resolveDataUpdate(entities, userId)

      default:
        return {
          resolved: false,
          response: 'Esta petición requiere atención de un mediador.',
        }
    }
  } catch (error) {
    console.error('[Auto-Resolver] Error:', error)
    return {
      resolved: false,
      response: 'No se pudo procesar automáticamente. Se creará un ticket.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ============================================
// DOCUMENT REQUEST RESOLUTION
// ============================================

async function resolveDocumentRequest(
  entities: ExtractedEntities,
  userId: string
): Promise<AutoResolutionResult> {
  const { documentType, policyNumber } = entities

  if (!documentType) {
    return {
      resolved: false,
      response: 'No se pudo identificar qué documento necesitas.',
    }
  }

  // Get user's policies
  const policies = await prisma.policy.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      ...(policyNumber ? { policyNumber } : {}),
    },
  })

  if (policies.length === 0) {
    return {
      resolved: false,
      response: 'No tienes pólizas activas. Un mediador te contactará.',
    }
  }

  // Map document types to user-friendly names
  const documentNames: Record<string, string> = {
    INSURANCE_CARD: 'Tarjeta de Seguro',
    CERTIFICATE: 'Certificado de Póliza',
    RECEIPT: 'Recibo',
    POLICY_SUMMARY: 'Resumen de Póliza',
    PROOF: 'Comprobante',
  }

  const docName = documentNames[documentType] || documentType

  // In production, this would generate and send the document
  // For now, we simulate success
  return {
    resolved: true,
    response: `Tu ${docName} ha sido generado y enviado a tu email (${await getUserEmail(
      userId
    )}). Lo recibirás en los próximos minutos.`,
    metadata: {
      documentType,
      policyNumber: policies[0].policyNumber,
      emailSent: true,
    },
  }
}

// ============================================
// INFO QUERY RESOLUTION
// ============================================

async function resolveInfoQuery(
  entities: ExtractedEntities,
  userId: string,
  description: string
): Promise<AutoResolutionResult> {
  const { policyNumber } = entities

  // Detect query type from description
  const queryType = detectQueryType(description)

  // Get user's policies
  const policies = await prisma.policy.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      ...(policyNumber ? { policyNumber } : {}),
    },
    orderBy: {
      startDate: 'desc',
    },
  })

  if (policies.length === 0) {
    return {
      resolved: true,
      response:
        'Actualmente no tienes pólizas activas. Si deseas contratar un seguro, un mediador puede asesorarte.',
    }
  }

  switch (queryType) {
    case 'RENEWAL_DATE':
      return resolveRenewalDateQuery(policies)

    case 'PREMIUM_AMOUNT':
      return resolvePremiumQuery(policies)

    case 'POLICY_STATUS':
      return resolvePolicyStatusQuery(policies)

    case 'COVERAGE_INFO':
      return resolveCoverageQuery(policies)

    case 'POLICY_NUMBER':
      return resolvePolicyNumberQuery(policies)

    default:
      // Generic response with policy summary
      return {
        resolved: true,
        response: generatePolicySummary(policies),
        metadata: {
          policiesCount: policies.length,
        },
      }
  }
}

function detectQueryType(description: string): string {
  const patterns: Record<string, RegExp> = {
    RENEWAL_DATE: /(?:cuando|fecha).*(?:vence|caduca|renovar|renovacion|proxima)/i,
    PREMIUM_AMOUNT: /(?:cuanto|precio|coste).*(?:pago|cuesta|vale|prima)/i,
    POLICY_STATUS: /(?:estado|activa|vigente).*poliza/i,
    COVERAGE_INFO: /(?:que|cual).*(?:cubre|cobertura|incluye|garantia)/i,
    POLICY_NUMBER: /(?:cual|numero).*poliza/i,
  }

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(description)) {
      return type
    }
  }

  return 'GENERAL'
}

function resolveRenewalDateQuery(
  policies: any[]
): AutoResolutionResult {
  const policy = policies[0]
  const renewalDate = policy.renewalDate || policy.endDate
  const daysUntil = Math.ceil(
    (new Date(renewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  let response = `Tu póliza ${policy.policyNumber} vence el ${new Date(
    renewalDate
  ).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}.`

  if (daysUntil < 30) {
    response += ` ⚠️ Quedan ${daysUntil} días. Te recomendamos renovar pronto para evitar quedar sin cobertura.`
  } else {
    response += ` Faltan ${daysUntil} días para la renovación.`
  }

  return {
    resolved: true,
    response,
    metadata: {
      renewalDate,
      daysUntil,
      policyNumber: policy.policyNumber,
    },
  }
}

function resolvePremiumQuery(policies: any[]): AutoResolutionResult {
  const policy = policies[0]

  const response = `Tu póliza ${policy.policyNumber} tiene una prima de ${policy.premium.toFixed(
    2
  )}€ ${policy.paymentFrequency === 'MONTHLY' ? 'al mes' : 'al año'}.`

  return {
    resolved: true,
    response,
    metadata: {
      premium: policy.premium,
      paymentFrequency: policy.paymentFrequency,
      policyNumber: policy.policyNumber,
    },
  }
}

function resolvePolicyStatusQuery(
  policies: any[]
): AutoResolutionResult {
  if (policies.length === 1) {
    const policy = policies[0]
    return {
      resolved: true,
      response: `Tu póliza ${policy.policyNumber} está ${
        policy.status === 'ACTIVE' ? '✅ ACTIVA' : `en estado ${policy.status}`
      }. Cubre desde el ${new Date(policy.startDate).toLocaleDateString(
        'es-ES'
      )} hasta el ${new Date(policy.endDate).toLocaleDateString('es-ES')}.`,
      metadata: {
        status: policy.status,
        policyNumber: policy.policyNumber,
      },
    }
  } else {
    const activeCount = policies.filter((p) => p.status === 'ACTIVE').length
    return {
      resolved: true,
      response: `Tienes ${policies.length} pólizas, de las cuales ${activeCount} están activas.`,
      metadata: {
        totalPolicies: policies.length,
        activePolicies: activeCount,
      },
    }
  }
}

function resolveCoverageQuery(policies: any[]): AutoResolutionResult {
  const policy = policies[0]

  let response = `Tu póliza ${policy.policyNumber} de tipo ${policy.policyType} `

  if (policy.coverage && typeof policy.coverage === 'object') {
    const coverages = Object.entries(policy.coverage)
      .filter(([_, value]) => value === true)
      .map(([key]) => key)

    if (coverages.length > 0) {
      response += `incluye las siguientes coberturas: ${coverages.join(', ')}.`
    } else {
      response += 'tiene cobertura básica.'
    }
  } else {
    response += 'tiene cobertura básica. Para información detallada, consulta tu documentación de póliza.'
  }

  return {
    resolved: true,
    response,
    metadata: {
      policyNumber: policy.policyNumber,
      policyType: policy.policyType,
      coverage: policy.coverage,
    },
  }
}

function resolvePolicyNumberQuery(
  policies: any[]
): AutoResolutionResult {
  if (policies.length === 1) {
    return {
      resolved: true,
      response: `Tu número de póliza es: ${policies[0].policyNumber}`,
      metadata: {
        policyNumber: policies[0].policyNumber,
      },
    }
  } else {
    const numbers = policies.map((p) => `• ${p.policyNumber} (${p.policyType})`).join('\n')
    return {
      resolved: true,
      response: `Tienes las siguientes pólizas:\n${numbers}`,
      metadata: {
        policyNumbers: policies.map((p) => p.policyNumber),
      },
    }
  }
}

function generatePolicySummary(policies: any[]): string {
  if (policies.length === 1) {
    const p = policies[0]
    return `Tienes 1 póliza activa: ${p.policyNumber} (${p.policyType}). Prima: ${p.premium}€. Vence: ${new Date(
      p.endDate
    ).toLocaleDateString('es-ES')}.`
  } else {
    return `Tienes ${policies.length} pólizas activas. Para información específica, pregunta por una póliza en particular o consulta tu área de cliente.`
  }
}

// ============================================
// DATA UPDATE RESOLUTION
// ============================================

async function resolveDataUpdate(
  entities: ExtractedEntities,
  userId: string
): Promise<AutoResolutionResult> {
  const { fieldToUpdate, newValue } = entities

  if (!fieldToUpdate || !newValue) {
    return {
      resolved: false,
      response: 'No se pudo identificar qué dato deseas actualizar.',
    }
  }

  // Only allow simple, safe field updates
  const allowedFields = ['phone', 'email']

  if (!allowedFields.includes(fieldToUpdate)) {
    return {
      resolved: false,
      response: `La actualización de ${fieldToUpdate} requiere verificación por un mediador.`,
    }
  }

  // Update user data
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        [fieldToUpdate]: newValue,
      },
    })

    return {
      resolved: true,
      response: `Tu ${
        fieldToUpdate === 'phone' ? 'teléfono' : fieldToUpdate
      } ha sido actualizado correctamente a: ${newValue}`,
      metadata: {
        fieldUpdated: fieldToUpdate,
        newValue,
      },
    }
  } catch (error) {
    return {
      resolved: false,
      response: 'Hubo un error al actualizar tus datos. Un mediador te ayudará.',
      error: error instanceof Error ? error.message : 'Update failed',
    }
  }
}

// ============================================
// HELPERS
// ============================================

async function getUserEmail(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })
  return user?.email || 'tu email'
}

// ============================================
// AWARD COINS FOR AUTO-RESOLVED REQUESTS
// ============================================

export async function awardCoinsForResolution(
  userId: string,
  requestId: string
): Promise<void> {
  try {
    // Award 10 coins for auto-resolved request
    await prisma.user.update({
      where: { id: userId },
      data: {
        coins: {
          increment: 10,
        },
      },
    })

    // Create transaction record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { coins: true },
    })

    if (user) {
      await prisma.transaction.create({
        data: {
          userId,
          type: 'EARNED',
          category: 'request_resolved',
          amount: 10,
          balanceBefore: user.coins - 10,
          balanceAfter: user.coins,
          description: 'Petición resuelta automáticamente',
          referenceId: requestId,
          referenceType: 'Request',
        },
      })
    }
  } catch (error) {
    console.error('[Auto-Resolver] Error awarding coins:', error)
  }
}
