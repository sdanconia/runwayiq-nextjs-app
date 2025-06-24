'use client'

import { useState, useEffect } from 'react'
import { useNotionIntegration } from '../../hooks/useNotionIntegration'
import { Zap, CheckCircle, Star, Phone, Mail, Calendar, DollarSign, Target, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TaskOutcome } from '@/lib/notion'

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
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-card border-border hover:shadow-md'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-medium px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-full">
              High Impact
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-yellow-600">
          <Star className="h-4 w-4" fill="currentColor" />
          <span>+{points}</span>
        </div>
      </div>
      
      <h3 className={cn(
        'font-medium mt-2 mb-3',
        completed && 'line-through text-muted-foreground'
      )}>
        {title}
      </h3>
      
      <button
        onClick={onComplete}
        disabled={completed}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-medium transition-all',
          completed
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
        )}
      >
        {completed ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed
          </span>
        ) : (
          'Complete Task'
        )}
      </button>
    </div>
  )
}

interface TaskItemProps {
  id: number | string
  text: string
  type: 'call' | 'email' | 'demo' | 'deal' | 'follow-up' | 'linkedin-dm'
  points: number
  completed: boolean
  leadName?: string
  outcome?: TaskOutcome
  onToggle: (id: number | string) => void
  onOutcomeChange: (id: number | string, outcome: TaskOutcome) => void
}

function TaskItem({ id, text, type, points, completed, leadName, outcome, onToggle, onOutcomeChange }: TaskItemProps) {
  const [showOutcomeDropdown, setShowOutcomeDropdown] = useState(false)

  const getIcon = () => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4 text-blue-600" />
      case 'email': return <Mail className="h-4 w-4 text-green-600" />
      case 'demo': return <Calendar className="h-4 w-4 text-purple-600" />
      case 'deal': return <DollarSign className="h-4 w-4 text-orange-600" />
      case 'follow-up': return <Target className="h-4 w-4 text-red-600" />
      case 'linkedin-dm': return <MessageSquare className="h-4 w-4 text-blue-500" />
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'call': return 'Call'
      case 'email': return 'Email'
      case 'demo': return 'Demo'
      case 'deal': return 'Deal'
      case 'follow-up': return 'Follow-up'
      case 'linkedin-dm': return 'LinkedIn DM'
    }
  }

  const outcomeOptions: TaskOutcome[] = [
    'No answer',
    'Not interested',
    'Speak later',
    'Later date follow-up',
    'Using competitor',
    'Wants marketing material',
    'Remove from calling list',
    'Booked demo'
  ]

  const handleComplete = () => {
    if (!completed && (type === 'call' || type === 'email' || type === 'linkedin-dm')) {
      setShowOutcomeDropdown(true)
    } else {
      onToggle(id)
    }
  }

  const handleOutcomeSelect = (selectedOutcome: TaskOutcome) => {
    onOutcomeChange(id, selectedOutcome)
    onToggle(id)
    setShowOutcomeDropdown(false)
  }

  return (
    <div className={cn(
      'p-4 rounded-lg border transition-all',
      completed ? 'bg-gray-50 dark:bg-gray-800' : 'bg-card hover:shadow-sm'
    )}>
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handleComplete}
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
            completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          {completed && <CheckCircle className="h-3 w-3 text-white" />}
        </button>
        
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
              {getTypeLabel()}
            </span>
            {leadName && (
              <span className="text-xs text-muted-foreground">
                for {leadName}
              </span>
            )}
          </div>
          <p className={cn(
            'font-medium text-sm',
            completed && 'line-through text-muted-foreground'
          )}>
            {text}
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
          <Star className="h-3 w-3" fill="currentColor" />
          <span>+{points}</span>
        </div>
      </div>

      {/* Outcome Display */}
      {completed && outcome && (
        <div className="ml-8 mb-2">
          <span className={cn(
            'text-xs px-2 py-1 rounded-full font-medium',
            outcome === 'Booked demo' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
            outcome === 'Not interested' || outcome === 'Remove from calling list' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
          )}>
            Outcome: {outcome}
          </span>
        </div>
      )}

      {/* Outcome Dropdown */}
      {showOutcomeDropdown && (
        <div className="ml-8 mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select outcome:
          </label>
          <div className="space-y-1">
            {outcomeOptions.map((outcomeOption) => (
              <button
                key={outcomeOption}
                onClick={() => handleOutcomeSelect(outcomeOption)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                  outcomeOption === 'Booked demo' 
                    ? 'hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-800 dark:hover:text-green-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {outcomeOption}
                {outcomeOption === 'Booked demo' && ' ✅'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowOutcomeDropdown(false)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default function FocusTab() {
  const {
    tasks: notionTasks,
    isLoadingTasks,
    fetchTasks,
    updateTask,
    isConfigured,
    createActivity
  } = useNotionIntegration()

  const [priorityActions, setPriorityActions] = useState([
    { id: 1, title: 'Close the TechCorp deal - final negotiation call', points: 500, completed: false },
    { id: 2, title: 'Demo presentation for ABC Industries', points: 200, completed: false },
    { id: 3, title: 'Follow up with 3 hot prospects from yesterday', points: 150, completed: true },
  ])

  interface LocalTask {
    id: number
    text: string
    type: 'call' | 'email' | 'demo' | 'deal' | 'follow-up' | 'linkedin-dm'
    points: number
    completed: boolean
    leadName?: string
    outcome?: TaskOutcome
  }

  const [localTasks, setLocalTasks] = useState<LocalTask[]>([
    { id: 1, text: 'Call prospects from warm lead list', type: 'call', points: 50, completed: false, leadName: 'TechCorp Inc.' },
    { id: 2, text: 'Send follow-up emails to demo attendees', type: 'email', points: 25, completed: false, leadName: 'StartupXYZ' },
    { id: 3, text: 'Prepare slides for afternoon demo', type: 'demo', points: 75, completed: true, leadName: 'ABC Corp' },
    { id: 4, text: 'Update deal status in system', type: 'deal', points: 15, completed: false },
    { id: 5, text: 'Schedule follow-up with qualified leads', type: 'follow-up', points: 30, completed: false, leadName: 'InnovateLab' },
    { id: 6, text: 'LinkedIn outreach to new prospects', type: 'linkedin-dm', points: 30, completed: false, leadName: 'GrowthCo' },
  ])

  // Map Notion tasks to local format
  const tasks = isConfigured && notionTasks.length > 0 ? notionTasks.map(task => ({
    id: task.id || '',
    text: task.title,
    type: task.taskType?.toLowerCase().replace(' ', '-') as any || 'call', // Map from Notion task type
    points: task.points,
    completed: task.completed,
    leadName: task.leadName,
    outcome: task.outcome
  })) : localTasks

  // Fetch tasks on mount
  useEffect(() => {
    if (isConfigured) {
      fetchTasks()
    }
  }, [isConfigured, fetchTasks])

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const completionRate = Math.round((completedTasks / totalTasks) * 100)

  const handlePriorityComplete = (id: number) => {
    setPriorityActions(prev => 
      prev.map(action => 
        action.id === id ? { ...action, completed: true } : action
      )
    )
  }

  const handleTaskToggle = async (id: number | string) => {
    if (isConfigured && typeof id === 'string') {
      // Find the task to get current status
      const task = notionTasks.find(t => t.id === id)
      if (task) {
        const newCompleted = !task.completed
        await updateTask(id, { 
          status: newCompleted ? 'Done' : 'To Do',
          completed: newCompleted 
        })
        
        // Log activity in Notion
        if (newCompleted) {
          await createActivity({
            type: 'Task Completed',
            description: `Completed task: ${task.title}`,
            date: new Date().toISOString(),
            entity: task.title,
            entityType: 'task'
          })
        }
      }
    } else {
      // Handle local tasks
      setLocalTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      )
    }
  }

  const handleOutcomeChange = async (id: number | string, outcome: TaskOutcome) => {
    if (isConfigured && typeof id === 'string') {
      // Update in Notion with outcome
      await updateTask(id, { outcome })
      
      // Log activity in Notion
      await createActivity({
        type: 'Task Outcome Recorded',
        description: `Task outcome recorded: ${outcome}`,
        date: new Date().toISOString(),
        entity: id,
        entityType: 'task',
        outcome
      })
    } else {
      // Handle local tasks
      setLocalTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, outcome } : task
        )
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Focus Header */}
      <section>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Today's Focus</h2>
          <p className="text-blue-100 mb-4">
            You've completed {completedTasks} of {totalTasks} tasks today. Keep the momentum going!
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">{completionRate}%</span>
              <span className="text-blue-100 ml-2">Complete</span>
            </div>
            <div className="w-32">
              <div className="w-full bg-blue-400/30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Actions */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" />
          Priority Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priorityActions.map((action) => (
            <PriorityAction
              key={action.id}
              title={action.title}
              points={action.points}
              completed={action.completed}
              onComplete={() => handlePriorityComplete(action.id)}
            />
          ))}
        </div>
      </section>

      {/* Complete Task List */}
      <section>
        <h3 className="text-lg font-semibold mb-4">All Tasks</h3>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                {...task}
                onToggle={handleTaskToggle}
                onOutcomeChange={handleOutcomeChange}
              />
            ))}
          </div>
          
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-medium text-lg mb-2">All tasks completed!</h4>
              <p className="text-muted-foreground">
                Great job! You've finished all your tasks for today.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}