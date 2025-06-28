'use client'

import { useState } from 'react'
import { Zap, CheckCircle, Star, Phone, Mail, Calendar, DollarSign, Target, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriorityActionProps {
  title: string
  points: number
  completed: boolean
  onComplete: () => void
}

function PriorityAction({ title, points, completed, onComplete }: PriorityActionProps) {
  return (
    <div className={cn(
      'p-4 rounded-lg border transition-all',
      completed 
        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
        : 'bg-card hover:shadow-md cursor-pointer'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onComplete}
            disabled={completed}
            className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
              completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-muted-foreground hover:border-primary'
            )}
          >
            {completed && <CheckCircle className="w-4 h-4 text-white" />}
          </button>
          <span className={cn(
            'font-medium',
            completed ? 'line-through text-muted-foreground' : 'text-foreground'
          )}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
          <span className="text-sm font-medium">{points}</span>
        </div>
      </div>
    </div>
  )
}

export default function FocusTab() {
  const [priorityActions, setPriorityActions] = useState([
    { id: 1, title: 'Call 5 high-priority leads', points: 50, completed: false },
    { id: 2, title: 'Send follow-up emails to demo attendees', points: 30, completed: false },
    { id: 3, title: 'Update pipeline in CRM', points: 20, completed: true },
    { id: 4, title: 'Schedule demos for this week', points: 40, completed: false },
  ])

  const [dailyGoals] = useState([
    { title: 'Revenue Generated', current: 2500, target: 5000, unit: '$', icon: DollarSign },
    { title: 'Calls Made', current: 8, target: 15, unit: '', icon: Phone },
    { title: 'Emails Sent', current: 12, target: 20, unit: '', icon: Mail },
    { title: 'Demos Booked', current: 2, target: 3, unit: '', icon: Calendar },
  ])

  const completePriorityAction = (id: number) => {
    setPriorityActions(prev => prev.map(action => 
      action.id === id ? { ...action, completed: true } : action
    ))
  }

  const completedActions = priorityActions.filter(action => action.completed).length
  const totalPoints = priorityActions.reduce((sum, action) => sum + (action.completed ? action.points : 0), 0)
  const maxPoints = priorityActions.reduce((sum, action) => sum + action.points, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Today's Focus</h1>
        <p className="text-muted-foreground">Your most important tasks for maximum impact</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Daily Progress</h2>
            <p className="text-sm text-muted-foreground">
              {completedActions}/{priorityActions.length} priority actions completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalPoints}</div>
            <div className="text-sm text-muted-foreground">/ {maxPoints} points</div>
          </div>
        </div>
        
        <div className="w-full bg-secondary rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
          />
        </div>
      </div>

      {/* Priority Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Priority Actions
        </h2>
        <div className="space-y-3">
          {priorityActions.map((action) => (
            <PriorityAction
              key={action.id}
              title={action.title}
              points={action.points}
              completed={action.completed}
              onComplete={() => completePriorityAction(action.id)}
            />
          ))}
        </div>
      </section>

      {/* Daily Goals */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyGoals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100
            const Icon = goal.icon
            
            return (
              <div key={index} className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{goal.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">
                      {goal.unit}{goal.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {goal.unit}{goal.target.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        progress >= 100 ? 'bg-green-500' : 
                        progress >= 75 ? 'bg-blue-500' : 
                        progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="bg-card rounded-lg border p-4 text-left hover:shadow-md transition-shadow">
            <Phone className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-sm">Start Calling</div>
            <div className="text-xs text-muted-foreground">Begin your call session</div>
          </button>
          
          <button className="bg-card rounded-lg border p-4 text-left hover:shadow-md transition-shadow">
            <Mail className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-sm">Send Emails</div>
            <div className="text-xs text-muted-foreground">Batch email outreach</div>
          </button>
          
          <button className="bg-card rounded-lg border p-4 text-left hover:shadow-md transition-shadow">
            <MessageSquare className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-sm">LinkedIn Outreach</div>
            <div className="text-xs text-muted-foreground">Connect with prospects</div>
          </button>
          
          <button className="bg-card rounded-lg border p-4 text-left hover:shadow-md transition-shadow">
            <Calendar className="h-6 w-6 text-primary mb-2" />
            <div className="font-medium text-sm">Schedule Demos</div>
            <div className="text-xs text-muted-foreground">Book product demos</div>
          </button>
        </div>
      </section>
    </div>
  )
}