// Dashboard-specific types
export interface KPI {
  title: string
  value: string
  target: string
  progress: number
  icon: React.ElementType
  color: string
  trend: number
}

export interface Activity {
  type: 'deal' | 'demo' | 'call' | 'target'
  title: string
  points: number
  time: string
}

export interface Badge {
  title: string
  description: string
  earned: boolean
}

export interface LocalTask {
  id: number | string
  text: string
  priority: 'high' | 'medium' | 'low'
  points: number
  completed: boolean
}

// API Response types
export interface APIResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

export interface TasksResponse {
  tasks: import('@/lib/notion').NotionTask[]
}

export interface LeadsResponse {
  leads: import('@/lib/notion').NotionLead[]
}

export interface CampaignsResponse {
  campaigns: import('@/lib/notion').NotionCampaign[]
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// User authentication types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'viewer'
  permissions: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}