import { z } from 'zod'

export const emailSchema = z.string().email('Email no válido')

export const phoneSchema = z.string().regex(/^[6-9]\d{8}$/, 'Teléfono no válido')

export const dniSchema = z.string().regex(/^[0-9]{8}[A-Z]$|^[XYZ][0-9]{7}[A-Z]$/, 'DNI/NIE no válido')

export const ibanSchema = z.string().regex(/^ES\d{22}$/, 'IBAN no válido')

export const postalCodeSchema = z.string().regex(/^\d{5}$/, 'Código postal no válido')

export const passwordSchema = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener una mayúscula')
  .regex(/[a-z]/, 'Debe contener una minúscula')
  .regex(/[0-9]/, 'Debe contener un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener un carácter especial')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Contraseña requerida'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Debes aceptar los términos'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Asunto requerido'),
  message: z.string().min(10, 'Mensaje muy corto').max(1000, 'Mensaje muy largo'),
})

export const claimSchema = z.object({
  policyId: z.string().min(1, 'Selecciona una póliza'),
  type: z.string().min(3, 'Tipo requerido'),
  date: z.string().min(1, 'Fecha requerida'),
  description: z.string().min(10, 'Descripción muy corta').max(1000, 'Descripción muy larga'),
  location: z.string().optional(),
  witnesses: z.string().optional(),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().min(5, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  postalCode: postalCodeSchema,
})
