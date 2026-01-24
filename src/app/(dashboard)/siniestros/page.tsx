'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, Plus, Clock, CheckCircle, XCircle, FileText,
  Calendar, User, Phone, MapPin, ChevronDown, ChevronUp,
  MessageCircle, Upload, Package, Truck, ClipboardCheck
} from 'lucide-react'
import { useStore, Claim } from '@/store/useStore'
import { formatDateShort, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30', icon: Clock },
  in_progress: { label: 'En proceso', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Truck },
  resolved: { label: 'Resuelto', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  rejected: { label: 'Rechazado', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
}

const timelineIcons: Record<string, typeof Package> = {
  received: Package,
  assigned: User,
  documentation: FileText,
  assessment: ClipboardCheck,
  resolved: CheckCircle,
}

function ClaimCard({ claim, index }: { claim: Claim; index: number }) {
  const [expanded, setExpanded] = useState(claim.status === 'in_progress')
  const status = statusConfig[claim.status]
  const StatusIcon = status.icon

  const completedSteps = claim.timeline.filter((e) => e.completed).length
  const totalSteps = claim.timeline.length
  const progressPercent = (completedSteps / totalSteps) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'card overflow-hidden',
        claim.status === 'in_progress' && 'border-l-4 border-l-occident'
      )}
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer hover:bg-occident/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', status.bgColor)}>
            <AlertTriangle className={cn('w-6 h-6', status.color)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {claim.type}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {claim.policyNumber}
                </p>
              </div>
              <span className={cn('inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium', status.bgColor, status.color)}>
                <StatusIcon className="w-3.5 h-3.5" />
                {status.label}
              </span>
            </div>

            {/* Progress Bar */}
            {claim.status === 'in_progress' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Paso {completedSteps} de {totalSteps}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-occident to-occident-600 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Summary Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateShort(claim.date)}
              </span>
              {claim.assignedAgent && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {claim.assignedAgent}
                </span>
              )}
              {claim.documents.length > 0 && (
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {claim.documents.length} docs
                </span>
              )}
            </div>
          </div>

          <button type="button" className="p-2 rounded-lg hover:bg-occident/10 transition-colors">
            {expanded ? (
              <ChevronUp className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Timeline */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {/* Description */}
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-card)' }}>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                  Descripción del siniestro
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {claim.description}
                </p>
              </div>

              {/* Timeline */}
              <div className="mb-6">
                <h4 className="font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <Truck className="w-4 h-4 text-occident" />
                  Seguimiento en tiempo real
                </h4>

                <div className="relative">
                  {claim.timeline.map((event, idx) => {
                    const TimelineIcon = timelineIcons[event.status] || Package
                    const isLast = idx === claim.timeline.length - 1

                    return (
                      <div key={event.id} className="flex gap-4 pb-6 last:pb-0">
                        {/* Line and dot */}
                        <div className="relative flex flex-col items-center">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all',
                              event.completed
                                ? 'bg-green-500 text-white'
                                : 'border-2'
                            )}
                            style={{
                              backgroundColor: event.completed ? undefined : 'var(--color-background)',
                              borderColor: event.completed ? undefined : 'var(--color-border)'
                            }}
                          >
                            {event.completed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <TimelineIcon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                            )}
                          </div>
                          {!isLast && (
                            <div
                              className={cn(
                                'absolute top-10 w-0.5 h-full',
                                event.completed ? 'bg-green-500' : ''
                              )}
                              style={{ backgroundColor: event.completed ? undefined : 'var(--color-border)' }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <p className={cn(
                            'font-medium',
                            event.completed ? '' : 'opacity-60'
                          )} style={{ color: 'var(--color-text)' }}>
                            {event.title}
                          </p>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                            {event.description}
                          </p>
                          {event.date && (
                            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                              {event.date}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Estimated resolution */}
              {claim.estimatedResolution && claim.status === 'in_progress' && (
                <div className="p-4 rounded-xl bg-occident/5 border border-occident/20 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-occident" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        Resolución estimada
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDateShort(claim.estimatedResolution)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Adjuntar documento
                </button>
                <button type="button" className="btn-secondary">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar mensaje
                </button>
                {claim.assignedAgent && (
                  <button type="button" className="btn-secondary">
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar agente
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SiniestrosPage() {
  const { claims, policies, addClaim } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    policyId: '',
    type: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const policy = policies.find((p) => p.id === formData.policyId)
    if (!policy) return

    addClaim({
      policyId: formData.policyId,
      policyNumber: policy.number,
      type: formData.type,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      description: formData.description,
      documents: [],
    })

    toast.success('Siniestro comunicado correctamente. Te contactaremos pronto.')
    setShowForm(false)
    setFormData({ policyId: '', type: '', description: '' })
  }

  // Sort claims: in_progress first, then pending, then resolved/rejected
  const sortedClaims = [...claims].sort((a, b) => {
    const order = { in_progress: 0, pending: 1, resolved: 2, rejected: 3 }
    return order[a.status] - order[b.status]
  })

  const activeClaims = claims.filter((c) => c.status === 'in_progress' || c.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Siniestros
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            {activeClaims > 0
              ? `${activeClaims} siniestro${activeClaims > 1 ? 's' : ''} activo${activeClaims > 1 ? 's' : ''}`
              : 'Sin siniestros activos'}
          </p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Comunicar siniestro
        </button>
      </div>

      {/* New Claim Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              Comunicar nuevo siniestro
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Póliza afectada
                </label>
                <select
                  value={formData.policyId}
                  onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                  className="input"
                  required
                  aria-label="Selecciona la póliza afectada"
                >
                  <option value="">Selecciona una póliza</option>
                  {policies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Tipo de siniestro
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                  placeholder="Ej: Daños por agua, Robo, Accidente..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                  Descripción detallada
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[120px]"
                  placeholder="Describe lo ocurrido con el mayor detalle posible: cuándo, cómo, qué daños hay..."
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Siguiente paso:</strong> Una vez enviado, recibirás confirmación por email
                  y te asignaremos un agente que se pondrá en contacto contigo.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Comunicar siniestro
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claims List */}
      {claims.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Sin siniestros
          </h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            No tienes ningún siniestro registrado. ¡Esperamos que siga así!
          </p>
          <button type="button" onClick={() => setShowForm(true)} className="btn-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Comunicar siniestro
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {sortedClaims.map((claim, index) => (
            <ClaimCard key={claim.id} claim={claim} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
