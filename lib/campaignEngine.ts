import { addDays, addWeeks, format } from 'date-fns'
import { NotionAPI, NotionTask, NotionCampaign, NotionLead, TaskType } from './notion'

// Campaign template: 15 touchpoints over 3 weeks
export interface CampaignStep {
  step: number
  dayOffset: number // Days from campaign start
  taskType: TaskType
  title: string
  description: string
  points: number
}

// 3-week campaign with 15 touchpoints: 7 calls, 3 LinkedIn DMs, 5 emails
export const CAMPAIGN_TEMPLATE: CampaignStep[] = [
  // Week 1
  { step: 1, dayOffset: 0, taskType: 'Call', title: 'Initial outreach call', description: 'First contact call to introduce services', points: 50 },
  { step: 2, dayOffset: 1, taskType: 'Email', title: 'Follow-up email with portfolio', description: 'Send email with portfolio examples and next steps', points: 25 },
  { step: 3, dayOffset: 3, taskType: 'LinkedIn DM', title: 'LinkedIn connection and message', description: 'Connect on LinkedIn and send personalized message', points: 30 },
  { step: 4, dayOffset: 5, taskType: 'Call', title: 'Follow-up call', description: 'Check if they received materials and answer questions', points: 50 },
  { step: 5, dayOffset: 7, taskType: 'Email', title: 'Case study email', description: 'Share relevant case study and success stories', points: 25 },
  
  // Week 2
  { step: 6, dayOffset: 9, taskType: 'Call', title: 'Discovery call', description: 'Understand their specific needs and pain points', points: 75 },
  { step: 7, dayOffset: 11, taskType: 'Email', title: 'Custom proposal preparation', description: 'Send email with timeline for custom proposal', points: 25 },
  { step: 8, dayOffset: 12, taskType: 'LinkedIn DM', title: 'LinkedIn check-in', description: 'Send casual check-in via LinkedIn', points: 30 },
  { step: 9, dayOffset: 14, taskType: 'Call', title: 'Proposal discussion call', description: 'Present custom proposal and discuss details', points: 100 },
  { step: 10, dayOffset: 15, taskType: 'Email', title: 'Proposal follow-up', description: 'Send formal proposal document with pricing', points: 25 },
  
  // Week 3
  { step: 11, dayOffset: 17, taskType: 'Call', title: 'Proposal review call', description: 'Review proposal details and answer questions', points: 75 },
  { step: 12, dayOffset: 18, taskType: 'Email', title: 'Social proof email', description: 'Share testimonials and additional references', points: 25 },
  { step: 13, dayOffset: 19, taskType: 'LinkedIn DM', title: 'Final LinkedIn touch', description: 'Final check-in before decision deadline', points: 30 },
  { step: 14, dayOffset: 20, taskType: 'Call', title: 'Decision call', description: 'Discuss final decision and next steps', points: 100 },
  { step: 15, dayOffset: 21, taskType: 'Call', title: 'Final follow-up call', description: 'Last attempt to close or understand objections', points: 100 },
]

export class CampaignEngine {
  // Create a new campaign for a lead
  static async createCampaign(lead: NotionLead, owner: string): Promise<NotionCampaign | null> {
    if (!lead.id) return null

    const campaignName = `${lead.fullName} - 3-Week Outreach Campaign`
    const startDate = new Date().toISOString().split('T')[0] // Today

    const campaign = await NotionAPI.createCampaign({
      name: campaignName,
      leadId: lead.id,
      leadName: lead.fullName,
      startDate,
      status: 'Active',
      currentStep: 1,
      totalSteps: CAMPAIGN_TEMPLATE.length,
      owner,
    })

    if (campaign?.id) {
      // Generate all tasks for this campaign
      await this.generateCampaignTasks(campaign, lead)
    }

    return campaign
  }

  // Generate all tasks for a campaign
  static async generateCampaignTasks(campaign: NotionCampaign, lead: NotionLead): Promise<void> {
    const startDate = new Date(campaign.startDate)

    for (const step of CAMPAIGN_TEMPLATE) {
      const dueDate = addDays(startDate, step.dayOffset)
      
      const task: Omit<NotionTask, 'id'> = {
        title: `${step.title} - ${lead.fullName}`,
        description: `${step.description}\n\nLead: ${lead.fullName}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nProperty: ${lead.propertyUrl}\nLinkedIn: ${lead.linkedinUrl}`,
        status: 'To Do',
        priority: step.taskType === 'Call' ? 'High' : 'Medium',
        points: step.points,
        dueDate: dueDate.toISOString().split('T')[0],
        completed: false,
        leadId: lead.id,
        leadName: lead.fullName,
        campaignId: campaign.id,
        taskType: step.taskType,
      }

      await NotionAPI.createTask(task)
    }
  }

  // Progress a campaign when a task is completed
  static async progressCampaign(campaignId: string, completedStep: number): Promise<void> {
    if (completedStep >= CAMPAIGN_TEMPLATE.length) {
      // Campaign completed
      await NotionAPI.updateCampaign(campaignId, {
        status: 'Completed',
        currentStep: CAMPAIGN_TEMPLATE.length,
      })
    } else {
      // Update current step
      await NotionAPI.updateCampaign(campaignId, {
        currentStep: completedStep + 1,
      })
    }
  }

  // Create campaign for multiple leads (batch import)
  static async createBatchCampaigns(leads: NotionLead[], defaultOwner: string): Promise<{
    created: number
    errors: string[]
  }> {
    let created = 0
    const errors: string[] = []

    for (const lead of leads) {
      try {
        const owner = lead.owner || defaultOwner
        await this.createCampaign(lead, owner)
        created++
      } catch (error) {
        errors.push(`Failed to create campaign for ${lead.fullName}: ${error}`)
      }
    }

    return { created, errors }
  }

  // Get campaign progress summary
  static getCampaignProgress(campaign: NotionCampaign): {
    progress: number
    currentPhase: string
    nextStep: CampaignStep | null
    daysRemaining: number
  } {
    const progress = Math.round((campaign.currentStep / campaign.totalSteps) * 100)
    const nextStep = CAMPAIGN_TEMPLATE.find(step => step.step === campaign.currentStep) || null
    
    let currentPhase = 'Completed'
    if (campaign.currentStep <= 5) currentPhase = 'Week 1 - Initial Contact'
    else if (campaign.currentStep <= 10) currentPhase = 'Week 2 - Discovery & Proposal'
    else if (campaign.currentStep <= 15) currentPhase = 'Week 3 - Decision & Close'

    const startDate = new Date(campaign.startDate)
    const endDate = addWeeks(startDate, 3)
    const today = new Date()
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    return {
      progress,
      currentPhase,
      nextStep,
      daysRemaining,
    }
  }

  // Get tasks due today for an owner
  static async getTodaysTasks(owner: string): Promise<NotionTask[]> {
    const today = new Date().toISOString().split('T')[0]
    const allTasks = await NotionAPI.getTasks()
    
    return allTasks.filter(task => 
      task.dueDate === today && 
      !task.completed &&
      task.leadName && // Only campaign tasks
      (task.description?.includes(owner) || task.title.includes(owner))
    )
  }

  // Complete a task and update campaign progress
  static async completeTask(taskId: string, outcome: string): Promise<void> {
    // Update task with completion and outcome
    await NotionAPI.updateTask(taskId, {
      status: 'Done',
      completed: true,
      outcome: outcome as any,
    })

    // Log activity
    await NotionAPI.createActivity({
      type: 'Task Completed',
      description: `Task completed with outcome: ${outcome}`,
      date: new Date().toISOString(),
      entity: taskId,
      entityType: 'task',
      outcome: outcome as any,
    })

    // Update campaign progress if needed
    // This would require getting the task details and finding the campaign
    // Implementation depends on specific requirements
  }

  // Pause a campaign
  static async pauseCampaign(campaignId: string): Promise<void> {
    await NotionAPI.updateCampaign(campaignId, { status: 'Paused' })
  }

  // Resume a campaign
  static async resumeCampaign(campaignId: string): Promise<void> {
    await NotionAPI.updateCampaign(campaignId, { status: 'Active' })
  }
}