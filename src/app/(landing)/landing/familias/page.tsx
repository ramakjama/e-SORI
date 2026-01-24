import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { familiasLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: familiasLanding.config.title,
  description: familiasLanding.config.description,
  keywords: familiasLanding.config.keywords,
}

export default function FamiliasPage() {
  return <LandingPage content={familiasLanding} />
}
