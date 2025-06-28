// AI Cold-Calling Platform Type Definitions

export interface AIAgent {
  id: string
  userId: string
  name: string
  systemPrompt: string
  voiceId: string
  temperature: number
  maxTokens: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CallingCampaign {
  id: string
  userId: string
  name: string
  description?: string
  aiAgentId?: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  totalLeads: number
  callsMade: number
  callsConnected: number
  callsInterested: number
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface CallingLead {
  id: string
  campaignId: string
  userId: string
  fullName: string
  email?: string
  phone: string
  company?: string
  title?: string
  linkedinUrl?: string
  status: 'queued' | 'calling' | 'contacted' | 'interested' | 'not_interested' | 'callback' | 'do_not_call' | 'completed'
  priority: number
  callAttempts: number
  lastCallDate?: string
  nextCallDate?: string
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface Call {
  id: string
  campaignId: string
  leadId: string
  userId: string
  twilioCallSid?: string
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'busy' | 'no_answer'
  direction: 'outbound' | 'inbound'
  fromNumber?: string
  toNumber?: string
  durationSeconds: number
  recordingUrl?: string
  transcript?: string
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative'
    interestLevel: number
    keyTopics: string[]
    nextSteps: string[]
    summary: string
  }
  callOutcome?: 'no_answer' | 'voicemail' | 'connected' | 'interested' | 'not_interested' | 'callback_requested' | 'do_not_call'
  interestLevel?: number
  followUpRequired: boolean
  followUpDate?: string
  costCents: number
  startedAt?: string
  endedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CallTranscript {
  id: string
  callId: string
  speaker: 'ai' | 'human'
  message: string
  timestampSeconds: number
  confidence: number
  createdAt: string
}

export interface APIKey {
  id: string
  userId: string
  service: 'twilio' | 'openai' | 'elevenlabs' | 'google'
  keyName: string
  encryptedValue: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CallQueueItem {
  id: string
  campaignId: string
  leadId: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying'
  priority: number
  scheduledAt: string
  startedAt?: string
  completedAt?: string
  errorMessage?: string
  retryCount: number
  maxRetries: number
  createdAt: string
  updatedAt: string
}

export interface CallAnalytics {
  id: string
  userId: string
  campaignId: string
  date: string
  callsMade: number
  callsConnected: number
  callsInterested: number
  totalDurationSeconds: number
  totalCostCents: number
  averageCallDuration: number
  connectionRate: number
  interestRate: number
  createdAt: string
  updatedAt: string
}

// Real-time WebSocket Events
export interface WebSocketEvent {
  type: 'call_started' | 'call_ended' | 'transcript_update' | 'status_update' | 'error'
  data: any
  timestamp: string
}

export interface LiveCallUpdate {
  callId: string
  status: Call['status']
  transcript?: string
  duration?: number
  leadName?: string
}

// AI Configuration
export interface AIConfig {
  voice: string
  temperature: number
  systemPrompt: string
  maxTokens: number
}

// Voice Options for TTS
export interface VoiceOption {
  id: string
  name: string
  provider: 'elevenlabs' | 'openai'
  gender: 'male' | 'female'
  accent: string
  description: string
  previewUrl?: string
}

// Campaign Statistics
export interface CampaignStats {
  totalLeads: number
  callsMade: number
  callsConnected: number
  connectionRate: number
  interestRate: number
  averageCallDuration: number
  totalCost: number
  leadsInterested: number
  leadsNotInterested: number
  leadsNeedingCallback: number
}

// Dashboard Data
export interface DashboardData {
  activeCampaigns: CallingCampaign[]
  todayStats: {
    callsMade: number
    callsConnected: number
    connectionRate: number
    totalDuration: number
  }
  recentCalls: Call[]
  queuedCalls: CallQueueItem[]
  upcomingCallbacks: CallingLead[]
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Twilio Integration Types
export interface TwilioWebhookData {
  CallSid: string
  From: string
  To: string
  CallStatus: string
  Direction: string
  Duration?: string
  RecordingUrl?: string
}

// OpenAI/Whisper Types
export interface TranscriptionRequest {
  audio: Buffer | string
  model?: string
  language?: string
}

export interface TranscriptionResponse {
  text: string
  confidence?: number
}

// ElevenLabs Types
export interface TTSRequest {
  text: string
  voice_id: string
  model_id?: string
  voice_settings?: {
    stability: number
    similarity_boost: number
  }
}

// Form Data Types
export interface CreateCampaignForm {
  name: string
  description: string
  aiAgentId: string
}

export interface CreateLeadForm {
  fullName: string
  email?: string
  phone: string
  company?: string
  title?: string
  linkedinUrl?: string
}

export interface UpdateLeadForm extends Partial<CreateLeadForm> {
  status?: CallingLead['status']
  notes?: string
  tags?: string[]
}

export interface AIAgentForm {
  name: string
  systemPrompt: string
  voiceId: string
  temperature: number
  maxTokens: number
}

// Error Types
export interface CallError {
  code: string
  message: string
  details?: any
}

// Audio Processing Types
export interface AudioChunk {
  data: Buffer
  timestamp: number
  sequenceNumber: number
}

export interface ProcessedAudio {
  transcript: string
  confidence: number
  isFinal: boolean
}

// Real-time Call State
export interface LiveCallState {
  callId: string
  leadName: string
  phone: string
  status: Call['status']
  duration: number
  transcript: CallTranscript[]
  isRecording: boolean
  aiResponse?: string
}

// Integration Status
export interface IntegrationStatus {
  twilio: boolean
  openai: boolean
  elevenlabs: boolean
  redis: boolean
}

// Export types only, no default export needed for type-only module