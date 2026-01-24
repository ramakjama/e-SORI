import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { rcProfesionalLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: rcProfesionalLanding.config.title,
  description: rcProfesionalLanding.config.description,
  keywords: rcProfesionalLanding.config.keywords,
}

export default function SeguroRCProfesionalPage() {
  return <LandingPage content={rcProfesionalLanding} />
}
