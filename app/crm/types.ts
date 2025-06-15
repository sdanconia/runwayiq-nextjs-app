export interface Company {
  id: string;
  name: string;
  website?: string;
  linkedin?: string;
  address?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  title?: string;
  companyId?: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Archived';
  dueDate?: string;
  leadId?: string;
  companyId?: string;
  leadName?: string;
  companyName?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'company' | 'lead' | 'task';
  entityId: string;
  entityName?: string;
  description: string;
  timestamp: string;
}

export type View = 'companies' | 'leads' | 'tasks';

export interface CrmData {
  companies: Company[];
  leads: Lead[];
  tasks: Task[];
  activities: Activity[];
}