import { LandingContent } from '@/lib/landing/types'

export const autonomosLanding: LandingContent = {
  config: {
    slug: 'autonomos',
    title: 'Seguros para Autónomos | Soriano Mediadores',
    description: 'Seguros diseñados para autónomos y freelancers. RC Profesional, accidentes, salud y más. Desde 25€/mes.',
    keywords: ['seguros autonomos', 'seguro freelance', 'rc profesional autonomo', 'seguro trabajador autonomo'],
    insuranceType: 'GENERAL',
    theme: 'autonomos',
    source: 'landing-autonomos',
    gamificationPoints: 250,
  },
  hero: {
    title: 'Seguros pensados\npara autónomos',
    subtitle: 'Protección profesional y personal. RC, accidentes, salud y baja laboral diseñados para tu realidad.',
    badge: 'Desde 25€/mes',
    ctaPrimary: { text: 'Ver seguros', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Briefcase', text: 'RC', highlight: 'Profesional' },
      { icon: 'Activity', text: 'Accidentes', highlight: 'cubiertos' },
      { icon: 'Heart', text: 'Salud', highlight: 'privada' },
      { icon: 'Calendar', text: 'Baja', highlight: 'compensada' },
    ],
  },
  coverages: {
    title: 'Seguros para tu actividad',
    cards: [
      {
        id: 'basico',
        name: 'Básico',
        price: 'Desde 25€',
        period: 'mes',
        features: ['RC Profesional 150.000€', 'Accidentes 30.000€', 'Defensa jurídica', 'Asesoría fiscal básica'],
      },
      {
        id: 'profesional',
        name: 'Profesional',
        price: 'Desde 55€',
        period: 'mes',
        features: ['RC Profesional 300.000€', 'Accidentes 60.000€', 'Baja laboral 40€/día', 'Salud cuadro médico', 'Cyber riesgos'],
        popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 'Desde 95€',
        period: 'mes',
        features: ['RC Profesional 600.000€', 'Accidentes 100.000€', 'Baja laboral 60€/día', 'Salud reembolso', 'Gestor personal'],
      },
    ],
  },
  benefits: {
    title: 'Protección adaptada a tu trabajo',
    items: [
      { icon: 'Shield', title: 'RC Profesional', description: 'Cobertura ante errores, omisiones y reclamaciones de clientes.' },
      { icon: 'Calendar', title: 'Baja laboral', description: 'Compensación diaria si no puedes trabajar por enfermedad o accidente.' },
      { icon: 'Stethoscope', title: 'Salud privada', description: 'Acceso a especialistas sin esperas. Cuadro médico o reembolso.' },
      { icon: 'Laptop', title: 'Cyber riesgos', description: 'Protección ante hackeos, ransomware y pérdida de datos.' },
    ],
  },
  stats: {
    items: [
      { value: 8500, suffix: '+', label: 'Autónomos asegurados' },
      { value: 100, suffix: '+', label: 'Profesiones cubiertas' },
      { value: 95, suffix: '%', label: 'Satisfacción' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Carlos Ruiz',
        role: 'Diseñador freelance',
        content: 'La baja laboral me salvó cuando estuve 2 meses sin poder trabajar. Muy recomendable.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Laura Fernández',
        role: 'Consultora',
        content: 'El pack profesional es perfecto. RC, salud y accidentes por un precio razonable.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Miguel Ángel Torres',
        role: 'Programador',
        content: 'Me hackearon y el seguro de cyber riesgos cubrió la recuperación de datos.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Es obligatoria la RC para autónomos?', answer: 'Depende de tu actividad. Para algunas profesiones es obligatorio (sanitarios, abogados, arquitectos).' },
      { question: '¿Cubre la baja por COVID?', answer: 'Sí, la baja por enfermedad incluye COVID-19 con las mismas condiciones que otras enfermedades.' },
      { question: '¿Puedo deducir el seguro?', answer: 'Sí, los seguros de RC, accidentes y salud son gastos deducibles en tu actividad.' },
      { question: '¿Hay carencia en el seguro de salud?', answer: 'Solo para ciertas intervenciones programadas. Urgencias y consultas desde el primer día.' },
    ],
  },
  cta: {
    title: 'Protege tu actividad',
    features: ['Asesoramiento gratuito', 'Seguros deducibles', 'Sin permanencia'],
    formButtonText: 'Solicitar información',
    phone: '900 123 456',
  },
}
