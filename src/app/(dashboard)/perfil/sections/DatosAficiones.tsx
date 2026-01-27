'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Sparkles, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const datosAficionesSchema = z.object({
  deportesPracticados: z.array(z.string()),
  frecuenciaDeporte: z.enum(['nunca', 'ocasional', 'semanal', 'diario']).optional(),
  viajesFrecuentes: z.boolean(),
  destinosFrecuentes: z.string().max(200).optional(),
  actividadesRiesgo: z.array(z.string()),
  hobbies: z.array(z.string()),
  vehiculosRecreacion: z.array(z.string()),
})

type DatosAficiones = z.infer<typeof datosAficionesSchema>

const initialData: DatosAficiones = {
  deportesPracticados: [],
  frecuenciaDeporte: 'ocasional',
  viajesFrecuentes: false,
  destinosFrecuentes: '',
  actividadesRiesgo: [],
  hobbies: [],
  vehiculosRecreacion: [],
}

export function SectionDatosAficiones() {
  const [data, setData] = useState<DatosAficiones>(initialData)
  const [loading, setLoading] = useState(false)

  const deportes = [
    'Fútbol', 'Baloncesto', 'Tenis', 'Pádel', 'Running', 'Ciclismo',
    'Natación', 'Gimnasio', 'Yoga', 'Pilates', 'Senderismo', 'Escalada'
  ]

  const actividadesRiesgo = [
    'Buceo', 'Paracaidismo', 'Ala delta', 'Parapente', 'Esquí', 'Snowboard',
    'Surf', 'Kitesurf', 'Motociclismo deportivo', 'Artes marciales', 'Boxeo'
  ]

  const hobbies = [
    'Lectura', 'Cine', 'Música', 'Fotografía', 'Pintura', 'Jardinería',
    'Cocina', 'Bricolaje', 'Videojuegos', 'Coleccionismo', 'Viajes', 'Tecnología'
  ]

  const vehiculos = [
    'Moto', 'Quad', 'Bicicleta eléctrica', 'Patinete eléctrico',
    'Barco', 'Jet ski', 'Caravana', 'Autocaravana'
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
      const result = datosAficionesSchema.safeParse(data)
      if (!result.success) {
        toast.error('Error en los datos')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Aficiones guardadas correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Aficiones y Estilo de Vida</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Información relevante para seguros personalizados</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Deportes que practicas
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {deportes.map(deporte => (
              <button
                key={deporte}
                type="button"
                onClick={() => setData(prev => ({
                  ...prev,
                  deportesPracticados: toggleArray(prev.deportesPracticados, deporte)
                }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  data.deportesPracticados.includes(deporte)
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-orange-300'
                }`}
              >
                {deporte}
              </button>
            ))}
          </div>
        </div>

        {data.deportesPracticados.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Frecuencia de práctica deportiva
            </label>
            <select
              value={data.frecuenciaDeporte}
              onChange={(e) => setData(prev => ({ ...prev, frecuenciaDeporte: e.target.value as any }))}
              className="input w-full max-w-md"
            >
              <option value="nunca">Nunca</option>
              <option value="ocasional">Ocasional (1-2 veces/mes)</option>
              <option value="semanal">Semanal (1-3 veces/semana)</option>
              <option value="diario">Diario o casi diario</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Actividades de riesgo
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {actividadesRiesgo.map(actividad => (
              <button
                key={actividad}
                type="button"
                onClick={() => setData(prev => ({
                  ...prev,
                  actividadesRiesgo: toggleArray(prev.actividadesRiesgo, actividad)
                }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  data.actividadesRiesgo.includes(actividad)
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
                }`}
              >
                {actividad}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.viajesFrecuentes}
              onChange={(e) => setData(prev => ({ ...prev, viajesFrecuentes: e.target.checked }))}
              className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600"
            />
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Viajo frecuentemente
            </span>
          </label>
        </div>

        {data.viajesFrecuentes && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Destinos frecuentes
            </label>
            <input
              type="text"
              value={data.destinosFrecuentes}
              onChange={(e) => setData(prev => ({ ...prev, destinosFrecuentes: e.target.value }))}
              placeholder="Ej: Europa, Asia, América..."
              className="input w-full"
              maxLength={200}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Hobbies e intereses
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {hobbies.map(hobby => (
              <button
                key={hobby}
                type="button"
                onClick={() => setData(prev => ({
                  ...prev,
                  hobbies: toggleArray(prev.hobbies, hobby)
                }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  data.hobbies.includes(hobby)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                {hobby}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Vehículos de recreación
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {vehiculos.map(vehiculo => (
              <button
                key={vehiculo}
                type="button"
                onClick={() => setData(prev => ({
                  ...prev,
                  vehiculosRecreacion: toggleArray(prev.vehiculosRecreacion, vehiculo)
                }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  data.vehiculosRecreacion.includes(vehiculo)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
                }`}
              >
                {vehiculo}
              </button>
            ))}
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
        Guardar aficiones
      </motion.button>
    </motion.div>
  )
}
