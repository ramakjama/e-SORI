import { NextRequest, NextResponse } from 'next/server'

// ============================================
// TYPES
// ============================================

type WalletType = 'XP' | 'COINS' | 'SHIELDS'

interface SpinWheelPrize {
  id: string
  name: string
  description: string | null
  type: string
  value: number
  color: string | null
  icon: string | null
  probability: number
}

interface SpinResult {
  success: boolean
  prize: SpinWheelPrize
  winningIndex: number
  message: string
  walletUpdated?: {
    type: WalletType
    newBalance: number
    amountAdded: number
  }
}

interface SpinWheelGetResponse {
  canSpin: boolean
  reason?: string
  nextSpinAvailable?: string
  prizes: SpinWheelPrize[]
  spinsToday: number
  maxSpinsPerDay: number
  spinCost: {
    type: WalletType
    amount: number
  }
  freeSpinAvailable: boolean
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_PRIZES: SpinWheelPrize[] = [
  { id: 'p1', name: '10 XP', description: 'Bonus de experiencia', type: 'XP', value: 10, color: '#4CAF50', icon: 'star', probability: 0.25 },
  { id: 'p2', name: '25 XP', description: 'Bonus de experiencia', type: 'XP', value: 25, color: '#8BC34A', icon: 'star', probability: 0.15 },
  { id: 'p3', name: '50 XP', description: 'Gran bonus de experiencia', type: 'XP', value: 50, color: '#CDDC39', icon: 'stars', probability: 0.08 },
  { id: 'p4', name: '10 Monedas', description: 'Monedas para la tienda', type: 'COINS', value: 10, color: '#FFC107', icon: 'coin', probability: 0.20 },
  { id: 'p5', name: '25 Monedas', description: 'Monedas para la tienda', type: 'COINS', value: 25, color: '#FF9800', icon: 'coin', probability: 0.12 },
  { id: 'p6', name: '50 Monedas', description: 'Muchas monedas', type: 'COINS', value: 50, color: '#FF5722', icon: 'coins', probability: 0.05 },
  { id: 'p7', name: '1 Escudo', description: 'Protege tu racha', type: 'SHIELDS', value: 1, color: '#2196F3', icon: 'shield', probability: 0.10 },
  { id: 'p8', name: 'Suerte!', description: 'Sigue intentando', type: 'NOTHING', value: 0, color: '#9E9E9E', icon: 'refresh', probability: 0.05 }
]

// ============================================
// GET - Informacion de la Ruleta
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<SpinWheelGetResponse | { error: string }>> {
  try {
    const response: SpinWheelGetResponse = {
      canSpin: true,
      prizes: MOCK_PRIZES,
      spinsToday: 1,
      maxSpinsPerDay: 3,
      spinCost: { type: 'COINS', amount: 50 },
      freeSpinAvailable: true
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('SpinWheel GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

// ============================================
// POST - Girar la Ruleta
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<SpinResult | { error: string }>> {
  try {
    // Select a random prize weighted by probability
    const random = Math.random()
    let cumulative = 0
    let selectedIndex = MOCK_PRIZES.length - 1

    for (let i = 0; i < MOCK_PRIZES.length; i++) {
      cumulative += MOCK_PRIZES[i].probability
      if (random <= cumulative) {
        selectedIndex = i
        break
      }
    }

    const prize = MOCK_PRIZES[selectedIndex]

    const walletUpdated = prize.type !== 'NOTHING' && prize.value > 0
      ? { type: prize.type as WalletType, newBalance: 100 + prize.value, amountAdded: prize.value }
      : undefined

    const message = prize.type === 'NOTHING' || prize.value === 0
      ? 'No has ganado esta vez. Sigue intentando!'
      : `Felicidades! Has ganado ${prize.name}!`

    const response: SpinResult = {
      success: true,
      prize,
      winningIndex: selectedIndex,
      message,
      walletUpdated
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('SpinWheel POST Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al girar la ruleta.' },
      { status: 500 }
    )
  }
}
