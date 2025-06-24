import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { NotionLead, createLead } from '@/lib/notion'

interface CSVLead {
  'Full Name': string
  'Email': string
  'Phone'?: string
  'Company'?: string
  'Title'?: string
  'LinkedIn URL'?: string
  'Campaign'?: string
  'Status'?: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file content
    const content = await file.text()
    
    // Parse CSV
    let records: CSVLead[]
    try {
      records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid CSV format' },
        { status: 400 }
      )
    }

    // Validate and transform data
    const leads: NotionLead[] = []
    const errors: string[] = []

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const rowNum = i + 2 // Account for header row

      // Validate required fields
      if (!record['Full Name'] || !record['Email']) {
        errors.push(`Row ${rowNum}: Missing required fields (Full Name, Email)`)
        continue
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(record['Email'])) {
        errors.push(`Row ${rowNum}: Invalid email format`)
        continue
      }

      // Transform to Notion lead format
      const lead: NotionLead = {
        fullName: record['Full Name'],
        email: record['Email'],
        phone: record['Phone'] || '',
        company: record['Company'] || '',
        title: record['Title'] || '',
        linkedinUrl: record['LinkedIn URL'] || '',
        status: (record['Status'] as any) || 'New',
        campaign: record['Campaign'] || '',
        source: 'Google Sheets Import',
        assignedTo: '', // Will be set to current user
        priority: 'Medium',
        notes: `Imported from CSV on ${new Date().toLocaleDateString()}`,
      }

      leads.push(lead)
    }

    // Return errors if validation failed
    if (errors.length > 0 && leads.length === 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      )
    }

    // Create leads in Notion
    const createdLeads = []
    const creationErrors = []

    for (const lead of leads) {
      try {
        const notionLead = await createLead(lead)
        if (notionLead) {
          createdLeads.push(notionLead)
          
          // Create initial tasks for each lead
          if (notionLead.id) {
            await createInitialTasks(notionLead.id, lead.fullName, lead.campaign || 'General')
          }
        }
      } catch (error) {
        console.error('Error creating lead:', error)
        creationErrors.push(`Failed to create lead: ${lead.fullName}`)
      }
    }

    return NextResponse.json({
      success: true,
      count: createdLeads.length,
      errors: [...errors, ...creationErrors],
      message: `Successfully imported ${createdLeads.length} leads${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create initial tasks for a new lead
async function createInitialTasks(leadId: string, leadName: string, campaign: string) {
  const initialTasks = [
    {
      title: `Research ${leadName} and their company`,
      status: 'To Do' as const,
      priority: 'High' as const,
      points: 10,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      completed: false,
      description: `Research ${leadName} and their company background for ${campaign} campaign`,
      leadId,
      leadName,
      taskType: 'Call' as const,
    },
    {
      title: `Send initial outreach email to ${leadName}`,
      status: 'To Do' as const,
      priority: 'High' as const,
      points: 15,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      completed: false,
      description: `Send personalized outreach email to ${leadName} for ${campaign} campaign`,
      leadId,
      leadName,
      taskType: 'Email' as const,
    },
    {
      title: `Follow up with ${leadName} if no response`,
      status: 'To Do' as const,
      priority: 'Medium' as const,
      points: 10,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
      completed: false,
      description: `Follow up email to ${leadName} if no response to initial outreach`,
      leadId,
      leadName,
      taskType: 'Email' as const,
    },
  ]

  // Import createTask function and create tasks
  try {
    const { createTask } = await import('@/lib/notion')
    
    for (const task of initialTasks) {
      await createTask(task)
    }
  } catch (error) {
    console.error('Error creating initial tasks:', error)
  }
}