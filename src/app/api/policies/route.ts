import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    // Get single policy by ID
    if (id) {
      const policy = await prisma.policy.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          claims: {
            select: {
              id: true,
              claimNumber: true,
              status: true,
              createdAt: true,
            },
          },
          documents: true,
          payments: {
            orderBy: { dueDate: 'desc' },
            take: 5,
          },
        },
      })

      if (!policy) {
        return NextResponse.json({ error: 'Póliza no encontrada' }, { status: 404 })
      }

      return NextResponse.json({ policy })
    }

    // Build filter
    const where: Record<string, unknown> = {}

    if (userId) {
      where.userId = userId
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    const policies = await prisma.policy.findMany({
      where,
      include: {
        claims: {
          where: {
            status: {
              notIn: ['RESUELTO', 'RECHAZADO'],
            },
          },
          select: {
            id: true,
          },
        },
        payments: {
          where: {
            status: 'PENDIENTE',
          },
          select: {
            id: true,
            amount: true,
            dueDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate summary
    const activePolicies = policies.filter(p => p.status === 'ACTIVA')
    const totalPremium = activePolicies.reduce((sum, p) => sum + p.premium, 0)

    return NextResponse.json({
      policies: policies.map(p => ({
        ...p,
        openClaims: p.claims.length,
        pendingPayments: p.payments.length,
      })),
      total: policies.length,
      summary: {
        active: activePolicies.length,
        totalPremium,
        byType: {
          auto: policies.filter(p => p.type === 'AUTO').length,
          hogar: policies.filter(p => p.type === 'HOGAR').length,
          vida: policies.filter(p => p.type === 'VIDA').length,
          salud: policies.filter(p => p.type === 'SALUD').length,
          decesos: policies.filter(p => p.type === 'DECESOS').length,
        },
      },
    })
  } catch (error) {
    console.error('Policies API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['type', 'startDate', 'userId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate policy number
    const year = new Date().getFullYear()
    const count = await prisma.policy.count()
    const policyNumber = `POL-${year}-${body.type.toUpperCase()}-${String(count + 1).padStart(3, '0')}`

    const policy = await prisma.policy.create({
      data: {
        policyNumber,
        type: body.type.toUpperCase(),
        status: 'PENDIENTE',
        userId: body.userId,
        name: body.name || `Seguro de ${body.type}`,
        description: body.description,
        premium: body.premium || 0,
        paymentFrequency: body.paymentFrequency || 'anual',
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : new Date(new Date(body.startDate).setFullYear(new Date(body.startDate).getFullYear() + 1)),
        coverages: body.coverages || [],
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitud de póliza recibida. Un agente te contactará pronto.',
      policy,
    })
  } catch (error) {
    console.error('Policy Create API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de póliza requerido' }, { status: 400 })
    }

    const policy = await prisma.policy.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      policy,
    })
  } catch (error) {
    console.error('Policy Update API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
