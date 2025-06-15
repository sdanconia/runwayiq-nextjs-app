import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { caseStudies } from '@/lib/constants'
import { CaseStudy } from '@/lib/types'

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <CaseStudiesSection />
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
          Client Success Stories
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          See how we've helped post-seed startups validate PMF and accelerate their path to Series A.
        </p>
      </div>
    </section>
  )
}

function CaseStudiesSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        {caseStudies.length > 0 ? (
          <div className="space-y-16">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Case studies are being finalized. Contact us to learn about our client successes.
            </p>
            <Button className="mt-4" href="mailto:strategy@runwayiq.com">
              Request Case Studies
            </Button>
          </Card>
        )}
      </div>
    </section>
  )
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy
}

function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-video lg:aspect-square bg-muted">
          <Image
            src={caseStudy.imageUrl}
            alt={caseStudy.title}
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{caseStudy.title}</h2>
              <p className="text-lg font-medium text-primary">{caseStudy.clientName}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Challenge</h3>
              <p className="text-muted-foreground">{caseStudy.challenge}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Solution</h3>
              <p className="text-muted-foreground">{caseStudy.solution}</p>
            </div>

            {/* Results */}
            <div>
              <h3 className="font-semibold mb-4">Key Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="bg-muted/50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{result.value}</div>
                    <div className="text-sm font-medium">{result.metric}</div>
                    {result.improvement && (
                      <div className="text-xs text-muted-foreground">{result.improvement}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <div className="bg-muted/30 p-6 rounded-lg">
                <blockquote className="text-lg mb-4">"{caseStudy.testimonial.text}"</blockquote>
                <div>
                  <div className="font-semibold">{caseStudy.testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{caseStudy.testimonial.role}</div>
                </div>
              </div>
            )}

            <Button variant="outline">
              Read Full Story
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ClosingCTASection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
          Ready to write your success story?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join the startups already scaling with RunwayIQ's proven GTM methodology.
        </p>
        <div className="mt-8">
          <Button size="lg" href="mailto:strategy@runwayiq.com">
            Discuss Your GTM Goals
          </Button>
        </div>
      </div>
    </section>
  )
}