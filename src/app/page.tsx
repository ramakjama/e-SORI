import { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { homeLanding } from '@/data/landings/home'

export const metadata: Metadata = {
  title: homeLanding.config.title,
  description: homeLanding.config.description,
  keywords: homeLanding.config.keywords,
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <LandingHeader />
      <main className="flex-1 pt-20">
        <LandingPage content={homeLanding} />
      </main>
      <LandingFooter />
    </div>
  )
}
