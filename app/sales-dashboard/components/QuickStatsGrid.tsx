'use client'

import { DollarSign, Phone, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  color: string
}

function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const isPositive = change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  
  return (
    <div className="bg-card rounded-lg border p-6 hover:shadow-lg hover:scale-105 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          isPositive ? 'text-emerald-600' : 'text-red-600'
        }`}>
          <TrendIcon className="h-4 w-4" />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-bold font-heading mt-1">{value}</p>
      </div>
    </div>
  )
}

export default function QuickStatsGrid() {
  const { user } = useAuth()
  
  // Show empty stats for new users, populated stats for users with targets
  const hasData = user?.sales_target && user.sales_target > 0
  
  const stats = [
    {
      title: 'Daily Revenue',
      value: hasData ? '$12,450' : '$0',
      change: hasData ? 15.3 : 0,
      icon: DollarSign,
      color: 'bg-primary'
    },
    {
      title: 'Calls Made',
      value: hasData ? '28' : '0',
      change: hasData ? 8.2 : 0,
      icon: Phone,
      color: 'bg-primary'
    },
    {
      title: 'Demos Booked',
      value: hasData ? '6' : '0',
      change: hasData ? 12.5 : 0,
      icon: Calendar,
      color: 'bg-primary'
    },
    {
      title: 'Pipeline Value',
      value: hasData ? '$245K' : '$0',
      change: hasData ? -2.1 : 0,
      icon: TrendingUp,
      color: 'bg-primary'
    }
  ]

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  )
}