// API Routes for Cold-Calling Leads
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

// GET /api/cold-calling/leads?campaignId=xxx - Get leads for campaign
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    if (!campaignId) {
      return NextResponse.json({
        success: false,
        error: 'Campaign ID is required'
      }, { status: 400 })
    }

    const leads = await aiCallingService.getLeadsForCampaign(campaignId)
    
    return NextResponse.json({
      success: true,
      data: leads
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// POST /api/cold-calling/leads - Add leads to campaign
export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { campaignId, leads } = body

    if (!campaignId || !leads || !Array.isArray(leads)) {
      return NextResponse.json({
        success: false,
        error: 'Campaign ID and leads array are required'
      }, { status: 400 })
    }

    // Validate lead data
    for (const lead of leads) {
      if (!lead.fullName || !lead.phone) {
        return NextResponse.json({
          success: false,
          error: 'Each lead must have fullName and phone'
        }, { status: 400 })
      }
    }

    // Add user_id to each lead
    const leadsWithUserId = leads.map(lead => ({
      ...lead,
      userId: user.id
    }))

    const createdLeads = await aiCallingService.addLeadsToCampaign(campaignId, leadsWithUserId)

    return NextResponse.json({
      success: true,
      data: createdLeads,
      message: `Successfully added ${createdLeads.length} leads to campaign`
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}