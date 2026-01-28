/**
 * API ENDPOINT: Análisis de Cobertura Personalizado
 *
 * GET  /api/coverage/analysis - Obtiene análisis completo de necesidades
 * POST /api/coverage/analysis - Actualiza perfil de segmentación
 */

import { CoverageEngine, type UserSegmentData, type CurrentPolicy, type CoverageAnalysisResult } from '@/lib/coverage-engine-optimized'

const DEMO_MODE = process.env.DEMO_MODE === 'true' || true

// ============================================
// GET - Obtener Análisis de Cobertura
// ============================================

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    if (DEMO_MODE) {
      // En DEMO_MODE, retornar análisis con datos mock
      const mockSegment = getMockUserSegment()
      const mockPolicies = getMockCurrentPolicies()

      const engine = new CoverageEngine(mockSegment, mockPolicies)
      const analysis = engine.analyze()

      return Response.json({
        success: true,
        userId,
        analysis,
        segment: mockSegment,
        timestamp: new Date().toISOString()
      })
    }

    // TODO: Cuando se conecte la BD real
    // const prisma = new PrismaClient()
    // const userSegment = await prisma.userSegment.findUnique({ where: { userId } })
    // const policies = await prisma.policy.findMany({ where: { userId, status: 'ACTIVA' } })
    // const engine = new CoverageEngine(userSegment, policies)
    // const analysis = engine.analyze()

    return Response.json({
      success: true,
      message: 'Database not connected yet - showing demo data'
    }, { status: 503 })

  } catch (error) {
    console.error('Coverage Analysis Error:', error)
    return Response.json(
      { error: 'Error al obtener el análisis de cobertura' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Actualizar Perfil de Segmentación
// ============================================

interface UpdateSegmentPayload {
  userId?: string
  segment: Partial<UserSegmentData>
}

export async function POST(request: Request): Promise<Response> {
  try {
    let body: UpdateSegmentPayload
    try {
      body = await request.json()
    } catch {
      return Response.json(
        { error: 'Cuerpo de la solicitud inválido' },
        { status: 400 }
      )
    }

    const userId = body.userId || 'demo-user'
    const segmentData = body.segment

    if (!segmentData || Object.keys(segmentData).length === 0) {
      return Response.json(
        { error: 'Se requieren datos de segmentación' },
        { status: 400 }
      )
    }

    if (DEMO_MODE) {
      // En DEMO_MODE, simular actualización y retornar análisis actualizado
      const updatedSegment = { ...getMockUserSegment(), ...segmentData }
      const mockPolicies = getMockCurrentPolicies()

      const engine = new CoverageEngine(updatedSegment, mockPolicies)
      const analysis = engine.analyze()

      return Response.json({
        success: true,
        userId,
        message: 'Perfil actualizado correctamente (DEMO MODE)',
        analysis,
        segment: updatedSegment
      })
    }

    // TODO: Cuando se conecte la BD real
    // const prisma = new PrismaClient()
    // const userSegment = await prisma.userSegment.upsert({
    //   where: { userId },
    //   update: segmentData,
    //   create: { userId, ...segmentData }
    // })
    // return Response.json({ success: true, userSegment })

    return Response.json({
      success: false,
      message: 'Database not connected yet'
    }, { status: 503 })

  } catch (error) {
    console.error('Update Segment Error:', error)
    return Response.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    )
  }
}

// ============================================
// MOCK DATA PARA DEMO
// ============================================

function getMockUserSegment(): UserSegmentData {
  return {
    // Demográficas
    age: 35,
    maritalStatus: 'CASADO',
    hasChildren: true,
    numberOfChildren: 2,
    childrenAges: [5, 8],
    hasDependents: false,

    // Laborales
    employmentStatus: 'EMPLEADO_CUENTA_AJENA',
    monthlyIncome: 'ENTRE_3000_5000',
    hasSecondIncome: true,

    // Patrimonio
    housingStatus: 'VIVIENDA_PROPIA_CON_HIPOTECA',
    homeValue: 250000,
    hasMortgage: true,
    mortgageAmount: 180000,
    mortgageMonthly: 850,

    vehicleOwnership: 'PROPIO',
    hasVehicle: true,
    vehicleValue: 18000,
    vehicleType: 'Coche',

    // Financiero
    hasSavings: true,
    savingsAmount: 15000,
    hasDebts: false,
    monthlyExpenses: 2800,

    // Estilo de vida
    travelFrequency: 2,
    practicesSports: false,
    hasPets: false,
    numberOfPets: 0,

    // Salud
    hasHealthConditions: false,
    hasPublicHealthcare: true,
    hasPrivateHealthcare: false
  }
}

function getMockCurrentPolicies(): CurrentPolicy[] {
  return [
    { type: 'auto', status: 'ACTIVA', premium: 45 },
    { type: 'hogar', status: 'ACTIVA', premium: 25 }
    // No tiene: salud, vida, decesos
  ]
}
