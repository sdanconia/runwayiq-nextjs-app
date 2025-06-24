'use client'

import { useState, useEffect } from 'react'
import { Upload, Play, Pause, Plus, Calendar, Phone, Mail, MessageCircle, Target, Users, CheckCircle, X, AlertCircle, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Lead {
  id: string
  fullName: string
  email: string
  phone?: string
  company?: string
  title?: string
  linkedinUrl?: string
  status: 'New' | 'In Progress' | 'Not Interested' | 'Demo Booked' | 'Sold' | 'Model Pending' | 'Completed'
  campaign: string
  tasksCompleted: number
  totalTasks: number
  lastActivity?: string
  nextTask?: string
  nextTaskDate?: string
  createdAt: string
}

interface Task {
  id: string
  leadId: string
  leadName: string
  type: 'Call' | 'LinkedIn DM' | 'Email'
  title: string
  description: string
  scheduledDate: string
  status: 'Pending' | 'Completed' | 'Skipped'
  outcome?: 'No answer' | 'Not interested' | 'Speak later' | 'Later date follow-up' | 'Using competitor' | 'Wants marketing material' | 'Remove from calling list' | 'Booked demo'
  dayNumber: number
  campaignId: string
}

interface Campaign {
  id: string
  name: string
  status: 'Draft' | 'Active' | 'Paused' | 'Completed'
  leadsCount: number
  completedLeads: number
  totalTasks: number
  completedTasks: number
  startDate: string
  endDate?: string
  taskTemplate: {
    calls: number
    linkedinDMs: number
    emails: number
    totalDays: number
  }
}

function LeadStatusBadge({ status }: { status: Lead['status'] }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'New': return { color: 'bg-gray-100 text-gray-800', icon: '⚪' }
      case 'In Progress': return { color: 'bg-blue-100 text-blue-800', icon: '🔵' }
      case 'Not Interested': return { color: 'bg-red-100 text-red-800', icon: '🔴' }
      case 'Demo Booked': return { color: 'bg-green-100 text-green-800', icon: '🟢' }
      case 'Sold': return { color: 'bg-blue-200 text-blue-900', icon: '🔵' }
      case 'Model Pending': return { color: 'bg-blue-200 text-blue-900', icon: '🔵' }
      case 'Completed': return { color: 'bg-purple-100 text-purple-800', icon: '🟣' }
      default: return { color: 'bg-gray-100 text-gray-800', icon: '⚪' }
    }
  }

  const config = getStatusConfig(status)
  
  return (
    <span className={cn('text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1', config.color)}>
      <span>{config.icon}</span>
      {status}
    </span>
  )
}

function CampaignCreator({ onCreateCampaign }: { onCreateCampaign: (campaign: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: 'PXLView First Campaign',
    calls: 7,
    linkedinDMs: 3,
    emails: 5,
    description: 'Initial outreach campaign for PXLView leads'
  })

  const totalTasks = formData.calls + formData.linkedinDMs + formData.emails

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const campaign = {
      id: Date.now().toString(),
      name: formData.name,
      status: 'Draft' as const,
      leadsCount: 0,
      completedLeads: 0,
      totalTasks: 0,
      completedTasks: 0,
      startDate: new Date().toISOString(),
      taskTemplate: {
        calls: formData.calls,
        linkedinDMs: formData.linkedinDMs,
        emails: formData.emails,
        totalDays: totalTasks,
      }
    }
    
    onCreateCampaign(campaign)
    setIsOpen(false)
    setFormData({
      name: '',
      calls: 7,
      linkedinDMs: 3,
      emails: 5,
      description: ''
    })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Create New Campaign
      </Button>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Create Campaign</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Campaign Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., PXLView First Campaign"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Calls
            </label>
            <input
              type="number"
              value={formData.calls}
              onChange={(e) => setFormData(prev => ({ ...prev, calls: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              max="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              LinkedIn DMs
            </label>
            <input
              type="number"
              value={formData.linkedinDMs}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedinDMs: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Emails
            </label>
            <input
              type="number"
              value={formData.emails}
              onChange={(e) => setFormData(prev => ({ ...prev, emails: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border rounded-md"
              min="0"
              max="10"
            />
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Campaign Summary:</strong> {totalTasks} tasks per lead over {totalTasks} business days
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Each lead will receive {formData.calls} calls, {formData.linkedinDMs} LinkedIn DMs, and {formData.emails} emails, one per business day.
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Create Campaign
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function GoogleSheetsUploader({ selectedCampaign, onUploadComplete }: { 
  selectedCampaign: Campaign | null
  onUploadComplete: (leads: Lead[]) => void 
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const generateBusinessDayTasks = (lead: Lead, campaign: Campaign) => {
    const tasks: Task[] = []
    const { calls, linkedinDMs, emails } = campaign.taskTemplate
    
    // Create task sequence: mix of calls, emails, and LinkedIn DMs
    const taskTypes: ('Call' | 'Email' | 'LinkedIn DM')[] = []
    
    // Add all task types to the sequence
    for (let i = 0; i < calls; i++) taskTypes.push('Call')
    for (let i = 0; i < emails; i++) taskTypes.push('Email')
    for (let i = 0; i < linkedinDMs; i++) taskTypes.push('LinkedIn DM')
    
    // Shuffle for variety (or keep ordered for predictability)
    // taskTypes.sort(() => Math.random() - 0.5)
    
    taskTypes.forEach((type, index) => {
      const dayNumber = index + 1
      const businessDate = addBusinessDays(new Date(), dayNumber - 1)
      
      tasks.push({
        id: `${lead.id}-task-${dayNumber}`,
        leadId: lead.id,
        leadName: lead.fullName,
        type,
        title: `${type} - ${lead.fullName} (Day ${dayNumber})`,
        description: getTaskDescription(type, lead, dayNumber),
        scheduledDate: businessDate.toISOString(),
        status: 'Pending',
        dayNumber,
        campaignId: campaign.id,
      })
    })
    
    return tasks
  }

  const addBusinessDays = (date: Date, days: number) => {
    const result = new Date(date)
    let addedDays = 0
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1)
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++
      }
    }
    
    return result
  }

  const getTaskDescription = (type: string, lead: Lead, dayNumber: number) => {
    switch (type) {
      case 'Call':
        return `Call ${lead.fullName} at ${lead.company || 'their company'} to discuss PXLView solutions.`
      case 'Email':
        return `Send follow-up email to ${lead.fullName} about PXLView integration opportunities.`
      case 'LinkedIn DM':
        return `Send LinkedIn message to ${lead.fullName} to connect and discuss their needs.`
      default:
        return `Reach out to ${lead.fullName} regarding PXLView.`
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCampaign) {
      setUploadStatus('Please select a campaign first.')
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('Processing CSV file...')

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const leads: Lead[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length < 2) continue // Skip empty lines
        
        const lead: Lead = {
          id: `lead-${Date.now()}-${i}`,
          fullName: values[0] || '',
          email: values[1] || '',
          phone: values[2] || undefined,
          company: values[3] || undefined,
          title: values[4] || undefined,
          linkedinUrl: values[5] || undefined,
          status: 'New',
          campaign: selectedCampaign.name,
          tasksCompleted: 0,
          totalTasks: selectedCampaign.taskTemplate.calls + selectedCampaign.taskTemplate.linkedinDMs + selectedCampaign.taskTemplate.emails,
          createdAt: new Date().toISOString(),
        }
        
        if (lead.fullName && lead.email) {
          leads.push(lead)
        }
      }
      
      // Generate tasks for each lead
      const allTasks: Task[] = []
      leads.forEach(lead => {
        const tasks = generateBusinessDayTasks(lead, selectedCampaign)
        allTasks.push(...tasks)
        
        // Set next task info for lead
        const nextTask = tasks[0]
        if (nextTask) {
          lead.nextTask = nextTask.title
          lead.nextTaskDate = nextTask.scheduledDate
        }
      })
      
      setUploadStatus(`Successfully imported ${leads.length} leads with ${allTasks.length} tasks`)
      onUploadComplete(leads)
      
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000)
      
    } catch (error) {
      setUploadStatus('Error processing file. Please check the format.')
      setTimeout(() => setUploadStatus(null), 3000)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5" />
        Import Leads from Google Sheets
      </h3>
      
      {!selectedCampaign ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please create a campaign first before uploading leads.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">Selected Campaign: {selectedCampaign.name}</p>
            <p className="text-xs text-muted-foreground">
              Each lead will get {selectedCampaign.taskTemplate.calls + selectedCampaign.taskTemplate.linkedinDMs + selectedCampaign.taskTemplate.emails} tasks over {selectedCampaign.taskTemplate.totalDays} business days
            </p>
          </div>
          
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with lead information
              </p>
              <p className="text-xs text-muted-foreground">
                Expected columns: Full Name, Email, Phone, Company, Title, LinkedIn URL
              </p>
            </div>
            
            <label className="mt-4 inline-block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <Button disabled={isUploading} className="cursor-pointer">
                {isUploading ? 'Processing...' : 'Choose CSV File'}
              </Button>
            </label>
          </div>

          {uploadStatus && (
            <div className={cn(
              'p-4 rounded-lg flex items-center gap-2',
              uploadStatus.includes('Successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            )}>
              {uploadStatus.includes('Successfully') ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{uploadStatus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LeadCard({ lead, onUpdateStatus }: { 
  lead: Lead
  onUpdateStatus: (leadId: string, status: Lead['status']) => void 
}) {
  const progressPercentage = (lead.tasksCompleted / lead.totalTasks) * 100

  return (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{lead.fullName}</h3>
          <p className="text-sm text-muted-foreground">{lead.company || 'No company'}</p>
          <p className="text-sm text-muted-foreground">{lead.title || 'No title'}</p>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.nextTask && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{lead.nextTask}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{lead.tasksCompleted}/{lead.totalTasks} tasks</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={lead.status}
          onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['status'])}
          className="text-xs px-2 py-1 border rounded"
        >
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Demo Booked">Demo Booked</option>
          <option value="Sold">Sold</option>
          <option value="Model Pending">Model Pending</option>
          <option value="Completed">Completed</option>
        </select>
        {lead.linkedinUrl && (
          <Button size="sm" variant="outline" asChild>
            <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              LinkedIn
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])

  const handleCreateCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign])
    setSelectedCampaign(campaign)
  }

  const handleUploadComplete = (newLeads: Lead[]) => {
    setLeads(prev => [...prev, ...newLeads])
    
    // Update campaign with new leads count
    if (selectedCampaign) {
      setCampaigns(prev => prev.map(camp => 
        camp.id === selectedCampaign.id 
          ? { ...camp, leadsCount: camp.leadsCount + newLeads.length }
          : camp
      ))
    }
  }

  const handleUpdateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status } : lead
    ))
  }

  const campaignLeads = selectedCampaign 
    ? leads.filter(lead => lead.campaign === selectedCampaign.name)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <p className="text-muted-foreground">Create campaigns, import leads, and manage outreach tasks</p>
        </div>
      </div>

      {/* Campaign Creator */}
      <CampaignCreator onCreateCampaign={handleCreateCampaign} />

      {/* Campaign Selection */}
      {campaigns.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Select Campaign</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(campaign => (
              <div
                key={campaign.id}
                className={cn(
                  'p-4 border rounded-lg cursor-pointer transition-all',
                  selectedCampaign?.id === campaign.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted hover:border-primary/50'
                )}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{campaign.name}</h4>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  )}>
                    {campaign.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{campaign.leadsCount} leads</p>
                  <p>{campaign.taskTemplate.calls}C • {campaign.taskTemplate.linkedinDMs}DM • {campaign.taskTemplate.emails}E</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Sheets Uploader */}
      <GoogleSheetsUploader 
        selectedCampaign={selectedCampaign}
        onUploadComplete={handleUploadComplete}
      />

      {/* Campaign Stats */}
      {selectedCampaign && campaignLeads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Leads</span>
            </div>
            <p className="text-2xl font-bold">{campaignLeads.length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Demo Booked</span>
            </div>
            <p className="text-2xl font-bold">{campaignLeads.filter(l => l.status === 'Demo Booked').length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold">{campaignLeads.filter(l => l.status === 'Completed').length}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <X className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Not Interested</span>
            </div>
            <p className="text-2xl font-bold">{campaignLeads.filter(l => l.status === 'Not Interested').length}</p>
          </div>
        </div>
      )}

      {/* Leads Grid */}
      {campaignLeads.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Campaign Leads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignLeads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onUpdateStatus={handleUpdateLeadStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first campaign to start managing leads and tasks.
          </p>
        </div>
      )}
    </div>
  )
}