'use client'

import Image from 'next/image'
import { Crown, Medal, Award, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { formatUserName, getAvatarUrl } from '@/lib/supabase'

interface TeamMemberProps {
  rank: number
  name: string
  points: number
  avatar?: string
  isCurrentUser?: boolean
}

function TeamMember({ rank, name, points, avatar, isCurrentUser }: TeamMemberProps) {
  const getRankIcon = () => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />
      case 2: return <Medal className="h-5 w-5 text-gray-400" />
      case 3: return <Award className="h-5 w-5 text-orange-600" />
      default: return null
    }
  }

  const getRankBadge = () => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
      case 3: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }
  }

  return (
    <div className={cn(
      'flex items-center justify-between p-4 rounded-lg border transition-all',
      isCurrentUser 
        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' 
        : 'bg-card hover:shadow-sm'
    )}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
            getRankBadge()
          )}>
            {rank <= 3 ? getRankIcon() : rank}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            {avatar ? (
              <Image src={avatar} alt={name} width={40} height={40} className="w-10 h-10 rounded-full" />
            ) : (
              <User className="h-5 w-5 text-white" />
            )}
          </div>
          
          <div>
            <p className={cn(
              'font-medium',
              isCurrentUser && 'text-blue-700 dark:text-blue-300'
            )}>
              {name} {isCurrentUser && '(You)'}
            </p>
            <p className="text-sm text-muted-foreground">
              {rank === 1 ? 'Team Leader' : 
               rank <= 3 ? 'Top Performer' : 
               'Sales Rep'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-lg">{points.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">points</p>
      </div>
    </div>
  )
}

interface TeamStatsProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
}

function TeamStats({ title, value, change, icon: Icon }: TeamStatsProps) {
  const isPositive = change >= 0
  
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <div className={cn(
          'flex items-center gap-1 text-sm',
          isPositive ? 'text-green-600' : 'text-red-600'
        )}>
          <TrendingUp className={cn('h-4 w-4', !isPositive && 'rotate-180')} />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}

export default function TeamTab() {
  const { user } = useAuth()

  // For new users, show mostly empty team with just the current user
  const teamMembers = user ? [
    { rank: 1, name: formatUserName(user), points: 0, isCurrentUser: true, avatar: user.avatar_url },
    // Add some sample team members only if the user has data
    ...(user.sales_target && user.sales_target > 0 ? [
      { rank: 2, name: 'Sarah Johnson', points: 3250, isCurrentUser: false },
      { rank: 3, name: 'Mike Rodriguez', points: 2380, isCurrentUser: false },
      { rank: 4, name: 'Emily Chen', points: 2120, isCurrentUser: false },
    ] : [])
  ] : []

  // Show starter/empty stats for new users
  const teamStats = [
    {
      title: 'Team Revenue',
      value: user?.sales_target && user.sales_target > 0 ? '$1.2M' : '$0',
      change: user?.sales_target && user.sales_target > 0 ? 12.5 : 0,
      icon: TrendingUp
    },
    {
      title: 'Avg. Points',
      value: user?.sales_target && user.sales_target > 0 ? '2,144' : '0',
      change: user?.sales_target && user.sales_target > 0 ? 8.3 : 0,
      icon: Award
    },
    {
      title: 'Team Calls',
      value: user?.sales_target && user.sales_target > 0 ? '1,840' : '0',
      change: user?.sales_target && user.sales_target > 0 ? 15.7 : 0,
      icon: TrendingUp
    },
    {
      title: 'Deals Closed',
      value: user?.sales_target && user.sales_target > 0 ? '156' : '0',
      change: user?.sales_target && user.sales_target > 0 ? 22.1 : 0,
      icon: Medal
    }
  ]

  const currentUser = teamMembers.find(m => m.isCurrentUser)

  return (
    <div className="space-y-6">
      {/* Current User Highlight */}
      {currentUser && (
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Your Ranking</h2>
                <p className="text-blue-100">
                  You're currently #{currentUser.rank} on the leaderboard!
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentUser.points.toLocaleString()}</div>
                <div className="text-blue-100">points</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-sm text-blue-100">
                {currentUser.rank === 1 
                  ? "Amazing! You're leading the team! 🎉"
                  : currentUser.rank <= 3
                  ? `Great job! You're ${teamMembers[0].points - currentUser.points} points away from 1st place.`
                  : `Keep pushing! You're ${teamMembers[currentUser.rank - 2].points - currentUser.points} points away from moving up.`
                }
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Team Stats */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {teamStats.map((stat) => (
            <TeamStats key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Team Leaderboard</h3>
          <div className="text-sm text-muted-foreground">
            Updated live
          </div>
        </div>
        
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </section>

      {/* Team Achievement */}
      <section>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-green-100 dark:border-green-800/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold">Team Achievement Unlocked!</h4>
              <p className="text-sm text-muted-foreground">Monthly Revenue Target Exceeded</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Congratulations! Your team has exceeded the monthly revenue target by 15%. 
            Everyone gets a 100-point bonus! 🎉
          </p>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">$1.2M</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">115%</div>
              <div className="text-xs text-muted-foreground">Of Target</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">+100</div>
              <div className="text-xs text-muted-foreground">Bonus Points</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}