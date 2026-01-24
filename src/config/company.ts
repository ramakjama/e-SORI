/**
 * Configuración de la empresa - Soriano Mediadores de Seguros S.L.
 *
 * IMPORTANTE: Actualiza estos datos con la información real de la empresa
 */

export const companyConfig = {
  // ========================================
  // DATOS LEGALES
  // ========================================
  legal: {
    name: 'Soriano Mediadores de Seguros S.L.',
    shortName: 'Soriano Mediadores',
    brandName: 'e-SORI',
    cif: 'B-XXXXXXXX', // TODO: Añadir CIF real
    registroMercantil: 'Registro Mercantil de Alicante, Tomo XXXX, Folio XXX, Hoja A-XXXXX',
    registroDGS: 'J-XXXX', // Número de registro en la DGSFP
    fechaConstitucion: '1985-01-01',
  },

  // ========================================
  // CONTACTO
  // ========================================
  contact: {
    phone: {
      main: '966 810 290',
      mobile: '600 000 000', // TODO: Añadir móvil real
      whatsapp: '34600000000', // TODO: Formato internacional sin +
      freephone: '900 123 456', // TODO: Si hay línea gratuita
    },
    email: {
      main: 'info@sorianomediadores.es',
      claims: 'siniestros@sorianomediadores.es',
      commercial: 'comercial@sorianomediadores.es',
      support: 'soporte@sorianomediadores.es',
    },
    address: {
      street: 'Calle Principal, 123', // TODO: Dirección real
      city: 'Villajoyosa',
      province: 'Alicante',
      postalCode: '03570',
      country: 'España',
      coordinates: {
        lat: 38.5077,
        lng: -0.2339,
      },
    },
    schedule: {
      weekdays: '09:00 - 14:00 y 16:00 - 19:00',
      saturday: 'Cerrado',
      sunday: 'Cerrado',
      holidays: 'Cerrado',
    },
  },

  // ========================================
  // REDES SOCIALES
  // ========================================
  social: {
    facebook: 'https://facebook.com/sorianomediadores', // TODO: URL real
    instagram: 'https://instagram.com/sorianomediadores',
    linkedin: 'https://linkedin.com/company/sorianomediadores',
    twitter: 'https://twitter.com/sorianomediador',
    youtube: '',
    tiktok: '',
  },

  // ========================================
  // DATOS DE NEGOCIO
  // ========================================
  business: {
    yearsExperience: new Date().getFullYear() - 1985,
    clientsCount: 50000,
    employeesCount: 15,
    policiesManaged: 75000,
    claimsResolved: 25000,
    satisfactionRate: 98,
    responseTime: '24h',
    partnersCount: 25,
  },

  // ========================================
  // ASEGURADORAS PARTNER
  // ========================================
  insurancePartners: [
    {
      id: 'occident',
      name: 'Occident',
      fullName: 'Grupo Catalana Occidente',
      logo: '/assets/logos/partners/occident.png',
      website: 'https://www.occident.com',
      isPrimary: true,
      products: ['auto', 'hogar', 'vida', 'salud', 'decesos', 'comercio'],
    },
    {
      id: 'axa',
      name: 'AXA',
      fullName: 'AXA Seguros',
      logo: '/assets/logos/partners/axa.png',
      website: 'https://www.axa.es',
      isPrimary: false,
      products: ['auto', 'hogar', 'salud'],
    },
    {
      id: 'mapfre',
      name: 'Mapfre',
      fullName: 'Mapfre Seguros',
      logo: '/assets/logos/partners/mapfre.png',
      website: 'https://www.mapfre.es',
      isPrimary: false,
      products: ['auto', 'hogar', 'vida'],
    },
    {
      id: 'allianz',
      name: 'Allianz',
      fullName: 'Allianz Seguros',
      logo: '/assets/logos/partners/allianz.png',
      website: 'https://www.allianz.es',
      isPrimary: false,
      products: ['auto', 'hogar', 'vida', 'salud'],
    },
    {
      id: 'generali',
      name: 'Generali',
      fullName: 'Generali Seguros',
      logo: '/assets/logos/partners/generali.png',
      website: 'https://www.generali.es',
      isPrimary: false,
      products: ['auto', 'hogar', 'vida'],
    },
    {
      id: 'santalucia',
      name: 'Santa Lucía',
      fullName: 'Santa Lucía Seguros',
      logo: '/assets/logos/partners/santalucia.png',
      website: 'https://www.santalucia.es',
      isPrimary: false,
      products: ['decesos', 'hogar', 'vida'],
    },
    {
      id: 'dkv',
      name: 'DKV',
      fullName: 'DKV Seguros',
      logo: '/assets/logos/partners/dkv.png',
      website: 'https://www.dkvseguros.com',
      isPrimary: false,
      products: ['salud'],
    },
    {
      id: 'asisa',
      name: 'Asisa',
      fullName: 'Asisa Seguros',
      logo: '/assets/logos/partners/asisa.png',
      website: 'https://www.asisa.es',
      isPrimary: false,
      products: ['salud'],
    },
  ],

  // ========================================
  // EQUIPO
  // ========================================
  team: [
    {
      id: 'director',
      name: 'Juan Soriano', // TODO: Nombre real
      role: 'Director General',
      image: '/assets/images/team/director.jpg',
      email: 'jsoriano@sorianomediadores.es',
      phone: '966 810 290',
      linkedin: '',
    },
    {
      id: 'comercial',
      name: 'María García', // TODO: Nombre real
      role: 'Directora Comercial',
      image: '/assets/images/team/comercial.jpg',
      email: 'mgarcia@sorianomediadores.es',
      phone: '966 810 290',
    },
    {
      id: 'siniestros',
      name: 'Pedro López', // TODO: Nombre real
      role: 'Responsable de Siniestros',
      image: '/assets/images/team/siniestros.jpg',
      email: 'plopez@sorianomediadores.es',
      phone: '966 810 290',
    },
  ],

  // ========================================
  // OFICINAS
  // ========================================
  offices: [
    {
      id: 'villajoyosa',
      name: 'Oficina Central Villajoyosa',
      isPrimary: true,
      address: {
        street: 'Calle Principal, 123', // TODO: Dirección real
        city: 'Villajoyosa',
        province: 'Alicante',
        postalCode: '03570',
      },
      phone: '966 810 290',
      email: 'villajoyosa@sorianomediadores.es',
      coordinates: { lat: 38.5077, lng: -0.2339 },
      image: '/assets/images/office/villajoyosa.jpg',
    },
    // TODO: Añadir más oficinas si existen
  ],

  // ========================================
  // CERTIFICACIONES Y PREMIOS
  // ========================================
  certifications: [
    {
      id: 'dgs',
      name: 'Registro DGSFP',
      description: 'Inscrita en el Registro de la Dirección General de Seguros y Fondos de Pensiones',
      icon: 'Shield',
    },
    {
      id: 'lopd',
      name: 'RGPD Compliance',
      description: 'Cumplimiento del Reglamento General de Protección de Datos',
      icon: 'Lock',
    },
    {
      id: 'mediador',
      name: 'Mediador de Seguros',
      description: 'Operador de Banca-Seguros vinculado',
      icon: 'Award',
    },
  ],

  // ========================================
  // SEO Y METADATOS
  // ========================================
  seo: {
    defaultTitle: 'Soriano Mediadores | Seguros en la Costa Blanca',
    titleTemplate: '%s | Soriano Mediadores',
    description: 'Tu correduría de seguros de confianza en Villajoyosa y Costa Blanca. Auto, hogar, salud, vida y más. Asesoramiento personalizado desde 1985.',
    keywords: [
      'seguros villajoyosa',
      'correduría seguros alicante',
      'seguros costa blanca',
      'soriano mediadores',
      'seguro coche villajoyosa',
      'seguro hogar alicante',
      'seguro salud costa blanca',
    ],
    ogImage: '/assets/images/og-image.jpg',
  },
}

// Tipos TypeScript
export type CompanyConfig = typeof companyConfig
export type InsurancePartner = typeof companyConfig.insurancePartners[number]
export type TeamMember = typeof companyConfig.team[number]
export type Office = typeof companyConfig.offices[number]
