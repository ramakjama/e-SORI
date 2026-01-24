import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { cyberMondayLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: cyberMondayLanding.config.title,
  description: cyberMondayLanding.config.description,
  keywords: cyberMondayLanding.config.keywords,
}

export default function CyberMondayPage() {
  return <LandingPage content={cyberMondayLanding} />
}
