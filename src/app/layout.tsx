import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: 'e-SORI | Soriano Mediadores de Seguros',
    template: '%s | e-SORI',
  },
  description: 'Portal de clientes y empleados de Soriano Mediadores de Seguros. Gestiona tus pólizas, siniestros, documentos y disfruta del programa Soriano Club.',
  keywords: ['seguros', 'pólizas', 'siniestros', 'Costa Blanca', 'Villajoyosa', 'correduría seguros'],
  authors: [{ name: 'Soriano Mediadores de Seguros S.L.' }],
  creator: 'Soriano Mediadores',
  publisher: 'Soriano Mediadores de Seguros S.L.',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://esori.sorianomediadores.es',
    siteName: 'e-SORI',
    title: 'e-SORI | Soriano Mediadores de Seguros',
    description: 'Tu portal de seguros en la Costa Blanca. Gestiona tus pólizas, siniestros y mucho más.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-SORI | Soriano Mediadores',
    description: 'Portal de clientes y empleados de Soriano Mediadores de Seguros',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/logo-icon.svg',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider position="top-right">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--card-bg)',
                  color: 'var(--color-text)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                },
              }}
            />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
