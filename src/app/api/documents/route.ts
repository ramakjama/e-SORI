import { NextRequest, NextResponse } from 'next/server'

// Document types available for download
type DocumentType = 'receipt' | 'certificate' | 'policy' | 'conditions'

interface DocumentRequest {
  type: DocumentType
  policyId: string
  receiptId?: string
}

// Mock data for document generation
const mockPolicyData = {
  'pol-1': {
    number: 'POL-AUTO-2024-5678',
    type: 'auto',
    holder: 'Juan García López',
    nif: '12345678A',
    address: 'C/ Mayor 15, 03570 Villajoyosa, Alicante',
    vehicle: {
      brand: 'Toyota',
      model: 'Corolla',
      plate: '1234 ABC',
      year: 2022,
    },
    premium: 324.50,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    company: 'Occident',
  },
}

export async function POST(request: NextRequest) {
  try {
    const { type, policyId, receiptId } = await request.json() as DocumentRequest

    if (!type || !policyId) {
      return NextResponse.json(
        { error: 'Type and policyId are required' },
        { status: 400 }
      )
    }

    // In production, this would generate actual PDFs using a library like @react-pdf/renderer
    // For now, we return metadata about the document

    const policy = mockPolicyData[policyId as keyof typeof mockPolicyData]

    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      )
    }

    const documentInfo = {
      receipt: {
        title: `Recibo ${receiptId || 'REC-2024-001234'}`,
        filename: `recibo_${policy.number}_${new Date().toISOString().split('T')[0]}.pdf`,
        description: 'Recibo de pago de prima',
      },
      certificate: {
        title: `Certificado de Seguro - ${policy.number}`,
        filename: `certificado_${policy.number}.pdf`,
        description: 'Certificado acreditativo de póliza en vigor',
      },
      policy: {
        title: `Póliza Completa - ${policy.number}`,
        filename: `poliza_${policy.number}.pdf`,
        description: 'Documento completo de la póliza con todas las coberturas',
      },
      conditions: {
        title: `Condiciones Generales - Seguro ${policy.type.toUpperCase()}`,
        filename: `condiciones_generales_${policy.type}.pdf`,
        description: 'Condiciones generales del producto contratado',
      },
    }

    const docInfo = documentInfo[type]

    // Generate document content (simplified for demo)
    const documentContent = {
      metadata: {
        title: docInfo.title,
        filename: docInfo.filename,
        description: docInfo.description,
        generatedAt: new Date().toISOString(),
        company: policy.company,
        mediator: 'Soriano Mediadores de Seguros S.L.',
      },
      policy: {
        number: policy.number,
        holder: policy.holder,
        nif: policy.nif,
        address: policy.address,
        type: policy.type,
        premium: policy.premium,
        startDate: policy.startDate,
        endDate: policy.endDate,
        vehicle: policy.vehicle,
      },
      footer: {
        mediator: 'Soriano Mediadores de Seguros S.L.',
        address: 'C/ Constitución 5, 03570 Villajoyosa, Alicante',
        phone: '966 810 290',
        email: 'info@sorianomediadores.es',
        cif: 'B12345678',
        dgsfp: 'J-1234',
      },
    }

    return NextResponse.json({
      success: true,
      document: documentContent,
      downloadUrl: `/api/documents/download?type=${type}&policyId=${policyId}`,
    })
  } catch (error) {
    console.error('Document API Error:', error)
    return NextResponse.json(
      { error: 'Error generating document' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve document info
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const policyId = searchParams.get('policyId')

  if (!policyId) {
    return NextResponse.json(
      { error: 'policyId is required' },
      { status: 400 }
    )
  }

  // Return available documents for the policy
  return NextResponse.json({
    available: {
      receipt: true,
      certificate: true,
      policy: true,
      conditions: true,
    },
    formats: ['pdf'],
    lastGenerated: {
      receipt: new Date().toISOString(),
      certificate: new Date().toISOString(),
      policy: new Date().toISOString(),
      conditions: new Date().toISOString(),
    },
  })
}
