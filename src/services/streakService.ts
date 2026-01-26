/**
 * @fileoverview Streak Service - Gestion de rachas de quizzes para e-SORI
 *
 * Este servicio maneja el sistema de rachas (streaks) que incentiva
 * a los usuarios a completar quizzes diariamente. Incluye:
 * - Seguimiento de dias consecutivos
 * - Deteccion de rachas en riesgo
 * - Uso automatico de shields para proteger rachas
 * - Otorgamiento de bonuses por milestones
 *
 * @author e-SORI Gamification Team
 * @version 2.0.0
 */

import { prisma } from '@/lib/prisma';
import { UserStreak, Prisma } from '@prisma/client';
import { walletService } from './walletService';
import { ledgerService, LEDGER_REASONS } from './ledgerService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Estado completo de la racha de un usuario
 */
export interface StreakStatus {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  streakStartDate: Date | null;
  isAtRisk: boolean;
  hoursUntilExpiry: number | null;
  shieldsAvailable: number;
  shieldsUsedInCurrentStreak: number;
  nextMilestone: StreakMilestone | null;
  daysToNextMilestone: number | null;
  isFrozen: boolean;
  freezeExpiresAt: Date | null;
}

/**
 * Resultado de actualizar la racha
 */
export interface StreakUpdateResult {
  success: boolean;
  previousStreak: number;
  newStreak: number;
  isNewRecord: boolean;
  milestoneReached: StreakMilestone | null;
  bonusAwarded: StreakBonus | null;
  shieldUsed: boolean;
  message: string;
}

/**
 * Milestone de racha con sus recompensas
 */
export interface StreakMilestone {
  days: number;
  name: string;
  xpBonus: number;
  coinsBonus: number;
  shieldsBonus: number;
  badgeCode: string | null;
}

/**
 * Bonus otorgado por milestone
 */
export interface StreakBonus {
  milestone: StreakMilestone;
  xpAwarded: number;
  coinsAwarded: number;
  shieldsAwarded: number;
}

/**
 * Resultado de verificacion de riesgo
 */
export interface StreakRiskCheck {
  isAtRisk: boolean;
  currentStreak: number;
  hoursRemaining: number | null;
  canUseShield: boolean;
  shieldsAvailable: number;
  recommendation: string;
}

// ============================================================================
// CONSTANTS - STREAK CONFIGURATION
// ============================================================================

/**
 * Milestones de racha con sus recompensas
 *
 * Los valores estan calibrados para:
 * - Incentivar habitos diarios
 * - Recompensar consistencia a largo plazo
 * - Hacer que los shields sean valiosos pero alcanzables
 */
export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    name: 'Racha de 3 dias',
    xpBonus: 50,
    coinsBonus: 25,
    shieldsBonus: 0,
    badgeCode: null,
  },
  {
    days: 7,
    name: 'Semana Perfecta',
    xpBonus: 150,
    coinsBonus: 75,
    shieldsBonus: 1,
    badgeCode: 'STREAK_WEEK',
  },
  {
    days: 14,
    name: 'Dos Semanas Invicto',
    xpBonus: 300,
    coinsBonus: 150,
    shieldsBonus: 1,
    badgeCode: 'STREAK_FORTNIGHT',
  },
  {
    days: 21,
    name: 'Tres Semanas de Fuego',
    xpBonus: 500,
    coinsBonus: 250,
    shieldsBonus: 1,
    badgeCode: 'STREAK_21',
  },
  {
    days: 30,
    name: 'Maestro del Mes',
    xpBonus: 1000,
    coinsBonus: 500,
    shieldsBonus: 2,
    badgeCode: 'STREAK_MONTH',
  },
  {
    days: 60,
    name: 'Leyenda de 60 dias',
    xpBonus: 2000,
    coinsBonus: 1000,
    shieldsBonus: 3,
    badgeCode: 'STREAK_60',
  },
  {
    days: 90,
    name: 'Titan Trimestral',
    xpBonus: 3500,
    coinsBonus: 1750,
    shieldsBonus: 5,
    badgeCode: 'STREAK_90',
  },
  {
    days: 180,
    name: 'Heroe Semestral',
    xpBonus: 7500,
    coinsBonus: 3750,
    shieldsBonus: 7,
    badgeCode: 'STREAK_180',
  },
  {
    days: 365,
    name: 'Campeon del Ano',
    xpBonus: 20000,
    coinsBonus: 10000,
    shieldsBonus: 15,
    badgeCode: 'STREAK_YEAR',
  },
];

/**
 * Horas de gracia antes de perder la racha
 *
 * Despues de completar un quiz, el usuario tiene hasta las 23:59:59
 * del dia siguiente para completar otro quiz y mantener la racha.
 *
 * Efectivamente, esto da ~48 horas desde el ultimo quiz como maximo.
 */
export const STREAK_EXPIRY_HOURS = 48;

/**
 * Hora limite del dia para completar el quiz (23:59:59)
 */
export const DAILY_RESET_HOUR = 0; // Medianoche

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Error cuando no se encuentra la racha del usuario
 */
export class StreakNotFoundError extends Error {
  constructor(userId: string) {
    super(`Racha no encontrada para usuario ${userId}`);
    this.name = 'StreakNotFoundError';
  }
}

/**
 * Error de operacion de racha invalida
 */
export class InvalidStreakOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStreakOperationError';
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtiene la fecha actual normalizada (inicio del dia en UTC)
 */
function getToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Obtiene el inicio del dia de una fecha dada
 */
function startOfDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Calcula la diferencia en dias entre dos fechas
 */
function daysBetween(date1: Date, date2: Date): number {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si dos fechas son del mismo dia
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return startOfDay(date1).getTime() === startOfDay(date2).getTime();
}

/**
 * Verifica si date1 es el dia anterior a date2
 */
function isYesterday(date1: Date, date2: Date): boolean {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  const diffDays = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

// ============================================================================
// STREAK SERVICE
// ============================================================================

/**
 * Servicio de Streaks - Gestion de rachas diarias
 *
 * Proporciona funciones para actualizar, verificar y recompensar
 * rachas de actividad de los usuarios.
 */
export const streakService = {
  /**
   * Obtiene o crea el registro de racha para un usuario.
   *
   * @param userId - ID del usuario
   * @returns Registro de racha del usuario
   */
  async getOrCreateStreak(userId: string): Promise<UserStreak> {
    let streak = await prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          shieldsUsedCount: 0,
        },
      });
    }

    return streak;
  },

  /**
   * Obtiene el estado completo de la racha de un usuario.
   *
   * Incluye informacion sobre:
   * - Racha actual y record
   * - Si esta en riesgo de perderse
   * - Shields disponibles
   * - Proximo milestone
   *
   * @param userId - ID del usuario
   * @returns Estado completo de la racha
   *
   * @example
   * ```typescript
   * const status = await streakService.getStreakStatus('user123');
   * if (status.isAtRisk) {
   *   console.log(`Tu racha de ${status.currentStreak} dias esta en riesgo!`);
   *   console.log(`Te quedan ${status.hoursUntilExpiry} horas`);
   * }
   * ```
   */
  async getStreakStatus(userId: string): Promise<StreakStatus> {
    const streak = await this.getOrCreateStreak(userId);
    const shields = await walletService.getBalance(userId, 'SHIELDS');
    const today = getToday();

    // Calcular si esta en riesgo
    let isAtRisk = false;
    let hoursUntilExpiry: number | null = null;
    let isFrozen = false;

    if (streak.lastActivityDate && streak.currentStreak > 0) {
      // Verificar si esta congelado por shield
      if (streak.freezeUntil && streak.freezeUntil > new Date()) {
        isFrozen = true;
      } else {
        const daysSinceActivity = daysBetween(streak.lastActivityDate, today);

        if (daysSinceActivity === 1) {
          // Esta en el dia siguiente, tiene hasta medianoche
          isAtRisk = true;
          const endOfToday = new Date(today);
          endOfToday.setUTCHours(23, 59, 59, 999);
          hoursUntilExpiry = Math.max(
            0,
            (endOfToday.getTime() - new Date().getTime()) / (1000 * 60 * 60)
          );
        } else if (daysSinceActivity >= 2) {
          // Ya perdio la racha (se procesara en la siguiente actualizacion)
          isAtRisk = true;
          hoursUntilExpiry = 0;
        }
      }
    }

    // Encontrar proximo milestone
    const nextMilestone = this.getNextMilestone(streak.currentStreak);
    const daysToNextMilestone = nextMilestone
      ? nextMilestone.days - streak.currentStreak
      : null;

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      streakStartDate: streak.streakStartDate,
      isAtRisk,
      hoursUntilExpiry: hoursUntilExpiry !== null ? Math.round(hoursUntilExpiry * 10) / 10 : null,
      shieldsAvailable: shields,
      shieldsUsedInCurrentStreak: streak.shieldsUsedCount,
      nextMilestone,
      daysToNextMilestone,
      isFrozen,
      freezeExpiresAt: streak.freezeUntil,
    };
  },

  /**
   * Actualiza la racha despues de que el usuario complete un quiz.
   *
   * Esta funcion:
   * 1. Verifica si ya completo quiz hoy (no duplicar)
   * 2. Verifica si la racha estaba en riesgo y usa shield si necesario
   * 3. Incrementa la racha
   * 4. Verifica y otorga milestones alcanzados
   * 5. Actualiza el record personal si corresponde
   *
   * @param userId - ID del usuario
   * @param quizAttemptId - ID del intento de quiz (para referencia)
   * @returns Resultado de la actualizacion
   *
   * @example
   * ```typescript
   * const result = await streakService.updateStreak('user123', 'quiz_456');
   *
   * if (result.isNewRecord) {
   *   console.log(`Nuevo record! ${result.newStreak} dias consecutivos`);
   * }
   *
   * if (result.milestoneReached) {
   *   console.log(`Milestone alcanzado: ${result.milestoneReached.name}`);
   * }
   * ```
   */
  async updateStreak(
    userId: string,
    quizAttemptId?: string
  ): Promise<StreakUpdateResult> {
    return prisma.$transaction(async (tx) => {
      const streak = await this.getOrCreateStreak(userId);
      const today = getToday();
      const previousStreak = streak.currentStreak;
      let newStreak = previousStreak;
      let shieldUsed = false;
      let isNewRecord = false;
      let milestoneReached: StreakMilestone | null = null;
      let bonusAwarded: StreakBonus | null = null;
      let message = '';

      // Caso 1: Ya completo quiz hoy
      if (streak.lastActivityDate && isSameDay(streak.lastActivityDate, today)) {
        return {
          success: true,
          previousStreak,
          newStreak: previousStreak,
          isNewRecord: false,
          milestoneReached: null,
          bonusAwarded: null,
          shieldUsed: false,
          message: 'Ya completaste el quiz de hoy. Vuelve manana para continuar tu racha.',
        };
      }

      // Caso 2: Es el primer quiz o continuando racha
      if (!streak.lastActivityDate) {
        // Primer quiz del usuario
        newStreak = 1;
        message = 'Has comenzado tu racha! Vuelve manana para continuarla.';
      } else if (isYesterday(streak.lastActivityDate, today)) {
        // Continuando racha normal (actividad fue ayer)
        newStreak = previousStreak + 1;
        message = `Racha de ${newStreak} dias! Sigue asi.`;
      } else {
        // Han pasado mas de 1 dia desde la ultima actividad
        const daysSinceActivity = daysBetween(streak.lastActivityDate, today);

        if (daysSinceActivity === 2) {
          // Perdio un dia, verificar shield
          const shields = await walletService.getBalance(userId, 'SHIELDS');

          if (shields > 0) {
            // Usar shield automaticamente
            await walletService.useShield(userId, `streak_protect_${today.toISOString()}`);
            shieldUsed = true;
            newStreak = previousStreak + 1;
            message = `Shield usado! Tu racha de ${newStreak} dias continua.`;

            // Actualizar contador de shields usados
            await tx.userStreak.update({
              where: { userId },
              data: {
                shieldsUsedCount: { increment: 1 },
              },
            });
          } else {
            // Sin shield, racha perdida
            newStreak = 1;
            message = `Tu racha de ${previousStreak} dias se ha perdido. Empezamos de nuevo!`;
          }
        } else {
          // Mas de 2 dias sin actividad, racha perdida definitivamente
          newStreak = 1;
          message = `Tu racha de ${previousStreak} dias se ha perdido. Empezamos de nuevo!`;
        }
      }

      // Verificar si es nuevo record
      const newLongestStreak = Math.max(streak.longestStreak, newStreak);
      isNewRecord = newStreak > streak.longestStreak;

      if (isNewRecord) {
        message += ` Nuevo record personal: ${newStreak} dias!`;
      }

      // Actualizar streak en DB
      const streakStartDate = newStreak === 1 ? today : streak.streakStartDate;

      await tx.userStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: today,
          streakStartDate,
          shieldsUsedCount: newStreak === 1 ? 0 : streak.shieldsUsedCount,
          freezeUntil: null, // Limpiar freeze si habia
        },
      });

      // Verificar y otorgar milestone
      milestoneReached = this.getMilestoneForDays(newStreak);

      if (milestoneReached) {
        bonusAwarded = await this.awardStreakBonus(userId, newStreak, tx);
        if (bonusAwarded) {
          message += ` Milestone "${milestoneReached.name}" alcanzado!`;
        }
      }

      return {
        success: true,
        previousStreak,
        newStreak,
        isNewRecord,
        milestoneReached,
        bonusAwarded,
        shieldUsed,
        message,
      };
    });
  },

  /**
   * Verifica si la racha del usuario esta en riesgo.
   *
   * @param userId - ID del usuario
   * @returns Informacion sobre el estado de riesgo
   *
   * @example
   * ```typescript
   * const risk = await streakService.checkStreakAtRisk('user123');
   * if (risk.isAtRisk) {
   *   // Enviar notificacion push
   *   sendPushNotification(userId, `Tu racha de ${risk.currentStreak} dias esta en riesgo!`);
   * }
   * ```
   */
  async checkStreakAtRisk(userId: string): Promise<StreakRiskCheck> {
    const streak = await this.getOrCreateStreak(userId);
    const shields = await walletService.getBalance(userId, 'SHIELDS');
    const today = getToday();

    if (!streak.lastActivityDate || streak.currentStreak === 0) {
      return {
        isAtRisk: false,
        currentStreak: 0,
        hoursRemaining: null,
        canUseShield: false,
        shieldsAvailable: shields,
        recommendation: 'Completa tu primer quiz para comenzar una racha.',
      };
    }

    // Verificar si esta congelado
    if (streak.freezeUntil && streak.freezeUntil > new Date()) {
      const hoursRemaining =
        (streak.freezeUntil.getTime() - new Date().getTime()) / (1000 * 60 * 60);
      return {
        isAtRisk: false,
        currentStreak: streak.currentStreak,
        hoursRemaining: Math.round(hoursRemaining),
        canUseShield: false,
        shieldsAvailable: shields,
        recommendation: `Tu racha esta protegida por un shield hasta ${streak.freezeUntil.toLocaleDateString()}.`,
      };
    }

    const daysSinceActivity = daysBetween(streak.lastActivityDate, today);

    if (daysSinceActivity === 0) {
      // Completo quiz hoy
      return {
        isAtRisk: false,
        currentStreak: streak.currentStreak,
        hoursRemaining: null,
        canUseShield: false,
        shieldsAvailable: shields,
        recommendation: 'Excelente! Ya completaste el quiz de hoy. Vuelve manana.',
      };
    }

    if (daysSinceActivity === 1) {
      // Esta en riesgo, tiene hasta medianoche
      const endOfToday = new Date(today);
      endOfToday.setUTCHours(23, 59, 59, 999);
      const hoursRemaining =
        (endOfToday.getTime() - new Date().getTime()) / (1000 * 60 * 60);

      return {
        isAtRisk: true,
        currentStreak: streak.currentStreak,
        hoursRemaining: Math.max(0, Math.round(hoursRemaining * 10) / 10),
        canUseShield: shields > 0,
        shieldsAvailable: shields,
        recommendation: `Tu racha de ${streak.currentStreak} dias esta en riesgo! Completa un quiz antes de medianoche.`,
      };
    }

    // daysSinceActivity >= 2 - Racha ya perdida (pendiente de reset)
    return {
      isAtRisk: true,
      currentStreak: streak.currentStreak,
      hoursRemaining: 0,
      canUseShield: shields > 0 && daysSinceActivity === 2, // Solo puede usar shield si fue hace 2 dias
      shieldsAvailable: shields,
      recommendation:
        daysSinceActivity === 2 && shields > 0
          ? `Tu racha de ${streak.currentStreak} dias esta en riesgo! Completa un quiz ahora y usaremos un shield.`
          : `Tu racha de ${streak.currentStreak} dias se perdio. Completa un quiz para empezar de nuevo.`,
    };
  },

  /**
   * Obtiene el milestone para una cantidad exacta de dias.
   *
   * Solo retorna un milestone si el numero de dias coincide exactamente
   * con un milestone definido (para evitar otorgar el mismo milestone
   * multiples veces).
   *
   * @param days - Numero de dias de racha
   * @returns El milestone si existe, null si no
   */
  getMilestoneForDays(days: number): StreakMilestone | null {
    return STREAK_MILESTONES.find((m) => m.days === days) || null;
  },

  /**
   * Obtiene el proximo milestone que el usuario puede alcanzar.
   *
   * @param currentDays - Dias actuales de racha
   * @returns Proximo milestone o null si ya alcanzo todos
   */
  getNextMilestone(currentDays: number): StreakMilestone | null {
    return STREAK_MILESTONES.find((m) => m.days > currentDays) || null;
  },

  /**
   * Obtiene todos los milestones que el usuario ha alcanzado.
   *
   * @param days - Dias de racha
   * @returns Lista de milestones alcanzados
   */
  getAchievedMilestones(days: number): StreakMilestone[] {
    return STREAK_MILESTONES.filter((m) => m.days <= days);
  },

  /**
   * Otorga el bonus por alcanzar un milestone de racha.
   *
   * Esta funcion es llamada internamente por updateStreak cuando
   * se alcanza un milestone. No debe llamarse directamente.
   *
   * @param userId - ID del usuario
   * @param days - Dias de racha alcanzados
   * @param tx - Transaccion Prisma
   * @returns Bonus otorgado o null si no hay milestone para esos dias
   */
  async awardStreakBonus(
    userId: string,
    days: number,
    tx?: Prisma.TransactionClient
  ): Promise<StreakBonus | null> {
    const milestone = this.getMilestoneForDays(days);

    if (!milestone) {
      return null;
    }

    const client = tx || prisma;
    const reference = `streak_milestone_${days}_${Date.now()}`;

    // Generar clave de idempotencia unica para este milestone
    const idempotencyBase = `${userId}_streak_${days}`;

    // Otorgar XP
    if (milestone.xpBonus > 0) {
      try {
        await ledgerService.createEntry(
          {
            userId,
            walletType: 'XP',
            transactionType: 'CREDIT',
            delta: milestone.xpBonus,
            reason: LEDGER_REASONS.STREAK_MILESTONE,
            reference,
            metadata: { milestone: milestone.name, days },
            idempotencyKey: `${idempotencyBase}_xp`,
          },
          tx
        );
      } catch (error) {
        // Ignorar duplicados (ya se otorgo este milestone)
        if (!(error instanceof Error && error.name === 'DuplicateTransactionError')) {
          throw error;
        }
        return null; // Milestone ya otorgado
      }
    }

    // Otorgar COINS
    if (milestone.coinsBonus > 0) {
      await ledgerService.createEntry(
        {
          userId,
          walletType: 'COINS',
          transactionType: 'CREDIT',
          delta: milestone.coinsBonus,
          reason: LEDGER_REASONS.STREAK_MILESTONE,
          reference,
          metadata: { milestone: milestone.name, days },
          idempotencyKey: `${idempotencyBase}_coins`,
        },
        tx
      );
    }

    // Otorgar SHIELDS
    if (milestone.shieldsBonus > 0) {
      await ledgerService.createEntry(
        {
          userId,
          walletType: 'SHIELDS',
          transactionType: 'CREDIT',
          delta: milestone.shieldsBonus,
          reason: LEDGER_REASONS.STREAK_MILESTONE,
          reference,
          metadata: { milestone: milestone.name, days },
          idempotencyKey: `${idempotencyBase}_shields`,
        },
        tx
      );
    }

    // Otorgar badge si existe
    if (milestone.badgeCode) {
      const badge = await client.badge.findUnique({
        where: { code: milestone.badgeCode },
      });

      if (badge) {
        await client.userBadge.upsert({
          where: {
            userId_badgeId: { userId, badgeId: badge.id },
          },
          create: {
            userId,
            badgeId: badge.id,
          },
          update: {}, // No hacer nada si ya existe
        });
      }
    }

    return {
      milestone,
      xpAwarded: milestone.xpBonus,
      coinsAwarded: milestone.coinsBonus,
      shieldsAwarded: milestone.shieldsBonus,
    };
  },

  /**
   * Congela la racha del usuario por un periodo usando un shield.
   *
   * Esto es util cuando el usuario sabe que no podra completar quizzes
   * por un tiempo (vacaciones, etc.).
   *
   * @param userId - ID del usuario
   * @param days - Dias a congelar (1-7)
   * @returns Resultado de la operacion
   */
  async freezeStreak(
    userId: string,
    days: number = 1
  ): Promise<{ success: boolean; freezeUntil: Date | null; message: string }> {
    if (days < 1 || days > 7) {
      throw new InvalidStreakOperationError('Solo puedes congelar entre 1 y 7 dias');
    }

    const shields = await walletService.getBalance(userId, 'SHIELDS');

    if (shields < 1) {
      return {
        success: false,
        freezeUntil: null,
        message: 'No tienes shields disponibles para congelar tu racha.',
      };
    }

    // Usar shield
    await walletService.useShield(userId, `freeze_${days}d`);

    // Calcular fecha de descongelamiento
    const freezeUntil = new Date();
    freezeUntil.setDate(freezeUntil.getDate() + days);
    freezeUntil.setUTCHours(23, 59, 59, 999);

    // Actualizar racha
    await prisma.userStreak.update({
      where: { userId },
      data: {
        freezeUntil,
        shieldsUsedCount: { increment: 1 },
      },
    });

    return {
      success: true,
      freezeUntil,
      message: `Tu racha esta congelada hasta ${freezeUntil.toLocaleDateString()}. No perderas tu racha durante este tiempo.`,
    };
  },

  /**
   * Reinicia la racha de un usuario (uso administrativo).
   *
   * @param userId - ID del usuario
   * @param preserveRecord - Si mantener el record historico
   */
  async resetStreak(userId: string, preserveRecord: boolean = true): Promise<void> {
    const streak = await this.getOrCreateStreak(userId);

    await prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: 0,
        longestStreak: preserveRecord ? streak.longestStreak : 0,
        lastActivityDate: null,
        streakStartDate: null,
        shieldsUsedCount: 0,
        freezeUntil: null,
      },
    });
  },

  /**
   * Obtiene el ranking de rachas mas largas.
   *
   * @param limit - Numero de usuarios a retornar
   * @returns Lista de usuarios con sus rachas
   */
  async getStreakLeaderboard(
    limit: number = 10
  ): Promise<Array<{ userId: string; userName: string; currentStreak: number; longestStreak: number }>> {
    const streaks = await prisma.userStreak.findMany({
      where: {
        currentStreak: { gt: 0 },
      },
      orderBy: { currentStreak: 'desc' },
      take: limit,
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return streaks.map((s) => ({
      userId: s.userId,
      userName: s.user.name || 'Usuario',
      currentStreak: s.currentStreak,
      longestStreak: s.longestStreak,
    }));
  },

  /**
   * Obtiene estadisticas globales de rachas.
   */
  async getGlobalStreakStats(): Promise<{
    totalActiveStreaks: number;
    averageStreak: number;
    longestActiveStreak: number;
    usersWithWeekStreak: number;
    usersWithMonthStreak: number;
  }> {
    const stats = await prisma.userStreak.aggregate({
      where: { currentStreak: { gt: 0 } },
      _count: { id: true },
      _avg: { currentStreak: true },
      _max: { currentStreak: true },
    });

    const [weekStreaks, monthStreaks] = await Promise.all([
      prisma.userStreak.count({ where: { currentStreak: { gte: 7 } } }),
      prisma.userStreak.count({ where: { currentStreak: { gte: 30 } } }),
    ]);

    return {
      totalActiveStreaks: stats._count.id,
      averageStreak: Math.round((stats._avg.currentStreak || 0) * 10) / 10,
      longestActiveStreak: stats._max.currentStreak || 0,
      usersWithWeekStreak: weekStreaks,
      usersWithMonthStreak: monthStreaks,
    };
  },
};

export default streakService;
