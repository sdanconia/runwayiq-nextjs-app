// API Route to start a campaign
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

// POST /api/cold-calling/campaigns/[id]/start - Start campaign
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const campaignId = resolvedParams.id

    // Update campaign status to active
    await aiCallingService.updateCampaignStatus(campaignId, 'active')

    // Get all leads for this campaign
    const leads = await aiCallingService.getLeadsForCampaign(campaignId)
    
    // Add leads to call queue
    for (const lead of leads) {
      if (lead.status === 'queued') {
        await aiCallingService.addToCallQueue(user.id, campaignId, lead.id)
      }
    }

    // Start processing the queue (this would be handled by a background worker)
    // For now, we'll just mark it as started
    return NextResponse.json({
      success: true,
      message: `Campaign started with ${leads.length} leads queued`,
      data: {
        campaignId,
        leadsQueued: leads.length
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}