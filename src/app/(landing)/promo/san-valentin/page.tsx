import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { sanValentinLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: sanValentinLanding.config.title,
  description: sanValentinLanding.config.description,
  keywords: sanValentinLanding.config.keywords,
}

export default function SanValentinPage() {
  return <LandingPage content={sanValentinLanding} />
}
