'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Settings, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const datosPreferenciasSchema = z.object({
  tiposSegurosInteres: z.array(z.string()).min(1),
  presupuestoMensual: z.enum(['menos_50', '50_100', '100_200', '200_500', 'mas_500']),
  coberturasPrioritarias: z.array(z.string()),
  frecuenciaRevision: z.enum(['mensual', 'trimestral', 'semestral', 'anual']),
  canalContactoPreferido: z.enum(['email', 'telefono', 'whatsapp', 'presencial']),
  horarioContacto: z.enum(['manana', 'tarde', 'noche', 'cualquiera']),
})

type DatosPreferencias = z.infer<typeof datosPreferenciasSchema>

const initialData: DatosPreferencias = {
  tiposSegurosInteres: [],
  presupuestoMensual: '100_200',
  coberturasPrioritarias: [],
  frecuenciaRevision: 'anual',
  canalContactoPreferido: 'email',
  horarioContacto: 'cualquiera',
}

export function SectionDatosPreferencias() {
  const [data, setData] = useState<DatosPreferencias>(initialData)
  const [loading, setLoading] = useState(false)

  const tiposSeguros = [
    { value: 'auto', label: 'Auto' },
    { value: 'hogar', label: 'Hogar' },
    { value: 'vida', label: 'Vida' },
    { value: 'salud', label: 'Salud' },
    { value: 'decesos', label: 'Decesos' },
    { value: 'mascotas', label: 'Mascotas' },
    { value: 'viajes', label: 'Viajes' },
    { value: 'rc_profesional', label: 'RC Profesional' },
  ]

  const coberturas = [
    { value: 'asistencia_24h', label: 'Asistencia 24h' },
    { value: 'franquicia_baja', label: 'Franquicia baja' },
    { value: 'cobertura_amplia', label: 'Cobertura amplia' },
    { value: 'precio_competitivo', label: 'Precio competitivo' },
    { value: 'atencion_personalizada', label: 'Atención personalizada' },
  ]

  const toggleArray = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(v => v !== value)
    }
    return [...array, value]
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosPreferenciasSchema.safeParse(data)
      if (!result.success) {
        toast.error('Por favor, selecciona al menos un tipo de seguro')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Preferencias guardadas correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Preferencias de Seguros</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Ayúdanos a ofrecerte las mejores opciones</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Tipos de seguros de interés <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {tiposSeguros.map(tipo => (
              <button
                key={tipo.value}
                type="button"
                onClick={() => setData(prev => ({
                  ...prev,
                  tiposSegurosInteres: toggleArray(prev.tiposSegurosInteres, tipo.value)
                }))}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                  data.tiposSegurosInteres.includes(tipo.value)
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Presupuesto mensual aproximado
          </label>
          <select
            value={data.presupuestoMensual}
            onChange={(e) => setData(prev => ({ ...prev, presupuestoMensual: e.target.value as any }))}
            className="input w-full"
          >
            <option value="menos_50">Menos de 50€/mes</option>
            <option value="50_100">50€ - 100€/mes</option>
            <option value="100_200">100€ - 200€/mes</option>
            <option value="200_500">200€ - 500€/mes</option>
            <option value="mas_500">Más de 500€/mes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Coberturas prioritarias
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coberturas.map(cobertura => (
              <button
                key={cobertura.value}
                type="button"
                onClick={() => setData(prev => ({
                  ...prev,
                  coberturasPrioritarias: toggleArray(prev.coberturasPrioritarias, cobertura.value)
                }))}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 text-left ${
                  data.coberturasPrioritarias.includes(cobertura.value)
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                }`}
              >
                {cobertura.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Frecuencia de revisión
            </label>
            <select
              value={data.frecuenciaRevision}
              onChange={(e) => setData(prev => ({ ...prev, frecuenciaRevision: e.target.value as any }))}
              className="input w-full"
            >
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="semestral">Semestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Canal de contacto preferido
            </label>
            <select
              value={data.canalContactoPreferido}
              onChange={(e) => setData(prev => ({ ...prev, canalContactoPreferido: e.target.value as any }))}
              className="input w-full"
            >
              <option value="email">Email</option>
              <option value="telefono">Teléfono</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={handleSave}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary mt-6"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <Save className="w-4 h-4 mr-2" />
        )}
        Guardar preferencias
      </motion.button>
    </motion.div>
  )
}
