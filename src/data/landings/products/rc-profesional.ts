import { LandingContent } from '@/lib/landing/types'

export const rcProfesionalLanding: LandingContent = {
  config: {
    slug: 'seguro-rc-profesional',
    title: 'Seguro RC Profesional | Soriano Mediadores',
    description: 'Seguro de Responsabilidad Civil Profesional. Protege tu actividad ante reclamaciones. Desde 15€/mes.',
    keywords: ['seguro rc profesional', 'responsabilidad civil profesional', 'seguro profesional', 'seguro errores profesionales'],
    insuranceType: 'RC_PROFESIONAL',
    theme: 'rc-profesional',
    source: 'landing-seguro-rc-profesional',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Protege tu\nactividad profesional',
    subtitle: 'Seguro de Responsabilidad Civil Profesional para autónomos y empresas. Cubre errores, omisiones y reclamaciones.',
    badge: 'Desde 15€/mes',
    ctaPrimary: { text: 'Solicitar información', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Briefcase', text: 'Todas las', highlight: 'profesiones' },
      { icon: 'Shield', text: 'Errores', highlight: 'cubiertos' },
      { icon: 'Gavel', text: 'Defensa', highlight: 'jurídica' },
      { icon: 'FileText', text: 'Reclamaciones', highlight: 'gestionadas' },
    ],
  },
  coverages: {
    title: 'Coberturas RC Profesional',
    cards: [
      {
        id: 'autonomo',
        name: 'Autónomo',
        price: 'Desde 15€',
        period: 'mes',
        features: ['RC Profesional 150.000€', 'Defensa jurídica', 'Errores y omisiones', 'Pérdida de documentos'],
      },
      {
        id: 'profesional',
        name: 'Profesional',
        price: 'Desde 35€',
        period: 'mes',
        features: ['RC Profesional 300.000€', 'Todo lo de Autónomo', 'RC Explotación', 'Infidelidad empleados', 'Cyber riesgos básico'],
        popular: true,
      },
      {
        id: 'empresa',
        name: 'Empresa',
        price: 'Desde 75€',
        period: 'mes',
        features: ['RC Profesional 600.000€', 'Todo lo de Profesional', 'RC Patronal', 'Cyber riesgos completo', 'Cobertura retroactiva'],
      },
    ],
  },
  benefits: {
    title: 'Por qué necesitas RC Profesional',
    items: [
      { icon: 'AlertTriangle', title: 'Errores profesionales', description: 'Cobertura ante errores u omisiones en tu actividad profesional.' },
      { icon: 'FileText', title: 'Pérdida documentos', description: 'Indemnización si pierdes documentos de clientes bajo tu custodia.' },
      { icon: 'Gavel', title: 'Defensa jurídica', description: 'Abogados especializados para defenderte ante reclamaciones.' },
      { icon: 'Clock', title: 'Cobertura retroactiva', description: 'Cubre reclamaciones por trabajos realizados antes de contratar.' },
    ],
  },
  stats: {
    items: [
      { value: 5000, suffix: '+', label: 'Profesionales asegurados' },
      { value: 100, suffix: '+', label: 'Profesiones cubiertas' },
      { value: 98, suffix: '%', label: 'Reclamaciones resueltas' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Roberto Gómez',
        role: 'Arquitecto',
        content: 'Tuve una reclamación por un proyecto y el seguro se hizo cargo de todo. Imprescindible.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Elena Martín',
        role: 'Consultora IT',
        content: 'Como freelance necesitaba esta cobertura. Precio excelente y tranquilidad total.',
        rating: 5,
      },
      {
        id: 'test-3',
        name: 'Clínica Dental Sonrisa',
        role: '3 dentistas',
        content: 'El mejor seguro RC para nuestra clínica. Atención personalizada y muy profesional.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Qué profesiones cubren?', answer: 'Médicos, abogados, arquitectos, ingenieros, consultores, IT, asesores fiscales, inmobiliarias, y muchas más.' },
      { question: '¿Es obligatorio para autónomos?', answer: 'Depende de la profesión. Para algunas es obligatorio por ley (médicos, arquitectos). Para otras es muy recomendable.' },
      { question: '¿Cubre trabajos anteriores?', answer: 'Sí, la cobertura retroactiva cubre reclamaciones por trabajos realizados antes de contratar el seguro.' },
      { question: '¿Qué es la RC de explotación?', answer: 'Cubre daños a terceros en tu local o instalaciones, no relacionados con tu actividad profesional directa.' },
    ],
  },
  cta: {
    title: 'Protege tu profesión',
    features: ['Presupuesto personalizado', 'Coberturas a medida', 'Asesoramiento experto'],
    formButtonText: 'Solicitar información',
    phone: '900 123 456',
  },
}
