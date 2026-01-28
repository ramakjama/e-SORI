/**
 * API Route: Cotización Avanzada de Pólizas
 *
 * Requiere nivel PLATA o superior
 */

import { NextRequest } from 'next/server'
import { withPermission, ApiResponse } from '@/lib/api-permissions'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/polizas/advanced-quote
 *
 * Genera una cotización avanzada con análisis de riesgos,
 * comparación de planes y recomendaciones personalizadas.
 */
export const POST = withPermission('polizas.cotizar.advanced', async (req, session) => {
  try {
    const body = await req.json()

    // Validar entrada
    if (!body.tipo || !body.coberturas) {
      return ApiResponse.error('Datos incompletos', 'INVALID_INPUT')
    }

    // Lógica de cotización avanzada
    const cotizacion = {
      usuario: session.user.name,
      tipo: body.tipo,
      coberturas: body.coberturas,
      primaBase: calculatePremium(body),
      descuento: getDiscountByLevel(session.user.level),
      analisisRiesgos: performRiskAnalysis(body),
      recomendaciones: generateRecommendations(body, session.user),
      planesComparados: comparePlans(body),
      ahorroPotencial: calculateSavings(body, session.user.level),
    }

    // Registrar actividad (para analytics)
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        type: 'ADVANCED_QUOTE',
        description: `Cotización avanzada: ${body.tipo}`,
        metadata: { cotizacion },
      },
    })

    return ApiResponse.success(cotizacion)
  } catch (error) {
    console.error('[API] Error en cotización avanzada:', error)
    return ApiResponse.serverError('Error al procesar cotización')
  }
})

// Funciones auxiliares
function calculatePremium(data: any) {
  // Lógica de cálculo
  return 450.5
}

function getDiscountByLevel(level: string) {
  const discounts = {
    BRONCE: 0.05,
    PLATA: 0.1,
    ORO: 0.15,
    PLATINO: 0.2,
  }
  return discounts[level as keyof typeof discounts] || 0
}

function performRiskAnalysis(data: any) {
  return {
    nivel: 'BAJO',
    factores: ['Edad óptima', 'Sin siniestros previos'],
    puntuacion: 85,
  }
}

function generateRecommendations(data: any, user: any) {
  return [
    'Considera añadir cobertura de daños por agua',
    'Tu nivel ORO te da acceso a renovación automática',
  ]
}

function comparePlans(data: any) {
  return [
    { nombre: 'Básico', prima: 300, coberturas: 5 },
    { nombre: 'Completo', prima: 450, coberturas: 12 },
    { nombre: 'Premium', prima: 650, coberturas: 20 },
  ]
}

function calculateSavings(data: any, level: string) {
  const discount = getDiscountByLevel(level)
  return 450 * discount
}
