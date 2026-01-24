import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { anoNuevoLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: anoNuevoLanding.config.title,
  description: anoNuevoLanding.config.description,
  keywords: anoNuevoLanding.config.keywords,
}

export default function AnoNuevoPage() {
  return <LandingPage content={anoNuevoLanding} />
}
