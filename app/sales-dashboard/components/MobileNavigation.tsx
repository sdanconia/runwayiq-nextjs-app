'use client'

import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon: React.ElementType
}

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: any) => void
  tabs: Tab[]
}

export default function MobileNavigation({ activeTab, onTabChange, tabs }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <nav className="flex justify-around py-2 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-0 flex-1 max-w-[4rem]',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs font-medium truncate leading-tight">
                  {tab.label.replace("Today's ", "").replace("Customer ", "")}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}