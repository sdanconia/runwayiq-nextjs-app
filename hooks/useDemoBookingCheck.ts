import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook to check if user has booked a demo and redirect accordingly
 * Redirects to /book-demo if user is authenticated but hasn't booked a demo
 */
export function useDemoBookingCheck() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Skip if still loading or not authenticated
    if (isLoading || !isAuthenticated || !user) {
      return
    }

    // Skip if already on demo booking page
    if (typeof window !== 'undefined' && window.location.pathname === '/book-demo') {
      return
    }

    // Redirect to demo booking if user hasn't booked a demo yet
    if (!user.demo_booked) {
      router.push('/book-demo')
    }
  }, [user, isLoading, isAuthenticated, router])

  return {
    hasBookedDemo: user?.demo_booked || false,
    isLoading,
    user
  }
}