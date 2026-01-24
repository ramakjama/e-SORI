import { NextRequest, NextResponse } from 'next/server'

interface ContactRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  preferredContact?: 'email' | 'phone' | 'whatsapp'
  insuranceType?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message']
    for (const field of requiredFields) {
      if (!body[field as keyof ContactRequest]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      )
    }

    // In production, this would:
    // 1. Save to database
    // 2. Send notification to agents
    // 3. Send confirmation email to user
    // 4. Create lead in CRM

    const contactRecord = {
      id: `CONT-${Date.now()}`,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedResponseTime: '24 horas',
    }

    // Log for development
    console.log('Contact request received:', contactRecord)

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente. Te contactaremos en las próximas 24 horas.',
      reference: contactRecord.id,
      estimatedResponseTime: contactRecord.estimatedResponseTime,
    })
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}

// Callback request endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, name, preferredTime, reason } = body

    if (!phone || !name) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Validate Spanish phone number format
    const phoneRegex = /^(\+34|0034|34)?[6789]\d{8}$/
    const cleanPhone = phone.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Número de teléfono no válido' },
        { status: 400 }
      )
    }

    // In production, this would create a callback task for agents
    const callbackRecord = {
      id: `CB-${Date.now()}`,
      phone: cleanPhone,
      name,
      preferredTime: preferredTime || 'any',
      reason: reason || 'general',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    console.log('Callback request received:', callbackRecord)

    return NextResponse.json({
      success: true,
      message: 'Solicitud de llamada recibida. Te llamaremos lo antes posible.',
      reference: callbackRecord.id,
    })
  } catch (error) {
    console.error('Callback API Error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
