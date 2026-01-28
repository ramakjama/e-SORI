/**
 * Prisma Seed Script
 * Poblar la base de datos con datos iniciales para desarrollo y testing
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // ========================================
  // 1. ACHIEVEMENTS (Logros)
  // ========================================
  console.log('📊 Creando achievements...');

  const achievements = await Promise.all([
    // Policy Management
    prisma.achievement.upsert({
      where: { key: 'first_policy' },
      update: {},
      create: {
        key: 'first_policy',
        title: 'Primera Póliza',
        description: 'Has registrado tu primera póliza',
        category: 'POLICY_MANAGEMENT',
        icon: '📋',
        points: 50,
        coinReward: 10,
        rarity: 'COMMON',
        criteria: { type: 'policy_count', value: 1 },
      },
    }),
    prisma.achievement.upsert({
      where: { key: 'policy_master' },
      update: {},
      create: {
        key: 'policy_master',
        title: 'Maestro de Pólizas',
        description: 'Tienes 5 o más pólizas activas',
        category: 'POLICY_MANAGEMENT',
        icon: '🏆',
        points: 200,
        coinReward: 50,
        rarity: 'RARE',
        criteria: { type: 'policy_count', value: 5 },
      },
    }),

    // Learning
    prisma.achievement.upsert({
      where: { key: 'quiz_rookie' },
      update: {},
      create: {
        key: 'quiz_rookie',
        title: 'Aprendiz',
        description: 'Completaste tu primer quiz',
        category: 'LEARNING',
        icon: '📚',
        points: 25,
        coinReward: 5,
        rarity: 'COMMON',
        criteria: { type: 'quiz_count', value: 1 },
      },
    }),
    prisma.achievement.upsert({
      where: { key: 'perfect_score' },
      update: {},
      create: {
        key: 'perfect_score',
        title: 'Puntuación Perfecta',
        description: 'Obtuviste 100% en un quiz',
        category: 'LEARNING',
        icon: '💯',
        points: 100,
        coinReward: 25,
        rarity: 'EPIC',
        criteria: { type: 'quiz_perfect', value: 1 },
      },
    }),

    // Referrals
    prisma.achievement.upsert({
      where: { key: 'first_referral' },
      update: {},
      create: {
        key: 'first_referral',
        title: 'Embajador Novato',
        description: 'Referiste a tu primer amigo',
        category: 'REFERRALS',
        icon: '👥',
        points: 75,
        coinReward: 15,
        rarity: 'COMMON',
        criteria: { type: 'referral_count', value: 1 },
      },
    }),
    prisma.achievement.upsert({
      where: { key: 'super_referrer' },
      update: {},
      create: {
        key: 'super_referrer',
        title: 'Super Embajador',
        description: 'Has referido a 10 amigos exitosamente',
        category: 'REFERRALS',
        icon: '🌟',
        points: 500,
        coinReward: 100,
        rarity: 'LEGENDARY',
        criteria: { type: 'referral_count', value: 10 },
      },
    }),

    // Engagement
    prisma.achievement.upsert({
      where: { key: 'week_streak' },
      update: {},
      create: {
        key: 'week_streak',
        title: 'Racha Semanal',
        description: '7 días consecutivos de actividad',
        category: 'ENGAGEMENT',
        icon: '🔥',
        points: 150,
        coinReward: 30,
        rarity: 'RARE',
        criteria: { type: 'streak_days', value: 7 },
      },
    }),
    prisma.achievement.upsert({
      where: { key: 'month_streak' },
      update: {},
      create: {
        key: 'month_streak',
        title: 'Racha Mensual',
        description: '30 días consecutivos de actividad',
        category: 'ENGAGEMENT',
        icon: '🔥🔥',
        points: 500,
        coinReward: 100,
        rarity: 'EPIC',
        criteria: { type: 'streak_days', value: 30 },
      },
    }),

    // Claims
    prisma.achievement.upsert({
      where: { key: 'fast_claim' },
      update: {},
      create: {
        key: 'fast_claim',
        title: 'Reporte Rápido',
        description: 'Reportaste un siniestro en menos de 24 horas',
        category: 'CLAIMS',
        icon: '⚡',
        points: 100,
        coinReward: 20,
        rarity: 'RARE',
        criteria: { type: 'claim_speed', value: 24 },
      },
    }),

    // Special
    prisma.achievement.upsert({
      where: { key: 'early_adopter' },
      update: {},
      create: {
        key: 'early_adopter',
        title: 'Early Adopter',
        description: 'Fuiste uno de los primeros usuarios de e-SORI',
        category: 'SPECIAL',
        icon: '🚀',
        points: 1000,
        coinReward: 200,
        rarity: 'LEGENDARY',
        isHidden: true,
        criteria: { type: 'user_id', value: 1000 },
      },
    }),
  ]);

  console.log(`✅ ${achievements.length} achievements creados`);

  // ========================================
  // 2. REWARDS (Recompensas)
  // ========================================
  console.log('🎁 Creando rewards...');

  const rewards = await Promise.all([
    // Discounts
    prisma.reward.upsert({
      where: { id: 'reward_discount_10' },
      update: {},
      create: {
        id: 'reward_discount_10',
        title: '10% Descuento en Renovación',
        description: '10% de descuento en la renovación de cualquier póliza',
        category: 'DISCOUNT',
        coinCost: 100,
        imageUrl: '/images/rewards/discount-10.png',
        isActive: true,
        termsAndConditions: 'Válido para una renovación. No acumulable con otras promociones.',
        redemptionInstructions: 'Presenta este cupón al renovar tu póliza.',
      },
    }),
    prisma.reward.upsert({
      where: { id: 'reward_discount_25' },
      update: {},
      create: {
        id: 'reward_discount_25',
        title: '25% Descuento en Nueva Póliza',
        description: '25% de descuento en la contratación de una nueva póliza',
        category: 'DISCOUNT',
        coinCost: 250,
        imageUrl: '/images/rewards/discount-25.png',
        isActive: true,
        termsAndConditions: 'Válido para pólizas nuevas. Mínimo de cobertura €1000.',
        redemptionInstructions: 'Contacta con tu agente y menciona este descuento.',
      },
    }),

    // Gift Cards
    prisma.reward.upsert({
      where: { id: 'reward_amazon_10' },
      update: {},
      create: {
        id: 'reward_amazon_10',
        title: 'Gift Card Amazon €10',
        description: 'Tarjeta regalo de Amazon por valor de €10',
        category: 'GIFT_CARD',
        coinCost: 200,
        stock: 50,
        availableStock: 50,
        imageUrl: '/images/rewards/amazon-10.png',
        isActive: true,
        redemptionInstructions: 'Recibirás el código por email en 24-48 horas.',
      },
    }),
    prisma.reward.upsert({
      where: { id: 'reward_amazon_25' },
      update: {},
      create: {
        id: 'reward_amazon_25',
        title: 'Gift Card Amazon €25',
        description: 'Tarjeta regalo de Amazon por valor de €25',
        category: 'GIFT_CARD',
        coinCost: 450,
        stock: 30,
        availableStock: 30,
        imageUrl: '/images/rewards/amazon-25.png',
        isActive: true,
        redemptionInstructions: 'Recibirás el código por email en 24-48 horas.',
      },
    }),

    // Insurance Benefits
    prisma.reward.upsert({
      where: { id: 'reward_roadside_assistance' },
      update: {},
      create: {
        id: 'reward_roadside_assistance',
        title: 'Asistencia en Carretera Gratis',
        description: '1 mes de asistencia en carretera sin costo adicional',
        category: 'INSURANCE_BENEFIT',
        coinCost: 150,
        imageUrl: '/images/rewards/roadside.png',
        isActive: true,
        termsAndConditions: 'Aplicable a pólizas de auto activas.',
        redemptionInstructions: 'Se activará automáticamente en tu póliza.',
      },
    }),

    // Physical Items
    prisma.reward.upsert({
      where: { id: 'reward_emergency_kit' },
      update: {},
      create: {
        id: 'reward_emergency_kit',
        title: 'Kit de Emergencia para Auto',
        description: 'Kit completo con botiquín, cables, triángulos y más',
        category: 'PHYSICAL_ITEM',
        coinCost: 300,
        stock: 20,
        availableStock: 20,
        imageUrl: '/images/rewards/emergency-kit.png',
        isActive: true,
        redemptionInstructions: 'Envío a domicilio en 5-7 días laborables.',
      },
    }),

    // Donations
    prisma.reward.upsert({
      where: { id: 'reward_tree_donation' },
      update: {},
      create: {
        id: 'reward_tree_donation',
        title: 'Planta un Árbol',
        description: 'Donación para plantar un árbol en tu nombre',
        category: 'DONATION',
        coinCost: 50,
        imageUrl: '/images/rewards/tree.png',
        isActive: true,
        redemptionInstructions: 'Recibirás un certificado con las coordenadas de tu árbol.',
      },
    }),
  ]);

  console.log(`✅ ${rewards.length} rewards creados`);

  // ========================================
  // 3. USUARIOS DE PRUEBA
  // ========================================
  console.log('👤 Creando usuarios de prueba...');

  const testPassword = await hash('Test123!', 10);

  const testUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@sorianomediadores.com' },
      update: {},
      create: {
        email: 'admin@sorianomediadores.com',
        name: 'Admin Soriano',
        password: testPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        xp: 10000,
        coins: 1000,
        level: 10,
        streak: 30,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Usuario de Prueba',
        password: testPassword,
        role: 'CLIENT',
        status: 'ACTIVE',
        xp: 250,
        coins: 50,
        level: 2,
        streak: 5,
        emailVerified: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { email: 'agent@sorianomediadores.com' },
      update: {},
      create: {
        email: 'agent@sorianomediadores.com',
        name: 'Agente Comercial',
        password: testPassword,
        role: 'AGENT',
        status: 'ACTIVE',
        xp: 5000,
        coins: 500,
        level: 5,
        streak: 15,
        emailVerified: new Date(),
      },
    }),
  ]);

  console.log(`✅ ${testUsers.length} usuarios de prueba creados`);

  // ========================================
  // 4. PÓLIZA DE EJEMPLO
  // ========================================
  console.log('📋 Creando póliza de ejemplo...');

  const testUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (testUser) {
    await prisma.policy.upsert({
      where: { policyNumber: 'POL-2026-00001' },
      update: {},
      create: {
        userId: testUser.id,
        policyNumber: 'POL-2026-00001',
        policyType: 'AUTO',
        provider: 'Mapfre',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2027-01-01'),
        renewalDate: new Date('2026-12-01'),
        premium: 450.00,
        coverage: 50000.00,
        deductible: 300.00,
        paymentFrequency: 'ANNUAL',
        status: 'ACTIVE',
        description: 'Seguro a todo riesgo para vehículo particular',
        vehicleInfo: {
          make: 'Seat',
          model: 'León',
          year: 2022,
          licensePlate: '1234-ABC',
          vin: 'VSSZZZ6JZXR123456',
        },
      },
    });

    console.log('✅ Póliza de ejemplo creada');
  }

  console.log('');
  console.log('✨ Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log(`   - ${achievements.length} Achievements`);
  console.log(`   - ${rewards.length} Rewards`);
  console.log(`   - ${testUsers.length} Usuarios de prueba`);
  console.log('');
  console.log('🔑 Credenciales de prueba:');
  console.log('   Admin: admin@sorianomediadores.com / Test123!');
  console.log('   Usuario: test@example.com / Test123!');
  console.log('   Agente: agent@sorianomediadores.com / Test123!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
