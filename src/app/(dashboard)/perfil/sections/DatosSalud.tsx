'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Heart, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const datosSaludSchema = z.object({
  grupoSanguineo: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'desconocido']).optional(),
  alergias: z.string().max(500).optional(),
  condicionesMedicas: z.string().max(500).optional(),
  medicacionHabitual: z.string().max(500).optional(),
  contactoEmergenciaNombre: z.string().min(2).optional(),
  contactoEmergenciaTelefono: z.string().min(9).optional(),
  contactoEmergenciaRelacion: z.string().optional(),
})

type DatosSalud = z.infer<typeof datosSaludSchema>

const initialData: DatosSalud = {
  grupoSanguineo: 'desconocido',
  alergias: '',
  condicionesMedicas: '',
  medicacionHabitual: '',
  contactoEmergenciaNombre: '',
  contactoEmergenciaTelefono: '',
  contactoEmergenciaRelacion: '',
}

export function SectionDatosSalud() {
  const [data, setData] = useState<DatosSalud>(initialData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosSaludSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos de salud guardados correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos de Salud</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Información médica importante (opcional y confidencial)</p>
        </div>
      </div>

      <div className="mb-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong>Información confidencial:</strong> Estos datos son opcionales y se utilizan únicamente para emergencias y para ofrecerte seguros de salud más adecuados.
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Grupo Sanguíneo
          </label>
          <select
            name="grupoSanguineo"
            value={data.grupoSanguineo}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="desconocido">No lo sé</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Alergias Conocidas
          </label>
          <textarea
            name="alergias"
            value={data.alergias}
            onChange={handleChange}
            placeholder="Ej: Polen, penicilina, frutos secos..."
            className="input w-full min-h-[80px]"
            maxLength={500}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Condiciones Médicas Relevantes
          </label>
          <textarea
            name="condicionesMedicas"
            value={data.condicionesMedicas}
            onChange={handleChange}
            placeholder="Ej: Diabetes, hipertensión, asma..."
            className="input w-full min-h-[80px]"
            maxLength={500}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Medicación Habitual
          </label>
          <textarea
            name="medicacionHabitual"
            value={data.medicacionHabitual}
            onChange={handleChange}
            placeholder="Ej: Omeprazol 20mg, Enalapril 10mg..."
            className="input w-full min-h-[80px]"
            maxLength={500}
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>Contacto de Emergencia</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Nombre Completo
            </label>
            <input
              type="text"
              name="contactoEmergenciaNombre"
              value={data.contactoEmergenciaNombre}
              onChange={handleChange}
              placeholder="Nombre del contacto"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Teléfono
            </label>
            <input
              type="tel"
              name="contactoEmergenciaTelefono"
              value={data.contactoEmergenciaTelefono}
              onChange={handleChange}
              placeholder="666 123 456"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Relación
            </label>
            <input
              type="text"
              name="contactoEmergenciaRelacion"
              value={data.contactoEmergenciaRelacion}
              onChange={handleChange}
              placeholder="Ej: Cónyuge, Hijo/a, Padre/Madre"
              className="input w-full"
            />
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
          <Heart className="w-4 h-4 mr-2" />
        )}
        Guardar datos de salud
      </motion.button>
    </motion.div>
  )
}
