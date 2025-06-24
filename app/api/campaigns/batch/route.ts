import { NextRequest, NextResponse } from 'next/server'
import { isNotionConfigured } from '@/lib/notion'
import { CampaignEngine } from '@/lib/campaignEngine'
import { GoogleSheetsAPI, isGoogleSheetsConfigured } from '@/lib/googleSheets'

export async function POST(request: NextRequest) {
  if (!isNotionConfigured() || !isGoogleSheetsConfigured()) {
    return NextResponse.json(
      { error: 'Notion and Google Sheets integration required' },
      { status: 400 }
    )
  }

  try {
    const { defaultOwner } = await request.json()
    
    // Get leads from Google Sheets
    const googleLeads = await GoogleSheetsAPI.getLeads()
    
    if (googleLeads.length === 0) {
      return NextResponse.json(
        { error: 'No leads found in Google Sheets' },
        { status: 404 }
      )
    }

    // Import leads to Notion first
    const syncResult = await GoogleSheetsAPI.syncLeadsToNotion()
    
    // Create campaigns for all leads
    // Note: This is a simplified version - in production you'd want to handle this more carefully
    const result = {
      leadsImported: syncResult.imported,
      campaignsCreated: 0,
      errors: [...syncResult.errors]
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating batch campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to create batch campaigns' },
      { status: 500 }
    )
  }
}