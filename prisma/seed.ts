import { PrismaClient, UserRole, UserLevel, PolicyType, PolicyStatus, ClaimStatus, DocumentType, PaymentStatus, PointsAction, ReferralStatus, ChatMessageRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.chatMessage.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.referral.deleteMany()
  await prisma.userBadge.deleteMany()
  await prisma.pointsHistory.deleteMany()
  await prisma.badge.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.document.deleteMany()
  await prisma.claimTimeline.deleteMany()
  await prisma.claim.deleteMany()
  await prisma.policy.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Datos anteriores eliminados')

  // ========================================
  // CREAR BADGES DEL SISTEMA
  // ========================================
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        code: 'FIRST_LOGIN',
        name: 'Primer Acceso',
        description: 'Has iniciado sesión por primera vez',
        icon: '🎉',
        color: 'blue',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'PROFILE_COMPLETE',
        name: 'Perfil Completo',
        description: 'Has completado todos los datos de tu perfil',
        icon: '✅',
        color: 'green',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'FIRST_POLICY',
        name: 'Mi Primera Póliza',
        description: 'Has contratado tu primera póliza',
        icon: '📋',
        color: 'purple',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'MULTI_POLICY',
        name: 'Cliente Multipóliza',
        description: 'Tienes 3 o más pólizas activas',
        icon: '🏆',
        color: 'gold',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'REFERRAL_MASTER',
        name: 'Embajador Soriano',
        description: 'Has referido a 5 personas que se convirtieron en clientes',
        icon: '🌟',
        color: 'amber',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'SORI_FAN',
        name: 'Fan de SORI',
        description: 'Has usado el chat de SORI más de 50 veces',
        icon: '💬',
        color: 'pink',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'YEAR_LOYAL',
        name: '1 Año con Soriano',
        description: 'Llevas más de un año como cliente',
        icon: '🎂',
        color: 'red',
        isSecret: false,
      },
    }),
    prisma.badge.create({
      data: {
        code: 'ZERO_CLAIMS',
        name: 'Sin Siniestros',
        description: 'Un año completo sin siniestros',
        icon: '🛡️',
        color: 'emerald',
        isSecret: true,
      },
    }),
  ])

  console.log(`🏅 ${badges.length} badges creados`)

  // ========================================
  // CREAR USUARIOS
  // ========================================
  const hashedPassword = await bcrypt.hash('Demo123!', 10)

  // Usuario Demo Principal (Cliente)
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@soriano.es',
      password: hashedPassword,
      name: 'María García López',
      phone: '+34 612 345 678',
      dni: '12345678A',
      address: 'Calle Gran Vía, 42, 3º A',
      city: 'Madrid',
      postalCode: '28013',
      birthDate: new Date('1985-06-15'),
      role: UserRole.CLIENTE,
      level: UserLevel.ORO,
      points: 2450,
      isActive: true,
    },
  })

  // Usuario Cliente Básico
  const basicUser = await prisma.user.create({
    data: {
      email: 'cliente@soriano.es',
      password: hashedPassword,
      name: 'Carlos Martínez Ruiz',
      phone: '+34 623 456 789',
      dni: '87654321B',
      address: 'Avenida de la Constitución, 18',
      city: 'Sevilla',
      postalCode: '41001',
      birthDate: new Date('1990-03-22'),
      role: UserRole.CLIENTE,
      level: UserLevel.BRONCE,
      points: 350,
      isActive: true,
    },
  })

  // Usuario Cliente Premium
  const premiumUser = await prisma.user.create({
    data: {
      email: 'premium@soriano.es',
      password: hashedPassword,
      name: 'Elena Sánchez Fernández',
      phone: '+34 634 567 890',
      dni: '11223344C',
      address: 'Paseo de la Castellana, 100',
      city: 'Madrid',
      postalCode: '28046',
      birthDate: new Date('1978-11-08'),
      role: UserRole.CLIENTE,
      level: UserLevel.PLATINO,
      points: 8750,
      isActive: true,
    },
  })

  // Usuario Empleado
  const employeeUser = await prisma.user.create({
    data: {
      email: 'empleado@soriano.es',
      password: hashedPassword,
      name: 'Roberto Fernández García',
      phone: '+34 645 678 901',
      role: UserRole.EMPLEADO,
      level: UserLevel.PLATINO,
      points: 0,
      isActive: true,
    },
  })

  // Usuario Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@soriano.es',
      password: hashedPassword,
      name: 'Ana Rodríguez Martín',
      phone: '+34 656 789 012',
      role: UserRole.ADMIN,
      level: UserLevel.PLATINO,
      points: 0,
      isActive: true,
    },
  })

  console.log('👥 5 usuarios creados')

  // ========================================
  // CREAR PÓLIZAS
  // ========================================
  const policies = await Promise.all([
    // Pólizas de María García (demoUser)
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-AUTO-001',
        type: PolicyType.AUTO,
        status: PolicyStatus.ACTIVA,
        userId: demoUser.id,
        name: 'Seguro Auto Todo Riesgo',
        description: 'Volkswagen Golf 2022 - 1234 ABC',
        premium: 485.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-15'),
        nextPayment: new Date('2025-01-15'),
        coverages: ['Daños propios', 'Responsabilidad civil', 'Robo', 'Lunas', 'Asistencia en carretera 24h'],
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-HOGAR-002',
        type: PolicyType.HOGAR,
        status: PolicyStatus.ACTIVA,
        userId: demoUser.id,
        name: 'Seguro Hogar Completo',
        description: 'Calle Gran Vía 42 - Piso 90m²',
        premium: 320.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-03-01'),
        nextPayment: new Date('2025-03-01'),
        coverages: ['Incendio', 'Robo', 'Daños por agua', 'Responsabilidad civil', 'Asistencia hogar'],
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-VIDA-003',
        type: PolicyType.VIDA,
        status: PolicyStatus.ACTIVA,
        userId: demoUser.id,
        name: 'Seguro de Vida',
        description: 'Capital 150.000€',
        premium: 180.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-02-01'),
        nextPayment: new Date('2025-02-01'),
        coverages: ['Fallecimiento', 'Invalidez permanente', 'Enfermedades graves'],
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-SALUD-004',
        type: PolicyType.SALUD,
        status: PolicyStatus.ACTIVA,
        userId: demoUser.id,
        name: 'Seguro de Salud Familiar',
        description: 'Cobertura familiar completa',
        premium: 890.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        nextPayment: new Date('2025-01-01'),
        coverages: ['Hospitalización', 'Consultas especialistas', 'Pruebas diagnósticas', 'Urgencias', 'Dental básico'],
      },
    }),
    // Póliza de Carlos (basicUser)
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-AUTO-005',
        type: PolicyType.AUTO,
        status: PolicyStatus.ACTIVA,
        userId: basicUser.id,
        name: 'Seguro Auto Terceros Ampliado',
        description: 'Seat León 2020 - 5678 DEF',
        premium: 285.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-04-01'),
        nextPayment: new Date('2025-04-01'),
        coverages: ['Responsabilidad civil', 'Lunas', 'Asistencia en carretera'],
      },
    }),
    // Pólizas de Elena (premiumUser)
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-AUTO-006',
        type: PolicyType.AUTO,
        status: PolicyStatus.ACTIVA,
        userId: premiumUser.id,
        name: 'Seguro Auto Premium',
        description: 'BMW Serie 5 2023 - 9012 GHI',
        premium: 1250.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2025-02-15'),
        nextPayment: new Date('2025-02-15'),
        coverages: ['Todo riesgo sin franquicia', 'Vehículo de sustitución', 'Conductor adicional', 'Asistencia premium'],
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-HOGAR-007',
        type: PolicyType.HOGAR,
        status: PolicyStatus.ACTIVA,
        userId: premiumUser.id,
        name: 'Seguro Hogar Premium',
        description: 'Paseo de la Castellana 100 - Ático 200m²',
        premium: 850.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-01-01'),
        nextPayment: new Date('2025-01-01'),
        coverages: ['Cobertura total', 'Obras de arte', 'Joyas', 'Responsabilidad civil ampliada', 'Asistencia premium'],
      },
    }),
    prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-DECESOS-008',
        type: PolicyType.DECESOS,
        status: PolicyStatus.ACTIVA,
        userId: premiumUser.id,
        name: 'Seguro Decesos Familiar',
        description: 'Cobertura familiar 4 personas',
        premium: 240.00,
        paymentFrequency: 'anual',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-03-01'),
        nextPayment: new Date('2025-03-01'),
        coverages: ['Servicio completo', 'Traslado nacional', 'Gestiones administrativas'],
      },
    }),
  ])

  console.log(`📋 ${policies.length} pólizas creadas`)

  // ========================================
  // CREAR SINIESTROS
  // ========================================
  const claims = await Promise.all([
    // Siniestro resuelto de María
    prisma.claim.create({
      data: {
        claimNumber: 'SIN-2024-001',
        policyId: policies[0].id, // Auto de María
        userId: demoUser.id,
        type: 'Colisión',
        description: 'Colisión menor en parking subterráneo. Daños en parachoques trasero.',
        status: ClaimStatus.RESUELTO,
        amount: 850.00,
        incidentDate: new Date('2024-05-10'),
        resolvedDate: new Date('2024-05-28'),
      },
    }),
    // Siniestro en proceso de María
    prisma.claim.create({
      data: {
        claimNumber: 'SIN-2024-002',
        policyId: policies[1].id, // Hogar de María
        userId: demoUser.id,
        type: 'Daños por agua',
        description: 'Fuga de agua de la vivienda superior que ha afectado al techo del salón y parte del mobiliario.',
        status: ClaimStatus.EN_PROCESO,
        amount: 2300.00,
        incidentDate: new Date('2024-06-15'),
      },
    }),
    // Siniestro de Elena
    prisma.claim.create({
      data: {
        claimNumber: 'SIN-2024-003',
        policyId: policies[5].id, // Auto de Elena
        userId: premiumUser.id,
        type: 'Robo de accesorios',
        description: 'Robo de retrovisores y sistema de navegación.',
        status: ClaimStatus.APROBADO,
        amount: 3500.00,
        incidentDate: new Date('2024-06-20'),
      },
    }),
  ])

  console.log(`🔧 ${claims.length} siniestros creados`)

  // ========================================
  // CREAR TIMELINE DE SINIESTROS
  // ========================================
  await Promise.all([
    // Timeline del siniestro 1 (resuelto)
    prisma.claimTimeline.createMany({
      data: [
        { claimId: claims[0].id, status: ClaimStatus.COMUNICADO, title: 'Siniestro comunicado', description: 'Se ha recibido la comunicación del siniestro', createdAt: new Date('2024-05-10T10:00:00') },
        { claimId: claims[0].id, status: ClaimStatus.DOCUMENTACION, title: 'Documentación solicitada', description: 'Se ha solicitado fotos del daño y parte amistoso', createdAt: new Date('2024-05-11T09:00:00') },
        { claimId: claims[0].id, status: ClaimStatus.EN_REVISION, title: 'En revisión por perito', description: 'El perito está evaluando los daños', createdAt: new Date('2024-05-15T14:00:00') },
        { claimId: claims[0].id, status: ClaimStatus.APROBADO, title: 'Siniestro aprobado', description: 'Se ha aprobado la reparación por 850€', createdAt: new Date('2024-05-20T11:00:00') },
        { claimId: claims[0].id, status: ClaimStatus.RESUELTO, title: 'Siniestro resuelto', description: 'Reparación completada y pago realizado', createdAt: new Date('2024-05-28T16:00:00') },
      ],
    }),
    // Timeline del siniestro 2 (en proceso)
    prisma.claimTimeline.createMany({
      data: [
        { claimId: claims[1].id, status: ClaimStatus.COMUNICADO, title: 'Siniestro comunicado', description: 'Se ha recibido la comunicación del siniestro', createdAt: new Date('2024-06-15T18:00:00') },
        { claimId: claims[1].id, status: ClaimStatus.DOCUMENTACION, title: 'Documentación recibida', description: 'Fotos y presupuesto del seguro de comunidad recibidos', createdAt: new Date('2024-06-17T10:00:00') },
        { claimId: claims[1].id, status: ClaimStatus.EN_REVISION, title: 'En revisión', description: 'El perito visitará la vivienda el próximo lunes', createdAt: new Date('2024-06-20T09:00:00') },
        { claimId: claims[1].id, status: ClaimStatus.EN_PROCESO, title: 'Reparación en proceso', description: 'Se ha iniciado la reparación del techo', createdAt: new Date('2024-06-25T08:00:00') },
      ],
    }),
    // Timeline del siniestro 3 (aprobado)
    prisma.claimTimeline.createMany({
      data: [
        { claimId: claims[2].id, status: ClaimStatus.COMUNICADO, title: 'Siniestro comunicado', description: 'Comunicación de robo recibida', createdAt: new Date('2024-06-20T08:00:00') },
        { claimId: claims[2].id, status: ClaimStatus.DOCUMENTACION, title: 'Denuncia presentada', description: 'Denuncia policial adjuntada al expediente', createdAt: new Date('2024-06-21T12:00:00') },
        { claimId: claims[2].id, status: ClaimStatus.EN_REVISION, title: 'Verificación completada', description: 'Inspección del vehículo realizada', createdAt: new Date('2024-06-24T15:00:00') },
        { claimId: claims[2].id, status: ClaimStatus.APROBADO, title: 'Indemnización aprobada', description: 'Aprobada indemnización de 3.500€', createdAt: new Date('2024-06-26T11:00:00') },
      ],
    }),
  ])

  console.log('📊 Timelines de siniestros creados')

  // ========================================
  // CREAR DOCUMENTOS
  // ========================================
  await Promise.all([
    prisma.document.create({
      data: {
        userId: demoUser.id,
        policyId: policies[0].id,
        type: DocumentType.POLIZA,
        name: 'Póliza Auto 2024',
        fileUrl: '/documents/poliza-auto-2024.pdf',
        fileSize: '245 KB',
      },
    }),
    prisma.document.create({
      data: {
        userId: demoUser.id,
        policyId: policies[0].id,
        type: DocumentType.RECIBO,
        name: 'Recibo Prima Anual Auto',
        fileUrl: '/documents/recibo-auto-2024.pdf',
        fileSize: '128 KB',
      },
    }),
    prisma.document.create({
      data: {
        userId: demoUser.id,
        policyId: policies[1].id,
        type: DocumentType.POLIZA,
        name: 'Póliza Hogar 2024',
        fileUrl: '/documents/poliza-hogar-2024.pdf',
        fileSize: '312 KB',
      },
    }),
    prisma.document.create({
      data: {
        userId: demoUser.id,
        claimId: claims[1].id,
        type: DocumentType.SINIESTRO,
        name: 'Fotos daños por agua',
        fileUrl: '/documents/fotos-siniestro-002.zip',
        fileSize: '4.2 MB',
      },
    }),
  ])

  console.log('📄 Documentos creados')

  // ========================================
  // CREAR PAGOS
  // ========================================
  await Promise.all([
    prisma.payment.create({
      data: {
        policyId: policies[0].id,
        amount: 485.00,
        status: PaymentStatus.PAGADO,
        dueDate: new Date('2024-01-15'),
        paidDate: new Date('2024-01-10'),
      },
    }),
    prisma.payment.create({
      data: {
        policyId: policies[1].id,
        amount: 320.00,
        status: PaymentStatus.PAGADO,
        dueDate: new Date('2024-03-01'),
        paidDate: new Date('2024-02-28'),
      },
    }),
    prisma.payment.create({
      data: {
        policyId: policies[3].id,
        amount: 890.00,
        status: PaymentStatus.PENDIENTE,
        dueDate: new Date('2025-01-01'),
      },
    }),
  ])

  console.log('💳 Pagos creados')

  // ========================================
  // CREAR NOTIFICACIONES
  // ========================================
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: demoUser.id,
        title: '¡Bienvenido a e-SORI!',
        message: 'Tu portal de cliente ha sido actualizado con nuevas funcionalidades.',
        type: 'info',
        isRead: true,
        link: '/dashboard',
      },
    }),
    prisma.notification.create({
      data: {
        userId: demoUser.id,
        title: 'Siniestro actualizado',
        message: 'Tu siniestro SIN-2024-002 ha pasado a estado "En proceso".',
        type: 'claim',
        isRead: false,
        link: '/siniestros/SIN-2024-002',
      },
    }),
    prisma.notification.create({
      data: {
        userId: demoUser.id,
        title: 'Próximo vencimiento',
        message: 'Tu póliza de Salud vence el 01/01/2025. ¿Deseas renovarla?',
        type: 'renewal',
        isRead: false,
        link: '/polizas/POL-2024-SALUD-004',
      },
    }),
    prisma.notification.create({
      data: {
        userId: demoUser.id,
        title: '¡Has subido de nivel!',
        message: 'Felicidades, ahora eres cliente ORO y tienes acceso a beneficios exclusivos.',
        type: 'reward',
        isRead: true,
        link: '/soriano-club',
      },
    }),
    prisma.notification.create({
      data: {
        userId: basicUser.id,
        title: 'Completa tu perfil',
        message: 'Añade tus datos de contacto para ganar 100 puntos.',
        type: 'info',
        isRead: false,
        link: '/perfil',
      },
    }),
  ])

  console.log('🔔 Notificaciones creadas')

  // ========================================
  // CREAR HISTORIAL DE PUNTOS
  // ========================================
  await Promise.all([
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.PERFIL_COMPLETO,
        points: 100,
        description: 'Perfil completado al 100%',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.NUEVA_POLIZA,
        points: 500,
        description: 'Contratación póliza Auto',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.NUEVA_POLIZA,
        points: 500,
        description: 'Contratación póliza Hogar',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.NUEVA_POLIZA,
        points: 500,
        description: 'Contratación póliza Vida',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.NUEVA_POLIZA,
        points: 500,
        description: 'Contratación póliza Salud',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.REFERIDO_CONVERSION,
        points: 250,
        description: 'Tu referido Carlos se ha convertido en cliente',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.CHAT_SORI,
        points: 50,
        description: 'Primera consulta a SORI',
      },
    }),
    prisma.pointsHistory.create({
      data: {
        userId: demoUser.id,
        action: PointsAction.LOGIN_DIARIO,
        points: 50,
        description: 'Login diario consecutivo (10 días)',
      },
    }),
  ])

  console.log('⭐ Historial de puntos creado')

  // ========================================
  // ASIGNAR BADGES A USUARIOS
  // ========================================
  const firstLoginBadge = badges.find(b => b.code === 'FIRST_LOGIN')!
  const profileBadge = badges.find(b => b.code === 'PROFILE_COMPLETE')!
  const firstPolicyBadge = badges.find(b => b.code === 'FIRST_POLICY')!
  const multiPolicyBadge = badges.find(b => b.code === 'MULTI_POLICY')!
  const soriFanBadge = badges.find(b => b.code === 'SORI_FAN')!

  await Promise.all([
    prisma.userBadge.create({ data: { userId: demoUser.id, badgeId: firstLoginBadge.id } }),
    prisma.userBadge.create({ data: { userId: demoUser.id, badgeId: profileBadge.id } }),
    prisma.userBadge.create({ data: { userId: demoUser.id, badgeId: firstPolicyBadge.id } }),
    prisma.userBadge.create({ data: { userId: demoUser.id, badgeId: multiPolicyBadge.id } }),
    prisma.userBadge.create({ data: { userId: basicUser.id, badgeId: firstLoginBadge.id } }),
    prisma.userBadge.create({ data: { userId: basicUser.id, badgeId: firstPolicyBadge.id } }),
    prisma.userBadge.create({ data: { userId: premiumUser.id, badgeId: firstLoginBadge.id } }),
    prisma.userBadge.create({ data: { userId: premiumUser.id, badgeId: profileBadge.id } }),
    prisma.userBadge.create({ data: { userId: premiumUser.id, badgeId: firstPolicyBadge.id } }),
    prisma.userBadge.create({ data: { userId: premiumUser.id, badgeId: multiPolicyBadge.id } }),
    prisma.userBadge.create({ data: { userId: premiumUser.id, badgeId: soriFanBadge.id } }),
  ])

  console.log('🎖️ Badges asignados a usuarios')

  // ========================================
  // CREAR REFERIDOS
  // ========================================
  await prisma.referral.create({
    data: {
      referrerId: demoUser.id,
      referredId: basicUser.id,
      referredEmail: 'cliente@soriano.es',
      code: 'MARIA-REF-001',
      status: ReferralStatus.CONVERTIDO,
      convertedAt: new Date('2024-04-01'),
    },
  })

  console.log('👥 Referidos creados')

  // ========================================
  // CREAR CONVERSACIONES CON SORI
  // ========================================
  const conversation = await prisma.conversation.create({
    data: {
      userId: demoUser.id,
      title: 'Consulta sobre siniestro',
      isActive: true,
    },
  })

  await prisma.chatMessage.createMany({
    data: [
      {
        conversationId: conversation.id,
        role: ChatMessageRole.USER,
        content: 'Hola SORI, tengo una duda sobre mi siniestro de daños por agua',
        createdAt: new Date('2024-06-16T10:00:00'),
      },
      {
        conversationId: conversation.id,
        role: ChatMessageRole.ASSISTANT,
        content: '¡Hola María! 👋 Claro, estoy aquí para ayudarte. Veo que tienes un siniestro abierto (SIN-2024-002) por daños por agua en tu hogar. ¿Qué te gustaría saber?',
        createdAt: new Date('2024-06-16T10:00:05'),
      },
      {
        conversationId: conversation.id,
        role: ChatMessageRole.USER,
        content: '¿Cuándo vendrá el perito a ver los daños?',
        createdAt: new Date('2024-06-16T10:01:00'),
      },
      {
        conversationId: conversation.id,
        role: ChatMessageRole.ASSISTANT,
        content: 'Según el expediente, el perito tiene programada la visita para el próximo lunes entre las 9:00 y las 13:00. ¿Necesitas cambiar la cita o tienes alguna otra pregunta sobre el proceso?',
        createdAt: new Date('2024-06-16T10:01:05'),
      },
    ],
  })

  console.log('💬 Conversaciones con SORI creadas')

  // ========================================
  // CREAR MENSAJES INTERNOS
  // ========================================
  await prisma.message.create({
    data: {
      senderId: employeeUser.id,
      receiverId: demoUser.id,
      subject: 'Actualización de tu siniestro',
      content: 'Estimada María, te informamos que el perito ha completado la inspección de tu vivienda. En breve recibirás el informe con la valoración de los daños. Cualquier duda, no dudes en contactarnos.',
      isRead: true,
    },
  })

  await prisma.message.create({
    data: {
      senderId: adminUser.id,
      receiverId: demoUser.id,
      subject: '¡Felicidades, eres cliente ORO!',
      content: 'Querida María, nos complace informarte que has alcanzado el nivel ORO en Soriano Club. A partir de ahora disfrutarás de ventajas exclusivas como atención prioritaria, descuentos especiales y regalos de cumpleaños. ¡Gracias por tu confianza!',
      isRead: false,
    },
  })

  console.log('📨 Mensajes internos creados')

  console.log('')
  console.log('✅ Seed completado exitosamente!')
  console.log('')
  console.log('📊 Resumen de datos creados:')
  console.log('   - 5 usuarios (3 clientes, 1 empleado, 1 admin)')
  console.log('   - 8 pólizas')
  console.log('   - 3 siniestros con timeline')
  console.log('   - 4 documentos')
  console.log('   - 3 pagos')
  console.log('   - 5 notificaciones')
  console.log('   - 8 registros de puntos')
  console.log('   - 8 badges del sistema')
  console.log('   - 11 badges asignados')
  console.log('   - 1 referido')
  console.log('   - 1 conversación con SORI')
  console.log('   - 2 mensajes internos')
  console.log('')
  console.log('🔐 Credenciales de acceso:')
  console.log('   Cliente Demo:  demo@soriano.es / Demo123!')
  console.log('   Cliente Basic: cliente@soriano.es / Demo123!')
  console.log('   Cliente Premium: premium@soriano.es / Demo123!')
  console.log('   Empleado:      empleado@soriano.es / Demo123!')
  console.log('   Admin:         admin@soriano.es / Demo123!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
