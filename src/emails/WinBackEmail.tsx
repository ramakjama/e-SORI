import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WinBackEmailProps {
  userName?: string
  daysInactive?: number
  bonusCoins?: number
  discountPercentage?: number
  returnUrl?: string
  stage?: 1 | 2 | 3 // 14 days, 30 days, 60 days
}

export const WinBackEmail = ({
  userName = 'Cliente',
  daysInactive = 14,
  bonusCoins = 100,
  discountPercentage = 15,
  returnUrl = 'https://app.sorianomediadores.es/dashboard',
  stage = 1,
}: WinBackEmailProps) => {
  const getStageContent = () => {
    switch (stage) {
      case 1: // 14 days
        return {
          title: 'Te echamos de menos... 😢',
          subtitle: 'Han pasado 2 semanas desde tu última visita',
          message: `Hola ${userName}, hace ${daysInactive} días que no te vemos por aquí y te echamos de menos.`,
          bonus: `¡Tenemos ${bonusCoins} COINS gratis esperándote!`,
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        }
      case 2: // 30 days
        return {
          title: '¿Todo bien? Mira lo que te has perdido 🎁',
          subtitle: 'Un mes sin verte... ¡Vuelve y descubre las novedades!',
          message: `${userName}, ha pasado un mes desde tu última visita. Hemos añadido nuevas funciones que creemos que te encantarán.`,
          bonus: `Descuento especial del ${discountPercentage}% + ${bonusCoins} COINS de regalo`,
          gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        }
      case 3: // 60 days
        return {
          title: 'Tu última oportunidad de volver con beneficios VIP 👑',
          subtitle: 'Oferta exclusiva: Solo para ti durante 48 horas',
          message: `${userName}, hace mucho que no nos visitamos. Esta es tu última oportunidad de volver con beneficios exclusivos que nunca volverás a ver.`,
          bonus: `REGALO: Nivel ORO GRATIS + ${discountPercentage}% de descuento + ${bonusCoins} COINS`,
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        }
    }
  }

  const content = getStageContent()

  return (
    <Html>
      <Head />
      <Preview>{content.title} - Vuelve y recibe {bonusCoins} COINS gratis</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with gradient */}
          <Section style={{ ...header, background: content.gradient }}>
            <Heading style={h1}>{content.title}</Heading>
            <Text style={headerText}>{content.subtitle}</Text>
          </Section>

          {/* Main content */}
          <Section style={contentSection}>
            <Text style={paragraph}>{content.message}</Text>

            {/* Gift Box */}
            <Section style={giftBox}>
              <Text style={giftIcon}>🎁</Text>
              <Text style={giftTitle}>Regalo Especial de Bienvenida</Text>
              <Text style={giftContent}>{content.bonus}</Text>
              {stage === 3 && (
                <Text style={urgencyText}>
                  ⏰ Solo disponible durante 48 horas
                </Text>
              )}
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={returnUrl}>
                Reclamar mi Regalo Ahora
              </Button>
            </Section>

            <Hr style={hr} />

            {/* What's New */}
            <Text style={whatsNewTitle}>✨ Novedades desde tu última visita:</Text>

            <ul style={featuresList}>
              {stage >= 1 && (
                <>
                  <li style={featuresItem}>
                    🎮 <strong>Quizzes diarios mejorados</strong> - Gana hasta 100 XP por día
                  </li>
                  <li style={featuresItem}>
                    🎡 <strong>Rueda de la fortuna</strong> - Premios sorpresa cada día
                  </li>
                </>
              )}
              {stage >= 2 && (
                <>
                  <li style={featuresItem}>
                    🏆 <strong>Nuevo sistema de logros</strong> - Desbloquea 20+ achievements
                  </li>
                  <li style={featuresItem}>
                    💬 <strong>Chat con IA mejorado</strong> - Respuestas más precisas
                  </li>
                </>
              )}
              {stage >= 3 && (
                <>
                  <li style={featuresItem}>
                    👥 <strong>Programa de referidos 2.0</strong> - Gana más por cada amigo
                  </li>
                  <li style={featuresItem}>
                    🛍️ <strong>Marketplace ampliado</strong> - Nuevos productos canjeables
                  </li>
                </>
              )}
            </ul>

            <Hr style={hr} />

            {/* User Stats (if applicable) */}
            {stage >= 2 && (
              <Section style={statsBox}>
                <Text style={statsTitle}>📊 Tu Progreso Guardado</Text>
                <table style={{ width: '100%', marginTop: '15px' }}>
                  <tr>
                    <td style={statLabel}>Nivel:</td>
                    <td style={statValue}>Plata</td>
                  </tr>
                  <tr>
                    <td style={statLabel}>XP acumulado:</td>
                    <td style={statValue}>2,450 XP</td>
                  </tr>
                  <tr>
                    <td style={statLabel}>Coins disponibles:</td>
                    <td style={statValue}>850 COINS</td>
                  </tr>
                  <tr>
                    <td style={statLabel}>Racha máxima:</td>
                    <td style={statValue}>12 días 🔥</td>
                  </tr>
                </table>
                <Text style={statsFootnote}>
                  ¡No pierdas todo tu progreso! Vuelve ahora y continúa donde lo dejaste.
                </Text>
              </Section>
            )}

            {/* Testimonial */}
            <Section style={testimonialBox}>
              <Text style={testimonialQuote}>
                "Volví después de un mes y me sorprendió todo lo que había mejorado. El sistema de gamificación es adictivo y además ahorré 200€ en mi seguro. ¡100% recomendado!"
              </Text>
              <Text style={testimonialAuthor}>
                - María G., Cliente desde 2025
              </Text>
            </Section>

            {/* Final CTA */}
            <Section style={finalCta}>
              <Text style={finalCtaText}>
                No dejes pasar esta oportunidad. {stage === 3 ? 'Es tu última chance de volver con estos beneficios exclusivos.' : 'Cuanto antes vuelvas, más beneficios acumularás.'}
              </Text>
              <Button style={{ ...button, marginTop: '20px' }} href={returnUrl}>
                Volver a Soriano Ahora
              </Button>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              ¿Necesitas ayuda para volver?{' '}
              <Link href="mailto:soporte@sorianomediadores.es" style={footerLink}>
                soporte@sorianomediadores.es
              </Link>
            </Text>

            <Text style={footerText}>
              © {new Date().getFullYear()} Soriano Mediadores de Seguros. Todos los derechos reservados.
            </Text>

            <Text style={footerTextSmall}>
              Si prefieres no recibir más emails de reactivación,{' '}
              <Link href="https://sorianomediadores.es/unsubscribe" style={footerLink}>
                haz clic aquí
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WinBackEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const headerText = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '10px 0 0',
}

const contentSection = {
  padding: '30px',
}

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const giftBox = {
  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  borderRadius: '12px',
  padding: '30px',
  margin: '30px 0',
  textAlign: 'center' as const,
  border: '2px solid #fbbf24',
}

const giftIcon = {
  fontSize: '48px',
  margin: '0',
}

const giftTitle = {
  color: '#92400e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '10px 0',
}

const giftContent = {
  color: '#78350f',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '10px 0',
}

const urgencyText = {
  color: '#ef4444',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '15px 0 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const whatsNewTitle = {
  color: '#32325d',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 15px',
}

const featuresList = {
  paddingLeft: '20px',
  margin: '0',
}

const featuresItem = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '28px',
  marginBottom: '8px',
}

const statsBox = {
  backgroundColor: '#f6f9fc',
  border: '2px solid #e6ebf1',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const statsTitle = {
  color: '#32325d',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const statLabel = {
  color: '#8898aa',
  fontSize: '14px',
  padding: '5px 0',
}

const statValue = {
  color: '#32325d',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  padding: '5px 0',
}

const statsFootnote = {
  color: '#8898aa',
  fontSize: '13px',
  marginTop: '15px',
  fontStyle: 'italic' as const,
}

const testimonialBox = {
  backgroundColor: '#eff6ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const testimonialQuote = {
  color: '#1e40af',
  fontSize: '15px',
  lineHeight: '24px',
  fontStyle: 'italic' as const,
  margin: '0',
}

const testimonialAuthor = {
  color: '#3b82f6',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '10px 0 0',
  textAlign: 'right' as const,
}

const finalCta = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '25px',
  margin: '30px 0',
  textAlign: 'center' as const,
}

const finalCtaText = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
}

const footer = {
  padding: '0 30px 30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '10px 0',
}

const footerTextSmall = {
  color: '#aab7c4',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '10px 0',
}

const footerLink = {
  color: '#3b82f6',
  textDecoration: 'underline',
}
