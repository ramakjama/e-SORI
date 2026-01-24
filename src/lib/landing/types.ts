// ========================================
// TIPOS PARA SISTEMA DE LANDING PAGES
// ========================================

import { LucideIcon } from 'lucide-react'

// Insurance types matching Prisma enum
export type InsuranceType =
  | 'AUTO' | 'HOGAR' | 'SALUD' | 'VIDA' | 'DECESOS' | 'MASCOTAS'
  | 'COMERCIO' | 'COMUNIDADES' | 'VIAJE' | 'MOTO' | 'ACCIDENTES'
  | 'RC_PROFESIONAL' | 'GENERAL'

// Theme types for different landing categories
export type LandingThemeType =
  // Productos
  | 'auto' | 'hogar' | 'salud' | 'vida' | 'decesos' | 'mascotas'
  | 'comercio' | 'comunidades' | 'viaje' | 'moto' | 'accidentes' | 'rc-profesional'
  // Segmentos
  | 'familias' | 'autonomos' | 'empresas' | 'jovenes' | 'mayores-65' | 'parejas'
  | 'nuevos-conductores' | 'extranjeros'
  // Campañas
  | 'black-friday' | 'cyber-monday' | 'navidad' | 'ano-nuevo' | 'san-valentin'
  | 'primavera' | 'verano' | 'vuelta-cole' | 'halloween' | 'dia-padre'
  // General
  | 'general'

// ========================================
// THEME CONFIGURATION
// ========================================

export interface LandingTheme {
  id: LandingThemeType
  name: string
  primaryColor: string
  secondaryColor: string
  gradient: string
  gradientDark: string
  icon: string // Lucide icon name
  emoji: string
  particleEffect?: 'confetti' | 'snow' | 'hearts' | 'stars' | 'none'
}

// ========================================
// LANDING PAGE CONFIGURATION
// ========================================

export interface LandingConfig {
  slug: string
  title: string
  description: string
  keywords: string[]
  insuranceType: InsuranceType
  theme: LandingThemeType
  source: string
  campaign?: string
  gamificationPoints: number
  showCountdown?: boolean
  countdownDate?: string
  showPricing?: boolean
}

// ========================================
// HERO SECTION
// ========================================

export interface HeroConfig {
  title: string
  subtitle: string
  badge?: string
  image?: string
  video?: string
  ctaPrimary: {
    text: string
    href?: string
    scrollTo?: string
  }
  ctaSecondary?: {
    text: string
    href: string
  }
  showParticles?: boolean
  darkMode?: boolean
}

// ========================================
// TRUST BAR
// ========================================

export interface TrustItem {
  icon: string
  text: string
  highlight?: string
}

export interface TrustBarConfig {
  items: TrustItem[]
  variant?: 'horizontal' | 'grid'
}

// ========================================
// COVERAGE/PRICING CARDS
// ========================================

export interface CoverageFeature {
  text: string
  included: boolean
}

export interface CoverageCard {
  id: string
  name: string
  price: string
  period?: string
  description?: string
  features: (string | CoverageFeature)[]
  popular?: boolean
  badge?: string
  ctaText?: string
  ctaHref?: string
}

export interface CoveragesConfig {
  title?: string
  subtitle?: string
  cards: CoverageCard[]
  columns?: 2 | 3 | 4
}

// ========================================
// BENEFITS/FEATURES GRID
// ========================================

export interface BenefitItem {
  icon: string
  title: string
  description: string
  color?: string
}

export interface BenefitsConfig {
  title?: string
  subtitle?: string
  items: BenefitItem[]
  columns?: 2 | 3 | 4
}

// ========================================
// STATS SECTION
// ========================================

export interface StatItem {
  value: number
  prefix?: string
  suffix?: string
  label: string
  description?: string
}

export interface StatsConfig {
  title?: string
  items: StatItem[]
  variant?: 'default' | 'cards' | 'inline'
}

// ========================================
// TESTIMONIALS
// ========================================

export interface Testimonial {
  id: string
  name: string
  role: string
  image?: string
  content: string
  rating: 1 | 2 | 3 | 4 | 5
  insuranceType?: string
}

export interface TestimonialsConfig {
  title?: string
  subtitle?: string
  items: Testimonial[]
  autoPlay?: boolean
}

// ========================================
// FAQ SECTION
// ========================================

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQConfig {
  title?: string
  subtitle?: string
  items: FAQItem[]
}

// ========================================
// CTA SECTION
// ========================================

export interface CTAConfig {
  title: string
  subtitle?: string
  features?: string[]
  showForm?: boolean
  formTitle?: string
  formSubtitle?: string
  formButtonText?: string
  phone?: string
  showPhone?: boolean
}

// ========================================
// COMPLETE LANDING CONTENT
// ========================================

export interface LandingContent {
  config: LandingConfig
  hero: HeroConfig
  trustBar?: TrustBarConfig
  coverages?: CoveragesConfig
  benefits?: BenefitsConfig
  stats?: StatsConfig
  testimonials?: TestimonialsConfig
  faq?: FAQConfig
  cta: CTAConfig
}

// ========================================
// SECTIONS TO SHOW
// ========================================

export interface LandingSections {
  hero: boolean
  trustBar: boolean
  coverages: boolean
  benefits: boolean
  stats: boolean
  testimonials: boolean
  faq: boolean
  cta: boolean
}

export const DEFAULT_SECTIONS: LandingSections = {
  hero: true,
  trustBar: true,
  coverages: true,
  benefits: true,
  stats: true,
  testimonials: true,
  faq: true,
  cta: true,
}
