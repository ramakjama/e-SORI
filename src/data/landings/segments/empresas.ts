import { LandingContent } from '@/lib/landing/types'

export const empresasLanding: LandingContent = {
  config: {
    slug: 'empresas',
    title: 'Seguros para Empresas y Pymes | Soriano Mediadores',
    description: 'Seguros empresariales a medida. RC, multirriesgo, flotas, salud colectiva y más. Protección integral para tu negocio.',
    keywords: ['seguros empresas', 'seguros pymes', 'seguro negocio', 'seguro flota', 'seguro colectivo'],
    insuranceType: 'GENERAL',
    theme: 'empresas',
    source: 'landing-empresas',
    gamificationPoints: 400,
  },
  hero: {
    title: 'Seguros a medida\npara tu empresa',
    subtitle: 'Soluciones integrales para pymes y empresas. RC, multirriesgo, flotas, convenio de salud y mucho más.',
    badge: 'Condiciones especiales',
    ctaPrimary: { text: 'Solicitar propuesta', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Building', text: 'Multirriesgo', highlight: 'empresa' },
      { icon: 'Truck', text: 'Flotas', highlight: 'vehículos' },
      { icon: 'Users', text: 'Salud', highlight: 'colectiva' },
      { icon: 'Shield', text: 'RC', highlight: 'completa' },
    ],
  },
  coverages: {
    title: 'Soluciones para empresas',
    cards: [
      {
        id: 'pyme',
        name: 'Pyme',
        price: 'Desde 150€',
        period: 'mes',
        features: ['Multirriesgo negocio', 'RC Explotación 300.000€', 'RC Patronal', 'Asistencia jurídica', '3-10 empleados'],
      },
      {
        id: 'empresa',
        name: 'Empresa',
        price: 'Desde 350€',
        period: 'mes',
        features: ['Multirriesgo ampliado', 'RC 600.000€', 'Flota hasta 10 vehículos', 'Convenio salud', 'Cyber riesgos', '10-50 empleados'],
        popular: true,
      },
      {
        id: 'corporativo',
        name: 'Corporativo',
        price: 'A medida',
        period: '',
        features: ['Programa personalizado', 'RC ilimitada', 'Flota sin límite', 'Salud premium', 'D&O', 'Risk manager dedicado'],
      },
    ],
  },
  benefits: {
    title: 'Protección integral para tu negocio',
    items: [
      { icon: 'Building', title: 'Multirriesgo', description: 'Daños al local, maquinaria, mercancías, robo y pérdida de beneficios.' },
      { icon: 'Users', title: 'RC Patronal', description: 'Cobertura ante accidentes laborales de tus empleados.' },
      { icon: 'Truck', title: 'Flotas', description: 'Todos tus vehículos en una póliza con gestión centralizada.' },
      { icon: 'Heart', title: 'Salud colectiva', description: 'Seguro de salud para empleados con condiciones especiales.' },
      { icon: 'Laptop', title: 'Cyber riesgos', description: 'Protección ante ciberataques, ransomware y brechas de datos.' },
      { icon: 'UserCheck', title: 'D&O', description: 'Responsabilidad de directivos y administradores.' },
    ],
  },
  stats: {
    items: [
      { value: 1200, suffix: '+', label: 'Empresas cliente' },
      { value: 15000, suffix: '+', label: 'Empleados cubiertos' },
      { value: 25, suffix: 'M€', label: 'Primas gestionadas' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Transportes García S.L.',
        role: 'Flota de 25 vehículos',
        content: 'Gestionar la flota con Soriano nos ha ahorrado tiempo y dinero. Muy profesionales.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Tech Solutions S.A.',
        role: 'Empresa IT, 80 empleados',
        content: 'El seguro de cyber riesgos y el convenio de salud son muy valorados por nuestro equipo.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Hacen auditorías de riesgos?', answer: 'Sí, para empresas medianas y grandes realizamos auditorías de riesgos sin coste.' },
      { question: '¿Tienen condiciones para convenios colectivos?', answer: 'Sí, ofrecemos condiciones especiales de salud a partir de 10 empleados.' },
      { question: '¿Gestionan siniestros de flotas?', answer: 'Sí, tenemos un departamento especializado en gestión de flotas y siniestros.' },
      { question: '¿Qué es el seguro D&O?', answer: 'Protege a directivos y administradores ante reclamaciones por decisiones empresariales.' },
    ],
  },
  cta: {
    title: 'Protege tu empresa',
    features: ['Análisis de riesgos gratuito', 'Propuesta personalizada', 'Gestor dedicado'],
    formButtonText: 'Solicitar propuesta',
    phone: '900 123 456',
  },
}
