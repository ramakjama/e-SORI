'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const footerNavigation = {
  seguros: [
    { name: 'Seguro de Auto', href: '/landing/seguro-auto' },
    { name: 'Seguro de Hogar', href: '/landing/seguro-hogar' },
    { name: 'Seguro de Salud', href: '/landing/seguro-salud' },
    { name: 'Seguro de Vida', href: '/landing/seguro-vida' },
    { name: 'Seguro de Decesos', href: '/landing/seguro-decesos' },
  ],
  club: [
    { name: 'Beneficios', href: '/club/beneficios' },
    { name: 'Programa Referidos', href: '/club/referidos' },
    { name: 'Ruleta de Premios', href: '/club/ruleta' },
    { name: 'Retos Mensuales', href: '/club/retos' },
  ],
  herramientas: [
    { name: 'Calculadora de Ahorro', href: '/herramientas/calculadora-ahorro' },
    { name: 'Comparador de Seguros', href: '/herramientas/comparador' },
    { name: 'Quiz: ¿Qué seguro necesitas?', href: '/herramientas/quiz-seguros' },
  ],
  legal: [
    { name: 'Aviso Legal', href: '/legal/aviso-legal' },
    { name: 'Política de Privacidad', href: '/legal/privacidad' },
    { name: 'Política de Cookies', href: '/legal/cookies' },
    { name: 'Términos y Condiciones', href: '/legal/terminos' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Twitter', href: '#', icon: Twitter },
]

export function LandingFooter() {
  return (
    <footer style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-occident to-occident-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">
                ¿Listo para proteger lo que más importa?
              </h3>
              <p className="mt-2 text-white/80">
                Calcula tu precio en menos de 2 minutos y descubre cuánto puedes ahorrar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/herramientas/calculadora-ahorro"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-occident bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Calcular Precio Gratis
              </Link>
              <a
                href="tel:+34900123456"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border-2 border-white rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <Phone className="w-5 h-5" />
                Llámanos
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-occident to-occident-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <span className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Soriano
                </span>
                <span className="text-xl font-light text-occident"> Mediadores</span>
              </div>
            </Link>
            <p className="mt-4 text-sm max-w-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Más de 25 años protegiendo a familias y empresas. Tu correduría de seguros de
              confianza con las mejores coberturas al mejor precio.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="tel:+34900123456"
                className="flex items-center gap-3 text-sm hover:text-occident transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Phone className="w-4 h-4 text-occident" />
                900 123 456 (Gratuito)
              </a>
              <a
                href="mailto:info@sorianomediadores.com"
                className="flex items-center gap-3 text-sm hover:text-occident transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <Mail className="w-4 h-4 text-occident" />
                info@sorianomediadores.com
              </a>
              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <MapPin className="w-4 h-4 text-occident" />
                Calle Principal 123, Madrid
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-occident hover:text-white"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text-secondary)',
                  }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Seguros */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
              Seguros
            </h4>
            <ul className="space-y-3">
              {footerNavigation.seguros.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-occident transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Club & Herramientas */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
              Soriano Club
            </h4>
            <ul className="space-y-3">
              {footerNavigation.club.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-occident transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold uppercase tracking-wider mt-8 mb-4" style={{ color: 'var(--color-text)' }}>
              Herramientas
            </h4>
            <ul className="space-y-3">
              {footerNavigation.herramientas.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-occident transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text)' }}>
              Legal
            </h4>
            <ul className="space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-occident transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="mt-8">
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                Colaboramos con:
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-lg" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
                  Occident
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
                  Mapfre
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-lg" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
                  AXA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            © {new Date().getFullYear()} Soriano Mediadores de Seguros S.L. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Inscrita en la DGS con clave J-0000 | CIF: B-12345678
          </p>
        </div>
      </div>
    </footer>
  )
}
