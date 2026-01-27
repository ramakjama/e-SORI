/**
 * MOTOR DE SEGMENTACION Y RECOMENDACION DE COBERTURAS
 *
 * Sistema avanzado que analiza el perfil del usuario y genera
 * recomendaciones personalizadas de seguros basadas en:
 * - Datos demográficos
 * - Situación laboral y financiera
 * - Patrimonio
 * - Estilo de vida
 * - Perfil de riesgo
 */

import type { InsuranceType, PolicyPriority } from '@prisma/client'

// ============================================
// TYPES
// ============================================

export interface UserSegmentData {
  // Demograficas
  age?: number
  maritalStatus?: string
  hasChildren: boolean
  numberOfChildren: number
  childrenAges?: number[]
  hasDependents: boolean

  // Laborales
  employmentStatus?: string
  monthlyIncome?: string
  hasSecondIncome: boolean

  // Patrimonio
  housingStatus?: string
  homeValue?: number
  hasMortgage: boolean
  mortgageAmount?: number
  mortgageMonthly?: number

  vehicleOwnership: string
  hasVehicle: boolean
  vehicleValue?: number
  vehicleType?: string

  // Financiero
  hasSavings: boolean
  savingsAmount?: number
  hasDebts: boolean
  totalDebts?: number
  monthlyExpenses?: number

  // Estilo de vida
  travelFrequency: number
  practicesSports: boolean
  sportsType?: string
  hasPets: boolean
  numberOfPets: number

  // Salud
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

// ============================================
// REGLAS DE NEGOCIO
// ============================================

/**
 * Calcula la prioridad de cada tipo de póliza según el perfil
 */
export class CoverageEngine {
  private segment: UserSegmentData
  private currentPolicies: CurrentPolicy[]

  constructor(segment: UserSegmentData, currentPolicies: CurrentPolicy[] = []) {
    this.segment = segment
    this.currentPolicies = currentPolicies
  }

  /**
   * Análisis completo de necesidades de cobertura
   */
  public analyze(): CoverageAnalysisResult {
    const recommendations: PolicyAnalysis[] = []

    // Analizar cada tipo de póliza
    recommendations.push(this.analyzeAuto())
    recommendations.push(this.analyzeHome())
    recommendations.push(this.analyzeHealth())
    recommendations.push(this.analyzeLife())
    recommendations.push(this.analyzeDecesos())
    recommendations.push(this.analyzePets())
    recommendations.push(this.analyzeTravel())
    recommendations.push(this.analyzeRC())

    // Filtrar solo las relevantes (prioridad > BAJA)
    const relevantRecommendations = recommendations.filter(
      r => r.priority !== 'NO_NECESARIA' && r.priority !== 'BAJA'
    )

    // Calcular estadísticas
    const totalEssential = relevantRecommendations.length
    const covered = relevantRecommendations.filter(r => r.isCurrentlyCovered).length
    const missing = totalEssential - covered
    const coveragePercentage = totalEssential > 0 ? Math.round((covered / totalEssential) * 100) : 100
    const gapPercentage = 100 - coveragePercentage

    // Determinar nivel de riesgo
    let riskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO' = 'BAJO'
    const criticalMissing = relevantRecommendations.filter(
      r => !r.isCurrentlyCovered && r.priority === 'CRITICA'
    ).length

    if (criticalMissing >= 2) riskLevel = 'CRITICO'
    else if (criticalMissing === 1) riskLevel = 'ALTO'
    else if (gapPercentage >= 50) riskLevel = 'ALTO'
    else if (gapPercentage >= 25) riskLevel = 'MEDIO'

    // Calcular score general (0-100)
    const overallScore = this.calculateOverallScore(relevantRecommendations)

    return {
      gapPercentage,
      coveragePercentage,
      totalEssentialPolicies: totalEssential,
      coveredPolicies: covered,
      missingPolicies: missing,
      riskLevel,
      recommendations: relevantRecommendations.sort((a, b) => b.priorityScore - a.priorityScore),
      overallScore
    }
  }

  // ============================================
  // ANALISIS POR TIPO DE POLIZA
  // ============================================

  private analyzeAuto(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'NO_NECESARIA'
    let mainReason = ''
    let riskDescription = ''
    let financialImpact = ''
    let legalImpact = ''

    const isCovered = this.isPolicyCovered('auto')

    if (!this.segment.hasVehicle || this.segment.vehicleOwnership === 'NINGUNO') {
      return {
        policyType: 'AUTO' as InsuranceType,
        priority: 'NO_NECESARIA',
        priorityScore: 0,
        isCurrentlyCovered: isCovered,
        mainReason: 'No tienes vehículo registrado',
        riskDescription: 'Sin vehículo, no necesitas seguro de auto',
        calculationFactors: ['no_vehicle']
      }
    }

    // FACTOR 1: Tener vehículo = OBLIGATORIO POR LEY
    priorityScore += 100
    priority = 'CRITICA'
    factors.push('tiene_vehiculo')
    mainReason = 'Tienes un vehículo registrado'
    riskDescription = 'Circular sin seguro es ILEGAL en España'
    legalImpact = 'Multas desde 3.000€ + inmovilización del vehículo + antecedentes'
    financialImpact = 'Responsabilidad civil ilimitada en caso de accidente'

    // FACTOR 2: Tipo de uso
    if (this.segment.employmentStatus === 'AUTONOMO') {
      priorityScore += 10
      factors.push('uso_profesional')
      riskDescription += '. Como autónomo, probablemente lo uses para trabajo'
    }

    // FACTOR 3: Valor del vehículo
    if (this.segment.vehicleValue && this.segment.vehicleValue > 15000) {
      priorityScore += 15
      factors.push('vehiculo_alto_valor')
      financialImpact += ` + pérdida potencial de ${this.segment.vehicleValue.toLocaleString()}€`
    }

    // FACTOR 4: Tiene hijos (más riesgo)
    if (this.segment.hasChildren) {
      priorityScore += 10
      factors.push('tiene_hijos')
    }

    return {
      policyType: 'AUTO' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact,
      legalImpact,
      recommendedCoverage: this.segment.vehicleValue && this.segment.vehicleValue > 15000
        ? 'Seguro a Todo Riesgo con franquicia'
        : 'Seguro a Terceros Ampliado',
      estimatedPremium: this.estimateAutoPremium(),
      calculationFactors: factors
    }
  }

  private analyzeHome(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'BAJA'
    let mainReason = ''
    let riskDescription = ''
    let financialImpact = ''
    let legalImpact = ''

    const isCovered = this.isPolicyCovered('hogar')

    // Si no tiene vivienda propia
    if (this.segment.housingStatus === 'ALQUILER') {
      priorityScore += 30
      priority = 'MEDIA'
      factors.push('alquiler')
      mainReason = 'Vives en una vivienda de alquiler'
      riskDescription = 'Los daños a la vivienda pueden hacerte responsable civilmente'
      financialImpact = 'Posibles reclamaciones del propietario por daños (hasta 50.000€)'
    } else if (this.segment.housingStatus === 'FAMILIAR') {
      priorityScore += 10
      priority = 'BAJA'
      factors.push('vivienda_familiar')
      mainReason = 'Vives en una vivienda familiar'
      riskDescription = 'Protección básica recomendada para contenido'
    } else if (this.segment.housingStatus?.includes('VIVIENDA_PROPIA')) {
      priorityScore += 60
      priority = 'ALTA'
      factors.push('vivienda_propia')
      mainReason = 'Tienes una vivienda en propiedad'
      riskDescription = 'Tu patrimonio principal está desprotegido'

      if (this.segment.homeValue) {
        financialImpact = `Valor de ${this.segment.homeValue.toLocaleString()}€ en riesgo`
        if (this.segment.homeValue > 200000) {
          priorityScore += 20
          factors.push('vivienda_alto_valor')
        }
      }
    }

    // FACTOR CRÍTICO: Hipoteca
    if (this.segment.hasMortgage) {
      priorityScore += 40
      priority = 'CRITICA'
      factors.push('tiene_hipoteca')
      riskDescription = 'La entidad bancaria EXIGE seguro de hogar con la hipoteca'

      if (this.segment.mortgageAmount) {
        financialImpact = `Hipoteca de ${this.segment.mortgageAmount.toLocaleString()}€ pendiente`
        if (this.segment.mortgageAmount > 150000) {
          priorityScore += 20
          factors.push('hipoteca_elevada')
        }
      }

      legalImpact = 'Incumplimiento de contrato hipotecario si no tienes seguro'
    }

    // FACTOR: Hijos (mayor riesgo de daños)
    if (this.segment.hasChildren && this.segment.numberOfChildren >= 2) {
      priorityScore += 10
      factors.push('familia_numerosa')
      riskDescription += '. Con niños, el riesgo de daños accidentales aumenta'
    }

    // FACTOR: Mascotas
    if (this.segment.hasPets) {
      priorityScore += 5
      factors.push('tiene_mascotas')
    }

    return {
      policyType: 'HOGAR' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact,
      legalImpact,
      recommendedCoverage: this.segment.hasMortgage
        ? 'Seguro Multirriesgo Hogar completo'
        : 'Seguro Contenido + RC',
      estimatedPremium: this.estimateHomePremium(),
      calculationFactors: factors
    }
  }

  private analyzeHealth(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'MEDIA'
    let mainReason = ''
    let riskDescription = ''
    let financialImpact = ''

    const isCovered = this.isPolicyCovered('salud') || this.segment.hasPrivateHealthcare

    // FACTOR CRÍTICO: Autónomos sin SS completa
    if (this.segment.employmentStatus === 'AUTONOMO') {
      priorityScore += 70
      priority = 'CRITICA'
      factors.push('autonomo')
      mainReason = 'Como autónomo, tu cobertura de Seguridad Social es limitada'
      riskDescription = 'Las bajas laborales por enfermedad afectan directamente a tus ingresos'
      financialImpact = 'Sin ingresos durante bajas médicas + tratamientos privados costosos'
    }

    // FACTOR: Hijos pequeños
    if (this.segment.hasChildren) {
      const hasYoungChildren = this.segment.childrenAges?.some(age => age < 12) || false
      if (hasYoungChildren) {
        priorityScore += 40
        if (priority !== 'CRITICA') priority = 'ALTA'
        factors.push('hijos_pequenos')
        mainReason = 'Tienes hijos pequeños que requieren atención médica frecuente'
        riskDescription = 'Los niños necesitan pediatras, urgencias y especialistas'
        financialImpact += ' + Visitas pediátricas privadas: 60-100€/consulta'
      } else {
        priorityScore += 20
        factors.push('tiene_hijos')
      }
    }

    // FACTOR: Edad (mayores de 45)
    if (this.segment.age && this.segment.age >= 45) {
      priorityScore += 30
      if (priority === 'MEDIA') priority = 'ALTA'
      factors.push('edad_45_plus')
      riskDescription += '. A partir de 45 años aumenta la necesidad de revisiones médicas'

      if (this.segment.age >= 55) {
        priorityScore += 20
        factors.push('edad_55_plus')
      }
    }

    // FACTOR: Condiciones de salud preexistentes
    if (this.segment.hasHealthConditions) {
      priorityScore += 35
      priority = 'ALTA'
      factors.push('condiciones_preexistentes')
      riskDescription = 'Tus condiciones de salud requieren seguimiento médico regular'
      financialImpact = 'Tratamientos especializados: 500-2.000€/mes sin seguro'
    }

    // FACTOR: Ingresos altos (pueden permitirse privada)
    const highIncome = ['ENTRE_5000_7000', 'MAS_7000'].includes(this.segment.monthlyIncome || '')
    if (highIncome) {
      priorityScore += 15
      factors.push('ingresos_altos')
    }

    // FACTOR: No tiene sanidad privada
    if (!this.segment.hasPrivateHealthcare) {
      priorityScore += 10
      factors.push('sin_sanidad_privada')
      if (!mainReason) {
        mainReason = 'Dependes exclusivamente de la sanidad pública'
      }
    } else {
      priorityScore -= 30 // Ya tiene
    }

    // FACTOR: Deportes de riesgo
    if (this.segment.practicesSports && this.segment.sportsType === 'ALTO_RIESGO') {
      priorityScore += 20
      factors.push('deportes_riesgo')
      riskDescription += '. Practicas deportes de riesgo con mayor probabilidad de lesiones'
    }

    if (priorityScore < 40) {
      priority = 'MEDIA'
    }

    if (!mainReason) {
      mainReason = 'Acceso rápido a especialistas y tratamientos sin listas de espera'
    }

    return {
      policyType: 'SALUD' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact: financialImpact || 'Tratamientos médicos privados: 500-5.000€ según especialidad',
      recommendedCoverage: this.segment.hasChildren
        ? 'Seguro Salud Familiar con copago bajo'
        : 'Seguro Salud Individual',
      estimatedPremium: this.estimateHealthPremium(),
      calculationFactors: factors
    }
  }

  private analyzeLife(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'BAJA'
    let mainReason = ''
    let riskDescription = ''
    let financialImpact = ''

    const isCovered = this.isPolicyCovered('vida')

    // FACTOR CRÍTICO: Hijos + Hipoteca
    if (this.segment.hasChildren && this.segment.hasMortgage) {
      priorityScore += 100
      priority = 'CRITICA'
      factors.push('hijos_hipoteca')
      mainReason = 'Tienes hijos y una hipoteca que pagar'
      riskDescription = 'En caso de fallecimiento, tu familia quedaría con la hipoteca y sin ingresos'

      if (this.segment.mortgageAmount) {
        financialImpact = `Hipoteca pendiente de ${this.segment.mortgageAmount.toLocaleString()}€ que heredaría tu familia`
      }
    }
    // FACTOR: Solo hijos (sin hipoteca)
    else if (this.segment.hasChildren) {
      priorityScore += 70
      priority = 'ALTA'
      factors.push('tiene_hijos')
      mainReason = 'Tienes hijos que dependen económicamente de ti'
      riskDescription = 'Tu familia necesitaría recursos para mantener su nivel de vida'

      const yearsToAdult = this.calculateYearsToAdultChildren()
      const monthlyNeeds = this.segment.monthlyExpenses || 2000
      financialImpact = `Aprox. ${(yearsToAdult * 12 * monthlyNeeds).toLocaleString()}€ para cubrir gastos hasta mayoría de edad`
    }
    // FACTOR: Solo hipoteca (sin hijos)
    else if (this.segment.hasMortgage) {
      priorityScore += 60
      priority = 'ALTA'
      factors.push('tiene_hipoteca')
      mainReason = 'Tienes una hipoteca que proteger'
      riskDescription = 'Tu familia o herederos tendrían que asumir la deuda hipotecaria'

      if (this.segment.mortgageAmount) {
        financialImpact = `Deuda hipotecaria de ${this.segment.mortgageAmount.toLocaleString()}€`
      }
    }
    // FACTOR: Casado/Pareja sin hijos ni hipoteca
    else if (['CASADO', 'PAREJA_DE_HECHO'].includes(this.segment.maritalStatus || '')) {
      priorityScore += 40
      priority = 'MEDIA'
      factors.push('en_pareja')
      mainReason = 'Vives en pareja y compartís gastos'
      riskDescription = 'Tu pareja necesitaría adaptarse económicamente a un solo ingreso'
      financialImpact = 'Pérdida del 50% de ingresos familiares'
    }

    // FACTOR: Único sustento familiar
    if (this.segment.hasChildren && !this.segment.hasSecondIncome) {
      priorityScore += 30
      factors.push('unico_sustento')
      riskDescription += '. Eres el único sustento económico de la familia'
    }

    // FACTOR: Dependientes mayores
    if (this.segment.hasDependents) {
      priorityScore += 25
      factors.push('dependientes_mayores')
      riskDescription += '. Tienes personas mayores a tu cargo'
    }

    // FACTOR: Edad
    if (this.segment.age && this.segment.age >= 45 && this.segment.age <= 60) {
      priorityScore += 15
      factors.push('edad_optima_contratacion')
      // Edad óptima para contratar antes de que suba mucho
    }

    // FACTOR: Autónomo (mayor riesgo de dejar negocio)
    if (this.segment.employmentStatus === 'AUTONOMO' && this.segment.hasChildren) {
      priorityScore += 20
      factors.push('autonomo_con_responsabilidades')
    }

    // Si es soltero sin hijos, sin hipoteca, sin dependientes
    if (
      priorityScore < 30 &&
      this.segment.maritalStatus === 'SOLTERO' &&
      !this.segment.hasChildren &&
      !this.segment.hasMortgage &&
      !this.segment.hasDependents
    ) {
      priority = 'BAJA'
      mainReason = 'No tienes responsabilidades económicas familiares'
      riskDescription = 'Sin dependientes económicos, el seguro de vida es menos prioritario'
      financialImpact = 'Opcional: cobertura para gastos de funeral y deudas personales'
    }

    return {
      policyType: 'VIDA' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact: financialImpact || 'Protección financiera para tu familia',
      recommendedCoverage: this.calculateLifeCoverageRecommendation(),
      estimatedPremium: this.estimateLifePremium(),
      calculationFactors: factors
    }
  }

  private analyzeDecesos(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'BAJA'
    let mainReason = ''
    let riskDescription = ''

    const isCovered = this.isPolicyCovered('decesos')

    // FACTOR: Edad mayor de 50
    if (this.segment.age && this.segment.age >= 50) {
      priorityScore += 50
      priority = 'ALTA'
      factors.push('edad_50_plus')
      mainReason = 'A partir de 50 años, el seguro de decesos es muy recomendable'
      riskDescription = 'Los gastos de funeral pueden alcanzar 5.000-8.000€'

      if (this.segment.age >= 60) {
        priorityScore += 30
        priority = 'ALTA'
        factors.push('edad_60_plus')
      }
      if (this.segment.age >= 70) {
        priorityScore += 20
        factors.push('edad_70_plus')
      }
    }

    // FACTOR: Tiene familia
    if (this.segment.hasChildren || this.segment.maritalStatus === 'CASADO') {
      priorityScore += 25
      factors.push('tiene_familia')
      riskDescription = 'Evita que tu familia tenga que asumir gastos inesperados de funeral'
    }

    // FACTOR: Sin ahorro de emergencia
    if (!this.segment.hasSavings || (this.segment.savingsAmount && this.segment.savingsAmount < 5000)) {
      priorityScore += 20
      if (priority === 'BAJA') priority = 'MEDIA'
      factors.push('sin_ahorro_emergencia')
      riskDescription += '. Sin ahorro de emergencia, estos gastos serían muy difíciles de asumir'
    }

    // FACTOR: Dependientes mayores
    if (this.segment.hasDependents) {
      priorityScore += 15
      factors.push('dependientes_mayores')
      mainReason = 'Tienes personas mayores a tu cargo que también necesitan protección'
    }

    if (!mainReason) {
      mainReason = 'Protección ante gastos inesperados de funeral y trámites'
    }

    return {
      policyType: 'DECESOS' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact: 'Gastos de funeral: 5.000-8.000€ + trámites administrativos',
      recommendedCoverage: 'Seguro de Decesos Familiar (incluye cónyuge e hijos)',
      estimatedPremium: this.estimateDecesosPremium(),
      calculationFactors: factors
    }
  }

  private analyzePets(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'NO_NECESARIA'
    let mainReason = ''
    let riskDescription = ''

    const isCovered = this.isPolicyCovered('mascotas')

    if (!this.segment.hasPets || this.segment.numberOfPets === 0) {
      return {
        policyType: 'MASCOTAS' as InsuranceType,
        priority: 'NO_NECESARIA',
        priorityScore: 0,
        isCurrentlyCovered: isCovered,
        mainReason: 'No tienes mascotas registradas',
        riskDescription: '',
        calculationFactors: ['no_pets']
      }
    }

    priorityScore += 40
    priority = 'MEDIA'
    factors.push('tiene_mascotas')
    mainReason = `Tienes ${this.segment.numberOfPets} mascota(s)`
    riskDescription = 'Las facturas veterinarias pueden ser muy elevadas'

    if (this.segment.numberOfPets >= 2) {
      priorityScore += 10
      factors.push('multiples_mascotas')
    }

    // Si vive en ciudad (más probabilidad de RC)
    if (this.segment.city) {
      priorityScore += 15
      factors.push('vive_ciudad')
      riskDescription += '. En ciudad, mayor riesgo de incidentes con terceros'
    }

    return {
      policyType: 'MASCOTAS' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact: 'Tratamientos veterinarios: 500-3.000€ según urgencia',
      recommendedCoverage: 'Seguro Salud Mascota + RC',
      estimatedPremium: 20 * this.segment.numberOfPets,
      calculationFactors: factors
    }
  }

  private analyzeTravel(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'BAJA'
    let mainReason = ''
    let riskDescription = ''

    const isCovered = this.isPolicyCovered('viaje')

    if (this.segment.travelFrequency === 0) {
      return {
        policyType: 'VIAJE' as InsuranceType,
        priority: 'NO_NECESARIA',
        priorityScore: 0,
        isCurrentlyCovered: isCovered,
        mainReason: 'No viajas frecuentemente al extranjero',
        riskDescription: '',
        calculationFactors: ['no_travel']
      }
    }

    if (this.segment.travelFrequency >= 3) {
      priorityScore += 60
      priority = 'ALTA'
      factors.push('viajero_frecuente')
      mainReason = `Viajas ${this.segment.travelFrequency} veces al año al extranjero`
      riskDescription = 'Los gastos médicos en el extranjero pueden arruinarte'

      if (this.segment.travelFrequency >= 5) {
        priorityScore += 20
        factors.push('viajero_muy_frecuente')
        riskDescription = 'Como viajero frecuente, necesitas seguro anual multiviaje'
      }
    } else {
      priorityScore += 30
      priority = 'MEDIA'
      factors.push('viajero_ocasional')
      mainReason = 'Viajas ocasionalmente al extranjero'
    }

    if (this.segment.hasChildren) {
      priorityScore += 15
      factors.push('viaja_con_hijos')
      riskDescription += '. Viajar con niños aumenta el riesgo de incidentes médicos'
    }

    return {
      policyType: 'VIAJE' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered,
      mainReason,
      riskDescription,
      financialImpact: 'Hospitalización en USA: 10.000-50.000€ sin seguro',
      recommendedCoverage: this.segment.travelFrequency >= 5
        ? 'Seguro Anual Multiviaje'
        : 'Seguro por Viaje',
      estimatedPremium: this.segment.travelFrequency >= 5 ? 150 : 50,
      calculationFactors: factors
    }
  }

  private analyzeRC(): PolicyAnalysis {
    const factors: string[] = []
    let priorityScore = 0
    let priority: PolicyPriority = 'BAJA'
    let mainReason = ''
    let riskDescription = ''

    const isCovered = this.isPolicyCovered('rc_profesional')

    // RC incluida en hogar normalmente
    const hasHomeInsurance = this.isPolicyCovered('hogar')
    if (hasHomeInsurance) {
      priorityScore -= 20
      factors.push('rc_incluida_hogar')
    }

    if (this.segment.hasChildren && this.segment.numberOfChildren >= 2) {
      priorityScore += 50
      priority = 'ALTA'
      factors.push('hijos_multiples')
      mainReason = 'Tienes varios hijos que pueden causar daños a terceros'
      riskDescription = 'Los niños pueden causar daños accidentales cuantiosos'
    } else if (this.segment.hasChildren) {
      priorityScore += 30
      priority = 'MEDIA'
      factors.push('tiene_hijos')
      mainReason = 'Tienes hijos menores'
    }

    if (this.segment.hasPets) {
      priorityScore += 20
      factors.push('tiene_mascotas')
      riskDescription = 'Las mascotas pueden causar daños o lesiones a terceros'
    }

    if (this.segment.practicesSports && this.segment.sportsType === 'ALTO_RIESGO') {
      priorityScore += 15
      factors.push('deportes_riesgo')
    }

    if (!mainReason) {
      mainReason = 'Protección ante reclamaciones de terceros'
    }

    return {
      policyType: 'RC_PROFESIONAL' as InsuranceType,
      priority,
      priorityScore,
      isCurrentlyCovered: isCovered || hasHomeInsurance,
      mainReason,
      riskDescription,
      financialImpact: 'Reclamaciones de terceros: 5.000-50.000€',
      recommendedCoverage: 'RC Familiar (normalmente incluida en Hogar)',
      estimatedPremium: hasHomeInsurance ? 0 : 50,
      calculationFactors: factors
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private isPolicyCovered(type: string): boolean {
    return this.currentPolicies.some(
      p => p.type.toLowerCase() === type.toLowerCase() && p.status === 'ACTIVA'
    )
  }

  private calculateYearsToAdultChildren(): number {
    if (!this.segment.childrenAges || this.segment.childrenAges.length === 0) {
      return 15 // Estimación por defecto
    }
    const youngestAge = Math.min(...this.segment.childrenAges)
    return Math.max(18 - youngestAge, 0)
  }

  private calculateLifeCoverageRecommendation(): string {
    let amount = 50000 // Base

    if (this.segment.hasMortgage && this.segment.mortgageAmount) {
      amount = this.segment.mortgageAmount
    }

    if (this.segment.hasChildren) {
      const yearsToAdult = this.calculateYearsToAdultChildren()
      const annualNeeds = (this.segment.monthlyExpenses || 2000) * 12
      amount += yearsToAdult * annualNeeds
    }

    return `Cobertura recomendada: ${amount.toLocaleString()}€`
  }

  private calculateOverallScore(recommendations: PolicyAnalysis[]): number {
    if (recommendations.length === 0) return 100

    const totalPossibleScore = recommendations.reduce((sum, r) => sum + 100, 0)
    const actualScore = recommendations.reduce((sum, r) => {
      if (r.isCurrentlyCovered) return sum + 100
      return sum + Math.max(0, 100 - r.priorityScore)
    }, 0)

    return Math.round((actualScore / totalPossibleScore) * 100)
  }

  // Estimaciones de prima (valores aproximados)
  private estimateAutoPremium(): number {
    const basePrice = 400
    let premium = basePrice

    if (this.segment.age && this.segment.age < 25) premium += 200
    if (this.segment.vehicleValue && this.segment.vehicleValue > 20000) premium += 150
    if (this.segment.hasChildren) premium += 50

    return Math.round(premium / 12) // Mensual
  }

  private estimateHomePremium(): number {
    const basePrice = 200
    let premium = basePrice

    if (this.segment.homeValue) {
      if (this.segment.homeValue > 300000) premium += 150
      else if (this.segment.homeValue > 200000) premium += 100
    }
    if (this.segment.hasMortgage) premium += 50

    return Math.round(premium / 12) // Mensual
  }

  private estimateHealthPremium(): number {
    const basePrice = 50 // Por persona
    let premium = basePrice

    if (this.segment.age && this.segment.age > 50) premium += 30
    if (this.segment.hasHealthConditions) premium += 20
    if (this.segment.hasChildren) premium += this.segment.numberOfChildren * 35

    return Math.round(premium)
  }

  private estimateLifePremium(): number {
    const basePrice = 20
    let premium = basePrice

    if (this.segment.age && this.segment.age > 45) premium += 15
    if (this.segment.hasMortgage) premium += 10
    if (this.segment.practicesSports && this.segment.sportsType === 'ALTO_RIESGO') premium += 20

    return Math.round(premium)
  }

  private estimateDecesosPremium(): number {
    const basePrice = 15
    let premium = basePrice

    if (this.segment.age && this.segment.age > 60) premium += 10
    if (this.segment.hasChildren) premium += 5

    return Math.round(premium)
  }
}
