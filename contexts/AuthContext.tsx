'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthService, User, supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, additionalData?: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshAuth: () => Promise<void>
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // Simple, reliable auth initialization
  useEffect(() => {
    let mounted = true

    // Always stop loading after 1 second maximum
    const maxLoadingTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Max loading timeout reached, stopping loading')
        setIsLoading(false)
      }
    }, 1000)

    const initAuth = async () => {
      try {
        console.log('Starting simple auth check...')
        
        // Quick session check
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (mounted) {
          setSession(currentSession)
          
          if (currentSession?.user) {
            // Try cache first
            const cachedKey = `profile_${currentSession.user.id}`
            const cached = localStorage.getItem(cachedKey)
            
            if (cached) {
              try {
                const profile = JSON.parse(cached)
                setUser(profile)
                console.log('Loaded from cache')
              } catch (e) {
                console.log('Cache invalid')
              }
            }

            // Always create basic user if no cache or as fallback
            if (!cached) {
              const basicUser: User = {
                id: currentSession.user.id,
                email: currentSession.user.email!,
                name: currentSession.user.user_metadata?.name || currentSession.user.email!.split('@')[0],
                role: 'sales_rep',
                created_at: currentSession.user.created_at,
                updated_at: new Date().toISOString()
              }
              setUser(basicUser)
              localStorage.setItem(cachedKey, JSON.stringify(basicUser))
            }

            // Try to fetch real profile in background
            try {
              const profile = await AuthService.getProfile(currentSession.user.id)
              if (mounted) {
                setUser(profile)
                localStorage.setItem(cachedKey, JSON.stringify(profile))
              }
            } catch (e) {
              console.log('Profile fetch failed, using basic user')
            }
          }
        }
      } catch (error) {
        console.log('Auth init error:', error)
        if (mounted) {
          setUser(null)
          setSession(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
          clearTimeout(maxLoadingTimeout)
        }
      }
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      console.log('Auth state change:', event)
      setSession(session)
      setIsLoading(false) // Always stop loading on auth changes

      if (session?.user) {
        const basicUser: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
          role: 'sales_rep',
          created_at: session.user.created_at,
          updated_at: new Date().toISOString()
        }
        setUser(basicUser)
      } else {
        setUser(null)
        // Clear cache on sign out
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('profile_')) {
            localStorage.removeItem(key)
          }
        })
      }
    })

    // Start initialization
    initAuth()

    return () => {
      mounted = false
      clearTimeout(maxLoadingTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { user: authUser } = await AuthService.signIn(email, password)
      
      if (authUser) {
        const basicUser: User = {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
          role: 'sales_rep',
          created_at: authUser.created_at,
          updated_at: new Date().toISOString()
        }
        setUser(basicUser)
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to sign in'
      setError(errorMessage)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string, additionalData?: Partial<User>) => {
    try {
      setError(null)
      await AuthService.signUp(email, password, {
        name,
        company: additionalData?.company,
        role: additionalData?.role || 'sales_rep'
      })
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create account'
      setError(errorMessage)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setUser(null)
      setSession(null)
      // Clear cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('profile_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error: any) {
      console.error('Sign out error:', error)
      setUser(null)
      setSession(null)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      setError(null)
      const updatedUser = await AuthService.updateProfile(user.id, data)
      setUser(updatedUser as User)
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedUser))
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update profile'
      setError(errorMessage)
      throw error
    }
  }

  const refreshAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)
      
      if (currentSession?.user) {
        const profile = await AuthService.getProfile(currentSession.user.id)
        setUser(profile)
      }
    } catch (error: any) {
      console.error('Auth refresh error:', error)
      setUser(null)
      setSession(null)
      throw error
    }
  }

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshAuth,
    error,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page
      window.location.href = '/auth/login'
    }
  }, [isLoading, isAuthenticated])

  return { user, isLoading, isAuthenticated }
}