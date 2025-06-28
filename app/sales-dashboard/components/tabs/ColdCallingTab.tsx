'use client'

import { useState, useEffect } from 'react'
import { Phone, Play, Pause, Square, Users, Target, Clock, TrendingUp, Settings, Plus, Upload, Download, ExternalLink, CheckCircle, AlertCircle, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CallingCampaign, CallingLead, Call, AIAgent, LiveCallState } from '@/lib/types/cold-calling'

// Mock data for initial development
const mockCampaigns: CallingCampaign[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Q1 Cold Outreach',
    description: 'Initial outreach to warm leads',
    status: 'active',
    totalLeads: 150,
    callsMade: 45,
    callsConnected: 18,
    callsInterested: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Enterprise Prospects',
    description: 'High-value enterprise targets',
    status: 'paused',
    totalLeads: 75,
    callsMade: 12,
    callsConnected: 8,
    callsInterested: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const mockAIAgents: AIAgent[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Sales Rep Sarah',
    systemPrompt: 'You are a professional sales representative...',
    voiceId: 'elevenlabs_sarah',
    temperature: 0.7,
    maxTokens: 150,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

interface CampaignCardProps {
  campaign: CallingCampaign
  onStart: (id: string) => void
  onPause: (id: string) => void
  onStop: (id: string) => void
  onViewDetails: (id: string) => void
}

function CampaignCard({ campaign, onStart, onPause, onStop, onViewDetails }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const connectionRate = campaign.callsMade > 0 ? (campaign.callsConnected / campaign.callsMade * 100) : 0
  const interestRate = campaign.callsConnected > 0 ? (campaign.callsInterested / campaign.callsConnected * 100) : 0

  return (
    <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
        </div>
        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor(campaign.status))}>
          {campaign.status}
        </span>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{campaign.totalLeads}</div>
          <div className="text-xs text-muted-foreground">Total Leads</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{campaign.callsMade}</div>
          <div className="text-xs text-muted-foreground">Calls Made</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{connectionRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Connect Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{campaign.callsInterested}</div>
          <div className="text-xs text-muted-foreground">Interested</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{campaign.callsMade}/{campaign.totalLeads}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(campaign.callsMade / campaign.totalLeads) * 100}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {campaign.status === 'draft' || campaign.status === 'paused' ? (
          <Button size="sm" onClick={() => onStart(campaign.id)} className="flex-1">
            <Play className="h-4 w-4 mr-1" />
            Start
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => onPause(campaign.id)} className="flex-1">
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => onViewDetails(campaign.id)}>
          <ExternalLink className="h-4 w-4 mr-1" />
          Details
        </Button>
        {campaign.status === 'active' && (
          <Button size="sm" variant="outline" onClick={() => onStop(campaign.id)} className="text-red-600">
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function LiveCallMonitor({ liveCall }: { liveCall: LiveCallState | null }) {
  if (!liveCall) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Live Call Monitor
        </h3>
        <div className="text-center py-8">
          <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active calls</p>
        </div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5 text-green-600" />
          Live Call: {liveCall.leadName}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Duration:</span>
          <span className="font-mono text-lg">{formatDuration(liveCall.duration)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Call Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium capitalize">{liveCall.status.replace('_', ' ')}</span>
          </div>
          <div className="text-sm text-muted-foreground">{liveCall.phone}</div>
          {liveCall.isRecording && (
            <div className="flex items-center gap-1 text-red-600">
              <Mic className="h-4 w-4" />
              <span className="text-xs">Recording</span>
            </div>
          )}
        </div>

        {/* Live Transcript */}
        <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">Live Transcript:</h4>
          <div className="space-y-2">
            {liveCall.transcript.map((message, index) => (
              <div key={index} className={cn(
                'text-sm p-2 rounded',
                message.speaker === 'ai' 
                  ? 'bg-blue-100 dark:bg-blue-900/20 ml-4' 
                  : 'bg-green-100 dark:bg-green-900/20 mr-4'
              )}>
                <span className="font-medium capitalize">{message.speaker}:</span> {message.message}
              </div>
            ))}
          </div>
        </div>

        {/* AI Response Preview */}
        {liveCall.aiResponse && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">AI Preparing Response:</h4>
            <p className="text-sm">{liveCall.aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CreateCampaignModal({ isOpen, onClose, onCreate }: {
  isOpen: boolean
  onClose: () => void
  onCreate: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    aiAgentId: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate(formData)
    setFormData({ name: '', description: '', aiAgentId: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., Q1 Outreach Campaign"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Brief description of the campaign..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">AI Agent</label>
            <select
              value={formData.aiAgentId}
              onChange={(e) => setFormData(prev => ({ ...prev, aiAgentId: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select an AI agent...</option>
              {mockAIAgents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Create Campaign</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ColdCallingTab() {
  const [campaigns, setCampaigns] = useState<CallingCampaign[]>(mockCampaigns)
  const [liveCall, setLiveCall] = useState<LiveCallState | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock live call for demo
  useEffect(() => {
    // Simulate a live call
    const interval = setInterval(() => {
      if (campaigns.some(c => c.status === 'active')) {
        setLiveCall(prev => {
          if (!prev) {
            return {
              callId: '1',
              leadName: 'John Smith',
              phone: '+1 555 123 4567',
              status: 'in_progress',
              duration: 0,
              transcript: [
                { id: '1', callId: '1', speaker: 'ai', message: 'Hello! This is Sarah calling from RunwayIQ. How are you today?', timestampSeconds: 0, confidence: 0.95, createdAt: new Date().toISOString() }
              ],
              isRecording: true
            }
          }
          return {
            ...prev,
            duration: prev.duration + 1
          }
        })
      } else {
        setLiveCall(null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [campaigns])

  const handleStartCampaign = async (id: string) => {
    setIsLoading(true)
    try {
      // API call to start campaign
      setCampaigns(prev => prev.map(c => 
        c.id === id ? { ...c, status: 'active' as const } : c
      ))
    } catch (error) {
      console.error('Error starting campaign:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePauseCampaign = async (id: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'paused' as const } : c
    ))
  }

  const handleStopCampaign = async (id: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'completed' as const } : c
    ))
    setLiveCall(null)
  }

  const handleCreateCampaign = async (data: any) => {
    const newCampaign: CallingCampaign = {
      id: Date.now().toString(),
      userId: 'user1',
      name: data.name,
      description: data.description,
      aiAgentId: data.aiAgentId,
      status: 'draft',
      totalLeads: 0,
      callsMade: 0,
      callsConnected: 0,
      callsInterested: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCampaigns(prev => [...prev, newCampaign])
  }

  const todayStats = {
    callsMade: campaigns.reduce((sum, c) => sum + c.callsMade, 0),
    callsConnected: campaigns.reduce((sum, c) => sum + c.callsConnected, 0),
    callsInterested: campaigns.reduce((sum, c) => sum + c.callsInterested, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length
  }

  const connectionRate = todayStats.callsMade > 0 ? (todayStats.callsConnected / todayStats.callsMade * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">AI Cold Calling</h2>
          <p className="text-muted-foreground">Automate your outbound sales calls with AI-powered conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Calls Made</span>
          </div>
          <p className="text-2xl font-bold">{todayStats.callsMade}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Connected</span>
          </div>
          <p className="text-2xl font-bold">{todayStats.callsConnected}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Connect Rate</span>
          </div>
          <p className="text-2xl font-bold">{connectionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Interested</span>
          </div>
          <p className="text-2xl font-bold">{todayStats.callsInterested}</p>
        </div>
      </div>

      {/* Live Call Monitor */}
      <LiveCallMonitor liveCall={liveCall} />

      {/* Campaigns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
        {campaigns.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI cold-calling campaign to get started.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create Campaign
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onStart={handleStartCampaign}
                onPause={handlePauseCampaign}
                onStop={handleStopCampaign}
                onViewDetails={(id) => setSelectedCampaign(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCampaign}
      />
    </div>
  )
}