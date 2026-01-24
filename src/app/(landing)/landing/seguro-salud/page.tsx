import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { saludLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: saludLanding.config.title,
  description: saludLanding.config.description,
  keywords: saludLanding.config.keywords,
}

export default function SeguroSaludPage() {
  return <LandingPage content={saludLanding} />
}
