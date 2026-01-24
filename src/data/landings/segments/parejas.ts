import { LandingContent } from '@/lib/landing/types'

export const parejasLanding: LandingContent = {
  config: {
    slug: 'parejas',
    title: 'Seguros para Parejas | Soriano Mediadores',
    description: 'Seguros para parejas y recién casados. Hogar y vida con descuentos especiales. Empieza tu vida juntos protegidos.',
    keywords: ['seguros parejas', 'seguro recien casados', 'seguro hogar pareja', 'seguro vida matrimonio'],
    insuranceType: 'GENERAL',
    theme: 'parejas',
    source: 'landing-parejas',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Vuestra nueva vida,\nbien protegida',
    subtitle: 'Seguros diseñados para parejas. Hogar, vida y salud con descuentos especiales por contratar juntos.',
    badge: '20% dto. parejas',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Home', text: 'Hogar', highlight: 'compartido' },
      { icon: 'Heart', text: 'Vida', highlight: 'cruzada' },
      { icon: 'Shield', text: 'Salud', highlight: 'para dos' },
      { icon: 'Percent', text: 'Descuento', highlight: 'pareja' },
    ],
  },
  coverages: {
    title: 'Packs para parejas',
    cards: [
      {
        id: 'primer-hogar',
        name: 'Primer Hogar',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Hogar completo', 'Continente y contenido', 'RC familiar', 'Asistencia 24h'],
      },
      {
        id: 'vida-juntos',
        name: 'Vida Juntos',
        price: 'Desde 45€',
        period: 'mes',
        features: ['Hogar todo riesgo', 'Vida cruzada 100.000€', '20% descuento pareja', 'Protección hipoteca'],
        popular: true,
      },
      {
        id: 'familia-futura',
        name: 'Familia Futura',
        price: 'Desde 85€',
        period: 'mes',
        features: ['Pack Vida Juntos', 'Salud para dos', 'Embarazo cubierto', 'Pediatría incluida'],
      },
    ],
  },
  benefits: {
    title: 'Ventajas de aseguraros juntos',
    items: [
      { icon: 'Percent', title: '20% descuento', description: 'Ahorro garantizado por contratar los seguros en pareja.' },
      { icon: 'Heart', title: 'Vida cruzada', description: 'Ambos sois beneficiarios del seguro de vida del otro.' },
      { icon: 'Home', title: 'Un solo hogar', description: 'Todos los bienes cubiertos bajo la misma póliza.' },
      { icon: 'Baby', title: 'Preparados para crecer', description: 'Fácil ampliación cuando lleguen los hijos.' },
    ],
  },
  stats: {
    items: [
      { value: 6500, suffix: '+', label: 'Parejas aseguradas' },
      { value: 20, suffix: '%', label: 'Descuento garantizado' },
      { value: 94, suffix: '%', label: 'Renovaciones' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Ana y Pedro',
        role: 'Recién casados, Barcelona',
        content: 'Contratamos todo junto: hogar, vida y salud. El ahorro es considerable.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'María y Juan',
        role: 'Pareja de hecho, Madrid',
        content: 'No hace falta estar casados para aprovechar los descuentos. Genial.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Hace falta estar casados?', answer: 'No, los descuentos aplican a parejas de hecho, convivientes o cualquier unidad de convivencia.' },
      { question: '¿Qué es el seguro de vida cruzada?', answer: 'Cada miembro de la pareja es beneficiario del seguro de vida del otro. Protección mutua.' },
      { question: '¿Podemos añadir hijos después?', answer: 'Sí, cuando lleguen hijos se amplía fácilmente la póliza manteniendo el descuento.' },
      { question: '¿Qué pasa si nos separamos?', answer: 'Cada uno puede mantener su parte del seguro individualmente o cancelar.' },
    ],
  },
  cta: {
    title: 'Empezad protegidos',
    features: ['Descuento inmediato', 'Un solo recibo', 'Gestión simplificada'],
    formButtonText: 'Calcular precio',
    phone: '900 123 456',
  },
}
