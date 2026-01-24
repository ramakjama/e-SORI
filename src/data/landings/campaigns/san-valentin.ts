import { LandingContent } from '@/lib/landing/types'

export const sanValentinLanding: LandingContent = {
  config: {
    slug: 'san-valentin',
    title: 'San Valentín - Seguros en Pareja | Soriano Mediadores',
    description: 'Celebra San Valentín protegiendo a quien amas. Descuentos especiales para parejas en hogar, vida y salud.',
    keywords: ['san valentin seguros', 'seguro parejas', 'regalo san valentin', 'descuento pareja'],
    insuranceType: 'GENERAL',
    theme: 'san-valentin',
    source: 'landing-san-valentin',
    campaign: 'san-valentin-2025',
    gamificationPoints: 250,
  },
  hero: {
    title: 'Protege a quien\nmás quieres',
    subtitle: 'Este San Valentín, el mejor regalo: seguridad. Descuentos especiales para parejas.',
    badge: '2x1 en pareja',
    ctaPrimary: { text: 'Ver ofertas', scrollTo: 'cta-section' },
  },
  trustBar: {
    items: [
      { icon: 'Heart', text: 'Para', highlight: 'parejas' },
      { icon: 'Gift', text: 'Ofertas', highlight: '2x1' },
      { icon: 'Home', text: 'Hogar', highlight: 'compartido' },
      { icon: 'Users', text: 'Vida', highlight: 'cruzada' },
    ],
  },
  coverages: {
    title: 'Ofertas San Valentín',
    cards: [
      {
        id: 'primer-hogar',
        name: 'Nuestro Hogar',
        price: 'Desde 18€',
        period: 'mes',
        features: ['Hogar completo', 'RC ambos incluida', '2ª persona gratis', 'Asistencia 24h'],
      },
      {
        id: 'vida-juntos',
        name: 'Vida Cruzada',
        price: 'Desde 25€',
        period: 'mes',
        features: ['Seguro vida para 2', 'Beneficiario mutuo', 'Capital 100.000€ c/u', '2ª póliza 50% dto.', '💝 Cena romántica'],
        popular: true,
      },
      {
        id: 'salud-pareja',
        name: 'Salud en Pareja',
        price: 'Desde 80€',
        period: 'mes',
        features: ['Salud para ambos', 'Sin copagos', 'Dental incluido', '25% dto. pareja', '💝 Spa incluido'],
      },
    ],
  },
  benefits: {
    title: 'El mejor regalo',
    items: [
      { icon: 'Heart', title: 'Protección mutua', description: 'Os cuidáis el uno al otro con coberturas cruzadas.' },
      { icon: 'Percent', title: 'Descuento pareja', description: 'Hasta 50% descuento en la segunda persona.' },
      { icon: 'Gift', title: 'Regalo romántico', description: 'Cena o spa incluido con cada contratación.' },
      { icon: 'Calendar', title: 'Empieza el 14', description: 'Cobertura desde el Día de los Enamorados.' },
    ],
  },
  stats: {
    items: [
      { value: 50, suffix: '%', label: 'Descuento 2ª persona' },
      { value: 2800, suffix: '+', label: 'Parejas aseguradas' },
      { value: 14, suffix: 'Feb', label: 'Inicio cobertura' },
    ],
  },
  testimonials: {
    items: [
      {
        id: 'test-1',
        name: 'Ana y Luis',
        role: 'Pareja, Madrid',
        content: 'El año pasado nos regalamos el seguro de vida cruzada. El mejor regalo.',
        rating: 5,
      },
      {
        id: 'test-2',
        name: 'María y Carlos',
        role: 'Recién casados, Barcelona',
        content: 'Contratamos el pack hogar. La cena de regalo fue preciosa.',
        rating: 5,
      },
    ],
  },
  faq: {
    items: [
      { question: '¿Tenemos que estar casados?', answer: 'No, las ofertas aplican a cualquier pareja que conviva o no, casada o no.' },
      { question: '¿Qué es la vida cruzada?', answer: 'Dos seguros de vida donde cada uno es beneficiario del otro. Protección mutua.' },
      { question: '¿Cuándo recibimos el regalo?', answer: 'El bono de cena/spa lo recibes por email tras la contratación. Válido 6 meses.' },
      { question: '¿El descuento es solo para San Valentín?', answer: 'La oferta es válida del 1 al 28 de febrero. El descuento se mantiene en renovaciones.' },
    ],
  },
  cta: {
    title: 'Regala protección',
    features: ['Descuento pareja', 'Regalo incluido', 'Cobertura desde el 14'],
    formButtonText: 'Contratar ahora',
    phone: '900 123 456',
  },
}
