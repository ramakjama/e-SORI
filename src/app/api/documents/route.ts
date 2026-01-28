import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const policyId = searchParams.get('policyId')
    const claimId = searchParams.get('claimId')

    const where: any = { userId: session.user.id }
    if (category) where.category = category
    if (policyId) where.policyId = policyId
    if (claimId) where.claimId = claimId

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ documents, count: documents.length })
  } catch (error) {
    console.error('[Documents GET] Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.name || !body.type || !body.category || !body.url || !body.path || !body.size || !body.mimeType) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }

    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        policyId: body.policyId || null,
        claimId: body.claimId || null,
        name: body.name,
        type: body.type,
        category: body.category,
        url: body.url,
        path: body.path,
        size: body.size,
        mimeType: body.mimeType,
        metadata: body.metadata || {},
      },
    })

    return NextResponse.json({
      message: 'Documento subido exitosamente.',
      document,
    }, { status: 201 })
  } catch (error) {
    console.error('[Documents POST] Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}
