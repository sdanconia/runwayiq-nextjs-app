'use client'

import { useState } from 'react'
import { Plus, Calendar, User, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, isAfter } from 'date-fns'

interface CustomerTicket {
  id: string
  ticketType: 'Support' | 'Check-in' | 'Follow-up' | 'Issue'
  clientName: string
  status: 'Open' | 'In Progress' | 'Completed'
  description: string
  dueDate?: string
  assignedTo: string
  createdAt: string
  priority: 'High' | 'Medium' | 'Low'
}

interface TicketCardProps {
  ticket: CustomerTicket
  onStatusChange: (id: string, status: CustomerTicket['status']) => void
  onEdit: (ticket: CustomerTicket) => void
}

function TicketCard({ ticket, onStatusChange, onEdit }: TicketCardProps) {
  const getStatusColor = () => {
    switch (ticket.status) {
      case 'Open': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    }
  }

  const getTypeColor = () => {
    switch (ticket.ticketType) {
      case 'Support': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'Check-in': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Follow-up': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'Issue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
  }

  const getPriorityColor = () => {
    switch (ticket.priority) {
      case 'High': return 'border-l-red-500'
      case 'Medium': return 'border-l-yellow-500'
      case 'Low': return 'border-l-green-500'
    }
  }

  const isOverdue = ticket.dueDate && isAfter(new Date(), new Date(ticket.dueDate))

  return (
    <div className={cn(
      'bg-card rounded-lg border-l-4 border p-6 transition-all hover:shadow-md',
      getPriorityColor(),
      isOverdue && 'bg-red-50 dark:bg-red-950/20'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{ticket.clientName}</h3>
          {isOverdue && <AlertCircle className="h-4 w-4 text-red-600" />}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getTypeColor())}>
            {ticket.ticketType}
          </span>
          <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusColor())}>
            {ticket.status}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Assigned to: {ticket.assignedTo}</span>
        </div>

        {ticket.dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span className={cn(
              isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
            )}>
              Due: {format(new Date(ticket.dueDate), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Created: {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <select
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value as CustomerTicket['status'])}
          className="px-3 py-1 text-sm border rounded-lg bg-background"
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          onClick={() => onEdit(ticket)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  )
}

interface NewTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (ticket: Omit<CustomerTicket, 'id' | 'createdAt'>) => void
}

function NewTicketModal({ isOpen, onClose, onSubmit }: NewTicketModalProps) {
  const [formData, setFormData] = useState({
    ticketType: 'Support' as CustomerTicket['ticketType'],
    clientName: '',
    status: 'Open' as CustomerTicket['status'],
    description: '',
    dueDate: '',
    assignedTo: '',
    priority: 'Medium' as CustomerTicket['priority'],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      ticketType: 'Support',
      clientName: '',
      status: 'Open',
      description: '',
      dueDate: '',
      assignedTo: '',
      priority: 'Medium',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">New Customer Success Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Client Name</label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ticket Type</label>
            <select
              value={formData.ticketType}
              onChange={(e) => setFormData({ ...formData, ticketType: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="Support">Support</option>
              <option value="Check-in">Check-in</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Issue">Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              placeholder="Describe the ticket details"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assigned To</label>
            <input
              type="text"
              required
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
              placeholder="Assign to team member"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CustomerSuccessTab() {
  const [tickets, setTickets] = useState<CustomerTicket[]>([
    {
      id: '1',
      ticketType: 'Support',
      clientName: 'TechCorp Inc.',
      status: 'Open',
      description: 'Client needs help with model integration into their website',
      dueDate: '2024-01-20',
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-10',
      priority: 'High'
    },
    {
      id: '2',
      ticketType: 'Check-in',
      clientName: 'StartupXYZ',
      status: 'In Progress',
      description: 'Monthly check-in call to discuss satisfaction and future needs',
      dueDate: '2024-01-15',
      assignedTo: 'Mike Rodriguez',
      createdAt: '2024-01-08',
      priority: 'Medium'
    },
    {
      id: '3',
      ticketType: 'Follow-up',
      clientName: 'ABC Corporation',
      status: 'Completed',
      description: 'Follow up on recent project delivery and gather feedback',
      assignedTo: 'Emily Chen',
      createdAt: '2024-01-05',
      priority: 'Low'
    },
    {
      id: '4',
      ticketType: 'Issue',
      clientName: 'InnovateLab',
      status: 'Open',
      description: 'Urgent: Model not displaying correctly on mobile devices',
      dueDate: '2024-01-12',
      assignedTo: 'David Wilson',
      createdAt: '2024-01-11',
      priority: 'High'
    }
  ])

  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | CustomerTicket['status']>('all')
  const [filterType, setFilterType] = useState<'all' | CustomerTicket['ticketType']>('all')

  const handleStatusChange = (id: string, newStatus: CustomerTicket['status']) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      )
    )
  }

  const handleCreateTicket = (newTicket: Omit<CustomerTicket, 'id' | 'createdAt'>) => {
    const ticket: CustomerTicket = {
      ...newTicket,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTickets(prev => [ticket, ...prev])
  }

  const handleEditTicket = (ticket: CustomerTicket) => {
    console.log('Edit ticket:', ticket)
    // Implement edit functionality
  }

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus
    const typeMatch = filterType === 'all' || ticket.ticketType === filterType
    return statusMatch && typeMatch
  })

  const statusCounts = {
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    completed: tickets.filter(t => t.status === 'Completed').length,
  }

  const overdueTickets = tickets.filter(ticket =>
    ticket.dueDate && isAfter(new Date(), new Date(ticket.dueDate)) && ticket.status !== 'Completed'
  )

  return (
    <div className="space-y-6">
      {/* Header with Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Open Tickets</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{statusCounts.open}</p>
        </div>

        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">In Progress</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</p>
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
            <Calendar className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold">Overdue</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{overdueTickets.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Customer Success</h2>
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1 text-sm border rounded-lg bg-background"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1 text-sm border rounded-lg bg-background"
            >
              <option value="all">All Types</option>
              <option value="Support">Support</option>
              <option value="Check-in">Check-in</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Issue">Issue</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onStatusChange={handleStatusChange}
            onEdit={handleEditTicket}
          />
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No customer success tickets match your current filters.
          </p>
        </div>
      )}

      {/* New Ticket Modal */}
      <NewTicketModal
        isOpen={showNewTicketModal}
        onClose={() => setShowNewTicketModal(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  )
}