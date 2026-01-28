'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Shield,
  ArrowLeft,
  RefreshCw,
  Edit,
  Download,
  XCircle,
  CheckCircle,
  AlertTriangle,
  FileText,
  CreditCard,
  History,
  Clock,
  Euro,
  Calendar,
  Building,
  Phone,
  Mail,
  MapPin
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
  paymentFrequency: string
  coverageAmount: number
  riskLevel: string
  autoRenewal: boolean
  insuredItem?: {
    description: string
    value: number
    details?: any
  }
  coverages: Array<{
    id: string
    name: string
    description: string
    amount: number
    deductible: number
  }>
  beneficiaries?: Array<{
    id: string
    name: string
    relationship: string
    percentage: number
  }>
  claims?: Array<{
    id: string
    claimNumber: string
    type: string
    status: string
    amount: number
    createdAt: string
  }>
  documents?: Array<{
    id: string
    name: string
    type: string
    url: string
    createdAt: string
  }>
  payments?: Array<{
    id: string
    amount: number
    status: string
    dueDate: string
    paidAt?: string
  }>
  timeline?: Array<{
    id: string
    type: string
    description: string
    createdAt: string
  }>
}

export default function PolicyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('resumen')

  useEffect(() => {
    if (params?.id) {
      fetchPolicy()
    }
  }, [params?.id])

  async function fetchPolicy() {
    try {
      setLoading(true)
      const response = await fetch(`/api/policies/${params.id}`)
      if (!response.ok) throw new Error('Policy not found')
      const data = await response.json()
      setPolicy(data.policy)
    } catch (error) {
      console.error('Error fetching policy:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Shield },
    { id: 'coberturas', label: 'Coberturas', icon: CheckCircle },
    { id: 'siniestros', label: 'Siniestros', icon: AlertTriangle },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'historial', label: 'Historial', icon: History },
  ]

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    ACTIVE: { label: 'Activa', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    EXPIRED: { label: 'Expirada', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
    CANCELLED: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', icon: XCircle },
  }

  const getDaysUntilExpiry = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando póliza...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!policy) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Póliza no encontrada</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            La póliza que buscas no existe o no tienes acceso a ella
          </p>
          <Link
            href="/polizas"
            className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Pólizas
          </Link>
        </Card>
      </div>
    )
  }

  const statusInfo = statusConfig[policy.status] || statusConfig.PENDING
  const StatusIcon = statusInfo.icon
  const daysUntilExpiry = getDaysUntilExpiry(policy.endDate)
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/polizas"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-occident mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Pólizas
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-occident/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-8 h-8 text-occident" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{policy.type}</h1>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                <StatusIcon className="w-4 h-4" />
                {statusInfo.label}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-mono">{policy.policyNumber}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {policy.status === 'ACTIVE' && (
            <>
              <Link
                href={`/polizas/${policy.id}/renovar`}
                className="flex items-center gap-2 px-4 py-2 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Renovar
              </Link>
              <Link
                href={`/polizas/${policy.id}/modificar`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <Edit className="w-4 h-4" />
                Modificar
              </Link>
            </>
          )}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
        </div>
      </div>

      {/* Expiring Soon Warning */}
      {isExpiringSoon && policy.status === 'ACTIVE' && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-orange-900 dark:text-orange-200">
              Tu póliza vence en {daysUntilExpiry} días
            </p>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Fecha de vencimiento: {new Date(policy.endDate).toLocaleDateString('es-ES')}. Renueva pronto para mantener tu cobertura activa.
            </p>
          </div>
          <Link
            href={`/polizas/${policy.id}/renovar`}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium whitespace-nowrap"
          >
            Renovar ahora
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-occident border-b-2 border-occident'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información General */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Información General</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Aseguradora</span>
                  <span className="font-medium">{policy.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tipo de seguro</span>
                  <span className="font-medium">{policy.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Inicio de vigencia</span>
                  <span className="font-medium">{new Date(policy.startDate).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Fin de vigencia</span>
                  <span className="font-medium">{new Date(policy.endDate).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Auto-renovación</span>
                  <Badge className={policy.autoRenewal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {policy.autoRenewal ? 'Activada' : 'Desactivada'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nivel de riesgo</span>
                  <Badge className="bg-blue-100 text-blue-800">{policy.riskLevel}</Badge>
                </div>
              </div>
            </Card>

            {/* Información Económica */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Información Económica</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Prima</span>
                  <span className="font-semibold text-occident text-lg">{policy.premium}€/{policy.paymentFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Suma asegurada</span>
                  <span className="font-medium">{policy.coverageAmount.toLocaleString()}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Frecuencia de pago</span>
                  <span className="font-medium capitalize">{policy.paymentFrequency}</span>
                </div>
                {policy.payments && policy.payments.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Próximo pago</span>
                      <span className="font-medium">
                        {new Date(policy.payments[0].dueDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estado del pago</span>
                      <Badge className={
                        policy.payments[0].status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }>
                        {policy.payments[0].status === 'PAID' ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Bien Asegurado */}
          {policy.insuredItem && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Bien Asegurado</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Descripción</span>
                  <span className="font-medium">{policy.insuredItem.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Valor declarado</span>
                  <span className="font-medium">{policy.insuredItem.value.toLocaleString()}€</span>
                </div>
              </div>
            </Card>
          )}

          {/* Beneficiarios */}
          {policy.beneficiaries && policy.beneficiaries.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Beneficiarios</h3>
              <div className="space-y-3">
                {policy.beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{beneficiary.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{beneficiary.relationship}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{beneficiary.percentage}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'coberturas' && (
        <div className="space-y-4">
          {policy.coverages && policy.coverages.length > 0 ? (
            policy.coverages.map((coverage) => (
              <Card key={coverage.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{coverage.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{coverage.description}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                </div>
                <div className="flex gap-8 mt-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Suma asegurada</p>
                    <p className="font-semibold text-lg">{coverage.amount.toLocaleString()}€</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Franquicia</p>
                    <p className="font-medium">{coverage.deductible}€</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No hay coberturas registradas</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'siniestros' && (
        <div className="space-y-4">
          {policy.claims && policy.claims.length > 0 ? (
            policy.claims.map((claim) => (
              <Link key={claim.id} href={`/siniestros/${claim.id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{claim.claimNumber}</h4>
                        <Badge className={
                          claim.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{claim.type}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Reclamado: {claim.amount.toLocaleString()}€</span>
                        <span>•</span>
                        <span>{new Date(claim.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No hay siniestros</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No has reportado ningún siniestro en esta póliza
              </p>
              <Link
                href="/siniestros/nuevo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
              >
                Reportar Siniestro
              </Link>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'documentos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {policy.documents && policy.documents.length > 0 ? (
            policy.documents.map((doc) => (
              <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-occident/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-occident" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1 truncate">{doc.name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{doc.type}</p>
                    <p className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString('es-ES')}</p>
                  </div>
                  <button
                    type="button"
                    title="Descargar documento"
                    aria-label="Descargar documento"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">No hay documentos disponibles</p>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pagos' && (
        <div className="space-y-4">
          {policy.payments && policy.payments.length > 0 ? (
            policy.payments.map((payment) => (
              <Card key={payment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      payment.status === 'PAID' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${
                        payment.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{payment.amount}€</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Vencimiento: {new Date(payment.dueDate).toLocaleDateString('es-ES')}
                      </p>
                      {payment.paidAt && (
                        <p className="text-xs text-gray-500">
                          Pagado el {new Date(payment.paidAt).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={
                    payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }>
                    {payment.status === 'PAID' ? 'Pagado' : 'Pendiente'}
                  </Badge>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No hay pagos registrados</p>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'historial' && (
        <div className="space-y-4">
          {policy.timeline && policy.timeline.length > 0 ? (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              {policy.timeline.map((event, index) => (
                <div key={event.id} className="relative flex gap-4 mb-6">
                  <div className="w-12 h-12 bg-occident/10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                    <History className="w-5 h-5 text-occident" />
                  </div>
                  <Card className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{event.type}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">No hay historial disponible</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
