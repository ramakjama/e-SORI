import { useStore } from '@/store/useStore'
import {
  Feature,
  UserLevel,
  hasPermission,
  getPermissions,
  getLevelInfo,
  calculateLevelProgress,
} from '@/lib/permissions'

/**
 * Hook para acceder al sistema de permisos desde cualquier componente
 *
 * @example
 * const { hasFeature, canAccess, levelInfo } = usePermissions()
 *
 * if (hasFeature('polizas.cotizar.advanced')) {
 *   // Mostrar formulario avanzado
 * }
 */
export function usePermissions() {
  const { user } = useStore()
  const userLevel = (user?.level as UserLevel) || 'BRONCE'
  const points = user?.points || 0

  return {
    /**
     * Verifica si el usuario tiene acceso a una funcionalidad
     */
    hasFeature: (feature: Feature) => hasPermission(userLevel, feature),

    /**
     * Alias de hasFeature (más semántico en algunos contextos)
     */
    canAccess: (feature: Feature) => hasPermission(userLevel, feature),

    /**
     * Obtiene todos los permisos del usuario actual
     */
    permissions: getPermissions(userLevel),

    /**
     * Información del nivel actual del usuario
     */
    levelInfo: getLevelInfo(userLevel),

    /**
     * Progreso hacia el siguiente nivel
     */
    progress: calculateLevelProgress(userLevel, points),

    /**
     * Nivel actual del usuario
     */
    level: userLevel,

    /**
     * Puntos actuales del usuario
     */
    points,
  }
}
