import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

interface DocumentDetailResponse {
  id: string
  userId: string
  policyId: string | null
  claimId: string | null
  name: string
  type: string
  category: string
  url: string
  path: string
  size: number
  mimeType: string
  metadata: any
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  policy?: {
    id: string
    policyNumber: string
    type: string
    company: string
  }
  claim?: {
    id: string
    claimNumber: string
    type: string
    status: string
  }
}

// ============================================
// GET - Get Single Document Details
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

    const documentId = params.id

    // Fetch document with relations
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        policy: {
          select: {
            id: true,
            policyNumber: true,
            type: true,
            company: true,
          },
        },
        claim: {
          select: {
            id: true,
            claimNumber: true,
            type: true,
            status: true,
          },
        },
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado.' },
        { status: 404 }
      )
    }

    // Check authorization
    if (document.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para acceder a este documento.' },
        { status: 403 }
      )
    }

    // Format response
    const response: DocumentDetailResponse = {
      id: document.id,
      userId: document.userId,
      policyId: document.policyId,
      claimId: document.claimId,
      name: document.name,
      type: document.type,
      category: document.category,
      url: document.url,
      path: document.path,
      size: document.size,
      mimeType: document.mimeType,
      metadata: document.metadata,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
      user: document.user,
      policy: document.policy || undefined,
      claim: document.claim || undefined,
    }

    return NextResponse.json({ document: response })
  } catch (error) {
    console.error('[Document GET] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE - Delete Document
// ============================================

export async function DELETE(
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

    const documentId = params.id

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado.' },
        { status: 404 }
      )
    }

    // Check authorization
    if (document.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este documento.' },
        { status: 403 }
      )
    }

    // Delete document record
    await prisma.document.delete({
      where: { id: documentId },
    })

    // TODO: In production, also delete file from storage (S3/Cloudinary)
    // await deleteFromStorage(document.path)

    return NextResponse.json({
      message: 'Documento eliminado exitosamente.',
    })
  } catch (error) {
    console.error('[Document DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
