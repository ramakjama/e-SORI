import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { comercioLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: comercioLanding.config.title,
  description: comercioLanding.config.description,
  keywords: comercioLanding.config.keywords,
}

export default function SeguroComercioPage() {
  return <LandingPage content={comercioLanding} />
}
