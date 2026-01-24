import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { parejasLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: parejasLanding.config.title,
  description: parejasLanding.config.description,
  keywords: parejasLanding.config.keywords,
}

export default function ParejasPage() {
  return <LandingPage content={parejasLanding} />
}
