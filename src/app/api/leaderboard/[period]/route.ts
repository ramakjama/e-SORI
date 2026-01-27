// Using native Response instead of NextResponse to avoid module resolution issues

// ============================================
// TYPES
// ============================================

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly'
type UserLevel = 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'

interface LeaderboardUser {
  rank: number
  userId: string
  name: string | null
  avatar: string | null
  level: UserLevel
  xpEarned: number
  isCurrentUser: boolean
}

interface LeaderboardResponse {
  period: LeaderboardPeriod
  periodLabel: string
  periodStart: string
  periodEnd: string
  topUsers: LeaderboardUser[]
  currentUserPosition: {
    rank: number
    xpEarned: number
    percentile: number
    usersAhead: number
    usersBehind: number
  } | null
  totalParticipants: number
  lastUpdated: string
}

// ============================================
// HELPERS
// ============================================

function isValidPeriod(period: string): period is LeaderboardPeriod {
  return ['daily', 'weekly', 'monthly'].includes(period)
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_USERS: LeaderboardUser[] = [
  { rank: 1, userId: 'u1', name: 'Laura Fernandez', avatar: null, level: 'PLATINO', xpEarned: 520, isCurrentUser: false },
  { rank: 2, userId: 'u2', name: 'Miguel Torres', avatar: null, level: 'ORO', xpEarned: 480, isCurrentUser: false },
  { rank: 3, userId: 'u3', name: 'Carmen Ruiz', avatar: null, level: 'ORO', xpEarned: 445, isCurrentUser: false },
  { rank: 4, userId: 'u4', name: 'Demo User', avatar: null, level: 'PLATA', xpEarned: 410, isCurrentUser: true },
  { rank: 5, userId: 'u5', name: 'Pablo Sanchez', avatar: null, level: 'PLATA', xpEarned: 390, isCurrentUser: false },
  { rank: 6, userId: 'u6', name: 'Elena Martin', avatar: null, level: 'PLATA', xpEarned: 350, isCurrentUser: false },
  { rank: 7, userId: 'u7', name: 'David Gomez', avatar: null, level: 'BRONCE', xpEarned: 310, isCurrentUser: false },
  { rank: 8, userId: 'u8', name: 'Sofia Diaz', avatar: null, level: 'BRONCE', xpEarned: 275, isCurrentUser: false },
  { rank: 9, userId: 'u9', name: 'Javier Moreno', avatar: null, level: 'BRONCE', xpEarned: 240, isCurrentUser: false },
  { rank: 10, userId: 'u10', name: 'Isabel Navarro', avatar: null, level: 'BRONCE', xpEarned: 200, isCurrentUser: false }
]

// ============================================
// GET - Obtener Leaderboard
// ============================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ period: string }> }
): Promise<Response> {
  try {
    const { period } = await params

    if (!isValidPeriod(period)) {
      return Response.json(
        { error: 'Periodo invalido. Use: daily, weekly o monthly' },
        { status: 400 }
      )
    }

    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    const periodLabels: Record<LeaderboardPeriod, string> = {
      daily: 'Hoy',
      weekly: `Semana ${Math.ceil(now.getDate() / 7)}`,
      monthly: now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    }

    const response: LeaderboardResponse = {
      period,
      periodLabel: periodLabels[period],
      periodStart: start.toISOString(),
      periodEnd: end.toISOString(),
      topUsers: MOCK_USERS,
      currentUserPosition: {
        rank: 4,
        xpEarned: 410,
        percentile: 85,
        usersAhead: 3,
        usersBehind: 21
      },
      totalParticipants: 25,
      lastUpdated: now.toISOString()
    }

    return Response.json(response)
  } catch (error) {
    console.error('Leaderboard GET Error:', error)
    return Response.json(
      { error: 'Error interno del servidor al obtener el leaderboard.' },
      { status: 500 }
    )
  }
}
