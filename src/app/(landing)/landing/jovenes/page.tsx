import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { jovenesLanding } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: jovenesLanding.config.title,
  description: jovenesLanding.config.description,
  keywords: jovenesLanding.config.keywords,
}

export default function JovenesPage() {
  return <LandingPage content={jovenesLanding} />
}
