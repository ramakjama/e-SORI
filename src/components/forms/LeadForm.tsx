'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Check, Loader2, Phone, Mail, User, MessageSquare, AlertCircle } from 'lucide-react'
import Confetti from 'react-confetti'

type InsuranceType =
  | 'AUTO' | 'HOGAR' | 'SALUD' | 'VIDA' | 'DECESOS' | 'MASCOTAS'
  | 'COMERCIO' | 'COMUNIDADES' | 'VIAJE' | 'MOTO' | 'ACCIDENTES'
  | 'RC_PROFESIONAL' | 'GENERAL'

interface LeadFormProps {
  source: string
  campaign?: string
  title?: string
  subtitle?: string
  buttonText?: string
  showPhone?: boolean
  showMessage?: boolean
  insuranceType?: InsuranceType
  onSuccess?: (leadId: string) => void
  onError?: (error: string) => void
  compact?: boolean
  variant?: 'card' | 'inline' | 'minimal'
  accentColor?: string
  gamificationPoints?: number
}

// Helper to get UTM params from URL
function getUtmParams() {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    referralCode: params.get('ref') || params.get('referral') || undefined,
  }
}

export function LeadForm({
  source,
  campaign,
  title = 'Te llamamos gratis',
  subtitle = 'Déjanos tus datos y un asesor te contactará en menos de 24h',
  buttonText = 'Solicitar llamada',
  showPhone = true,
  showMessage = false,
  insuranceType = 'GENERAL',
  onSuccess,
  onError,
  compact = false,
  variant = 'card',
  accentColor,
  gamificationPoints = 100,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    acceptPrivacy: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [leadId, setLeadId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      // Get UTM params and current page
      const utmParams = getUtmParams()
      const landingPage = typeof window !== 'undefined' ? window.location.href : ''

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: showMessage ? formData.message : undefined,
          insuranceType,
          source,
          campaign,
          landingPage,
          pointsAwarded: gamificationPoints,
          ...utmParams,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el formulario')
      }

      setStatus('success')
      setLeadId(data.leadId)
      setShowConfetti(true)
      onSuccess?.(data.leadId)

      setTimeout(() => setShowConfetti(false), 5000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido'
      setStatus('error')
      setErrorMessage(message)
      onError?.(message)
    }
  }

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card p-8 text-center relative overflow-hidden ${compact ? 'py-6' : ''}`}
      >
        {showConfetti && (
          <Confetti
            width={400}
            height={300}
            recycle={false}
            numberOfPieces={100}
            style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
          />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-green to-emerald-600 rounded-full flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          ¡Solicitud recibida!
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Un asesor se pondrá en contacto contigo muy pronto.
        </p>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: accentColor ? `${accentColor}20` : 'rgba(227, 6, 19, 0.1)',
            color: accentColor || '#E30613'
          }}
        >
          +{gamificationPoints} puntos Soriano Club
        </div>

        {leadId && (
          <p className="mt-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Ref: {leadId.substring(0, 12)}...
          </p>
        )}
      </motion.div>
    )
  }

  // Form styles based on variant
  const containerClass = variant === 'minimal'
    ? ''
    : variant === 'inline'
    ? 'p-4 rounded-xl'
    : `card ${compact ? 'p-4' : 'p-6 sm:p-8'}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={containerClass}
      style={variant === 'inline' ? { backgroundColor: 'var(--color-bg-secondary)' } : undefined}
    >
      {!compact && variant !== 'minimal' && (
        <>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            {title}
          </h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            {subtitle}
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <User
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            type="text"
            placeholder="Tu nombre"
            required
            minLength={2}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input pl-12"
            disabled={status === 'loading'}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: 'var(--color-text-secondary)' }}
          />
          <input
            type="email"
            placeholder="tu@email.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input pl-12"
            disabled={status === 'loading'}
          />
        </div>

        {/* Phone */}
        {showPhone && (
          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: 'var(--color-text-secondary)' }}
            />
            <input
              type="tel"
              placeholder="600 000 000"
              required
              minLength={9}
              pattern="[0-9+\s-]+"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input pl-12"
              disabled={status === 'loading'}
            />
          </div>
        )}

        {/* Message (optional) */}
        {showMessage && (
          <div className="relative">
            <MessageSquare
              className="absolute left-4 top-4 w-5 h-5"
              style={{ color: 'var(--color-text-secondary)' }}
            />
            <textarea
              placeholder="¿En qué podemos ayudarte?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="input pl-12 min-h-[100px] resize-none"
              disabled={status === 'loading'}
            />
          </div>
        )}

        {/* Privacy */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.acceptPrivacy}
            onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-occident focus:ring-occident"
            disabled={status === 'loading'}
          />
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Acepto la{' '}
            <a href="/legal/privacidad" className="text-occident hover:underline">
              política de privacidad
            </a>{' '}
            y el tratamiento de mis datos para recibir información comercial.
          </span>
        </label>

        {/* Error message */}
        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.'}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          style={accentColor ? { backgroundColor: accentColor } : undefined}
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {buttonText}
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Trust indicators */}
      {variant !== 'minimal' && (
        <div
          className="mt-6 pt-6 border-t flex items-center justify-center gap-4 flex-wrap"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            🔒 Datos 100% seguros
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            📞 Sin compromiso
          </span>
          {gamificationPoints > 0 && (
            <span
              className="text-xs font-medium"
              style={{ color: accentColor || '#E30613' }}
            >
              🎁 +{gamificationPoints} pts
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
