-- AI Cold-Calling Platform Database Schema Extension
-- Add these tables to your existing Supabase database

-- Add demo booking columns to profiles table (if not already added)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS demo_booked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS demo_booking_url TEXT,
ADD COLUMN IF NOT EXISTS demo_date TIMESTAMP WITH TIME ZONE;

-- Extend profiles table with AI cold-calling settings
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  ai_agent_config JSONB DEFAULT '{"voice": "elevenlabs_default", "temperature": 0.7, "system_prompt": "You are a professional sales representative calling on behalf of our company. Be polite, conversational, and focus on understanding the prospect''s needs."}';

-- AI Agents Configuration Table
CREATE TABLE IF NOT EXISTS ai_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  voice_id TEXT DEFAULT 'elevenlabs_default',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 150,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table extension for cold calling
CREATE TABLE IF NOT EXISTS calling_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  ai_agent_id UUID REFERENCES ai_agents(id),
  status TEXT CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
  total_leads INTEGER DEFAULT 0,
  calls_made INTEGER DEFAULT 0,
  calls_connected INTEGER DEFAULT 0,
  calls_interested INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table for cold calling (extends existing lead management)
CREATE TABLE IF NOT EXISTS calling_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES calling_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  company TEXT,
  title TEXT,
  linkedin_url TEXT,
  status TEXT CHECK (status IN ('queued', 'calling', 'contacted', 'interested', 'not_interested', 'callback', 'do_not_call', 'completed')) DEFAULT 'queued',
  priority INTEGER DEFAULT 1,
  call_attempts INTEGER DEFAULT 0,
  last_call_date TIMESTAMP WITH TIME ZONE,
  next_call_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Records Table
CREATE TABLE IF NOT EXISTS calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES calling_campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES calling_leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  twilio_call_sid TEXT UNIQUE,
  status TEXT CHECK (status IN ('queued', 'ringing', 'in_progress', 'completed', 'failed', 'busy', 'no_answer')) DEFAULT 'queued',
  direction TEXT CHECK (direction IN ('outbound', 'inbound')) DEFAULT 'outbound',
  from_number TEXT,
  to_number TEXT,
  duration_seconds INTEGER DEFAULT 0,
  recording_url TEXT,
  transcript TEXT,
  ai_analysis JSONB, -- Store AI analysis of the call (sentiment, interest level, next steps)
  call_outcome TEXT CHECK (call_outcome IN ('no_answer', 'voicemail', 'connected', 'interested', 'not_interested', 'callback_requested', 'do_not_call')),
  interest_level INTEGER CHECK (interest_level >= 1 AND interest_level <= 5), -- 1-5 scale
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  cost_cents INTEGER DEFAULT 0, -- Cost in cents
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call Transcripts Table (for detailed conversation tracking)
CREATE TABLE IF NOT EXISTS call_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  speaker TEXT CHECK (speaker IN ('ai', 'human')) NOT NULL,
  message TEXT NOT NULL,
  timestamp_seconds DECIMAL(10,3), -- Timestamp within the call
  confidence DECIMAL(4,3), -- STT confidence score
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys Management (secure storage)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT CHECK (service IN ('twilio', 'openai', 'elevenlabs', 'google')) NOT NULL,
  key_name TEXT NOT NULL, -- e.g., 'account_sid', 'auth_token', 'api_key'
  encrypted_value TEXT NOT NULL, -- Encrypted API key value
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service, key_name)
);

-- Job Queue for Call Processing
CREATE TABLE IF NOT EXISTS call_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES calling_campaigns(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES calling_leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying')) DEFAULT 'pending',
  priority INTEGER DEFAULT 1,
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and Reporting Views
CREATE TABLE IF NOT EXISTS call_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES calling_campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calls_made INTEGER DEFAULT 0,
  calls_connected INTEGER DEFAULT 0,
  calls_interested INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  total_cost_cents INTEGER DEFAULT 0,
  average_call_duration DECIMAL(10,2) DEFAULT 0,
  connection_rate DECIMAL(5,4) DEFAULT 0, -- Percentage
  interest_rate DECIMAL(5,4) DEFAULT 0, -- Percentage
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, campaign_id, date)
);

-- Row Level Security Policies
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calling_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE calling_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI Agents
CREATE POLICY "Users can view own AI agents" ON ai_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own AI agents" ON ai_agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI agents" ON ai_agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own AI agents" ON ai_agents FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Calling Campaigns
CREATE POLICY "Users can view own calling campaigns" ON calling_campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own calling campaigns" ON calling_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calling campaigns" ON calling_campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calling campaigns" ON calling_campaigns FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Calling Leads
CREATE POLICY "Users can view own calling leads" ON calling_leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own calling leads" ON calling_leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calling leads" ON calling_leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calling leads" ON calling_leads FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Calls
CREATE POLICY "Users can view own calls" ON calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own calls" ON calls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calls" ON calls FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Call Transcripts
CREATE POLICY "Users can view own call transcripts" ON call_transcripts FOR SELECT USING (
  EXISTS (SELECT 1 FROM calls WHERE calls.id = call_transcripts.call_id AND calls.user_id = auth.uid())
);
CREATE POLICY "Users can create own call transcripts" ON call_transcripts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM calls WHERE calls.id = call_transcripts.call_id AND calls.user_id = auth.uid())
);

-- RLS Policies for API Keys
CREATE POLICY "Users can view own API keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own API keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own API keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own API keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Call Queue
CREATE POLICY "Users can view own call queue" ON call_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own call queue items" ON call_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own call queue items" ON call_queue FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for Call Analytics
CREATE POLICY "Users can view own call analytics" ON call_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own call analytics" ON call_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own call analytics" ON call_analytics FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_calling_campaigns_user_id ON calling_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_calling_campaigns_status ON calling_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_calling_leads_campaign_id ON calling_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_calling_leads_status ON calling_leads(status);
CREATE INDEX IF NOT EXISTS idx_calling_leads_next_call_date ON calling_leads(next_call_date);
CREATE INDEX IF NOT EXISTS idx_calls_campaign_id ON calls(campaign_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead_id ON calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at);
CREATE INDEX IF NOT EXISTS idx_call_queue_status ON call_queue(status);
CREATE INDEX IF NOT EXISTS idx_call_queue_scheduled_at ON call_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_call_analytics_user_campaign_date ON call_analytics(user_id, campaign_id, date);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calling_campaigns_updated_at BEFORE UPDATE ON calling_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calling_leads_updated_at BEFORE UPDATE ON calling_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_call_queue_updated_at BEFORE UPDATE ON call_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_call_analytics_updated_at BEFORE UPDATE ON call_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Functions for analytics
CREATE OR REPLACE FUNCTION calculate_daily_analytics(user_uuid UUID, campaign_uuid UUID, analytics_date DATE)
RETURNS VOID AS $$
DECLARE
  calls_made_count INTEGER;
  calls_connected_count INTEGER;
  calls_interested_count INTEGER;
  total_duration INTEGER;
  total_cost INTEGER;
  avg_duration DECIMAL(10,2);
  conn_rate DECIMAL(5,4);
  int_rate DECIMAL(5,4);
BEGIN
  -- Calculate metrics for the day
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed' AND call_outcome IN ('connected', 'interested', 'not_interested', 'callback_requested')),
    COUNT(*) FILTER (WHERE call_outcome = 'interested'),
    COALESCE(SUM(duration_seconds), 0),
    COALESCE(SUM(cost_cents), 0)
  INTO calls_made_count, calls_connected_count, calls_interested_count, total_duration, total_cost
  FROM calls 
  WHERE user_id = user_uuid 
    AND campaign_id = campaign_uuid 
    AND DATE(created_at) = analytics_date;

  -- Calculate rates
  avg_duration := CASE WHEN calls_connected_count > 0 THEN total_duration::DECIMAL / calls_connected_count ELSE 0 END;
  conn_rate := CASE WHEN calls_made_count > 0 THEN calls_connected_count::DECIMAL / calls_made_count ELSE 0 END;
  int_rate := CASE WHEN calls_connected_count > 0 THEN calls_interested_count::DECIMAL / calls_connected_count ELSE 0 END;

  -- Insert or update analytics record
  INSERT INTO call_analytics (
    user_id, campaign_id, date, calls_made, calls_connected, calls_interested,
    total_duration_seconds, total_cost_cents, average_call_duration, 
    connection_rate, interest_rate
  ) VALUES (
    user_uuid, campaign_uuid, analytics_date, calls_made_count, calls_connected_count, 
    calls_interested_count, total_duration, total_cost, avg_duration, conn_rate, int_rate
  )
  ON CONFLICT (user_id, campaign_id, date) 
  DO UPDATE SET
    calls_made = EXCLUDED.calls_made,
    calls_connected = EXCLUDED.calls_connected,
    calls_interested = EXCLUDED.calls_interested,
    total_duration_seconds = EXCLUDED.total_duration_seconds,
    total_cost_cents = EXCLUDED.total_cost_cents,
    average_call_duration = EXCLUDED.average_call_duration,
    connection_rate = EXCLUDED.connection_rate,
    interest_rate = EXCLUDED.interest_rate,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix for seb test account - mark demo as completed
-- UPDATE profiles 
-- SET demo_booked = TRUE, 
--     demo_booking_url = 'https://cal.com/sebastiandanconia/15min',
--     demo_date = NOW()
-- WHERE email = 'jsdanconia@gmail.com';

-- Uncomment the above lines if you want to automatically mark the seb test account as demo completed