import { LandingContent } from '@/lib/landing/types'

export const vueltaColeLanding: LandingContent = {
  config: {
    slug: 'vuelta-cole',
    title: 'Vuelta al Cole - Seguros Escolares | Soriano Mediadores',
    description: 'Seguros para la vuelta al cole. Accidentes escolares, salud infantil y protección para toda la familia.',
    keywords: ['seguro escolar', 'seguro vuelta al cole', 'seguro accidentes niños', 'seguro salud infantil'],
    insuranceType: 'GENERAL',
    theme: 'vuelta-cole',
    source: 'landing-vuelta-cole',
    campaign: 'vuelta-cole-2025',
    gamificationPoints: 200,
  },
  hero: {
    title: 'Vuelta al cole\ncon tranquilidad',
    subtitle: 'Seguros pensados para el nuevo curso. Accidentes, salud y protección escolar para tus hijos.',
    badge: 'Pack escolar',
    ctaPrimary: { text: 'Ver packs', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'BookOpen', text: 'Seguro', highlight: 'escolar' },
      { icon: 'Activity', text: 'Accidentes', highlight: 'cubiertos' },
      { icon: 'Heart', text: 'Salud', highlight: 'infantil' },
      { icon: 'Shield', text: 'Protección', highlight: '24h' },
    ],
  },
  coverages: {
    title: 'Seguros para el cole',
    cards: [
      {
        id: 'accidentes-escolar',
        name: 'Accidentes Escolar',
        price: 'Desde 3€',
        period: 'mes',
        features: ['Accidentes en el cole', 'Actividades extraescolares', 'Excursiones', 'Gastos médicos 5.000€'],
      },
      {
        id: 'pack-escolar',
        name: 'Pack Escolar',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Accidentes completo', 'Salud infantil', 'Dental niños', 'Pediatría 24h', '🎒 Material escolar gratis'],
        popular: true,
      },
      {
        id: 'salud-familia',
        name: 'Salud Familia',
        price: 'Desde 120€',
        period: 'mes',
        features: ['Toda la familia', 'Sin copagos', 'Embarazo cubierto', 'Pediatría ilimitada', '20% dto. septiembre'],
      },
    ],
  },
  benefits: {
    title: 'Tranquilidad para los padres',
    items: [
      { icon: 'BookOpen', title: 'Cobertura escolar', description: 'Protección durante clases, recreos y extraescolares.' },
      { icon: 'Bus', title: 'Transporte incluido', description: 'Accidentes en el autobús escolar cubiertos.' },
      { icon: 'MapPin', title: 'Excursiones', description: 'Todas las salidas y viajes del colegio protegidos.' },
      { icon: 'Clock', title: 'Pediatra 24h', description: 'Consulta telefónica con pediatra cualquier hora.' },
    ],
  },
  stats: {
    items: [
      { value: 25000, suffix: '+', label: 'Niños asegurados' },
      { value: 99, suffix: '%', label: 'Colegios aceptados' },
      { value: 24, suffix: 'h', label: 'Pediatra disponible' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Elena R.',
        role: 'Madre de 2 niños',
        content: 'Mi hijo se rompió el brazo en el recreo. El seguro cubrió todo, incluso la rehabilitación.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'Javier M.',
        role: 'Padre, Valencia',
        content: 'El pediatra 24h es genial. Cuando mi hija tuvo fiebre de madrugada, nos atendieron al momento.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Cubre actividades extraescolares?', answer: 'Sí, todas las extraescolares organizadas por el colegio o contratadas aparte.' },
      { question: '¿Qué pasa durante las vacaciones?', answer: 'El seguro es anual, cubre todo el año incluyendo vacaciones escolares.' },
      { question: '¿Hasta qué edad están cubiertos?', answer: 'Hasta los 25 años si siguen estudiando, o 18 en cualquier caso.' },
      { question: '¿El material escolar es real?', answer: 'Sí, recibes un cheque de 50€ para gastar en material en tiendas asociadas.' },
    ],
  },
  cta: {
    title: 'Protege su educación',
    features: ['Pack desde 3€/mes', 'Material escolar gratis', 'Cobertura completa'],
    formButtonText: 'Contratar ahora',
    phone: '900 123 456',
  },
}
