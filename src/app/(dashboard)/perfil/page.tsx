'use client'

/**
 * PERFIL DE USUARIO - Versión Optimizada
 * Formulario simplificado sin animaciones pesadas
 */

import { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Save, Camera, Briefcase,
  Users, CreditCard, GraduationCap, Car, Home, Shield
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ProfileData {
  // Personal
  nombre: string
  apellido1: string
  apellido2: string
  dni: string
  fechaNacimiento: string
  genero: string
  estadoCivil: string

  // Contacto
  emailPrincipal: string
  telefonoMovil: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string

  // Laboral
  situacionLaboral: string
  profesion: string
  empresa: string
  ingresosAnuales: string

  // Familiar
  numeroHijos: number
  personasACargo: number
  tieneMascotas: boolean

  // Vivienda
  tipoVivienda: string
  regimen: string
  metrosCuadrados: number

  // Vehículo
  tieneVehiculo: boolean
  marca: string
  modelo: string
}

const initialData: ProfileData = {
  nombre: 'Juan',
  apellido1: 'García',
  apellido2: 'López',
  dni: '12345678A',
  fechaNacimiento: '1985-06-15',
  genero: 'hombre',
  estadoCivil: 'casado',
  emailPrincipal: 'juan.garcia@email.com',
  telefonoMovil: '666123456',
  direccion: 'Calle Mayor 15',
  codigoPostal: '03570',
  ciudad: 'Villajoyosa',
  provincia: 'Alicante',
  situacionLaboral: 'empleado',
  profesion: 'Ingeniero de Software',
  empresa: 'Tech Solutions S.L.',
  ingresosAnuales: '25k_40k',
  numeroHijos: 2,
  personasACargo: 0,
  tieneMascotas: false,
  tipoVivienda: 'piso',
  regimen: 'propiedad',
  metrosCuadrados: 90,
  tieneVehiculo: true,
  marca: 'Toyota',
  modelo: 'Corolla',
}

export default function PerfilPage() {
  const { user } = useStore()
  const [formData, setFormData] = useState<ProfileData>(initialData)
  const [activeTab, setActiveTab] = useState('personal')
  const [saving, setSaving] = useState(false)

  const updateField = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      toast.error('Error al guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contacto', label: 'Contacto', icon: Mail },
    { id: 'laboral', label: 'Laboral', icon: Briefcase },
    { id: 'familiar', label: 'Familiar', icon: Users },
    { id: 'vivienda', label: 'Vivienda', icon: Home },
    { id: 'vehiculo', label: 'Vehículo', icon: Car },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Mi Perfil</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestiona tu información personal
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-occident text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-700">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-all',
                activeTab === tab.id
                  ? 'bg-occident text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos Personales</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="apellido1" className="block text-sm font-medium mb-2">Primer Apellido</label>
                <input
                  id="apellido1"
                  type="text"
                  value={formData.apellido1}
                  onChange={(e) => updateField('apellido1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="apellido2" className="block text-sm font-medium mb-2">Segundo Apellido</label>
                <input
                  id="apellido2"
                  type="text"
                  value={formData.apellido2}
                  onChange={(e) => updateField('apellido2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="dni" className="block text-sm font-medium mb-2">DNI/NIE</label>
                <input
                  id="dni"
                  type="text"
                  value={formData.dni}
                  onChange={(e) => updateField('dni', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium mb-2">Fecha de Nacimiento</label>
                <input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => updateField('fechaNacimiento', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="genero" className="block text-sm font-medium mb-2">Género</label>
                <select
                  id="genero"
                  value={formData.genero}
                  onChange={(e) => updateField('genero', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero_no_decir">Prefiero no decir</option>
                </select>
              </div>

              <div>
                <label htmlFor="estadoCivil" className="block text-sm font-medium mb-2">Estado Civil</label>
                <select
                  id="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={(e) => updateField('estadoCivil', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="soltero">Soltero/a</option>
                  <option value="casado">Casado/a</option>
                  <option value="divorciado">Divorciado/a</option>
                  <option value="viudo">Viudo/a</option>
                  <option value="pareja_de_hecho">Pareja de hecho</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacto' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos de Contacto</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emailPrincipal" className="block text-sm font-medium mb-2">Email Principal</label>
                <input
                  id="emailPrincipal"
                  type="email"
                  value={formData.emailPrincipal}
                  onChange={(e) => updateField('emailPrincipal', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="telefonoMovil" className="block text-sm font-medium mb-2">Teléfono Móvil</label>
                <input
                  id="telefonoMovil"
                  type="tel"
                  value={formData.telefonoMovil}
                  onChange={(e) => updateField('telefonoMovil', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="direccion" className="block text-sm font-medium mb-2">Dirección</label>
                <input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => updateField('direccion', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="codigoPostal" className="block text-sm font-medium mb-2">Código Postal</label>
                <input
                  id="codigoPostal"
                  type="text"
                  value={formData.codigoPostal}
                  onChange={(e) => updateField('codigoPostal', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium mb-2">Ciudad</label>
                <input
                  id="ciudad"
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => updateField('ciudad', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="provincia" className="block text-sm font-medium mb-2">Provincia</label>
                <input
                  id="provincia"
                  type="text"
                  value={formData.provincia}
                  onChange={(e) => updateField('provincia', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'laboral' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos Laborales</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="situacionLaboral" className="block text-sm font-medium mb-2">Situación Laboral</label>
                <select
                  id="situacionLaboral"
                  value={formData.situacionLaboral}
                  onChange={(e) => updateField('situacionLaboral', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="empleado">Empleado</option>
                  <option value="autonomo">Autónomo</option>
                  <option value="desempleado">Desempleado</option>
                  <option value="jubilado">Jubilado</option>
                  <option value="estudiante">Estudiante</option>
                </select>
              </div>

              <div>
                <label htmlFor="profesion" className="block text-sm font-medium mb-2">Profesión</label>
                <input
                  id="profesion"
                  type="text"
                  value={formData.profesion}
                  onChange={(e) => updateField('profesion', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="empresa" className="block text-sm font-medium mb-2">Empresa</label>
                <input
                  id="empresa"
                  type="text"
                  value={formData.empresa}
                  onChange={(e) => updateField('empresa', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label htmlFor="ingresosAnuales" className="block text-sm font-medium mb-2">Ingresos Anuales</label>
                <select
                  id="ingresosAnuales"
                  value={formData.ingresosAnuales}
                  onChange={(e) => updateField('ingresosAnuales', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="menos_15k">Menos de 15.000€</option>
                  <option value="15k_25k">15.000€ - 25.000€</option>
                  <option value="25k_40k">25.000€ - 40.000€</option>
                  <option value="40k_60k">40.000€ - 60.000€</option>
                  <option value="mas_60k">Más de 60.000€</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'familiar' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos Familiares</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="numeroHijos" className="block text-sm font-medium mb-2">Número de Hijos</label>
                <input
                  id="numeroHijos"
                  type="number"
                  value={formData.numeroHijos}
                  onChange={(e) => updateField('numeroHijos', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="personasACargo" className="block text-sm font-medium mb-2">Personas a Cargo</label>
                <input
                  id="personasACargo"
                  type="number"
                  value={formData.personasACargo}
                  onChange={(e) => updateField('personasACargo', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="tieneMascotas" className="flex items-center gap-3">
                  <input
                    id="tieneMascotas"
                    type="checkbox"
                    checked={formData.tieneMascotas}
                    onChange={(e) => updateField('tieneMascotas', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Tengo mascotas</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vivienda' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos de Vivienda</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipoVivienda" className="block text-sm font-medium mb-2">Tipo de Vivienda</label>
                <select
                  id="tipoVivienda"
                  value={formData.tipoVivienda}
                  onChange={(e) => updateField('tipoVivienda', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="piso">Piso</option>
                  <option value="casa">Casa</option>
                  <option value="chalet">Chalet</option>
                  <option value="atico">Ático</option>
                  <option value="duplex">Dúplex</option>
                </select>
              </div>

              <div>
                <label htmlFor="regimen" className="block text-sm font-medium mb-2">Régimen</label>
                <select
                  id="regimen"
                  value={formData.regimen}
                  onChange={(e) => updateField('regimen', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="propiedad">Propiedad</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>

              <div>
                <label htmlFor="metrosCuadrados" className="block text-sm font-medium mb-2">Metros Cuadrados</label>
                <input
                  id="metrosCuadrados"
                  type="number"
                  value={formData.metrosCuadrados}
                  onChange={(e) => updateField('metrosCuadrados', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehiculo' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Datos del Vehículo</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="tieneVehiculo" className="flex items-center gap-3">
                  <input
                    id="tieneVehiculo"
                    type="checkbox"
                    checked={formData.tieneVehiculo}
                    onChange={(e) => updateField('tieneVehiculo', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-medium">Tengo vehículo</span>
                </label>
              </div>

              {formData.tieneVehiculo && (
                <>
                  <div>
                    <label htmlFor="marca" className="block text-sm font-medium mb-2">Marca</label>
                    <input
                      id="marca"
                      type="text"
                      value={formData.marca}
                      onChange={(e) => updateField('marca', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="modelo" className="block text-sm font-medium mb-2">Modelo</label>
                    <input
                      id="modelo"
                      type="text"
                      value={formData.modelo}
                      onChange={(e) => updateField('modelo', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
