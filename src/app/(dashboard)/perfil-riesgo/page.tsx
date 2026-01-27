'use client'

/**
 * PERFIL DE RIESGO - Formulario de Segmentación del Usuario
 *
 * Página completa para capturar/actualizar el perfil del usuario
 * y mostrar análisis de cobertura personalizado en tiempo real
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  User, Briefcase, Home, CreditCard, Plane, Heart,
  ChevronRight, ChevronLeft, Save, Sparkles, AlertTriangle,
  Shield, CheckCircle2
} from 'lucide-react'
import type { UserSegmentData, CoverageAnalysisResult } from '@/lib/coverage-engine'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'demographic', label: 'Datos Personales', icon: User },
  { id: 'employment', label: 'Situación Laboral', icon: Briefcase },
  { id: 'patrimony', label: 'Patrimonio', icon: Home },
  { id: 'financial', label: 'Situación Financiera', icon: CreditCard },
  { id: 'lifestyle', label: 'Estilo de Vida', icon: Plane },
  { id: 'health', label: 'Salud', icon: Heart },
]

export default function PerfilRiesgoPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<Partial<UserSegmentData>>({
    hasChildren: false,
    numberOfChildren: 0,
    hasDependents: false,
    hasSecondIncome: false,
    hasMortgage: false,
    hasVehicle: false,
    vehicleOwnership: 'NINGUNO',
    hasSavings: false,
    hasDebts: false,
    travelFrequency: 0,
    practicesSports: false,
    hasPets: false,
    numberOfPets: 0,
    hasHealthConditions: false,
    hasPublicHealthcare: true,
    hasPrivateHealthcare: false
  })
  const [analysis, setAnalysis] = useState<CoverageAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    setSaved(false)

    try {
      const response = await fetch('/api/coverage/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user',
          segment: formData
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateCompleteness = () => {
    const fields = Object.keys(formData)
    const filledFields = fields.filter(key => {
      const value = formData[key as keyof UserSegmentData]
      if (typeof value === 'boolean') return true // Booleans siempre cuentan
      return value !== undefined && value !== null && value !== '' && value !== 0
    })
    return Math.round((filledFields.length / 30) * 100) // 30 campos relevantes aproximadamente
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Perfil de Riesgo
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Completa tu perfil para obtener recomendaciones personalizadas de seguros
          </p>
        </div>
        <Badge variant="default" className="text-lg px-4 py-2">
          {calculateCompleteness()}% completado
        </Badge>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = index === currentSection
            const isCompleted = index < currentSection

            return (
              <div key={section.id} className="flex items-center">
                <button
                  onClick={() => setCurrentSection(index)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg transition-all',
                    isActive && 'bg-blue-50 dark:bg-blue-900/20',
                    isCompleted && 'opacity-70 hover:opacity-100'
                  )}
                >
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all',
                    isActive && 'bg-blue-600 text-white',
                    isCompleted && 'bg-emerald-500 text-white',
                    !isActive && !isCompleted && 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={cn(
                    'text-xs font-medium text-center',
                    isActive && 'text-blue-600 dark:text-blue-400',
                    !isActive && 'text-slate-600 dark:text-slate-400'
                  )}>
                    {section.label}
                  </span>
                </button>
                {index < sections.length - 1 && (
                  <div className={cn(
                    'w-8 h-0.5 mx-2',
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Form Content */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="p-6">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Section 0: Demografía */}
              {currentSection === 0 && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Datos Personales
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Edad</label>
                      <input
                        type="number"
                        value={formData.age || ''}
                        onChange={(e) => updateField('age', parseInt(e.target.value) || undefined)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="35"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Estado Civil</label>
                      <select
                        value={formData.maritalStatus || ''}
                        onChange={(e) => updateField('maritalStatus', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <option value="">Seleccionar</option>
                        <option value="SOLTERO">Soltero/a</option>
                        <option value="CASADO">Casado/a</option>
                        <option value="PAREJA_DE_HECHO">Pareja de hecho</option>
                        <option value="DIVORCIADO">Divorciado/a</option>
                        <option value="VIUDO">Viudo/a</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasChildren"
                      checked={formData.hasChildren}
                      onChange={(e) => {
                        updateField('hasChildren', e.target.checked)
                        if (!e.target.checked) updateField('numberOfChildren', 0)
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasChildren" className="font-medium">Tengo hijos</label>
                  </div>

                  {formData.hasChildren && (
                    <div className="ml-9 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">¿Cuántos hijos?</label>
                        <input
                          type="number"
                          value={formData.numberOfChildren || 0}
                          onChange={(e) => updateField('numberOfChildren', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Edades (separadas por comas)</label>
                        <input
                          type="text"
                          placeholder="5, 8, 12"
                          onChange={(e) => {
                            const ages = e.target.value.split(',').map(a => parseInt(a.trim())).filter(n => !isNaN(n))
                            updateField('childrenAges', ages)
                          }}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasDependents"
                      checked={formData.hasDependents}
                      onChange={(e) => updateField('hasDependents', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasDependents" className="font-medium">
                      Tengo personas mayores a mi cargo (padres, abuelos)
                    </label>
                  </div>
                </>
              )}

              {/* Section 1: Laboral */}
              {currentSection === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Situación Laboral
                  </h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Situación laboral actual</label>
                    <select
                      value={formData.employmentStatus || ''}
                      onChange={(e) => updateField('employmentStatus', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    >
                      <option value="">Seleccionar</option>
                      <option value="EMPLEADO_CUENTA_AJENA">Empleado por cuenta ajena</option>
                      <option value="AUTONOMO">Autónomo</option>
                      <option value="FUNCIONARIO">Funcionario</option>
                      <option value="DIRECTIVO">Directivo</option>
                      <option value="DESEMPLEADO">Desempleado</option>
                      <option value="JUBILADO">Jubilado</option>
                      <option value="ESTUDIANTE">Estudiante</option>
                      <option value="AMA_DE_CASA">Ama/o de casa</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ocupación</label>
                      <input
                        type="text"
                        value={formData.occupation || ''}
                        onChange={(e) => updateField('occupation', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="Ingeniero, Profesor, Médico..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Sector</label>
                      <input
                        type="text"
                        value={formData.companySector || ''}
                        onChange={(e) => updateField('companySector', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="Tecnología, Educación, Salud..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ingresos mensuales netos</label>
                    <select
                      value={formData.monthlyIncome || ''}
                      onChange={(e) => updateField('monthlyIncome', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    >
                      <option value="">Seleccionar</option>
                      <option value="MENOS_1000">Menos de 1.000€</option>
                      <option value="ENTRE_1000_2000">Entre 1.000-2.000€</option>
                      <option value="ENTRE_2000_3000">Entre 2.000-3.000€</option>
                      <option value="ENTRE_3000_5000">Entre 3.000-5.000€</option>
                      <option value="ENTRE_5000_7000">Entre 5.000-7.000€</option>
                      <option value="MAS_7000">Más de 7.000€</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasSecondIncome"
                      checked={formData.hasSecondIncome}
                      onChange={(e) => updateField('hasSecondIncome', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasSecondIncome" className="font-medium">
                      Hay otros ingresos en el hogar (pareja, rentas, etc.)
                    </label>
                  </div>
                </>
              )}

              {/* Section 2: Patrimonio */}
              {currentSection === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Patrimonio
                  </h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Situación de vivienda</label>
                    <select
                      value={formData.housingStatus || ''}
                      onChange={(e) => updateField('housingStatus', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    >
                      <option value="">Seleccionar</option>
                      <option value="VIVIENDA_PROPIA_SIN_HIPOTECA">Vivienda propia sin hipoteca</option>
                      <option value="VIVIENDA_PROPIA_CON_HIPOTECA">Vivienda propia con hipoteca</option>
                      <option value="ALQUILER">Alquiler</option>
                      <option value="FAMILIAR">Vivienda familiar (padres, etc.)</option>
                      <option value="OTROS">Otros</option>
                    </select>
                  </div>

                  {formData.housingStatus?.includes('PROPIA') && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Valor aproximado de la vivienda</label>
                        <input
                          type="number"
                          value={formData.homeValue || ''}
                          onChange={(e) => updateField('homeValue', parseInt(e.target.value) || undefined)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          placeholder="250000"
                        />
                      </div>

                      {formData.housingStatus === 'VIVIENDA_PROPIA_CON_HIPOTECA' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Cantidad pendiente de hipoteca</label>
                          <input
                            type="number"
                            value={formData.mortgageAmount || ''}
                            onChange={(e) => {
                              updateField('mortgageAmount', parseInt(e.target.value) || undefined)
                              updateField('hasMortgage', true)
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                            placeholder="180000"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <hr className="my-6" />

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasVehicle"
                      checked={formData.hasVehicle}
                      onChange={(e) => {
                        updateField('hasVehicle', e.target.checked)
                        if (!e.target.checked) updateField('vehicleOwnership', 'NINGUNO')
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasVehicle" className="font-medium">Tengo vehículo</label>
                  </div>

                  {formData.hasVehicle && (
                    <div className="ml-9 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tipo de propiedad</label>
                          <select
                            value={formData.vehicleOwnership}
                            onChange={(e) => updateField('vehicleOwnership', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          >
                            <option value="PROPIO">Propio</option>
                            <option value="RENTING">Renting</option>
                            <option value="LEASING">Leasing</option>
                            <option value="EMPRESA">De empresa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Valor aproximado</label>
                          <input
                            type="number"
                            value={formData.vehicleValue || ''}
                            onChange={(e) => updateField('vehicleValue', parseInt(e.target.value) || undefined)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                            placeholder="18000"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Section 3: Financiero */}
              {currentSection === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Situación Financiera
                  </h2>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasSavings"
                      checked={formData.hasSavings}
                      onChange={(e) => {
                        updateField('hasSavings', e.target.checked)
                        if (!e.target.checked) updateField('savingsAmount', undefined)
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasSavings" className="font-medium">Tengo fondo de ahorro/emergencia</label>
                  </div>

                  {formData.hasSavings && (
                    <div className="ml-9">
                      <label className="block text-sm font-medium mb-2">Cantidad aproximada de ahorro</label>
                      <input
                        type="number"
                        value={formData.savingsAmount || ''}
                        onChange={(e) => updateField('savingsAmount', parseInt(e.target.value) || undefined)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="15000"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasDebts"
                      checked={formData.hasDebts}
                      onChange={(e) => {
                        updateField('hasDebts', e.target.checked)
                        if (!e.target.checked) updateField('totalDebts', undefined)
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasDebts" className="font-medium">
                      Tengo deudas (tarjetas, préstamos personales)
                    </label>
                  </div>

                  {formData.hasDebts && (
                    <div className="ml-9">
                      <label className="block text-sm font-medium mb-2">Deuda total aproximada</label>
                      <input
                        type="number"
                        value={formData.totalDebts || ''}
                        onChange={(e) => updateField('totalDebts', parseInt(e.target.value) || undefined)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="5000"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Gastos mensuales estimados (hogar completo)</label>
                    <input
                      type="number"
                      value={formData.monthlyExpenses || ''}
                      onChange={(e) => updateField('monthlyExpenses', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      placeholder="2800"
                    />
                  </div>
                </>
              )}

              {/* Section 4: Estilo de Vida */}
              {currentSection === 4 && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Estilo de Vida
                  </h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ¿Cuántas veces viajas al extranjero al año?
                    </label>
                    <input
                      type="number"
                      value={formData.travelFrequency || 0}
                      onChange={(e) => updateField('travelFrequency', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      min="0"
                      placeholder="2"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="practicesSports"
                      checked={formData.practicesSports}
                      onChange={(e) => {
                        updateField('practicesSports', e.target.checked)
                        if (!e.target.checked) updateField('sportsType', undefined)
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="practicesSports" className="font-medium">Practico deportes regularmente</label>
                  </div>

                  {formData.practicesSports && (
                    <div className="ml-9">
                      <label className="block text-sm font-medium mb-2">Nivel de riesgo del deporte</label>
                      <select
                        value={formData.sportsType || ''}
                        onChange={(e) => updateField('sportsType', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <option value="">Seleccionar</option>
                        <option value="BAJO_RIESGO">Bajo riesgo (gimnasio, yoga, natación)</option>
                        <option value="MEDIO_RIESGO">Medio riesgo (ciclismo, running, fútbol)</option>
                        <option value="ALTO_RIESGO">Alto riesgo (escalada, parapente, motocross)</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasPets"
                      checked={formData.hasPets}
                      onChange={(e) => {
                        updateField('hasPets', e.target.checked)
                        if (!e.target.checked) updateField('numberOfPets', 0)
                      }}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasPets" className="font-medium">Tengo mascotas</label>
                  </div>

                  {formData.hasPets && (
                    <div className="ml-9">
                      <label className="block text-sm font-medium mb-2">¿Cuántas mascotas?</label>
                      <input
                        type="number"
                        value={formData.numberOfPets || 0}
                        onChange={(e) => updateField('numberOfPets', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        min="0"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Section 5: Salud */}
              {currentSection === 5 && (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Salud
                  </h2>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasPublicHealthcare"
                      checked={formData.hasPublicHealthcare}
                      onChange={(e) => updateField('hasPublicHealthcare', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasPublicHealthcare" className="font-medium">
                      Tengo cobertura de Seguridad Social
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasPrivateHealthcare"
                      checked={formData.hasPrivateHealthcare}
                      onChange={(e) => updateField('hasPrivateHealthcare', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasPrivateHealthcare" className="font-medium">
                      Tengo seguro de salud privado
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="hasHealthConditions"
                      checked={formData.hasHealthConditions}
                      onChange={(e) => updateField('hasHealthConditions', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="hasHealthConditions" className="font-medium">
                      Tengo condiciones de salud preexistentes
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          ¡Perfil casi completo!
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Haz clic en "Guardar y Analizar" para obtener tu análisis personalizado de cobertura
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                  currentSection === 0
                    ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>

              {currentSection < sections.length - 1 ? (
                <button
                  onClick={nextSection}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={saveProfile}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Analizando...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      ¡Guardado!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar y Analizar
                    </>
                  )}
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Live Analysis Preview */}
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Vista Previa del Análisis
              </h3>

              {analysis ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-900 dark:text-white">
                      {analysis.gapPercentage}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Descubierto
                    </div>
                    <Badge variant={
                      analysis.riskLevel === 'CRITICO' || analysis.riskLevel === 'ALTO' ? 'error' :
                      analysis.riskLevel === 'MEDIO' ? 'warning' : 'success'
                    } className="mt-3">
                      Riesgo {analysis.riskLevel}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {analysis.recommendations.slice(0, 5).map((rec) => (
                      <div key={rec.policyType} className="flex items-center justify-between text-sm">
                        <span className={cn(
                          rec.isCurrentlyCovered ? 'text-slate-600' : 'font-medium text-slate-900 dark:text-white'
                        )}>
                          {rec.policyType}
                        </span>
                        <Badge variant={rec.isCurrentlyCovered ? 'success' : 'error'} size="sm">
                          {rec.isCurrentlyCovered ? '✓' : rec.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Score de Protección
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            analysis.overallScore >= 80 ? 'bg-emerald-500' :
                            analysis.overallScore >= 50 ? 'bg-amber-500' :
                            'bg-red-500'
                          )}
                          style={{ width: `${analysis.overallScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg">{analysis.overallScore}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <p className="text-sm">
                    Completa el formulario y haz clic en "Guardar y Analizar" para ver tu análisis personalizado
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
