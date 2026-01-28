'use client'

/**
 * PERFIL DE RIESGO - Versión Optimizada
 * Formulario simplificado para captura de datos de segmentación
 */

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { UserSegmentData, CoverageAnalysisResult } from '@/lib/coverage-engine-optimized'
import { cn } from '@/lib/utils'

export default function PerfilRiesgoPage() {
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

  const saveProfile = async () => {
    setLoading(true)
    setSaved(false)

    try {
      const response = await fetch('/api/coverage/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', segment: formData })
      })

      const data = await response.json()

      if (data.success) {
        setAnalysis(data.analysis)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Perfil de Riesgo
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Completa tu perfil para obtener recomendaciones personalizadas
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="md:col-span-2">
          <Card className="p-6 space-y-6">
            {/* Sección Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Datos Personales</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Edad</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => updateField('age', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                    placeholder="35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado Civil</label>
                  <select
                    value={formData.maritalStatus || ''}
                    onChange={(e) => updateField('maritalStatus', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  >
                    <option value="">Seleccionar</option>
                    <option value="SOLTERO">Soltero/a</option>
                    <option value="CASADO">Casado/a</option>
                    <option value="PAREJA_DE_HECHO">Pareja de hecho</option>
                    <option value="DIVORCIADO">Divorciado/a</option>
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
                <div className="ml-9">
                  <label className="block text-sm mb-2">¿Cuántos?</label>
                  <input
                    type="number"
                    value={formData.numberOfChildren}
                    onChange={(e) => updateField('numberOfChildren', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                    min="0"
                  />
                </div>
              )}
            </div>

            {/* Sección Laboral */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Situación Laboral</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Situación laboral</label>
                <select
                  value={formData.employmentStatus || ''}
                  onChange={(e) => updateField('employmentStatus', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                >
                  <option value="">Seleccionar</option>
                  <option value="EMPLEADO_CUENTA_AJENA">Empleado</option>
                  <option value="AUTONOMO">Autónomo</option>
                  <option value="FUNCIONARIO">Funcionario</option>
                  <option value="DESEMPLEADO">Desempleado</option>
                  <option value="JUBILADO">Jubilado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ingresos mensuales</label>
                <select
                  value={formData.monthlyIncome || ''}
                  onChange={(e) => updateField('monthlyIncome', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                >
                  <option value="">Seleccionar</option>
                  <option value="MENOS_1000">Menos de 1.000€</option>
                  <option value="ENTRE_1000_2000">1.000-2.000€</option>
                  <option value="ENTRE_2000_3000">2.000-3.000€</option>
                  <option value="ENTRE_3000_5000">3.000-5.000€</option>
                  <option value="MAS_7000">Más de 7.000€</option>
                </select>
              </div>
            </div>

            {/* Sección Patrimonio */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Patrimonio</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Vivienda</label>
                <select
                  value={formData.housingStatus || ''}
                  onChange={(e) => updateField('housingStatus', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                >
                  <option value="">Seleccionar</option>
                  <option value="VIVIENDA_PROPIA_SIN_HIPOTECA">Propia sin hipoteca</option>
                  <option value="VIVIENDA_PROPIA_CON_HIPOTECA">Propia con hipoteca</option>
                  <option value="ALQUILER">Alquiler</option>
                  <option value="FAMILIAR">Familiar</option>
                </select>
              </div>

              {formData.housingStatus === 'VIVIENDA_PROPIA_CON_HIPOTECA' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Valor vivienda</label>
                    <input
                      type="number"
                      value={formData.homeValue || ''}
                      onChange={(e) => updateField('homeValue', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                      placeholder="250000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Hipoteca pendiente</label>
                    <input
                      type="number"
                      value={formData.mortgageAmount || ''}
                      onChange={(e) => {
                        updateField('mortgageAmount', parseInt(e.target.value) || undefined)
                        updateField('hasMortgage', true)
                      }}
                      className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                      placeholder="180000"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="hasVehicle"
                  checked={formData.hasVehicle}
                  onChange={(e) => updateField('hasVehicle', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="hasVehicle" className="font-medium">Tengo vehículo</label>
              </div>

              {formData.hasVehicle && (
                <div className="ml-9">
                  <label className="block text-sm mb-2">Valor aproximado</label>
                  <input
                    type="number"
                    value={formData.vehicleValue || ''}
                    onChange={(e) => updateField('vehicleValue', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                    placeholder="18000"
                  />
                </div>
              )}
            </div>

            {/* Sección Salud */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Salud y Estilo de Vida</h3>

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

              <div>
                <label className="block text-sm mb-2">Viajes al extranjero por año</label>
                <input
                  type="number"
                  value={formData.travelFrequency}
                  onChange={(e) => updateField('travelFrequency', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-800"
                  min="0"
                />
              </div>
            </div>

            {/* Botón guardar */}
            <button
              type="button"
              onClick={saveProfile}
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Analizando...
                </span>
              ) : saved ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Guardado
                </span>
              ) : (
                'Guardar y Analizar'
              )}
            </button>
          </Card>
        </div>

        {/* Panel de Análisis */}
        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Análisis
            </h3>

            {analysis ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold">
                    {analysis.gapPercentage}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Descubierto
                  </div>
                  <Badge variant={
                    analysis.riskLevel === 'CRITICO' || analysis.riskLevel === 'ALTO' ? 'error' :
                    analysis.riskLevel === 'MEDIO' ? 'warning' : 'success'
                  } className="mt-3">
                    {analysis.riskLevel}
                  </Badge>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  {analysis.recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.policyType} className="flex items-center justify-between text-sm">
                      <span className={cn(
                        rec.isCurrentlyCovered ? 'text-slate-600' : 'font-medium'
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
                          analysis.overallScore >= 80 ? 'w-full bg-emerald-500' :
                          analysis.overallScore >= 50 ? 'w-3/4 bg-amber-500' :
                          analysis.overallScore >= 25 ? 'w-1/2 bg-amber-600' : 'w-1/4 bg-red-500'
                        )}
                      />
                    </div>
                    <span className="font-bold text-lg">{analysis.overallScore}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm">
                  Completa el formulario y haz clic en "Guardar y Analizar"
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
