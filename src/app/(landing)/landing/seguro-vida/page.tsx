import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { vidaLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: vidaLanding.config.title,
  description: vidaLanding.config.description,
  keywords: vidaLanding.config.keywords,
}

export default function SeguroVidaPage() {
  return <LandingPage content={vidaLanding} />
}
