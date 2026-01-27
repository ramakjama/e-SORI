import { z } from 'zod'

// =====================================================
// ESQUEMAS DE VALIDACION - SEGURIDAD e-SORI
// =====================================================

// Validadores reutilizables
const phoneRegex = /^(\+34)?[6-9]\d{8}$/
const dniNieRegex = /^[0-9XYZ]\d{7}[A-Z]$/i
const postalCodeRegex = /^\d{5}$/

// =====================================================
// FORMULARIO DE SINIESTROS (ClaimSchema)
// =====================================================
export const claimFormSchema = z.object({
  // Datos del siniestro
  policyId: z
    .string({ required_error: 'Debes seleccionar una póliza' })
    .min(1, 'Selecciona una póliza'),

  claimType: z.enum(
    ['accident', 'theft', 'damage', 'liability', 'health', 'other'],
    { errorMap: () => ({ message: 'Selecciona un tipo de siniestro válido' }) }
  ),

  date: z
    .string({ required_error: 'La fecha del incidente es obligatoria' })
    .min(1, 'La fecha es requerida')
    .refine((date) => {
      const claimDate = new Date(date)
      const today = new Date()
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return claimDate <= today && claimDate >= oneYearAgo
    }, 'La fecha debe estar dentro del último año y no puede ser futura'),

  time: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida (formato: HH:MM)')
    .optional(),

  location: z
    .string({ required_error: 'La ubicación del incidente es obligatoria' })
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .max(200, 'La ubicación no puede exceder 200 caracteres')
    .transform((val) => val.trim()),

  description: z
    .string({ required_error: 'La descripción del incidente es obligatoria' })
    .min(20, 'La descripción debe tener al menos 20 caracteres para proporcionar detalles suficientes')
    .max(2000, 'La descripción no puede exceder 2000 caracteres')
    .transform((val) => val.trim()),

  // Datos de contacto
  contactPhone: z
    .string()
    .regex(phoneRegex, 'Teléfono inválido (formato: 612345678 o +34612345678)')
    .optional(),

  contactEmail: z
    .string()
    .email('El email proporcionado no es válido')
    .max(100, 'Email demasiado largo')
    .optional(),

  // Terceros involucrados
  hasThirdParty: z.boolean().default(false),

  thirdPartyInfo: z
    .string()
    .max(500, 'La información de terceros no puede exceder 500 caracteres')
    .optional(),

  // Estimación de daños
  estimatedAmount: z
    .number({
      invalid_type_error: 'Debe ser un número válido'
    })
    .min(0, 'El importe no puede ser negativo')
    .max(10000000, 'El importe estimado es demasiado alto')
    .optional(),

  // Documentos adjuntos
  hasPhotos: z.boolean().default(false),
  hasPoliceReport: z.boolean().default(false),

  policeReportNumber: z
    .string()
    .max(50, 'El número de reporte policial es demasiado largo')
    .optional()
    .or(z.literal('')),

  // Lesiones
  injuries: z.boolean().default(false),

  injuryDetails: z
    .string()
    .max(1000, 'Los detalles de lesiones no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),

  // Comentarios adicionales
  additionalComments: z
    .string()
    .max(1000, 'Los comentarios adicionales no pueden exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => {
    // Si hay reporte policial, debe haber número
    if (data.hasPoliceReport && !data.policeReportNumber) {
      return false
    }
    return true
  },
  {
    message: 'Si existe reporte policial, debes proporcionar el número de referencia',
    path: ['policeReportNumber'],
  }
).refine(
  (data) => {
    // Si hay lesiones, debe haber detalles
    if (data.injuries && !data.injuryDetails) {
      return false
    }
    return true
  },
  {
    message: 'Si hay lesiones, debes proporcionar los detalles',
    path: ['injuryDetails'],
  }
)

export type ClaimFormData = z.infer<typeof claimFormSchema>

// Alias para compatibilidad con la API
export const ClaimSchema = claimFormSchema

// =====================================================
// FORMULARIO DE PERFIL DE USUARIO (ProfileSchema)
// =====================================================
export const profileFormSchema = z.object({
  // Datos personales
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'El nombre contiene caracteres no válidos')
    .transform((val) => val.trim()),

  surname: z
    .string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'Los apellidos contienen caracteres no válidos')
    .transform((val) => val.trim())
    .optional(),

  dni: z
    .string()
    .regex(dniNieRegex, 'DNI/NIE no válido (formato: 12345678A o X1234567A)')
    .transform((val) => val.toUpperCase())
    .optional()
    .or(z.literal('')),

  birthDate: z
    .string()
    .refine((date) => {
      if (!date) return true // Campo opcional
      const birth = new Date(date)
      const today = new Date()
      const minAge = new Date()
      minAge.setFullYear(minAge.getFullYear() - 18)
      const maxAge = new Date()
      maxAge.setFullYear(maxAge.getFullYear() - 120)
      return birth <= minAge && birth >= maxAge
    }, 'Debes ser mayor de 18 años para crear un perfil')
    .optional()
    .or(z.literal('')),

  // Datos de contacto
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El email proporcionado no es válido')
    .max(100, 'El email no puede exceder 100 caracteres')
    .transform((val) => val.toLowerCase().trim()),

  phone: z
    .string({ required_error: 'El teléfono es obligatorio' })
    .regex(phoneRegex, 'Teléfono no válido (formato: 612345678 o +34612345678)'),

  alternativePhone: z
    .string()
    .regex(phoneRegex, 'Teléfono alternativo no válido')
    .optional()
    .or(z.literal('')),

  // Dirección
  address: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .transform((val) => val.trim())
    .optional()
    .or(z.literal('')),

  postalCode: z
    .string()
    .regex(postalCodeRegex, 'Código postal no válido (debe tener 5 dígitos)')
    .optional()
    .or(z.literal('')),

  city: z
    .string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(100, 'La ciudad no puede exceder 100 caracteres')
    .transform((val) => val.trim())
    .optional()
    .or(z.literal('')),

  province: z
    .string()
    .min(2, 'La provincia debe tener al menos 2 caracteres')
    .max(50, 'La provincia no puede exceder 50 caracteres')
    .transform((val) => val.trim())
    .optional()
    .or(z.literal('')),

  // Preferencias de comunicación
  preferredContact: z
    .enum(['email', 'phone', 'sms', 'whatsapp'], {
      errorMap: () => ({ message: 'Selecciona un método de contacto válido' })
    })
    .default('email'),

  marketingConsent: z.boolean().default(false),
  dataProcessingConsent: z.boolean().default(true),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

// Alias para compatibilidad con la API
export const ProfileSchema = profileFormSchema

// =====================================================
// FORMULARIO DE CONTACTO (ContactSchema)
// =====================================================
export const contactFormSchema = z.object({
  // Datos del remitente
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .transform((val) => val.trim()),

  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El email proporcionado no es válido')
    .max(100, 'El email no puede exceder 100 caracteres')
    .transform((val) => val.toLowerCase().trim()),

  phone: z
    .string()
    .regex(phoneRegex, 'Teléfono no válido (formato: 612345678 o +34612345678)')
    .optional()
    .or(z.literal('')),

  // Mensaje
  subject: z.enum(
    ['info', 'quote', 'claim', 'complaint', 'suggestion', 'other'],
    { errorMap: () => ({ message: 'Selecciona un asunto válido' }) }
  ),

  message: z
    .string({ required_error: 'El mensaje es obligatorio' })
    .min(10, 'El mensaje debe tener al menos 10 caracteres para proporcionar detalles suficientes')
    .max(5000, 'El mensaje no puede exceder 5000 caracteres')
    .transform((val) => val.trim()),

  // Preferencia de respuesta
  preferredResponse: z
    .enum(['email', 'phone'], {
      errorMap: () => ({ message: 'Selecciona un método de respuesta válido' })
    })
    .default('email'),

  // Horario preferido para llamadas
  preferredCallTime: z
    .enum(['morning', 'afternoon', 'evening', 'any'], {
      errorMap: () => ({ message: 'Selecciona un horario válido' })
    })
    .default('any')
    .optional(),

  // Consentimientos
  privacyConsent: z
    .boolean({ required_error: 'Debes aceptar la política de privacidad' })
    .refine((val) => val === true, 'Debes aceptar la política de privacidad para continuar'),

  // Urgencia
  isUrgent: z.boolean().default(false),

  // Número de póliza (opcional, para clientes)
  policyNumber: z
    .string()
    .max(50, 'El número de póliza no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Alias para compatibilidad con la API
export const ContactSchema = contactFormSchema

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
