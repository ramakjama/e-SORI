import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const metadata: Metadata = {
  title: 'Aviso Legal | Soriano Mediadores',
  description: 'Aviso legal e información corporativa de Soriano Mediadores de Seguros S.L.',
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <LandingHeader />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Aviso Legal
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Datos Identificativos</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios
              de la Sociedad de la Información y de Comercio Electrónico, se informa:
            </p>
            <ul>
              <li><strong>Denominación social:</strong> Soriano Mediadores de Seguros S.L.</li>
              <li><strong>CIF:</strong> B-XXXXXXXX</li>
              <li><strong>Domicilio social:</strong> Villajoyosa, 03570 Alicante</li>
              <li><strong>Teléfono:</strong> 966 810 290</li>
              <li><strong>Email:</strong> info@sorianomediadores.es</li>
              <li><strong>Inscripción:</strong> Registro Mercantil de Alicante</li>
            </ul>

            <h2>2. Actividad Profesional</h2>
            <p>
              Soriano Mediadores de Seguros S.L. es un <strong>Corredor de Seguros</strong> inscrito
              en el Registro Administrativo de Distribuidores de Seguros y Reaseguros de la
              Dirección General de Seguros y Fondos de Pensiones con el número J-XXXX.
            </p>
            <p>
              Puede verificar nuestra inscripción en:{' '}
              <a href="https://www.dgsfp.mineco.es" target="_blank" rel="noopener noreferrer">
                www.dgsfp.mineco.es
              </a>
            </p>

            <h2>3. Seguro de Responsabilidad Civil</h2>
            <p>
              Disponemos de un seguro de responsabilidad civil profesional y capacidad financiera
              conforme a lo establecido en la Ley 26/2006 de Mediación de Seguros y Reaseguros
              Privados y su normativa de desarrollo.
            </p>

            <h2>4. Objeto y Ámbito</h2>
            <p>
              Este sitio web tiene como finalidad ofrecer información sobre nuestros servicios
              de mediación de seguros, permitir la solicitud de presupuestos y facilitar la
              gestión de pólizas y siniestros a nuestros clientes.
            </p>

            <h2>5. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos de este sitio web (textos, imágenes, gráficos, logotipos,
              iconos, software) son propiedad de Soriano Mediadores de Seguros S.L. o de sus
              licenciantes, y están protegidos por la legislación sobre propiedad intelectual.
            </p>
            <p>
              Queda prohibida la reproducción, distribución, transformación o comunicación
              pública de estos contenidos sin autorización expresa.
            </p>

            <h2>6. Exclusión de Responsabilidad</h2>
            <p>
              Soriano Mediadores no se hace responsable de:
            </p>
            <ul>
              <li>Errores u omisiones en los contenidos de la web</li>
              <li>Falta de disponibilidad del sitio web</li>
              <li>Transmisión de virus o programas maliciosos</li>
              <li>Uso indebido de los contenidos por parte de terceros</li>
              <li>Contenidos de sitios web enlazados</li>
            </ul>

            <h2>7. Enlaces</h2>
            <p>
              Este sitio puede contener enlaces a páginas web de terceros. Soriano Mediadores
              no asume responsabilidad por el contenido de dichas páginas ni por los daños
              que pudieran derivarse de su acceso.
            </p>

            <h2>8. Legislación Aplicable</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para cualquier
              controversia, las partes se someten a los Juzgados y Tribunales de Alicante,
              renunciando a cualquier otro fuero que pudiera corresponderles.
            </p>

            <h2>9. Modificaciones</h2>
            <p>
              Soriano Mediadores se reserva el derecho de modificar este aviso legal en
              cualquier momento. Las modificaciones entrarán en vigor desde su publicación
              en el sitio web.
            </p>

            <p className="mt-8 text-sm text-slate-500">
              Última actualización: Enero 2024
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
