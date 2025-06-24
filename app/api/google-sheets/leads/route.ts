import { NextRequest, NextResponse } from 'next/server'
import { GoogleSheetsAPI, isGoogleSheetsConfigured } from '@/lib/googleSheets'

export async function GET() {
  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json(
      { error: 'Google Sheets integration not configured' },
      { status: 400 }
    )
  }

  try {
    const leads = await GoogleSheetsAPI.getLeads()
    return NextResponse.json({ leads })
  } catch (error) {
    console.error('Error fetching leads from Google Sheets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads from Google Sheets' },
      { status: 500 }
    )
  }
}

export async function POST() {
  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json(
      { error: 'Google Sheets integration not configured' },
      { status: 400 }
    )
  }

  try {
    const result = await GoogleSheetsAPI.syncLeadsToNotion()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error syncing leads to Notion:', error)
    return NextResponse.json(
      { error: 'Failed to sync leads to Notion' },
      { status: 500 }
    )
  }
}