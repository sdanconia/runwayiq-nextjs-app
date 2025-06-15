'use client';

import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Company, Lead, Task, Activity, View, CrmData } from '../types';
import {
  INITIAL_COMPANIES_DATA_KEY,
  INITIAL_LEADS_DATA_KEY,
  INITIAL_TASKS_DATA_KEY,
  INITIAL_ACTIVITIES_DATA_KEY,
  ACTIVITY_TYPES,
  ENTITY_TYPES
} from '../constants';
import { Button } from './common/Button';
import { BuildingIcon, UserIcon, CalendarIcon, SearchIcon } from './icons/icons';

export const CrmApp: React.FC = () => {
  const [companies, setCompanies] = useLocalStorage<Company[]>(INITIAL_COMPANIES_DATA_KEY, []);
  const [leads, setLeads] = useLocalStorage<Lead[]>(INITIAL_LEADS_DATA_KEY, []);
  const [tasks, setTasks] = useLocalStorage<Task[]>(INITIAL_TASKS_DATA_KEY, []);
  const [activities, setActivities] = useLocalStorage<Activity[]>(INITIAL_ACTIVITIES_DATA_KEY, []);
  const [currentView, setCurrentView] = useState<View>('companies');
  const [searchTerm, setSearchTerm] = useState('');

  const addActivity = (type: string, entityType: string, entityId: string, entityName: string, description: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: type as Activity['type'],
      entityType: entityType as Activity['entityType'],
      entityId,
      entityName,
      description,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const generateId = () => Date.now().toString();

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany: Company = {
      ...companyData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCompanies(prev => [...prev, newCompany]);
    addActivity(ACTIVITY_TYPES.CREATE, ENTITY_TYPES.COMPANY, newCompany.id, newCompany.name, `Created company: ${newCompany.name}`);
  };

  const filteredData = useMemo(() => {
    const filtered: { companies: Company[]; leads: Lead[]; tasks: Task[] } = {
      companies: [],
      leads: [],
      tasks: []
    };

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered.companies = companies.filter(c => 
        c.name.toLowerCase().includes(term) ||
        (c.website && c.website.toLowerCase().includes(term))
      );
      filtered.leads = leads.filter(l => 
        l.firstName.toLowerCase().includes(term) ||
        l.lastName.toLowerCase().includes(term) ||
        (l.email && l.email.toLowerCase().includes(term))
      );
      filtered.tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    } else {
      filtered.companies = companies;
      filtered.leads = leads;
      filtered.tasks = tasks;
    }

    return filtered;
  }, [companies, leads, tasks, searchTerm]);

  const currentData = filteredData[currentView];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex space-x-8 mb-8">
          <button
            onClick={() => setCurrentView('companies')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              currentView === 'companies'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BuildingIcon className="w-4 h-4 mr-2" />
            Companies ({companies.length})
          </button>
          <button
            onClick={() => setCurrentView('leads')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              currentView === 'leads'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setCurrentView('tasks')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              currentView === 'tasks'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Tasks ({tasks.length})
          </button>
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 capitalize">
                {currentView}
              </h2>
              <Button onClick={() => console.log('Add new', currentView)}>
                Add {currentView.slice(0, -1)}
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {currentData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm ? `No ${currentView} found matching "${searchTerm}"` : `No ${currentView} yet`}
                </div>
                {!searchTerm && (
                  <Button
                    className="mt-4"
                    onClick={() => console.log('Add first', currentView)}
                  >
                    Add your first {currentView.slice(0, -1)}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {currentView === 'companies' && (currentData as Company[]).map((company) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        {company.website && (
                          <p className="text-sm text-gray-500">{company.website}</p>
                        )}
                        {company.description && (
                          <p className="text-sm text-gray-600 mt-2">{company.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="danger" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentView === 'leads' && (currentData as Lead[]).map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </h3>
                        {lead.email && (
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        )}
                        {lead.title && lead.companyName && (
                          <p className="text-sm text-gray-600">{lead.title} at {lead.companyName}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="danger" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {currentView === 'tasks' && (currentData as Task[]).map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => console.log('Toggle task', task.id)}
                          className="mt-1"
                        />
                        <div>
                          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded ${
                              task.status === 'Done' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              task.status === 'Archived' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {task.status}
                            </span>
                            {task.dueDate && (
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="danger" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};