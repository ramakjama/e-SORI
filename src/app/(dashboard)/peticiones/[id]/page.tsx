'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bot,
  User,
  XCircle,
  MessageCircle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface TicketMessage {
  id: string
  senderType: 'USER' | 'MEDIATOR' | 'SYSTEM'
  senderName: string
  message: string
  createdAt: string
  read: boolean
}

interface Ticket {
  id: string
  ticketNumber: string
  status: string
  messages: TicketMessage[]
  assignedTo?: {
    name: string
    email: string
  }
}

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
  aiClassification: any
  createdAt: string
  resolvedAt?: string
  ticket?: Ticket
  policy?: {
    policyNumber: string
    type: string
  }
}

export default function PeticionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [request, setRequest] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchRequest()
    }
  }, [params?.id])

  async function fetchRequest() {
    try {
      setLoading(true)
      const response = await fetch(`/api/requests/${params.id}`)
      if (!response.ok) throw new Error('Request not found')
      const data = await response.json()
      setRequest(data.request)
    } catch (error) {
      console.error('Error fetching request:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !request?.ticket) return

    try {
      setSending(true)
      const response = await fetch(`/api/tickets/${request.ticket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      })

      if (!response.ok) throw new Error('Failed to send message')

      setNewMessage('')
      fetchRequest() // Refresh to get new message
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  async function handleCancel() {
    if (!confirm('¿Estás seguro de que deseas cancelar esta petición?')) return

    try {
      const response = await fetch(`/api/requests/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' })
      })

      if (!response.ok) throw new Error('Failed to cancel request')

      router.push('/peticiones')
    } catch (error) {
      console.error('Error canceling request:', error)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    PROCESSING: { label: 'Procesando', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
    RESOLVED: { label: 'Resuelta', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    TICKET_CREATED: { label: 'Ticket Creado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: AlertTriangle },
    CANCELLED: { label: 'Cancelada', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', icon: XCircle },
  }

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <MessageCircle className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando petición...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold mb-2">Petición no encontrada</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            La petición que buscas no existe o no tienes acceso a ella
          </p>
          <Link
            href="/peticiones"
            className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Peticiones
          </Link>
        </Card>
      </div>
    )
  }

  const statusInfo = statusConfig[request.status] || statusConfig.PENDING
  const StatusIcon = statusInfo.icon

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/peticiones"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-occident mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Peticiones
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{request.title}</h1>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusInfo.label}
            </div>
            {request.aiResolved && (
              <Badge className="bg-green-100 text-green-800">
                <Bot className="w-3 h-3 mr-1" />
                IA Resuelta
              </Badge>
            )}
            {request.ticket && (
              <Badge className="bg-purple-100 text-purple-800">
                {request.ticket.ticketNumber}
              </Badge>
            )}
          </div>
        </div>

        {request.status === 'PENDING' && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Cancelar Petición
          </button>
        )}
      </div>

      {/* Request Info */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
            <p className="font-medium">{request.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Categoría</p>
            <p className="font-medium">{request.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Prioridad</p>
            <Badge className={
              request.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
              request.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
              request.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }>
              {request.priority}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Fecha</p>
            <p className="font-medium">{new Date(request.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Descripción</p>
          <p className="text-gray-900 dark:text-gray-100">{request.description}</p>
        </div>

        {request.policy && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Póliza relacionada: {request.policy.policyNumber}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{request.policy.type}</p>
          </div>
        )}
      </Card>

      {/* AI Resolution */}
      {request.aiResolved && request.aiResponse && (
        <Card className="p-6 mb-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-1">
                Respuesta Automática de IA
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Tu petición ha sido procesada y resuelta automáticamente
              </p>
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg">
            <p className="text-gray-900 dark:text-gray-100">{request.aiResponse}</p>
          </div>
        </Card>
      )}

      {/* Ticket Chat */}
      {request.ticket && (
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Conversación con Mediador</h3>
              {request.ticket.assignedTo && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Asignado a: <span className="font-medium">{request.ticket.assignedTo.name}</span>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              {request.ticket.messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aún no hay mensajes en esta conversación</p>
                  <p className="text-sm mt-1">Un mediador se pondrá en contacto contigo pronto</p>
                </div>
              ) : (
                request.ticket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.senderType === 'USER' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.senderType === 'USER'
                        ? 'bg-occident/10'
                        : msg.senderType === 'SYSTEM'
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {msg.senderType === 'USER' ? (
                        <User className="w-4 h-4 text-occident" />
                      ) : msg.senderType === 'SYSTEM' ? (
                        <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                    </div>

                    <div className={`flex-1 ${msg.senderType === 'USER' ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.senderType !== 'USER' && (
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {msg.senderName}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <div className={`inline-block p-3 rounded-lg ${
                        msg.senderType === 'USER'
                          ? 'bg-occident text-white'
                          : msg.senderType === 'SYSTEM'
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            {request.ticket.status !== 'RESOLVED' && request.ticket.status !== 'CLOSED' && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  disabled={sending}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-2 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* AI Classification Info */}
      {request.aiClassification && (
        <Card className="p-6 mt-6 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Información de Clasificación IA
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Intent</p>
              <p className="font-medium">{request.aiClassification.intent}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Confianza</p>
              <p className="font-medium">
                {(request.aiClassification.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Auto-resolvible</p>
              <p className="font-medium">
                {request.aiClassification.canAutoResolve ? 'Sí' : 'No'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Acción sugerida</p>
              <p className="font-medium text-xs">{request.aiClassification.suggestedAction}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
