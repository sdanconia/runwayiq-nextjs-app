'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Phone, Mail, MessageSquare, Target, Award, Calendar, Users } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  color: string
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change !== undefined && (
          <div className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data - replace with real data from Notion
  const topFunnelData = [
    { name: 'Calls Made', value: 156, target: 200, color: '#3B82F6' },
    { name: 'Emails Sent', value: 89, target: 100, color: '#10B981' },
    { name: 'LinkedIn DMs', value: 34, target: 50, color: '#8B5CF6' },
    { name: 'Tasks Completed', value: 67, target: 80, color: '#F59E0B' },
  ]

  const outcomeData = [
    { name: 'No answer', value: 45, color: '#94A3B8' },
    { name: 'Not interested', value: 23, color: '#EF4444' },
    { name: 'Speak later', value: 18, color: '#F59E0B' },
    { name: 'Later follow-up', value: 15, color: '#8B5CF6' },
    { name: 'Booked demo', value: 12, color: '#10B981' },
    { name: 'Wants material', value: 8, color: '#3B82F6' },
  ]

  const revenueData = [
    { week: 'W1', revenue: 25000, goal: 30000 },
    { week: 'W2', revenue: 32000, goal: 30000 },
    { week: 'W3', revenue: 28000, goal: 30000 },
    { week: 'W4', revenue: 35000, goal: 30000 },
  ]

  const conversionFunnel = [
    { stage: 'Leads', count: 250, color: '#3B82F6' },
    { stage: 'Contacted', count: 180, color: '#10B981' },
    { stage: 'Qualified', count: 120, color: '#F59E0B' },
    { stage: 'Demo Booked', count: 45, color: '#8B5CF6' },
    { stage: 'Demo Completed', count: 38, color: '#EC4899' },
    { stage: 'Proposal Sent', count: 25, color: '#EF4444' },
    { stage: 'Closed Won', count: 12, color: '#059669' },
  ]

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Sales Analytics</h2>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Funnel Metrics */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Top Funnel Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Calls Made"
            value={156}
            change={12.5}
            icon={Phone}
            color="bg-blue-500"
          />
          <MetricCard
            title="Emails Sent"
            value={89}
            change={-5.2}
            icon={Mail}
            color="bg-green-500"
          />
          <MetricCard
            title="LinkedIn DMs"
            value={34}
            change={18.3}
            icon={MessageSquare}
            color="bg-purple-500"
          />
          <MetricCard
            title="Task Completion"
            value="84%"
            change={7.1}
            icon={Target}
            color="bg-orange-500"
          />
        </div>

        {/* Activity vs Target Chart */}
        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Activity vs Targets</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topFunnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" name="Actual" />
              <Bar dataKey="target" fill="#E5E7EB" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Mid Funnel & Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Conversion Funnel</h4>
          <div className="space-y-3">
            {conversionFunnel.map((stage, index) => {
              const percentage = index === 0 ? 100 : Math.round((stage.count / conversionFunnel[0].count) * 100)
              return (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: stage.color }} />
                    <span className="text-sm font-medium">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                    <span className="font-bold">{stage.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Outcome Breakdown */}
        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Call Outcomes</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={outcomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {outcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {outcomeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs">{item.name}</span>
                <span className="text-xs font-medium ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Metrics */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Revenue Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            title="Monthly Revenue"
            value="$120K"
            change={15.2}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <MetricCard
            title="Avg Deal Size"
            value="$10K"
            change={-3.1}
            icon={Award}
            color="bg-blue-500"
          />
          <MetricCard
            title="Win Rate"
            value="32%"
            change={8.7}
            icon={Target}
            color="bg-purple-500"
          />
        </div>

        {/* Revenue Trend */}
        <div className="bg-card rounded-lg border p-6">
          <h4 className="font-semibold mb-4">Weekly Revenue vs Goal</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="goal" stroke="#94A3B8" strokeDasharray="5 5" name="Goal" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick Stats Summary */}
      <section>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800/20">
          <h3 className="font-bold text-lg mb-4">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">Total Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Demos Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-muted-foreground">Deals Closed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">$80K</div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}