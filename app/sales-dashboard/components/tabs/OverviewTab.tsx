'use client'

import { useState } from 'react'
import { DollarSign, Phone, Calendar, TrendingUp, Star, CheckCircle, Target, Users } from 'lucide-react'
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
          trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'
        )}>
          <span className="font-medium">{trend > 0 ? '+' : ''}{trend}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm text-muted-foreground">/ {target}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OverviewTab() {
  const [localTasks, setLocalTasks] = useState([
    { id: 1, text: 'Follow up with ABC Corp', priority: 'high', points: 25, completed: false },
    { id: 2, text: 'Prepare demo for XYZ Ltd', priority: 'medium', points: 50, completed: false },
    { id: 3, text: 'Send pricing proposal', priority: 'high', points: 75, completed: true },
    { id: 4, text: 'Update customer records', priority: 'low', points: 15, completed: false },
  ])

  const kpis = [
    {
      title: 'Revenue',
      value: '$87.2K',
      target: '$100K',
      progress: 87,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: 15.3
    },
    {
      title: 'Calls Made',
      value: '28',
      target: '35',
      progress: 80,
      icon: Phone,
      color: 'bg-blue-500',
      trend: 8.2
    },
    {
      title: 'Demos Booked',
      value: '6',
      target: '8',
      progress: 75,
      icon: Calendar,
      color: 'bg-purple-500',
      trend: 12.5
    },
    {
      title: 'Pipeline Value',
      value: '$245K',
      target: '$300K',
      progress: 82,
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: -2.1
    }
  ]

  const activities = [
    { type: 'deal' as const, title: 'Closed deal with TechCorp', points: 500, time: '2 hours ago' },
    { type: 'demo' as const, title: 'Demo completed with StartupXYZ', points: 100, time: '4 hours ago' },
    { type: 'call' as const, title: '5 prospecting calls made', points: 50, time: '6 hours ago' },
    { type: 'target' as const, title: 'Daily call target reached', points: 25, time: '8 hours ago' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deal': return DollarSign
      case 'demo': return Calendar
      case 'call': return Phone
      case 'target': return Target
      default: return CheckCircle
    }
  }

  const toggleTask = (id: number) => {
    setLocalTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedTasks = localTasks.filter(task => task.completed).length
  const totalTasks = localTasks.length
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      </section>

      {/* Today's Tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Tasks</h2>
          <div className="text-sm text-muted-foreground">
            {completedTasks}/{totalTasks} completed ({completionRate}%)
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-3">
            {localTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                    task.completed 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground hover:border-primary'
                  )}
                >
                  {task.completed && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
                </button>
                
                <div className="flex-1">
                  <p className={cn(
                    'text-sm',
                    task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  )}>
                    {task.text}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  )}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-muted-foreground">+{task.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activities */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                      <span className="text-xs font-medium">{activity.points}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium mb-2">Start AI Cold Calling</h3>
            <p className="text-xs text-muted-foreground">Launch your AI-powered calling campaign</p>
          </div>
          <div className="bg-card rounded-lg border p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium mb-2">Import Leads</h3>
            <p className="text-xs text-muted-foreground">Upload and manage your lead database</p>
          </div>
          <div className="bg-card rounded-lg border p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-medium mb-2">Schedule Demos</h3>
            <p className="text-xs text-muted-foreground">Book and manage product demonstrations</p>
          </div>
        </div>
      </section>
    </div>
  )
}