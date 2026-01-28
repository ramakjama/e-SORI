import { Metadata } from 'next'
import { CalculadoraAhorro } from '@/components/marketing/LeadMagnets/CalculadoraAhorro'

export const metadata: Metadata = {
  title: 'Calculadora de Ahorro en Seguros | Soriano Mediadores',
  description:
    'Descubre cuánto puedes ahorrar en tus seguros con nuestra calculadora gratuita. Compara precios y obtén un descuento exclusivo del 15%.',
  keywords: [
    'calculadora seguros',
    'ahorro seguros',
    'comparar seguros',
    'descuento seguros',
    'Soriano Mediadores',
  ],
  openGraph: {
    title: 'Calculadora de Ahorro en Seguros | Soriano Mediadores',
    description:
      'Descubre cuánto puedes ahorrar en tus seguros. Calcula tu ahorro potencial en 30 segundos.',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function CalculadoraAhorroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SM</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white hidden sm:inline">
                  Soriano Mediadores
                </span>
              </a>
            </div>
            <nav className="flex items-center gap-4">
              <a
                href="/herramientas/comparador"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Comparador
              </a>
              <a
                href="/login-cliente"
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Acceder
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Herramienta Gratuita
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Calcula Cuánto Puedes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Ahorrar
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubre tu ahorro potencial en menos de 30 segundos. Miles de clientes ya han reducido
            sus costes hasta un <strong>45%</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              100% Gratis
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Sin Compromiso
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Resultado Inmediato
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <CalculadoraAhorro
            onLeadCaptured={(data) => {
              console.log('Lead captured:', data)
              // Track with analytics
              if (typeof window !== 'undefined' && (window as any).gtag) {
                ;(window as any).gtag('event', 'lead_captured', {
                  event_category: 'calculator',
                  event_label: data.insuranceType,
                  value: data.savings?.percentage || 0,
                })
              }
            }}
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Más de 10,000 Clientes Confían en Nosotros
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Somos mediadores de seguros con más de 20 años de experiencia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">20+</div>
              <div className="text-gray-600 dark:text-gray-300">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-300">Satisfacción Cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Soriano Mediadores de Seguros. Todos los derechos
            reservados.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <a href="/legal/privacidad" className="text-gray-400 hover:text-white transition-colors">
              Privacidad
            </a>
            <a href="/legal/terminos" className="text-gray-400 hover:text-white transition-colors">
              Términos
            </a>
            <a href="/legal/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
