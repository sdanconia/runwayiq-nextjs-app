// API Routes for AI Agents
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { aiCallingService } from '@/lib/services/ai-calling-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  const { data: { user }, error } = await supabase.auth.getUser(token)
  return error ? null : user
}

// GET /api/cold-calling/ai-agents - Get all AI agents for user
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agents = await aiCallingService.getAIAgents(user.id)
    
    return NextResponse.json({
      success: true,
      data: agents
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// POST /api/cold-calling/ai-agents - Create new AI agent
export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, systemPrompt, voiceId, temperature, maxTokens } = body

    if (!name || !systemPrompt) {
      return NextResponse.json({
        success: false,
        error: 'Name and system prompt are required'
      }, { status: 400 })
    }

    const agent = await aiCallingService.createAIAgent(user.id, {
      name,
      systemPrompt,
      voiceId: voiceId || 'elevenlabs_default',
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 150
    })

    return NextResponse.json({
      success: true,
      data: agent
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}