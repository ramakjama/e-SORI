/**
 * @fileoverview Wallet Service - Gestion de XP, COINS y SHIELDS para e-SORI
 *
 * Este servicio maneja todas las operaciones relacionadas con los wallets
 * de los usuarios en el sistema de gamificacion:
 * - XP (Experiencia): Determina el nivel del usuario
 * - COINS: Moneda virtual para la tienda
 * - SHIELDS: Protegen las rachas de quizzes
 *
 * Todas las operaciones se registran en el Ledger para auditoria completa.
 *
 * @author e-SORI Gamification Team
 * @version 2.0.0
 */

import { prisma } from '@/lib/prisma';
import { WalletType, UserLevel, Prisma } from '@prisma/client';
import {
  ledgerService,
  LEDGER_REASONS,
  type LedgerReason,
  InsufficientBalanceError,
  DuplicateTransactionError,
} from './ledgerService';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Estructura del wallet completo de un usuario
 */
export interface UserWallet {
  xp: WalletBalance;
  coins: WalletBalance;
  shields: WalletBalance;
  level: UserLevel;
  levelProgress: LevelProgress;
}

/**
 * Balance de un tipo de wallet
 */
export interface WalletBalance {
  balance: number;
  updatedAt: Date;
}

/**
 * Progreso hacia el siguiente nivel
 */
export interface LevelProgress {
  currentLevel: UserLevel;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number | null;
  progressPercent: number;
  xpToNextLevel: number | null;
}

/**
 * Resultado de una operacion de wallet
 */
export interface WalletOperationResult {
  success: boolean;
  newBalance: number;
  previousBalance: number;
  delta: number;
  levelUp?: LevelUpInfo;
  ledgerEntryId: string;
}

/**
 * Informacion de subida de nivel
 */
export interface LevelUpInfo {
  previousLevel: UserLevel;
  newLevel: UserLevel;
  bonusCoins: number;
}

/**
 * Resultado de uso de shield
 */
export interface ShieldUseResult {
  success: boolean;
  shieldsRemaining: number;
  streakProtected: boolean;
  message: string;
}

// ============================================================================
// CONSTANTS - LEVEL THRESHOLDS
// ============================================================================

/**
 * Umbrales de XP para cada nivel
 * Los valores estan calibrados para:
 * - BRONCE: Usuarios nuevos (0-999 XP)
 * - PLATA: Usuarios activos regulares (1000-4999 XP)
 * - ORO: Usuarios muy comprometidos (5000-14999 XP)
 * - PLATINO: Top users (15000+ XP)
 */
export const LEVEL_THRESHOLDS: Record<UserLevel, { min: number; max: number | null }> = {
  BRONCE: { min: 0, max: 999 },
  PLATA: { min: 1000, max: 4999 },
  ORO: { min: 5000, max: 14999 },
  PLATINO: { min: 15000, max: null },
};

/**
 * Bonus de COINS al subir de nivel
 */
export const LEVEL_UP_BONUS: Record<UserLevel, number> = {
  BRONCE: 0,      // Nivel inicial, sin bonus
  PLATA: 100,     // Bonus por llegar a Plata
  ORO: 250,       // Bonus por llegar a Oro
  PLATINO: 500,   // Bonus por llegar a Platino
};

/**
 * Orden de niveles para comparaciones
 */
const LEVEL_ORDER: UserLevel[] = ['BRONCE', 'PLATA', 'ORO', 'PLATINO'];

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Error cuando no se encuentra el wallet del usuario
 */
export class WalletNotFoundError extends Error {
  constructor(userId: string, walletType?: WalletType) {
    const typeMsg = walletType ? ` de tipo ${walletType}` : '';
    super(`Wallet${typeMsg} no encontrado para usuario ${userId}`);
    this.name = 'WalletNotFoundError';
  }
}

/**
 * Error de operacion invalida
 */
export class InvalidWalletOperationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWalletOperationError';
  }
}

// Re-exportar errores del ledger
export { InsufficientBalanceError, DuplicateTransactionError };

// ============================================================================
// WALLET SERVICE
// ============================================================================

/**
 * Servicio de Wallet - Gestion de XP, COINS y SHIELDS
 *
 * Proporciona funciones para obtener balances, agregar/gastar monedas
 * y manejar la progresion de niveles basada en XP.
 */
export const walletService = {
  /**
   * Obtiene el wallet completo de un usuario con todos los tipos de balance.
   *
   * Si el usuario no tiene wallets creados, los crea con balance 0.
   *
   * @param userId - ID del usuario
   * @returns Wallet completo con XP, COINS, SHIELDS y nivel
   *
   * @example
   * ```typescript
   * const wallet = await walletService.getWallet('user123');
   * console.log(`XP: ${wallet.xp.balance}`);
   * console.log(`Nivel: ${wallet.level}`);
   * console.log(`Progreso: ${wallet.levelProgress.progressPercent}%`);
   * ```
   */
  async getWallet(userId: string): Promise<UserWallet> {
    // Obtener todos los wallets del usuario
    const wallets = await prisma.wallet.findMany({
      where: { userId },
    });

    // Crear mapa de wallets existentes
    const walletMap = new Map(wallets.map((w) => [w.type, w]));

    // Asegurar que existen los tres tipos de wallet
    const walletTypes: WalletType[] = ['XP', 'COINS', 'SHIELDS'];
    const missingTypes = walletTypes.filter((type) => !walletMap.has(type));

    if (missingTypes.length > 0) {
      // Crear wallets faltantes
      await prisma.wallet.createMany({
        data: missingTypes.map((type) => ({
          userId,
          type,
          balance: 0,
        })),
        skipDuplicates: true,
      });

      // Recargar wallets
      const updatedWallets = await prisma.wallet.findMany({
        where: { userId },
      });
      updatedWallets.forEach((w) => walletMap.set(w.type, w));
    }

    const xpWallet = walletMap.get('XP')!;
    const coinsWallet = walletMap.get('COINS')!;
    const shieldsWallet = walletMap.get('SHIELDS')!;

    // Calcular nivel y progreso
    const level = this.calculateLevel(xpWallet.balance);
    const levelProgress = this.calculateLevelProgress(xpWallet.balance);

    return {
      xp: {
        balance: xpWallet.balance,
        updatedAt: xpWallet.updatedAt,
      },
      coins: {
        balance: coinsWallet.balance,
        updatedAt: coinsWallet.updatedAt,
      },
      shields: {
        balance: shieldsWallet.balance,
        updatedAt: shieldsWallet.updatedAt,
      },
      level,
      levelProgress,
    };
  },

  /**
   * Calcula el nivel basado en la cantidad de XP.
   *
   * @param xp - Cantidad de XP
   * @returns Nivel correspondiente
   *
   * @example
   * ```typescript
   * walletService.calculateLevel(500);   // BRONCE
   * walletService.calculateLevel(1500);  // PLATA
   * walletService.calculateLevel(8000);  // ORO
   * walletService.calculateLevel(20000); // PLATINO
   * ```
   */
  calculateLevel(xp: number): UserLevel {
    if (xp >= LEVEL_THRESHOLDS.PLATINO.min) return 'PLATINO';
    if (xp >= LEVEL_THRESHOLDS.ORO.min) return 'ORO';
    if (xp >= LEVEL_THRESHOLDS.PLATA.min) return 'PLATA';
    return 'BRONCE';
  },

  /**
   * Calcula el progreso detallado hacia el siguiente nivel.
   *
   * @param xp - Cantidad de XP actual
   * @returns Objeto con detalles del progreso
   */
  calculateLevelProgress(xp: number): LevelProgress {
    const currentLevel = this.calculateLevel(xp);
    const threshold = LEVEL_THRESHOLDS[currentLevel];
    const currentLevelIndex = LEVEL_ORDER.indexOf(currentLevel);
    const nextLevel = LEVEL_ORDER[currentLevelIndex + 1] as UserLevel | undefined;

    if (!nextLevel) {
      // Usuario en nivel maximo (PLATINO)
      return {
        currentLevel,
        currentXP: xp,
        xpForCurrentLevel: threshold.min,
        xpForNextLevel: null,
        progressPercent: 100,
        xpToNextLevel: null,
      };
    }

    const xpForNextLevel = LEVEL_THRESHOLDS[nextLevel].min;
    const xpInCurrentLevel = xp - threshold.min;
    const xpRangeForLevel = xpForNextLevel - threshold.min;
    const progressPercent = Math.min(
      Math.round((xpInCurrentLevel / xpRangeForLevel) * 100),
      100
    );

    return {
      currentLevel,
      currentXP: xp,
      xpForCurrentLevel: threshold.min,
      xpForNextLevel,
      progressPercent,
      xpToNextLevel: xpForNextLevel - xp,
    };
  },

  /**
   * Agrega XP al usuario y actualiza su nivel si corresponde.
   *
   * Esta funcion:
   * 1. Registra la transaccion en el Ledger
   * 2. Actualiza el balance de XP
   * 3. Verifica si hay cambio de nivel
   * 4. Otorga bonus de COINS si sube de nivel
   * 5. Actualiza el nivel en el modelo User
   *
   * @param userId - ID del usuario
   * @param amount - Cantidad de XP a agregar (positivo)
   * @param reason - Razon de la transaccion
   * @param reference - Referencia externa opcional
   * @param metadata - Metadatos adicionales opcionales
   * @returns Resultado de la operacion con informacion de level up si aplica
   *
   * @example
   * ```typescript
   * const result = await walletService.addXP(
   *   'user123',
   *   50,
   *   'QUIZ_COMPLETED',
   *   'quiz_attempt_456',
   *   { score: 5, totalQuestions: 5 }
   * );
   *
   * if (result.levelUp) {
   *   console.log(`Subiste de ${result.levelUp.previousLevel} a ${result.levelUp.newLevel}!`);
   * }
   * ```
   */
  async addXP(
    userId: string,
    amount: number,
    reason: LedgerReason | string,
    reference?: string,
    metadata?: Record<string, unknown>
  ): Promise<WalletOperationResult> {
    if (amount <= 0) {
      throw new InvalidWalletOperationError('La cantidad de XP debe ser positiva');
    }

    return prisma.$transaction(async (tx) => {
      // Obtener nivel actual antes de agregar XP
      const currentWallet = await tx.wallet.findUnique({
        where: { userId_type: { userId, type: 'XP' } },
      });
      const previousBalance = currentWallet?.balance || 0;
      const previousLevel = this.calculateLevel(previousBalance);

      // Crear entrada en ledger (esto actualiza el wallet)
      const ledgerEntry = await ledgerService.createEntry(
        {
          userId,
          walletType: 'XP',
          transactionType: 'CREDIT',
          delta: amount,
          reason,
          reference,
          metadata,
        },
        tx
      );

      const newBalance = ledgerEntry.balanceAfter;
      const newLevel = this.calculateLevel(newBalance);

      // Verificar si hubo level up
      let levelUp: LevelUpInfo | undefined;

      if (LEVEL_ORDER.indexOf(newLevel) > LEVEL_ORDER.indexOf(previousLevel)) {
        levelUp = {
          previousLevel,
          newLevel,
          bonusCoins: LEVEL_UP_BONUS[newLevel],
        };

        // Actualizar nivel en User
        await tx.user.update({
          where: { id: userId },
          data: { level: newLevel },
        });

        // Otorgar bonus de COINS por level up
        if (levelUp.bonusCoins > 0) {
          await ledgerService.createEntry(
            {
              userId,
              walletType: 'COINS',
              transactionType: 'CREDIT',
              delta: levelUp.bonusCoins,
              reason: LEDGER_REASONS.LEVEL_UP_BONUS,
              reference: ledgerEntry.id,
              metadata: {
                previousLevel,
                newLevel,
                bonusType: 'LEVEL_UP',
              },
            },
            tx
          );
        }
      }

      return {
        success: true,
        newBalance,
        previousBalance,
        delta: amount,
        levelUp,
        ledgerEntryId: ledgerEntry.id,
      };
    });
  },

  /**
   * Agrega COINS al usuario.
   *
   * @param userId - ID del usuario
   * @param amount - Cantidad de COINS a agregar (positivo)
   * @param reason - Razon de la transaccion
   * @param reference - Referencia externa opcional
   * @param metadata - Metadatos adicionales opcionales
   * @returns Resultado de la operacion
   *
   * @example
   * ```typescript
   * await walletService.addCoins(
   *   'user123',
   *   25,
   *   'QUIZ_COMPLETED',
   *   'quiz_attempt_456'
   * );
   * ```
   */
  async addCoins(
    userId: string,
    amount: number,
    reason: LedgerReason | string,
    reference?: string,
    metadata?: Record<string, unknown>
  ): Promise<WalletOperationResult> {
    if (amount <= 0) {
      throw new InvalidWalletOperationError('La cantidad de COINS debe ser positiva');
    }

    const ledgerEntry = await ledgerService.createEntry({
      userId,
      walletType: 'COINS',
      transactionType: 'CREDIT',
      delta: amount,
      reason,
      reference,
      metadata,
    });

    return {
      success: true,
      newBalance: ledgerEntry.balanceAfter,
      previousBalance: ledgerEntry.balanceBefore,
      delta: amount,
      ledgerEntryId: ledgerEntry.id,
    };
  },

  /**
   * Gasta COINS del usuario.
   *
   * @param userId - ID del usuario
   * @param amount - Cantidad de COINS a gastar (positivo)
   * @param reason - Razon de la transaccion
   * @param reference - Referencia externa opcional (orderId, etc.)
   * @param metadata - Metadatos adicionales opcionales
   * @returns Resultado de la operacion
   * @throws {InsufficientBalanceError} Si no hay COINS suficientes
   *
   * @example
   * ```typescript
   * try {
   *   await walletService.spendCoins(
   *     'user123',
   *     100,
   *     'STORE_PURCHASE',
   *     'order_789'
   *   );
   * } catch (error) {
   *   if (error instanceof InsufficientBalanceError) {
   *     console.log(`Necesitas ${error.requestedAmount - error.currentBalance} COINS mas`);
   *   }
   * }
   * ```
   */
  async spendCoins(
    userId: string,
    amount: number,
    reason: LedgerReason | string,
    reference?: string,
    metadata?: Record<string, unknown>
  ): Promise<WalletOperationResult> {
    if (amount <= 0) {
      throw new InvalidWalletOperationError('La cantidad de COINS debe ser positiva');
    }

    const ledgerEntry = await ledgerService.createEntry({
      userId,
      walletType: 'COINS',
      transactionType: 'DEBIT',
      delta: amount,
      reason,
      reference,
      metadata,
    });

    return {
      success: true,
      newBalance: ledgerEntry.balanceAfter,
      previousBalance: ledgerEntry.balanceBefore,
      delta: -amount,
      ledgerEntryId: ledgerEntry.id,
    };
  },

  /**
   * Agrega SHIELDS al usuario.
   *
   * Los shields protegen las rachas cuando el usuario no completa
   * el quiz diario. Se obtienen por:
   * - Completar milestones de racha (7, 14, 30 dias)
   * - Compras en la tienda
   * - Premios de la ruleta
   *
   * @param userId - ID del usuario
   * @param amount - Cantidad de SHIELDS a agregar
   * @param reason - Razon de la transaccion
   * @param reference - Referencia externa opcional
   * @returns Resultado de la operacion
   *
   * @example
   * ```typescript
   * await walletService.addShields(
   *   'user123',
   *   1,
   *   'STREAK_BONUS_7',
   *   'streak_milestone_7'
   * );
   * ```
   */
  async addShields(
    userId: string,
    amount: number,
    reason: LedgerReason | string = LEDGER_REASONS.SHIELD_EARNED,
    reference?: string
  ): Promise<WalletOperationResult> {
    if (amount <= 0) {
      throw new InvalidWalletOperationError('La cantidad de SHIELDS debe ser positiva');
    }

    const ledgerEntry = await ledgerService.createEntry({
      userId,
      walletType: 'SHIELDS',
      transactionType: 'CREDIT',
      delta: amount,
      reason,
      reference,
    });

    return {
      success: true,
      newBalance: ledgerEntry.balanceAfter,
      previousBalance: ledgerEntry.balanceBefore,
      delta: amount,
      ledgerEntryId: ledgerEntry.id,
    };
  },

  /**
   * Consume 1 SHIELD para proteger la racha.
   *
   * Esta funcion es llamada automaticamente por el streakService
   * cuando detecta que la racha esta en riesgo y el usuario tiene shields.
   *
   * @param userId - ID del usuario
   * @param reference - Referencia opcional (ej: fecha protegida)
   * @returns Resultado del uso del shield
   * @throws {InsufficientBalanceError} Si no hay shields disponibles
   *
   * @example
   * ```typescript
   * const result = await walletService.useShield('user123', '2024-01-15');
   * if (result.success) {
   *   console.log('Racha protegida! Te quedan', result.shieldsRemaining, 'shields');
   * }
   * ```
   */
  async useShield(userId: string, reference?: string): Promise<ShieldUseResult> {
    try {
      const ledgerEntry = await ledgerService.createEntry({
        userId,
        walletType: 'SHIELDS',
        transactionType: 'DEBIT',
        delta: 1,
        reason: LEDGER_REASONS.SHIELD_USED,
        reference,
        metadata: {
          usedAt: new Date().toISOString(),
          protectedDate: reference || new Date().toISOString().split('T')[0],
        },
      });

      return {
        success: true,
        shieldsRemaining: ledgerEntry.balanceAfter,
        streakProtected: true,
        message: 'Shield usado exitosamente. Tu racha esta protegida.',
      };
    } catch (error) {
      if (error instanceof InsufficientBalanceError) {
        return {
          success: false,
          shieldsRemaining: 0,
          streakProtected: false,
          message: 'No tienes shields disponibles para proteger tu racha.',
        };
      }
      throw error;
    }
  },

  /**
   * Obtiene solo el balance de un tipo especifico de wallet.
   *
   * @param userId - ID del usuario
   * @param walletType - Tipo de wallet (XP, COINS, SHIELDS)
   * @returns Balance actual
   */
  async getBalance(userId: string, walletType: WalletType): Promise<number> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId_type: { userId, type: walletType } },
    });
    return wallet?.balance || 0;
  },

  /**
   * Verifica si el usuario tiene suficiente balance.
   *
   * @param userId - ID del usuario
   * @param walletType - Tipo de wallet
   * @param amount - Cantidad requerida
   * @returns true si tiene balance suficiente
   */
  async hasBalance(
    userId: string,
    walletType: WalletType,
    amount: number
  ): Promise<boolean> {
    const balance = await this.getBalance(userId, walletType);
    return balance >= amount;
  },

  /**
   * Obtiene el ranking del usuario basado en XP total.
   *
   * @param userId - ID del usuario
   * @returns Posicion en el ranking global (1-based)
   */
  async getUserRank(userId: string): Promise<number> {
    const userXP = await this.getBalance(userId, 'XP');

    const higherRanked = await prisma.wallet.count({
      where: {
        type: 'XP',
        balance: { gt: userXP },
      },
    });

    return higherRanked + 1;
  },

  /**
   * Obtiene estadisticas globales del sistema de wallets.
   *
   * @returns Estadisticas agregadas
   */
  async getGlobalStats(): Promise<{
    totalUsers: number;
    totalXPDistributed: number;
    totalCoinsDistributed: number;
    levelDistribution: Record<UserLevel, number>;
  }> {
    // Contar usuarios por nivel
    const levelCounts = await prisma.user.groupBy({
      by: ['level'],
      _count: { id: true },
    });

    const levelDistribution: Record<UserLevel, number> = {
      BRONCE: 0,
      PLATA: 0,
      ORO: 0,
      PLATINO: 0,
    };

    let totalUsers = 0;
    for (const { level, _count } of levelCounts) {
      levelDistribution[level] = _count.id;
      totalUsers += _count.id;
    }

    // Sumar totales de XP y COINS
    const [xpSum, coinsSum] = await Promise.all([
      prisma.wallet.aggregate({
        where: { type: 'XP' },
        _sum: { balance: true },
      }),
      prisma.wallet.aggregate({
        where: { type: 'COINS' },
        _sum: { balance: true },
      }),
    ]);

    return {
      totalUsers,
      totalXPDistributed: xpSum._sum.balance || 0,
      totalCoinsDistributed: coinsSum._sum.balance || 0,
      levelDistribution,
    };
  },

  /**
   * Transfiere COINS de un usuario a otro.
   *
   * Util para sistema de regalos o intercambios.
   *
   * @param fromUserId - ID del usuario que envia
   * @param toUserId - ID del usuario que recibe
   * @param amount - Cantidad a transferir
   * @param reason - Razon de la transferencia
   * @returns IDs de las entradas del ledger
   */
  async transferCoins(
    fromUserId: string,
    toUserId: string,
    amount: number,
    reason: string = 'TRANSFER'
  ): Promise<{ debitEntryId: string; creditEntryId: string }> {
    if (fromUserId === toUserId) {
      throw new InvalidWalletOperationError('No puedes transferirte a ti mismo');
    }

    if (amount <= 0) {
      throw new InvalidWalletOperationError('La cantidad debe ser positiva');
    }

    return prisma.$transaction(async (tx) => {
      // Debitar del remitente
      const debitEntry = await ledgerService.createEntry(
        {
          userId: fromUserId,
          walletType: 'COINS',
          transactionType: 'DEBIT',
          delta: amount,
          reason: `${reason}_SENT`,
          reference: toUserId,
          metadata: { toUserId, transferType: 'OUTGOING' },
        },
        tx
      );

      // Acreditar al receptor
      const creditEntry = await ledgerService.createEntry(
        {
          userId: toUserId,
          walletType: 'COINS',
          transactionType: 'CREDIT',
          delta: amount,
          reason: `${reason}_RECEIVED`,
          reference: fromUserId,
          metadata: { fromUserId, transferType: 'INCOMING' },
        },
        tx
      );

      return {
        debitEntryId: debitEntry.id,
        creditEntryId: creditEntry.id,
      };
    });
  },
};

export default walletService;
