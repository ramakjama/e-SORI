'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  TrendingDown,
  Check,
  X,
  Mail,
  ArrowRight,
  Loader2,
  Star,
  Award,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface InsuranceCompany {
  id: string
  name: string
  logo: string // URL or emoji
  rating: number
  monthlyPremium: number
  annualPremium: number
  coverages: {
    name: string
    included: boolean
    value?: string
  }[]
  pros: string[]
  cons: string[]
  recommended?: boolean
}

interface ComparadorProps {
  insuranceType?: 'auto' | 'hogar' | 'vida' | 'salud'
}

export function ComparadorPolizas({ insuranceType = 'auto' }: ComparadorProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - In production, fetch from API
  const companies: InsuranceCompany[] = [
    {
      id: 'mapfre',
      name: 'Mapfre',
      logo: '🛡️',
      rating: 4.2,
      monthlyPremium: 45,
      annualPremium: 540,
      coverages: [
        { name: 'Responsabilidad Civil', included: true, value: '50M€' },
        { name: 'Robo', included: true },
        { name: 'Incendio', included: true },
        { name: 'Lunas', included: true },
        { name: 'Asistencia en viaje', included: true },
        { name: 'Vehículo de sustitución', included: false },
        { name: 'Conductor novel', included: false },
      ],
      pros: ['Gran red de talleres', 'App móvil excelente', 'Atención 24/7'],
      cons: ['Precio algo elevado', 'Franquicias altas'],
    },
    {
      id: 'mutua',
      name: 'Mutua Madrileña',
      logo: '🏛️',
      rating: 4.5,
      monthlyPremium: 38,
      annualPremium: 456,
      coverages: [
        { name: 'Responsabilidad Civil', included: true, value: '50M€' },
        { name: 'Robo', included: true },
        { name: 'Incendio', included: true },
        { name: 'Lunas', included: true },
        { name: 'Asistencia en viaje', included: true },
        { name: 'Vehículo de sustitución', included: true },
        { name: 'Conductor novel', included: true },
      ],
      pros: ['Mejor relación calidad-precio', 'Sin franquicia en lunas', 'Descuento por antigüedad'],
      cons: ['Proceso de siniestros lento', 'Red de talleres limitada'],
      recommended: true,
    },
    {
      id: 'linea',
      name: 'Línea Directa',
      logo: '📞',
      rating: 3.9,
      monthlyPremium: 32,
      annualPremium: 384,
      coverages: [
        { name: 'Responsabilidad Civil', included: true, value: '30M€' },
        { name: 'Robo', included: true },
        { name: 'Incendio', included: true },
        { name: 'Lunas', included: false },
        { name: 'Asistencia en viaje', included: true },
        { name: 'Vehículo de sustitución', included: false },
        { name: 'Conductor novel', included: false },
      ],
      pros: ['Precio más bajo', 'Contratación rápida', 'Sin permanencia'],
      cons: ['Menos coberturas', 'Atención al cliente mejorable', 'No incluye lunas'],
    },
  ]

  const handleCompanySelect = (companyId: string) => {
    if (selectedCompanies.includes(companyId)) {
      setSelectedCompanies(selectedCompanies.filter(id => id !== companyId))
    } else if (selectedCompanies.length < 3) {
      setSelectedCompanies([...selectedCompanies, companyId])

      // After selecting 2 companies, show email gate after a delay
      if (selectedCompanies.length === 1) {
        setTimeout(() => {
          setShowEmailGate(true)
        }, 2000)
      }
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Por favor introduce un email válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'insurance_comparator',
          metadata: {
            insuranceType,
            companiesCompared: selectedCompanies,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast.success('¡Comparación completa enviada a tu email!', {
        duration: 5000,
        icon: '📧',
      })

      setShowEmailGate(false)
    } catch (error) {
      toast.error('Error al enviar. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCompaniesData = companies.filter(c => selectedCompanies.includes(c.id))

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Comparador de Pólizas
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compara hasta 3 aseguradoras y encuentra la mejor oferta
        </p>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {companies.map((company) => {
          const isSelected = selectedCompanies.includes(company.id)
          const canSelect = selectedCompanies.length < 3 || isSelected

          return (
            <motion.div
              key={company.id}
              whileHover={canSelect ? { y: -4 } : {}}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                  : canSelect
                  ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  : 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => canSelect && handleCompanySelect(company.id)}
            >
              {/* Recommended Badge */}
              {company.recommended && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full">
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">Recomendada</span>
                  </div>
                </div>
              )}

              {/* Checkbox */}
              <div className="absolute top-4 left-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              {/* Logo & Name */}
              <div className="text-center mb-4 mt-2">
                <div className="text-4xl mb-2">{company.logo}</div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                  {company.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(company.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {company.rating}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl mb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {company.monthlyPremium}€
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/mes</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {company.annualPremium}€/año
                </p>
              </div>

              {/* Quick pros */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Ventajas principales
                </p>
                {company.pros.slice(0, 2).map((pro, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{pro}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Comparison Table */}
      <AnimatePresence>
        {selectedCompanies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
              <h3 className="text-xl font-bold text-white">
                Comparación Detallada ({selectedCompanies.length} aseguradoras)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                      Cobertura
                    </th>
                    {selectedCompaniesData.map((company) => (
                      <th key={company.id} className="px-6 py-4 text-center">
                        <div className="text-2xl mb-1">{company.logo}</div>
                        <div className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                          {company.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium" style={{ color: 'var(--color-text)' }}>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-blue-500" />
                        Precio mensual
                      </div>
                    </td>
                    {selectedCompaniesData.map((company) => (
                      <td key={company.id} className="px-6 py-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {company.monthlyPremium}€
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Coverage Rows */}
                  {companies[0].coverages.map((coverage, index) => (
                    <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text)' }}>
                        {coverage.name}
                      </td>
                      {selectedCompaniesData.map((company) => {
                        const companyCoverage = company.coverages[index]
                        return (
                          <td key={company.id} className="px-6 py-4 text-center">
                            {companyCoverage.included ? (
                              <div className="flex flex-col items-center gap-1">
                                <Check className="w-5 h-5 text-emerald-500" />
                                {companyCoverage.value && (
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {companyCoverage.value}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 dark:bg-gray-800">
              {selectedCompaniesData.map((company) => (
                <div key={company.id}>
                  <h4 className="font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                    {company.name}
                  </h4>

                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                      Ventajas
                    </p>
                    {company.pros.map((pro, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{pro}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
                      Desventajas
                    </p>
                    {company.cons.map((con, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Gate Modal */}
      <AnimatePresence>
        {showEmailGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailGate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Recibe la Comparación Completa
                </h3>
                <p className="text-white/90">
                  Te enviaremos un análisis detallado con las mejores ofertas
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                    Tu Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-white dark:bg-gray-800"
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>
                      Recibirás tu comparación + consejos exclusivos de ahorro + ofertas especiales
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Comparación Completa
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
