import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Soriano Mediadores',
  description: 'Política de privacidad y protección de datos de Soriano Mediadores de Seguros S.L.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <LandingHeader />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Política de Privacidad
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Última actualización: Enero 2024
            </p>

            <h2>1. Responsable del Tratamiento</h2>
            <p>
              <strong>Soriano Mediadores de Seguros S.L.</strong><br />
              CIF: B-XXXXXXXX<br />
              Dirección: Villajoyosa, 03570 Alicante<br />
              Email: info@sorianomediadores.es<br />
              Teléfono: 966 810 290
            </p>

            <h2>2. Finalidad del Tratamiento</h2>
            <p>Sus datos personales serán tratados con las siguientes finalidades:</p>
            <ul>
              <li>Gestión de la relación contractual de mediación de seguros</li>
              <li>Tramitación y gestión de pólizas de seguros</li>
              <li>Gestión de siniestros</li>
              <li>Envío de comunicaciones comerciales (con su consentimiento)</li>
              <li>Atención de consultas y solicitudes de información</li>
              <li>Cumplimiento de obligaciones legales</li>
            </ul>

            <h2>3. Legitimación</h2>
            <p>La base legal para el tratamiento de sus datos es:</p>
            <ul>
              <li>Ejecución del contrato de mediación de seguros</li>
              <li>Consentimiento del interesado para comunicaciones comerciales</li>
              <li>Cumplimiento de obligaciones legales (Ley de Mediación de Seguros)</li>
              <li>Interés legítimo para la mejora de nuestros servicios</li>
            </ul>

            <h2>4. Destinatarios</h2>
            <p>Sus datos podrán ser comunicados a:</p>
            <ul>
              <li>Compañías aseguradoras para la gestión de pólizas y siniestros</li>
              <li>Administraciones públicas cuando sea legalmente exigible</li>
              <li>Entidades financieras para la gestión de pagos</li>
            </ul>

            <h2>5. Derechos</h2>
            <p>Puede ejercer los siguientes derechos:</p>
            <ul>
              <li><strong>Acceso:</strong> Conocer qué datos tratamos sobre usted</li>
              <li><strong>Rectificación:</strong> Modificar datos inexactos</li>
              <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos</li>
              <li><strong>Oposición:</strong> Oponerse a determinados tratamientos</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
              <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento</li>
            </ul>
            <p>
              Para ejercer estos derechos, contacte con nosotros en{' '}
              <a href="mailto:privacidad@sorianomediadores.es">privacidad@sorianomediadores.es</a>
            </p>

            <h2>6. Conservación de Datos</h2>
            <p>
              Sus datos se conservarán mientras dure la relación contractual y, posteriormente,
              durante los plazos legales de prescripción de acciones (mínimo 5 años para documentación
              de seguros según la Ley de Contrato de Seguro).
            </p>

            <h2>7. Seguridad</h2>
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para garantizar
              la seguridad de sus datos personales, incluyendo cifrado, control de accesos
              y copias de seguridad.
            </p>

            <h2>8. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con el tratamiento de sus datos personales,
              puede contactar con nosotros en:
            </p>
            <p>
              <strong>Email:</strong> privacidad@sorianomediadores.es<br />
              <strong>Teléfono:</strong> 966 810 290<br />
              <strong>Dirección:</strong> Villajoyosa, 03570 Alicante
            </p>

            <p className="mt-8 text-sm text-slate-500">
              También puede presentar una reclamación ante la Agencia Española de Protección
              de Datos (www.aepd.es) si considera que sus derechos no han sido atendidos correctamente.
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
