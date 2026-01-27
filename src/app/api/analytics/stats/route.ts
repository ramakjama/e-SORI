import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

interface CategoryStats {
  category: string
  count: number
}

interface MissionStats {
  missionId: string
  count: number
}

interface RewardStats {
  rewardId: string
  count: number
  totalCoins: number
}

interface AnalyticsStatsResponse {
  totalEvents: number
  eventsByCategory: CategoryStats[]
  mostCompletedMissions: MissionStats[]
  mostRedeemedRewards: RewardStats[]
  averageQuizScore: number
  userEngagement: {
    totalUsers: number
    activeUsersLast7Days: number
    activeUsersLast30Days: number
    totalQuizzesCompleted: number
    totalRewardsRedeemed: number
    totalCoinsEarned: number
    totalXPEarned: number
  }
}

// ============================================
// GET - Get Analytics Stats (Admin Only)
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<AnalyticsStatsResponse | { error: string }>> {
  try {
    // Get session and verify admin role
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized.' },
        { status: 401 }
      )
    }

    // Check for admin role (both ADMIN from auth-options and ADMIN from schema)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url)
    const daysParam = searchParams.get('days')
    const days = daysParam ? parseInt(daysParam) : 7

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // ========================================
    // 1. Total Events Count
    // ========================================
    const totalEvents = await prisma.analyticsEvent.count()

    // ========================================
    // 2. Events by Category (Last N Days)
    // ========================================
    const eventsByCategory = await prisma.analyticsEvent.groupBy({
      by: ['category'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: 'desc',
        },
      },
      take: 10,
    })

    const categoryStats: CategoryStats[] = eventsByCategory.map(item => ({
      category: item.category,
      count: item._count.category,
    }))

    // ========================================
    // 3. Most Completed Missions
    // ========================================
    const missionCompletions = await prisma.analyticsEvent.findMany({
      where: {
        category: 'gamification',
        action: 'mission_completed',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        label: true,
      },
    })

    const missionCounts = missionCompletions.reduce((acc, event) => {
      const missionId = event.label || 'unknown'
      acc[missionId] = (acc[missionId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostCompletedMissions: MissionStats[] = Object.entries(missionCounts)
      .map(([missionId, count]) => ({ missionId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // ========================================
    // 4. Most Redeemed Rewards
    // ========================================
    const rewardRedemptions = await prisma.analyticsEvent.findMany({
      where: {
        category: 'marketplace',
        action: 'reward_redeemed',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        label: true,
        value: true,
      },
    })

    const rewardStats = rewardRedemptions.reduce((acc, event) => {
      const rewardId = event.label || 'unknown'
      if (!acc[rewardId]) {
        acc[rewardId] = { count: 0, totalCoins: 0 }
      }
      acc[rewardId].count += 1
      acc[rewardId].totalCoins += event.value || 0
      return acc
    }, {} as Record<string, { count: number; totalCoins: number }>)

    const mostRedeemedRewards: RewardStats[] = Object.entries(rewardStats)
      .map(([rewardId, stats]) => ({
        rewardId,
        count: stats.count,
        totalCoins: stats.totalCoins
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // ========================================
    // 5. Average Quiz Score
    // ========================================
    const quizCompletions = await prisma.analyticsEvent.findMany({
      where: {
        category: 'gamification',
        action: 'quiz_completed',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        value: true,
      },
    })

    const totalQuizScore = quizCompletions.reduce((sum, quiz) => sum + (quiz.value || 0), 0)
    const averageQuizScore = quizCompletions.length > 0
      ? Math.round((totalQuizScore / quizCompletions.length) * 100) / 100
      : 0

    // ========================================
    // 6. User Engagement Metrics
    // ========================================
    const totalUsers = await prisma.user.count()

    // Active users last 7 days (users with any analytics event)
    const activeUsersLast7Days = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        userId: { not: null },
      },
      distinct: ['userId'],
      select: { userId: true },
    })

    // Active users last 30 days
    const activeUsersLast30Days = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        userId: { not: null },
      },
      distinct: ['userId'],
      select: { userId: true },
    })

    // Total quizzes completed
    const totalQuizzesCompleted = await prisma.quizAttempt.count()

    // Total rewards redeemed
    const totalRewardsRedeemed = await prisma.redemptionHistory.count()

    // Total coins earned (sum from wallet transactions)
    const coinsEarned = await prisma.walletTransaction.aggregate({
      where: {
        walletId: {
          contains: 'COINS',
        },
        type: 'EARN',
      },
      _sum: {
        amount: true,
      },
    })

    // Total XP earned
    const xpEarned = await prisma.walletTransaction.aggregate({
      where: {
        walletId: {
          contains: 'XP',
        },
        type: 'EARN',
      },
      _sum: {
        amount: true,
      },
    })

    // ========================================
    // Build Response
    // ========================================
    const response: AnalyticsStatsResponse = {
      totalEvents,
      eventsByCategory: categoryStats,
      mostCompletedMissions,
      mostRedeemedRewards,
      averageQuizScore,
      userEngagement: {
        totalUsers,
        activeUsersLast7Days: activeUsersLast7Days.length,
        activeUsersLast30Days: activeUsersLast30Days.length,
        totalQuizzesCompleted,
        totalRewardsRedeemed,
        totalCoinsEarned: coinsEarned._sum.amount || 0,
        totalXPEarned: xpEarned._sum.amount || 0,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Analytics Stats] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
