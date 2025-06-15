import Image from 'next/image'
import { Linkedin } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { teamMembers } from '@/lib/constants'
import { TeamMember } from '@/lib/types'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <MissionSection />
        <CoreValuesSection />
        <TeamSection />
        <DifferentiatorsSection />
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
          About RunwayIQ
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          We are your dedicated GTM partners, combining cutting-edge AI with deep startup expertise to accelerate your path from seed to Series A.
        </p>
      </div>
    </section>
  )
}

function MissionSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-video bg-muted rounded-lg">
            <Image
              src="/hero-image.png"
              alt="Team collaborating"
              width={600}
              height={400}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              We believe every promising startup deserves a predictable path to growth. Too many exceptional founders struggle with GTM execution, burning through runway before finding product-market fit.
            </p>
            <p className="text-lg text-muted-foreground mt-4">
              RunwayIQ was founded to change that. We combine proprietary AI agents with battle-tested GTM frameworks to help post-seed startups validate PMF and build scalable growth engines that attract Series A investment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CoreValuesSection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            Our Core Values
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value) => (
            <Card key={value.id} className="text-center p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            Meet the Experts
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Industry veterans with deep startup and GTM expertise
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface TeamMemberCardProps {
  member: TeamMember
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="text-center p-6">
      <div className="space-y-4">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full">
          <Image
            src={member.imageUrl}
            alt={member.name}
            width={96}
            height={96}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{member.name}</h3>
          <p className="text-primary font-medium">{member.role}</p>
        </div>
        <p className="text-sm text-muted-foreground">{member.bio}</p>
        {member.linkedinUrl && (
          <Button variant="ghost" size="sm" href={member.linkedinUrl}>
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </Button>
        )}
      </div>
    </Card>
  )
}

function DifferentiatorsSection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            Why We're Different
          </h2>
        </div>

        <div className="space-y-8">
          {differentiators.map((diff) => (
            <div key={diff.id} className="text-center">
              <h3 className="font-semibold text-lg mb-3">{diff.title}</h3>
              <p className="text-muted-foreground">{diff.description}</p>
            </div>
          ))}
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
          Join Forces With RunwayIQ
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Ready to transform your GTM strategy and accelerate your path to Series A?
        </p>
        <div className="mt-8">
          <Button size="lg" href="mailto:strategy@runwayiq.com">
            Book a Strategy Call
          </Button>
        </div>
      </div>
    </section>
  )
}

const coreValues = [
  {
    id: "founder-obsessed",
    title: "Founder-Obsessed",
    description: "Every decision we make starts with what's best for the founder and their mission."
  },
  {
    id: "ai-driven",
    title: "AI-Driven Innovation", 
    description: "We leverage cutting-edge AI to solve GTM challenges at unprecedented scale and precision."
  },
  {
    id: "transparency",
    title: "Radical Transparency",
    description: "Full visibility into our processes, results, and methodologies. No black boxes."
  },
  {
    id: "velocity",
    title: "Velocity & Validation",
    description: "Move fast, test everything, and let data drive decisions. Speed with purpose."
  }
]

const differentiators = [
  {
    id: "proprietary-ai",
    title: "Proprietary AI Technology",
    description: "Our AI agents are trained specifically for B2B GTM, delivering results that generic tools simply cannot match."
  },
  {
    id: "seed-series-a",
    title: "Seed to Series A Focus",
    description: "We exclusively work with post-seed startups, understanding the unique challenges of this critical growth stage."
  },
  {
    id: "integrated-expertise", 
    title: "Integrated Expertise",
    description: "Unlike agencies that focus on single channels, we provide end-to-end GTM strategy, execution, and optimization."
  }
]