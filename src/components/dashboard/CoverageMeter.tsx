'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle, TrendingUp, AlertCircle,
  ChevronRight, Info, DollarSign, Clock, Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CoverageAnalyzer,
  UserProfile,
  getRiskColor,
  getRiskLabel,
  getPriorityColor,
  type CoverageAnalysis,
  type PolicyRecommendation
} from '@/lib/coverage-analyzer'

interface CoverageMeterProps {
  userProfile: UserProfile
  existingPolicies?: string[]
  compact?: boolean
}

export function CoverageMeter({ userProfile, existingPolicies = [], compact = false }: CoverageMeterProps) {
  const analysis: CoverageAnalysis = useMemo(() => {
    const analyzer = new CoverageAnalyzer(userProfile, existingPolicies)
    return analyzer.analyze()
  }, [userProfile, existingPolicies])

  const riskColor = getRiskColor(analysis.riskLevel)
  const riskLabel = getRiskLabel(analysis.riskLevel)

  if (compact) {
    return <CompactMeter analysis={analysis} riskColor={riskColor} riskLabel={riskLabel} />
  }

  return (
    <div className="space-y-6">
      {/* Score Principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6 relative overflow-hidden"
      >
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${riskColor} 0%, transparent 100%)`
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                Medidor de Cobertura
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Análisis personalizado de tu protección
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" style={{ color: riskColor }} />
                <span className="text-2xl font-bold" style={{ color: riskColor }}>
                  {analysis.overallScore}%
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: riskColor }}>
                {riskLabel}
              </p>
            </div>
          </div>

          {/* Barra de progreso circular */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-700"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={riskColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 56 * (1 - analysis.overallScore / 100)
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: riskColor }}>
                    {analysis.overallScore}
                  </p>
                  <p className="text-xs text-slate-500">de 100</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Pólizas activas
                </span>
                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {analysis.existingPolicies.length} / 9
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Coberturas faltantes
                </span>
                <span className="font-semibold text-orange-600">
                  {analysis.missingPolicies.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Riesgo financiero
                </span>
                <span className="font-semibold text-red-600">
                  {analysis.estimatedRisk.toLocaleString()}€
                </span>
              </div>
            </div>
          </div>

          {/* Recomendaciones rápidas */}
          {analysis.recommendations.length > 0 && (
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                >
                  <Info className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                    {rec}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Pólizas Faltantes */}
      {analysis.missingPolicies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Coberturas Recomendadas
          </h4>

          <div className="space-y-3">
            {analysis.missingPolicies.map((policy, index) => (
              <PolicyCard key={policy.id} policy={policy} index={index} />
            ))}
          </div>

          {analysis.potentialSavings > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Ahorra hasta {analysis.potentialSavings}€/mes
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Contratando 3 o más pólizas en paquete (15% descuento)
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Gaps de Cobertura */}
      {analysis.gaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <AlertCircle className="w-5 h-5 text-red-500" />
            Áreas de Riesgo Detectadas
          </h4>

          <div className="space-y-4">
            {analysis.gaps.map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border-l-4",
                  gap.severity === 'critica' && "bg-red-50 dark:bg-red-900/20 border-red-500",
                  gap.severity === 'alta' && "bg-orange-50 dark:bg-orange-900/20 border-orange-500",
                  gap.severity === 'media' && "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500",
                  gap.severity === 'baja' && "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {gap.area}
                  </h5>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    gap.severity === 'critica' && "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
                    gap.severity === 'alta' && "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
                    gap.severity === 'media' && "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
                    gap.severity === 'baja' && "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  )}>
                    {gap.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  {gap.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Impacto: </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{gap.impact}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Solución: </span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{gap.solution}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Componente compacto para dashboard
function CompactMeter({ analysis, riskColor, riskLabel }: { 
  analysis: CoverageAnalysis
  riskColor: string
  riskLabel: string
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-200 dark:text-slate-700"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke={riskColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 28 * (1 - analysis.overallScore / 100)
              }}
              transition={{ duration: 1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color: riskColor }}>
              {analysis.overallScore}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
            Cobertura
          </h4>
          <p className="text-sm mb-2" style={{ color: riskColor }}>
            {riskLabel}
          </p>
          {analysis.missingPolicies.length > 0 && (
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {analysis.missingPolicies.length} póliza(s) recomendada(s)
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  )
}

// Card de póliza individual
function PolicyCard({ policy, index }: { policy: PolicyRecommendation; index: number }) {
  const priorityColor = getPriorityColor(policy.priority)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl border-2 hover:shadow-lg transition-all cursor-pointer"
      style={{ borderColor: `${priorityColor}30` }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${policy.color}20` }}
        >
          {policy.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h5 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                {policy.name}
              </h5>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: priorityColor }}
                >
                  {policy.priority.toUpperCase()}
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock className="w-3 h-3" />
                  Urgencia: {policy.urgency}/10
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {policy.estimatedCost.min}-{policy.estimatedCost.max}€
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                /mes
              </p>
            </div>
          </div>

          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            {policy.reason}
          </p>

          {/* Coverage tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {policy.coverage.slice(0, 3).map((cov, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {cov}
              </span>
            ))}
            {policy.coverage.length > 3 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">
                +{policy.coverage.length - 3} más
              </span>
            )}
          </div>

          {/* Risk indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Pérdida potencial: <strong className="text-red-600">{policy.potentialLoss.toLocaleString()}€</strong>
              </span>
            </div>
            <button className="px-3 py-1 rounded-lg bg-occident text-white text-sm font-medium hover:bg-occident/90 transition-colors">
              Contratar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
