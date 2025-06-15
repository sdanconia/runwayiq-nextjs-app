import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { serviceTiers, aiCapabilities } from '@/lib/constants'
import { ServiceTierCard } from '@/components/service-tier-card'
import { AICapabilityAccordion } from '@/components/ai-capability-accordion'

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <ServiceTiersSection />
        <AICapabilitiesSection />
        <ClosingCTASection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-heading">
          Our Services
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Tailored GTM solutions that scale with your startup's growth journey from seed to Series A and beyond.
        </p>
      </div>
    </section>
  )
}

function ServiceTiersSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            Choose Your Growth Path
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From validation to scale, we have the right partnership model for your stage
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {serviceTiers.map((tier) => (
            <ServiceTierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AICapabilitiesSection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            AI Agent Capabilities
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our proprietary AI agents handle complex GTM tasks with human-level intelligence and machine-scale efficiency.
          </p>
        </div>

        <AICapabilityAccordion capabilities={aiCapabilities} />

        <div className="text-center mt-12">
          <Button size="lg" href="mailto:demo@runwayiq.com">
            See AI in Action
          </Button>
        </div>
      </div>
    </section>
  )
}

function ClosingCTASection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
          Ready to accelerate your GTM?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join the startups already scaling with RunwayIQ's AI-powered GTM engine.
        </p>
        <div className="mt-8">
          <Button size="lg" href="mailto:strategy@runwayiq.com">
            Book Your Free Strategy Call
          </Button>
        </div>
      </div>
    </section>
  )
}