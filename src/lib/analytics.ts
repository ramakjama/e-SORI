// ============================================
// ANALYTICS TRACKING SERVICE
// ============================================

interface AnalyticsEvent {
  category: string // 'gamification', 'quiz', 'marketplace', 'profile', etc.
  action: string // 'quiz_completed', 'reward_redeemed', 'level_up', etc.
  label?: string
  value?: number
  userId?: string
  metadata?: Record<string, any>
}

interface BatchAnalyticsEvent extends AnalyticsEvent {
  timestamp?: string
}

class AnalyticsService {
  private queue: BatchAnalyticsEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null
  private readonly BATCH_SIZE = 10
  private readonly FLUSH_INTERVAL = 5000 // 5 seconds

  constructor() {
    // Auto-flush queue periodically if in browser
    if (typeof window !== 'undefined') {
      this.flushInterval = setInterval(() => {
        this.flush()
      }, this.FLUSH_INTERVAL)
    }
  }

  /**
   * Track a single analytics event
   */
  async track(event: AnalyticsEvent): Promise<void> {
    try {
      // Add to queue with timestamp
      this.queue.push({
        ...event,
        timestamp: new Date().toISOString(),
      })

      // Flush if batch size reached
      if (this.queue.length >= this.BATCH_SIZE) {
        await this.flush()
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error)
    }
  }

  /**
   * Track page view
   */
  async page(pageName: string): Promise<void> {
    return this.track({
      category: 'navigation',
      action: 'page_view',
      label: pageName,
    })
  }

  /**
   * Helper: Track quiz completed
   */
  async trackQuizCompleted(score: number, xp: number, coins: number): Promise<void> {
    return this.track({
      category: 'gamification',
      action: 'quiz_completed',
      label: 'daily_quiz',
      value: score,
      metadata: {
        xp_earned: xp,
        coins_earned: coins,
        score,
      },
    })
  }

  /**
   * Helper: Track reward redeemed
   */
  async trackRewardRedeemed(rewardId: string, coins: number): Promise<void> {
    return this.track({
      category: 'marketplace',
      action: 'reward_redeemed',
      label: rewardId,
      value: coins,
      metadata: {
        reward_id: rewardId,
        coins_spent: coins,
      },
    })
  }

  /**
   * Helper: Track level up
   */
  async trackLevelUp(newLevel: string): Promise<void> {
    return this.track({
      category: 'gamification',
      action: 'level_up',
      label: newLevel,
      metadata: {
        new_level: newLevel,
      },
    })
  }

  /**
   * Helper: Track mission completed
   */
  async trackMissionCompleted(missionId: string): Promise<void> {
    return this.track({
      category: 'gamification',
      action: 'mission_completed',
      label: missionId,
      metadata: {
        mission_id: missionId,
      },
    })
  }

  /**
   * Flush the queue to the server
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return

    const eventsToSend = [...this.queue]
    this.queue = []

    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend }),
      })

      if (!response.ok) {
        // Re-add events to queue on failure
        this.queue.unshift(...eventsToSend)
        console.error('[Analytics] Failed to send events:', response.statusText)
      }
    } catch (error) {
      // Re-add events to queue on failure
      this.queue.unshift(...eventsToSend)
      console.error('[Analytics] Error sending events:', error)
    }
  }

  /**
   * Clean up interval on destroy
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    // Final flush
    this.flush()
  }
}

// Export singleton instance
export const analytics = new AnalyticsService()

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analytics.destroy()
  })
}
