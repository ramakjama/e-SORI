import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

interface PolicyDetailResponse {
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
  user: {
    id: string
    name: string
    email: string
  }
  documents: {
    id: string
    name: string
    type: string
    url: string
    size: number
    createdAt: string
  }[]
  claims: {
    id: string
    claimNumber: string
    type: string
    status: string
    amount: number | null
    date: string
    createdAt: string
  }[]
  reminders: {
    id: string
    type: string
    dueDate: string
    completed: boolean
  }[]
}

interface UpdatePolicyPayload {
  type?: string
  company?: string
  policyNumber?: string
  startDate?: string
  endDate?: string
  renewalDate?: string | null
  premium?: number
  coverage?: any
  status?: string
}

// ============================================
// GET - Get Single Policy Details
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Get session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado.' },
        { status: 401 }
      )
    }

    const policyId = params.id

    // Fetch policy with all relations
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            size: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        claims: {
          select: {
            id: true,
            claimNumber: true,
            type: true,
            status: true,
            amount: true,
            date: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        reminders: {
          select: {
            id: true,
            type: true,
            dueDate: true,
            completed: true,
          },
          where: {
            completed: false,
          },
          orderBy: {
            dueDate: 'asc',
          },
        },
      },
    })

    if (!policy) {
      return NextResponse.json(
        { error: 'Póliza no encontrada.' },
        { status: 404 }
      )
    }

    // Check authorization: user must own the policy or be admin
    if (policy.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a esta póliza.' },
        { status: 403 }
      )
    }

    // Format response
    const response: PolicyDetailResponse = {
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
      user: policy.user,
      documents: policy.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        url: doc.url,
        size: doc.size,
        createdAt: doc.createdAt.toISOString(),
      })),
      claims: policy.claims.map(claim => ({
        id: claim.id,
        claimNumber: claim.claimNumber,
        type: claim.type,
        status: claim.status,
        amount: claim.amount,
        date: claim.date.toISOString(),
        createdAt: claim.createdAt.toISOString(),
      })),
      reminders: policy.reminders.map(reminder => ({
        id: reminder.id,
        type: reminder.type,
        dueDate: reminder.dueDate.toISOString(),
        completed: reminder.completed,
      })),
    }

    return NextResponse.json({ policy: response })
  } catch (error) {
    console.error('[Policy GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH - Update Policy
// ============================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Get session
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado.' },
        { status: 401 }
      )
    }

    const policyId = params.id

    // Check if policy exists
    const existingPolicy = await prisma.policy.findUnique({
      where: { id: policyId },
    })

    if (!existingPolicy) {
      return NextResponse.json(
        { error: 'Póliza no encontrada.' },
        { status: 404 }
      )
    }

    // Check authorization: only admin can update
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Se requiere rol de administrador.' },
        { status: 403 }
      )
    }

    // Parse request body
    let body: UpdatePolicyPayload
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de solicitud inválido.' },
        { status: 400 }
      )
    }

    // If updating policy number, check uniqueness
    if (body.policyNumber && body.policyNumber !== existingPolicy.policyNumber) {
      const duplicatePolicy = await prisma.policy.findUnique({
        where: { policyNumber: body.policyNumber },
      })

      if (duplicatePolicy) {
        return NextResponse.json(
          { error: 'El número de póliza ya existe.' },
          { status: 409 }
        )
      }
    }

    // Build update data
    const updateData: any = {}
    if (body.type !== undefined) updateData.type = body.type
    if (body.company !== undefined) updateData.company = body.company
    if (body.policyNumber !== undefined) updateData.policyNumber = body.policyNumber
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate)
    if (body.renewalDate !== undefined) {
      updateData.renewalDate = body.renewalDate ? new Date(body.renewalDate) : null
    }
    if (body.premium !== undefined) updateData.premium = body.premium
    if (body.coverage !== undefined) updateData.coverage = body.coverage
    if (body.status !== undefined) updateData.status = body.status

    // Update policy
    const policy = await prisma.policy.update({
      where: { id: policyId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
            size: true,
            createdAt: true,
          },
        },
        claims: {
          select: {
            id: true,
            claimNumber: true,
            type: true,
            status: true,
            amount: true,
            date: true,
            createdAt: true,
          },
        },
      },
    })

    // Send notification to user if status changed
    if (body.status && body.status !== existingPolicy.status) {
      try {
        await prisma.notification.create({
          data: {
            userId: policy.userId,
            type: 'POLICY_STATUS_UPDATE',
            title: 'Estado de póliza actualizado',
            message: `El estado de tu póliza ${policy.policyNumber} ha cambiado a ${body.status}.`,
            priority: 'MEDIUM',
            read: false,
            actionUrl: `/policies/${policy.id}`,
            actionLabel: 'Ver póliza',
          },
        })
      } catch (notifError) {
        console.error('[Policy PATCH] Notification error:', notifError)
      }
    }

    // Format response
    const response: PolicyDetailResponse = {
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
      user: policy.user,
      documents: policy.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        url: doc.url,
        size: doc.size,
        createdAt: doc.createdAt.toISOString(),
      })),
      claims: policy.claims.map(claim => ({
        id: claim.id,
        claimNumber: claim.claimNumber,
        type: claim.type,
        status: claim.status,
        amount: claim.amount,
        date: claim.date.toISOString(),
        createdAt: claim.createdAt.toISOString(),
      })),
      reminders: [],
    }

    return NextResponse.json({
      message: 'Póliza actualizada exitosamente.',
      policy: response,
    })
  } catch (error) {
    console.error('[Policy PATCH] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE - Delete Policy (Admin Only)
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Get session and verify admin role
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado.' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acceso denegado. Se requiere rol de administrador.' },
        { status: 403 }
      )
    }

    const policyId = params.id

    // Check if policy exists
    const policy = await prisma.policy.findUnique({
      where: { id: policyId },
      include: {
        claims: {
          select: { id: true },
        },
        documents: {
          select: { id: true },
        },
      },
    })

    if (!policy) {
      return NextResponse.json(
        { error: 'Póliza no encontrada.' },
        { status: 404 }
      )
    }

    // Check if policy has claims (prevent deletion if it does)
    if (policy.claims.length > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una póliza con siniestros asociados.' },
        { status: 409 }
      )
    }

    // Delete associated data first
    // Delete reminders
    await prisma.reminder.deleteMany({
      where: { policyId },
    })

    // Delete documents (in production, also delete from storage)
    await prisma.document.deleteMany({
      where: { policyId },
    })

    // Delete policy
    await prisma.policy.delete({
      where: { id: policyId },
    })

    return NextResponse.json({
      message: 'Póliza eliminada exitosamente.',
    })
  } catch (error) {
    console.error('[Policy DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
