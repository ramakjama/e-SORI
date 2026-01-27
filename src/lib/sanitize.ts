/**
 * Input sanitization utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

/**
 * Sanitize HTML string to prevent XSS attacks
 * Removes dangerous tags and attributes
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''

  // Create a temporary div to parse HTML
  const temp = document.createElement('div')
  temp.textContent = html

  return temp.innerHTML
}

/**
 * Sanitize user input for safe display
 * Escapes HTML entities
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize filename to prevent directory traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return ''

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove multiple dots
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255) // Limit length
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeURL(url: string): string {
  if (!url) return ''

  const trimmed = url.trim().toLowerCase()

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  if (dangerousProtocols.some(protocol => trimmed.startsWith(protocol))) {
    return ''
  }

  // Only allow http, https, mailto, tel
  const allowedProtocols = ['http://', 'https://', 'mailto:', 'tel:']
  const hasProtocol = allowedProtocols.some(protocol => trimmed.startsWith(protocol))

  if (!hasProtocol && !trimmed.startsWith('/') && !trimmed.startsWith('#')) {
    return `https://${url}` // Default to https
  }

  return url
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email) return ''

  const trimmed = email.trim().toLowerCase()
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return ''
  }

  return trimmed
}

/**
 * Sanitize phone number (Spanish format)
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return ''

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Spanish phone numbers are 9 digits
  if (digits.length === 9) {
    return digits
  }

  // International format +34
  if (digits.length === 11 && digits.startsWith('34')) {
    return digits.substring(2)
  }

  return phone // Return original if doesn't match expected format
}

/**
 * Sanitize DNI/NIE (Spanish ID)
 */
export function sanitizeDNI(dni: string): string {
  if (!dni) return ''

  const cleaned = dni.toUpperCase().replace(/[^0-9A-Z]/g, '')

  // DNI: 8 digits + 1 letter
  // NIE: X/Y/Z + 7 digits + 1 letter
  const dniRegex = /^[0-9]{8}[A-Z]$/
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/

  if (dniRegex.test(cleaned) || nieRegex.test(cleaned)) {
    return cleaned
  }

  return dni // Return original if doesn't match
}

/**
 * Sanitize credit card number (mask all but last 4 digits)
 */
export function sanitizeCreditCard(cardNumber: string): string {
  if (!cardNumber) return ''

  const digits = cardNumber.replace(/\D/g, '')
  
  if (digits.length < 4) return '****'

  const lastFour = digits.slice(-4)
  const masked = '*'.repeat(digits.length - 4)

  return masked + lastFour
}

/**
 * Sanitize IBAN (mask all but last 4 characters)
 */
export function sanitizeIBAN(iban: string): string {
  if (!iban) return ''

  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  
  if (cleaned.length < 4) return '****'

  const lastFour = cleaned.slice(-4)
  const masked = '*'.repeat(cleaned.length - 4)

  return `${masked.substring(0, 2)} ${masked.substring(2, 6)} **** **** **** ${lastFour}`
}

/**
 * Sanitize SQL input (basic protection)
 * Note: Always use parameterized queries on the backend!
 */
export function sanitizeSQL(input: string): string {
  if (!input) return ''

  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comment start
    .replace(/\*\//g, '') // Remove block comment end
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return ''

  return query
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .substring(0, 200) // Limit length
}

/**
 * Validate and sanitize file upload
 */
export interface FileValidationResult {
  valid: boolean
  error?: string
  sanitizedName?: string
}

export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): FileValidationResult {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Máximo ${maxSize / 1024 / 1024}MB`,
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Permitidos: ${allowedExtensions.join(', ')}`,
    }
  }

  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Extensión de archivo no permitida. Permitidas: ${allowedExtensions.join(', ')}`,
    }
  }

  // Sanitize filename
  const sanitizedName = sanitizeFilename(file.name)

  return {
    valid: true,
    sanitizedName,
  }
}

/**
 * Remove potentially dangerous characters from object keys
 */
export function sanitizeObjectKeys<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {}

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_')
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[sanitizedKey] = sanitizeObjectKeys(value)
    } else {
      sanitized[sanitizedKey] = value
    }
  }

  return sanitized as T
}

/**
 * Sanitize markdown to prevent XSS
 * Allows basic markdown but removes dangerous HTML
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown) return ''

  return markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
}

/**
 * Sanitiza HTML para chat eliminando scripts, event handlers y contenido peligroso
 * Implementación completa basada en regex sin dependencias externas
 */
export interface SanitizeHtmlOptions {
  allowedTags?: string[]
  allowedAttributes?: string[]
  stripAllTags?: boolean
}

const DEFAULT_ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'br', 'p']
const DEFAULT_ALLOWED_ATTRIBUTES: string[] = []

export function sanitizeHtmlStrict(
  html: string,
  options: SanitizeHtmlOptions = {}
): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    stripAllTags = false,
  } = options

  let sanitized = html

  // 1. Eliminar todos los tags <script> (incluye variantes con mayúsculas, espacios, etc)
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '')

  // 2. Eliminar <style> tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // 3. Eliminar tags peligrosos (iframe, object, embed, link, meta, base, form)
  sanitized = sanitized.replace(/<(iframe|object|embed|link|meta|base|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
  sanitized = sanitized.replace(/<(iframe|object|embed|link|meta|base|form|input|textarea|button)[^>]*\/?>/gi, '')

  // 4. Eliminar event handlers (onclick, onerror, onload, onmouseover, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')

  // 5. Eliminar javascript: protocol
  sanitized = sanitized.replace(/javascript\s*:/gi, '')
  sanitized = sanitized.replace(/jAvAsCrIpT\s*:/gi, '') // variantes

  // 6. Eliminar data: protocol (excepto imágenes base64 seguras)
  sanitized = sanitized.replace(/\s*data:(?!image\/(png|jpg|jpeg|gif|svg\+xml);base64)[^"'\s>]*/gi, '')

  // 7. Eliminar vbscript: protocol
  sanitized = sanitized.replace(/vbscript\s*:/gi, '')

  // 8. Eliminar atributos peligrosos
  const dangerousAttrs = ['srcdoc', 'formaction', 'action', 'href', 'src', 'xlink:href', 'data']
  dangerousAttrs.forEach(attr => {
    sanitized = sanitized.replace(new RegExp(`\\s*${attr}\\s*=\\s*["'][^"']*["']`, 'gi'), '')
  })

  // 9. Si stripAllTags es true, eliminar todos los tags HTML
  if (stripAllTags) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
    // Decodificar entidades HTML básicas
    sanitized = sanitized
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, '&')
    return sanitized
  }

  // 10. Filtrar tags no permitidos
  if (allowedTags.length > 0) {
    const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
    sanitized = sanitized.replace(tagPattern, (match, tagName) => {
      const normalizedTagName = tagName.toLowerCase()
      if (allowedTags.includes(normalizedTagName)) {
        // Tag permitido: filtrar atributos
        if (allowedAttributes.length === 0) {
          // Si no se permiten atributos, devolver tag limpio
          const isClosing = match.startsWith('</')
          const isSelfClosing = match.endsWith('/>')
          if (isClosing) return `</${normalizedTagName}>`
          if (isSelfClosing) return `<${normalizedTagName} />`
          return `<${normalizedTagName}>`
        }
        return filterTagAttributes(match, allowedAttributes)
      }
      return '' // Tag no permitido: eliminar
    })
  } else {
    // Si no hay tags permitidos, eliminar todos
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }

  // 11. Eliminar entidades HTML que podrían ser peligrosas cuando están codificadas
  sanitized = sanitized.replace(/&lt;script/gi, '')
  sanitized = sanitized.replace(/&lt;iframe/gi, '')
  sanitized = sanitized.replace(/&lt;object/gi, '')

  // 12. Eliminar caracteres de control peligrosos
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  return sanitized.trim()
}

/**
 * Filtra atributos de un tag HTML, manteniendo solo los permitidos
 */
function filterTagAttributes(tag: string, allowedAttributes: string[]): string {
  const tagNameMatch = tag.match(/<\/?([a-z][a-z0-9]*)/i)
  if (!tagNameMatch) return tag

  const tagName = tagNameMatch[1].toLowerCase()
  const isClosing = tag.startsWith('</')
  const isSelfClosing = tag.endsWith('/>')

  if (isClosing) {
    return `</${tagName}>`
  }

  // Extraer y filtrar atributos permitidos
  let filteredTag = `<${tagName}`
  const attributePattern = /\s+([a-z-]+)\s*=\s*["']([^"']*)["']/gi
  let match

  while ((match = attributePattern.exec(tag)) !== null) {
    const [, attrName, attrValue] = match
    if (allowedAttributes.includes(attrName.toLowerCase())) {
      // Sanitizar el valor del atributo
      const safeValue = attrValue
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+/gi, '')
        .replace(/[<>"']/g, '')

      filteredTag += ` ${attrName}="${safeValue}"`
    }
  }

  filteredTag += isSelfClosing ? ' />' : '>'
  return filteredTag
}

/**
 * Formatea markdown simple a HTML sanitizado (para chat)
 * Soporta: **bold**, saltos de línea
 */
export function formatMessageForChat(content: string): string {
  if (!content || typeof content !== 'string') {
    return ''
  }

  // Aplicar formateo markdown básico
  let formatted = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\n/g, '<br />') // saltos de línea

  // Sanitizar el resultado con configuración estricta
  return sanitizeHtmlStrict(formatted, {
    allowedTags: ['strong', 'br', 'b', 'i', 'em', 'p'],
    allowedAttributes: [],
  })
}

/**
 * Rate limit key sanitization
 * Ensures consistent and safe rate limit keys
 */
export function sanitizeRateLimitKey(identifier: string): string {
  if (!identifier) return 'unknown'

  return identifier
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, '_')
    .substring(0, 100)
}
