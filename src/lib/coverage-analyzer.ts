/**
 * 🛡️ ANALIZADOR INTELIGENTE DE COBERTURA
 * Sistema que evalúa los datos del usuario y determina su nivel de protección
 */

// ============================================
// TIPOS Y INTERFACES
// ============================================

export interface UserProfile {
  // Datos personales
  edad?: number
  estadoCivil?: 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'pareja_de_hecho'
  numeroHijos?: number
  personasACargo?: number
  
  // Datos laborales
  situacionLaboral?: 'empleado' | 'autonomo' | 'desempleado' | 'jubilado' | 'estudiante'
  ingresosAnuales?: string
  
  // Datos familiares
  convivientesHogar?: number
  
  // Datos financieros
  hipoteca?: boolean
  prestamos?: boolean
  ahorros?: boolean
  
  // Datos de salud
  condicionesMedicas?: string[]
  practicaDeportes?: boolean
  
  // Datos de vivienda
  tipoVivienda?: 'propiedad' | 'alquiler' | 'familiar'
  valorVivienda?: number
  
  // Datos de vehículo
  tieneVehiculo?: boolean
  tipoVehiculo?: 'coche' | 'moto' | 'ambos'
  usoVehiculo?: 'particular' | 'profesional' | 'mixto'
  
  // Aficiones
  viajaFrecuentemente?: boolean
  deportesRiesgo?: boolean
  mascota?: boolean
}

export interface PolicyRecommendation {
  id: string
  type: 'vida' | 'salud' | 'hogar' | 'auto' | 'ahorro' | 'responsabilidad' | 'viaje' | 'mascota' | 'decesos'
  name: string
  priority: 'critica' | 'alta' | 'media' | 'baja'
  urgency: number // 1-10
  reason: string
  estimatedCost: { min: number; max: number }
  coverage: string[]
  icon: string
  color: string
  riskLevel: 'alto' | 'medio' | 'bajo'
  potentialLoss: number // Pérdida potencial sin seguro
}

export interface CoverageAnalysis {
  overallScore: number // 0-100
  riskLevel: 'critico' | 'alto' | 'medio' | 'bajo' | 'optimo'
  missingPolicies: PolicyRecommendation[]
  existingPolicies: string[]
  gaps: CoverageGap[]
  recommendations: string[]
  potentialSavings: number
  estimatedRisk: number // Riesgo financiero total
}

export interface CoverageGap {
  area: string
  severity: 'critica' | 'alta' | 'media' | 'baja'
  description: string
  impact: string
  solution: string
}

// ============================================
// CONFIGURACIÓN DE PÓLIZAS
// ============================================

const POLICY_CATALOG: Record<string, Omit<PolicyRecommendation, 'priority' | 'urgency' | 'reason'>> = {
  vida: {
    id: 'vida',
    type: 'vida',
    name: 'Seguro de Vida',
    estimatedCost: { min: 15, max: 50 },
    coverage: ['Fallecimiento', 'Invalidez permanente', 'Enfermedades graves'],
    icon: '❤️',
    color: '#EF4444',
    riskLevel: 'alto',
    potentialLoss: 200000,
  },
  salud: {
    id: 'salud',
    type: 'salud',
    name: 'Seguro de Salud',
    estimatedCost: { min: 40, max: 150 },
    coverage: ['Asistencia médica', 'Hospitalización', 'Cirugías', 'Especialistas'],
    icon: '🏥',
    color: '#10B981',
    riskLevel: 'alto',
    potentialLoss: 50000,
  },
  hogar: {
    id: 'hogar',
    type: 'hogar',
    name: 'Seguro de Hogar',
    estimatedCost: { min: 20, max: 80 },
    coverage: ['Incendio', 'Robo', 'Daños agua', 'Responsabilidad civil', 'Asistencia 24h'],
    icon: '🏠',
    color: '#F59E0B',
    riskLevel: 'medio',
    potentialLoss: 150000,
  },
  auto: {
    id: 'auto',
    type: 'auto',
    name: 'Seguro de Auto',
    estimatedCost: { min: 30, max: 120 },
    coverage: ['Responsabilidad civil', 'Daños propios', 'Robo', 'Asistencia en carretera'],
    icon: '🚗',
    color: '#3B82F6',
    riskLevel: 'alto',
    potentialLoss: 30000,
  },
  ahorro: {
    id: 'ahorro',
    type: 'ahorro',
    name: 'Plan de Ahorro/Pensiones',
    estimatedCost: { min: 50, max: 300 },
    coverage: ['Jubilación', 'Ahorro fiscal', 'Rentabilidad garantizada'],
    icon: '💰',
    color: '#8B5CF6',
    riskLevel: 'medio',
    potentialLoss: 100000,
  },
  responsabilidad: {
    id: 'responsabilidad',
    type: 'responsabilidad',
    name: 'Responsabilidad Civil',
    estimatedCost: { min: 10, max: 40 },
    coverage: ['Daños a terceros', 'Defensa jurídica', 'Fianzas'],
    icon: '⚖️',
    color: '#6366F1',
    riskLevel: 'medio',
    potentialLoss: 50000,
  },
  viaje: {
    id: 'viaje',
    type: 'viaje',
    name: 'Seguro de Viaje',
    estimatedCost: { min: 5, max: 30 },
    coverage: ['Asistencia médica', 'Cancelación', 'Equipaje', 'Repatriación'],
    icon: '✈️',
    color: '#14B8A6',
    riskLevel: 'bajo',
    potentialLoss: 10000,
  },
  mascota: {
    id: 'mascota',
    type: 'mascota',
    name: 'Seguro de Mascota',
    estimatedCost: { min: 15, max: 50 },
    coverage: ['Veterinario', 'Cirugías', 'Responsabilidad civil'],
    icon: '🐕',
    color: '#EC4899',
    riskLevel: 'bajo',
    potentialLoss: 5000,
  },
  decesos: {
    id: 'decesos',
    type: 'decesos',
    name: 'Seguro de Decesos',
    estimatedCost: { min: 10, max: 30 },
    coverage: ['Gastos funerarios', 'Repatriación', 'Asistencia familiar'],
    icon: '🕊️',
    color: '#64748B',
    riskLevel: 'medio',
    potentialLoss: 8000,
  },
}

// ============================================
// MOTOR DE ANÁLISIS
// ============================================

export class CoverageAnalyzer {
  private profile: UserProfile
  private existingPolicies: string[]

  constructor(profile: UserProfile, existingPolicies: string[] = []) {
    this.profile = profile
    this.existingPolicies = existingPolicies
  }

  /**
   * Análisis completo de cobertura
   */
  analyze(): CoverageAnalysis {
    const recommendations = this.generateRecommendations()
    const gaps = this.identifyGaps()
    const score = this.calculateCoverageScore(recommendations)
    const riskLevel = this.determineRiskLevel(score)
    const estimatedRisk = this.calculateTotalRisk(recommendations)

    return {
      overallScore: score,
      riskLevel,
      missingPolicies: recommendations,
      existingPolicies: this.existingPolicies,
      gaps,
      recommendations: this.generateTextRecommendations(recommendations),
      potentialSavings: this.calculatePotentialSavings(recommendations),
      estimatedRisk,
    }
  }

  /**
   * Genera recomendaciones personalizadas basadas en el perfil
   */
  private generateRecommendations(): PolicyRecommendation[] {
    const recommendations: PolicyRecommendation[] = []

    // SEGURO DE VIDA - Crítico si tiene familia o hipoteca
    if (!this.existingPolicies.includes('vida')) {
      const hasFamily = (this.profile.numeroHijos || 0) > 0 || 
                       this.profile.estadoCivil === 'casado' ||
                       (this.profile.personasACargo || 0) > 0
      const hasDebt = this.profile.hipoteca || this.profile.prestamos
      const isWorking = this.profile.situacionLaboral === 'empleado' || 
                       this.profile.situacionLaboral === 'autonomo'

      if (hasFamily || hasDebt || isWorking) {
        let priority: 'critica' | 'alta' | 'media' = 'media'
        let urgency = 5
        let reason = 'Protección financiera básica recomendada'

        if (hasFamily && hasDebt) {
          priority = 'critica'
          urgency = 10
          reason = 'CRÍTICO: Tienes familia y deudas. Tu familia quedaría desprotegida financieramente'
        } else if (hasFamily) {
          priority = 'alta'
          urgency = 8
          reason = 'Tienes personas a tu cargo que dependen de tus ingresos'
        } else if (hasDebt) {
          priority = 'alta'
          urgency = 7
          reason = 'Tienes deudas (hipoteca/préstamos) que podrían afectar a tu familia'
        }

        recommendations.push({
          ...POLICY_CATALOG.vida,
          priority,
          urgency,
          reason,
        })
      }
    }

    // SEGURO DE SALUD - Alta prioridad siempre
    if (!this.existingPolicies.includes('salud')) {
      let priority: 'critica' | 'alta' | 'media' = 'alta'
      let urgency = 7
      let reason = 'Asistencia médica privada recomendada'

      const hasConditions = (this.profile.condicionesMedicas?.length || 0) > 0
      const isOlder = (this.profile.edad || 0) > 50
      const hasFamily = (this.profile.numeroHijos || 0) > 0

      if (hasConditions || isOlder) {
        priority = 'critica'
        urgency = 9
        reason = 'IMPORTANTE: Condiciones médicas o edad requieren cobertura sanitaria'
      } else if (hasFamily) {
        urgency = 8
        reason = 'Protección sanitaria para toda la familia'
      }

      recommendations.push({
        ...POLICY_CATALOG.salud,
        priority,
        urgency,
        reason,
      })
    }

    // SEGURO DE HOGAR - Crítico si es propietario
    if (!this.existingPolicies.includes('hogar')) {
      if (this.profile.tipoVivienda === 'propiedad') {
        const hasHipoteca = this.profile.hipoteca
        recommendations.push({
          ...POLICY_CATALOG.hogar,
          priority: hasHipoteca ? 'critica' : 'alta',
          urgency: hasHipoteca ? 9 : 7,
          reason: hasHipoteca 
            ? 'OBLIGATORIO: La hipoteca requiere seguro de hogar'
            : 'Protege tu patrimonio más importante',
        })
      } else if (this.profile.tipoVivienda === 'alquiler') {
        recommendations.push({
          ...POLICY_CATALOG.hogar,
          priority: 'media',
          urgency: 5,
          reason: 'Protege tus pertenencias y responsabilidad civil',
        })
      }
    }

    // SEGURO DE AUTO - Obligatorio si tiene vehículo
    if (!this.existingPolicies.includes('auto') && this.profile.tieneVehiculo) {
      const isProfessional = this.profile.usoVehiculo === 'profesional' || 
                            this.profile.usoVehiculo === 'mixto'
      recommendations.push({
        ...POLICY_CATALOG.auto,
        priority: 'critica',
        urgency: 10,
        reason: isProfessional 
          ? 'OBLIGATORIO: Uso profesional requiere cobertura completa'
          : 'OBLIGATORIO: Responsabilidad civil es obligatoria por ley',
      })
    }

    // PLAN DE AHORRO/PENSIONES - Importante para el futuro
    if (!this.existingPolicies.includes('ahorro')) {
      const isWorking = this.profile.situacionLaboral === 'empleado' || 
                       this.profile.situacionLaboral === 'autonomo'
      const isYoung = (this.profile.edad || 0) < 50

      if (isWorking && isYoung) {
        recommendations.push({
          ...POLICY_CATALOG.ahorro,
          priority: 'alta',
          urgency: 6,
          reason: 'Cuanto antes empieces, mejor jubilación tendrás. Ventajas fiscales',
        })
      } else if (isWorking) {
        recommendations.push({
          ...POLICY_CATALOG.ahorro,
          priority: 'media',
          urgency: 7,
          reason: 'Aún estás a tiempo de mejorar tu jubilación',
        })
      }
    }

    // RESPONSABILIDAD CIVIL - Recomendado para autónomos
    if (!this.existingPolicies.includes('responsabilidad')) {
      if (this.profile.situacionLaboral === 'autonomo') {
        recommendations.push({
          ...POLICY_CATALOG.responsabilidad,
          priority: 'alta',
          urgency: 7,
          reason: 'Protege tu actividad profesional de reclamaciones',
        })
      } else if (this.profile.practicaDeportes || this.profile.deportesRiesgo) {
        recommendations.push({
          ...POLICY_CATALOG.responsabilidad,
          priority: 'media',
          urgency: 5,
          reason: 'Protección ante posibles daños a terceros en actividades',
        })
      }
    }

    // SEGURO DE VIAJE - Si viaja frecuentemente
    if (!this.existingPolicies.includes('viaje') && this.profile.viajaFrecuentemente) {
      recommendations.push({
        ...POLICY_CATALOG.viaje,
        priority: 'media',
        urgency: 4,
        reason: 'Viajas frecuentemente, protégete en el extranjero',
      })
    }

    // SEGURO DE MASCOTA - Si tiene mascota
    if (!this.existingPolicies.includes('mascota') && this.profile.mascota) {
      recommendations.push({
        ...POLICY_CATALOG.mascota,
        priority: 'baja',
        urgency: 3,
        reason: 'Protege a tu mascota y evita gastos veterinarios inesperados',
      })
    }

    // SEGURO DE DECESOS - Recomendado para mayores o con familia
    if (!this.existingPolicies.includes('decesos')) {
      const isOlder = (this.profile.edad || 0) > 55
      const hasFamily = (this.profile.numeroHijos || 0) > 0 || 
                       this.profile.estadoCivil === 'casado'

      if (isOlder || hasFamily) {
        recommendations.push({
          ...POLICY_CATALOG.decesos,
          priority: isOlder ? 'alta' : 'media',
          urgency: isOlder ? 6 : 4,
          reason: isOlder 
            ? 'A tu edad es importante tener cubiertos los gastos funerarios'
            : 'Evita que tu familia tenga que afrontar estos gastos',
        })
      }
    }

    // Ordenar por urgencia
    return recommendations.sort((a, b) => b.urgency - a.urgency)
  }

  /**
   * Identifica gaps específicos en la cobertura
   */
  private identifyGaps(): CoverageGap[] {
    const gaps: CoverageGap[] = []

    // Gap de protección familiar
    const hasFamily = (this.profile.numeroHijos || 0) > 0 || 
                     this.profile.estadoCivil === 'casado'
    if (hasFamily && !this.existingPolicies.includes('vida')) {
      gaps.push({
        area: 'Protección Familiar',
        severity: 'critica',
        description: 'Tu familia no tiene protección financiera en caso de fallecimiento',
        impact: 'Tu familia podría perder la vivienda o no poder mantener su nivel de vida',
        solution: 'Contratar un seguro de vida con capital suficiente para cubrir deudas e ingresos',
      })
    }

    // Gap de salud
    if (!this.existingPolicies.includes('salud')) {
      gaps.push({
        area: 'Asistencia Sanitaria',
        severity: 'alta',
        description: 'Dependes exclusivamente de la sanidad pública',
        impact: 'Listas de espera largas, acceso limitado a especialistas y tratamientos',
        solution: 'Seguro de salud privado para atención inmediata y completa',
      })
    }

    // Gap de patrimonio
    if (this.profile.tipoVivienda === 'propiedad' && !this.existingPolicies.includes('hogar')) {
      gaps.push({
        area: 'Protección del Patrimonio',
        severity: this.profile.hipoteca ? 'critica' : 'alta',
        description: 'Tu vivienda no está asegurada',
        impact: `Pérdida total en caso de incendio, inundación o robo (${this.profile.valorVivienda?.toLocaleString() || '150.000'}€)`,
        solution: 'Seguro de hogar multirriesgo con cobertura completa',
      })
    }

    // Gap de movilidad
    if (this.profile.tieneVehiculo && !this.existingPolicies.includes('auto')) {
      gaps.push({
        area: 'Responsabilidad Civil Obligatoria',
        severity: 'critica',
        description: 'Circular sin seguro es ILEGAL',
        impact: 'Multas de hasta 3.000€ + responsabilidad ilimitada en accidentes',
        solution: 'Seguro de auto inmediato (mínimo terceros)',
      })
    }

    // Gap de jubilación
    const isWorking = this.profile.situacionLaboral === 'empleado' || 
                     this.profile.situacionLaboral === 'autonomo'
    if (isWorking && !this.existingPolicies.includes('ahorro')) {
      gaps.push({
        area: 'Planificación de Jubilación',
        severity: 'media',
        description: 'No estás ahorrando para tu jubilación',
        impact: 'Pensión pública insuficiente (40-60% del último salario)',
        solution: 'Plan de pensiones o ahorro sistemático con ventajas fiscales',
      })
    }

    return gaps
  }

  /**
   * Calcula el score de cobertura (0-100)
   */
  private calculateCoverageScore(recommendations: PolicyRecommendation[]): number {
    const totalPolicies = Object.keys(POLICY_CATALOG).length
    const coveredPolicies = this.existingPolicies.length
    
    // Score base por pólizas contratadas
    let baseScore = (coveredPolicies / totalPolicies) * 100

    // Penalización por pólizas críticas faltantes
    const criticalMissing = recommendations.filter(r => r.priority === 'critica').length
    const penalization = criticalMissing * 15

    // Bonificación por pólizas importantes cubiertas
    const importantCovered = ['vida', 'salud', 'hogar', 'auto'].filter(
      p => this.existingPolicies.includes(p)
    ).length
    const bonus = importantCovered * 5

    const finalScore = Math.max(0, Math.min(100, baseScore - penalization + bonus))
    return Math.round(finalScore)
  }

  /**
   * Determina el nivel de riesgo general
   */
  private determineRiskLevel(score: number): 'critico' | 'alto' | 'medio' | 'bajo' | 'optimo' {
    if (score >= 90) return 'optimo'
    if (score >= 70) return 'bajo'
    if (score >= 50) return 'medio'
    if (score >= 30) return 'alto'
    return 'critico'
  }

  /**
   * Calcula el riesgo financiero total
   */
  private calculateTotalRisk(recommendations: PolicyRecommendation[]): number {
    return recommendations.reduce((total, rec) => total + rec.potentialLoss, 0)
  }

  /**
   * Genera recomendaciones en texto
   */
  private generateTextRecommendations(recommendations: PolicyRecommendation[]): string[] {
    const texts: string[] = []

    if (recommendations.length === 0) {
      texts.push('¡Excelente! Tienes una cobertura completa')
      return texts
    }

    const critical = recommendations.filter(r => r.priority === 'critica')
    const high = recommendations.filter(r => r.priority === 'alta')

    if (critical.length > 0) {
      texts.push(`⚠️ URGENTE: Tienes ${critical.length} cobertura(s) crítica(s) sin contratar`)
    }

    if (high.length > 0) {
      texts.push(`📌 Importante: ${high.length} póliza(s) de alta prioridad recomendadas`)
    }

    // Recomendación específica más urgente
    if (recommendations[0]) {
      texts.push(`🎯 Prioridad #1: ${recommendations[0].name} - ${recommendations[0].reason}`)
    }

    return texts
  }

  /**
   * Calcula ahorro potencial con paquetes
   */
  private calculatePotentialSavings(recommendations: PolicyRecommendation[]): number {
    if (recommendations.length >= 3) {
      const totalCost = recommendations.reduce((sum, r) => sum + r.estimatedCost.min, 0)
      return Math.round(totalCost * 0.15) // 15% descuento por paquete
    }
    return 0
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

export function getRiskColor(level: string): string {
  switch (level) {
    case 'critico': return '#DC2626'
    case 'alto': return '#EA580C'
    case 'medio': return '#F59E0B'
    case 'bajo': return '#10B981'
    case 'optimo': return '#059669'
    default: return '#6B7280'
  }
}

export function getRiskLabel(level: string): string {
  switch (level) {
    case 'critico': return 'Riesgo Crítico'
    case 'alto': return 'Riesgo Alto'
    case 'medio': return 'Riesgo Medio'
    case 'bajo': return 'Riesgo Bajo'
    case 'optimo': return 'Protección Óptima'
    default: return 'Sin evaluar'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critica': return '#DC2626'
    case 'alta': return '#F59E0B'
    case 'media': return '#3B82F6'
    case 'baja': return '#10B981'
    default: return '#6B7280'
  }
}
