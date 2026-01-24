import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { primaveraLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: primaveraLanding.config.title,
  description: primaveraLanding.config.description,
  keywords: primaveraLanding.config.keywords,
}

export default function PrimaveraPage() {
  return <LandingPage content={primaveraLanding} />
}
