// Twilio Gather Webhook Handler for AI Conversation
import { NextRequest, NextResponse } from 'next/server'
import { aiCallingService } from '@/lib/services/ai-calling-service'

// POST /api/twilio/gather/[callId] - Handle speech input and generate AI response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  try {
    const resolvedParams = await params
    const callId = resolvedParams.callId
    const formData = await request.formData()
    const speechResult = formData.get('SpeechResult') as string
    const confidence = formData.get('Confidence') as string

    console.log(`[Call ${callId}] Speech received:`, speechResult, 'Confidence:', confidence)

    // Store the human speech in transcript
    await aiCallingService.storeTranscript(callId, 'human', speechResult || 'No speech detected')

    let aiResponse = "I'm sorry, I didn't catch that. Could you repeat that?"
    
    if (speechResult && parseFloat(confidence || '0') > 0.5) {
      // Generate AI response based on the speech
      aiResponse = await aiCallingService.generateAIResponse(callId, speechResult)
    }

    // Store AI response in transcript
    await aiCallingService.storeTranscript(callId, 'ai', aiResponse)

    // Generate TwiML with AI response and continue conversation
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">${escapeXml(aiResponse)}</Say>
    <Gather input="speech" timeout="10" speechTimeout="3" action="/api/twilio/gather/${callId}" method="POST">
        <Say voice="alice">Is there anything else I can help you with today?</Say>
    </Gather>
    <Say voice="alice">Thank you for your time. We'll follow up with you soon. Have a great day!</Say>
    <Hangup/>
</Response>`

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  } catch (error: any) {
    console.error('Gather webhook error:', error)
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Thank you for your time. We'll be in touch soon. Goodbye!</Say>
    <Hangup/>
</Response>`

    return new NextResponse(errorTwiml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}