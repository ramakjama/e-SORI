import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { autonomosLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: autonomosLanding.config.title,
  description: autonomosLanding.config.description,
  keywords: autonomosLanding.config.keywords,
}

export default function AutonomosPage() {
  return <LandingPage content={autonomosLanding} />
}
