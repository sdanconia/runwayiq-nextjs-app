// AI Cold-Calling Service - Core service for managing AI-powered calls
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { Twilio } from 'twilio'
import { 
  Call, 
  CallingLead, 
  CallingCampaign, 
  AIAgent, 
  CallTranscript,
  CallQueueItem,
  APIKey,
  TwilioWebhookData,
  LiveCallUpdate,
  WebSocketEvent
} from '@/lib/types/cold-calling'

// Environment variables for API keys (fallback, prefer database storage)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY

export class AICallingService {
  private supabase: any
  private openai: OpenAI
  private twilio: Twilio
  private wsConnections: Map<string, any> = new Map()

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    })

    // Initialize Twilio client
    this.twilio = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  }

  // WebSocket connection management
  addWebSocketConnection(userId: string, ws: any) {
    this.wsConnections.set(userId, ws)
  }

  removeWebSocketConnection(userId: string) {
    this.wsConnections.delete(userId)
  }

  private sendWebSocketUpdate(userId: string, event: WebSocketEvent) {
    const ws = this.wsConnections.get(userId)
    if (ws) {
      ws.send(JSON.stringify(event))
    }
  }

  // API Key Management (encrypted storage)
  async storeAPIKey(userId: string, service: string, keyName: string, value: string): Promise<void> {
    const CryptoJS = await import('crypto-js')
    const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key'
    const encryptedValue = CryptoJS.AES.encrypt(value, secretKey).toString()

    await this.supabase
      .from('api_keys')
      .upsert({
        user_id: userId,
        service,
        key_name: keyName,
        encrypted_value: encryptedValue,
        is_active: true
      })
  }

  async getAPIKey(userId: string, service: string, keyName: string): Promise<string | null> {
    const CryptoJS = await import('crypto-js')
    const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key'

    const { data, error } = await this.supabase
      .from('api_keys')
      .select('encrypted_value')
      .eq('user_id', userId)
      .eq('service', service)
      .eq('key_name', keyName)
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    try {
      const bytes = CryptoJS.AES.decrypt(data.encrypted_value, secretKey)
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch {
      return null
    }
  }

  // Campaign Management
  async createCampaign(userId: string, campaignData: Partial<CallingCampaign>): Promise<CallingCampaign> {
    const { data, error } = await this.supabase
      .from('calling_campaigns')
      .insert({
        user_id: userId,
        ...campaignData
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async getCampaigns(userId: string): Promise<CallingCampaign[]> {
    const { data, error } = await this.supabase
      .from('calling_campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  async updateCampaignStatus(campaignId: string, status: CallingCampaign['status']): Promise<void> {
    await this.supabase
      .from('calling_campaigns')
      .update({ status })
      .eq('id', campaignId)
  }

  // Lead Management
  async addLeadsToCampaign(campaignId: string, leads: Partial<CallingLead>[]): Promise<CallingLead[]> {
    const leadsWithCampaign = leads.map(lead => ({
      ...lead,
      campaign_id: campaignId,
      status: 'queued' as const
    }))

    const { data, error } = await this.supabase
      .from('calling_leads')
      .insert(leadsWithCampaign)
      .select()

    if (error) throw new Error(error.message)
    return data || []
  }

  async getLeadsForCampaign(campaignId: string): Promise<CallingLead[]> {
    const { data, error } = await this.supabase
      .from('calling_leads')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  async updateLeadStatus(leadId: string, status: CallingLead['status'], notes?: string): Promise<void> {
    const updateData: any = { status }
    if (notes) updateData.notes = notes

    await this.supabase
      .from('calling_leads')
      .update(updateData)
      .eq('id', leadId)
  }

  // AI Agent Management
  async createAIAgent(userId: string, agentData: Partial<AIAgent>): Promise<AIAgent> {
    const { data, error } = await this.supabase
      .from('ai_agents')
      .insert({
        user_id: userId,
        ...agentData
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  async getAIAgents(userId: string): Promise<AIAgent[]> {
    const { data, error } = await this.supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) throw new Error(error.message)
    return data || []
  }

  // Call Queue Management
  async addToCallQueue(userId: string, campaignId: string, leadId: string, priority: number = 1): Promise<void> {
    await this.supabase
      .from('call_queue')
      .insert({
        user_id: userId,
        campaign_id: campaignId,
        lead_id: leadId,
        priority,
        status: 'pending'
      })
  }

  async getNextQueuedCall(userId: string): Promise<CallQueueItem | null> {
    const { data, error } = await this.supabase
      .from('call_queue')
      .select(`
        *,
        calling_leads(*),
        calling_campaigns(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('scheduled_at', { ascending: true })
      .limit(1)
      .single()

    if (error) return null
    return data
  }

  async updateQueueItemStatus(queueId: string, status: CallQueueItem['status'], errorMessage?: string): Promise<void> {
    const updateData: any = { status }
    if (errorMessage) updateData.error_message = errorMessage
    if (status === 'processing') updateData.started_at = new Date().toISOString()
    if (status === 'completed' || status === 'failed') updateData.completed_at = new Date().toISOString()

    await this.supabase
      .from('call_queue')
      .update(updateData)
      .eq('id', queueId)
  }

  // Twilio Integration
  async initiateCall(userId: string, lead: CallingLead, campaign: CallingCampaign): Promise<Call> {
    // Get user's Twilio credentials
    const accountSid = await this.getAPIKey(userId, 'twilio', 'account_sid') || TWILIO_ACCOUNT_SID
    const authToken = await this.getAPIKey(userId, 'twilio', 'auth_token') || TWILIO_AUTH_TOKEN
    const fromNumber = await this.getAPIKey(userId, 'twilio', 'phone_number')

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured')
    }

    // Create call record in database
    const { data: callRecord, error } = await this.supabase
      .from('calls')
      .insert({
        campaign_id: campaign.id,
        lead_id: lead.id,
        user_id: userId,
        status: 'queued',
        direction: 'outbound',
        from_number: fromNumber,
        to_number: lead.phone
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    try {
      // Initiate Twilio call
      const twilioClient = new Twilio(accountSid, authToken)
      const call = await twilioClient.calls.create({
        from: fromNumber,
        to: lead.phone,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/voice/${callRecord.id}`,
        statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/status`,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        record: true
      })

      // Update call record with Twilio SID
      await this.supabase
        .from('calls')
        .update({
          twilio_call_sid: call.sid,
          status: 'ringing',
          started_at: new Date().toISOString()
        })
        .eq('id', callRecord.id)

      // Send WebSocket update
      this.sendWebSocketUpdate(userId, {
        type: 'call_started',
        data: { callId: callRecord.id, leadName: lead.fullName, phone: lead.phone },
        timestamp: new Date().toISOString()
      })

      return { ...callRecord, twilio_call_sid: call.sid, status: 'ringing' }
    } catch (error: any) {
      // Update call record with error
      await this.supabase
        .from('calls')
        .update({
          status: 'failed',
          ended_at: new Date().toISOString()
        })
        .eq('id', callRecord.id)

      throw new Error(`Failed to initiate call: ${error.message}`)
    }
  }

  // AI Conversation Management
  async processCallTranscript(callId: string, audioChunk: Buffer): Promise<string> {
    // Transcribe audio using OpenAI Whisper
    const transcription = await this.transcribeAudio(audioChunk)
    
    if (!transcription) return ''

    // Store transcript
    await this.storeTranscript(callId, 'human', transcription)

    // Get AI response
    const aiResponse = await this.generateAIResponse(callId, transcription)
    
    // Store AI response
    await this.storeTranscript(callId, 'ai', aiResponse)

    // Convert AI response to speech
    const audioBuffer = await this.textToSpeech(aiResponse)

    return aiResponse
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: new File([audioBuffer], 'audio.wav', { type: 'audio/wav' }),
        model: 'whisper-1'
      })
      return response.text
    } catch (error) {
      console.error('Transcription error:', error)
      return ''
    }
  }

  async generateAIResponse(callId: string, userMessage: string): Promise<string> {
    // Get call context and conversation history
    const { data: call } = await this.supabase
      .from('calls')
      .select(`
        *,
        calling_leads(*),
        calling_campaigns(ai_agents(*))
      `)
      .eq('id', callId)
      .single()

    if (!call) return "I'm sorry, I'm having trouble processing your request."

    // Get conversation history
    const { data: transcripts } = await this.supabase
      .from('call_transcripts')
      .select('speaker, message')
      .eq('call_id', callId)
      .order('created_at', { ascending: true })

    const conversationHistory = transcripts?.map((t: any) => 
      `${t.speaker === 'ai' ? 'Assistant' : 'Human'}: ${t.message}`
    ).join('\n') || ''

    const systemPrompt = call.calling_campaigns.ai_agents?.system_prompt || 
      "You are a professional sales representative. Be polite, conversational, and focus on understanding the prospect's needs."

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: `You are calling ${call.calling_leads.full_name} from ${call.calling_leads.company || 'their company'}. Here's the conversation so far:\n${conversationHistory}` },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: call.calling_campaigns.ai_agents?.temperature || 0.7
      })

      return response.choices[0]?.message?.content || "I understand. Let me help you with that."
    } catch (error) {
      console.error('AI response error:', error)
      return "I'm sorry, could you repeat that?"
    }
  }

  async textToSpeech(text: string, voiceId: string = 'default'): Promise<Buffer> {
    try {
      // Use ElevenLabs API for high-quality TTS
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY!
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      })

      if (!response.ok) {
        throw new Error('TTS API error')
      }

      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      console.error('TTS error:', error)
      // Fallback to OpenAI TTS
      try {
        const response = await this.openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy',
          input: text
        })
        return Buffer.from(await response.arrayBuffer())
      } catch {
        return Buffer.from('')
      }
    }
  }

  async storeTranscript(callId: string, speaker: 'ai' | 'human', message: string): Promise<void> {
    await this.supabase
      .from('call_transcripts')
      .insert({
        call_id: callId,
        speaker,
        message,
        timestamp_seconds: 0, // TODO: Calculate actual timestamp
        confidence: 0.95
      })
  }

  // Webhook Handlers
  async handleTwilioStatusUpdate(data: TwilioWebhookData): Promise<void> {
    const { CallSid, CallStatus, Duration, RecordingUrl } = data

    // Find call by Twilio SID
    const { data: call } = await this.supabase
      .from('calls')
      .select('*')
      .eq('twilio_call_sid', CallSid)
      .single()

    if (!call) return

    // Update call status
    const updateData: any = { status: this.mapTwilioStatus(CallStatus) }
    
    if (CallStatus === 'completed') {
      updateData.ended_at = new Date().toISOString()
      updateData.duration_seconds = parseInt(Duration || '0')
      if (RecordingUrl) updateData.recording_url = RecordingUrl
    }

    await this.supabase
      .from('calls')
      .update(updateData)
      .eq('id', call.id)

    // Send WebSocket update
    this.sendWebSocketUpdate(call.user_id, {
      type: 'status_update',
      data: { callId: call.id, status: updateData.status },
      timestamp: new Date().toISOString()
    })

    // If call completed, analyze and update lead
    if (CallStatus === 'completed') {
      await this.analyzeCompletedCall(call.id)
    }
  }

  private mapTwilioStatus(twilioStatus: string): Call['status'] {
    switch (twilioStatus) {
      case 'queued':
      case 'initiated': return 'queued'
      case 'ringing': return 'ringing'
      case 'in-progress': return 'in_progress'
      case 'completed': return 'completed'
      case 'failed':
      case 'canceled': return 'failed'
      case 'busy': return 'busy'
      case 'no-answer': return 'no_answer'
      default: return 'queued'
    }
  }

  async analyzeCompletedCall(callId: string): Promise<void> {
    // Get call transcripts
    const { data: transcripts } = await this.supabase
      .from('call_transcripts')
      .select('*')
      .eq('call_id', callId)
      .order('created_at', { ascending: true })

    if (!transcripts || transcripts.length === 0) return

    const fullTranscript = transcripts.map((t: any) => `${t.speaker}: ${t.message}`).join('\n')

    try {
      // Use AI to analyze the call
      const analysis = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Analyze this sales call transcript and provide a JSON response with:
            - sentiment: "positive", "neutral", or "negative"
            - interestLevel: number from 1-5
            - keyTopics: array of main discussion points
            - nextSteps: array of recommended follow-up actions
            - summary: brief summary of the call
            - callOutcome: "interested", "not_interested", "callback_requested", "voicemail", or "no_answer"`
          },
          { role: 'user', content: fullTranscript }
        ]
      })

      const aiAnalysis = JSON.parse(analysis.choices[0]?.message?.content || '{}')

      // Update call with analysis
      await this.supabase
        .from('calls')
        .update({
          ai_analysis: aiAnalysis,
          call_outcome: aiAnalysis.callOutcome,
          interest_level: aiAnalysis.interestLevel
        })
        .eq('id', callId)

      // Update lead status based on analysis
      const { data: call } = await this.supabase
        .from('calls')
        .select('lead_id')
        .eq('id', callId)
        .single()

      if (call) {
        let leadStatus: CallingLead['status'] = 'contacted'
        
        if (aiAnalysis.callOutcome === 'interested') leadStatus = 'interested'
        else if (aiAnalysis.callOutcome === 'not_interested') leadStatus = 'not_interested'
        else if (aiAnalysis.callOutcome === 'callback_requested') leadStatus = 'callback'

        await this.updateLeadStatus(call.lead_id, leadStatus)
      }
    } catch (error) {
      console.error('Call analysis error:', error)
    }
  }

  // Analytics
  async calculateDailyAnalytics(userId: string, campaignId: string, date: string): Promise<void> {
    // This calls the database function we created in the schema
    await this.supabase.rpc('calculate_daily_analytics', {
      user_uuid: userId,
      campaign_uuid: campaignId,
      analytics_date: date
    })
  }

  async getCampaignAnalytics(campaignId: string, days: number = 30): Promise<any> {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))

    const { data, error } = await this.supabase
      .from('call_analytics')
      .select('*')
      .eq('campaign_id', campaignId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }
}

// Export singleton instance
export const aiCallingService = new AICallingService()