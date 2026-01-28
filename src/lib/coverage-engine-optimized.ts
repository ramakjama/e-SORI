/**
 * MOTOR DE COBERTURA OPTIMIZADO (versión ligera)
 * Análisis rápido de necesidades de seguros
 */

import type { InsuranceType, PolicyPriority } from '@prisma/client'

export interface UserSegmentData {
  age?: number
  maritalStatus?: string
  hasChildren: boolean
  numberOfChildren: number
  childrenAges?: number[]
  hasDependents: boolean
  employmentStatus?: string
  monthlyIncome?: string
  hasSecondIncome: boolean
  housingStatus?: string
  homeValue?: number
  hasMortgage: boolean
  mortgageAmount?: number
  vehicleOwnership: string
  hasVehicle: boolean
  vehicleValue?: number
  hasSavings: boolean
  savingsAmount?: number
  hasDebts: boolean
  totalDebts?: number
  monthlyExpenses?: number
  travelFrequency: number
  practicesSports: boolean
  sportsType?: string
  hasPets: boolean
  numberOfPets: number
  hasHealthConditions: boolean
  hasPublicHealthcare: boolean
  hasPrivateHealthcare: boolean
}

export interface CurrentPolicy {
  type: string
  status: string
  premium?: number
}

export interface PolicyAnalysis {
  policyType: InsuranceType
  priority: PolicyPriority
  priorityScore: number
  isCurrentlyCovered: boolean
  mainReason: string
  riskDescription: string
  financialImpact?: string
  legalImpact?: string
  recommendedCoverage?: string
  estimatedPremium?: number
  calculationFactors: string[]
}

export interface CoverageAnalysisResult {
  gapPercentage: number
  coveragePercentage: number
  totalEssentialPolicies: number
  coveredPolicies: number
  missingPolicies: number
  riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO'
  recommendations: PolicyAnalysis[]
  overallScore: number
}

// Reglas simplificadas y optimizadas
const POLICY_RULES = {
  AUTO: (s: UserSegmentData) => {
    if (!s.hasVehicle) return null
    return {
      priority: 'CRITICA' as PolicyPriority,
      score: 100,
      reason: 'Tienes un vehículo registrado',
      risk: 'Circular sin seguro es ILEGAL en España',
      financial: 'RC ilimitada + pérdida del vehículo',
      legal: 'Multas desde 3.000€'
    }
  },

  HOGAR: (s: UserSegmentData) => {
    if (!s.housingStatus || s.housingStatus === 'FAMILIAR') return null
    const isMortgage = s.hasMortgage
    const isOwner = s.housingStatus.includes('PROPIA')

    if (isMortgage && s.hasChildren) {
      return {
        priority: 'CRITICA' as PolicyPriority,
        score: 150,
        reason: 'Tienes una vivienda con hipoteca e hijos',
        risk: 'El banco EXIGE seguro + mayor riesgo de daños',
        financial: `Hipoteca de ${(s.mortgageAmount || 0).toLocaleString()}€`,
        legal: 'Incumplimiento de contrato hipotecario'
      }
    } else if (isOwner) {
      return {
        priority: 'ALTA' as PolicyPriority,
        score: 60,
        reason: 'Tienes una vivienda en propiedad',
        risk: 'Tu patrimonio principal está desprotegido'
      }
    }
    return null
  },

  VIDA: (s: UserSegmentData) => {
    if (s.hasChildren && s.hasMortgage) {
      return {
        priority: 'CRITICA' as PolicyPriority,
        score: 100,
        reason: 'Tienes hijos y una hipoteca',
        risk: 'Tu familia quedaría con la deuda y sin ingresos',
        financial: `Hipoteca de ${(s.mortgageAmount || 0).toLocaleString()}€`
      }
    } else if (s.hasChildren) {
      return {
        priority: 'ALTA' as PolicyPriority,
        score: 70,
        reason: 'Tienes hijos que dependen de ti',
        risk: 'Tu familia necesitaría recursos'
      }
    } else if (s.hasMortgage) {
      return {
        priority: 'ALTA' as PolicyPriority,
        score: 60,
        reason: 'Tienes una hipoteca',
        risk: 'Tu familia tendría que asumir la deuda'
      }
    }
    return null
  },

  SALUD: (s: UserSegmentData) => {
    if (s.hasPrivateHealthcare) return null

    if (s.employmentStatus === 'AUTONOMO') {
      return {
        priority: 'CRITICA' as PolicyPriority,
        score: 70,
        reason: 'Como autónomo, tu SS es limitada',
        risk: 'Las bajas afectan directamente a tus ingresos',
        financial: 'Sin ingresos durante bajas + tratamientos caros'
      }
    } else if (s.hasChildren && s.childrenAges?.some(a => a < 12)) {
      return {
        priority: 'ALTA' as PolicyPriority,
        score: 50,
        reason: 'Tienes hijos pequeños',
        risk: 'Los niños necesitan pediatra frecuente',
        financial: 'Visitas privadas: 60-100€/consulta'
      }
    }
    return null
  },

  DECESOS: (s: UserSegmentData) => {
    if ((s.age || 0) >= 50) {
      return {
        priority: 'ALTA' as PolicyPriority,
        score: 50,
        reason: 'A partir de 50 años es muy recomendable',
        risk: 'Gastos de funeral pueden alcanzar 5-8k€'
      }
    }
    return null
  },

  VIAJE: (s: UserSegmentData) => {
    if (s.travelFrequency >= 3) {
      return {
        priority: 'ALTA' as PolicyPriority,
        score: 60,
        reason: `Viajas ${s.travelFrequency} veces/año`,
        risk: 'Gastos médicos en el extranjero',
        financial: 'Hospitalización USA: 10-50k€'
      }
    }
    return null
  }
}

export class CoverageEngine {
  private segment: UserSegmentData
  private currentPolicies: CurrentPolicy[]

  constructor(segment: UserSegmentData, currentPolicies: CurrentPolicy[] = []) {
    this.segment = segment
    this.currentPolicies = currentPolicies
  }

  public analyze(): CoverageAnalysisResult {
    const recommendations: PolicyAnalysis[] = []

    // Analizar cada tipo de póliza usando las reglas
    Object.entries(POLICY_RULES).forEach(([type, rule]) => {
      const result = rule(this.segment)
      if (!result) return

      const isCovered = this.isPolicyCovered(type.toLowerCase())

      recommendations.push({
        policyType: type as InsuranceType,
        priority: result.priority,
        priorityScore: result.score,
        isCurrentlyCovered: isCovered,
        mainReason: result.reason,
        riskDescription: result.risk,
        financialImpact: result.financial,
        legalImpact: result.legal,
        recommendedCoverage: result.coverage,
        estimatedPremium: this.estimatePremium(type),
        calculationFactors: []
      })
    })

    // Ordenar por prioridad
    recommendations.sort((a, b) => b.priorityScore - a.priorityScore)

    const total = recommendations.length
    const covered = recommendations.filter(r => r.isCurrentlyCovered).length
    const missing = total - covered
    const coveragePercentage = total > 0 ? Math.round((covered / total) * 100) : 100
    const gapPercentage = 100 - coveragePercentage

    let riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO' = 'BAJO'
    const criticalMissing = recommendations.filter(
      r => !r.isCurrentlyCovered && r.priority === 'CRITICA'
    ).length

    if (criticalMissing >= 2) riskLevel = 'CRITICO'
    else if (criticalMissing === 1) riskLevel = 'ALTO'
    else if (gapPercentage >= 50) riskLevel = 'ALTO'
    else if (gapPercentage >= 25) riskLevel = 'MEDIO'

    const overallScore = total > 0 ? Math.round((covered / total) * 100) : 100

    return {
      gapPercentage,
      coveragePercentage,
      totalEssentialPolicies: total,
      coveredPolicies: covered,
      missingPolicies: missing,
      riskLevel,
      recommendations,
      overallScore
    }
  }

  private isPolicyCovered(type: string): boolean {
    return this.currentPolicies.some(
      p => p.type.toLowerCase() === type.toLowerCase() && p.status === 'ACTIVA'
    )
  }

  private estimatePremium(type: string): number {
    const baseRates: Record<string, number> = {
      AUTO: 45,
      HOGAR: 25,
      SALUD: 80,
      VIDA: 25,
      DECESOS: 15,
      VIAJE: 50
    }
    return baseRates[type] || 30
  }
}
