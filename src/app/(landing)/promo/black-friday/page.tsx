import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { blackFridayLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: blackFridayLanding.config.title,
  description: blackFridayLanding.config.description,
  keywords: blackFridayLanding.config.keywords,
}

export default function BlackFridayPage() {
  return <LandingPage content={blackFridayLanding} />
}
