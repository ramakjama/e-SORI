import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { accidentesLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: accidentesLanding.config.title,
  description: accidentesLanding.config.description,
  keywords: accidentesLanding.config.keywords,
}

export default function SeguroAccidentesPage() {
  return <LandingPage content={accidentesLanding} />
}
