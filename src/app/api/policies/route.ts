import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      return NextResponse.json({
        policy: {
          id,
          policyNumber: 'POL-2024-AUTO-001',
          type: 'AUTO',
          status: 'ACTIVA',
          name: 'Seguro de Auto - Todo Riesgo',
          description: 'Cobertura completa para vehículo',
          premium: 45.90,
          paymentFrequency: 'mensual',
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2025-01-01T00:00:00.000Z',
          coverages: ['Responsabilidad civil', 'Daños propios', 'Robo', 'Asistencia en carretera'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          user: { id: 'demo-user-001', name: 'Carlos García López', email: 'demo@soriano.es' },
          claims: [],
          documents: [],
          payments: [],
        },
      })
    }

    const policies = [
      {
        id: 'policy-001',
        policyNumber: 'POL-2024-AUTO-001',
        type: 'AUTO',
        status: 'ACTIVA',
        name: 'Seguro de Auto - Todo Riesgo',
        premium: 45.90,
        paymentFrequency: 'mensual',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2025-01-01T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        openClaims: 1,
        pendingPayments: 0,
      },
      {
        id: 'policy-002',
        policyNumber: 'POL-2024-HOGAR-001',
        type: 'HOGAR',
        status: 'ACTIVA',
        name: 'Seguro de Hogar',
        premium: 25.00,
        paymentFrequency: 'mensual',
        startDate: '2024-02-01T00:00:00.000Z',
        endDate: '2025-02-01T00:00:00.000Z',
        createdAt: '2024-02-01T00:00:00.000Z',
        openClaims: 0,
        pendingPayments: 0,
      },
      {
        id: 'policy-003',
        policyNumber: 'POL-2024-VIDA-001',
        type: 'VIDA',
        status: 'ACTIVA',
        name: 'Seguro de Vida',
        premium: 30.00,
        paymentFrequency: 'mensual',
        startDate: '2024-03-01T00:00:00.000Z',
        endDate: '2025-03-01T00:00:00.000Z',
        createdAt: '2024-03-01T00:00:00.000Z',
        openClaims: 0,
        pendingPayments: 1,
      },
    ]

    return NextResponse.json({
      policies,
      total: policies.length,
      summary: {
        active: 3,
        totalPremium: 100.90,
        byType: { auto: 1, hogar: 1, vida: 1, salud: 0, decesos: 0 },
      },
    })
  } catch (error) {
    console.error('Policies API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ['type', 'startDate', 'userId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud de póliza recibida. Un agente te contactará pronto.',
      policy: {
        id: 'policy-new',
        policyNumber: `POL-${new Date().getFullYear()}-${body.type.toUpperCase()}-004`,
        type: body.type.toUpperCase(),
        status: 'PENDIENTE',
        name: body.name || `Seguro de ${body.type}`,
        premium: body.premium || 0,
        startDate: body.startDate,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Policy Create API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de póliza requerido' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      policy: { id, ...updates, updatedAt: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Policy Update API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
