import { NextRequest, NextResponse } from 'next/server'
import { EmailAutomation } from '@/lib/email-automation'

/**
 * Email Automation Cron Job
 *
 * This endpoint is called by Vercel Cron to run automated email campaigns.
 *
 * Schedule:
 * - Runs daily at 9:00 AM UTC
 * - Processes welcome emails, renewal reminders, and win-back campaigns
 *
 * Security:
 * - Protected by CRON_SECRET environment variable
 * - Only accessible from Vercel's cron service
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('[Cron] CRON_SECRET not configured')
      return NextResponse.json(
        { error: 'Cron service not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron] Unauthorized cron attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('[Cron] Starting email automation tasks...')

    // Run all automated email tasks
    const results = {
      welcome: { sent: 0, errors: 0 },
      renewals: { sent: 0, errors: 0 },
      winBack: { sent: 0, errors: 0 },
    }

    // 1. Welcome Email 2 (Day 1 after signup)
    try {
      const welcomeResults = await EmailAutomation.runWelcomeEmail2Task()
      results.welcome.sent = welcomeResults.sent
      results.welcome.errors = welcomeResults.errors
      console.log(`[Cron] Welcome emails: ${welcomeResults.sent} sent, ${welcomeResults.errors} errors`)
    } catch (error) {
      console.error('[Cron] Error in welcome email task:', error)
      results.welcome.errors++
    }

    // 2. Renewal Reminders (30/15/7 days before expiry)
    try {
      const renewalResults = await EmailAutomation.runRenewalRemindersTask()
      results.renewals.sent = renewalResults.sent
      results.renewals.errors = renewalResults.errors
      console.log(`[Cron] Renewal reminders: ${renewalResults.sent} sent, ${renewalResults.errors} errors`)
    } catch (error) {
      console.error('[Cron] Error in renewal reminders task:', error)
      results.renewals.errors++
    }

    // 3. Win-Back Campaigns (14/30/60 days inactive)
    try {
      const winBackResults = await EmailAutomation.runWinBackTask()
      results.winBack.sent = winBackResults.sent
      results.winBack.errors = winBackResults.errors
      console.log(`[Cron] Win-back campaigns: ${winBackResults.sent} sent, ${winBackResults.errors} errors`)
    } catch (error) {
      console.error('[Cron] Error in win-back task:', error)
      results.winBack.errors++
    }

    const totalSent = results.welcome.sent + results.renewals.sent + results.winBack.sent
    const totalErrors = results.welcome.errors + results.renewals.errors + results.winBack.errors

    console.log(`[Cron] Email automation complete: ${totalSent} sent, ${totalErrors} errors`)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
      summary: {
        totalSent,
        totalErrors,
      },
    })
  } catch (error) {
    console.error('[Cron] Fatal error in email automation:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Manual trigger endpoint (POST)
 * Allows manual execution for testing purposes
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    console.log('[Cron] Manual trigger initiated')

    // Parse request body for task selection
    const body = await request.json().catch(() => ({}))
    const { task = 'all' } = body

    const results: any = {
      welcome: null,
      renewals: null,
      winBack: null,
    }

    // Run selected task(s)
    if (task === 'all' || task === 'welcome') {
      results.welcome = await EmailAutomation.runWelcomeEmail2Task()
      console.log(`[Cron] Manual welcome: ${results.welcome.sent} sent`)
    }

    if (task === 'all' || task === 'renewals') {
      results.renewals = await EmailAutomation.runRenewalRemindersTask()
      console.log(`[Cron] Manual renewals: ${results.renewals.sent} sent`)
    }

    if (task === 'all' || task === 'winback') {
      results.winBack = await EmailAutomation.runWinBackTask()
      console.log(`[Cron] Manual win-back: ${results.winBack.sent} sent`)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      task,
      results,
    })
  } catch (error) {
    console.error('[Cron] Error in manual trigger:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
