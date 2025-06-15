import Image from 'next/image'
import { Play } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { valuePropositions, podcastEpisodes } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <ValuePropositionsSection />
        <SocialProofSection />
        <PodcastTeaserSection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-pulse-bg" />
      
      {/* Animated SVG blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl font-heading">
              AI-Powered GTM That Gets You From Seed to Series A
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We automate outbound, validate PMF, and accelerate traction for post-seed startups.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" href="mailto:strategy@runwayiq.com">
                Book Strategy Call
              </Button>
              <Button variant="outline" size="lg" href="/case-studies">
                View Case Studies
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12">
              <p className="text-sm text-muted-foreground mb-4">Trusted by high-growth startups</p>
              <div className="flex items-center justify-center gap-8 lg:justify-start opacity-60">
                <div className="text-lg font-semibold">Transistor</div>
                <div className="text-lg font-semibold">Reform</div>
                <div className="text-lg font-semibold">TechScale</div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 animate-slide-in-up">
            <Image
              src="/hero-image.png"
              alt="AI-powered GTM illustration"
              width={800}
              height={800}
              className="relative rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ValuePropositionsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            The RunwayIQ Advantage
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Combining AI automation with strategic human insights for unprecedented growth
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {valuePropositions.map((prop) => (
            <Card key={prop.id} className="text-center hover" hover>
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <prop.IconComponent className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{prop.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{prop.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Results Column */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
              Results That Speak Volumes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our proven methodology delivers measurable outcomes for early-stage startups ready to scale.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={120} suffix="%" />
                </div>
                <p className="text-sm text-muted-foreground">Average Client Growth (YoY)</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={90} /> Days
                </div>
                <p className="text-sm text-muted-foreground">To First Measurable Impact</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  $<AnimatedCounter value={5} />M+
                </div>
                <p className="text-sm text-muted-foreground">In Follow-On Funding Facilitated</p>
              </div>
            </div>
          </div>

          {/* Testimonial Column */}
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <Image
                src="/hero-image.png"
                alt="Justin Jackson"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <blockquote className="text-lg">
                  &quot;RunwayIQ transformed our GTM strategy from guesswork to a predictable growth engine. Their AI-powered approach helped us identify our true ICP and scale systematically.&quot;
                </blockquote>
                <div className="mt-4">
                  <div className="font-semibold">Justin Jackson</div>
                  <div className="text-sm text-muted-foreground">Co-founder, Transistor</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

function PodcastTeaserSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            PMF Podcast: Industry Intelligence That Powers Our AI
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Exclusive conversations with founders, investors, and GTM experts that inform our AI models and strategic insights.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {podcastEpisodes.map((episode) => (
            <Card key={episode.id} className="overflow-hidden hover" hover>
              <div className="aspect-video bg-muted">
                <Image
                  src={episode.imageUrl}
                  alt={episode.title}
                  width={400}
                  height={225}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{episode.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {episode.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{episode.duration}</span>
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4 mr-1" />
                    Listen Now
                  </Button>
                </div>
                {episode.guest && (
                  <p className="text-sm font-medium mt-2">with {episode.guest}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" href="/podcast">
            Explore All Episodes
          </Button>
        </div>
      </div>
    </section>
  )
}
