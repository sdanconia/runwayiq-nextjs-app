import { Metadata, Viewport } from 'next'
import SalesDashboard from './components/SalesDashboard'

export const metadata: Metadata = {
  title: 'Sales Dashboard | RunwayIQ - AI-Powered Sales Automation',
  description: 'Comprehensive sales dashboard with AI-powered automation, real-time analytics, and seamless CRM integration. Track leads, manage campaigns, and boost your sales performance.',
  keywords: [
    'sales dashboard',
    'sales automation',
    'CRM integration',
    'lead management',
    'sales analytics',
    'Notion integration',
    'sales performance',
    'business intelligence'
  ],
  authors: [{ name: 'RunwayIQ' }],
  creator: 'RunwayIQ',
  publisher: 'RunwayIQ',
  robots: {
    index: false, // Private dashboard, don't index
    follow: false,
  },
  openGraph: {
    title: 'Sales Dashboard | RunwayIQ',
    description: 'AI-powered sales dashboard with real-time analytics and automation',
    type: 'website',
    locale: 'en_US',
    siteName: 'RunwayIQ',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Dashboard | RunwayIQ',
    description: 'AI-powered sales dashboard with real-time analytics and automation',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function SalesDashboardPage() {
  return <SalesDashboard />
}