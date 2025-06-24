import { NextRequest, NextResponse } from 'next/server'
import { NotionAPI, isNotionConfigured } from '@/lib/notion'

export async function GET() {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const leads = await NotionAPI.getLeads()
    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
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
    const lead = await request.json()
    const createdLead = await NotionAPI.createLead(lead)
    
    if (!createdLead) {
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({ lead: createdLead })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}