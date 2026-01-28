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

interface PolicyRenewalEmailProps {
  userName?: string
  policyType?: string
  renewalDate?: string
  daysUntilRenewal?: number
  currentPremium?: string
  renewalUrl?: string
  discountPercentage?: number
}

export const PolicyRenewalEmail = ({
  userName = 'Cliente',
  policyType = 'Auto',
  renewalDate = '15 de Febrero de 2026',
  daysUntilRenewal = 30,
  currentPremium = '45€',
  renewalUrl = 'https://app.sorianomediadores.es/policies/renew',
  discountPercentage = 10,
}: PolicyRenewalEmailProps) => {
  const getUrgencyColor = () => {
    if (daysUntilRenewal <= 7) return '#ef4444' // red
    if (daysUntilRenewal <= 15) return '#f97316' // orange
    return '#3b82f6' // blue
  }

  const getUrgencyMessage = () => {
    if (daysUntilRenewal <= 7) return '⚠️ ¡ÚLTIMA SEMANA!'
    if (daysUntilRenewal <= 15) return '⏰ ¡Quedan solo 2 semanas!'
    return '📅 Tu póliza vence pronto'
  }

  const urgencyColor = getUrgencyColor()
  const urgencyMessage = getUrgencyMessage()

  return (
    <Html>
      <Head />
      <Preview>
        Tu póliza de {policyType} vence en {daysUntilRenewal} días - Renueva con {discountPercentage}% extra
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Urgency Banner */}
          <Section style={{ ...urgencyBanner, backgroundColor: urgencyColor }}>
            <Text style={urgencyText}>{urgencyMessage}</Text>
          </Section>

          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Renovación de Póliza</Heading>
            <Text style={headerText}>
              Tu seguro de <strong>{policyType}</strong> necesita renovación
            </Text>
          </Section>

          {/* Main content */}
          <Section style={content}>
            <Text style={paragraph}>
              Hola <strong>{userName}</strong>,
            </Text>

            <Text style={paragraph}>
              Te recordamos que tu póliza de <strong>Seguro de {policyType}</strong> vence el{' '}
              <strong>{renewalDate}</strong> (en <strong style={{ color: urgencyColor }}>{daysUntilRenewal} días</strong>).
            </Text>

            {/* Policy Info Box */}
            <Section style={infoBox}>
              <Text style={infoTitle}>📋 Detalles de tu Póliza</Text>
              <Hr style={hr} />
              <table style={{ width: '100%' }}>
                <tr>
                  <td style={infoLabel}>Tipo:</td>
                  <td style={infoValue}>{policyType}</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Prima actual:</td>
                  <td style={infoValue}>{currentPremium}/mes</td>
                </tr>
                <tr>
                  <td style={infoLabel}>Vencimiento:</td>
                  <td style={infoValue}>{renewalDate}</td>
                </tr>
              </table>
            </Section>

            {/* Discount Offer */}
            <Section style={discountBox}>
              <Text style={discountTitle}>🎉 OFERTA EXCLUSIVA DE RENOVACIÓN</Text>
              <Text style={discountAmount}>{discountPercentage}% de Descuento Extra</Text>
              <Text style={discountSubtext}>
                Válido solo hasta el {renewalDate}
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={renewalUrl}>
                Renovar Ahora con Descuento
              </Button>
            </Section>

            <Hr style={hr} />

            {/* Benefits of Renewal */}
            <Text style={benefitsTitle}>
              ✨ Al renovar con nosotros obtienes:
            </Text>

            <ul style={benefitsList}>
              <li style={benefitsItem}>
                ✓ {discountPercentage}% de descuento adicional por renovación anticipada
              </li>
              <li style={benefitsItem}>
                ✓ Sin interrupciones en tu cobertura
              </li>
              <li style={benefitsItem}>
                ✓ Revisión gratuita de tus necesidades de seguro
              </li>
              <li style={benefitsItem}>
                ✓ Puntos extra en Soriano Club (500 XP + 200 COINS)
              </li>
              <li style={benefitsItem}>
                ✓ Prioridad en atención al cliente
              </li>
            </ul>

            <Hr style={hr} />

            {/* Urgency Message */}
            <Section style={warningBox}>
              <Text style={warningText}>
                ⏰ <strong>No esperes al último día.</strong> Si tu póliza expira sin renovación, quedarás sin cobertura y tendrás que pasar por un nuevo proceso de contratación, posiblemente con una prima más alta.
              </Text>
            </Section>

            <Text style={paragraph}>
              ¿Tienes dudas? Nuestro equipo está disponible 24/7 para ayudarte.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              📞 Atención al Cliente:{' '}
              <Link href="tel:+34900123456" style={footerLink}>
                900 123 456
              </Link>
            </Text>

            <Text style={footerText}>
              📧 Email:{' '}
              <Link href="mailto:renovaciones@sorianomediadores.es" style={footerLink}>
                renovaciones@sorianomediadores.es
              </Link>
            </Text>

            <Text style={footerText}>
              © {new Date().getFullYear()} Soriano Mediadores de Seguros. Todos los derechos reservados.
            </Text>

            <Text style={footerTextSmall}>
              <Link href="https://sorianomediadores.es/unsubscribe" style={footerLink}>
                Darme de baja
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default PolicyRenewalEmail

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

const urgencyBanner = {
  padding: '12px 20px',
  textAlign: 'center' as const,
}

const urgencyText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
}

const header = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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

const content = {
  padding: '30px',
}

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const infoBox = {
  backgroundColor: '#f6f9fc',
  border: '2px solid #e6ebf1',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const infoTitle = {
  color: '#32325d',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const infoLabel = {
  color: '#8898aa',
  fontSize: '14px',
  padding: '5px 0',
}

const infoValue = {
  color: '#32325d',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  padding: '5px 0',
}

const discountBox = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '8px',
  padding: '24px',
  margin: '20px 0',
  textAlign: 'center' as const,
}

const discountTitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  letterSpacing: '1px',
}

const discountAmount = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '10px 0',
}

const discountSubtext = {
  color: '#d1fae5',
  fontSize: '14px',
  margin: '10px 0 0',
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
  margin: '20px 0',
}

const benefitsTitle = {
  color: '#32325d',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
}

const benefitsList = {
  paddingLeft: '20px',
  margin: '0',
}

const benefitsItem = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '28px',
  marginBottom: '8px',
}

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '2px solid #fbbf24',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
}

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
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
