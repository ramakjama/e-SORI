import { NextRequest, NextResponse } from 'next/server'

// ============================================
// TYPES
// ============================================

interface CheckpointStatus {
  id: string
  daysBeforeExpiry: number
  coinsReward: number
  hasFreeSpinReward: boolean
  isCompleted: boolean
  completedAt?: string
  isAvailable: boolean
  isPassed: boolean
  availableUntil?: string
}

interface PolicyRenewalStatus {
  policyId: string
  policyNumber: string
  expiryDate: string
  daysUntilExpiry: number
  checkpoints: CheckpointStatus[]
  totalCoinsAvailable: number
  totalCoinsEarned: number
}

interface GetCheckpointsResponse {
  policies: PolicyRenewalStatus[]
  summary: {
    totalPolicies: number
    totalCoinsAvailable: number
    totalCoinsEarned: number
    freeSpinsAvailable: number
    urgentCount: number
  }
}

interface ClaimCheckpointResponse {
  success: boolean
  message: string
  coinsAwarded: number
  freeSpinAwarded: boolean
  newCoinBalance?: number
  checkpoint: {
    id: string
    daysBeforeExpiry: number
    completedAt: string
  }
}

// ============================================
// MOCK DATA
// ============================================

const now = new Date()
const futureDate = new Date(now)
futureDate.setDate(futureDate.getDate() + 22)

const MOCK_POLICIES: PolicyRenewalStatus[] = [
  {
    policyId: 'pol-001',
    policyNumber: 'AUTO-2024-1234',
    expiryDate: futureDate.toISOString(),
    daysUntilExpiry: 22,
    checkpoints: [
      { id: 'pol-001-T30', daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, isCompleted: true, completedAt: new Date(Date.now() - 8 * 86400000).toISOString(), isAvailable: false, isPassed: false },
      { id: 'pol-001-T15', daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, isCompleted: false, isAvailable: true, isPassed: false, availableUntil: new Date(Date.now() + 7 * 86400000).toISOString() },
      { id: 'pol-001-T7', daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, isCompleted: false, isAvailable: false, isPassed: false }
    ],
    totalCoinsAvailable: 450,
    totalCoinsEarned: 100
  },
  {
    policyId: 'pol-002',
    policyNumber: 'HOGAR-2024-5678',
    expiryDate: new Date(Date.now() + 35 * 86400000).toISOString(),
    daysUntilExpiry: 35,
    checkpoints: [
      { id: 'pol-002-T30', daysBeforeExpiry: 30, coinsReward: 100, hasFreeSpinReward: false, isCompleted: false, isAvailable: true, isPassed: false, availableUntil: new Date(Date.now() + 5 * 86400000).toISOString() },
      { id: 'pol-002-T15', daysBeforeExpiry: 15, coinsReward: 150, hasFreeSpinReward: false, isCompleted: false, isAvailable: false, isPassed: false },
      { id: 'pol-002-T7', daysBeforeExpiry: 7, coinsReward: 200, hasFreeSpinReward: true, isCompleted: false, isAvailable: false, isPassed: false }
    ],
    totalCoinsAvailable: 450,
    totalCoinsEarned: 0
  }
]

// ============================================
// GET - Get All Policy Renewal Checkpoints
// ============================================

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetCheckpointsResponse | { error: string }>> {
  try {
    return NextResponse.json({
      policies: MOCK_POLICIES,
      summary: {
        totalPolicies: 2,
        totalCoinsAvailable: 900,
        totalCoinsEarned: 100,
        freeSpinsAvailable: 0,
        urgentCount: 0
      }
    })
  } catch (error) {
    console.error('Renewal Checkpoint GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener renovaciones.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Claim a Renewal Checkpoint
// ============================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<ClaimCheckpointResponse | { error: string }>> {
  try {
    const body = await request.json()

    if (!body.policyId || !body.checkpointId) {
      return NextResponse.json(
        { error: 'Se requiere policyId y checkpointId.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Checkpoint T-15 completado! Has ganado 150 COINS.',
      coinsAwarded: 150,
      freeSpinAwarded: false,
      newCoinBalance: 600,
      checkpoint: {
        id: body.checkpointId,
        daysBeforeExpiry: 15,
        completedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Renewal Checkpoint POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al reclamar checkpoint.' },
      { status: 500 }
    )
  }
}
