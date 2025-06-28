// Twilio Voice Webhook Handler
import { NextRequest, NextResponse } from 'next/server'
import { aiCallingService } from '@/lib/services/ai-calling-service'

// POST /api/twilio/voice/[callId] - Handle incoming Twilio voice webhook
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  try {
    const resolvedParams = await params
    const callId = resolvedParams.callId
    
    // Generate TwiML response for AI-powered conversation
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Hello! This is an AI assistant calling on behalf of our company. How are you doing today?</Say>
    <Gather input="speech" timeout="10" speechTimeout="3" action="/api/twilio/gather/${callId}" method="POST">
        <Say voice="alice">I'd love to learn more about your business needs. Could you tell me a bit about what you're currently working on?</Say>
    </Gather>
    <Say voice="alice">I didn't catch that. Let me try calling you again later. Have a great day!</Say>
    <Hangup/>
</Response>`

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  } catch (error: any) {
    console.error('Voice webhook error:', error)
    
    // Return error TwiML
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">I'm sorry, we're experiencing technical difficulties. We'll call you back soon.</Say>
    <Hangup/>
</Response>`

    return new NextResponse(errorTwiml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }
}