'use client'

import { useState, useEffect } from 'react'
import { useNotionIntegration } from '../../hooks/useNotionIntegration'
import NotionSetup from '../NotionSetup'
import { LoadingSpinner, KPICardSkeleton } from '../LoadingSpinner'
import { DollarSign, Phone, Calendar, TrendingUp, Star, Award, Zap, CheckCircle, Clock, ExternalLink, Badge, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string
  target: string
  progress: number
  icon: React.ElementType
  color: string
  trend: number
}

function KPICard({ title, value, target, progress, icon: Icon, color, trend }: KPICardProps) {
  const progressColor = progress >= 90 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
  
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className={cn(
          'flex items-center gap-1 text-sm',
          trend >= 0 ? 'text-green-600' : 'text-red-600'
        )}>
          <TrendingUp className={cn('h-4 w-4', trend < 0 && 'rotate-180')} />
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">/ {target}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`${progressColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  type: 'deal' | 'demo' | 'call' | 'target'
  title: string
  points: number
  time: string
}

function ActivityItem({ type, title, points, time }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'deal': return <DollarSign className="h-4 w-4 text-green-600" />
      case 'demo': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'call': return <Phone className="h-4 w-4 text-blue-600" />
      case 'target': return <CheckCircle className="h-4 w-4 text-orange-600" />
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
          {getIcon()}
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
        <Star className="h-3 w-3" fill="currentColor" />
        <span>+{points}</span>
      </div>
    </div>
  )
}

interface BadgeItemProps {
  title: string
  description: string
  earned: boolean
}

function BadgeItem({ title, description, earned }: BadgeItemProps) {
  return (
    <div className={cn(
      'p-3 rounded-lg border text-center transition-all',
      earned 
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    )}>
      <div className={cn(
        'w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center',
        earned ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'
      )}>
        <Award className={cn('h-4 w-4', earned ? 'text-white' : 'text-gray-500')} />
      </div>
      <h4 className={cn(
        'text-xs font-medium mb-1',
        earned ? 'text-foreground' : 'text-muted-foreground'
      )}>
        {title}
      </h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export default function OverviewTab() {
  const {
    tasks: notionTasks,
    isLoadingTasks,
    fetchTasks,
    createTask,
    updateTask,
    isConfigured,
    error,
    syncAll
  } = useNotionIntegration()

  const [localTasks, setLocalTasks] = useState([
    { id: 1, text: 'Follow up with ABC Corp', priority: 'high', points: 25, completed: false },
    { id: 2, text: 'Prepare demo for XYZ Ltd', priority: 'medium', points: 50, completed: false },
    { id: 3, text: 'Send pricing proposal', priority: 'high', points: 75, completed: true },
    { id: 4, text: 'Update customer records', priority: 'low', points: 15, completed: false },
  ])

  const [showNotionSetup, setShowNotionSetup] = useState(false)
  const [isLoadingKPIs, setIsLoadingKPIs] = useState(true)

  // Use Notion tasks if available, otherwise fall back to local tasks
  const tasks = isConfigured && notionTasks.length > 0 ? notionTasks.map(task => ({
    id: task.id || '',
    text: task.title,
    priority: task.priority.toLowerCase() as 'high' | 'medium' | 'low',
    points: task.points,
    completed: task.completed
  })) : localTasks

  // Fetch tasks on component mount
  useEffect(() => {
    if (isConfigured) {
      fetchTasks()
    }
  }, [isConfigured, fetchTasks])

  // Simulate KPI loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingKPIs(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Handle task completion
  const handleTaskCompletion = async (taskId: string | number, completed: boolean) => {
    if (isConfigured && typeof taskId === 'string') {
      // Update in Notion
      await updateTask(taskId, { 
        status: completed ? 'Done' : 'To Do',
        completed 
      })
    } else {
      // Update local tasks
      setLocalTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      )
    }
  }

  const kpis = [
    {
      title: 'Daily Revenue',
      value: '$12,450',
      target: '$15,000',
      progress: 83,
      icon: DollarSign,
      color: 'bg-primary',
      trend: 15.3
    },
    {
      title: 'Calls Made',
      value: '28',
      target: '35',
      progress: 80,
      icon: Phone,
      color: 'bg-primary',
      trend: 8.2
    },
    {
      title: 'Demos Booked',
      value: '6',
      target: '8',
      progress: 75,
      icon: Calendar,
      color: 'bg-primary',
      trend: 12.5
    },
    {
      title: 'Pipeline Value',
      value: '$245K',
      target: '$300K',
      progress: 82,
      icon: TrendingUp,
      color: 'bg-primary',
      trend: -2.1
    }
  ]

  const activities = [
    { type: 'deal' as const, title: 'Closed deal with TechCorp', points: 500, time: '2 hours ago' },
    { type: 'demo' as const, title: 'Demo completed with StartupXYZ', points: 100, time: '4 hours ago' },
    { type: 'call' as const, title: '5 prospecting calls made', points: 50, time: '6 hours ago' },
    { type: 'target' as const, title: 'Daily call target reached', points: 25, time: '8 hours ago' },
  ]

  const badges = [
    { title: 'First Demo', description: 'Complete your first demo', earned: true },
    { title: 'Call Champion', description: 'Make 100 calls', earned: true },
    { title: 'Deal Closer', description: 'Close 10 deals', earned: false },
    { title: 'Streak Master', description: '7-day streak', earned: true },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoadingKPIs ? (
            Array.from({ length: 4 }).map((_, index) => (
              <KPICardSkeleton key={index} />
            ))
          ) : (
            kpis.map((kpi) => (
              <KPICard key={kpi.title} {...kpi} />
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <section>
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                View all <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-0">
              {activities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </section>

        {/* Gamification Panel */}
        <section>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Your Progress</h3>
            
            {/* Level Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Level 12</span>
                <span className="text-sm font-medium">2,450 / 3,000 pts</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: '82%' }}
                />
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center justify-between mb-6 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Daily Streak</span>
              </div>
              <span className="text-lg font-bold text-orange-600">7 days</span>
            </div>

            {/* Achievement Badges */}
            <div>
              <h4 className="font-medium mb-3">Achievements</h4>
              <div className="grid grid-cols-2 gap-2">
                {badges.map((badge) => (
                  <BadgeItem key={badge.title} {...badge} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Notion Tasks Integration */}
      <section>
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">Today's Tasks</h3>
              {isConfigured ? (
                <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                  Notion Connected
                </span>
              ) : (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                  Local Only
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isConfigured && (
                <button 
                  onClick={syncAll}
                  disabled={isLoadingTasks}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                >
                  {isLoadingTasks ? 'Syncing...' : 'Sync'}
                </button>
              )}
              <button 
                onClick={() => {
                  if (isConfigured) {
                    window.open('https://notion.so', '_blank')
                  } else {
                    setShowNotionSetup(true)
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {isConfigured ? 'Open Notion' : 'Setup Notion'} <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {isLoadingTasks ? (
              <div className="text-center py-8">
                <LoadingSpinner text="Loading tasks..." />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-lg mb-2">No tasks yet</h4>
                <p className="text-muted-foreground text-sm">
                  {isConfigured 
                    ? 'Create tasks in your Notion database to see them here.'
                    : 'Configure Notion integration to sync your tasks automatically.'
                  }
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={task.completed}
                      onChange={(e) => handleTaskCompletion(task.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <p className={cn(
                        'text-sm font-medium',
                        task.completed && 'line-through text-muted-foreground'
                      )}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        )}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">+{task.points} pts</span>
                        {isConfigured && typeof task.id === 'string' && (
                          <span className="text-xs text-blue-600">Notion</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Notion Setup Modal */}
      <NotionSetup 
        isOpen={showNotionSetup} 
        onClose={() => setShowNotionSetup(false)} 
      />
    </div>
  )
}