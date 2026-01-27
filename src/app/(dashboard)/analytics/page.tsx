'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, Users, Trophy, ShoppingBag, Activity,
  Calendar, Filter, Download, RefreshCw, Award,
  Coins, Star, Target, Gift
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'

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

interface AnalyticsStats {
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
// COLORS FOR CHARTS
// ============================================

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

// ============================================
// ANALYTICS PAGE COMPONENT
// ============================================

export default function AnalyticsPage() {
  const router = useRouter()
  const { user } = useStore()
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<number>(7) // Last 7 days by default

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [user, router])

  // Fetch analytics stats
  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/analytics/stats?days=${dateRange}`)

      if (!response.ok) {
        if (response.status === 403) {
          setError('No tienes permisos para ver esta página.')
          return
        }
        throw new Error('Error al cargar estadísticas')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Error al cargar estadísticas. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStats()
    }
  }, [dateRange, user])

  // Don't render if not admin
  if (!user || user.role !== 'ADMIN') {
    return null
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Activity className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-6 py-2 bg-occident text-white rounded-lg hover:bg-occident-600 transition-colors"
          >
            Reintentar
          </button>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  // Prepare data for charts
  const categoryChartData = stats.eventsByCategory.map(item => ({
    name: item.category,
    eventos: item.count,
  }))

  const missionsChartData = stats.mostCompletedMissions.slice(0, 5).map(item => ({
    name: item.missionId.substring(0, 20),
    completadas: item.count,
  }))

  const rewardsChartData = stats.mostRedeemedRewards.slice(0, 5).map(item => ({
    name: item.rewardId.substring(0, 20),
    canjes: item.count,
    monedas: item.totalCoins,
  }))

  const engagementRate = stats.userEngagement.totalUsers > 0
    ? Math.round((stats.userEngagement.activeUsersLast7Days / stats.userEngagement.totalUsers) * 100)
    : 0

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Panel de Análisis</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Estadísticas y métricas de gamificación
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={14}>Últimos 14 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>

          <button
            onClick={fetchStats}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Recargar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <Badge variant="success">+{engagementRate}%</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {stats.userEngagement.totalUsers.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Usuarios</p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.userEngagement.activeUsersLast7Days} activos últimos 7 días
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge variant="info">Quizzes</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {stats.userEngagement.totalQuizzesCompleted.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Quizzes Completados</p>
          <p className="text-xs text-gray-500 mt-2">
            Promedio: {stats.averageQuizScore} puntos
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <Badge variant="warning">Monedas</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {stats.userEngagement.totalCoinsEarned.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monedas Ganadas</p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.userEngagement.totalXPEarned.toLocaleString()} XP total
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <Badge variant="default">Canjes</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {stats.userEngagement.totalRewardsRedeemed.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Recompensas Canjeadas</p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalEvents.toLocaleString()} eventos totales
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Events by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-occident" />
            Eventos por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="eventos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution Pie */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-occident" />
            Distribución de Eventos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="eventos"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Completed Missions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-occident" />
            Misiones Más Completadas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={missionsChartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="completadas" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Redeemed Rewards */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-occident" />
            Recompensas Más Canjeadas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rewardsChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="canjes" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Missions Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Misiones</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Misión
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completadas
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.mostCompletedMissions.slice(0, 10).map((mission, index) => (
                  <tr
                    key={mission.missionId}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400">
                          #{index + 1}
                        </span>
                        <span className="text-sm truncate">
                          {mission.missionId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant="success">{mission.count}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Rewards Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Recompensas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Recompensa
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Canjes
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monedas
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.mostRedeemedRewards.slice(0, 10).map((reward, index) => (
                  <tr
                    key={reward.rewardId}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400">
                          #{index + 1}
                        </span>
                        <span className="text-sm truncate">
                          {reward.rewardId}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant="info">{reward.count}</Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant="warning">{reward.totalCoins}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
