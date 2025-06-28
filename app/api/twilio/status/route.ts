// Twilio Status Callback Webhook Handler
import { NextRequest, NextResponse } from 'next/server'
import { aiCallingService } from '@/lib/services/ai-calling-service'

// POST /api/twilio/status - Handle Twilio call status updates
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const webhookData = {
      CallSid: formData.get('CallSid') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      CallStatus: formData.get('CallStatus') as string,
      Direction: formData.get('Direction') as string,
      Duration: formData.get('CallDuration') as string,
      RecordingUrl: formData.get('RecordingUrl') as string
    }

    console.log('Twilio status update:', webhookData)

    // Handle the status update
    await aiCallingService.handleTwilioStatusUpdate(webhookData)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Status webhook error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}