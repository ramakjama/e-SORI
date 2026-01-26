import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import prisma from '@/lib/prisma'
import { UserLevel } from '@prisma/client'

// ============================================
// TYPES
// ============================================

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly'

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
    percentile: number // Top X%
    usersAhead: number
    usersBehind: number
  } | null
  totalParticipants: number
  lastUpdated: string
}

// ============================================
// HELPERS
// ============================================

function getPeriodKey(period: LeaderboardPeriod, date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  switch (period) {
    case 'daily':
      return `daily_${year}-${month}-${day}`
    case 'weekly':
      const weekNumber = getISOWeek(date)
      return `weekly_${year}-W${String(weekNumber).padStart(2, '0')}`
    case 'monthly':
      return `monthly_${year}-${month}`
    default:
      return `daily_${year}-${month}-${day}`
  }
}

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getPeriodLabel(period: LeaderboardPeriod, date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Europe/Madrid' }

  switch (period) {
    case 'daily':
      return new Intl.DateTimeFormat('es-ES', {
        ...options,
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }).format(date)
    case 'weekly':
      const weekNum = getISOWeek(date)
      return `Semana ${weekNum} - ${date.getFullYear()}`
    case 'monthly':
      return new Intl.DateTimeFormat('es-ES', {
        ...options,
        month: 'long',
        year: 'numeric'
      }).format(date)
    default:
      return 'Hoy'
  }
}

function getPeriodDates(period: LeaderboardPeriod, date: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(date)
  const end = new Date(date)

  switch (period) {
    case 'daily':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'weekly':
      // Obtener inicio de semana (lunes)
      const dayOfWeek = start.getDay()
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      start.setDate(start.getDate() + diff)
      start.setHours(0, 0, 0, 0)
      // Fin de semana (domingo)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break
    case 'monthly':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0) // Ultimo dia del mes
      end.setHours(23, 59, 59, 999)
      break
  }

  return { start, end }
}

function isValidPeriod(period: string): period is LeaderboardPeriod {
  return ['daily', 'weekly', 'monthly'].includes(period)
}

// ============================================
// GET - Obtener Leaderboard
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ period: string }> }
): Promise<NextResponse<LeaderboardResponse | { error: string }>> {
  try {
    // Obtener y validar el periodo
    const { period } = await params

    if (!isValidPeriod(period)) {
      return NextResponse.json(
        { error: 'Periodo invalido. Use: daily, weekly o monthly' },
        { status: 400 }
      )
    }

    // Verificar autenticacion (opcional para ver, requerido para posicion)
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id || null

    // Calcular periodo actual
    const now = new Date()
    const periodKey = getPeriodKey(period, now)
    const periodLabel = getPeriodLabel(period, now)
    const { start: periodStart, end: periodEnd } = getPeriodDates(period, now)

    // Obtener top 10 del leaderboard
    const topEntries = await prisma.leaderboardEntry.findMany({
      where: { period: periodKey },
      orderBy: { xpEarned: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            level: true
          }
        }
      }
    })

    // Formatear top usuarios
    const topUsers: LeaderboardUser[] = topEntries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      name: entry.user.name,
      avatar: entry.user.avatar,
      level: entry.user.level,
      xpEarned: entry.xpEarned,
      isCurrentUser: entry.userId === currentUserId
    }))

    // Obtener total de participantes
    const totalParticipants = await prisma.leaderboardEntry.count({
      where: { period: periodKey }
    })

    // Obtener posicion del usuario actual si esta autenticado
    let currentUserPosition = null

    if (currentUserId) {
      const userEntry = await prisma.leaderboardEntry.findUnique({
        where: {
          userId_period: {
            userId: currentUserId,
            period: periodKey
          }
        }
      })

      if (userEntry) {
        // Contar usuarios con mas XP
        const usersAhead = await prisma.leaderboardEntry.count({
          where: {
            period: periodKey,
            xpEarned: { gt: userEntry.xpEarned }
          }
        })

        const rank = usersAhead + 1
        const percentile = totalParticipants > 0
          ? Math.round((1 - (rank / totalParticipants)) * 100)
          : 0

        currentUserPosition = {
          rank,
          xpEarned: userEntry.xpEarned,
          percentile: Math.max(0, percentile),
          usersAhead,
          usersBehind: totalParticipants - rank
        }
      } else {
        // Usuario no ha participado aun
        currentUserPosition = {
          rank: totalParticipants + 1,
          xpEarned: 0,
          percentile: 0,
          usersAhead: totalParticipants,
          usersBehind: 0
        }
      }
    }

    // Actualizar ranks en la base de datos (background job)
    updateRanks(periodKey).catch(console.error)

    const response: LeaderboardResponse = {
      period,
      periodLabel,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      topUsers,
      currentUserPosition,
      totalParticipants,
      lastUpdated: now.toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Leaderboard GET Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al obtener el leaderboard.' },
      { status: 500 }
    )
  }
}

// ============================================
// Background Job - Actualizar Rankings
// ============================================

async function updateRanks(periodKey: string): Promise<void> {
  try {
    // Obtener todas las entradas ordenadas por XP
    const entries = await prisma.leaderboardEntry.findMany({
      where: { period: periodKey },
      orderBy: { xpEarned: 'desc' },
      select: { id: true }
    })

    // Actualizar ranks en batch
    const updates = entries.map((entry, index) =>
      prisma.leaderboardEntry.update({
        where: { id: entry.id },
        data: { rank: index + 1 }
      })
    )

    // Ejecutar en chunks para evitar problemas de memoria
    const chunkSize = 100
    for (let i = 0; i < updates.length; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize)
      await prisma.$transaction(chunk)
    }
  } catch (error) {
    console.error('Error updating ranks:', error)
  }
}
