import { NextRequest, NextResponse } from 'next/server'
import { NotionAPI, isNotionConfigured } from '@/lib/notion'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const resolvedParams = await params
    const updates = await request.json()
    const success = await NotionAPI.updateTask(resolvedParams.id, updates)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}