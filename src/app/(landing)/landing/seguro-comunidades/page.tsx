import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { comunidadesLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: comunidadesLanding.config.title,
  description: comunidadesLanding.config.description,
  keywords: comunidadesLanding.config.keywords,
}

export default function SeguroComunidadesPage() {
  return <LandingPage content={comunidadesLanding} />
}
