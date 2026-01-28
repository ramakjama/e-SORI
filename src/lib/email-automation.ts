/**
 * EMAIL AUTOMATION SERVICE
 * Sistema completo de automatización de emails para e-SORI
 *
 * Features:
 * - Welcome sequence (3 emails)
 * - Policy renewal reminders (30d, 15d, 7d)
 * - Win-back campaigns (14d, 30d, 60d)
 * - Gamification milestones
 */

import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/WelcomeEmail'
import PolicyRenewalEmail from '@/emails/PolicyRenewalEmail'
import WinBackEmail from '@/emails/WinBackEmail'
import { prisma } from '@/lib/prisma'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// =====================================================
// WELCOME SEQUENCE (3 EMAILS)
// =====================================================

/**
 * Send welcome email #1 - Verification
 */
export async function sendWelcomeEmail1(
  email: string,
  userName: string,
  verificationUrl: string
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip welcome email #1')
    return false
  }

  try {
    const emailHtml = render(WelcomeEmail({
      userName,
      verificationUrl,
    }))

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: '¡Bienvenido a Soriano! Verifica tu cuenta',
      html: emailHtml,
    })

    console.log(`[Email] Welcome #1 sent to ${email}`)
    return true
  } catch (error) {
    console.error('[Email] Error sending welcome #1:', error)
    return false
  }
}

/**
 * Send welcome email #2 - Platform tour (+1 day)
 */
export async function sendWelcomeEmail2(
  email: string,
  userName: string
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip welcome email #2')
    return false
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: 'Descubre todo lo que puedes hacer en Soriano',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #667eea;">Hola ${userName},</h1>
          <p>¡Bienvenido al día 2 de tu aventura con Soriano!</p>

          <h2>✨ ¿Ya exploraste estas funciones?</h2>
          <ul>
            <li><strong>Sube de nivel:</strong> Completa misiones diarias y sube al nivel ORO para desbloquear descuentos del 15%</li>
            <li><strong>Quiz diario:</strong> Responde 5 preguntas y gana hasta 100 XP + 25 COINS</li>
            <li><strong>Rueda de la fortuna:</strong> Gira cada día y gana premios sorpresa</li>
            <li><strong>Programa de referidos:</strong> Invita amigos y gana hasta 1000 COINS por cada uno</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://app.sorianomediadores.es/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Ir al Dashboard
            </a>
          </div>

          <p>¿Tienes dudas? Nuestro equipo está aquí para ayudarte 24/7.</p>

          <p style="color: #888;">Saludos,<br>Equipo Soriano</p>
        </div>
      `,
    })

    console.log(`[Email] Welcome #2 sent to ${email}`)
    return true
  } catch (error) {
    console.error('[Email] Error sending welcome #2:', error)
    return false
  }
}

/**
 * Send welcome email #3 - First quote (+3 days)
 */
export async function sendWelcomeEmail3(
  email: string,
  userName: string
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip welcome email #3')
    return false
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: '🎁 Tu primer seguro con 15% de descuento',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Oferta Especial</h1>
            <p style="color: white; font-size: 18px;">15% de descuento en tu primer seguro</p>
          </div>

          <div style="padding: 30px;">
            <p>Hola ${userName},</p>
            <p>Han pasado 3 días desde que te registraste y queremos darte la bienvenida con una <strong>oferta especial del 15% de descuento</strong> en tu primer seguro.</p>

            <div style="background: #f6f9fc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">✓ Comparamos +20 aseguradoras</h3>
              <p>Encontramos el mejor precio para ti en segundos</p>

              <h3>✓ Sin costes ocultos</h3>
              <p>El precio que ves es el precio final</p>

              <h3>✓ Gestión completa</h3>
              <p>Nos encargamos de todo el papeleo</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://app.sorianomediadores.es/cotizar" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Cotizar Ahora con 15% OFF
              </a>
            </div>

            <p style="color: #888; font-size: 14px;">* Oferta válida por 7 días desde el registro</p>
          </div>
        </div>
      `,
    })

    console.log(`[Email] Welcome #3 sent to ${email}`)
    return true
  } catch (error) {
    console.error('[Email] Error sending welcome #3:', error)
    return false
  }
}

// =====================================================
// POLICY RENEWAL REMINDERS
// =====================================================

/**
 * Send renewal reminder (30/15/7 days before)
 */
export async function sendRenewalReminder(
  email: string,
  userName: string,
  policyType: string,
  renewalDate: string,
  daysUntilRenewal: number,
  currentPremium: string,
  renewalUrl: string
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip renewal reminder')
    return false
  }

  try {
    // Different discount based on days
    const discountPercentage = daysUntilRenewal >= 30 ? 10 : daysUntilRenewal >= 15 ? 8 : 5

    const emailHtml = render(PolicyRenewalEmail({
      userName,
      policyType,
      renewalDate,
      daysUntilRenewal,
      currentPremium,
      renewalUrl,
      discountPercentage,
    }))

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: `⏰ Tu póliza de ${policyType} vence en ${daysUntilRenewal} días`,
      html: emailHtml,
    })

    console.log(`[Email] Renewal reminder sent to ${email} (${daysUntilRenewal} days)`)
    return true
  } catch (error) {
    console.error('[Email] Error sending renewal reminder:', error)
    return false
  }
}

// =====================================================
// WIN-BACK CAMPAIGNS
// =====================================================

/**
 * Send win-back email (14/30/60 days inactive)
 */
export async function sendWinBackEmail(
  email: string,
  userName: string,
  daysInactive: number,
  returnUrl: string
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip win-back email')
    return false
  }

  try {
    // Determine stage based on days inactive
    let stage: 1 | 2 | 3 = 1
    let bonusCoins = 100
    let discountPercentage = 10

    if (daysInactive >= 60) {
      stage = 3
      bonusCoins = 500
      discountPercentage = 25
    } else if (daysInactive >= 30) {
      stage = 2
      bonusCoins = 250
      discountPercentage = 20
    }

    const emailHtml = render(WinBackEmail({
      userName,
      daysInactive,
      bonusCoins,
      discountPercentage,
      returnUrl,
      stage,
    }))

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: stage === 3
        ? '👑 Tu última oportunidad de volver con beneficios VIP'
        : stage === 2
        ? '🎁 Te echamos de menos - Mira lo que te has perdido'
        : '😢 Te echamos de menos... aquí tienes 100 COINS gratis',
      html: emailHtml,
    })

    console.log(`[Email] Win-back email sent to ${email} (stage ${stage})`)
    return true
  } catch (error) {
    console.error('[Email] Error sending win-back email:', error)
    return false
  }
}

// =====================================================
// GAMIFICATION MILESTONES
// =====================================================

/**
 * Send level-up notification email
 */
export async function sendLevelUpEmail(
  email: string,
  userName: string,
  newLevel: string,
  unlockedBenefits: string[]
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip level-up email')
    return false
  }

  try {
    const levelEmojis: Record<string, string> = {
      BRONCE: '🥉',
      PLATA: '🥈',
      ORO: '🏆',
      PLATINO: '👑',
    }

    const emoji = levelEmojis[newLevel] || '🎉'

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: `${emoji} ¡Felicidades! Has llegado a ${newLevel}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 50px; text-align: center; border-radius: 10px 10px 0 0;">
            <div style="font-size: 64px;">${emoji}</div>
            <h1 style="color: white; margin: 20px 0 10px;">¡Nivel ${newLevel}!</h1>
            <p style="color: white; font-size: 18px;">Has alcanzado un nuevo nivel</p>
          </div>

          <div style="padding: 30px;">
            <p>¡Enhorabuena, ${userName}!</p>
            <p>Tu esfuerzo y compromiso te han llevado al nivel <strong>${newLevel}</strong>. Esto es lo que has desbloqueado:</p>

            <ul style="line-height: 2;">
              ${unlockedBenefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://app.sorianomediadores.es/soriano-club" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver Mis Beneficios
              </a>
            </div>

            <p>Sigue así y llegarás al nivel PLATINO con beneficios VIP exclusivos.</p>
          </div>
        </div>
      `,
    })

    console.log(`[Email] Level-up email sent to ${email} (${newLevel})`)
    return true
  } catch (error) {
    console.error('[Email] Error sending level-up email:', error)
    return false
  }
}

/**
 * Send streak achievement email
 */
export async function sendStreakAchievementEmail(
  email: string,
  userName: string,
  streakDays: number,
  bonusCoins: number
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - Skip streak email')
    return false
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@sorianomediadores.es',
      to: email,
      subject: `🔥 ¡${streakDays} días seguidos! Aquí está tu recompensa`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 50px; text-align: center; border-radius: 10px 10px 0 0;">
            <div style="font-size: 64px;">🔥</div>
            <h1 style="color: white; margin: 20px 0 10px;">${streakDays} Días de Racha</h1>
            <p style="color: white; font-size: 18px;">¡Increíble constancia!</p>
          </div>

          <div style="padding: 30px; text-align: center;">
            <p>¡Felicidades, ${userName}!</p>
            <p>Has mantenido una racha de <strong>${streakDays} días consecutivos</strong> visitando Soriano. ¡Eso es dedicación!</p>

            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; margin: 30px 0;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎁</div>
              <h2 style="color: #92400e; margin: 10px 0;">Recompensa Especial</h2>
              <p style="color: #78350f; font-size: 24px; font-weight: bold; margin: 10px 0;">
                ${bonusCoins} COINS de regalo
              </p>
            </div>

            <p>Sigue así y desbloquearás aún más recompensas. ¿Puedes llegar a 30 días? 🏆</p>

            <div style="margin: 30px 0;">
              <a href="https://app.sorianomediadores.es/dashboard" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Continuar mi Racha
              </a>
            </div>
          </div>
        </div>
      `,
    })

    console.log(`[Email] Streak achievement email sent to ${email} (${streakDays} days)`)
    return true
  } catch (error) {
    console.error('[Email] Error sending streak email:', error)
    return false
  }
}

// =====================================================
// AUTOMATION TASKS (TO BE RUN VIA CRON)
// =====================================================

/**
 * Task: Send welcome email #2 to users registered 1 day ago
 */
export async function runWelcomeEmail2Task(): Promise<number> {
  try {
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo,
          lt: new Date(oneDayAgo.getTime() + 24 * 60 * 60 * 1000),
        },
        emailVerified: { not: null },
      },
      select: {
        email: true,
        name: true,
      },
    })

    let sentCount = 0
    for (const user of users) {
      const success = await sendWelcomeEmail2(user.email, user.name || 'Cliente')
      if (success) sentCount++
    }

    console.log(`[Automation] Welcome #2: Sent ${sentCount}/${users.length} emails`)
    return sentCount
  } catch (error) {
    console.error('[Automation] Error running welcome #2 task:', error)
    return 0
  }
}

/**
 * Task: Send renewal reminders for policies expiring soon
 */
export async function runRenewalRemindersTask(): Promise<number> {
  try {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    const policies = await prisma.policy.findMany({
      where: {
        endDate: {
          gte: today,
          lte: thirtyDaysFromNow,
        },
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    })

    let sentCount = 0
    for (const policy of policies) {
      const daysUntilExpiry = Math.ceil(
        (policy.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Send at 30, 15, and 7 days
      if ([30, 15, 7].includes(daysUntilExpiry)) {
        const success = await sendRenewalReminder(
          policy.user.email,
          policy.user.name || 'Cliente',
          policy.type,
          policy.endDate.toLocaleDateString('es-ES'),
          daysUntilExpiry,
          `${policy.premium}€`,
          `https://app.sorianomediadores.es/policies/${policy.id}/renew`
        )
        if (success) sentCount++
      }
    }

    console.log(`[Automation] Renewal reminders: Sent ${sentCount} emails`)
    return sentCount
  } catch (error) {
    console.error('[Automation] Error running renewal reminders task:', error)
    return 0
  }
}

/**
 * Task: Send win-back emails to inactive users
 */
export async function runWinBackTask(): Promise<number> {
  try {
    const today = new Date()
    const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Find inactive users (no sessions in last X days)
    const inactiveUsers = await prisma.user.findMany({
      where: {
        sessions: {
          none: {
            updatedAt: {
              gte: fourteenDaysAgo,
            },
          },
        },
      },
      include: {
        sessions: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
    })

    let sentCount = 0
    for (const user of inactiveUsers) {
      const lastSession = user.sessions[0]
      if (!lastSession) continue

      const daysInactive = Math.ceil(
        (today.getTime() - lastSession.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Send at 14, 30, and 60 days
      if ([14, 30, 60].includes(daysInactive)) {
        const success = await sendWinBackEmail(
          user.email,
          user.name || 'Cliente',
          daysInactive,
          'https://app.sorianomediadores.es/dashboard'
        )
        if (success) sentCount++
      }
    }

    console.log(`[Automation] Win-back: Sent ${sentCount} emails`)
    return sentCount
  } catch (error) {
    console.error('[Automation] Error running win-back task:', error)
    return 0
  }
}

// =====================================================
// EXPORTS
// =====================================================

export const EmailAutomation = {
  // Welcome sequence
  sendWelcomeEmail1,
  sendWelcomeEmail2,
  sendWelcomeEmail3,

  // Renewal reminders
  sendRenewalReminder,

  // Win-back
  sendWinBackEmail,

  // Gamification
  sendLevelUpEmail,
  sendStreakAchievementEmail,

  // Automation tasks (cron)
  runWelcomeEmail2Task,
  runRenewalRemindersTask,
  runWinBackTask,
}

export default EmailAutomation
