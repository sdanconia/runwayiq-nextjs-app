'use client'

import { Calendar, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  title: string
  current: string
  target: string
  progress: number
  daysLeft?: number
  status: 'on-track' | 'needs-attention' | 'exceeded'
  icon: React.ElementType
  color: string
}

function GoalCard({ title, current, target, progress, daysLeft, status, icon: Icon, color }: GoalCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'needs-attention': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'exceeded': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'on-track': return 'On Track'
      case 'needs-attention': return 'Needs Attention'
      case 'exceeded': return 'Exceeded'
    }
  }

  const getProgressColor = () => {
    if (progress >= 100) return 'bg-blue-500'
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className={cn(
          'text-xs font-medium px-3 py-1 rounded-full',
          getStatusColor()
        )}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold text-sm text-muted-foreground mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold">{current}</span>
          <span className="text-sm text-muted-foreground">/ {target}</span>
        </div>
        {daysLeft && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{daysLeft} days left</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`${getProgressColor()} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function GoalsTab() {
  const weeklyGoals = [
    {
      title: 'Weekly Revenue Target',
      current: '$85K',
      target: '$100K',
      progress: 85,
      daysLeft: 2,
      status: 'on-track' as const,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Calls This Week',
      current: '156',
      target: '200',
      progress: 78,
      daysLeft: 2,
      status: 'needs-attention' as const,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Demos Scheduled',
      current: '18',
      target: '15',
      progress: 120,
      daysLeft: 2,
      status: 'exceeded' as const,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'New Prospects',
      current: '42',
      target: '50',
      progress: 84,
      daysLeft: 2,
      status: 'on-track' as const,
      icon: TrendingDown,
      color: 'bg-orange-500'
    }
  ]

  const monthlyGoals = [
    {
      title: 'Monthly Revenue',
      current: '$320K',
      target: '$400K',
      progress: 80,
      daysLeft: 8,
      status: 'on-track' as const,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Deals Closed',
      current: '24',
      target: '30',
      progress: 80,
      daysLeft: 8,
      status: 'on-track' as const,
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Pipeline Value',
      current: '$1.2M',
      target: '$1.5M',
      progress: 80,
      daysLeft: 8,
      status: 'on-track' as const,
      icon: TrendingDown,
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      current: '18%',
      target: '20%',
      progress: 90,
      daysLeft: 8,
      status: 'on-track' as const,
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Weekly Goals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Weekly Goals</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Week ending Friday</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyGoals.map((goal) => (
            <GoalCard key={goal.title} {...goal} />
          ))}
        </div>
      </section>

      {/* Monthly Goals */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Monthly Goals</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Month ending June 30</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {monthlyGoals.map((goal) => (
            <GoalCard key={goal.title} {...goal} />
          ))}
        </div>
      </section>

      {/* Goal Summary */}
      <section>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800/20">
          <h3 className="font-bold text-lg mb-4">Goal Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">6</div>
              <div className="text-sm text-muted-foreground">Goals On Track</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1</div>
              <div className="text-sm text-muted-foreground">Needs Attention</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <div className="text-sm text-muted-foreground">Exceeded</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">This Week's Focus</h4>
            <p className="text-sm text-muted-foreground">
              You're doing great! Focus on increasing your call volume to reach your weekly target. 
              With 44 more calls over the next 2 days, you'll hit your goal.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}