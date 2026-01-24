import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { navidadLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: navidadLanding.config.title,
  description: navidadLanding.config.description,
  keywords: navidadLanding.config.keywords,
}

export default function NavidadPage() {
  return <LandingPage content={navidadLanding} />
}
