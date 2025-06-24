'use client'

import { useState } from 'react'
import { ExternalLink, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotionSetupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotionSetup({ isOpen, onClose }: NotionSetupProps) {
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const steps = [
    {
      title: 'Create Notion Integration',
      description: 'Set up a new integration in your Notion workspace',
      content: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Notion Integrations</a></li>
            <li>Click "New integration"</li>
            <li>Give it a name like "SalesFlow Dashboard"</li>
            <li>Select your workspace</li>
            <li>Copy the "Internal Integration Token"</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Create Notion Databases',
      description: 'Set up the required databases in your Notion workspace',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Create the following databases in Notion:</p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tasks Database</h4>
              <p className="text-sm text-muted-foreground mb-2">Properties to add:</p>
              <ul className="text-sm space-y-1">
                <li>• Title (Title)</li>
                <li>• Status (Select: To Do, In Progress, Done, Archived)</li>
                <li>• Priority (Select: High, Medium, Low)</li>
                <li>• Points (Number)</li>
                <li>• Due Date (Date)</li>
                <li>• Description (Text)</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Leads Database</h4>
              <p className="text-sm text-muted-foreground mb-2">Properties to add:</p>
              <ul className="text-sm space-y-1">
                <li>• Name (Title)</li>
                <li>• Email (Email)</li>
                <li>• Company (Text)</li>
                <li>• Status (Select)</li>
                <li>• Phone (Phone)</li>
                <li>• Title (Text)</li>
                <li>• LinkedIn (URL)</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Activities Database</h4>
              <p className="text-sm text-muted-foreground mb-2">Properties to add:</p>
              <ul className="text-sm space-y-1">
                <li>• Type (Select)</li>
                <li>• Description (Text)</li>
                <li>• Date (Date)</li>
                <li>• Entity (Text)</li>
                <li>• Entity Type (Select: task, lead, company)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Share Databases with Integration',
      description: 'Give your integration access to the databases',
      content: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open each database in Notion</li>
            <li>Click the "Share" button in the top right</li>
            <li>Click "Invite" and search for your integration name</li>
            <li>Select your integration and click "Invite"</li>
            <li>Copy the database ID from the URL (the long string after the last "/")</li>
          </ol>
        </div>
      )
    },
    {
      title: 'Configure Environment Variables',
      description: 'Add your credentials to the application',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create a <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env.local</code> file 
            in your project root with:
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`NOTION_API_KEY=your_integration_token_here
NOTION_TASKS_DATABASE_ID=your_tasks_database_id
NOTION_LEADS_DATABASE_ID=your_leads_database_id
NOTION_ACTIVITIES_DATABASE_ID=your_activities_database_id`}
          </pre>
          <p className="text-sm text-muted-foreground">
            Restart your development server after adding these variables.
          </p>
        </div>
      )
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Notion Integration Setup</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  index + 1 <= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}>
                  {index + 1 <= step ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-12 h-1 mx-2',
                    index + 1 < step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">{steps[step - 1].title}</h3>
              <span className="text-sm text-muted-foreground">
                Step {step} of {steps.length}
              </span>
            </div>
            <p className="text-muted-foreground mb-6">{steps[step - 1].description}</p>
            {steps[step - 1].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {step < steps.length ? (
                <button
                  onClick={() => setStep(Math.min(steps.length, step + 1))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Complete Setup
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}