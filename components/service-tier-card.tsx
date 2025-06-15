import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceTier } from '@/lib/types'

interface ServiceTierCardProps {
  tier: ServiceTier
}

export function ServiceTierCard({ tier }: ServiceTierCardProps) {
  return (
    <Card className={`relative p-6 ${tier.isPopular ? 'ring-2 ring-primary' : ''}`}>
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">
            Popular
          </span>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{tier.price}</span>
          {tier.duration && (
            <span className="text-muted-foreground">/ {tier.duration}</span>
          )}
        </div>
        <p className="text-muted-foreground">{tier.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          className="w-full" 
          variant={tier.isPopular ? "primary" : "outline"}
          href="mailto:strategy@runwayiq.com"
        >
          {tier.cta}
        </Button>
      </CardContent>
    </Card>
  )
}