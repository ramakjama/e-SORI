import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export interface PolicyResponse {
  id: string
  type: string
  company: string
  policyNumber: string
  startDate: string
  endDate: string
  renewalDate: string | null
  premium: number
  coverage: any
  status: string
  createdAt: string
  updatedAt: string
  documents?: {
    id: string
    name: string
    type: string
    createdAt: string
  }[]
  claims?: {
    id: string
    claimNumber: string
    type: string
    status: string
    createdAt: string
  }[]
}

interface CreatePolicyPayload {
  userId?: string
  type: string
  company: string
  policyNumber: string
  startDate: string
  endDate: string
  renewalDate?: string
  premium: number
  coverage: any
  status?: string
}

// ============================================
// GET - Get User's Policies
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado.' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const includeDocuments = searchParams.get('includeDocuments') === 'true'
    const includeClaims = searchParams.get('includeClaims') === 'true'

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    // Fetch policies
    const policies = await prisma.policy.findMany({
      where,
      include: {
        documents: includeDocuments ? {
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        } : false,
        claims: includeClaims ? {
          select: {
            id: true,
            claimNumber: true,
            type: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        } : false,
      },
      orderBy: {
        startDate: 'desc',
      },
    })

    // Format response
    const response: PolicyResponse[] = policies.map(policy => ({
      id: policy.id,
      type: policy.type,
      company: policy.company,
      policyNumber: policy.policyNumber,
      startDate: policy.startDate.toISOString(),
      endDate: policy.endDate.toISOString(),
      renewalDate: policy.renewalDate?.toISOString() || null,
      premium: policy.premium,
      coverage: policy.coverage,
      status: policy.status,
      createdAt: policy.createdAt.toISOString(),
      updatedAt: policy.updatedAt.toISOString(),
      documents: includeDocuments ? policy.documents : undefined,
      claims: includeClaims ? policy.claims : undefined,
    }))

    return NextResponse.json({
      policies: response,
      count: response.length,
    })
  } catch (error) {
    console.error('[Policies GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Create New Policy (Admin Only)
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado.' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado.' },
        { status: 403 }
      )
    }

    let body: CreatePolicyPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo inválido.' },
        { status: 400 }
      )
    }

    if (!body.type || !body.company || !body.policyNumber || !body.startDate || !body.endDate || body.premium === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos.' },
        { status: 400 }
      )
    }

    const policy = await prisma.policy.create({
      data: {
        userId: body.userId || session.user.id,
        type: body.type,
        company: body.company,
        policyNumber: body.policyNumber,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        renewalDate: body.renewalDate ? new Date(body.renewalDate) : null,
        premium: body.premium,
        coverage: body.coverage || {},
        status: body.status || 'ACTIVE',
      },
    })

    return NextResponse.json({
      message: 'Póliza creada exitosamente.',
      policy,
    }, { status: 201 })
  } catch (error) {
    console.error('[Policies POST] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
