'use client'

import { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, AlertTriangle, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, isAfter, differenceInDays } from 'date-fns'

interface FulfillmentItem {
  id: string
  modelName: string
  clientName: string
  status: 'Pending delivery' | 'Created but pending feedback' | 'Completed and hosted'
  dueDate?: string
  createdAt: string
  priority: 'High' | 'Medium' | 'Low'
}

interface FulfillmentCardProps {
  item: FulfillmentItem
  onStatusChange: (id: string, status: FulfillmentItem['status']) => void
}

function FulfillmentCard({ item, onStatusChange }: FulfillmentCardProps) {
  const getStatusColor = () => {
    switch (item.status) {
      case 'Pending delivery': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'Created but pending feedback': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Completed and hosted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    }
  }

  const getStatusIcon = () => {
    switch (item.status) {
      case 'Pending delivery': return <Clock className="h-4 w-4 text-red-600" />
      case 'Created but pending feedback': return <Package className="h-4 w-4 text-blue-600" />
      case 'Completed and hosted': return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const isOverdue = item.dueDate && isAfter(new Date(), new Date(item.dueDate))
  const daysUntilDue = item.dueDate ? differenceInDays(new Date(item.dueDate), new Date()) : null

  return (
    <div className={cn(
      'bg-card rounded-lg border p-6 transition-all hover:shadow-md',
      isOverdue && 'border-red-200 dark:border-red-800'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-lg">{item.modelName}</h3>
          {isOverdue && <AlertTriangle className="h-4 w-4 text-red-600" />}
        </div>
        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor())}>
          {item.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Client: {item.clientName}</span>
        </div>

        {item.dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span className={cn(
              isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
            )}>
              Due: {format(new Date(item.dueDate), 'MMM dd, yyyy')}
              {daysUntilDue !== null && (
                <span className="ml-2">
                  ({daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 
                    daysUntilDue === 0 ? 'Due today' : 
                    `${Math.abs(daysUntilDue)} days overdue`})
                </span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Created: {format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Update Status:
        </label>
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value as FulfillmentItem['status'])}
          className="w-full px-3 py-2 text-sm border rounded-lg bg-background"
        >
          <option value="Pending delivery">Pending delivery</option>
          <option value="Created but pending feedback">Created but pending feedback</option>
          <option value="Completed and hosted">Completed and hosted</option>
        </select>
      </div>
    </div>
  )
}

export default function FulfillmentTab() {
  const [fulfillmentItems, setFulfillmentItems] = useState<FulfillmentItem[]>([
    {
      id: '1',
      modelName: '3D Product Model - TechCorp',
      clientName: 'TechCorp Inc.',
      status: 'Pending delivery',
      dueDate: '2024-01-15',
      createdAt: '2024-01-01',
      priority: 'High'
    },
    {
      id: '2',
      modelName: 'AR Experience - StartupXYZ',
      clientName: 'StartupXYZ',
      status: 'Created but pending feedback',
      dueDate: '2024-01-20',
      createdAt: '2024-01-05',
      priority: 'Medium'
    },
    {
      id: '3',
      modelName: 'Virtual Showroom - ABC Corp',
      clientName: 'ABC Corporation',
      status: 'Completed and hosted',
      createdAt: '2023-12-15',
      priority: 'Low'
    },
    {
      id: '4',
      modelName: 'Interactive Demo - InnovateLab',
      clientName: 'InnovateLab',
      status: 'Pending delivery',
      dueDate: '2024-01-10',
      createdAt: '2023-12-20',
      priority: 'High'
    }
  ])

  const [filterStatus, setFilterStatus] = useState<'all' | FulfillmentItem['status']>('all')

  const handleStatusChange = (id: string, newStatus: FulfillmentItem['status']) => {
    setFulfillmentItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    )
  }

  const filteredItems = fulfillmentItems.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  )

  const overdueItems = fulfillmentItems.filter(item =>
    item.dueDate && isAfter(new Date(), new Date(item.dueDate))
  )

  const statusCounts = {
    pending: fulfillmentItems.filter(i => i.status === 'Pending delivery').length,
    feedback: fulfillmentItems.filter(i => i.status === 'Created but pending feedback').length,
    completed: fulfillmentItems.filter(i => i.status === 'Completed and hosted').length,
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Pending Delivery</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{statusCounts.pending}</p>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Pending Feedback</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{statusCounts.feedback}</p>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Completed</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Overdue</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{overdueItems.length}</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {overdueItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-800 dark:text-red-400">
              {overdueItems.length} Overdue Item{overdueItems.length > 1 ? 's' : ''}
            </h3>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            The following items are past their due date and need immediate attention:
          </p>
          <ul className="mt-2 text-sm text-red-700 dark:text-red-300">
            {overdueItems.map(item => (
              <li key={item.id} className="ml-4">
                • {item.modelName} - {item.clientName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Fulfillment Tracking</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1 text-sm border rounded-lg bg-background"
          >
            <option value="all">All Items</option>
            <option value="Pending delivery">Pending delivery</option>
            <option value="Created but pending feedback">Pending feedback</option>
            <option value="Completed and hosted">Completed</option>
          </select>
        </div>
      </div>

      {/* Fulfillment Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map(item => (
          <FulfillmentCard
            key={item.id}
            item={item}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No fulfillment items
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filterStatus === 'all' 
              ? "No fulfillment items found."
              : `No items with status "${filterStatus}".`
            }
          </p>
        </div>
      )}
    </div>
  )
}