# Notion Integration Setup for SalesFlow Dashboard

The SalesFlow dashboard now includes seamless integration with Notion for task management and CRM functionality. Follow these steps to set up the integration.

## Quick Setup

1. **Access the Setup Guide**: Visit `/sales-dashboard` and click "Setup Notion" in the tasks section
2. **Follow the Interactive Guide**: The dashboard includes a step-by-step setup wizard
3. **Configure Environment Variables**: Add your credentials to `.env.local`
4. **Start Syncing**: Your Notion tasks and leads will sync automatically

## Manual Setup

### 1. Create Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name it "SalesFlow Dashboard"
4. Select your workspace
5. Copy the "Internal Integration Token"

### 2. Create Required Databases

Create these databases in your Notion workspace:

#### Tasks Database
Properties:
- **Title** (Title) - Task name
- **Status** (Select) - To Do, In Progress, Done, Archived
- **Priority** (Select) - High, Medium, Low
- **Points** (Number) - Gamification points
- **Due Date** (Date) - Optional due date
- **Description** (Text) - Task details

#### Leads Database
Properties:
- **Name** (Title) - Lead name
- **Email** (Email) - Contact email
- **Company** (Text) - Company name
- **Status** (Select) - Lead status
- **Phone** (Phone) - Contact number
- **Title** (Text) - Job title
- **LinkedIn** (URL) - LinkedIn profile

#### Activities Database
Properties:
- **Type** (Select) - Activity type
- **Description** (Text) - Activity details
- **Date** (Date) - Activity date
- **Entity** (Text) - Related entity name
- **Entity Type** (Select) - task, lead, company

### 3. Share Databases with Integration

For each database:
1. Click "Share" button
2. Click "Invite"
3. Search for your integration name
4. Select and invite
5. Copy database ID from URL

### 4. Configure Environment Variables

Create `.env.local` in your project root:

```env
NOTION_API_KEY=your_integration_token_here
NOTION_TASKS_DATABASE_ID=your_tasks_database_id
NOTION_LEADS_DATABASE_ID=your_leads_database_id
NOTION_ACTIVITIES_DATABASE_ID=your_activities_database_id
```

### 5. Restart and Test

1. Restart your development server
2. Visit `/sales-dashboard`
3. You should see "Notion Connected" status
4. Click "Sync" to pull data from Notion

## Features

### Task Management
- ✅ Real-time task sync with Notion
- ✅ Complete tasks directly in dashboard
- ✅ Automatic activity logging
- ✅ Priority and points tracking
- ✅ Fallback to local storage when disconnected

### CRM Integration
- ✅ Lead management through Notion
- ✅ Activity tracking and logging
- ✅ Cross-platform data access
- ✅ Seamless backup and recovery

### Dashboard Features
- ✅ Live sync status indicators
- ✅ Error handling and user feedback
- ✅ Manual sync controls
- ✅ Setup wizard for easy configuration

## Troubleshooting

### "Notion integration not configured"
- Check your `.env.local` file exists
- Verify all environment variables are set
- Restart your development server

### "Failed to fetch tasks"
- Ensure your integration has access to the databases
- Check database IDs are correct
- Verify your Notion API key is valid

### Tasks not updating
- Check your internet connection
- Verify Notion workspace permissions
- Try manual sync button

## API Endpoints

The integration adds these API endpoints:

- `GET /api/notion/tasks` - Fetch all tasks
- `POST /api/notion/tasks` - Create new task
- `PATCH /api/notion/tasks/[id]` - Update task
- `GET /api/notion/leads` - Fetch all leads
- `POST /api/notion/leads` - Create new lead
- `POST /api/notion/activities` - Log activity

## Security

- All Notion credentials are stored securely in environment variables
- API keys are never exposed to the client
- All API calls are server-side only
- Integration follows Notion's security best practices

Your SalesFlow dashboard is now fully integrated with Notion for seamless task and CRM management!