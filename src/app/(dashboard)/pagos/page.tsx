'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Euro
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Payment {
  id: string
  policyId: string
  policyNumber: string
  amount: number
  dueDate: string
  status: string
  paidAt?: string
  method?: string
}

export default function PagosPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [filterStatus])

  async function fetchPayments() {
    try {
      setLoading(true)
      let url = '/api/payments?limit=100'

      if (filterStatus !== 'all') {
        url += `&status=${filterStatus}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setPayments(data.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalPaid: payments.filter(p => p.status === 'PAID').length,
    totalPending: payments.filter(p => p.status === 'PENDING').length,
    totalAmount: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PAID: { label: 'Pagado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    OVERDUE: { label: 'Vencido', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle },
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <CreditCard className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando pagos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Historial de Pagos</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Consulta todos tus pagos y recibos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-occident to-occident/80 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Total Pagado</span>
            <Euro className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold">{stats.totalAmount.toFixed(2)}€</p>
          <p className="text-xs text-white/70 mt-1">{stats.totalPaid} pagos realizados</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Pendientes</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold">{stats.pendingAmount.toFixed(2)}€</p>
          <p className="text-xs text-gray-500 mt-1">{stats.totalPending} pagos pendientes</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Pagos Realizados</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold">{stats.totalPaid}</p>
          <p className="text-xs text-gray-500 mt-1">Este año</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Próximo Pago</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-lg font-bold">
            {payments.filter(p => p.status === 'PENDING')[0]
              ? new Date(payments.filter(p => p.status === 'PENDING')[0].dueDate).toLocaleDateString('es-ES')
              : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Próxima fecha de vencimiento</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {['all', 'PAID', 'PENDING', 'OVERDUE'].map((status) => (
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

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="p-12 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No hay pagos registrados</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Aún no has realizado ningún pago
          </p>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map((payment) => {
              const statusInfo = statusConfig[payment.status] || statusConfig.PENDING
              const StatusIcon = statusInfo.icon
              const isOverdue = payment.status === 'PENDING' && new Date(payment.dueDate) < new Date()

              return (
                <div key={payment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      payment.status === 'PAID' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        payment.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Pago de Póliza {payment.policyNumber}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Vencimiento: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                        </span>
                        {payment.paidAt && (
                          <>
                            <span>•</span>
                            <span>Pagado: {new Date(payment.paidAt).toLocaleDateString('es-ES')}</span>
                          </>
                        )}
                        {payment.method && (
                          <>
                            <span>•</span>
                            <span>{payment.method}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {payment.amount.toFixed(2)}€
                      </p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                        isOverdue ? statusConfig.OVERDUE.color : statusInfo.color
                      }`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {isOverdue ? 'Vencido' : statusInfo.label}
                      </div>
                    </div>

                    <button
                      type="button"
                      title="Descargar recibo"
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
