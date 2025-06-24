import { NextRequest, NextResponse } from 'next/server'
import { NotionAPI, isNotionConfigured } from '@/lib/notion'
import { CampaignEngine } from '@/lib/campaignEngine'

export async function GET() {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const campaigns = await NotionAPI.getCampaigns()
    return NextResponse.json({ campaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const { leadId, owner } = await request.json()
    
    // Get lead details
    const leads = await NotionAPI.getLeads()
    const lead = leads.find(l => l.id === leadId)
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Create campaign
    const campaign = await CampaignEngine.createCampaign(lead, owner)
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      )
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}