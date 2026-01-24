import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { halloweenLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: halloweenLanding.config.title,
  description: halloweenLanding.config.description,
  keywords: halloweenLanding.config.keywords,
}

export default function HalloweenPage() {
  return <LandingPage content={halloweenLanding} />
}
