import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { vueltaColeLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: vueltaColeLanding.config.title,
  description: vueltaColeLanding.config.description,
  keywords: vueltaColeLanding.config.keywords,
}

export default function VueltaColePage() {
  return <LandingPage content={vueltaColeLanding} />
}
