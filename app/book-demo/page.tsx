'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function BookDemoPage() {
  const { user, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  useEffect(() => {
    // Redirect to dashboard if user already booked demo
    if (!isLoading && user?.demo_booked) {
      router.push('/sales-dashboard')
    }
  }, [user, isLoading, router])

  const handleBookDemo = async (demoUrl: string) => {
    setIsBooking(true)
    
    try {
      // Update user profile to mark demo as booked
      await updateProfile({
        demo_booked: true,
        demo_booking_url: demoUrl,
        demo_date: new Date().toISOString(),
      })
      
      setBookingComplete(true)
      
      // Redirect to external booking link
      window.open(demoUrl, '_blank')
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/sales-dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('Error updating demo booking status:', error)
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-white rounded-lg shadow-lg border p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Demo Booked Successfully!
              </h1>
              <p className="text-muted-foreground mb-6">
                Thank you for booking a demo. You'll now have access to your sales dashboard.
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push('/sales-dashboard')} className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="w-full max-w-2xl">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to RunwayIQ, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              To get started, please book a quick demo with our team.
            </p>
            <p className="text-muted-foreground">
              This ensures you get the most out of our AI-powered sales automation platform.
            </p>
          </div>

          {/* Demo Booking Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 15-min Demo */}
            <div className="bg-white rounded-lg shadow-lg border p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Quick Demo</h3>
                  <p className="text-sm text-muted-foreground">15 minutes</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Platform overview</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Key features walkthrough</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Q&A session</span>
                </div>
              </div>

              <Button 
                onClick={() => handleBookDemo('https://cal.com/sebastiandanconia/15min')}
                disabled={isBooking}
                className="w-full"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book 15-min Demo
                  </>
                )}
              </Button>
            </div>

            {/* 30-min Strategy Session */}
            <div className="bg-white rounded-lg shadow-lg border p-6 hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 -right-3 bg-primary text-white text-xs px-3 py-1 rounded-full font-medium">
                Recommended
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Strategy Session</h3>
                  <p className="text-sm text-muted-foreground">30 minutes</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Personalized setup</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Custom campaign planning</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Sales process optimization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Implementation roadmap</span>
                </div>
              </div>

              <Button 
                onClick={() => handleBookDemo('https://cal.com/sebastiandanconia/30min')}
                disabled={isBooking}
                className="w-full"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Strategy Session
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Need Help Choosing?</h3>
            <p className="text-muted-foreground mb-4">
              Not sure which option is right for you? Our team can help you decide.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.open('mailto:support@runwayiq.com?subject=Demo Booking Help', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>

          {/* Why Demo Required */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              📞 <strong>Why is a demo required?</strong> We believe in providing personalized onboarding to ensure you get maximum value from our platform. Our demos help you understand how RunwayIQ can best serve your specific sales goals.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}