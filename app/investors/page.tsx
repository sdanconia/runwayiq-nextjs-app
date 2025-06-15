import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AnimatedCounter } from '@/components/ui/animated-counter'

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <MainContentSection />
        <ImpactMetricsSection />
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
          Investor Portal
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Exclusive access to high-potential startups in our acceleration program with proven GTM traction.
        </p>
      </div>
    </section>
  )
}

function MainContentSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Access Request */}
          <Card className="p-8">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl">Request Access</CardTitle>
              <p className="text-muted-foreground">
                Join our exclusive network of investors with early access to vetted, high-growth startups.
              </p>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Firm/Organization (Optional)</label>
                  <Input placeholder="Enter your firm name" />
                </div>
              </div>
              <Button className="w-full" size="lg">
                Request Verification
              </Button>
              <p className="text-xs text-muted-foreground">
                All investor applications are subject to verification and approval.
              </p>
            </CardContent>
          </Card>

          {/* Portfolio Highlights */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Portfolio Highlights</h2>
              <p className="text-muted-foreground mb-6">
                Current deal flow of validated startups ready for institutional investment.
              </p>
            </div>

            <div className="space-y-4">
              {portfolioCompanies.map((company) => (
                <Card key={company.id} className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{company.name}</h3>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {company.stage}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{company.sector}</p>
                    <p className="text-sm">{company.traction}</p>
                    <Button variant="outline" size="sm" disabled>
                      View Details (Requires Access)
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="ghost" disabled className="w-full">
              Investor Login (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ImpactMetricsSection() {
  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading">
            RunwayIQ Impact Metrics
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Track record of accelerating startups to institutional readiness
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="text-center p-8">
            <div className="text-4xl font-bold text-primary mb-2">
              <AnimatedCounter value={25} suffix="+" />
            </div>
            <p className="text-muted-foreground">Portfolio Companies Accelerated</p>
          </Card>
          
          <Card className="text-center p-8">
            <div className="text-4xl font-bold text-primary mb-2">
              <AnimatedCounter value={75} suffix="%" />
            </div>
            <p className="text-muted-foreground">Achieved PMF within 6 Months</p>
          </Card>
          
          <Card className="text-center p-8">
            <div className="text-4xl font-bold text-primary mb-2">
              $<AnimatedCounter value={10} />M+
            </div>
            <p className="text-muted-foreground">Total Follow-on Funding Raised</p>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" href="mailto:investors@runwayiq.com">
            Partner With Us
          </Button>
        </div>
      </div>
    </section>
  )
}

const portfolioCompanies = [
  {
    id: "1",
    name: "Company Alpha",
    stage: "Series A Ready",
    sector: "B2B SaaS",
    traction: "Key Traction: $500K ARR, 40% MoM growth"
  },
  {
    id: "2", 
    name: "Company Beta",
    stage: "Seed+",
    sector: "FinTech",
    traction: "Key Traction: 10K+ active users, $200K MRR"
  },
  {
    id: "3",
    name: "Company Gamma", 
    stage: "Series A Ready",
    sector: "AI/ML",
    traction: "Key Traction: $1M ARR, Fortune 500 customers"
  }
]