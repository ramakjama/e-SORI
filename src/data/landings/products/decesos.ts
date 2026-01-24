import { LandingContent } from '@/lib/landing/types'

export const decesosLanding: LandingContent = {
  config: {
    slug: 'seguro-decesos',
    title: 'Seguro de Decesos | Soriano Mediadores',
    description: 'Seguro de decesos familiar. Todos los gastos cubiertos y asistencia 24h. Desde 4€/mes por persona.',
    keywords: ['seguro decesos', 'seguro entierro', 'gastos funerarios'],
    insuranceType: 'DECESOS',
    theme: 'decesos',
    source: 'landing-seguro-decesos',
    gamificationPoints: 150,
  },
  hero: {
    title: 'Tranquilidad\\npara tu familia',
    subtitle: 'Un seguro de decesos que cubre todos los gastos y trámites. Para que tu familia no tenga que preocuparse de nada.',
    badge: 'Desde 4€/mes',
    ctaPrimary: { text: 'Ver coberturas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Shield', text: 'Gastos', highlight: 'cubiertos' },
      { icon: 'FileText', text: 'Trámites', highlight: 'incluidos' },
      { icon: 'Clock', text: 'Asistencia', highlight: '24h' },
      { icon: 'Users', text: 'Familiar', highlight: 'completo' },
    ],
  },
  coverages: {
    title: 'Coberturas del seguro',
    cards: [
      { id: 'individual', name: 'Individual', price: 'Desde 4€', period: 'mes', features: ['Servicios funerarios completos', 'Gestiones administrativas', 'Traslado nacional', 'Asistencia 24h'] },
      { id: 'familiar', name: 'Familiar', price: 'Desde 12€', period: 'mes', features: ['Hasta 6 personas', 'Todo lo individual', 'Traslado internacional', 'Asistencia jurídica', 'Capital adicional'], popular: true },
    ],
  },
  benefits: {
    title: 'Qué incluye el seguro',
    items: [
      { icon: 'FileText', title: 'Todos los trámites', description: 'Gestión de certificados, pensiones y herencias.' },
      { icon: 'Truck', title: 'Traslados', description: 'Nacional e internacional sin límite de kilómetros.' },
      { icon: 'Clock', title: 'Asistencia 24h', description: 'Teléfono de atención disponible las 24 horas.' },
      { icon: 'Users', title: 'Protección familiar', description: 'Cubre a toda la familia con una sola póliza.' },
    ],
  },
  stats: { items: [{ value: 8000, suffix: '+', label: 'Familias protegidas' }, { value: 100, suffix: '%', label: 'Gastos cubiertos' }] },
  faq: {
    items: [
      { question: '¿Tiene periodo de carencia?', answer: 'Solo para fallecimiento por enfermedad hay 6 meses de carencia. Por accidente está cubierto desde el primer día.' },
      { question: '¿Puedo incluir a toda mi familia?', answer: 'Sí, en la modalidad familiar puedes incluir hasta 6 personas: cónyuge, hijos y padres.' },
    ],
  },
  cta: {
    title: 'Protege a tu familia',
    features: ['Sin reconocimiento médico', 'Gastos 100% cubiertos', 'Asistencia 24h'],
    formButtonText: 'Solicitar información',
    phone: '900 123 456',
  },
}
