import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { decesosLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: decesosLanding.config.title,
  description: decesosLanding.config.description,
  keywords: decesosLanding.config.keywords,
}

export default function SeguroDecesosPage() {
  return <LandingPage content={decesosLanding} />
}
