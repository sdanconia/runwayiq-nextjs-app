"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AICapability } from '@/lib/types'

interface AICapabilityAccordionProps {
  capabilities: AICapability[]
}

export function AICapabilityAccordion({ capabilities }: AICapabilityAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([capabilities[0]?.id])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-4">
      {capabilities.map((capability) => (
        <Card key={capability.id} className="overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleItem(capability.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{capability.title}</h3>
              {openItems.includes(capability.id) ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          
          {openItems.includes(capability.id) && (
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4">{capability.description}</p>
              <div className="flex flex-wrap gap-2">
                {capability.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-primary/10 text-primary px-2 py-1 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}