import { NextRequest, NextResponse } from 'next/server'
import { NotionAPI, isNotionConfigured, NotionTask } from '@/lib/notion'
import { validateTaskTitle, validateTaskPriority, validatePoints, sanitizeString, createRateLimiter } from '@/lib/validation'
import { APIResponse, TasksResponse } from '@/lib/types/dashboard'

// Rate limiter: 60 requests per minute per IP
const rateLimiter = createRateLimiter(60 * 1000, 60)

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') ||
         'unknown'
}

export async function GET(request: NextRequest): Promise<NextResponse<APIResponse<TasksResponse>>> {
  const clientIP = getClientIP(request)
  
  if (!rateLimiter(clientIP)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const tasks = await NotionAPI.getTasks()
    return NextResponse.json({ 
      success: true,
      data: { tasks }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch tasks. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<{ task: NotionTask }>>> {
  const clientIP = getClientIP(request)
  
  if (!rateLimiter(clientIP)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  if (!isNotionConfigured()) {
    return NextResponse.json(
      { error: 'Notion integration not configured' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    
    // Validate and sanitize input
    const sanitizedTitle = sanitizeString(body.title || '')
    const sanitizedDescription = sanitizeString(body.description || '')
    
    // Validate required fields
    const titleValidation = validateTaskTitle(sanitizedTitle)
    if (!titleValidation.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: titleValidation.errors[0]?.message || 'Invalid task title' 
        },
        { status: 400 }
      )
    }
    
    const priorityValidation = validateTaskPriority(body.priority || 'medium')
    if (!priorityValidation.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: priorityValidation.errors[0]?.message || 'Invalid priority' 
        },
        { status: 400 }
      )
    }
    
    const pointsValidation = validatePoints(body.points || 0)
    if (!pointsValidation.isValid) {
      return NextResponse.json(
        { 
          success: false,
          error: pointsValidation.errors[0]?.message || 'Invalid points value' 
        },
        { status: 400 }
      )
    }
    
    const taskData: Omit<NotionTask, 'id'> = {
      title: sanitizedTitle,
      status: body.status || 'To Do',
      priority: body.priority || 'Medium',
      points: body.points || 0,
      completed: body.completed || false,
      description: sanitizedDescription,
      dueDate: body.dueDate || undefined,
    }
    
    const createdTask = await NotionAPI.createTask(taskData)
    
    if (!createdTask) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create task in Notion' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data: { task: createdTask }
    })
  } catch (error) {
    console.error('Error creating task:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create task. Please try again later.' 
      },
      { status: 500 }
    )
  }
}