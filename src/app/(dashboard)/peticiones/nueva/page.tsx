'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, AlertCircle, CheckCircle, Clock, ChevronRight, X, Zap, Search } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface AISuggestion {
  id: string
  title: string
  description: string
  category: string
  priority: string
}

// Mock AI suggestions based on user input
const generateAISuggestions = (title: string, description: string): AISuggestion[] => {
  if (!title && !description) return []

  const suggestions: Record<string, AISuggestion[]> = {
    documentos: [
      {
        id: '1',
        title: 'Solicitar certificado de póliza',
        description: 'Obtén un documento oficial que certifique tu cobertura vigente',
        category: 'DOCUMENTOS',
        priority: 'LOW',
      },
      {
        id: '2',
        title: 'Actualizar datos personales',
        description: 'Modifica tu información en el sistema para mantenerla al día',
        category: 'GESTIÓN_PÓLIZA',
        priority: 'LOW',
      },
    ],
    siniestro: [
      {
        id: '3',
        title: 'Comunicar un siniestro',
        description: 'Registra y comunica un incidente para activar tu cobertura',
        category: 'SINIESTRO',
        priority: 'URGENT',
      },
      {
        id: '4',
        title: 'Consultar estado de tu siniestro',
        description: 'Revisa el progreso del procesamiento de tu reclamo',
        category: 'SINIESTRO',
        priority: 'HIGH',
      },
    ],
    poliza: [
      {
        id: '5',
        title: 'Ampliar cobertura',
        description: 'Agrega coberturas adicionales a tu póliza existente',
        category: 'GESTIÓN_PÓLIZA',
        priority: 'MEDIUM',
      },
      {
        id: '6',
        title: 'Consultar detalles de cobertura',
        description: 'Revisa qué está incluido en tu póliza',
        category: 'CONSULTA',
        priority: 'LOW',
      },
    ],
    pago: [
      {
        id: '7',
        title: 'Actualizar método de pago',
        description: 'Cambia o actualiza tu información de pago',
        category: 'PAGOS',
        priority: 'MEDIUM',
      },
      {
        id: '8',
        title: 'Solicitar prórroga de pago',
        description: 'Pide más tiempo para realizar tu pago',
        category: 'PAGOS',
        priority: 'HIGH',
      },
    ],
  }

  const input = (title + ' ' + description).toLowerCase()
  let matchedSuggestions: AISuggestion[] = []

  if (input.includes('documento') || input.includes('certificado')) {
    matchedSuggestions = suggestions.documentos
  } else if (input.includes('siniestro') || input.includes('accidente') || input.includes('daño')) {
    matchedSuggestions = suggestions.siniestro
  } else if (input.includes('póliza') || input.includes('cobertura') || input.includes('ampliar')) {
    matchedSuggestions = suggestions.poliza
  } else if (input.includes('pago') || input.includes('factura') || input.includes('prórroga')) {
    matchedSuggestions = suggestions.pago
  }

  return matchedSuggestions
}

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Baja', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  MEDIUM: { label: 'Media', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  HIGH: { label: 'Alta', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  URGENT: { label: 'Urgente', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  DOCUMENTOS: { label: 'Documentos', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  SINIESTRO: { label: 'Siniestro', color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  GESTIÓN_PÓLIZA: { label: 'Gestión de Póliza', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
  PAGOS: { label: 'Pagos', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  CONSULTA: { label: 'Consulta', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
}

export default function NuevaPeticionPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState('MEDIUM')
  const [relatedPolicy, setRelatedPolicy] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null)

  // Generate AI suggestions as user types
  const aiSuggestions = useMemo(() => generateAISuggestions(title, description), [title, description])

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((suggestion: AISuggestion) => {
    setTitle(suggestion.title)
    setDescription(suggestion.description)
    setSelectedCategory(suggestion.category)
    setSelectedPriority(suggestion.priority)
    setSelectedSuggestion(suggestion)
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setErrorMessage('Por favor ingresa un título para tu petición')
      return
    }
    if (!description.trim()) {
      setErrorMessage('Por favor ingresa una descripción')
      return
    }
    if (!selectedCategory) {
      setErrorMessage('Por favor selecciona una categoría')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory,
          priority: selectedPriority,
          policyId: relatedPolicy || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear la petición')
      }

      const data = await response.json()

      // Check if AI auto-resolved
      if (data.aiResolved && data.aiResponse) {
        setSuccessMessage(`¡Petición resuelta por IA! ${data.aiResponse}`)
        setTimeout(() => {
          router.push(`/peticiones/${data.id}`)
        }, 2000)
      } else if (data.ticketNumber) {
        setSuccessMessage(`¡Ticket creado exitosamente! Número: ${data.ticketNumber}`)
        setTimeout(() => {
          router.push(`/peticiones/${data.id}`)
        }, 2000)
      } else {
        setSuccessMessage('¡Petición creada exitosamente!')
        setTimeout(() => {
          router.push('/peticiones')
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      setErrorMessage('Error al crear la petición. Por favor intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <Link href="/peticiones" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            Peticiones
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-semibold">Nueva Petición</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Crear Nueva Petición
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Describe tu solicitud y recibirás ayuda del equipo de Soriano
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit}>
            <Card variant="elevated" className="p-8">
              {/* Error Message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{successMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title Input */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Título de la Petición *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Solicitar cambio de cobertura"
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {title.length}/100 caracteres
                </p>
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Descripción Detallada *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Proporciona todos los detalles que necesitamos saber para ayudarte..."
                  maxLength={500}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {description.length}/500 caracteres
                </p>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Categoría *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategory(key)}
                      className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        selectedCategory === key
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className={`text-sm font-semibold ${config.color}`}>
                        {config.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Prioridad
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPriority(key)}
                      className={`p-3 rounded-lg border-2 transition-all text-left font-medium ${
                        selectedPriority === key
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${config.color}`}>
                        {config.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Related Policy (Optional) */}
              <div className="mb-8">
                <label htmlFor="policy" className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Póliza Relacionada (Opcional)
                </label>
                <select
                  id="policy"
                  value={relatedPolicy || ''}
                  onChange={(e) => setRelatedPolicy(e.target.value || null)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccionar póliza (opcional)</option>
                  <option value="AUTO-001">Auto - VW Golf 2022</option>
                  <option value="HOME-001">Hogar - Apartamento Centro</option>
                  <option value="HEALTH-001">Salud - Cobertura Completa</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !title.trim() || !description.trim() || !selectedCategory}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Creando petición...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Petición
                  </>
                )}
              </button>
            </Card>
          </form>
        </motion.div>

        {/* Sidebar with AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* AI Suggestions Section */}
          <Card variant="glass" className="p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Sugerencias IA</h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Mientras escribes, recibimos sugerencias basadas en tu descripción
            </p>

            <AnimatePresence mode="wait">
              {aiSuggestions.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left group ${
                        selectedSuggestion?.id === suggestion.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
                            {suggestion.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {suggestion.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" size="xs">
                          {categoryConfig[suggestion.category]?.label}
                        </Badge>
                        <Badge variant="warning" size="xs">
                          {priorityConfig[suggestion.priority]?.label}
                        </Badge>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 text-center text-slate-500 dark:text-slate-400"
                >
                  <Zap className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Comienza a escribir para recibir sugerencias</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Help Card */}
          <Card variant="elevated" className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                  Consejos para tu petición
                </h4>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                  <li>✓ Sé específico y claro en tu descripción</li>
                  <li>✓ Incluye todos los detalles relevantes</li>
                  <li>✓ Indica la póliza relacionada si aplica</li>
                  <li>✓ La IA puede resolver peticiones comunes al instante</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card variant="outlined" className="p-6">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
              Enlaces rápidos
            </h4>
            <div className="space-y-2">
              <Link
                href="/peticiones"
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Ver mis peticiones
              </Link>
              <Link
                href="/polizas"
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Mis pólizas
              </Link>
              <Link
                href="/documentos"
                className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Documentos
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
