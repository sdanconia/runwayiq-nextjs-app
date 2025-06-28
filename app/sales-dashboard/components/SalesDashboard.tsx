'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, User, Target, Trophy, CheckCircle, BarChart3, Calendar, Users, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { ErrorBoundary } from './ErrorBoundary'
import { LoadingCard } from './LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { formatUserName, getAvatarUrl } from '@/lib/supabase'
import { useDemoBookingCheck } from '@/hooks/useDemoBookingCheck'
import WelcomeSection from './WelcomeSection'
import QuickStatsGrid from './QuickStatsGrid'
import OverviewTab from './tabs/OverviewTab'
import FocusTab from './tabs/FocusTab'
import GoalsTab from './tabs/GoalsTab'
import TeamTab from './tabs/TeamTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import FulfillmentTab from './tabs/FulfillmentTab'
import CustomerSuccessTab from './tabs/CustomerSuccessTab'
import LeadsTab from './tabs/LeadsTab'
import CampaignsTab from './tabs/CampaignsTab'
import ColdCallingTab from './tabs/ColdCallingTab'
import MobileNavigation from './MobileNavigation'

type TabType = 'overview' | 'focus' | 'leads' | 'campaigns' | 'cold-calling' | 'goals' | 'team' | 'analytics' | 'fulfillment' | 'customer-success'

const tabs = [
  { id: 'overview' as TabType, label: 'Overview', icon: Target },
  { id: 'focus' as TabType, label: 'Today\'s Focus', icon: CheckCircle },
  { id: 'campaigns' as TabType, label: 'Campaigns', icon: Target },
  { id: 'cold-calling' as TabType, label: 'AI Cold Calling', icon: Phone },
  { id: 'leads' as TabType, label: 'Leads', icon: Users },
  { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  { id: 'goals' as TabType, label: 'Goals', icon: Trophy },
  { id: 'fulfillment' as TabType, label: 'Fulfillment', icon: Calendar },
  { id: 'customer-success' as TabType, label: 'Customer Success', icon: Star },
  { id: 'team' as TabType, label: 'Team', icon: User },
]

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const { user, isLoading } = useAuth()
  const { hasBookedDemo, isLoading: demoCheckLoading } = useDemoBookingCheck()
  const [userPoints] = useState(user?.sales_target && user.sales_target > 0 ? 2450 : 0)

  // Show loading only if both auth and demo check are loading
  if (isLoading || demoCheckLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingCard title="Loading dashboard..." />
      </div>
    )
  }

  const renderTabContent = () => {
    const TabComponent = () => {
      switch (activeTab) {
        case 'overview':
          return <OverviewTab />
        case 'focus':
          return <FocusTab />
        case 'leads':
          return <LeadsTab />
        case 'campaigns':
          return <CampaignsTab />
        case 'cold-calling':
          return <ColdCallingTab />
        case 'analytics':
          return <AnalyticsTab />
        case 'goals':
          return <GoalsTab />
        case 'fulfillment':
          return <FulfillmentTab />
        case 'customer-success':
          return <CustomerSuccessTab />
        case 'team':
          return <TeamTab />
        default:
          return <OverviewTab />
      }
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingCard title="Loading tab content..." />}>
          <TabComponent />
        </Suspense>
      </ErrorBoundary>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Use Main Site Header */}
      <Header />

      {/* Dashboard Header Section */}
      <div className="border-b bg-card/50">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary overflow-hidden">
                {user?.avatar_url ? (
                  <img 
                    src={getAvatarUrl(user)} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading">
                  {user ? `${formatUserName(user)}'s Dashboard` : 'Sales Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user?.company 
                    ? `${user.company} • AI-powered sales automation` 
                    : 'AI-powered sales automation and performance tracking'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary">
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <span className="font-semibold text-secondary-foreground">
                  {userPoints.toLocaleString()} points
                </span>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-8 pb-20 md:pb-6">
        {/* Welcome Section */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard title="Loading welcome section..." />}>
            <WelcomeSection />
          </Suspense>
        </ErrorBoundary>
        
        {/* Quick Stats Grid */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingCard title="Loading statistics..." />}>
            <QuickStatsGrid />
          </Suspense>
        </ErrorBoundary>
        
        {/* Desktop Tab Navigation */}
        <div className="hidden md:block mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200',
                      activeTab === tab.id
                        ? 'bg-card border-l border-r border-t border-border text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {renderTabContent()}
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      
    </div>
  )
}