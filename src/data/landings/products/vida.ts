import { LandingContent } from '@/lib/landing/types'

export const vidaLanding: LandingContent = {
  config: {
    slug: 'seguro-vida',
    title: 'Seguro de Vida | Soriano Mediadores',
    description: 'Seguro de vida para proteger a tu familia. Capital desde 50.000€. Contratación sencilla y sin reconocimiento médico.',
    keywords: ['seguro vida', 'seguro fallecimiento', 'protección familiar'],
    insuranceType: 'VIDA',
    theme: 'vida',
    source: 'landing-seguro-vida',
    gamificationPoints: 300,
  },
  hero: {
    title: 'Protege el futuro\\nde tu familia',
    subtitle: 'Un seguro de vida que garantiza la tranquilidad económica de los tuyos. Desde 5€/mes y sin reconocimiento médico.',
    badge: 'Desde 5€/mes',
    ctaPrimary: { text: 'Calcular capital', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Shield', text: 'Capital hasta', highlight: '500.000€' },
      { icon: 'FileText', text: 'Sin', highlight: 'reconocimiento' },
      { icon: 'Percent', text: 'Desgravación', highlight: 'fiscal' },
      { icon: 'Heart', text: 'Hasta', highlight: '70 años' },
    ],
  },
  coverages: {
    title: 'Niveles de protección',
    cards: [
      { id: 'basico', name: 'Básico', price: 'Desde 5€', period: 'mes', features: ['Capital 50.000€', 'Fallecimiento', 'Invalidez absoluta'], popular: false },
      { id: 'familiar', name: 'Familiar', price: 'Desde 15€', period: 'mes', features: ['Capital 150.000€', 'Fallecimiento', 'Invalidez', 'Enfermedades graves', 'Doble capital por accidente'], popular: true },
      { id: 'premium', name: 'Premium', price: 'Desde 30€', period: 'mes', features: ['Capital 300.000€', 'Todo lo anterior', 'Anticipo por enfermedad terminal', 'Asistencia familiar', 'Orientación jurídica'] },
    ],
  },
  benefits: {
    title: '¿Por qué contratar un seguro de vida?',
    items: [
      { icon: 'Home', title: 'Protege tu hipoteca', description: 'Garantiza que tu familia no perderá la casa.' },
      { icon: 'Users', title: 'Seguridad familiar', description: 'Ingresos garantizados para los tuyos.' },
      { icon: 'Percent', title: 'Beneficio fiscal', description: 'Desgrava hasta 500€/año en la renta.' },
      { icon: 'FileText', title: 'Sin reconocimiento', description: 'Contratación sencilla hasta 150.000€.' },
    ],
  },
  stats: { items: [{ value: 12000, suffix: '+', label: 'Familias protegidas' }, { value: 100, suffix: 'M€', label: 'Capital asegurado' }] },
  testimonials: {
    items: [{ id: '1', name: 'Roberto García', role: 'Cliente desde 2019', content: 'Contraté el seguro al tener hijos. Es muy económico y me da tranquilidad saber que estarán protegidos.', rating: 5 }],
  },
  faq: {
    items: [
      { question: '¿Cuánto capital debo asegurar?', answer: 'Recomendamos asegurar entre 5 y 10 veces tu salario anual, para cubrir al menos 5 años de ingresos familiares.' },
      { question: '¿Necesito reconocimiento médico?', answer: 'Para capitales hasta 150.000€ no es necesario. Solo un cuestionario de salud básico.' },
    ],
  },
  cta: {
    title: 'Protege a quienes más quieres',
    features: ['Contratación en 5 minutos', 'Sin reconocimiento médico', 'Desgravación fiscal', '+300 puntos Soriano Club'],
    formButtonText: 'Calcular mi seguro',
    phone: '900 123 456',
  },
}
