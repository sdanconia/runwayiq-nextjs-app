import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// User profile interface for Supabase
export interface UserProfile {
  id: string
  email: string
  name: string
  avatar_url?: string
  company?: string
  role: 'admin' | 'manager' | 'sales_rep' | 'viewer'
  phone?: string
  timezone?: string
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    dashboardLayout: string[]
  }
  sales_target?: number
  team_id?: string
  demo_booked?: boolean
  demo_booking_url?: string
  demo_date?: string
  created_at: string
  updated_at: string
}

// Extended user type with Supabase auth
export interface User extends UserProfile {
  // Add any additional user properties here
}

// Authentication functions
export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, userData: {
    name: string
    company?: string
    role?: 'admin' | 'manager' | 'sales_rep' | 'viewer'
  }) {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            company: userData.company || null,
            role: userData.role || 'sales_rep'
          }
        }
      })

      if (authError) throw authError

      return authData
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Get current session
  static async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  // Get user profile
  static async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return data as UserProfile
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }

  // Request password reset
  static async requestPasswordReset(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  // Upload avatar
  static async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // Update profile with avatar URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  // Delete avatar
  static async deleteAvatar(userId: string) {
    try {
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([`${userId}.jpg`, `${userId}.png`, `${userId}.jpeg`])

      // Update profile to remove avatar URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Avatar delete error:', error)
      throw error
    }
  }

  // Social sign in (Google, GitHub, etc.)
  static async signInWithProvider(provider: 'google' | 'github' | 'discord') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Social sign in error:', error)
      throw error
    }
  }
}

// Team management functions
export class TeamService {
  // Get team members
  static async getTeamMembers(teamId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('team_id', teamId)

      if (error) throw error

      return data as UserProfile[]
    } catch (error) {
      console.error('Get team members error:', error)
      throw error
    }
  }

  // Create team
  static async createTeam(name: string, description?: string) {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name,
          description,
          created_by: (await AuthService.getCurrentUser())?.id
        })
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Create team error:', error)
      throw error
    }
  }
}

// Utility functions
export function getAvatarUrl(user: UserProfile): string {
  return user.avatar_url || ''
}

export function formatUserName(user: UserProfile): string {
  return user.name || user.email.split('@')[0]
}

// Error handling helper
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message
  }
  
  // Handle common Supabase error codes
  switch (error?.code) {
    case 'invalid_credentials':
      return 'Invalid email or password'
    case 'email_not_confirmed':
      return 'Please check your email and click the confirmation link'
    case 'signup_disabled':
      return 'Sign up is currently disabled'
    case 'weak_password':
      return 'Password should be at least 6 characters'
    default:
      return error?.message || 'An unexpected error occurred'
  }
}

// Real-time subscriptions
export function subscribeToProfileChanges(userId: string, callback: (profile: UserProfile) => void) {
  return supabase
    .channel(`profile:${userId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${userId}`
    }, (payload) => {
      callback(payload.new as UserProfile)
    })
    .subscribe()
}

// Database schema SQL for reference
export const DATABASE_SCHEMA = `
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

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
`