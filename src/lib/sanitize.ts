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
