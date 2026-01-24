import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const leadSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido').regex(/^[0-9+\s-]+$/, 'Formato de teléfono inválido'),
  message: z.string().optional(),
  insuranceType: z.enum([
    'AUTO', 'HOGAR', 'SALUD', 'VIDA', 'DECESOS', 'MASCOTAS',
    'COMERCIO', 'COMUNIDADES', 'VIAJE', 'MOTO', 'ACCIDENTES',
    'RC_PROFESIONAL', 'GENERAL'
  ]).default('GENERAL'),
  source: z.string().min(1, 'Source es requerido'),
  campaign: z.string().optional(),
  landingPage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  referralCode: z.string().optional(),
  pointsAwarded: z.number().default(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = leadSchema.parse(body)

    // Get metadata from request
    const userAgent = request.headers.get('user-agent') || undefined
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0].trim() || undefined

    // In production with Prisma:
    // const lead = await prisma.lead.create({
    //   data: {
    //     ...validatedData,
    //     landingPage: validatedData.landingPage || request.headers.get('referer') || '',
    //     userAgent,
    //     ipAddress,
    //   },
    // })

    // For now, simulate creation with a mock ID
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Log the lead (in production this would be saved to DB)
    console.log('📩 Nuevo Lead Recibido:', {
      id: leadId,
      ...validatedData,
      userAgent: userAgent?.substring(0, 50),
      ipAddress,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Lead recibido correctamente',
      pointsAwarded: validatedData.pointsAwarded,
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      }, { status: 400 })
    }

    console.error('Error creating lead:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // This would be protected and used by admin/employees
  // For now, return a simple message
  return NextResponse.json({
    message: 'API de Leads activa. Use POST para crear un nuevo lead.',
    endpoints: {
      POST: 'Crear nuevo lead',
    },
  })
}
