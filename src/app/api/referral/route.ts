import { NextRequest, NextResponse } from 'next/server'

// ============================================
// TYPES
// ============================================

type ReferralStage = 'INVITED' | 'INSTALL_OPEN' | 'PROFILE_QUIZ' | 'REQUESTED_REVIEW' | 'POLICY_PAID'

interface ReferralInfo {
  id: string
  code: string
  referredEmail: string | null
  referredPhone: string | null
  referredName: string | null
  stage: ReferralStage
  xpAwarded: number
  coinsAwarded: number
  createdAt: string
  updatedAt: string
}

interface ReferralListResponse {
  referrals: ReferralInfo[]
  stats: {
    total: number
    byStage: Record<ReferralStage, number>
    totalXPEarned: number
    totalCoinsEarned: number
    conversionRate: number
  }
  myCode: string
  shareUrl: string
}

interface CreateReferralResponse {
  success: boolean
  referral: ReferralInfo
  shareUrl: string
}

interface UpdateReferralResponse {
  success: boolean
  referral: ReferralInfo
  rewards?: {
    xpAwarded: number
    coinsAwarded: number
  }
}

// ============================================
// MOCK DATA
// ============================================

const now = new Date().toISOString()

const MOCK_REFERRALS: ReferralInfo[] = [
  {
    id: 'ref-1',
    code: 'SORI-A1B2C3',
    referredEmail: 'maria@example.com',
    referredPhone: null,
    referredName: 'Maria Garcia',
    stage: 'POLICY_PAID',
    xpAwarded: 285,
    coinsAwarded: 150,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'ref-2',
    code: 'SORI-D4E5F6',
    referredEmail: 'carlos@example.com',
    referredPhone: '+34612345678',
    referredName: 'Carlos Lopez',
    stage: 'PROFILE_QUIZ',
    xpAwarded: 35,
    coinsAwarded: 20,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'ref-3',
    code: 'SORI-G7H8I9',
    referredEmail: 'ana@example.com',
    referredPhone: null,
    referredName: 'Ana Martinez',
    stage: 'INSTALL_OPEN',
    xpAwarded: 10,
    coinsAwarded: 5,
    createdAt: now,
    updatedAt: now
  }
]

// ============================================
// GET - Lista de Referidos
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<ReferralListResponse | { error: string }>> {
  try {
    const response: ReferralListResponse = {
      referrals: MOCK_REFERRALS,
      stats: {
        total: 3,
        byStage: {
          INVITED: 0,
          INSTALL_OPEN: 1,
          PROFILE_QUIZ: 1,
          REQUESTED_REVIEW: 0,
          POLICY_PAID: 1
        },
        totalXPEarned: 330,
        totalCoinsEarned: 175,
        conversionRate: 33
      },
      myCode: 'SORI-DEMO01',
      shareUrl: 'https://e-sori.soriano.es/r/SORI-DEMO01'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Referral GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener referidos.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Crear Nuevo Referido
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<CreateReferralResponse | { error: string }>> {
  try {
    const body = await request.json().catch(() => ({}))
    const code = 'SORI-NEW123'

    const response: CreateReferralResponse = {
      success: true,
      referral: {
        id: 'ref-new',
        code,
        referredEmail: body.email || null,
        referredPhone: body.phone || null,
        referredName: body.name || null,
        stage: 'INVITED',
        xpAwarded: 0,
        coinsAwarded: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      shareUrl: `https://e-sori.soriano.es/r/${code}`
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Referral POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al crear referido.' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT - Avanzar Stage de Referido
// ============================================

export async function PUT(request: NextRequest): Promise<NextResponse<UpdateReferralResponse | { error: string }>> {
  try {
    const body = await request.json()

    if (!body.code) {
      return NextResponse.json(
        { error: 'Se requiere el codigo del referido.' },
        { status: 400 }
      )
    }

    const response: UpdateReferralResponse = {
      success: true,
      referral: {
        id: 'ref-updated',
        code: body.code,
        referredEmail: 'updated@example.com',
        referredPhone: null,
        referredName: 'Demo User',
        stage: body.newStage || 'INSTALL_OPEN',
        xpAwarded: 10,
        coinsAwarded: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      rewards: {
        xpAwarded: 10,
        coinsAwarded: 5
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Referral PUT Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar referido.' },
      { status: 500 }
    )
  }
}
