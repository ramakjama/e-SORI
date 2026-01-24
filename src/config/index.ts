/**
 * Configuraciones centralizadas de la aplicación
 *
 * Importa desde aquí toda la configuración:
 * import { companyConfig, products, promotions } from '@/config'
 */

export { companyConfig } from './company'
export type { CompanyConfig, InsurancePartner, TeamMember, Office } from './company'

export { products, getProductById, getProductBySlug } from './products'
export type { InsuranceProduct, ProductDocument, ProductCoverage, ProductPrice } from './products'

export {
  promotions,
  getActivePromotions,
  getPromotionBySlug,
  getPromotionsForProduct,
  validatePromoCode,
} from './promotions'
export type { Promotion } from './promotions'
