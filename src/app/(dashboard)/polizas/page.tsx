'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Plus,
  Grid3x3,
  List,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Euro,
  Download
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface Policy {
  id: string
  policyNumber: string
  type: string
  status: string
  company: string
  startDate: string
  endDate: string
  premium: number
  coverageAmount: number
  riskLevel: string
  autoRenewal: boolean
  insuredItem?: {
    description: string
    value: number
  }
}

interface PolicyStats {
  totalActive: number
  totalPremium: number
  expiringThisMonth: number
  avgCoverage: number
}

export default function PolizasPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [stats, setStats] = useState<PolicyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPolicies()
  }, [filterType, filterStatus])

  async function fetchPolicies() {
    try {
      setLoading(true)
      let url = '/api/policies?limit=100'

      if (filterType !== 'all') {
        url += `&type=${filterType}`
      }
      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`
      }

      const response = await fetch(url)
      const data = await response.json()

      setPolicies(data.policies || [])

      // Calculate stats
      const active = data.policies.filter((p: Policy) => p.status === 'ACTIVE')
      const totalPremium = active.reduce((sum: number, p: Policy) => sum + p.premium, 0)
      const expiringThisMonth = active.filter((p: Policy) => {
        const daysUntilExpiry = Math.ceil(
          (new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        return daysUntilExpiry > 0 && daysUntilExpiry <= 30
      }).length
      const avgCoverage = active.length > 0
        ? active.reduce((sum: number, p: Policy) => sum + p.coverageAmount, 0) / active.length
        : 0

      setStats({
        totalActive: active.length,
        totalPremium,
        expiringThisMonth,
        avgCoverage
      })
    } catch (error) {
      console.error('Error fetching policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const policyTypes = [
    { value: 'all', label: 'Todas', icon: Shield },
    { value: 'AUTO', label: 'Auto', icon: Shield },
    { value: 'HOGAR', label: 'Hogar', icon: Shield },
    { value: 'VIDA', label: 'Vida', icon: Shield },
    { value: 'SALUD', label: 'Salud', icon: Shield },
    { value: 'DECESOS', label: 'Decesos', icon: Shield },
    { value: 'EMPRESARIAL', label: 'Empresarial', icon: Shield },
  ]

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    ACTIVE: { label: 'Activa', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    EXPIRED: { label: 'Expirada', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
    CANCELLED: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', icon: AlertTriangle },
  }

  const riskLevelConfig: Record<string, { label: string; color: string }> = {
    LOW: { label: 'Bajo', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    MEDIUM: { label: 'Medio', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    HIGH: { label: 'Alto', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    CRITICAL: { label: 'Crítico', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  }

  const getDaysUntilExpiry = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = searchQuery === '' ||
      policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (policy.insuredItem?.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando pólizas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Pólizas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona todos tus seguros en un solo lugar
          </p>
        </div>
        <Link
          href="/polizas/cotizar"
          className="flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Cotizar Nuevo Seguro
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pólizas Activas</span>
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{stats.totalActive}</p>
            <p className="text-xs text-gray-500 mt-1">Total de seguros contratados</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Prima Mensual Total</span>
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{stats.totalPremium.toFixed(2)}€</p>
            <p className="text-xs text-gray-500 mt-1">Suma de todas las primas</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Próximas Renovaciones</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{stats.expiringThisMonth}</p>
            <p className="text-xs text-gray-500 mt-1">Vencen en los próximos 30 días</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cobertura Promedio</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">
              {(stats.avgCoverage / 1000).toFixed(0)}K€
            </p>
            <p className="text-xs text-gray-500 mt-1">Capital asegurado medio</p>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {policyTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setFilterType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === type.value
                    ? 'bg-occident text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            )
          })}
        </div>

        {/* Search and View Mode */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de póliza, aseguradora o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filtrar por estado"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident"
            >
              <option value="all">Todos los estados</option>
              <option value="ACTIVE">Activas</option>
              <option value="PENDING">Pendientes</option>
              <option value="EXPIRED">Expiradas</option>
            </select>

            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                aria-label="Vista en cuadrícula"
                title="Vista en cuadrícula"
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-occident'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-label="Vista en lista"
                title="Vista en lista"
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-occident'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Policies List */}
      {filteredPolicies.length === 0 ? (
        <Card className="p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No tienes pólizas</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Cotiza tu primer seguro y empieza a proteger lo que más te importa
          </p>
          <Link
            href="/polizas/cotizar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Cotizar Primer Seguro
          </Link>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredPolicies.map((policy) => {
            const statusInfo = statusConfig[policy.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon
            const daysUntilExpiry = getDaysUntilExpiry(policy.endDate)
            const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30
            const riskInfo = riskLevelConfig[policy.riskLevel] || riskLevelConfig.MEDIUM

            return (
              <Link key={policy.id} href={`/polizas/${policy.id}`}>
                <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                  isExpiringSoon && policy.status === 'ACTIVE' ? 'border-l-4 border-orange-500' : ''
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{policy.type}</h3>
                        {policy.autoRenewal && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Auto-renovación
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {policy.policyNumber}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {policy.insuredItem && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {policy.insuredItem.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Valor: {policy.insuredItem.value.toLocaleString()}€
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Aseguradora</span>
                      <span className="font-medium">{policy.company}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Prima</span>
                      <span className="font-semibold text-occident">{policy.premium}€/mes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Cobertura</span>
                      <span className="font-medium">{(policy.coverageAmount / 1000).toFixed(0)}K€</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Nivel de riesgo</span>
                      <Badge className={`${riskInfo.color} text-xs`}>
                        {riskInfo.label}
                      </Badge>
                    </div>
                  </div>

                  {isExpiringSoon && policy.status === 'ACTIVE' && (
                    <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-medium text-orange-900 dark:text-orange-200">
                          Vence en {daysUntilExpiry} días
                        </p>
                        <p className="text-orange-700 dark:text-orange-300 mt-0.5">
                          Fecha: {new Date(policy.endDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                    <span>
                      Inicio: {new Date(policy.startDate).toLocaleDateString('es-ES')}
                    </span>
                    <span>
                      Vence: {new Date(policy.endDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
