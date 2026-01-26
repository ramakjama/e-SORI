/**
 * @fileoverview Servicios Core de Gamificacion e-SORI
 *
 * Este modulo exporta todos los servicios relacionados con el sistema
 * de gamificacion de e-SORI.
 *
 * @example
 * ```typescript
 * import { walletService, streakService, ledgerService } from '@/services';
 *
 * // Obtener wallet del usuario
 * const wallet = await walletService.getWallet(userId);
 *
 * // Actualizar racha despues de quiz
 * const result = await streakService.updateStreak(userId, quizAttemptId);
 *
 * // Consultar historial de transacciones
 * const ledger = await ledgerService.getUserLedger(userId, { walletType: 'XP' });
 * ```
 *
 * @author e-SORI Gamification Team
 * @version 2.0.0
 */

// ============================================================================
// WALLET SERVICE
// ============================================================================

export {
  walletService,
  type UserWallet,
  type WalletBalance,
  type LevelProgress,
  type WalletOperationResult,
  type LevelUpInfo,
  type ShieldUseResult,
  LEVEL_THRESHOLDS,
  LEVEL_UP_BONUS,
  WalletNotFoundError,
  InvalidWalletOperationError,
  InsufficientBalanceError,
  DuplicateTransactionError,
} from './walletService';

// ============================================================================
// LEDGER SERVICE
// ============================================================================

export {
  ledgerService,
  type CreateLedgerEntryParams,
  type IdempotencyKeyParams,
  type GetLedgerOptions,
  type LedgerQueryResult,
  type LedgerSummary,
  type LedgerReason,
  LEDGER_REASONS,
  LedgerValidationError,
} from './ledgerService';

// ============================================================================
// STREAK SERVICE
// ============================================================================

export {
  streakService,
  type StreakStatus,
  type StreakUpdateResult,
  type StreakMilestone,
  type StreakBonus,
  type StreakRiskCheck,
  STREAK_MILESTONES,
  STREAK_EXPIRY_HOURS,
  StreakNotFoundError,
  InvalidStreakOperationError,
} from './streakService';
