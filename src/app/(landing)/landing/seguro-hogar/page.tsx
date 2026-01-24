import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { hogarLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: hogarLanding.config.title,
  description: hogarLanding.config.description,
  keywords: hogarLanding.config.keywords,
}

export default function SeguroHogarPage() {
  return <LandingPage content={hogarLanding} />
}
