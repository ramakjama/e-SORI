import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { diaPadreLanding } from '@/data/landings/campaigns'

export const metadata: Metadata = {
  title: diaPadreLanding.config.title,
  description: diaPadreLanding.config.description,
  keywords: diaPadreLanding.config.keywords,
}

export default function DiaPadrePage() {
  return <LandingPage content={diaPadreLanding} />
}
