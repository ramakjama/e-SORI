import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Política de Cookies | Soriano Mediadores',
  description: 'Información sobre el uso de cookies en el sitio web de Soriano Mediadores de Seguros.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <LandingHeader />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Política de Cookies
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Última actualización: Enero 2024
            </p>

            <h2>1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo
              cuando visita un sitio web. Se utilizan para recordar sus preferencias,
              mejorar su experiencia de navegación y proporcionar información estadística.
            </p>

            <h2>2. Tipos de Cookies que Utilizamos</h2>

            <h3>2.1 Cookies Técnicas (Necesarias)</h3>
            <p>
              Son esenciales para el funcionamiento del sitio web y no pueden desactivarse.
              Se utilizan para:
            </p>
            <ul>
              <li>Mantener la sesión del usuario</li>
              <li>Recordar preferencias de idioma</li>
              <li>Garantizar la seguridad del sitio</li>
              <li>Gestionar el consentimiento de cookies</li>
            </ul>

            <h3>2.2 Cookies de Preferencias</h3>
            <p>
              Permiten recordar sus preferencias, como el tema (claro/oscuro) o la configuración regional.
            </p>

            <h3>2.3 Cookies Analíticas</h3>
            <p>
              Nos ayudan a entender cómo los visitantes interactúan con el sitio web,
              recopilando información de forma anónima. Utilizamos:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> Para análisis de tráfico web</li>
            </ul>

            <h3>2.4 Cookies de Marketing</h3>
            <p>
              Se utilizan para mostrar publicidad relevante. En nuestra web NO utilizamos
              cookies de marketing de terceros.
            </p>

            <h2>3. Tabla de Cookies</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Duración</th>
                    <th>Finalidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>session_id</td>
                    <td>Técnica</td>
                    <td>Sesión</td>
                    <td>Identificador de sesión</td>
                  </tr>
                  <tr>
                    <td>theme</td>
                    <td>Preferencias</td>
                    <td>1 año</td>
                    <td>Tema claro/oscuro</td>
                  </tr>
                  <tr>
                    <td>cookie_consent</td>
                    <td>Técnica</td>
                    <td>1 año</td>
                    <td>Registro de consentimiento</td>
                  </tr>
                  <tr>
                    <td>_ga</td>
                    <td>Analítica</td>
                    <td>2 años</td>
                    <td>Google Analytics</td>
                  </tr>
                  <tr>
                    <td>_gid</td>
                    <td>Analítica</td>
                    <td>24 horas</td>
                    <td>Google Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>4. Gestión de Cookies</h2>
            <p>
              Puede configurar su navegador para rechazar cookies o para que le avise
              cuando se envíe una cookie. Sin embargo, si rechaza las cookies técnicas,
              algunas funcionalidades del sitio podrían no estar disponibles.
            </p>

            <h3>Cómo desactivar cookies en su navegador:</h3>
            <ul>
              <li>
                <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Opciones → Privacidad → Historial
              </li>
              <li>
                <strong>Safari:</strong> Preferencias → Privacidad
              </li>
              <li>
                <strong>Edge:</strong> Configuración → Cookies y permisos del sitio
              </li>
            </ul>

            <h2>5. Actualizaciones</h2>
            <p>
              Esta política puede actualizarse para reflejar cambios en nuestro uso de cookies.
              Le recomendamos revisarla periódicamente.
            </p>

            <h2>6. Contacto</h2>
            <p>
              Si tiene preguntas sobre nuestra política de cookies, puede contactarnos en:
            </p>
            <p>
              <strong>Email:</strong> privacidad@sorianomediadores.es<br />
              <strong>Teléfono:</strong> 966 810 290
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
