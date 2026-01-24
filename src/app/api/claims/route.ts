import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { ClaimStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const policyId = searchParams.get('policyId')
    const userId = searchParams.get('userId')
    const id = searchParams.get('id')

    // Get single claim by ID
    if (id) {
      const claim = await prisma.claim.findUnique({
        where: { id },
        include: {
          policy: {
            select: {
              id: true,
              policyNumber: true,
              type: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          timeline: {
            orderBy: { createdAt: 'asc' },
          },
          documents: true,
        },
      })

      if (!claim) {
        return NextResponse.json({ error: 'Siniestro no encontrado' }, { status: 404 })
      }

      return NextResponse.json({ claim })
    }

    // Build filter
    const where: Record<string, unknown> = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status.toUpperCase() as ClaimStatus
    }

    if (policyId) {
      where.policyId = policyId
    }

    const claims = await prisma.claim.findMany({
      where,
      include: {
        policy: {
          select: {
            id: true,
            policyNumber: true,
            type: true,
            name: true,
          },
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        documents: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate summary
    const openStatuses: ClaimStatus[] = ['COMUNICADO', 'DOCUMENTACION', 'EN_REVISION', 'APROBADO', 'EN_PROCESO']
    const openClaims = claims.filter(c => openStatuses.includes(c.status))
    const resolvedClaims = claims.filter(c => c.status === 'RESUELTO')

    return NextResponse.json({
      claims: claims.map(c => ({
        ...c,
        documentsCount: c.documents.length,
        lastUpdate: c.timeline[0]?.createdAt || c.updatedAt,
      })),
      total: claims.length,
      summary: {
        open: openClaims.length,
        resolved: resolvedClaims.length,
        rejected: claims.filter(c => c.status === 'RECHAZADO').length,
      },
    })
  } catch (error) {
    console.error('Claims API Error:', error)
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
    const requiredFields = ['policyId', 'userId', 'type', 'description', 'incidentDate']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate claim number
    const year = new Date().getFullYear()
    const count = await prisma.claim.count()
    const claimNumber = `SIN-${year}-${String(count + 1).padStart(3, '0')}`

    // Create claim with initial timeline entry
    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        policyId: body.policyId,
        userId: body.userId,
        type: body.type,
        description: body.description,
        status: 'COMUNICADO',
        amount: body.amount || null,
        incidentDate: new Date(body.incidentDate),
        timeline: {
          create: {
            status: 'COMUNICADO',
            title: 'Siniestro comunicado',
            description: 'Se ha recibido la comunicación del siniestro. Un agente revisará tu caso en las próximas 24-48 horas.',
          },
        },
      },
      include: {
        timeline: true,
        policy: {
          select: {
            policyNumber: true,
            type: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Siniestro comunicado correctamente. Te contactaremos en las próximas 24-48 horas.',
      claim,
    })
  } catch (error) {
    console.error('Create Claim API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, timelineNote, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de siniestro requerido' }, { status: 400 })
    }

    // Start a transaction to update claim and add timeline entry
    const result = await prisma.$transaction(async (tx) => {
      // Update the claim
      const claim = await tx.claim.update({
        where: { id },
        data: {
          ...(status && { status: status as ClaimStatus }),
          ...updates,
          ...(status === 'RESUELTO' && { resolvedDate: new Date() }),
        },
      })

      // Add timeline entry if status changed
      if (status) {
        const statusTitles: Record<ClaimStatus, string> = {
          COMUNICADO: 'Siniestro comunicado',
          DOCUMENTACION: 'Documentación solicitada',
          EN_REVISION: 'En revisión por perito',
          APROBADO: 'Siniestro aprobado',
          EN_PROCESO: 'Reparación en proceso',
          RESUELTO: 'Siniestro resuelto',
          RECHAZADO: 'Siniestro rechazado',
        }

        await tx.claimTimeline.create({
          data: {
            claimId: id,
            status: status as ClaimStatus,
            title: statusTitles[status as ClaimStatus] || status,
            description: timelineNote || null,
          },
        })
      }

      return claim
    })

    // Fetch updated claim with timeline
    const updatedClaim = await prisma.claim.findUnique({
      where: { id },
      include: {
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      claim: updatedClaim,
    })
  } catch (error) {
    console.error('Update Claim API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
