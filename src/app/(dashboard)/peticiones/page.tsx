'use client'

import { useState, useEffect } from 'react'
import { Send, Plus, CheckCircle, Clock, AlertCircle, Filter, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface Request {
  id: string
  title: string
  description: string
  type: string
  category: string
  priority: string
  status: string
  aiResolved: boolean
  aiResponse: string | null
  createdAt: string
  ticket?: {
    ticketNumber: string
    status: string
  }
}

export default function PeticionesPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchRequests()
  }, [filterStatus])

  async function fetchRequests() {
    try {
      setLoading(true)
      const url = filterStatus === 'all'
        ? '/api/requests?limit=50'
        : `/api/requests?status=${filterStatus}&limit=50`

      const response = await fetch(url)
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    PROCESSING: { label: 'Procesando', color: 'bg-blue-100 text-blue-800', icon: Clock },
    RESOLVED: { label: 'Resuelta', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    TICKET_CREATED: { label: 'Ticket Creado', color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
    CANCELLED: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
  }

  const priorityColors: Record<string, string> = {
    LOW: 'border-l-4 border-gray-400',
    MEDIUM: 'border-l-4 border-blue-500',
    HIGH: 'border-l-4 border-orange-500',
    URGENT: 'border-l-4 border-red-600',
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando peticiones...</p>
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
          <h1 className="text-3xl font-bold mb-2">Mis Peticiones</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus solicitudes y tickets
          </p>
        </div>
        <Link
          href="/peticiones/nueva"
          className="flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Nueva Petición
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'PENDING', 'RESOLVED', 'TICKET_CREATED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-occident text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status === 'all' ? 'Todas' : statusConfig[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card className="p-12 text-center">
          <Send className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No tienes peticiones</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Crea tu primera petición para gestionar seguros, solicitar documentos o consultar información
          </p>
          <Link
            href="/peticiones/nueva"
            className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Crear Primera Petición
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const statusInfo = statusConfig[request.status] || statusConfig.PENDING
            const StatusIcon = statusInfo.icon

            return (
              <Link key={request.id} href={`/peticiones/${request.id}`}>
                <Card className={`p-6 hover:shadow-lg transition-all cursor-pointer ${priorityColors[request.priority]}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{request.title}</h3>
                        {request.aiResolved && (
                          <Badge className="bg-green-100 text-green-800">
                            IA Resuelta
                          </Badge>
                        )}
                        {request.ticket && (
                          <Badge className="bg-purple-100 text-purple-800">
                            {request.ticket.ticketNumber}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {request.aiResolved && request.aiResponse && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <strong>Respuesta automática:</strong> {request.aiResponse}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Tipo: {request.type}</span>
                      <span>•</span>
                      <span>Categoría: {request.category}</span>
                      <span>•</span>
                      <span>Prioridad: {request.priority}</span>
                    </div>
                    <span>{new Date(request.createdAt).toLocaleDateString('es-ES')}</span>
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
