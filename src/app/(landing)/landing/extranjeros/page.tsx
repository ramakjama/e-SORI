import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { extranjerosLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: extranjerosLanding.config.title,
  description: extranjerosLanding.config.description,
  keywords: extranjerosLanding.config.keywords,
}

export default function ExtranjerosPage() {
  return <LandingPage content={extranjerosLanding} />
}
