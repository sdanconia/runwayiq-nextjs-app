'use client'

import { useState, useEffect, useCallback } from 'react'
import { NotionTask, NotionLead, NotionActivity } from '@/lib/notion'

interface UseNotionIntegrationReturn {
  // Tasks
  tasks: NotionTask[]
  isLoadingTasks: boolean
  fetchTasks: () => Promise<void>
  createTask: (task: Omit<NotionTask, 'id'>) => Promise<NotionTask | null>
  updateTask: (taskId: string, updates: Partial<NotionTask>) => Promise<boolean>
  
  // Leads
  leads: NotionLead[]
  isLoadingLeads: boolean
  fetchLeads: () => Promise<void>
  createLead: (lead: Omit<NotionLead, 'id'>) => Promise<NotionLead | null>
  
  // Activities
  createActivity: (activity: Omit<NotionActivity, 'id'>) => Promise<boolean>
  
  // General
  isConfigured: boolean
  error: string | null
  syncAll: () => Promise<void>
}

export function useNotionIntegration(): UseNotionIntegrationReturn {
  const [tasks, setTasks] = useState<NotionTask[]>([])
  const [leads, setLeads] = useState<NotionLead[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  // Check if Notion is configured
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const response = await fetch('/api/notion/tasks')
        setIsConfigured(response.status !== 400)
      } catch (err) {
        setIsConfigured(false)
      }
    }
    
    checkConfiguration()
  }, [])

  // Fetch tasks from Notion
  const fetchTasks = useCallback(async () => {
    if (!isConfigured) return
    
    setIsLoadingTasks(true)
    setError(null)
    
    try {
      const response = await fetch('/api/notion/tasks')
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.')
        }
        throw new Error(`Failed to fetch tasks (${response.status})`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setTasks(data.data.tasks || [])
      } else {
        throw new Error(data.error || 'Failed to fetch tasks')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks'
      setError(errorMessage)
      console.error('Error fetching tasks:', err)
    } finally {
      setIsLoadingTasks(false)
    }
  }, [isConfigured])

  // Create task in Notion
  const createTask = useCallback(async (task: Omit<NotionTask, 'id'>): Promise<NotionTask | null> => {
    if (!isConfigured) return null
    
    setError(null)
    
    try {
      const response = await fetch('/api/notion/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create task')
      }
      
      const data = await response.json()
      const newTask = data.task
      
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      console.error('Error creating task:', err)
      return null
    }
  }, [isConfigured])

  // Update task in Notion
  const updateTask = useCallback(async (taskId: string, updates: Partial<NotionTask>): Promise<boolean> => {
    if (!isConfigured) return false
    
    setError(null)
    
    try {
      const response = await fetch(`/api/notion/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      )
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      console.error('Error updating task:', err)
      return false
    }
  }, [isConfigured])

  // Fetch leads from Notion
  const fetchLeads = useCallback(async () => {
    if (!isConfigured) return
    
    setIsLoadingLeads(true)
    setError(null)
    
    try {
      const response = await fetch('/api/notion/leads')
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads')
      console.error('Error fetching leads:', err)
    } finally {
      setIsLoadingLeads(false)
    }
  }, [isConfigured])

  // Create lead in Notion
  const createLead = useCallback(async (lead: Omit<NotionLead, 'id'>): Promise<NotionLead | null> => {
    if (!isConfigured) return null
    
    setError(null)
    
    try {
      const response = await fetch('/api/notion/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create lead')
      }
      
      const data = await response.json()
      const newLead = data.lead
      
      setLeads(prev => [newLead, ...prev])
      return newLead
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create lead')
      console.error('Error creating lead:', err)
      return null
    }
  }, [isConfigured])

  // Create activity in Notion
  const createActivity = useCallback(async (activity: Omit<NotionActivity, 'id'>): Promise<boolean> => {
    if (!isConfigured) return false
    
    setError(null)
    
    try {
      const response = await fetch('/api/notion/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create activity')
      }
      
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity')
      console.error('Error creating activity:', err)
      return false
    }
  }, [isConfigured])

  // Sync all data
  const syncAll = useCallback(async () => {
    if (!isConfigured) return
    
    await Promise.all([
      fetchTasks(),
      fetchLeads(),
    ])
  }, [fetchTasks, fetchLeads, isConfigured])

  return {
    tasks,
    isLoadingTasks,
    fetchTasks,
    createTask,
    updateTask,
    leads,
    isLoadingLeads,
    fetchLeads,
    createLead,
    createActivity,
    isConfigured,
    error,
    syncAll,
  }
}