import { LandingContent } from '@/lib/landing/types'

export const accidentesLanding: LandingContent = {
  config: {
    slug: 'seguro-accidentes',
    title: 'Seguro de Accidentes | Soriano Mediadores',
    description: 'Seguro de accidentes personales. Invalidez, fallecimiento y gastos médicos cubiertos. Desde 5€/mes.',
    keywords: ['seguro accidentes', 'seguro accidentes personales', 'indemnización accidente'],
    insuranceType: 'ACCIDENTES',
    theme: 'accidentes',
    source: 'landing-seguro-accidentes',
    gamificationPoints: 150,
  },
  hero: {
    title: 'Protección\nante imprevistos',
    subtitle: 'Seguro de accidentes que te protege 24h, en el trabajo, en casa o de viaje.',
    badge: 'Desde 5€/mes',
    ctaPrimary: { text: 'Ver coberturas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Shield', text: 'Cobertura', highlight: '24h' },
      { icon: 'Globe', text: 'Válido', highlight: 'mundial' },
      { icon: 'Heart', text: 'Gastos médicos', highlight: 'incluidos' },
      { icon: 'Users', text: 'Familiar', highlight: 'disponible' },
    ],
  },
  coverages: {
    title: 'Planes de protección',
    cards: [
      {
        id: 'esencial',
        name: 'Esencial',
        price: 'Desde 5€',
        period: 'mes',
        features: ['Fallecimiento 30.000€', 'Invalidez permanente 30.000€', 'Gastos médicos 3.000€', 'Cobertura 24h'],
      },
      {
        id: 'plus',
        name: 'Plus',
        price: 'Desde 12€',
        period: 'mes',
        features: ['Fallecimiento 60.000€', 'Invalidez permanente 60.000€', 'Gastos médicos 6.000€', 'Baja temporal 30€/día', 'Hospitalización 50€/día'],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Fallecimiento 150.000€', 'Invalidez permanente 150.000€', 'Gastos médicos 15.000€', 'Baja temporal 60€/día', 'Rehabilitación incluida'],
      },
    ],
  },
  benefits: {
    title: 'Coberturas del seguro de accidentes',
    items: [
      { icon: 'Heart', title: 'Fallecimiento', description: 'Capital garantizado para tus beneficiarios en caso de fallecimiento por accidente.' },
      { icon: 'Activity', title: 'Invalidez permanente', description: 'Indemnización según grado de invalidez resultante del accidente.' },
      { icon: 'Stethoscope', title: 'Gastos médicos', description: 'Cobertura de gastos de hospitalización, cirugía y tratamientos.' },
      { icon: 'Calendar', title: 'Baja temporal', description: 'Compensación diaria mientras estés de baja por accidente.' },
    ],
  },
  stats: {
    items: [
      { value: 18000, suffix: '+', label: 'Personas protegidas' },
      { value: 100, suffix: '%', label: 'Siniestros pagados' },
      { value: 15, suffix: 'días', label: 'Pago indemnización' },
    ],
  },
  faq: {
    items: [
      { question: '¿Qué se considera accidente?', answer: 'Cualquier lesión corporal derivada de una causa violenta, súbita, externa y ajena a la voluntad del asegurado.' },
      { question: '¿Cubre accidentes laborales?', answer: 'Sí, el seguro cubre accidentes las 24 horas, incluyendo los ocurridos durante el trabajo.' },
      { question: '¿Puedo asegurar a mi familia?', answer: 'Sí, ofrecemos pólizas familiares que cubren a todos los miembros del hogar.' },
      { question: '¿Hay límite de edad?', answer: 'Puedes contratar hasta los 70 años. La cobertura se mantiene hasta los 75 años.' },
    ],
  },
  cta: {
    title: 'Protégete ante accidentes',
    features: ['Sin reconocimiento médico', 'Efecto inmediato', 'Cobertura mundial'],
    formButtonText: 'Solicitar información',
    phone: '900 123 456',
  },
}
