import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { motoLanding } from '@/data/landings/products'

export const metadata: Metadata = {
  title: motoLanding.config.title,
  description: motoLanding.config.description,
  keywords: motoLanding.config.keywords,
}

export default function SeguroMotoPage() {
  return <LandingPage content={motoLanding} />
}
