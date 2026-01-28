'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Euro,
  Search,
  Filter
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface Claim {
  id: string
  claimNumber: string
  policyId: string
  policyNumber: string
  type: string
  status: string
  amountClaimed: number
  amountApproved?: number
  description: string
  incidentDate: string
  createdAt: string
  resolvedAt?: string
}

export default function SiniestrosPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchClaims()
  }, [filterStatus])

  async function fetchClaims() {
    try {
      setLoading(true)
      let url = '/api/claims?limit=50'

      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setClaims(data.claims || [])
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    UNDER_REVIEW: { label: 'En revisión', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: FileText },
    APPROVED: { label: 'Aprobado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
    PAID: { label: 'Pagado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  }

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = searchQuery === '' ||
      claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando siniestros...</p>
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
          <h1 className="text-3xl font-bold mb-2">Mis Siniestros</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona y da seguimiento a tus reclamaciones
          </p>
        </div>
        <Link
          href="/siniestros/nuevo"
          className="flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Reportar Siniestro
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-occident text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'Todos' : statusConfig[status]?.label || status}
            </button>
          ))}
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número de siniestro o tipo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
          />
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No tienes siniestros</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No has reportado ningún siniestro. ¡Esperamos que siga así!
          </p>
          <Link
            href="/siniestros/nuevo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Reportar Primer Siniestro
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const statusInfo = statusConfig[claim.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon

            return (
              <Link key={claim.id} href={`/siniestros/${claim.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{claim.claimNumber}</h3>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{claim.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">Póliza: {claim.policyNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Monto reclamado</p>
                      <p className="font-semibold text-occident">{claim.amountClaimed.toLocaleString()}€</p>
                    </div>
                    {claim.amountApproved && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Monto aprobado</p>
                        <p className="font-semibold text-green-600">{claim.amountApproved.toLocaleString()}€</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fecha del incidente</p>
                      <p className="font-medium">{new Date(claim.incidentDate).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fecha de reporte</p>
                      <p className="font-medium">{new Date(claim.createdAt).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>

                  {claim.description && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {claim.description}
                      </p>
                    </div>
                  )}
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
