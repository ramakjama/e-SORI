import { LandingContent } from '@/lib/landing/types'

export const saludLanding: LandingContent = {
  config: {
    slug: 'seguro-salud',
    title: 'Seguro de Salud | Soriano Mediadores',
    description: 'Seguro médico privado con el mejor cuadro médico. Consultas sin esperas, pruebas diagnósticas y hospitalización.',
    keywords: ['seguro salud', 'seguro médico', 'seguro privado', 'cuadro médico'],
    insuranceType: 'SALUD',
    theme: 'salud',
    source: 'landing-seguro-salud',
    gamificationPoints: 250,
  },
  hero: {
    title: 'Cuida tu salud\\nsin esperas',
    subtitle: 'Accede al mejor cuadro médico con más de 40.000 profesionales. Consultas en 24-48h, sin listas de espera.',
    badge: 'Desde 35€/mes',
    ctaPrimary: { text: 'Ver mi precio', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Users', text: '+40.000', highlight: 'médicos' },
      { icon: 'Building2', text: '+1.000', highlight: 'clínicas' },
      { icon: 'Clock', text: 'Cita en', highlight: '24-48h' },
      { icon: 'Heart', text: 'Sin', highlight: 'copagos' },
    ],
  },
  coverages: {
    title: 'Elige tu nivel de protección',
    cards: [
      { id: 'esencial', name: 'Esencial', price: 'Desde 35€', period: 'mes', features: ['Medicina general', 'Urgencias 24h', 'Pruebas básicas', 'Especialistas principales'], popular: false },
      { id: 'completo', name: 'Completo', price: 'Desde 55€', period: 'mes', features: ['Todo lo anterior', 'Hospitalización', 'Cirugía', 'Rehabilitación', 'Salud mental'], popular: true },
      { id: 'premium', name: 'Premium', price: 'Desde 85€', period: 'mes', features: ['Cobertura total', 'Habitación individual', 'Segunda opinión médica', 'Cobertura internacional', 'Medicina preventiva'] },
    ],
  },
  benefits: {
    title: 'Ventajas de nuestro seguro de salud',
    items: [
      { icon: 'Clock', title: 'Sin esperas', description: 'Consulta con especialistas en 24-48 horas.' },
      { icon: 'CreditCard', title: 'Sin copagos', description: 'Precio cerrado, sin sorpresas ni pagos adicionales.' },
      { icon: 'Stethoscope', title: 'Cuadro médico amplio', description: 'Más de 40.000 profesionales y 1.000 centros.' },
      { icon: 'Smartphone', title: 'App de gestión', description: 'Pide cita, consulta resultados y videoconsulta.' },
    ],
  },
  stats: { items: [{ value: 40000, suffix: '+', label: 'Médicos' }, { value: 98, suffix: '%', label: 'Satisfacción' }, { value: 24, suffix: 'h', label: 'Cita máxima' }] },
  testimonials: {
    items: [{ id: '1', name: 'Ana Martínez', role: 'Cliente desde 2020', content: 'Contraté el seguro familiar y estamos encantados. Las citas son rapidísimas.', rating: 5, insuranceType: 'Completo' }],
  },
  faq: {
    items: [
      { question: '¿Hay periodo de carencia?', answer: 'Sí, las coberturas de hospitalización y cirugía tienen un periodo de carencia de 6 meses. Las consultas están disponibles desde el primer día.' },
      { question: '¿Puedo añadir a mi familia?', answer: 'Sí, ofrecemos descuentos por asegurar a toda la familia. Consulta nuestras tarifas familiares.' },
    ],
  },
  cta: {
    title: 'Tu salud no puede esperar',
    features: ['Sin listas de espera', 'Sin copagos', '+250 puntos Soriano Club'],
    formButtonText: 'Calcular mi precio',
    phone: '900 123 456',
  },
}
