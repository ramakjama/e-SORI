import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { empresasLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: empresasLanding.config.title,
  description: empresasLanding.config.description,
  keywords: empresasLanding.config.keywords,
}

export default function EmpresasPage() {
  return <LandingPage content={empresasLanding} />
}
