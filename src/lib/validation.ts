import { z } from 'zod'

// =====================================================
// ESQUEMAS DE VALIDACION - SEGURIDAD e-SORI
// =====================================================

// Validadores reutilizables
const phoneRegex = /^(\+34)?[6-9]\d{8}$/
const dniNieRegex = /^[0-9XYZ]\d{7}[A-Z]$/i
const postalCodeRegex = /^\d{5}$/

// =====================================================
// FORMULARIO DE SINIESTROS
// =====================================================
export const claimFormSchema = z.object({
  // Datos del siniestro
  policyId: z
    .string()
    .min(1, 'Selecciona una poliza')
    .uuid('ID de poliza invalido'),

  claimType: z.enum(
    ['accident', 'theft', 'damage', 'liability', 'health', 'other'],
    { errorMap: () => ({ message: 'Selecciona un tipo de siniestro valido' }) }
  ),

  date: z
    .string()
    .min(1, 'La fecha es requerida')
    .refine((date) => {
      const claimDate = new Date(date)
      const today = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return claimDate <= today && claimDate >= oneYearAgo
    }, 'La fecha debe estar dentro del ultimo ano'),

  time: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora invalida')
    .optional(),

  location: z
    .string()
    .min(5, 'La ubicacion debe tener al menos 5 caracteres')
    .max(200, 'La ubicacion no puede exceder 200 caracteres')
    .transform((val) => val.trim()),

  description: z
    .string()
    .min(20, 'La descripcion debe tener al menos 20 caracteres')
    .max(2000, 'La descripcion no puede exceder 2000 caracteres')
    .transform((val) => val.trim()),

  // Datos de contacto
  contactPhone: z
    .string()
    .regex(phoneRegex, 'Telefono invalido (ej: 612345678 o +34612345678)')
    .optional(),

  contactEmail: z
    .string()
    .email('Email invalido')
    .max(100, 'Email demasiado largo')
    .optional(),

  // Terceros involucrados
  hasThirdParty: z.boolean().default(false),

  thirdPartyInfo: z
    .string()
    .max(500, 'Informacion de terceros demasiado larga')
    .optional(),

  // Estimacion de danos
  estimatedAmount: z
    .number()
    .min(0, 'El importe no puede ser negativo')
    .max(10000000, 'Importe demasiado alto')
    .optional(),

  // Documentos adjuntos
  hasPhotos: z.boolean().default(false),
  hasPoliceReport: z.boolean().default(false),
})

export type ClaimFormData = z.infer<typeof claimFormSchema>

// =====================================================
// FORMULARIO DE PERFIL DE USUARIO
// =====================================================
export const profileFormSchema = z.object({
  // Datos personales
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZaeiouAEIOUn\s'-]+$/, 'El nombre contiene caracteres invalidos')
    .transform((val) => val.trim()),

  surname: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZaeiouAEIOUn\s'-]+$/, 'Los apellidos contienen caracteres invalidos')
    .transform((val) => val.trim())
    .optional(),

  dni: z
    .string()
    .regex(dniNieRegex, 'DNI/NIE invalido')
    .transform((val) => val.toUpperCase())
    .optional(),

  birthDate: z
    .string()
    .refine((date) => {
      const birth = new Date(date)
      const today = new Date()
      const minAge = new Date()
      minAge.setFullYear(minAge.getFullYear() - 18)
      const maxAge = new Date()
      maxAge.setFullYear(maxAge.getFullYear() - 120)
      return birth <= minAge && birth >= maxAge
    }, 'Debes ser mayor de 18 anos')
    .optional(),

  // Datos de contacto
  email: z
    .string()
    .email('Email invalido')
    .max(100, 'Email demasiado largo')
    .transform((val) => val.toLowerCase().trim()),

  phone: z
    .string()
    .regex(phoneRegex, 'Telefono invalido (ej: 612345678 o +34612345678)'),

  alternativePhone: z
    .string()
    .regex(phoneRegex, 'Telefono alternativo invalido')
    .optional()
    .or(z.literal('')),

  // Direccion
  address: z
    .string()
    .min(5, 'La direccion debe tener al menos 5 caracteres')
    .max(200, 'La direccion no puede exceder 200 caracteres')
    .transform((val) => val.trim()),

  postalCode: z
    .string()
    .regex(postalCodeRegex, 'Codigo postal invalido (5 digitos)'),

  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .transform((val) => val.trim()),

  province: z
    .string()
    .min(2, 'La provincia debe tener al menos 2 caracteres')
    .max(50, 'La provincia no puede exceder 50 caracteres')
    .transform((val) => val.trim()),

  // Preferencias de comunicacion
  preferredContact: z.enum(['email', 'phone', 'sms', 'whatsapp']).default('email'),

  marketingConsent: z.boolean().default(false),
  dataProcessingConsent: z.boolean().default(true),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

// =====================================================
// FORMULARIO DE CONTACTO
// =====================================================
export const contactFormSchema = z.object({
  // Datos del remitente
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((val) => val.trim()),

  email: z
    .string()
    .email('Email invalido')
    .max(100, 'Email demasiado largo')
    .transform((val) => val.toLowerCase().trim()),

  phone: z
    .string()
    .regex(phoneRegex, 'Telefono invalido')
    .optional()
    .or(z.literal('')),

  // Mensaje
  subject: z.enum(
    ['info', 'quote', 'claim', 'complaint', 'suggestion', 'other'],
    { errorMap: () => ({ message: 'Selecciona un asunto valido' }) }
  ),

  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(5000, 'El mensaje no puede exceder 5000 caracteres')
    .transform((val) => val.trim()),

  // Preferencia de respuesta
  preferredResponse: z.enum(['email', 'phone']).default('email'),

  // Horario preferido para llamadas
  preferredCallTime: z
    .enum(['morning', 'afternoon', 'evening', 'any'])
    .default('any')
    .optional(),

  // Consentimientos
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar la politica de privacidad'),

  // Urgencia
  isUrgent: z.boolean().default(false),

  // Numero de poliza (opcional, para clientes)
  policyNumber: z
    .string()
    .max(50, 'Numero de poliza demasiado largo')
    .optional()
    .or(z.literal('')),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// =====================================================
// FORMULARIO DE LOGIN
// =====================================================
export const loginFormSchema = z.object({
  email: z
    .string()
    .email('Email invalido')
    .max(100, 'Email demasiado largo')
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(8, 'La contrasena debe tener al menos 8 caracteres')
    .max(128, 'Contrasena demasiado larga'),

  rememberMe: z.boolean().default(false),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

// =====================================================
// FORMULARIO DE REGISTRO
// =====================================================
export const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((val) => val.trim()),

  email: z
    .string()
    .email('Email invalido')
    .max(100, 'Email demasiado largo')
    .transform((val) => val.toLowerCase().trim()),

  phone: z
    .string()
    .regex(phoneRegex, 'Telefono invalido'),

  password: z
    .string()
    .min(8, 'La contrasena debe tener al menos 8 caracteres')
    .max(128, 'Contrasena demasiado larga')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'La contrasena debe contener mayusculas, minusculas, numeros y caracteres especiales'
    ),

  confirmPassword: z.string(),

  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar los terminos y condiciones'),

  privacyAccepted: z
    .boolean()
    .refine((val) => val === true, 'Debes aceptar la politica de privacidad'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerFormSchema>

// =====================================================
// ESQUEMA DE CHAT MESSAGE
// =====================================================
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'El mensaje no puede estar vacio')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .transform((val) => val.trim()),

  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .max(20, 'Historial de conversacion demasiado largo')
    .optional(),

  userContext: z
    .object({
      name: z.string().optional(),
      level: z.string().optional(),
      points: z.number().optional(),
      policiesCount: z.number().optional(),
      openClaims: z.number().optional(),
    })
    .optional()
    .nullable(),
})

export type ChatMessageData = z.infer<typeof chatMessageSchema>

// =====================================================
// HELPERS DE VALIDACION
// =====================================================

/**
 * Valida datos con un esquema Zod y retorna resultado tipado
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}

/**
 * Extrae mensajes de error de un ZodError para mostrar en formularios
 */
export function getFormErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = issue.message
    }
  }
  return errors
}

/**
 * Valida un campo individual
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): string | null {
  const result = schema.safeParse(value)
  if (result.success) {
    return null
  }
  return result.error.issues[0]?.message || 'Valor invalido'
}
