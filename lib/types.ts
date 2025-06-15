export interface NavLink {
  label: string
  href: string
  isExternal?: boolean
}

export interface ValueProposition {
  id: string
  title: string
  description: string
  IconComponent: React.ComponentType<{ className?: string }>
}

export interface ClientLogo {
  id: string
  name: string
  imageUrl: string
}

export interface ServiceTier {
  id: string
  name: string
  price: string
  duration?: string
  description: string
  features: string[]
  cta: string
  isPopular?: boolean
}

export interface PodcastEpisode {
  id: string
  title: string
  guest?: string
  description: string
  duration: string
  imageUrl: string
  audioUrl?: string
}

export interface CaseStudyResult {
  metric: string
  value: string
  improvement?: string
}

export interface CaseStudyTestimonial {
  text: string
  author: string
  role: string
}

export interface CaseStudy {
  id: string
  title: string
  clientName: string
  challenge: string
  solution: string
  results: CaseStudyResult[]
  imageUrl: string
  testimonial?: CaseStudyTestimonial
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  linkedinUrl?: string
}

export interface AICapability {
  id: string
  title: string
  description: string
  tags: string[]
}