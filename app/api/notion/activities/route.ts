import { NextRequest, NextResponse } from 'next/server'
import { NotionAPI, isNotionConfigured } from '@/lib/notion'

export async function POST(request: NextRequest) {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const activity = await request.json()
    const success = await NotionAPI.createActivity(activity)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to create activity' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}