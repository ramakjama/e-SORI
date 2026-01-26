/**
 * @fileoverview Ledger Service - Sistema append-only auditable para e-SORI
 *
 * Este servicio implementa un sistema de registro inmutable (ledger) para todas
 * las transacciones de wallet del sistema de gamificacion. Garantiza:
 * - Auditabilidad completa de todas las operaciones
 * - Idempotencia para prevenir transacciones duplicadas
 * - Consistencia de balances con validacion pre/post transaccion
 *
 * @author e-SORI Gamification Team
 * @version 2.0.0
 */

import { prisma } from '@/lib/prisma';
import { WalletType, TransactionType, Ledger, Prisma } from '@prisma/client';
import crypto from 'crypto';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Parametros para crear una entrada en el ledger
 */
export interface CreateLedgerEntryParams {
  userId: string;
  walletType: WalletType;
  transactionType: TransactionType;
  delta: number;
  reason: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  idempotencyKey?: string;
}

/**
 * Parametros para generar clave de idempotencia
 */
export interface IdempotencyKeyParams {
  userId: string;
  walletType: WalletType;
  transactionType: TransactionType;
  delta: number;
  reason: string;
  reference?: string;
}

/**
 * Opciones de filtrado para consultar el ledger
 */
export interface GetLedgerOptions {
  walletType?: WalletType;
  transactionType?: TransactionType;
  reason?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Resultado paginado del ledger
 */
export interface LedgerQueryResult {
  entries: Ledger[];
  total: number;
  hasMore: boolean;
}

/**
 * Resumen de transacciones por tipo
 */
export interface LedgerSummary {
  totalCredits: number;
  totalDebits: number;
  netBalance: number;
  transactionCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Razones estandar de transaccion */
export const LEDGER_REASONS = {
  // Quiz
  QUIZ_COMPLETED: 'QUIZ_COMPLETED',
  QUIZ_PERFECT_SCORE: 'QUIZ_PERFECT_SCORE',
  QUIZ_SPEED_BONUS: 'QUIZ_SPEED_BONUS',

  // Streaks
  STREAK_BONUS_3: 'STREAK_BONUS_3',
  STREAK_BONUS_7: 'STREAK_BONUS_7',
  STREAK_BONUS_14: 'STREAK_BONUS_14',
  STREAK_BONUS_30: 'STREAK_BONUS_30',
  STREAK_MILESTONE: 'STREAK_MILESTONE',

  // Referrals
  REFERRAL_INVITED: 'REFERRAL_INVITED',
  REFERRAL_INSTALLED: 'REFERRAL_INSTALLED',
  REFERRAL_COMPLETED_PROFILE: 'REFERRAL_COMPLETED_PROFILE',
  REFERRAL_POLICY_PAID: 'REFERRAL_POLICY_PAID',

  // Store
  STORE_PURCHASE: 'STORE_PURCHASE',
  STORE_REFUND: 'STORE_REFUND',

  // Shields
  SHIELD_EARNED: 'SHIELD_EARNED',
  SHIELD_USED: 'SHIELD_USED',
  SHIELD_PURCHASED: 'SHIELD_PURCHASED',

  // Level & Rewards
  LEVEL_UP_BONUS: 'LEVEL_UP_BONUS',
  SPIN_WHEEL_PRIZE: 'SPIN_WHEEL_PRIZE',
  DAILY_LOGIN: 'DAILY_LOGIN',
  PROFILE_COMPLETED: 'PROFILE_COMPLETED',

  // Admin
  ADMIN_ADJUSTMENT: 'ADMIN_ADJUSTMENT',
  ADMIN_GRANT: 'ADMIN_GRANT',
  ADMIN_DEDUCT: 'ADMIN_DEDUCT',

  // Misc
  WELCOME_BONUS: 'WELCOME_BONUS',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  POLICY_RENEWAL: 'POLICY_RENEWAL',
  POLICY_NEW: 'POLICY_NEW',
} as const;

export type LedgerReason = typeof LEDGER_REASONS[keyof typeof LEDGER_REASONS];

// ============================================================================
// ERROR CLASSES
// ============================================================================

/**
 * Error de transaccion duplicada (idempotencia)
 */
export class DuplicateTransactionError extends Error {
  public readonly existingEntry: Ledger;

  constructor(existingEntry: Ledger) {
    super(`Transaccion duplicada detectada. ID existente: ${existingEntry.id}`);
    this.name = 'DuplicateTransactionError';
    this.existingEntry = existingEntry;
  }
}

/**
 * Error de balance insuficiente
 */
export class InsufficientBalanceError extends Error {
  public readonly currentBalance: number;
  public readonly requestedAmount: number;

  constructor(currentBalance: number, requestedAmount: number) {
    super(`Balance insuficiente. Actual: ${currentBalance}, Solicitado: ${requestedAmount}`);
    this.name = 'InsufficientBalanceError';
    this.currentBalance = currentBalance;
    this.requestedAmount = requestedAmount;
  }
}

/**
 * Error de validacion del ledger
 */
export class LedgerValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LedgerValidationError';
  }
}

// ============================================================================
// LEDGER SERVICE
// ============================================================================

/**
 * Servicio de Ledger - Sistema append-only auditable
 *
 * Proporciona funciones para crear y consultar entradas del ledger
 * con soporte para idempotencia y auditoria completa.
 */
export const ledgerService = {
  /**
   * Genera una clave de idempotencia unica basada en los parametros de la transaccion.
   *
   * La clave se genera usando SHA-256 hash de los parametros serializados,
   * garantizando que transacciones identicas produzcan la misma clave.
   *
   * @param params - Parametros para generar la clave
   * @returns Clave de idempotencia (hash SHA-256 truncado)
   *
   * @example
   * ```typescript
   * const key = ledgerService.generateIdempotencyKey({
   *   userId: 'user123',
   *   walletType: 'XP',
   *   transactionType: 'CREDIT',
   *   delta: 100,
   *   reason: 'QUIZ_COMPLETED',
   *   reference: 'quiz_attempt_456'
   * });
   * // Returns: "idem_a1b2c3d4e5f6..."
   * ```
   */
  generateIdempotencyKey(params: IdempotencyKeyParams): string {
    const payload = JSON.stringify({
      u: params.userId,
      w: params.walletType,
      t: params.transactionType,
      d: params.delta,
      r: params.reason,
      ref: params.reference || '',
    });

    const hash = crypto.createHash('sha256').update(payload).digest('hex');
    return `idem_${hash.substring(0, 32)}`;
  },

  /**
   * Crea una nueva entrada en el ledger de forma atomica.
   *
   * Esta funcion:
   * 1. Verifica idempotencia si se proporciona clave
   * 2. Obtiene el balance actual del wallet
   * 3. Valida que hay balance suficiente para debitos
   * 4. Crea la entrada del ledger con balances pre/post
   * 5. Actualiza el balance del wallet
   *
   * Todo se ejecuta en una transaccion atomica de Prisma.
   *
   * @param params - Parametros de la entrada
   * @param tx - Transaccion Prisma opcional (para operaciones anidadas)
   * @returns La entrada del ledger creada
   * @throws {DuplicateTransactionError} Si la transaccion ya existe
   * @throws {InsufficientBalanceError} Si no hay balance suficiente para debito
   * @throws {LedgerValidationError} Si los parametros son invalidos
   *
   * @example
   * ```typescript
   * const entry = await ledgerService.createEntry({
   *   userId: 'user123',
   *   walletType: 'XP',
   *   transactionType: 'CREDIT',
   *   delta: 100,
   *   reason: 'QUIZ_COMPLETED',
   *   reference: 'quiz_attempt_456',
   *   metadata: { score: 5, perfectScore: true }
   * });
   * ```
   */
  async createEntry(
    params: CreateLedgerEntryParams,
    tx?: Prisma.TransactionClient
  ): Promise<Ledger> {
    const client = tx || prisma;

    // Validaciones
    if (params.delta <= 0) {
      throw new LedgerValidationError('Delta debe ser un numero positivo');
    }

    if (!params.userId || !params.reason) {
      throw new LedgerValidationError('userId y reason son obligatorios');
    }

    // Generar clave de idempotencia si no se proporciona
    const idempotencyKey = params.idempotencyKey || this.generateIdempotencyKey({
      userId: params.userId,
      walletType: params.walletType,
      transactionType: params.transactionType,
      delta: params.delta,
      reason: params.reason,
      reference: params.reference,
    });

    // Ejecutar en transaccion si no estamos ya en una
    const executeOperation = async (prismaClient: Prisma.TransactionClient | typeof prisma) => {
      // Verificar idempotencia
      const existingEntry = await prismaClient.ledger.findUnique({
        where: { idempotencyKey },
      });

      if (existingEntry) {
        throw new DuplicateTransactionError(existingEntry);
      }

      // Obtener o crear wallet
      let wallet = await prismaClient.wallet.findUnique({
        where: {
          userId_type: {
            userId: params.userId,
            type: params.walletType,
          },
        },
      });

      if (!wallet) {
        wallet = await prismaClient.wallet.create({
          data: {
            userId: params.userId,
            type: params.walletType,
            balance: 0,
          },
        });
      }

      const balanceBefore = wallet.balance;
      let balanceAfter: number;

      // Calcular nuevo balance
      if (params.transactionType === 'CREDIT') {
        balanceAfter = balanceBefore + params.delta;
      } else {
        // DEBIT
        if (balanceBefore < params.delta) {
          throw new InsufficientBalanceError(balanceBefore, params.delta);
        }
        balanceAfter = balanceBefore - params.delta;
      }

      // Crear entrada del ledger
      const ledgerEntry = await prismaClient.ledger.create({
        data: {
          userId: params.userId,
          walletType: params.walletType,
          transactionType: params.transactionType,
          delta: params.delta,
          balanceBefore,
          balanceAfter,
          reason: params.reason,
          reference: params.reference || null,
          idempotencyKey,
          metadata: params.metadata as Prisma.JsonValue || null,
        },
      });

      // Actualizar balance del wallet
      await prismaClient.wallet.update({
        where: {
          userId_type: {
            userId: params.userId,
            type: params.walletType,
          },
        },
        data: {
          balance: balanceAfter,
        },
      });

      return ledgerEntry;
    };

    // Si ya tenemos una transaccion, usarla directamente
    if (tx) {
      return executeOperation(tx);
    }

    // Si no, crear una nueva transaccion
    return prisma.$transaction(async (prismaClient) => {
      return executeOperation(prismaClient);
    });
  },

  /**
   * Obtiene el historial del ledger para un usuario con filtros opcionales.
   *
   * @param userId - ID del usuario
   * @param options - Opciones de filtrado y paginacion
   * @returns Resultado paginado con entradas del ledger
   *
   * @example
   * ```typescript
   * const result = await ledgerService.getUserLedger('user123', {
   *   walletType: 'XP',
   *   limit: 20,
   *   offset: 0
   * });
   * console.log(result.entries);
   * console.log(`Total: ${result.total}, HasMore: ${result.hasMore}`);
   * ```
   */
  async getUserLedger(
    userId: string,
    options: GetLedgerOptions = {}
  ): Promise<LedgerQueryResult> {
    const {
      walletType,
      transactionType,
      reason,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = options;

    // Construir condiciones de filtro
    const where: Prisma.LedgerWhereInput = {
      userId,
      ...(walletType && { walletType }),
      ...(transactionType && { transactionType }),
      ...(reason && { reason }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    // Ejecutar consultas en paralelo
    const [entries, total] = await Promise.all([
      prisma.ledger.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.ledger.count({ where }),
    ]);

    return {
      entries,
      total,
      hasMore: offset + entries.length < total,
    };
  },

  /**
   * Obtiene una entrada especifica del ledger por ID.
   *
   * @param entryId - ID de la entrada
   * @returns La entrada del ledger o null si no existe
   */
  async getEntryById(entryId: string): Promise<Ledger | null> {
    return prisma.ledger.findUnique({
      where: { id: entryId },
    });
  },

  /**
   * Busca una entrada por clave de idempotencia.
   *
   * Util para verificar si una transaccion ya fue procesada.
   *
   * @param idempotencyKey - Clave de idempotencia
   * @returns La entrada existente o null
   */
  async findByIdempotencyKey(idempotencyKey: string): Promise<Ledger | null> {
    return prisma.ledger.findUnique({
      where: { idempotencyKey },
    });
  },

  /**
   * Obtiene todas las entradas relacionadas con una referencia externa.
   *
   * Util para auditar todas las transacciones de un quiz, orden, etc.
   *
   * @param reference - ID de referencia externa
   * @returns Lista de entradas del ledger
   */
  async getEntriesByReference(reference: string): Promise<Ledger[]> {
    return prisma.ledger.findMany({
      where: { reference },
      orderBy: { createdAt: 'asc' },
    });
  },

  /**
   * Genera un resumen de transacciones para un usuario y tipo de wallet.
   *
   * @param userId - ID del usuario
   * @param walletType - Tipo de wallet
   * @param startDate - Fecha inicial opcional
   * @param endDate - Fecha final opcional
   * @returns Resumen con totales de creditos, debitos y balance neto
   */
  async getSummary(
    userId: string,
    walletType: WalletType,
    startDate?: Date,
    endDate?: Date
  ): Promise<LedgerSummary> {
    const where: Prisma.LedgerWhereInput = {
      userId,
      walletType,
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {}),
    };

    const aggregations = await prisma.ledger.groupBy({
      by: ['transactionType'],
      where,
      _sum: {
        delta: true,
      },
      _count: {
        id: true,
      },
    });

    let totalCredits = 0;
    let totalDebits = 0;
    let transactionCount = 0;

    for (const agg of aggregations) {
      const sum = agg._sum.delta || 0;
      const count = agg._count.id || 0;
      transactionCount += count;

      if (agg.transactionType === 'CREDIT') {
        totalCredits = sum;
      } else {
        totalDebits = sum;
      }
    }

    return {
      totalCredits,
      totalDebits,
      netBalance: totalCredits - totalDebits,
      transactionCount,
    };
  },

  /**
   * Verifica la integridad del ledger para un usuario.
   *
   * Recalcula el balance basado en todas las entradas del ledger
   * y lo compara con el balance actual del wallet.
   *
   * @param userId - ID del usuario
   * @param walletType - Tipo de wallet
   * @returns Objeto con resultado de la verificacion
   */
  async verifyIntegrity(
    userId: string,
    walletType: WalletType
  ): Promise<{
    isValid: boolean;
    calculatedBalance: number;
    storedBalance: number;
    discrepancy: number;
  }> {
    // Obtener todas las entradas
    const entries = await prisma.ledger.findMany({
      where: { userId, walletType },
      orderBy: { createdAt: 'asc' },
    });

    // Calcular balance
    let calculatedBalance = 0;
    for (const entry of entries) {
      if (entry.transactionType === 'CREDIT') {
        calculatedBalance += entry.delta;
      } else {
        calculatedBalance -= entry.delta;
      }
    }

    // Obtener balance almacenado
    const wallet = await prisma.wallet.findUnique({
      where: {
        userId_type: { userId, type: walletType },
      },
    });

    const storedBalance = wallet?.balance || 0;
    const discrepancy = calculatedBalance - storedBalance;

    return {
      isValid: discrepancy === 0,
      calculatedBalance,
      storedBalance,
      discrepancy,
    };
  },

  /**
   * Obtiene las ultimas N transacciones de un tipo especifico.
   *
   * @param userId - ID del usuario
   * @param reason - Razon de la transaccion
   * @param limit - Numero de entradas a retornar
   * @returns Lista de entradas del ledger
   */
  async getRecentByReason(
    userId: string,
    reason: string,
    limit = 10
  ): Promise<Ledger[]> {
    return prisma.ledger.findMany({
      where: { userId, reason },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};

export default ledgerService;
