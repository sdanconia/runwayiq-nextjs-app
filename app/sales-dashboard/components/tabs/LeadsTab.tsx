'use client'

import { useState, useEffect } from 'react'
import { Upload, Download, Plus, Edit2, Trash2, Eye, ExternalLink, Users, Target, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react'
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
  status: 'New' | 'Contacted' | 'Qualified' | 'Demo Scheduled' | 'Demo Completed' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost'
  campaign?: string
  source: 'Google Sheets' | 'Manual' | 'Import'
  lastContact?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

interface Campaign {
  id: string
  name: string
  type: 'Email' | 'LinkedIn' | 'Cold Call' | 'Warm Outreach'
  status: 'Active' | 'Paused' | 'Completed'
  leadsCount: number
}

function LeadCard({ lead, onEdit, onDelete, onViewTasks }: { 
  lead: Lead
  onEdit: (lead: Lead) => void
  onDelete: (id: string) => void
  onViewTasks: (leadId: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Qualified': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'Demo Scheduled': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'Demo Completed': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'Proposal Sent': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400'
      case 'Closed Won': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Closed Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-card rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{lead.fullName}</h3>
          <p className="text-sm text-muted-foreground">{lead.company || 'No company'}</p>
          <p className="text-sm text-muted-foreground">{lead.title || 'No title'}</p>
        </div>
        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor(lead.status))}>
          {lead.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>📧</span>
          <span>{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>📞</span>
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.campaign && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{lead.campaign}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Added {new Date(lead.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onViewTasks(lead.id)}>
          <Calendar className="h-4 w-4 mr-1" />
          Tasks
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(lead)}>
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        {lead.linkedinUrl && (
          <Button size="sm" variant="outline" asChild>
            <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              LinkedIn
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onDelete(lead.id)} className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function GoogleSheetsUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsUploading(true)
    setUploadStatus('Processing file...')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/google-sheets/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setUploadStatus(`Successfully imported ${result.count} leads`)
      onUploadComplete()
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus(null)
        setFile(null)
      }, 3000)
    } catch (error) {
      setUploadStatus('Upload failed. Please try again.')
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
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file exported from Google Sheets
            </p>
            <p className="text-xs text-muted-foreground">
              Expected columns: Full Name, Email, Phone, Company, Title, LinkedIn URL
            </p>
          </div>
          
          <label className="mt-4 inline-block">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Button disabled={isUploading} className="cursor-pointer">
              {isUploading ? 'Processing...' : 'Choose File'}
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
    </div>
  )
}

function CampaignSelector({ 
  campaigns, 
  selectedCampaign, 
  onCampaignChange,
  onCreateCampaign 
}: {
  campaigns: Campaign[]
  selectedCampaign: string
  onCampaignChange: (campaignId: string) => void
  onCreateCampaign: () => void
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        <span className="text-sm font-medium">Campaign:</span>
      </div>
      <select
        value={selectedCampaign}
        onChange={(e) => onCampaignChange(e.target.value)}
        className="px-3 py-1 border rounded-md text-sm"
      >
        <option value="">All Campaigns</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.id}>
            {campaign.name} ({campaign.leadsCount} leads)
          </option>
        ))}
      </select>
      <Button size="sm" variant="outline" onClick={onCreateCampaign}>
        <Plus className="h-4 w-4 mr-1" />
        New Campaign
      </Button>
    </div>
  )
}

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'Q1 Outbound', type: 'Email', status: 'Active', leadsCount: 45 },
    { id: '2', name: 'LinkedIn Warm', type: 'LinkedIn', status: 'Active', leadsCount: 23 },
    { id: '3', name: 'Cold Calls', type: 'Cold Call', status: 'Paused', leadsCount: 12 },
  ])
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Sample leads data
  useEffect(() => {
    // Simulate loading leads
    setTimeout(() => {
      setLeads([
        {
          id: '1',
          fullName: 'John Smith',
          email: 'john@techcorp.com',
          phone: '+1 555 123 4567',
          company: 'TechCorp Inc',
          title: 'VP of Sales',
          linkedinUrl: 'https://linkedin.com/in/johnsmith',
          status: 'Qualified',
          campaign: 'Q1 Outbound',
          source: 'Google Sheets',
          assignedTo: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          fullName: 'Sarah Johnson',
          email: 'sarah@startupxyz.com',
          phone: '+1 555 987 6543',
          company: 'StartupXYZ',
          title: 'CEO',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          status: 'Demo Scheduled',
          campaign: 'LinkedIn Warm',
          source: 'Manual',
          assignedTo: 'Current User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleUploadComplete = async () => {
    // Refresh leads after upload
    setIsLoading(true)
    // Call API to fetch updated leads
    setIsLoading(false)
  }

  const handleEditLead = (lead: Lead) => {
    // Open edit modal
    console.log('Edit lead:', lead)
  }

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(lead => lead.id !== id))
  }

  const handleViewTasks = (leadId: string) => {
    // Navigate to tasks view or open modal
    console.log('View tasks for lead:', leadId)
  }

  const handleCreateCampaign = () => {
    // Open create campaign modal
    console.log('Create new campaign')
  }

  const filteredLeads = selectedCampaign 
    ? leads.filter(lead => lead.campaign === campaigns.find(c => c.id === selectedCampaign)?.name)
    : leads

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Lead Management</h2>
          <p className="text-muted-foreground">Import, manage, and track your sales leads</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Google Sheets Upload */}
      <GoogleSheetsUpload onUploadComplete={handleUploadComplete} />

      {/* Campaign Filter */}
      <CampaignSelector
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        onCreateCampaign={handleCreateCampaign}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total Leads</span>
          </div>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Qualified</span>
          </div>
          <p className="text-2xl font-bold">{leads.filter(l => l.status === 'Qualified').length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Demos</span>
          </div>
          <p className="text-2xl font-bold">{leads.filter(l => l.status === 'Demo Scheduled').length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Won</span>
          </div>
          <p className="text-2xl font-bold">{leads.filter(l => l.status === 'Closed Won').length}</p>
        </div>
      </div>

      {/* Leads Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onViewTasks={handleViewTasks}
            />
          ))}
        </div>
      )}

      {filteredLeads.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No leads found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedCampaign ? 'No leads in the selected campaign.' : 'Start by importing leads from Google Sheets or adding them manually.'}
          </p>
          <Button onClick={() => setSelectedCampaign('')}>
            Show All Leads
          </Button>
        </div>
      )}
    </div>
  )
}