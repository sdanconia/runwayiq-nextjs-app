import Image from 'next/image';
// 'Handshake' import has been removed as it was unused.
import { ShieldCheck, Rocket, BarChart, Users, Target } from 'lucide-react';

// --- File Paths ---
const logoPath = '/runwayiq-logo.ico'; 
const heroImagePath = '/hero-image.png';

// --- Main Page Component ---
export default function HomePage() {
  return (
    <div className="bg-slate-900 text-slate-300 font-sans">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Pricing />
        <Investors />
      </main>
      <Footer />
    </div>
  );
}

// --- Header Component ---
const Header = () => (
  <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md">
    <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
      <a href="#home" className="flex items-center gap-2">
        <Image src={logoPath} alt="RunwayIQ Logo" width={40} height={40} className="rounded-md" />
        <span className="text-xl font-bold text-white">RunwayIQ</span>
      </a>
      <nav className="hidden items-center gap-6 text-sm md:flex">
        <a href="#benefits" className="transition-colors hover:text-white">Benefits</a>
        <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
        <a href="#investors" className="transition-colors hover:text-white">Investors</a>
      </nav>
      <a
        href="#contact"
        className="hidden rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-sky-600 md:block"
      >
        Book a Demo
      </a>
    </div>
  </header>
);

// --- Hero Section ---
const Hero = () => (
  <section id="home" className="overflow-hidden py-20 sm:py-32 lg:py-32">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
        <div className="text-center lg:text-left">
          <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Find Product-Market Fit Before You Run Out of Runway
          </h1>
          <p className="mt-6 text-lg text-slate-400">
            RunwayIQ validates your GTM motion with AI-powered outreach and real-time human validation. We get you from Seed to Series A, faster.
          </p>
          <div className="mt-8 flex justify-center gap-4 lg:justify-start">
            <a
              href="#contact"
              className="transform rounded-md bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-sky-600"
            >
              Book Your Demo
            </a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
           <Image
            src={heroImagePath}
            alt="An illustration showing a person at a desk with AI assistants."
            width={800}
            height={800}
            className="relative rounded-2xl shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);


// --- Benefit Card Component ---
const BenefitCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="rounded-xl bg-slate-800/50 p-6 shadow-lg ring-1 ring-white/10">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/10">
        <Icon className="h-6 w-6 text-sky-400" />
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <p className="mt-4 text-slate-400">{children}</p>
  </div>
);

// --- Benefits Section ---
const Benefits = () => (
  <section id="benefits" className="py-20 sm:py-24">
    <div className="container mx-auto max-w-7xl px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Your AI-Powered GTM Co-Pilot</h2>
        <p className="mt-4 text-lg text-slate-400">
          We combine automated efficiency with the critical human insights needed to validate your strategy.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <BenefitCard icon={Rocket} title="Rapid ICP Validation">
          Quickly test and iterate on Ideal Customer Profiles to find your most lucrative market segments with real-world feedback.
        </BenefitCard>
        <BenefitCard icon={Target} title="Automated Precision Outreach">
          Leverage AI-driven workflows for calls, emails, and LinkedIn to set meetings with the right prospects, consistently.
        </BenefitCard>
        <BenefitCard icon={BarChart} title="Actionable Intelligence">
          Uncover key competitor data and customer pain points that directly inform your product development roadmap.
        </BenefitCard>
      </div>
    </div>
  </section>
);

// --- Pricing Card Component ---
const PricingCard = ({ plan, price, description, features, popular = false }: { plan: string, price: string, description: string, features: string[], popular?: boolean }) => (
    <div className={`relative rounded-2xl p-8 shadow-xl ring-1 ${popular ? 'ring-sky-400' : 'ring-slate-700'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 rounded-full bg-sky-500 px-4 py-1 text-sm font-semibold text-white">Most Popular</div>}
        <h3 className="text-xl font-semibold text-white">{plan}</h3>
        <p className="mt-2 text-slate-400">{description}</p>
        <p className="mt-6 text-4xl font-bold text-white">{price} <span className="text-base font-medium text-slate-400">{plan === '3-Month Pilot' ? 'one-time' : '/ month'}</span></p>
        <ul className="mt-6 space-y-4">
            {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0 text-sky-500" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <a href="#contact" className={`mt-8 block w-full rounded-md px-6 py-3 text-center font-semibold ${popular ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
            Get Started
        </a>
    </div>
);

// --- Pricing Section ---
const Pricing = () => (
    <section id="pricing" className="py-20 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Clear Pricing for Rapid Growth</h2>
                <p className="mt-4 text-lg text-slate-400">
                    Invest in a validated GTM strategy that pays for itself.
                </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
                 <PricingCard
                    plan="3-Month Pilot"
                    price="$10k"
                    description="The ultimate GTM validation sprint."
                    features={[
                        "Full SDR/AE Sales Cycle",
                        "Automated Outreach Campaigns",
                        "Weekly Iteration & Reporting",
                        "PMF Validation Report"
                    ]}
                />
                <PricingCard
                    plan="Growth Tier"
                    price="$5k"
                    description="Sustained execution post-validation."
                    features={[
                        "Continuous GTM Execution",
                        "Ongoing Lead Generation",
                        "Monthly Performance Analysis",
                        "Scalable Sales Playbook"
                    ]}
                    popular={true}
                />
                 <PricingCard
                    plan="Partner Tier"
                    price="$10k"
                    description="A true extension of your team."
                    features={[
                        "All Growth Tier Features",
                        "Customer Onboarding Support",
                        "Customer Success Integration",
                        "Quarterly Strategic Reviews"
                    ]}
                />
            </div>
        </div>
    </section>
);


// --- Investors Section ---
const Investors = () => (
  <section id="investors" className="py-20 sm:py-24">
    <div className="container mx-auto max-w-4xl rounded-2xl bg-slate-800/50 p-10 text-center ring-1 ring-white/10">
      <div className="flex justify-center text-sky-400">
        <Users className="h-12 w-12" />
      </div>
      <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">For Angel Investors & VCs</h2>
      {/* The apostrophe in "they're" has been fixed to "they&apos;re" */}
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
        De-risk your investments. RunwayIQ partners with early-stage startups to build the replicable, scalable sales motion that proves they&apos;re ready for a Series A.
      </p>
      <div className="mt-8">
         <a
          href="#contact"
          className="transform rounded-md bg-slate-700 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-slate-600"
        >
          Explore Partnerships
        </a>
      </div>
    </div>
  </section>
);

// --- Footer Section ---
const Footer = () => (
    <footer id="contact" className="border-t border-slate-800 py-10">
        <div className="container mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to accelerate your growth?</h2>
            <p className="mt-2 text-slate-400">Book a free, no-obligation demo to see how RunwayIQ can build your pipeline.</p>
            <a href="mailto:demo@runwayiq.com" className="mt-6 inline-block rounded-md bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-sky-600">
                demo@runwayiq.com
            </a>
            <div className="mt-8 text-sm text-slate-500">
                &copy; {new Date().getFullYear()} RunwayIQ. All rights reserved.
            </div>
        </div>
    </footer>
);
