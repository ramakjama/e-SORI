'use client'

import { LandingContent, LandingSections, DEFAULT_SECTIONS } from '@/lib/landing/types'
import { getTheme } from '@/lib/landing/themes'
import {
  HeroSection,
  TrustBar,
  CoverageCards,
  BenefitsGrid,
  StatsSection,
  TestimonialsSection,
  FAQSection,
  CTASection,
} from './sections'
import { ExitIntentModal } from '@/components/marketing/ExitIntentModal'

interface LandingPageProps {
  content: LandingContent
  sections?: Partial<LandingSections>
}

export function LandingPage({ content, sections }: LandingPageProps) {
  const { config, hero, trustBar, coverages, benefits, stats, testimonials, faq, cta } = content
  const theme = getTheme(config.theme)

  // Merge provided sections with defaults
  const showSections: LandingSections = {
    ...DEFAULT_SECTIONS,
    ...sections,
  }

  return (
    <div className="landing-page" data-theme={config.theme}>
      {/* Hero Section */}
      {showSections.hero && (
        <HeroSection
          config={hero}
          theme={theme}
          countdownDate={config.countdownDate}
          showCountdown={config.showCountdown}
        />
      )}

      {/* Trust Bar */}
      {showSections.trustBar && (
        <TrustBar config={trustBar} theme={theme} />
      )}

      {/* Coverage/Pricing Cards */}
      {showSections.coverages && coverages && (
        <CoverageCards config={coverages} theme={theme} />
      )}

      {/* Benefits Grid */}
      {showSections.benefits && benefits && (
        <BenefitsGrid config={benefits} theme={theme} />
      )}

      {/* Stats Section */}
      {showSections.stats && stats && (
        <StatsSection config={stats} theme={theme} />
      )}

      {/* Testimonials */}
      {showSections.testimonials && testimonials && (
        <TestimonialsSection config={testimonials} theme={theme} />
      )}

      {/* FAQ */}
      {showSections.faq && faq && (
        <FAQSection config={faq} theme={theme} />
      )}

      {/* CTA Section */}
      {showSections.cta && (
        <CTASection
          config={cta}
          theme={theme}
          source={config.source}
          campaign={config.campaign}
          insuranceType={config.insuranceType}
          gamificationPoints={config.gamificationPoints}
        />
      )}

      {/* Exit Intent Modal */}
      <ExitIntentModal
        enabled={true}
        cookieDays={30}
        onLeadCaptured={(data) => {
          // Track with analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'lead_captured', {
              event_category: 'exit_intent',
              event_label: config.insuranceType || 'unknown',
              source: config.source,
              campaign: config.campaign,
            })
          }
        }}
      />
    </div>
  )
}

// Export for convenience
export { getTheme } from '@/lib/landing/themes'
export type { LandingContent, LandingSections } from '@/lib/landing/types'
