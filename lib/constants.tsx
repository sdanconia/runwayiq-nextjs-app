import { 
  Cpu,
  Puzzle,
  Rocket
} from "lucide-react"
import { NavLink, ValueProposition, ServiceTier, PodcastEpisode, CaseStudy, TeamMember, AICapability } from "./types"

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "PMF Podcast", href: "/podcast" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "CRM", href: "/crm" },
  { label: "Investor Portal", href: "/investors" },
  { label: "About Us", href: "/about" },
]

export const valuePropositions: ValueProposition[] = [
  {
    id: "ai-automation",
    title: "AI Agent Automation",
    description: "Proprietary AI agents handle hyper-personalized outreach across email, LinkedIn, and calls with unprecedented conversion rates.",
    IconComponent: Cpu
  },
  {
    id: "pmf-validation",
    title: "PMF Validation",
    description: "Real-time market validation through systematic customer discovery and feedback loops that prove product-market fit.",
    IconComponent: Puzzle
  },
  {
    id: "tech-acceleration",
    title: "Tech-Forward Acceleration",
    description: "Leverage cutting-edge GTM technology and proven frameworks to compress your path from seed to Series A.",
    IconComponent: Rocket
  }
]

export const serviceTiers: ServiceTier[] = [
  {
    id: "pilot",
    name: "Pilot Program",
    price: "$20K",
    duration: "3 months",
    description: "The ultimate GTM validation sprint for early-stage startups ready to prove product-market fit.",
    features: [
      "AI-Powered Outbound Campaigns",
      "Guaranteed 20+ Qualified Demos",
      "Weekly Strategy Iterations",
      "PMF Validation Report",
      "Customer Interview Analysis",
      "ICP Refinement & Targeting"
    ],
    cta: "Start Your Pilot",
    isPopular: true
  },
  {
    id: "ongoing",
    name: "Ongoing Partnership", 
    price: "$10K",
    duration: "month",
    description: "Sustained GTM execution for startups with validated PMF ready to scale systematically.",
    features: [
      "Continuous Lead Generation",
      "Monthly Performance Analysis", 
      "Scalable Sales Playbook",
      "Team Training & Enablement",
      "Technology Stack Optimization",
      "Quarterly Strategic Reviews"
    ],
    cta: "Become a Partner"
  },
  {
    id: "equity",
    name: "Equity Partnership",
    price: "Custom",
    description: "Deep partnership model for high-potential startups where we share upside and downside.",
    features: [
      "All Ongoing Partnership Features",
      "C-Level Strategic Advisory",
      "Investor Introduction Support", 
      "Board-Level Reporting",
      "Long-term Growth Planning",
      "Exit Strategy Development"
    ],
    cta: "Discuss Equity Option"
  }
]

export const aiCapabilities: AICapability[] = [
  {
    id: "email-automation",
    title: "Hyper-Personalized Email Automation",
    description: "AI agents craft contextually relevant emails using real-time data enrichment, company research, and behavioral triggers for maximum engagement.",
    tags: ["High Conversion", "Scalable"]
  },
  {
    id: "linkedin-outreach", 
    title: "Intelligent LinkedIn Outreach",
    description: "Automated connection requests, follow-ups, and InMail campaigns that feel authentically human while operating at machine scale.",
    tags: ["Professional Network", "B2B Focus"]
  },
  {
    id: "call-analysis",
    title: "AI-Powered Call Analysis & Coaching",
    description: "Real-time call transcription, sentiment analysis, and coaching recommendations to optimize every prospect interaction.",
    tags: ["Real-time Insights", "Performance Optimization"]
  },
  {
    id: "data-enrichment",
    title: "Real-time Data Enrichment",
    description: "Continuous prospect and account data enhancement using multiple data sources to ensure messaging relevance and accuracy.",
    tags: ["Data Quality", "Targeting Precision"]
  }
]

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "ep-001",
    title: "The PMF Validation Framework That Actually Works",
    guest: "Sarah Chen, CEO of DataFlow",
    description: "Deep dive into systematic approaches for validating product-market fit beyond vanity metrics.",
    duration: "42:15",
    imageUrl: "/hero-image.png"
  },
  {
    id: "ep-002", 
    title: "From $0 to $1M ARR: The Outbound Playbook",
    guest: "Marcus Rodriguez, Founder of TechScale",
    description: "Step-by-step breakdown of building a predictable outbound sales engine from scratch.",
    duration: "38:22",
    imageUrl: "/hero-image.png"
  },
  {
    id: "ep-003",
    title: "AI in Sales: Hype vs Reality for Early-Stage Startups",
    description: "Honest assessment of where AI delivers value in GTM and where human touch remains essential.",
    duration: "35:47",
    imageUrl: "/hero-image.png"
  }
]

export const caseStudies: CaseStudy[] = [
  {
    id: "transistor",
    title: "Transistor Radio Growth Engine",
    clientName: "Transistor",
    challenge: "Post-seed SaaS company struggling to scale beyond founder-led sales with unclear ICP definition.",
    solution: "Implemented AI-driven prospect research, refined ICP through systematic testing, and built scalable outbound process.",
    results: [
      { metric: "MRR Growth", value: "300%", improvement: "6 months" },
      { metric: "Demo Bookings", value: "+150", improvement: "per month" },
      { metric: "Sales Cycle", value: "-40%", improvement: "reduction" }
    ],
    imageUrl: "/hero-image.png",
    testimonial: {
      text: "RunwayIQ transformed our GTM strategy from guesswork to a predictable growth engine. Their AI-powered approach helped us identify our true ICP and scale systematically.",
      author: "Justin Jackson",
      role: "Co-founder, Transistor"
    }
  },
  {
    id: "reform",
    title: "Reform's Series A Preparation",
    clientName: "Reform", 
    challenge: "High-growth fintech needed to prove scalable GTM motion for Series A fundraising.",
    solution: "Built comprehensive sales infrastructure, implemented advanced analytics, and created investor-ready growth metrics.",
    results: [
      { metric: "Pipeline Growth", value: "500%", improvement: "4 months" },
      { metric: "CAC Payback", value: "8 months", improvement: "vs 18 month industry avg" },
      { metric: "Series A Raised", value: "$12M", improvement: "oversubscribed" }
    ],
    imageUrl: "/hero-image.png"
  }
]

export const teamMembers: TeamMember[] = [
  {
    id: "founder-1",
    name: "Alex Thompson",
    role: "Co-Founder & CEO",
    bio: "Former VP Sales at unicorn startup, built GTM engines that generated $100M+ in revenue. Stanford MBA with deep expertise in AI-powered sales automation.",
    imageUrl: "/hero-image.png",
    linkedinUrl: "https://linkedin.com/in/alexthompson"
  },
  {
    id: "founder-2", 
    name: "Priya Sharma",
    role: "Co-Founder & CTO",
    bio: "Ex-Google AI researcher turned sales tech entrepreneur. PhD in Machine Learning with 8+ patents in conversational AI and natural language processing.",
    imageUrl: "/hero-image.png",
    linkedinUrl: "https://linkedin.com/in/priyasharma"
  },
  {
    id: "advisor-1",
    name: "David Kim",
    role: "Strategic Advisor",
    bio: "Former Chief Revenue Officer at three successful exits totaling $2B+. Expert in scaling B2B SaaS from Series A to IPO.",
    imageUrl: "/hero-image.png"
  }
]