import { Client } from '@notionhq/client'

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Database IDs from environment variables
export const NOTION_DATABASES = {
  TASKS: process.env.NOTION_TASKS_DATABASE_ID || '',
  LEADS: process.env.NOTION_LEADS_DATABASE_ID || '',
  COMPANIES: process.env.NOTION_COMPANIES_DATABASE_ID || '',
  ACTIVITIES: process.env.NOTION_ACTIVITIES_DATABASE_ID || '',
  CAMPAIGNS: process.env.NOTION_CAMPAIGNS_DATABASE_ID || '',
  FULFILLMENT: process.env.NOTION_FULFILLMENT_DATABASE_ID || '',
  CUSTOMER_SUCCESS: process.env.NOTION_CUSTOMER_SUCCESS_DATABASE_ID || '',
}

// Outcome types for tasks
export type TaskOutcome = 
  | 'No answer'
  | 'Not interested'
  | 'Speak later'
  | 'Later date follow-up'
  | 'Using competitor'
  | 'Wants marketing material'
  | 'Remove from calling list'
  | 'Booked demo'

export type TaskType = 'Call' | 'Email' | 'LinkedIn DM'

export type LeadStatus = 
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Demo Scheduled'
  | 'Demo Completed'
  | 'Proposal Sent'
  | 'Closed Won'
  | 'Closed Lost'

export type FulfillmentStatus = 'Pending delivery' | 'Created but pending feedback' | 'Completed and hosted'

export type CustomerSuccessTicketType = 'Support' | 'Check-in' | 'Follow-up' | 'Issue'

// Type definitions for Notion integration
export interface NotionTask {
  id?: string
  title: string
  status: 'To Do' | 'In Progress' | 'Done' | 'Archived'
  priority: 'High' | 'Medium' | 'Low'
  points: number
  dueDate?: string
  completed: boolean
  description?: string
  leadId?: string
  leadName?: string
  campaignId?: string
  taskType?: TaskType
  outcome?: TaskOutcome
}

export interface NotionLead {
  id?: string
  fullName: string
  email: string
  phone?: string
  company?: string
  title?: string
  city?: string
  propertyUrl?: string
  linkedinUrl?: string
  status: LeadStatus
  campaign?: string
  source?: string
  assignedTo?: string
  priority?: 'High' | 'Medium' | 'Low'
  notes?: string
  owner?: string
  campaignId?: string
  createdAt?: string
  updatedAt?: string
}

export interface NotionCampaign {
  id?: string
  name: string
  leadId: string
  leadName: string
  startDate: string
  status: 'Active' | 'Completed' | 'Paused'
  currentStep: number
  totalSteps: number
  owner: string
}

export interface NotionFulfillment {
  id?: string
  modelName: string
  status: FulfillmentStatus
  dueDate?: string
  clientName: string
  clientId?: string
  createdAt?: string
  completedAt?: string
}

export interface NotionCustomerSuccess {
  id?: string
  ticketType: CustomerSuccessTicketType
  clientName: string
  clientId?: string
  status: 'Open' | 'In Progress' | 'Completed'
  dueDate?: string
  description: string
  assignedTo?: string
  createdAt?: string
  resolvedAt?: string
}

export interface NotionCompany {
  id?: string
  name: string
  website?: string
  linkedin?: string
  description?: string
}

export interface NotionActivity {
  id?: string
  type: string
  description: string
  date: string
  entity: string
  entityType: 'task' | 'lead' | 'company' | 'campaign'
  outcome?: TaskOutcome
}

// Notion API helper functions
export class NotionAPI {
  // Tasks
  static async getTasks(): Promise<NotionTask[]> {
    if (!NOTION_DATABASES.TASKS) return []
    
    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASES.TASKS,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      })

      return response.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Title?.title?.[0]?.text?.content || '',
        status: page.properties.Status?.select?.name || 'To Do',
        priority: page.properties.Priority?.select?.name || 'Medium',
        points: page.properties.Points?.number || 0,
        dueDate: page.properties['Due Date']?.date?.start || undefined,
        completed: page.properties.Status?.select?.name === 'Done',
        description: page.properties.Description?.rich_text?.[0]?.text?.content || '',
      }))
    } catch (error) {
      console.error('Error fetching tasks from Notion:', error)
      return []
    }
  }

  static async createTask(task: Omit<NotionTask, 'id'>): Promise<NotionTask | null> {
    if (!NOTION_DATABASES.TASKS) return null

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASES.TASKS },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: task.title,
                },
              },
            ],
          },
          Status: {
            select: {
              name: task.status,
            },
          },
          Priority: {
            select: {
              name: task.priority,
            },
          },
          Points: {
            number: task.points,
          },
          ...(task.dueDate && {
            'Due Date': {
              date: {
                start: task.dueDate,
              },
            },
          }),
          ...(task.description && {
            Description: {
              rich_text: [
                {
                  text: {
                    content: task.description,
                  },
                },
              ],
            },
          }),
        },
      })

      return {
        id: response.id,
        ...task,
      }
    } catch (error) {
      console.error('Error creating task in Notion:', error)
      return null
    }
  }

  static async updateTask(taskId: string, updates: Partial<NotionTask>): Promise<boolean> {
    if (!NOTION_DATABASES.TASKS) return false

    try {
      const properties: any = {}

      if (updates.title) {
        properties.Title = {
          title: [{ text: { content: updates.title } }],
        }
      }

      if (updates.status) {
        properties.Status = {
          select: { name: updates.status },
        }
      }

      if (updates.priority) {
        properties.Priority = {
          select: { name: updates.priority },
        }
      }

      if (updates.points !== undefined) {
        properties.Points = {
          number: updates.points,
        }
      }

      if (updates.dueDate) {
        properties['Due Date'] = {
          date: { start: updates.dueDate },
        }
      }

      if (updates.description) {
        properties.Description = {
          rich_text: [{ text: { content: updates.description } }],
        }
      }

      await notion.pages.update({
        page_id: taskId,
        properties,
      })

      return true
    } catch (error) {
      console.error('Error updating task in Notion:', error)
      return false
    }
  }

  // Leads
  static async getLeads(): Promise<NotionLead[]> {
    if (!NOTION_DATABASES.LEADS) return []

    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASES.LEADS,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      })

      return response.results.map((page: any) => ({
        id: page.id,
        fullName: page.properties['Full Name']?.title?.[0]?.text?.content || '',
        email: page.properties.Email?.email || '',
        phone: page.properties.Phone?.phone_number || '',
        city: page.properties.City?.rich_text?.[0]?.text?.content || '',
        propertyUrl: page.properties['Property URL']?.url || '',
        linkedinUrl: page.properties['LinkedIn URL']?.url || '',
        status: page.properties.Status?.select?.name || 'New',
        owner: page.properties.Owner?.rich_text?.[0]?.text?.content || undefined,
        campaignId: page.properties['Campaign ID']?.rich_text?.[0]?.text?.content || undefined,
        createdAt: page.created_time,
        updatedAt: page.last_edited_time,
      }))
    } catch (error) {
      console.error('Error fetching leads from Notion:', error)
      return []
    }
  }

  static async createLead(lead: Omit<NotionLead, 'id'>): Promise<NotionLead | null> {
    if (!NOTION_DATABASES.LEADS) return null

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASES.LEADS },
        properties: {
          'Full Name': {
            title: [{ text: { content: lead.fullName } }],
          },
          Email: {
            email: lead.email,
          },
          ...(lead.phone && {
            Phone: {
              phone_number: lead.phone,
            },
          }),
          ...(lead.city && {
            City: {
              rich_text: [{ text: { content: lead.city } }],
            },
          }),
          ...(lead.propertyUrl && {
            'Property URL': {
              url: lead.propertyUrl,
            },
          }),
          ...(lead.linkedinUrl && {
            'LinkedIn URL': {
              url: lead.linkedinUrl,
            },
          }),
          Status: {
            select: { name: lead.status },
          },
          ...(lead.owner && {
            Owner: {
              rich_text: [{ text: { content: lead.owner } }],
            },
          }),
          ...(lead.campaignId && {
            'Campaign ID': {
              rich_text: [{ text: { content: lead.campaignId } }],
            },
          }),
        },
      })

      return {
        id: response.id,
        ...lead,
      }
    } catch (error) {
      console.error('Error creating lead in Notion:', error)
      return null
    }
  }

  // Campaigns
  static async getCampaigns(): Promise<NotionCampaign[]> {
    if (!NOTION_DATABASES.CAMPAIGNS) return []

    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASES.CAMPAIGNS,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      })

      return response.results.map((page: any) => ({
        id: page.id,
        name: page.properties.Name?.title?.[0]?.text?.content || '',
        leadId: page.properties['Lead ID']?.rich_text?.[0]?.text?.content || '',
        leadName: page.properties['Lead Name']?.rich_text?.[0]?.text?.content || '',
        startDate: page.properties['Start Date']?.date?.start || '',
        status: page.properties.Status?.select?.name || 'Active',
        currentStep: page.properties['Current Step']?.number || 1,
        totalSteps: page.properties['Total Steps']?.number || 15,
        owner: page.properties.Owner?.rich_text?.[0]?.text?.content || '',
      }))
    } catch (error) {
      console.error('Error fetching campaigns from Notion:', error)
      return []
    }
  }

  static async createCampaign(campaign: Omit<NotionCampaign, 'id'>): Promise<NotionCampaign | null> {
    if (!NOTION_DATABASES.CAMPAIGNS) return null

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASES.CAMPAIGNS },
        properties: {
          Name: {
            title: [{ text: { content: campaign.name } }],
          },
          'Lead ID': {
            rich_text: [{ text: { content: campaign.leadId } }],
          },
          'Lead Name': {
            rich_text: [{ text: { content: campaign.leadName } }],
          },
          'Start Date': {
            date: { start: campaign.startDate },
          },
          Status: {
            select: { name: campaign.status },
          },
          'Current Step': {
            number: campaign.currentStep,
          },
          'Total Steps': {
            number: campaign.totalSteps,
          },
          Owner: {
            rich_text: [{ text: { content: campaign.owner } }],
          },
        },
      })

      return {
        id: response.id,
        ...campaign,
      }
    } catch (error) {
      console.error('Error creating campaign in Notion:', error)
      return null
    }
  }

  static async updateCampaign(campaignId: string, updates: Partial<NotionCampaign>): Promise<boolean> {
    if (!NOTION_DATABASES.CAMPAIGNS) return false

    try {
      const properties: any = {}

      if (updates.status) {
        properties.Status = { select: { name: updates.status } }
      }

      if (updates.currentStep !== undefined) {
        properties['Current Step'] = { number: updates.currentStep }
      }

      await notion.pages.update({
        page_id: campaignId,
        properties,
      })

      return true
    } catch (error) {
      console.error('Error updating campaign in Notion:', error)
      return false
    }
  }

  // Fulfillment
  static async getFulfillments(): Promise<NotionFulfillment[]> {
    if (!NOTION_DATABASES.FULFILLMENT) return []

    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASES.FULFILLMENT,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      })

      return response.results.map((page: any) => ({
        id: page.id,
        modelName: page.properties['Model Name']?.title?.[0]?.text?.content || '',
        status: page.properties.Status?.select?.name || 'Pending delivery',
        dueDate: page.properties['Due Date']?.date?.start || undefined,
        clientName: page.properties['Client Name']?.rich_text?.[0]?.text?.content || '',
        clientId: page.properties['Client ID']?.rich_text?.[0]?.text?.content || undefined,
        createdAt: page.created_time,
        completedAt: page.properties['Completed At']?.date?.start || undefined,
      }))
    } catch (error) {
      console.error('Error fetching fulfillments from Notion:', error)
      return []
    }
  }

  static async createFulfillment(fulfillment: Omit<NotionFulfillment, 'id'>): Promise<NotionFulfillment | null> {
    if (!NOTION_DATABASES.FULFILLMENT) return null

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASES.FULFILLMENT },
        properties: {
          'Model Name': {
            title: [{ text: { content: fulfillment.modelName } }],
          },
          Status: {
            select: { name: fulfillment.status },
          },
          'Client Name': {
            rich_text: [{ text: { content: fulfillment.clientName } }],
          },
          ...(fulfillment.dueDate && {
            'Due Date': {
              date: { start: fulfillment.dueDate },
            },
          }),
          ...(fulfillment.clientId && {
            'Client ID': {
              rich_text: [{ text: { content: fulfillment.clientId } }],
            },
          }),
        },
      })

      return {
        id: response.id,
        ...fulfillment,
      }
    } catch (error) {
      console.error('Error creating fulfillment in Notion:', error)
      return null
    }
  }

  // Customer Success
  static async getCustomerSuccessTickets(): Promise<NotionCustomerSuccess[]> {
    if (!NOTION_DATABASES.CUSTOMER_SUCCESS) return []

    try {
      const response = await notion.databases.query({
        database_id: NOTION_DATABASES.CUSTOMER_SUCCESS,
        sorts: [
          {
            property: 'Created',
            direction: 'descending',
          },
        ],
      })

      return response.results.map((page: any) => ({
        id: page.id,
        ticketType: page.properties['Ticket Type']?.select?.name || 'Support',
        clientName: page.properties['Client Name']?.title?.[0]?.text?.content || '',
        clientId: page.properties['Client ID']?.rich_text?.[0]?.text?.content || undefined,
        status: page.properties.Status?.select?.name || 'Open',
        dueDate: page.properties['Due Date']?.date?.start || undefined,
        description: page.properties.Description?.rich_text?.[0]?.text?.content || '',
        assignedTo: page.properties['Assigned To']?.rich_text?.[0]?.text?.content || undefined,
        createdAt: page.created_time,
        resolvedAt: page.properties['Resolved At']?.date?.start || undefined,
      }))
    } catch (error) {
      console.error('Error fetching customer success tickets from Notion:', error)
      return []
    }
  }

  static async createCustomerSuccessTicket(ticket: Omit<NotionCustomerSuccess, 'id'>): Promise<NotionCustomerSuccess | null> {
    if (!NOTION_DATABASES.CUSTOMER_SUCCESS) return null

    try {
      const response = await notion.pages.create({
        parent: { database_id: NOTION_DATABASES.CUSTOMER_SUCCESS },
        properties: {
          'Client Name': {
            title: [{ text: { content: ticket.clientName } }],
          },
          'Ticket Type': {
            select: { name: ticket.ticketType },
          },
          Status: {
            select: { name: ticket.status },
          },
          Description: {
            rich_text: [{ text: { content: ticket.description } }],
          },
          ...(ticket.dueDate && {
            'Due Date': {
              date: { start: ticket.dueDate },
            },
          }),
          ...(ticket.clientId && {
            'Client ID': {
              rich_text: [{ text: { content: ticket.clientId } }],
            },
          }),
          ...(ticket.assignedTo && {
            'Assigned To': {
              rich_text: [{ text: { content: ticket.assignedTo } }],
            },
          }),
        },
      })

      return {
        id: response.id,
        ...ticket,
      }
    } catch (error) {
      console.error('Error creating customer success ticket in Notion:', error)
      return null
    }
  }

  // Activities
  static async createActivity(activity: Omit<NotionActivity, 'id'>): Promise<boolean> {
    if (!NOTION_DATABASES.ACTIVITIES) return false

    try {
      await notion.pages.create({
        parent: { database_id: NOTION_DATABASES.ACTIVITIES },
        properties: {
          Type: {
            select: { name: activity.type },
          },
          Description: {
            rich_text: [{ text: { content: activity.description } }],
          },
          Date: {
            date: { start: activity.date },
          },
          Entity: {
            rich_text: [{ text: { content: activity.entity } }],
          },
          'Entity Type': {
            select: { name: activity.entityType },
          },
          ...(activity.outcome && {
            Outcome: {
              select: { name: activity.outcome },
            },
          }),
        },
      })

      return true
    } catch (error) {
      console.error('Error creating activity in Notion:', error)
      return false
    }
  }
}

// Helper function to check if Notion integration is configured
export function isNotionConfigured(): boolean {
  return !!(
    process.env.NOTION_API_KEY &&
    (NOTION_DATABASES.TASKS || 
     NOTION_DATABASES.LEADS || 
     NOTION_DATABASES.COMPANIES || 
     NOTION_DATABASES.ACTIVITIES ||
     NOTION_DATABASES.CAMPAIGNS ||
     NOTION_DATABASES.FULFILLMENT ||
     NOTION_DATABASES.CUSTOMER_SUCCESS)
  )
}

// Export convenience functions
export const createTask = NotionAPI.createTask
export const createLead = NotionAPI.createLead
export const getTasks = NotionAPI.getTasks
export const getLeads = NotionAPI.getLeads
export const updateTask = NotionAPI.updateTask