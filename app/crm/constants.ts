export const INITIAL_COMPANIES_DATA_KEY = 'crm_companies';
export const INITIAL_LEADS_DATA_KEY = 'crm_leads';
export const INITIAL_TASKS_DATA_KEY = 'crm_tasks';
export const INITIAL_ACTIVITIES_DATA_KEY = 'crm_activities';

export const TASK_STATUSES = ['To Do', 'In Progress', 'Done', 'Archived'] as const;

export const ACTIVITY_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
} as const;

export const ENTITY_TYPES = {
  COMPANY: 'company',
  LEAD: 'lead',
  TASK: 'task'
} as const;