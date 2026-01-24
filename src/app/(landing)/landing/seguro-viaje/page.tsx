import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { viajeLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: viajeLanding.config.title,
  description: viajeLanding.config.description,
  keywords: viajeLanding.config.keywords,
}

export default function SeguroViajePage() {
  return <LandingPage content={viajeLanding} />
}
