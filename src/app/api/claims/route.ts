import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      return NextResponse.json({
        claim: {
          id,
          claimNumber: 'SIN-2024-001',
          policyId: 'policy-001',
          userId: 'demo-user-001',
          type: 'ACCIDENTE',
          description: 'Golpe en el parachoques trasero en aparcamiento',
          status: 'EN_REVISION',
          amount: 1200,
          incidentDate: '2024-06-10T00:00:00.000Z',
          createdAt: '2024-06-11T09:00:00.000Z',
          updatedAt: '2024-06-15T14:00:00.000Z',
          policy: { id: 'policy-001', policyNumber: 'POL-2024-AUTO-001', type: 'AUTO', name: 'Seguro de Auto' },
          user: { id: 'demo-user-001', name: 'Carlos García López', email: 'demo@soriano.es', phone: '+34 612 345 678' },
          timeline: [
            { id: 'tl-1', status: 'COMUNICADO', title: 'Siniestro comunicado', description: 'Se ha recibido la comunicación del siniestro.', createdAt: '2024-06-11T09:00:00.000Z' },
            { id: 'tl-2', status: 'EN_REVISION', title: 'En revisión por perito', description: 'Un perito ha sido asignado.', createdAt: '2024-06-13T10:00:00.000Z' },
          ],
          documents: [],
        },
      })
    }

    return NextResponse.json({
      claims: [
        {
          id: 'claim-001',
          claimNumber: 'SIN-2024-001',
          policyId: 'policy-001',
          userId: 'demo-user-001',
          type: 'ACCIDENTE',
          description: 'Golpe en el parachoques trasero',
          status: 'EN_REVISION',
          amount: 1200,
          incidentDate: '2024-06-10T00:00:00.000Z',
          createdAt: '2024-06-11T09:00:00.000Z',
          updatedAt: '2024-06-15T14:00:00.000Z',
          policy: { id: 'policy-001', policyNumber: 'POL-2024-AUTO-001', type: 'AUTO', name: 'Seguro de Auto' },
          documentsCount: 0,
          lastUpdate: '2024-06-15T14:00:00.000Z',
        },
      ],
      total: 1,
      summary: { open: 1, resolved: 0, rejected: 0 },
    })
  } catch (error) {
    console.error('Claims API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ['policyId', 'userId', 'type', 'description', 'incidentDate']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Siniestro comunicado correctamente. Te contactaremos en las próximas 24-48 horas.',
      claim: {
        id: 'claim-new',
        claimNumber: `SIN-${new Date().getFullYear()}-002`,
        policyId: body.policyId,
        userId: body.userId,
        type: body.type,
        description: body.description,
        status: 'COMUNICADO',
        amount: body.amount || null,
        incidentDate: body.incidentDate,
        createdAt: new Date().toISOString(),
        timeline: [
          { id: 'tl-new', status: 'COMUNICADO', title: 'Siniestro comunicado', description: 'Se ha recibido la comunicación del siniestro.', createdAt: new Date().toISOString() },
        ],
        policy: { policyNumber: 'POL-2024-AUTO-001', type: 'AUTO' },
      },
    })
  } catch (error) {
    console.error('Create Claim API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de siniestro requerido' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      claim: {
        id,
        claimNumber: 'SIN-2024-001',
        status: body.status || 'EN_REVISION',
        updatedAt: new Date().toISOString(),
        timeline: [
          { id: 'tl-1', status: 'COMUNICADO', title: 'Siniestro comunicado', description: null, createdAt: '2024-06-11T09:00:00.000Z' },
        ],
      },
    })
  } catch (error) {
    console.error('Update Claim API Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
