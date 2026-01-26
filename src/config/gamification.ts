// Gamification Configuration - Soriano eCliente
// TypeScript strict mode configuration

export type LevelName = "BRONCE" | "PLATA" | "ORO" | "PLATINO";

export interface LevelConfig {
  xpMin: number;
  xpMax: number;
  multiplier: number;
  color: string;
  icon: string;
}

export interface QuizConfig {
  questions: number;
  timePerQuestion: number;
  baseXP: number;
  xpPerCorrect: number;
  baseCoins: number;
  coinsPerCorrect: number;
}

export interface StreakMilestone {
  days: number;
  coinsBonus: number;
  shieldsBonus: number;
}

export interface ReferralStage {
  coins: number;
  xp: number;
  marginMultiplier?: number;
}

export interface RenewalCheckpoint {
  coinsBase: number;
  marginMultiplier: number;
  freeSpinBonus?: boolean;
}

export interface SpinPrize {
  id: string;
  label: string;
  probability: number;
  value: number;
  type: "COINS" | "SHIELDS";
}

export interface BadgeConfig {
  name: string;
  icon: string;
}

export interface GamificationConfigType {
  levels: Record<LevelName, LevelConfig>;
  quiz: {
    daily: QuizConfig;
  };
  streak: {
    milestones: StreakMilestone[];
  };
  referral: {
    stages: Record<string, ReferralStage>;
  };
  renewal: {
    checkpoints: Record<string, RenewalCheckpoint>;
  };
  spinWheel: {
    costCoins: number;
    maxSpinsPerDay: number;
    prizes: SpinPrize[];
  };
  conversion: {
    coinsPerEuro: number;
    minRedemption: number;
  };
  badges: Record<string, BadgeConfig>;
}

export const GAMIFICATION_CONFIG: GamificationConfigType = {
  levels: {
    BRONCE: { xpMin: 0, xpMax: 999, multiplier: 1.0, color: "#CD7F32", icon: "🥉" },
    PLATA: { xpMin: 1000, xpMax: 4999, multiplier: 1.05, color: "#C0C0C0", icon: "🥈" },
    ORO: { xpMin: 5000, xpMax: 14999, multiplier: 1.10, color: "#FFD700", icon: "🥇" },
    PLATINO: { xpMin: 15000, xpMax: Infinity, multiplier: 1.15, color: "#E5E4E2", icon: "💎" },
  },
  quiz: {
    daily: {
      questions: 5,
      timePerQuestion: 30,
      baseXP: 20,
      xpPerCorrect: 10,
      baseCoins: 10,
      coinsPerCorrect: 5,
    },
  },
  streak: {
    milestones: [
      { days: 3, coinsBonus: 50, shieldsBonus: 1 },
      { days: 7, coinsBonus: 100, shieldsBonus: 2 },
      { days: 14, coinsBonus: 250, shieldsBonus: 3 },
      { days: 30, coinsBonus: 500, shieldsBonus: 5 },
    ],
  },
  referral: {
    stages: {
      INSTALL_OPEN: { coins: 50, xp: 25 },
      PROFILE_QUIZ: { coins: 100, xp: 50 },
      REQUESTED_REVIEW: { coins: 200, xp: 100 },
      POLICY_PAID: { coins: 1000, xp: 500, marginMultiplier: 0.05 },
    },
  },
  renewal: {
    checkpoints: {
      "T-30": { coinsBase: 100, marginMultiplier: 0.03 },
      "T-15": { coinsBase: 150, marginMultiplier: 0.04 },
      "T-7": { coinsBase: 200, marginMultiplier: 0.05, freeSpinBonus: true },
    },
  },
  spinWheel: {
    costCoins: 50,
    maxSpinsPerDay: 3,
    prizes: [
      { id: "coins_25", label: "25 Coins", probability: 0.30, value: 25, type: "COINS" },
      { id: "coins_50", label: "50 Coins", probability: 0.25, value: 50, type: "COINS" },
      { id: "coins_100", label: "100 Coins", probability: 0.15, value: 100, type: "COINS" },
      { id: "shield_1", label: "1 Shield", probability: 0.15, value: 1, type: "SHIELDS" },
      { id: "jackpot", label: "JACKPOT 500!", probability: 0.02, value: 500, type: "COINS" },
    ],
  },
  conversion: {
    coinsPerEuro: 20,
    minRedemption: 100,
  },
  badges: {
    WELCOME: { name: "Bienvenido", icon: "👋" },
    FIRST_QUIZ: { name: "Primera vez", icon: "🎯" },
    STREAK_7: { name: "Una semana", icon: "🔥" },
    PERFECT_QUIZ: { name: "Perfecto", icon: "⭐" },
  },
} as const;

// Type for level info returned by helper functions
export interface LevelInfo {
  name: LevelName;
  config: LevelConfig;
}

// Type for level progress
export interface LevelProgress {
  currentXP: number;
  xpInCurrentLevel: number;
  xpRequiredForLevel: number;
  progressPercentage: number;
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
}

/**
 * Get the level configuration based on XP amount
 * @param xp - The experience points to evaluate
 * @returns LevelInfo object containing level name and configuration
 */
export function getLevelByXP(xp: number): LevelInfo {
  const levels = GAMIFICATION_CONFIG.levels;
  const levelEntries = Object.entries(levels) as [LevelName, LevelConfig][];

  for (const [name, config] of levelEntries) {
    if (xp >= config.xpMin && xp <= config.xpMax) {
      return { name, config };
    }
  }

  // Default to highest level if XP exceeds all ranges
  return { name: "PLATINO", config: levels.PLATINO };
}

/**
 * Get the next level configuration from current level
 * @param currentLevel - The current level name
 * @returns LevelInfo for next level or null if at max level
 */
export function getNextLevel(currentLevel: LevelName): LevelInfo | null {
  const levelOrder: LevelName[] = ["BRONCE", "PLATA", "ORO", "PLATINO"];
  const currentIndex = levelOrder.indexOf(currentLevel);

  if (currentIndex === -1 || currentIndex >= levelOrder.length - 1) {
    return null;
  }

  const nextLevelName = levelOrder[currentIndex + 1];
  return {
    name: nextLevelName,
    config: GAMIFICATION_CONFIG.levels[nextLevelName],
  };
}

/**
 * Calculate the progress within the current level
 * @param xp - Current XP amount
 * @returns LevelProgress object with detailed progress information
 */
export function calculateLevelProgress(xp: number): LevelProgress {
  const currentLevel = getLevelByXP(xp);
  const nextLevel = getNextLevel(currentLevel.name);

  const xpInCurrentLevel = xp - currentLevel.config.xpMin;
  const xpRequiredForLevel = currentLevel.config.xpMax === Infinity
    ? Infinity
    : currentLevel.config.xpMax - currentLevel.config.xpMin + 1;

  const progressPercentage = xpRequiredForLevel === Infinity
    ? 100
    : Math.min(100, (xpInCurrentLevel / xpRequiredForLevel) * 100);

  return {
    currentXP: xp,
    xpInCurrentLevel,
    xpRequiredForLevel,
    progressPercentage,
    currentLevel,
    nextLevel,
  };
}

/**
 * Apply the level multiplier to a base value
 * @param baseValue - The base value to multiply
 * @param xp - Current XP to determine level multiplier
 * @returns The value after applying the level multiplier
 */
export function applyMultiplier(baseValue: number, xp: number): number {
  const level = getLevelByXP(xp);
  return Math.round(baseValue * level.config.multiplier);
}

// Export level names array for iteration
export const LEVEL_NAMES: readonly LevelName[] = ["BRONCE", "PLATA", "ORO", "PLATINO"] as const;
