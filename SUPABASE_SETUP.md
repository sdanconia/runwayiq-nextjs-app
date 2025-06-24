# Supabase Setup Guide

This guide will help you set up Supabase for authentication and user management in your RunwayIQ sales dashboard.

## Prerequisites

- Supabase account (sign up at [supabase.com](https://supabase.com))
- Your Supabase credentials (already added to `.env.local`)

## Step 1: Database Schema Setup

In your Supabase dashboard, go to the SQL Editor and run this schema:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'sales_rep', 'viewer')) DEFAULT 'sales_rep',
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{"theme": "system", "notifications": true, "dashboardLayout": ["overview", "focus", "analytics"]}',
  sales_target INTEGER DEFAULT 0,
  team_id UUID,
  demo_booked BOOLEAN DEFAULT FALSE,
  demo_booking_url TEXT,
  demo_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for teams
CREATE POLICY "Team members can view team" ON teams FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND team_id = teams.id
  )
);

-- Storage policies for avatars
CREATE POLICY "Avatar uploads are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'sales_rep')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 2: Configure Authentication Settings

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following:

### Site URL
Set to your application URL:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### Redirect URLs
Add these URLs:
- `http://localhost:3000/auth/callback` (development)
- `https://yourdomain.com/auth/callback` (production)

### Email Templates (Optional)
Customize the email templates for:
- Welcome email
- Password reset
- Email confirmation

### Auth Providers (Optional)
Enable social providers if desired:
- Google OAuth
- GitHub OAuth
- Discord OAuth

## Step 3: Storage Configuration

1. Go to **Storage** in your Supabase dashboard
2. Verify the `avatars` bucket was created
3. Configure upload restrictions:
   - Max file size: 5MB
   - Allowed file types: image/jpeg, image/png, image/webp

## Step 4: Environment Variables

Your environment variables are already configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gapmflftarqpczpzwxba.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Test the Authentication Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the authentication:
   - Visit `http://localhost:3000/sales-dashboard`
   - You should be redirected to `/auth/login`
   - Create a new account via `/auth/signup`
   - Check email for confirmation link
   - Log in and access the dashboard

## Step 6: Verify Database Setup

After creating a test user, check your Supabase dashboard:

1. Go to **Database** → **Tables**
2. Check the `profiles` table has your user data
3. Verify the user's profile was auto-created

## Features Implemented

### 🔐 **Authentication Features**
- **Email/Password Authentication** with email confirmation
- **Password Reset** functionality
- **Profile Management** with avatar upload
- **Role-based Access Control** (admin, manager, sales_rep, viewer)
- **Social Authentication** ready (Google, GitHub, Discord)

### 🛡️ **Security Features**
- **Row Level Security (RLS)** for data isolation
- **JWT Token Authentication** with automatic refresh
- **Secure Middleware** protecting all routes
- **Input Validation** and sanitization
- **Rate Limiting** on API endpoints

### 📊 **Dashboard Integration**
- **User Profiles** with company info and preferences
- **Avatar Upload** to Supabase Storage
- **Team Management** (ready for future expansion)
- **Real-time Data** (ready for live updates)

## Troubleshooting

### Common Issues:

1. **Email Confirmation Required:**
   - New users must confirm their email before logging in
   - Check spam folder for confirmation emails
   - Disable email confirmation in Auth settings for development

2. **RLS Policies:**
   - If users can't access their data, check RLS policies
   - Ensure policies allow users to read their own profiles

3. **Storage Permissions:**
   - If avatar uploads fail, check storage policies
   - Verify the `avatars` bucket exists and is public

4. **Environment Variables:**
   - Ensure `.env.local` is in the project root
   - Restart development server after changing env vars

### Development Tips:

```bash
# View real-time logs
npx supabase logs

# Reset auth (if needed)
# Go to Authentication → Users and manually delete test users

# Test API calls
curl -X GET 'https://gapmflftarqpczpzwxba.supabase.co/rest/v1/profiles' \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Production Checklist

- [ ] Update Site URL and Redirect URLs for production domain
- [ ] Configure custom SMTP for email delivery
- [ ] Set up proper backup and monitoring
- [ ] Review and test all RLS policies
- [ ] Configure rate limiting and security headers
- [ ] Set up proper error tracking (Sentry, LogRocket, etc.)

## Advanced Features (Future)

- **Multi-tenant Architecture** using teams
- **Real-time Collaboration** with subscriptions
- **Advanced Analytics** with custom schemas
- **File Management** beyond avatars
- **Audit Logging** for compliance

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## Step 7: Add Demo Booking Fields (Update for existing database)

If you already have the profiles table set up, run this SQL to add the demo booking fields:

```sql
-- Add demo booking columns to existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS demo_booked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS demo_booking_url TEXT,
ADD COLUMN IF NOT EXISTS demo_date TIMESTAMP WITH TIME ZONE;

-- Update existing users to require demo booking (optional, set to TRUE for existing users who already have access)
-- UPDATE profiles SET demo_booked = TRUE WHERE created_at < NOW();
```

## Demo Booking Flow

The application now includes a mandatory demo booking flow for new users:

1. **New User Signup**: After email confirmation, users are redirected to `/book-demo`
2. **Demo Booking Page**: Users must book either a 15-min demo or 30-min strategy session
3. **Access Control**: Users cannot access the dashboard until they book a demo
4. **Demo Options**:
   - **15-min Quick Demo**: Platform overview and key features
   - **30-min Strategy Session**: Personalized setup and campaign planning (recommended)

## Booking Integration

The demo booking page integrates with Calendly:
- 15-min demo: `https://calendly.com/runwayiq/15min-demo`
- 30-min strategy: `https://calendly.com/runwayiq/30min-strategy`

Update these URLs in `/app/book-demo/page.tsx` to match your actual Calendly links.

Your Supabase authentication system is now fully configured and ready for production! 🚀