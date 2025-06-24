'use client'

import { useState, useEffect } from 'react'
import { Flame, Target } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatUserName } from '@/lib/supabase'

export default function WelcomeSection() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState('')
  
  // Show starter data for new users, real data for users with targets
  const hasData = user?.sales_target && user.sales_target > 0
  const [streak] = useState(hasData ? 7 : 0)
  const [dailyProgress] = useState({ 
    completed: hasData ? 12 : 0, 
    target: hasData ? 15 : 10 
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      let greeting = 'Good morning'
      
      if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon'
      } else if (hour >= 17) {
        greeting = 'Good evening'
      }
      
      setCurrentTime(greeting)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-2">
              {currentTime}, {user ? formatUserName(user) : 'there'}! 👋
            </h2>
            <p className="text-muted-foreground">
              Your RunwayIQ sales dashboard - driving growth through AI automation.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="font-bold text-lg">{streak} days</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-bold text-lg">
                  {dailyProgress.completed}/{dailyProgress.target}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">
              {Math.round((dailyProgress.completed / dailyProgress.target) * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(dailyProgress.completed / dailyProgress.target) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}