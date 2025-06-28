// API Routes for Cold-Calling Campaigns
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { aiCallingService } from '@/lib/services/ai-calling-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Get user from JWT token
async function getUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null

  const { data: { user }, error } = await supabase.auth.getUser(token)
  return error ? null : user
}

// GET /api/cold-calling/campaigns - Get all campaigns for user
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaigns = await aiCallingService.getCampaigns(user.id)
    
    return NextResponse.json({
      success: true,
      data: campaigns
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// POST /api/cold-calling/campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, aiAgentId } = body

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Campaign name is required'
      }, { status: 400 })
    }

    const campaign = await aiCallingService.createCampaign(user.id, {
      name,
      description,
      aiAgentId,
      status: 'draft'
    })

    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}