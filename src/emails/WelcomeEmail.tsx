import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  userName?: string
  verificationUrl?: string
}

export const WelcomeEmail = ({
  userName = 'Cliente',
  verificationUrl = 'https://app.sorianomediadores.es/verify',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bienvenido a Soriano Mediadores - Verifica tu cuenta</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with gradient */}
        <Section style={header}>
          <Heading style={h1}>🎉 ¡Bienvenido a Soriano!</Heading>
          <Text style={headerText}>
            Estamos encantados de tenerte con nosotros
          </Text>
        </Section>

        {/* Main content */}
        <Section style={content}>
          <Text style={paragraph}>
            Hola <strong>{userName}</strong>,
          </Text>

          <Text style={paragraph}>
            Gracias por registrarte en <strong>Soriano Mediadores</strong>, tu plataforma de seguros más inteligente.
          </Text>

          <Text style={paragraph}>
            Para comenzar a disfrutar de todos nuestros beneficios, por favor verifica tu cuenta haciendo clic en el botón de abajo:
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verificar mi Cuenta
            </Button>
          </Section>

          <Text style={paragraph}>
            O copia y pega este enlace en tu navegador:
          </Text>
          <Text style={link}>
            <Link href={verificationUrl}>{verificationUrl}</Link>
          </Text>

          <Hr style={hr} />

          {/* Benefits Section */}
          <Text style={benefitsTitle}>
            ✨ Qué puedes hacer ahora:
          </Text>

          <ul style={benefitsList}>
            <li style={benefitsItem}>
              🏆 <strong>Sube de nivel</strong> y desbloquea descuentos hasta 20%
            </li>
            <li style={benefitsItem}>
              🎮 <strong>Gana puntos</strong> con quizzes diarios y misiones
            </li>
            <li style={benefitsItem}>
              💰 <strong>Compara</strong> +20 aseguradoras en segundos
            </li>
            <li style={benefitsItem}>
              📊 <strong>Gestiona</strong> todas tus pólizas en un solo lugar
            </li>
            <li style={benefitsItem}>
              🎁 <strong>Canjea</strong> tus coins por recompensas exclusivas
            </li>
          </ul>

          <Hr style={hr} />

          {/* Trust signals */}
          <Section style={trustSection}>
            <Text style={trustText}>
              <strong>✓ Sin compromiso</strong> · <strong>✓ Cancelación gratuita</strong> · <strong>✓ Soporte 24/7</strong>
            </Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            ¿Necesitas ayuda?{' '}
            <Link href="mailto:soporte@sorianomediadores.es" style={footerLink}>
              soporte@sorianomediadores.es
            </Link>
          </Text>

          <Text style={footerText}>
            © {new Date().getFullYear()} Soriano Mediadores de Seguros. Todos los derechos reservados.
          </Text>

          <Text style={footerTextSmall}>
            Recibes este email porque te registraste en Soriano Mediadores.
            {' '}
            <Link href="https://sorianomediadores.es/unsubscribe" style={footerLink}>
              Darme de baja
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 30px',
  borderRadius: '10px 10px 0 0',
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

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
}

const link = {
  color: '#667eea',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
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

const trustSection = {
  textAlign: 'center' as const,
  padding: '20px',
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
}

const trustText = {
  color: '#32325d',
  fontSize: '14px',
  margin: '0',
}

const footer = {
  padding: '0 30px',
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
  color: '#667eea',
  textDecoration: 'underline',
}
