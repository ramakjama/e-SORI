import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { mascotasLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: mascotasLanding.config.title,
  description: mascotasLanding.config.description,
  keywords: mascotasLanding.config.keywords,
}

export default function SeguroMascotasPage() {
  return <LandingPage content={mascotasLanding} />
}
