import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { nuevosConductoresLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: nuevosConductoresLanding.config.title,
  description: nuevosConductoresLanding.config.description,
  keywords: nuevosConductoresLanding.config.keywords,
}

export default function NuevosConductoresPage() {
  return <LandingPage content={nuevosConductoresLanding} />
}
