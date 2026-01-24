import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { veranoLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: veranoLanding.config.title,
  description: veranoLanding.config.description,
  keywords: veranoLanding.config.keywords,
}

export default function VeranoPage() {
  return <LandingPage content={veranoLanding} />
}
