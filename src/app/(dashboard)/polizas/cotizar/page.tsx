'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  Car,
  Home,
  Heart,
  Stethoscope,
  Building,
  User,
  Calendar,
  Euro,
  FileText,
  CheckCircle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

type PolicyType = 'AUTO' | 'HOGAR' | 'VIDA' | 'SALUD' | 'EMPRESARIAL'

interface QuoteData {
  type: PolicyType | null
  personalInfo: {
    name: string
    email: string
    phone: string
    birthDate: string
  }
  insuranceDetails: any
  additionalInfo: string
}

export default function QuotePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [quoteData, setQuoteData] = useState<QuoteData>({
    type: null,
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      birthDate: ''
    },
    insuranceDetails: {},
    additionalInfo: ''
  })
  const [loading, setLoading] = useState(false)

  const policyTypes = [
    {
      type: 'AUTO' as PolicyType,
      label: 'Seguro de Auto',
      icon: Car,
      description: 'Protege tu vehículo ante cualquier imprevisto',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'HOGAR' as PolicyType,
      label: 'Seguro de Hogar',
      icon: Home,
      description: 'Protección integral para tu casa y contenido',
      color: 'bg-green-100 text-green-600'
    },
    {
      type: 'VIDA' as PolicyType,
      label: 'Seguro de Vida',
      icon: Heart,
      description: 'Protege el futuro de tu familia',
      color: 'bg-red-100 text-red-600'
    },
    {
      type: 'SALUD' as PolicyType,
      label: 'Seguro de Salud',
      icon: Stethoscope,
      description: 'Atención médica de calidad cuando la necesites',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      type: 'EMPRESARIAL' as PolicyType,
      label: 'Seguro Empresarial',
      icon: Building,
      description: 'Protección completa para tu negocio',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const steps = [
    { number: 1, label: 'Tipo de seguro' },
    { number: 2, label: 'Información personal' },
    { number: 3, label: 'Detalles del seguro' },
    { number: 4, label: 'Revisión y envío' }
  ]

  const handleTypeSelect = (type: PolicyType) => {
    setQuoteData({ ...quoteData, type })
    setCurrentStep(2)
  }

  const handlePersonalInfoChange = (field: string, value: string) => {
    setQuoteData({
      ...quoteData,
      personalInfo: { ...quoteData.personalInfo, [field]: value }
    })
  }

  const handleInsuranceDetailsChange = (field: string, value: any) => {
    setQuoteData({
      ...quoteData,
      insuranceDetails: { ...quoteData.insuranceDetails, [field]: value }
    })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      })

      if (!response.ok) throw new Error('Error al enviar cotización')

      const data = await response.json()
      router.push(`/polizas?quote=${data.quoteId}`)
    } catch (error) {
      console.error('Error submitting quote:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedType = policyTypes.find(pt => pt.type === quoteData.type)

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/polizas"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-occident mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Pólizas
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-occident/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-occident" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Cotizar Nuevo Seguro</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Completa el formulario y te enviaremos una cotización personalizada
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 relative">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : currentStep === step.number
                    ? 'bg-occident text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className={`flex-1 h-1 mx-2 transition-colors ${
                  index < steps.length - 1
                    ? currentStep > step.number
                      ? 'bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                    : 'hidden'
                }`} />
              </div>
              <p className={`text-xs mt-2 ${
                currentStep >= step.number
                  ? 'text-gray-900 dark:text-gray-100 font-medium'
                  : 'text-gray-500'
              }`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8">
        {/* Step 1: Type Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">¿Qué tipo de seguro necesitas?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policyTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => handleTypeSelect(type.type)}
                    className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-occident hover:bg-occident/5 transition-all text-left"
                  >
                    <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{type.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
            {selectedType && (
              <div className="mb-6 p-4 bg-occident/10 rounded-lg flex items-center gap-3">
                {(() => {
                  const Icon = selectedType.icon
                  return <Icon className="w-5 h-5 text-occident" />
                })()}
                <div>
                  <p className="font-medium text-occident">{selectedType.label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedType.description}</p>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={quoteData.personalInfo.name}
                  onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  placeholder="Juan Pérez García"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={quoteData.personalInfo.email}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={quoteData.personalInfo.phone}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={quoteData.personalInfo.birthDate}
                  onChange={(e) => handlePersonalInfoChange('birthDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Insurance Details */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Detalles del Seguro</h2>
            {selectedType && (
              <div className="mb-6 p-4 bg-occident/10 rounded-lg flex items-center gap-3">
                {(() => {
                  const Icon = selectedType.icon
                  return <Icon className="w-5 h-5 text-occident" />
                })()}
                <span className="font-medium text-occident">{selectedType.label}</span>
              </div>
            )}

            {quoteData.type === 'AUTO' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Marca del vehículo</label>
                  <input
                    type="text"
                    value={quoteData.insuranceDetails.brand || ''}
                    onChange={(e) => handleInsuranceDetailsChange('brand', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="Ej: Toyota"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Modelo</label>
                  <input
                    type="text"
                    value={quoteData.insuranceDetails.model || ''}
                    onChange={(e) => handleInsuranceDetailsChange('model', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="Ej: Corolla"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Año</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.year || ''}
                    onChange={(e) => handleInsuranceDetailsChange('year', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valor estimado</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.value || ''}
                    onChange={(e) => handleInsuranceDetailsChange('value', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="25000"
                  />
                </div>
              </div>
            )}

            {quoteData.type === 'HOGAR' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dirección completa</label>
                  <input
                    type="text"
                    value={quoteData.insuranceDetails.address || ''}
                    onChange={(e) => handleInsuranceDetailsChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="Calle Principal 123, Madrid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de propiedad</label>
                  <select
                    value={quoteData.insuranceDetails.propertyType || ''}
                    onChange={(e) => handleInsuranceDetailsChange('propertyType', e.target.value)}
                    aria-label="Tipo de propiedad"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="house">Casa</option>
                    <option value="apartment">Apartamento</option>
                    <option value="duplex">Dúplex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Metros cuadrados</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.sqMeters || ''}
                    onChange={(e) => handleInsuranceDetailsChange('sqMeters', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valor estimado</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.value || ''}
                    onChange={(e) => handleInsuranceDetailsChange('value', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="200000"
                  />
                </div>
              </div>
            )}

            {quoteData.type === 'VIDA' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Suma asegurada deseada</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.coverageAmount || ''}
                    onChange={(e) => handleInsuranceDetailsChange('coverageAmount', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="100000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">¿Fumas?</label>
                  <select
                    value={quoteData.insuranceDetails.smoker || ''}
                    onChange={(e) => handleInsuranceDetailsChange('smoker', e.target.value)}
                    aria-label="¿Fumas?"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Profesión</label>
                  <input
                    type="text"
                    value={quoteData.insuranceDetails.occupation || ''}
                    onChange={(e) => handleInsuranceDetailsChange('occupation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="Ingeniero"
                  />
                </div>
              </div>
            )}

            {quoteData.type === 'SALUD' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de cobertura</label>
                  <select
                    value={quoteData.insuranceDetails.coverageType || ''}
                    onChange={(e) => handleInsuranceDetailsChange('coverageType', e.target.value)}
                    aria-label="Tipo de cobertura"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="basic">Básica</option>
                    <option value="complete">Completa</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Número de asegurados</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.numInsured || ''}
                    onChange={(e) => handleInsuranceDetailsChange('numInsured', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="1"
                    min="1"
                  />
                </div>
              </div>
            )}

            {quoteData.type === 'EMPRESARIAL' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre de la empresa</label>
                  <input
                    type="text"
                    value={quoteData.insuranceDetails.companyName || ''}
                    onChange={(e) => handleInsuranceDetailsChange('companyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="Mi Empresa S.L."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <input
                    type="text"
                    value={quoteData.insuranceDetails.sector || ''}
                    onChange={(e) => handleInsuranceDetailsChange('sector', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="Tecnología"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Número de empleados</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.employees || ''}
                    onChange={(e) => handleInsuranceDetailsChange('employees', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Facturación anual</label>
                  <input
                    type="number"
                    value={quoteData.insuranceDetails.revenue || ''}
                    onChange={(e) => handleInsuranceDetailsChange('revenue', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                    placeholder="500000"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Revisión y Envío</h2>
            <div className="space-y-6">
              {/* Type */}
              {selectedType && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Tipo de Seguro</h3>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = selectedType.icon
                      return <Icon className="w-5 h-5 text-occident" />
                    })()}
                    <span>{selectedType.label}</span>
                  </div>
                </div>
              )}

              {/* Personal Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-3">Información Personal</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                    <p className="font-medium">{quoteData.personalInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <p className="font-medium">{quoteData.personalInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Teléfono:</span>
                    <p className="font-medium">{quoteData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Fecha de nacimiento:</span>
                    <p className="font-medium">{quoteData.personalInfo.birthDate}</p>
                  </div>
                </div>
              </div>

              {/* Insurance Details */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-3">Detalles del Seguro</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(quoteData.insuranceDetails).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key}:</span>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-medium mb-2">Información adicional (opcional)</label>
                <textarea
                  value={quoteData.additionalInfo}
                  onChange={(e) => setQuoteData({ ...quoteData, additionalInfo: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
                  placeholder="Cualquier información adicional que quieras compartir..."
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                      ¿Qué sucede después?
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Un mediador de seguros revisará tu solicitud y se pondrá en contacto contigo en menos de 24 horas con una cotización personalizada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-medium"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Enviar Solicitud
                </>
              )}
            </button>
          )}
        </div>
      </Card>
    </div>
  )
}
