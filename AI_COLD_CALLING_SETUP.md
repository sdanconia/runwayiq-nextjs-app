# AI Cold-Calling Platform Setup Guide

This guide will help you set up the complete AI Cold-Calling Platform that has been integrated into your existing RunwayIQ dashboard.

## 🎯 What's Been Built

We've successfully integrated a **production-ready AI Cold-Calling Platform** into your existing RunwayIQ dashboard with the following features:

### ✅ Core Features Implemented

1. **AI-Powered Conversations** - Real-time AI agents that can handle natural phone conversations
2. **Campaign Management** - Create, start, pause, and monitor cold-calling campaigns
3. **Lead Management** - Import leads, track call attempts, and manage follow-ups
4. **Live Call Monitoring** - Real-time dashboard showing active calls with live transcripts
5. **Analytics & Reporting** - Track connection rates, interest levels, and campaign performance
6. **Secure API Integration** - Encrypted storage of API keys for Twilio, OpenAI, and ElevenLabs

### 🏗 System Architecture

- **Frontend**: React components integrated into existing dashboard
- **Backend**: Next.js API routes with Supabase database
- **Real-time**: WebSocket support for live call monitoring
- **AI Pipeline**: OpenAI Whisper (STT) → GPT-4 (Conversation) → ElevenLabs (TTS)
- **Telephony**: Twilio for making and managing phone calls
- **Queue System**: Background job processing for call automation

## 📋 Prerequisites

Before you can start making AI cold calls, you'll need accounts and API keys for:

1. **Twilio** (for phone calls)
2. **OpenAI** (for AI conversations)
3. **ElevenLabs** (for realistic voice synthesis)
4. **Redis** (for job queue - optional for basic setup)

## 🚀 Quick Setup (5 Steps)

### Step 1: Database Setup

Run the database migration to add the cold-calling tables:

```bash
# In your Supabase SQL Editor, run the contents of:
database-schema-extension.sql
```

This adds tables for:
- `ai_agents` - AI agent configurations
- `calling_campaigns` - Campaign management
- `calling_leads` - Lead tracking
- `calls` - Call records and transcripts
- `call_queue` - Background job queue
- `api_keys` - Secure API key storage

### Step 2: Get API Keys

#### Twilio Setup
1. Sign up at [twilio.com](https://twilio.com)
2. Get your **Account SID** and **Auth Token** from the console
3. Purchase a phone number for outbound calls
4. Configure webhooks (see Step 4)

#### OpenAI Setup
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Ensure you have access to GPT-4 and Whisper APIs

#### ElevenLabs Setup
1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Create an API key
3. Choose voice IDs for your AI agents

### Step 3: Environment Variables

Add these to your `.env.local` file:

```env
# Existing Supabase vars...
NEXT_PUBLIC_SUPABASE_URL=https://gapmflftarqpczpzwxba.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcG1mbGZ0YXJxcGN6cHp3eGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Mjk1NzAsImV4cCI6MjA2NjMwNTU3MH0.8JNSBIfaPgbiTqmMomHUUlfJnurlae1FNkg_jeQE4ZU
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_dashboard

# New AI Cold-Calling vars
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ENCRYPTION_SECRET=your_32_char_secret_for_api_key_encryption

# App URL for webhooks
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Twilio Webhook Configuration

In your Twilio console, configure these webhooks:

1. **Voice URL**: `https://yourdomain.com/api/twilio/voice/[call-id]`
2. **Status Callback**: `https://yourdomain.com/api/twilio/status`

For local development, use [ngrok](https://ngrok.com) to expose your localhost:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL for webhooks
```

### Step 5: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Go to your sales dashboard: `http://localhost:3000/sales-dashboard`

3. Click on the **"AI Cold Calling"** tab

4. Create your first AI agent and campaign

## 🤖 Creating Your First AI Agent

1. Navigate to **AI Cold Calling** → **AI Settings**
2. Click **"Create New Agent"**
3. Configure your agent:

```
Name: Sales Rep Sarah
Voice: Choose from ElevenLabs voices
System Prompt: "You are Sarah, a professional sales representative calling on behalf of RunwayIQ. You help companies automate their sales processes with AI. Be friendly, conversational, and focus on understanding their current challenges with lead generation and sales automation. Keep responses under 2 sentences and always ask follow-up questions."
Temperature: 0.7 (for natural conversation)
```

## 📞 Creating Your First Campaign

1. Click **"New Campaign"**
2. Set up your campaign:

```
Name: Q1 Cold Outreach
Description: Initial outreach to warm leads
AI Agent: Sales Rep Sarah
```

3. Import leads via CSV with columns:
   - Full Name (required)
   - Phone (required) 
   - Email
   - Company
   - Title
   - LinkedIn URL

4. Click **"Start Campaign"** to begin making calls

## 📊 Monitoring Live Calls

The dashboard provides real-time monitoring:

- **Live Call Panel**: Shows current active call with transcript
- **Call Queue**: Upcoming calls to be made
- **Campaign Stats**: Real-time metrics and performance
- **Call History**: Complete transcripts and recordings

## 🔧 Advanced Configuration

### Custom AI Prompts

Customize your AI agent's behavior by editing the system prompt:

```
You are [Name], calling on behalf of [Company]. 
Your goal is to [specific objective].
Key points to cover:
1. [Point 1]
2. [Point 2]
3. [Point 3]

Keep responses conversational and under 2 sentences.
Always end with a question to keep the conversation flowing.
```

### Voice Selection

Choose from ElevenLabs voices:
- **Professional Male**: Good for B2B sales
- **Friendly Female**: Great for warm outreach
- **Energetic**: Best for younger demographics

### Call Scheduling

Configure when calls are made:
- Business hours only (9 AM - 5 PM local time)
- Respect time zones
- Avoid weekends and holidays

## 📈 Analytics & Optimization

Track key metrics:
- **Connection Rate**: % of calls that connect to a human
- **Interest Rate**: % of connected calls that show interest
- **Average Call Duration**: Engagement indicator
- **Cost Per Lead**: ROI calculation

Use these insights to:
1. Optimize AI prompts for better engagement
2. Improve lead quality and targeting
3. Adjust calling schedules for better connection rates
4. Refine scripts based on successful conversations

## 🔒 Security & Compliance

### Data Protection
- All API keys are encrypted in the database
- Call recordings are stored securely in Supabase Storage
- Transcripts are processed server-side only
- No sensitive data is exposed to the frontend

### Compliance
- **TCPA Compliance**: Only call leads who have opted in
- **Do Not Call Lists**: Automatically respect DNC requests
- **Call Recording**: Inform prospects of recording (built into prompts)
- **Data Retention**: Configure automatic deletion of old recordings

## 🛠 Troubleshooting

### Common Issues

1. **Calls not connecting**
   - Check Twilio credentials
   - Verify webhook URLs are accessible
   - Ensure phone number is properly formatted

2. **AI not responding**
   - Check OpenAI API key and usage limits
   - Verify system prompt is not too long
   - Check Whisper transcription quality

3. **Poor voice quality**
   - Check ElevenLabs API key
   - Try different voice IDs
   - Adjust voice stability settings

4. **Webhook errors**
   - Use ngrok for local development
   - Check webhook URL configuration in Twilio
   - Verify API endpoints are responding

### Debug Mode

Enable detailed logging by adding to `.env.local`:

```env
DEBUG_COLD_CALLING=true
```

This will log all API calls, transcriptions, and AI responses.

## 🚢 Production Deployment

### Environment Setup

1. **Domain Configuration**
   - Update `NEXT_PUBLIC_APP_URL` to your production domain
   - Configure Twilio webhooks with production URLs

2. **Database**
   - Run all migrations in production Supabase
   - Set up proper RLS policies
   - Configure backups for call data

3. **Monitoring**
   - Set up error tracking (Sentry recommended)
   - Monitor API usage and costs
   - Set up alerts for failed calls

4. **Scaling**
   - Consider Redis for job queue in high-volume scenarios
   - Implement rate limiting for API endpoints
   - Set up load balancing for multiple servers

## 📞 Support & Next Steps

### Immediate Next Steps
1. Run the database migration
2. Get your API keys
3. Create your first AI agent
4. Import test leads
5. Make your first AI cold call!

### Advanced Features (Future)
- Multi-language support
- Advanced call routing
- Integration with CRM systems
- A/B testing for AI prompts
- Voice cloning for personalized agents

### Getting Help
- Check the troubleshooting section above
- Review API documentation for integrations
- Test thoroughly with small batches before scaling

---

## 🎉 You're All Set!

Your AI Cold-Calling Platform is now ready to revolutionize your outbound sales process. The system will automatically:

1. ✅ Make calls to your leads
2. ✅ Have natural AI-powered conversations  
3. ✅ Qualify prospects and capture interest
4. ✅ Schedule follow-ups and demos
5. ✅ Provide detailed analytics and insights

Start with a small test campaign to familiarize yourself with the system, then scale up as you optimize your approach.

**Happy calling! 📞🤖**