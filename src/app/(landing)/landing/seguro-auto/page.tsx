import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { autoLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: autoLanding.config.title,
  description: autoLanding.config.description,
  keywords: autoLanding.config.keywords,
}

export default function SeguroAutoPage() {
  return <LandingPage content={autoLanding} />
}
