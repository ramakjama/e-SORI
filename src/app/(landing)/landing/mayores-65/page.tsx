import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { mayores65Landing } from '@/data/landings/segments'

export const metadata: Metadata = {
  title: mayores65Landing.config.title,
  description: mayores65Landing.config.description,
  keywords: mayores65Landing.config.keywords,
}

export default function Mayores65Page() {
  return <LandingPage content={mayores65Landing} />
}
