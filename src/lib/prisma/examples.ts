/**
 * Ejemplos de Queries Comunes con Prisma
 * e-SORI - Soriano Mediadores
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// USER QUERIES
// ========================================

/**
 * Obtener usuario completo con todas sus relaciones
 */
export async function getUserWithAllData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      policies: {
        where: { status: 'ACTIVE' },
        orderBy: { endDate: 'asc' },
      },
      claims: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      riskProfile: true,
      notifications: {
        where: { read: false },
        orderBy: { createdAt: 'desc' },
      },
      achievements: {
        where: { completed: true },
        include: { achievement: true },
      },
    },
  });
}

/**
 * Actualizar progreso de gamificación
 */
export async function updateUserGamification(
  userId: string,
  xpGained: number,
  coinsGained: number
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, coins: true, level: true },
  });

  if (!user) throw new Error('Usuario no encontrado');

  const newXp = user.xp + xpGained;
  const newLevel = Math.floor(newXp / 100) + 1; // 100 XP por nivel

  return await prisma.$transaction(async (tx) => {
    // Actualizar usuario
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
        coins: { increment: coinsGained },
      },
    });

    // Registrar transacción de coins
    if (coinsGained > 0) {
      await tx.transaction.create({
        data: {
          userId,
          type: 'EARNED',
          category: 'GENERAL',
          amount: coinsGained,
          balanceBefore: user.coins,
          balanceAfter: user.coins + coinsGained,
          description: `Ganaste ${coinsGained} coins (+${xpGained} XP)`,
        },
      });
    }

    return updatedUser;
  });
}

/**
 * Actualizar streak del usuario
 */
export async function updateUserStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, streak: true },
  });

  if (!user) throw new Error('Usuario no encontrado');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.lastActiveDate
    ? new Date(user.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  let newStreak = user.streak || 0;

  // Si último acceso fue ayer, incrementar
  if (
    lastActive &&
    today.getTime() - lastActive.getTime() === 24 * 60 * 60 * 1000
  ) {
    newStreak += 1;
  }
  // Si fue hace más de un día, resetear
  else if (!lastActive || today.getTime() - lastActive.getTime() > 24 * 60 * 60 * 1000) {
    newStreak = 1;
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      lastActiveDate: new Date(),
    },
  });
}

// ========================================
// POLICY QUERIES
// ========================================

/**
 * Obtener pólizas próximas a vencer
 */
export async function getPoliciesNearExpiration(daysAhead: number = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return await prisma.policy.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        lte: futureDate,
        gte: new Date(),
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      endDate: 'asc',
    },
  });
}

/**
 * Obtener estadísticas de pólizas por usuario
 */
export async function getUserPolicyStats(userId: string) {
  const [total, active, expired, totalPremium] = await prisma.$transaction([
    prisma.policy.count({ where: { userId } }),
    prisma.policy.count({ where: { userId, status: 'ACTIVE' } }),
    prisma.policy.count({ where: { userId, status: 'EXPIRED' } }),
    prisma.policy.aggregate({
      where: { userId, status: 'ACTIVE' },
      _sum: { premium: true },
    }),
  ]);

  return {
    total,
    active,
    expired,
    totalAnnualPremium: totalPremium._sum.premium || 0,
  };
}

// ========================================
// CLAIM QUERIES
// ========================================

/**
 * Obtener siniestro completo con mensajes
 */
export async function getClaimWithMessages(claimId: string) {
  return await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      policy: true,
      documents: {
        orderBy: { createdAt: 'desc' },
      },
      messages: {
        include: {
          user: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

/**
 * Crear siniestro con notificación
 */
export async function createClaimWithNotification(data: {
  userId: string;
  policyId: string;
  incidentDate: Date;
  description: string;
  claimedAmount: number;
  location?: string;
}) {
  const claim = await prisma.claim.create({
    data: {
      userId: data.userId,
      policyId: data.policyId,
      claimNumber: `CLM-${Date.now()}`,
      incidentDate: data.incidentDate,
      description: data.description,
      claimedAmount: data.claimedAmount,
      location: data.location,
      status: 'SUBMITTED',
      priority: 'NORMAL',
    },
  });

  // Crear notificación
  await prisma.notification.create({
    data: {
      userId: data.userId,
      title: 'Siniestro Recibido',
      message: `Tu siniestro ${claim.claimNumber} ha sido recibido y está en proceso de revisión.`,
      type: 'CLAIM_UPDATE',
      priority: 'NORMAL',
      actionUrl: `/claims/${claim.id}`,
      actionLabel: 'Ver Detalles',
    },
  });

  return claim;
}

/**
 * Obtener estadísticas de siniestros
 */
export async function getClaimStatistics() {
  const [byStatus, byPriority, avgApprovedAmount] = await Promise.all([
    prisma.claim.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.claim.groupBy({
      by: ['priority'],
      _count: true,
    }),
    prisma.claim.aggregate({
      where: { status: 'APPROVED' },
      _avg: { approvedAmount: true },
    }),
  ]);

  return {
    byStatus,
    byPriority,
    avgApprovedAmount: avgApprovedAmount._avg.approvedAmount || 0,
  };
}

// ========================================
// NOTIFICATION QUERIES
// ========================================

/**
 * Obtener notificaciones no leídas
 */
export async function getUnreadNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: {
      userId,
      read: false,
      dismissed: false,
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });
}

/**
 * Marcar notificación como leída
 */
export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
      readAt: new Date(),
    },
  });
}

/**
 * Marcar todas las notificaciones como leídas
 */
export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  });
}

// ========================================
// ACHIEVEMENT QUERIES
// ========================================

/**
 * Verificar y desbloquear achievement
 */
export async function checkAndUnlockAchievement(
  userId: string,
  achievementKey: string
) {
  const achievement = await prisma.achievement.findUnique({
    where: { key: achievementKey },
  });

  if (!achievement) return null;

  // Verificar si ya está desbloqueado
  const existing = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (existing?.completed) return null;

  // Desbloquear achievement
  return await prisma.$transaction(async (tx) => {
    // Actualizar o crear UserAchievement
    const userAchievement = await tx.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
      update: {
        completed: true,
        unlockedAt: new Date(),
      },
      create: {
        userId,
        achievementId: achievement.id,
        progress: 1,
        maxProgress: 1,
        completed: true,
        unlockedAt: new Date(),
      },
    });

    // Actualizar XP y coins del usuario
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { xp: true, coins: true },
    });

    if (!user) throw new Error('Usuario no encontrado');

    await tx.user.update({
      where: { id: userId },
      data: {
        xp: { increment: achievement.points },
        coins: { increment: achievement.coinReward },
      },
    });

    // Registrar transacción
    await tx.transaction.create({
      data: {
        userId,
        type: 'ACHIEVEMENT_REWARD',
        category: 'ACHIEVEMENT',
        amount: achievement.coinReward,
        balanceBefore: user.coins,
        balanceAfter: user.coins + achievement.coinReward,
        description: `Logro desbloqueado: ${achievement.title}`,
        referenceId: achievement.id,
        referenceType: 'Achievement',
      },
    });

    // Crear notificación
    await tx.notification.create({
      data: {
        userId,
        title: '🏆 Logro Desbloqueado',
        message: `Has desbloqueado "${achievement.title}"! +${achievement.points} XP, +${achievement.coinReward} coins`,
        type: 'ACHIEVEMENT',
        priority: 'NORMAL',
      },
    });

    return userAchievement;
  });
}

/**
 * Obtener progreso de achievements del usuario
 */
export async function getUserAchievements(userId: string) {
  return await prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true,
    },
    orderBy: [{ completed: 'desc' }, { unlockedAt: 'desc' }],
  });
}

// ========================================
// REFERRAL QUERIES
// ========================================

/**
 * Crear referido
 */
export async function createReferral(
  referrerId: string,
  referredEmail: string,
  referredName?: string
) {
  const referralCode = `REF-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  return await prisma.referral.create({
    data: {
      referrerId,
      referredEmail,
      referredName,
      referralCode,
      status: 'PENDING',
      stage: 'INVITED',
    },
  });
}

/**
 * Actualizar stage de referido
 */
export async function updateReferralStage(
  referralCode: string,
  newStage: 'SIGNED_UP' | 'VERIFIED' | 'FIRST_POLICY' | 'COMPLETED'
) {
  const referral = await prisma.referral.findUnique({
    where: { referralCode },
  });

  if (!referral) throw new Error('Referral no encontrado');

  const updates: any = { stage: newStage };

  if (newStage === 'SIGNED_UP') {
    updates.signedUpAt = new Date();
  } else if (newStage === 'FIRST_POLICY') {
    updates.firstPolicyAt = new Date();
  } else if (newStage === 'COMPLETED') {
    updates.completedAt = new Date();
    updates.status = 'COMPLETED';
    updates.rewardPaidAt = new Date();
    updates.referrerReward = 100; // 100 coins
    updates.referredReward = 50; // 50 coins
  }

  return await prisma.referral.update({
    where: { referralCode },
    data: updates,
  });
}

// ========================================
// REWARD QUERIES
// ========================================

/**
 * Comprar recompensa
 */
export async function purchaseReward(userId: string, rewardId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { coins: true },
  });

  const reward = await prisma.reward.findUnique({
    where: { id: rewardId },
  });

  if (!user || !reward) throw new Error('Usuario o recompensa no encontrados');
  if (user.coins < reward.coinCost)
    throw new Error('Coins insuficientes');
  if (reward.availableStock !== null && reward.availableStock <= 0)
    throw new Error('Stock agotado');

  return await prisma.$transaction(async (tx) => {
    // Descontar coins
    await tx.user.update({
      where: { id: userId },
      data: { coins: { decrement: reward.coinCost } },
    });

    // Reducir stock
    if (reward.availableStock !== null) {
      await tx.reward.update({
        where: { id: rewardId },
        data: { availableStock: { decrement: 1 } },
      });
    }

    // Crear compra
    const purchase = await tx.rewardPurchase.create({
      data: {
        userId,
        rewardId,
        coinsCost: reward.coinCost,
        status: 'PENDING',
        redemptionCode: `RDM-${Date.now()}`,
      },
    });

    // Registrar transacción
    await tx.transaction.create({
      data: {
        userId,
        type: 'SPENT',
        category: 'REWARD',
        amount: -reward.coinCost,
        balanceBefore: user.coins,
        balanceAfter: user.coins - reward.coinCost,
        description: `Compra: ${reward.title}`,
        referenceId: purchase.id,
        referenceType: 'RewardPurchase',
      },
    });

    return purchase;
  });
}

/**
 * Obtener historial de compras
 */
export async function getUserRewardPurchases(userId: string) {
  return await prisma.rewardPurchase.findMany({
    where: { userId },
    include: { reward: true },
    orderBy: { purchasedAt: 'desc' },
  });
}

// ========================================
// TRANSACTION QUERIES
// ========================================

/**
 * Obtener historial de transacciones
 */
export async function getUserTransactions(
  userId: string,
  limit: number = 50
) {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Obtener balance actual del usuario
 */
export async function getUserBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      coins: true,
      xp: true,
      level: true,
    },
  });

  if (!user) throw new Error('Usuario no encontrado');

  return user;
}

// ========================================
// DASHBOARD QUERIES
// ========================================

/**
 * Obtener datos del dashboard del usuario
 */
export async function getUserDashboard(userId: string) {
  const [
    user,
    activePolicies,
    pendingClaims,
    unreadNotifications,
    recentTransactions,
    achievements,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        xp: true,
        coins: true,
        level: true,
        streak: true,
      },
    }),
    prisma.policy.findMany({
      where: { userId, status: 'ACTIVE' },
      include: { claims: { where: { status: { not: 'CLOSED' } } } },
    }),
    prisma.claim.count({
      where: {
        userId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_INFO'] },
      },
    }),
    prisma.notification.count({
      where: { userId, read: false },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.userAchievement.findMany({
      where: { userId, completed: true },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 5,
    }),
  ]);

  return {
    user,
    activePolicies,
    pendingClaims,
    unreadNotifications,
    recentTransactions,
    recentAchievements: achievements,
  };
}

export default prisma;
