import { ValidationResult, ValidationError } from './types/dashboard'

// Input sanitization
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000) // Limit length
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return ''
  
  return email
    .trim()
    .toLowerCase()
    .substring(0, 254) // RFC 5321 limit
}

export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return ''
  
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

// Validation functions
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = []
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateTaskTitle(title: string): ValidationResult {
  const errors: ValidationError[] = []
  
  if (!title || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Task title is required' })
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'Task title must be less than 200 characters' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateTaskPriority(priority: string): ValidationResult {
  const errors: ValidationError[] = []
  const validPriorities = ['high', 'medium', 'low']
  
  if (!priority) {
    errors.push({ field: 'priority', message: 'Priority is required' })
  } else if (!validPriorities.includes(priority.toLowerCase())) {
    errors.push({ field: 'priority', message: 'Priority must be high, medium, or low' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validatePoints(points: number): ValidationResult {
  const errors: ValidationError[] = []
  
  if (typeof points !== 'number' || isNaN(points)) {
    errors.push({ field: 'points', message: 'Points must be a number' })
  } else if (points < 0 || points > 1000) {
    errors.push({ field: 'points', message: 'Points must be between 0 and 1000' })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateLeadData(data: any): ValidationResult {
  const errors: ValidationError[] = []
  
  // Validate full name
  if (!data.fullName || data.fullName.trim().length === 0) {
    errors.push({ field: 'fullName', message: 'Full name is required' })
  } else if (data.fullName.length > 100) {
    errors.push({ field: 'fullName', message: 'Full name must be less than 100 characters' })
  }
  
  // Validate email
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors)
  }
  
  // Validate phone (optional but if provided, should be valid)
  if (data.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' })
  }
  
  // Validate URLs if provided
  if (data.propertyUrl && data.propertyUrl.trim().length > 0) {
    try {
      new URL(data.propertyUrl)
    } catch {
      errors.push({ field: 'propertyUrl', message: 'Please enter a valid property URL' })
    }
  }
  
  if (data.linkedinUrl && data.linkedinUrl.trim().length > 0) {
    try {
      const url = new URL(data.linkedinUrl)
      if (!url.hostname.includes('linkedin.com')) {
        errors.push({ field: 'linkedinUrl', message: 'LinkedIn URL must be from linkedin.com' })
      }
    } catch {
      errors.push({ field: 'linkedinUrl', message: 'Please enter a valid LinkedIn URL' })
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Rate limiting helper
export function createRateLimiter(windowMs: number, maxRequests: number) {
  const requests = new Map<string, number[]>()
  
  return (identifier: string): boolean => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!requests.has(identifier)) {
      requests.set(identifier, [])
    }
    
    const userRequests = requests.get(identifier)!
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= maxRequests) {
      return false // Rate limit exceeded
    }
    
    validRequests.push(now)
    requests.set(identifier, validRequests)
    
    return true // Request allowed
  }
}

// Environment variable validation
export function validateEnvironmentVariables(): ValidationResult {
  const errors: ValidationError[] = []
  
  const requiredVars = [
    'NOTION_API_KEY',
    'NOTION_TASKS_DATABASE_ID',
    'NOTION_LEADS_DATABASE_ID'
  ]
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push({ 
        field: varName, 
        message: `Environment variable ${varName} is required` 
      })
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}