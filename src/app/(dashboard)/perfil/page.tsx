'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import {
  User, Mail, Phone, MapPin, Save, Camera, Briefcase,
  Users, CreditCard, GraduationCap, Share2, Car, Home,
  Check, AlertCircle, ChevronRight, Heart, Clock, Shield
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@/components/ui/Tabs'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

// ============================================
// ZOD VALIDATION SCHEMAS
// ============================================

const datosPersonalesSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido1: z.string().min(2, 'El primer apellido es obligatorio'),
  apellido2: z.string().optional(),
  dni: z.string().min(1, 'El DNI/NIE es obligatorio'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  genero: z.enum(['hombre', 'mujer', 'otro', 'prefiero_no_decir'], {
    required_error: 'Selecciona una opción'
  }),
  nacionalidad: z.string().min(2, 'La nacionalidad es obligatoria'),
  estadoCivil: z.enum(['soltero', 'casado', 'divorciado', 'viudo', 'pareja_de_hecho'], {
    required_error: 'Selecciona una opción'
  }),
  fotoPerfil: z.string().optional(),
})

const datosContactoSchema = z.object({
  emailPrincipal: z.string().email('Email no válido'),
  emailSecundario: z.string().email('Email no válido').optional().or(z.literal('')),
  telefonoMovil: z.string().min(9, 'El teléfono móvil debe tener al menos 9 dígitos'),
  telefonoFijo: z.string().optional(),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  numeroPisoPuerta: z.string().optional(),
  codigoPostal: z.string().min(5, 'El código postal debe tener 5 dígitos'),
  ciudad: z.string().min(2, 'La ciudad es obligatoria'),
  provincia: z.string().min(2, 'La provincia es obligatoria'),
  pais: z.string().min(2, 'El país es obligatorio'),
})

const datosLaboralesSchema = z.object({
  situacionLaboral: z.enum(['empleado', 'autonomo', 'desempleado', 'jubilado', 'estudiante'], {
    required_error: 'Selecciona una opción'
  }),
  profesion: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  antiguedad: z.string().optional(),
  ingresosAnuales: z.enum([
    'menos_15k',
    '15k_25k',
    '25k_40k',
    '40k_60k',
    'mas_60k'
  ], {
    required_error: 'Selecciona un rango'
  }),
  sector: z.string().optional(),
})

const datosFamiliaresSchema = z.object({
  numeroHijos: z.number().min(0, 'El número no puede ser negativo'),
  edadesHijos: z.string().optional(),
  personasACargo: z.number().min(0, 'El número no puede ser negativo'),
  convivientesHogar: z.number().min(1, 'Debe haber al menos 1 conviviente'),
  tieneMascotas: z.boolean(),
  tipoMascotas: z.string().optional(),
  cantidadMascotas: z.number().min(0).optional(),
})

const datosFinancierosSchema = z.object({
  bancoPrincipal: z.string().optional(),
  iban: z.string().optional(),
  titularCuenta: z.string().optional(),
  formaPagoPreferida: z.enum(['domiciliacion', 'tarjeta', 'transferencia'], {
    required_error: 'Selecciona una opción'
  }),
})

const datosEducativosSchema = z.object({
  nivelEstudios: z.enum([
    'sin_estudios',
    'primaria',
    'eso',
    'bachillerato',
    'fp',
    'grado',
    'master',
    'doctorado'
  ], {
    required_error: 'Selecciona una opción'
  }),
  titulacion: z.string().optional(),
  centroEstudios: z.string().optional(),
})

const datosVehiculoSchema = z.object({
  matricula: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.string().optional(),
  tipoCombustible: z.enum([
    'gasolina',
    'diesel',
    'hibrido',
    'electrico'
  ]).optional(),
  usoVehiculo: z.enum(['particular', 'profesional', 'mixto']).optional(),
})

const datosViviendaSchema = z.object({
  tipoVivienda: z.enum([
    'piso',
    'casa',
    'chalet',
    'atico',
    'duplex'
  ]).optional(),
  metrosCuadrados: z.number().min(0).optional(),
  anoConstruccion: z.string().optional(),
  regimen: z.enum(['propiedad', 'alquiler']).optional(),
  tieneAlarma: z.boolean(),
  tienePiscina: z.boolean(),
})

const datosPreferenciasSchema = z.object({
  linkedinUrl: z.string().url('URL no válida').optional().or(z.literal('')),
  comoNosConociste: z.string().optional(),
  preferenciaComunicacion: z.array(z.enum(['email', 'sms', 'whatsapp', 'llamada'])),
  horarioPreferidoContacto: z.string().optional(),
})

// ============================================
// TYPE DEFINITIONS
// ============================================

type DatosPersonales = z.infer<typeof datosPersonalesSchema>
type DatosContacto = z.infer<typeof datosContactoSchema>
type DatosLaborales = z.infer<typeof datosLaboralesSchema>
type DatosFamiliares = z.infer<typeof datosFamiliaresSchema>
type DatosFinancieros = z.infer<typeof datosFinancierosSchema>
type DatosEducativos = z.infer<typeof datosEducativosSchema>
type DatosVehiculo = z.infer<typeof datosVehiculoSchema>
type DatosVivienda = z.infer<typeof datosViviendaSchema>
type DatosPreferencias = z.infer<typeof datosPreferenciasSchema>

interface FormErrors {
  [key: string]: string | undefined
}

// ============================================
// INITIAL DATA
// ============================================

const initialDatosPersonales: DatosPersonales = {
  nombre: 'Juan',
  apellido1: 'García',
  apellido2: 'López',
  dni: '12345678A',
  fechaNacimiento: '1985-06-15',
  genero: 'hombre',
  nacionalidad: 'Española',
  estadoCivil: 'casado',
  fotoPerfil: '',
}

const initialDatosContacto: DatosContacto = {
  emailPrincipal: 'juan.garcia@email.com',
  emailSecundario: '',
  telefonoMovil: '666123456',
  telefonoFijo: '',
  direccion: 'Calle Mayor 15',
  numeroPisoPuerta: '2º B',
  codigoPostal: '03570',
  ciudad: 'Villajoyosa',
  provincia: 'Alicante',
  pais: 'España',
}

const initialDatosLaborales: DatosLaborales = {
  situacionLaboral: 'empleado',
  profesion: 'Ingeniero de Software',
  empresa: 'Tech Solutions S.L.',
  cargo: 'Senior Developer',
  antiguedad: '5 años',
  ingresosAnuales: '25k_40k',
  sector: 'Tecnología',
}

const initialDatosFamiliares: DatosFamiliares = {
  numeroHijos: 2,
  edadesHijos: '8, 5',
  personasACargo: 0,
  convivientesHogar: 4,
  tieneMascotas: true,
  tipoMascotas: 'Perro',
  cantidadMascotas: 1,
}

const initialDatosFinancieros: DatosFinancieros = {
  bancoPrincipal: 'BBVA',
  iban: 'ES91 2100 **** **** **** 1234',
  titularCuenta: 'Juan García López',
  formaPagoPreferida: 'domiciliacion',
}

const initialDatosEducativos: DatosEducativos = {
  nivelEstudios: 'grado',
  titulacion: 'Ingeniería Informática',
  centroEstudios: 'Universidad de Alicante',
}

const initialDatosVehiculo: DatosVehiculo = {
  matricula: '1234 ABC',
  marca: 'Seat',
  modelo: 'Ibiza',
  ano: '2020',
  tipoCombustible: 'gasolina',
  usoVehiculo: 'particular',
}

const initialDatosVivienda: DatosVivienda = {
  tipoVivienda: 'piso',
  metrosCuadrados: 95,
  anoConstruccion: '2005',
  regimen: 'propiedad',
  tieneAlarma: true,
  tienePiscina: false,
}

const initialDatosPreferencias: DatosPreferencias = {
  linkedinUrl: 'https://linkedin.com/in/juangarcia',
  comoNosConociste: 'Recomendación de un amigo',
  preferenciaComunicacion: ['email', 'whatsapp'],
  horarioPreferidoContacto: 'Tarde (14:00 - 20:00)',
}

// ============================================
// REUSABLE FORM COMPONENTS
// ============================================

interface InputFieldProps {
  label: string
  name: string
  type?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  className?: string
}

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  disabled,
  required,
  placeholder,
  className
}: InputFieldProps) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500',
        'disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed',
        error
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
        'text-slate-900 dark:text-white placeholder:text-slate-400'
      )}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" /> {error}
      </motion.p>
    )}
  </div>
)

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
  className?: string
}

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  className
}: SelectFieldProps) => (
  <div className={className}>
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={cn(
        'w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500',
        error
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
        'text-slate-900 dark:text-white'
      )}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3" /> {error}
      </motion.p>
    )}
  </div>
)

interface CheckboxFieldProps {
  label: string
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckboxField = ({ label, name, checked, onChange }: CheckboxFieldProps) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div
        className={cn(
          'w-5 h-5 rounded border-2 transition-all duration-200',
          'flex items-center justify-center',
          checked
            ? 'bg-red-500 border-red-500'
            : 'border-slate-300 dark:border-slate-600 group-hover:border-red-400'
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    </div>
    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
      {label}
    </span>
  </label>
)

interface MultiCheckboxFieldProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
  required?: boolean
}

const MultiCheckboxField = ({ label, options, selected, onChange, required }: MultiCheckboxFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="flex flex-wrap gap-3">
      {options.map(opt => {
        const isSelected = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              if (isSelected) {
                onChange(selected.filter(v => v !== opt.value))
              } else {
                onChange([...selected, opt.value])
              }
            }}
            className={cn(
              'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2',
              'hover:scale-105 active:scale-95',
              isSelected
                ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25'
                : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'
            )}
            style={{ color: isSelected ? 'white' : 'var(--color-text)' }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  </div>
)

interface SaveButtonProps {
  onClick: () => void
  loading?: boolean
}

const SaveButton = ({ onClick, loading }: SaveButtonProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={loading}
    whileHover={{ scale: loading ? 1 : 1.02 }}
    whileTap={{ scale: loading ? 1 : 0.98 }}
    className={cn(
      'mt-8 px-6 py-3 rounded-xl font-semibold transition-all duration-200',
      'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'flex items-center gap-2'
    )}
  >
    {loading ? (
      <>
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Guardando...
      </>
    ) : (
      <>
        <Save className="w-4 h-4" />
        Guardar cambios
      </>
    )}
  </motion.button>
)

// ============================================
// TAB SECTION COMPONENTS
// ============================================

interface SectionDatosPersonalesProps {
  data: DatosPersonales
  setData: React.Dispatch<React.SetStateAction<DatosPersonales>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosPersonales = ({ data, setData, errors, setErrors }: SectionDatosPersonalesProps) => {
  const [loading, setLoading] = useState(false)
  const { user } = useStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosPersonalesSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos personales guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      {/* Foto de perfil */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center overflow-hidden shadow-xl">
            {data.fotoPerfil ? (
              <img src={data.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-2 border-red-500 text-red-500 flex items-center justify-center shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
            Foto de perfil
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            JPG, PNG o GIF. Máximo 2MB
          </p>
          <button
            type="button"
            className="text-sm text-red-500 hover:text-red-600 mt-2 font-medium hover:underline"
          >
            Cambiar foto
          </button>
        </div>
      </div>

      {/* Badge DNI no editable */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            DNI/NIE
          </span>
        </div>
        <p className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
          {data.dni}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          El DNI/NIE no es editable por seguridad
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <InputField
          label="Nombre"
          name="nombre"
          value={data.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />
        <InputField
          label="Primer Apellido"
          name="apellido1"
          value={data.apellido1}
          onChange={handleChange}
          error={errors.apellido1}
          required
        />
        <InputField
          label="Segundo Apellido"
          name="apellido2"
          value={data.apellido2 || ''}
          onChange={handleChange}
          error={errors.apellido2}
        />
        <InputField
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          value={data.fechaNacimiento}
          onChange={handleChange}
          error={errors.fechaNacimiento}
          required
        />
        <SelectField
          label="Género"
          name="genero"
          value={data.genero}
          onChange={handleChange}
          options={[
            { value: 'hombre', label: 'Hombre' },
            { value: 'mujer', label: 'Mujer' },
            { value: 'otro', label: 'Otro' },
            { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
          ]}
          error={errors.genero}
          required
        />
        <InputField
          label="Nacionalidad"
          name="nacionalidad"
          value={data.nacionalidad}
          onChange={handleChange}
          error={errors.nacionalidad}
          required
        />
        <SelectField
          label="Estado Civil"
          name="estadoCivil"
          value={data.estadoCivil}
          onChange={handleChange}
          options={[
            { value: 'soltero', label: 'Soltero/a' },
            { value: 'casado', label: 'Casado/a' },
            { value: 'divorciado', label: 'Divorciado/a' },
            { value: 'viudo', label: 'Viudo/a' },
            { value: 'pareja_de_hecho', label: 'Pareja de hecho' },
          ]}
          error={errors.estadoCivil}
          required
        />
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosContactoProps {
  data: DatosContacto
  setData: React.Dispatch<React.SetStateAction<DatosContacto>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosContacto = ({ data, setData, errors, setErrors }: SectionDatosContactoProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosContactoSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos de contacto guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <InputField
          label="Email Principal"
          name="emailPrincipal"
          type="email"
          value={data.emailPrincipal}
          onChange={handleChange}
          error={errors.emailPrincipal}
          required
        />
        <InputField
          label="Email Secundario"
          name="emailSecundario"
          type="email"
          value={data.emailSecundario || ''}
          onChange={handleChange}
          error={errors.emailSecundario}
        />
        <InputField
          label="Teléfono Móvil"
          name="telefonoMovil"
          type="tel"
          value={data.telefonoMovil}
          onChange={handleChange}
          error={errors.telefonoMovil}
          required
        />
        <InputField
          label="Teléfono Fijo"
          name="telefonoFijo"
          type="tel"
          value={data.telefonoFijo || ''}
          onChange={handleChange}
        />
      </div>

      <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <MapPin className="w-5 h-5 text-red-500" />
          Dirección
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <InputField
            label="Dirección"
            name="direccion"
            value={data.direccion}
            onChange={handleChange}
            error={errors.direccion}
            required
            placeholder="Calle, Avenida, Plaza..."
            className="md:col-span-2"
          />
          <InputField
            label="Número/Piso/Puerta"
            name="numeroPisoPuerta"
            value={data.numeroPisoPuerta || ''}
            onChange={handleChange}
            placeholder="Ej: 15, 2º B"
          />
          <InputField
            label="Código Postal"
            name="codigoPostal"
            value={data.codigoPostal}
            onChange={handleChange}
            error={errors.codigoPostal}
            required
          />
          <InputField
            label="Ciudad"
            name="ciudad"
            value={data.ciudad}
            onChange={handleChange}
            error={errors.ciudad}
            required
          />
          <InputField
            label="Provincia"
            name="provincia"
            value={data.provincia}
            onChange={handleChange}
            error={errors.provincia}
            required
          />
          <InputField
            label="País"
            name="pais"
            value={data.pais}
            onChange={handleChange}
            error={errors.pais}
            required
          />
        </div>
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosLaboralesProps {
  data: DatosLaborales
  setData: React.Dispatch<React.SetStateAction<DatosLaborales>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosLaborales = ({ data, setData, errors, setErrors }: SectionDatosLaboralesProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosLaboralesSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos laborales guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <SelectField
          label="Situación Laboral"
          name="situacionLaboral"
          value={data.situacionLaboral}
          onChange={handleChange}
          options={[
            { value: 'empleado', label: 'Empleado/a' },
            { value: 'autonomo', label: 'Autónomo/a' },
            { value: 'desempleado', label: 'Desempleado/a' },
            { value: 'jubilado', label: 'Jubilado/a' },
            { value: 'estudiante', label: 'Estudiante' },
          ]}
          error={errors.situacionLaboral}
          required
        />
        <InputField
          label="Profesión"
          name="profesion"
          value={data.profesion || ''}
          onChange={handleChange}
        />
        <InputField
          label="Empresa"
          name="empresa"
          value={data.empresa || ''}
          onChange={handleChange}
        />
        <InputField
          label="Cargo"
          name="cargo"
          value={data.cargo || ''}
          onChange={handleChange}
        />
        <InputField
          label="Antigüedad"
          name="antiguedad"
          value={data.antiguedad || ''}
          onChange={handleChange}
          placeholder="Ej: 5 años"
        />
        <SelectField
          label="Ingresos Anuales"
          name="ingresosAnuales"
          value={data.ingresosAnuales}
          onChange={handleChange}
          options={[
            { value: 'menos_15k', label: '< 15.000 EUR' },
            { value: '15k_25k', label: '15.000 - 25.000 EUR' },
            { value: '25k_40k', label: '25.000 - 40.000 EUR' },
            { value: '40k_60k', label: '40.000 - 60.000 EUR' },
            { value: 'mas_60k', label: '> 60.000 EUR' },
          ]}
          error={errors.ingresosAnuales}
          required
        />
        <InputField
          label="Sector"
          name="sector"
          value={data.sector || ''}
          onChange={handleChange}
          placeholder="Ej: Tecnología, Salud, Educación..."
        />
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosFamiliaresProps {
  data: DatosFamiliares
  setData: React.Dispatch<React.SetStateAction<DatosFamiliares>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosFamiliares = ({ data, setData, errors, setErrors }: SectionDatosFamiliaresProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'number' ? parseInt(value) || 0 : value
    setData(prev => ({ ...prev, [name]: finalValue }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosFamiliaresSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos familiares guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <InputField
          label="Número de Hijos"
          name="numeroHijos"
          type="number"
          value={data.numeroHijos}
          onChange={handleChange}
          error={errors.numeroHijos}
        />
        <InputField
          label="Edades de los Hijos"
          name="edadesHijos"
          value={data.edadesHijos || ''}
          onChange={handleChange}
          placeholder="Ej: 8, 5, 3"
        />
        <InputField
          label="Personas a Cargo"
          name="personasACargo"
          type="number"
          value={data.personasACargo}
          onChange={handleChange}
          error={errors.personasACargo}
        />
        <InputField
          label="Convivientes en el Hogar"
          name="convivientesHogar"
          type="number"
          value={data.convivientesHogar}
          onChange={handleChange}
          error={errors.convivientesHogar}
          required
        />
      </div>

      <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-semibold text-lg mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Heart className="w-5 h-5 text-red-500" />
          Mascotas
        </h3>
        <div className="mb-6">
          <CheckboxField
            label="Tengo mascotas"
            name="tieneMascotas"
            checked={data.tieneMascotas}
            onChange={handleCheckbox}
          />
        </div>
        <AnimatePresence>
          {data.tieneMascotas && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
            >
              <InputField
                label="Tipo de Mascotas"
                name="tipoMascotas"
                value={data.tipoMascotas || ''}
                onChange={handleChange}
                placeholder="Ej: Perro, Gato..."
              />
              <InputField
                label="Cantidad"
                name="cantidadMascotas"
                type="number"
                value={data.cantidadMascotas || 0}
                onChange={handleChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosFinancierosProps {
  data: DatosFinancieros
  setData: React.Dispatch<React.SetStateAction<DatosFinancieros>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosFinancieros = ({ data, setData, errors, setErrors }: SectionDatosFinancierosProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosFinancierosSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos financieros guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Información protegida
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Por seguridad, el IBAN se muestra parcialmente enmascarado. Para modificarlo, contacta con tu agente.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <InputField
          label="Banco Principal"
          name="bancoPrincipal"
          value={data.bancoPrincipal || ''}
          onChange={handleChange}
        />
        <InputField
          label="IBAN"
          name="iban"
          value={data.iban || ''}
          onChange={handleChange}
          placeholder="ES91 2100 **** **** **** 1234"
          disabled
        />
        <InputField
          label="Titular de la Cuenta"
          name="titularCuenta"
          value={data.titularCuenta || ''}
          onChange={handleChange}
        />
        <SelectField
          label="Forma de Pago Preferida"
          name="formaPagoPreferida"
          value={data.formaPagoPreferida}
          onChange={handleChange}
          options={[
            { value: 'domiciliacion', label: 'Domiciliación Bancaria' },
            { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
            { value: 'transferencia', label: 'Transferencia Bancaria' },
          ]}
          error={errors.formaPagoPreferida}
          required
        />
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosEducativosProps {
  data: DatosEducativos
  setData: React.Dispatch<React.SetStateAction<DatosEducativos>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosEducativos = ({ data, setData, errors, setErrors }: SectionDatosEducativosProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosEducativosSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos educativos guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <SelectField
          label="Nivel de Estudios"
          name="nivelEstudios"
          value={data.nivelEstudios}
          onChange={handleChange}
          options={[
            { value: 'sin_estudios', label: 'Sin estudios' },
            { value: 'primaria', label: 'Educación Primaria' },
            { value: 'eso', label: 'ESO' },
            { value: 'bachillerato', label: 'Bachillerato' },
            { value: 'fp', label: 'Formación Profesional' },
            { value: 'grado', label: 'Grado Universitario' },
            { value: 'master', label: 'Máster' },
            { value: 'doctorado', label: 'Doctorado' },
          ]}
          error={errors.nivelEstudios}
          required
        />
        <InputField
          label="Titulación"
          name="titulacion"
          value={data.titulacion || ''}
          onChange={handleChange}
          placeholder="Ej: Ingeniería Informática"
        />
        <InputField
          label="Centro de Estudios"
          name="centroEstudios"
          value={data.centroEstudios || ''}
          onChange={handleChange}
          placeholder="Ej: Universidad de Alicante"
        />
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosVehiculoProps {
  data: DatosVehiculo
  setData: React.Dispatch<React.SetStateAction<DatosVehiculo>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
  hasAutoPolicy: boolean
}

const SectionDatosVehiculo = ({ data, setData, errors, setErrors, hasAutoPolicy }: SectionDatosVehiculoProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosVehiculoSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos del vehículo guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      {hasAutoPolicy && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Tienes una póliza de auto activa</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <InputField
          label="Matrícula"
          name="matricula"
          value={data.matricula || ''}
          onChange={handleChange}
          placeholder="1234 ABC"
        />
        <InputField
          label="Marca"
          name="marca"
          value={data.marca || ''}
          onChange={handleChange}
          placeholder="Ej: Seat, Volkswagen..."
        />
        <InputField
          label="Modelo"
          name="modelo"
          value={data.modelo || ''}
          onChange={handleChange}
          placeholder="Ej: Ibiza, Golf..."
        />
        <InputField
          label="Año"
          name="ano"
          value={data.ano || ''}
          onChange={handleChange}
          placeholder="Ej: 2020"
        />
        <SelectField
          label="Combustible"
          name="tipoCombustible"
          value={data.tipoCombustible || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'gasolina', label: 'Gasolina' },
            { value: 'diesel', label: 'Diésel' },
            { value: 'hibrido', label: 'Híbrido' },
            { value: 'electrico', label: 'Eléctrico' },
          ]}
        />
        <SelectField
          label="Uso"
          name="usoVehiculo"
          value={data.usoVehiculo || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'particular', label: 'Particular' },
            { value: 'profesional', label: 'Profesional' },
            { value: 'mixto', label: 'Mixto' },
          ]}
        />
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosViviendaProps {
  data: DatosVivienda
  setData: React.Dispatch<React.SetStateAction<DatosVivienda>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
  hasHomePolicy: boolean
}

const SectionDatosVivienda = ({ data, setData, errors, setErrors, hasHomePolicy }: SectionDatosViviendaProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'number' ? parseInt(value) || 0 : value
    setData(prev => ({ ...prev, [name]: finalValue }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosViviendaSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Datos de la vivienda guardados correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      {hasHomePolicy && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Tienes una póliza de hogar activa</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <SelectField
          label="Tipo"
          name="tipoVivienda"
          value={data.tipoVivienda || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'piso', label: 'Piso' },
            { value: 'casa', label: 'Casa' },
            { value: 'chalet', label: 'Chalet' },
            { value: 'atico', label: 'Ático' },
            { value: 'duplex', label: 'Dúplex' },
          ]}
        />
        <InputField
          label="M²"
          name="metrosCuadrados"
          type="number"
          value={data.metrosCuadrados || ''}
          onChange={handleChange}
          placeholder="Ej: 90"
        />
        <InputField
          label="Año de Construcción"
          name="anoConstruccion"
          value={data.anoConstruccion || ''}
          onChange={handleChange}
          placeholder="Ej: 2005"
        />
        <SelectField
          label="Régimen"
          name="regimen"
          value={data.regimen || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'propiedad', label: 'Propiedad' },
            { value: 'alquiler', label: 'Alquiler' },
          ]}
        />
      </div>

      <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-semibold text-lg mb-6" style={{ color: 'var(--color-text)' }}>
          Características
        </h3>
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label="Alarma"
            name="tieneAlarma"
            checked={data.tieneAlarma}
            onChange={handleCheckbox}
          />
          <CheckboxField
            label="Piscina"
            name="tienePiscina"
            checked={data.tienePiscina}
            onChange={handleCheckbox}
          />
        </div>
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

interface SectionDatosPreferenciasProps {
  data: DatosPreferencias
  setData: React.Dispatch<React.SetStateAction<DatosPreferencias>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosPreferencias = ({ data, setData, errors, setErrors }: SectionDatosPreferenciasProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosPreferenciasSchema.safeParse(data)
      if (!result.success) {
        const fieldErrors: FormErrors = {}
        result.error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Por favor, corrige los errores del formulario')
        return
      }
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Preferencias guardadas correctamente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 lg:p-8 border-2"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
        <InputField
          label="LinkedIn URL"
          name="linkedinUrl"
          value={data.linkedinUrl || ''}
          onChange={handleChange}
          error={errors.linkedinUrl}
          placeholder="https://linkedin.com/in/tu-perfil"
        />
        <InputField
          label="Cómo nos conociste"
          name="comoNosConociste"
          value={data.comoNosConociste || ''}
          onChange={handleChange}
          placeholder="Ej: Recomendación, Internet..."
        />
      </div>

      <div className="mb-8">
        <MultiCheckboxField
          label="Preferencia de Comunicación"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'llamada', label: 'Llamada' },
          ]}
          selected={data.preferenciaComunicacion}
          onChange={(values) =>
            setData(prev => ({
              ...prev,
              preferenciaComunicacion: values as ('email' | 'sms' | 'whatsapp' | 'llamada')[],
            }))
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
          <Clock className="w-4 h-4 inline mr-2 text-red-500" />
          Horario Preferido de Contacto
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { value: 'Mañana (9:00 - 14:00)', label: 'Mañana', icon: '☀️' },
            { value: 'Tarde (14:00 - 20:00)', label: 'Tarde', icon: '🌤️' },
            { value: 'Noche (20:00 - 22:00)', label: 'Noche', icon: '🌙' },
            { value: 'Cualquier horario', label: 'Cualquiera', icon: '⏰' },
          ].map(opt => {
            const isSelected = data.horarioPreferidoContacto === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setData(prev => ({ ...prev, horarioPreferidoContacto: opt.value }))
                }
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2',
                  'hover:scale-105 active:scale-95',
                  isSelected
                    ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25'
                    : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700'
                )}
                style={{ color: isSelected ? 'white' : 'var(--color-text)' }}
              >
                <span className="text-lg mr-2">{opt.icon}</span>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <SaveButton onClick={handleSave} loading={loading} />
    </motion.div>
  )
}

// ============================================
// PROFILE PROGRESS BAR
// ============================================

interface ProfileProgressProps {
  percentage: number
}

const ProfileProgress = ({ percentage }: ProfileProgressProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl p-6 border-2 mb-6"
    style={{
      backgroundColor: 'var(--color-bg)',
      borderColor: 'var(--color-border)'
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>
          Perfil completado
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Completa tu perfil para mejorar tu experiencia
        </p>
      </div>
      <div className="text-right">
        <motion.span
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold text-red-500"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
    <div className="relative h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
    {percentage < 100 && (
      <p className="text-xs mt-3" style={{ color: 'var(--color-text-secondary)' }}>
        Completa las secciones restantes para desbloquear beneficios exclusivos
      </p>
    )}
    {percentage === 100 && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm mt-3 text-green-600 dark:text-green-400 font-medium flex items-center gap-2"
      >
        <Check className="w-4 h-4" /> ¡Perfil completo! Enhorabuena
      </motion.p>
    )}
  </motion.div>
)

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function PerfilPage() {
  const { user, policies } = useStore()

  // State for each section
  const [datosPersonales, setDatosPersonales] = useState<DatosPersonales>(initialDatosPersonales)
  const [datosContacto, setDatosContacto] = useState<DatosContacto>(initialDatosContacto)
  const [datosLaborales, setDatosLaborales] = useState<DatosLaborales>(initialDatosLaborales)
  const [datosFamiliares, setDatosFamiliares] = useState<DatosFamiliares>(initialDatosFamiliares)
  const [datosFinancieros, setDatosFinancieros] = useState<DatosFinancieros>(initialDatosFinancieros)
  const [datosEducativos, setDatosEducativos] = useState<DatosEducativos>(initialDatosEducativos)
  const [datosVehiculo, setDatosVehiculo] = useState<DatosVehiculo>(initialDatosVehiculo)
  const [datosVivienda, setDatosVivienda] = useState<DatosVivienda>(initialDatosVivienda)
  const [datosPreferencias, setDatosPreferencias] = useState<DatosPreferencias>(initialDatosPreferencias)

  // Errors state for each section
  const [errorsPersonales, setErrorsPersonales] = useState<FormErrors>({})
  const [errorsContacto, setErrorsContacto] = useState<FormErrors>({})
  const [errorsLaborales, setErrorsLaborales] = useState<FormErrors>({})
  const [errorsFamiliares, setErrorsFamiliares] = useState<FormErrors>({})
  const [errorsFinancieros, setErrorsFinancieros] = useState<FormErrors>({})
  const [errorsEducativos, setErrorsEducativos] = useState<FormErrors>({})
  const [errorsVehiculo, setErrorsVehiculo] = useState<FormErrors>({})
  const [errorsVivienda, setErrorsVivienda] = useState<FormErrors>({})
  const [errorsPreferencias, setErrorsPreferencias] = useState<FormErrors>({})

  // Check if user has specific policies
  const hasAutoPolicy = policies?.some(p => p.type === 'auto' && p.status === 'active') || false
  const hasHomePolicy = policies?.some(p => p.type === 'hogar' && p.status === 'active') || false

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    let completed = 0
    const total = 9

    // Check each section for completion
    if (datosPersonales.nombre && datosPersonales.apellido1 && datosPersonales.fechaNacimiento) completed++
    if (datosContacto.emailPrincipal && datosContacto.telefonoMovil && datosContacto.direccion) completed++
    if (datosLaborales.situacionLaboral) completed++
    if (datosFamiliares.convivientesHogar > 0) completed++
    if (datosFinancieros.formaPagoPreferida) completed++
    if (datosEducativos.nivelEstudios) completed++
    if (datosVehiculo.matricula || !hasAutoPolicy) completed++
    if (datosVivienda.tipoVivienda || !hasHomePolicy) completed++
    if (datosPreferencias.preferenciaComunicacion.length > 0) completed++

    return Math.round((completed / total) * 100)
  }, [
    datosPersonales,
    datosContacto,
    datosLaborales,
    datosFamiliares,
    datosFinancieros,
    datosEducativos,
    datosVehiculo,
    datosVivienda,
    datosPreferencias,
    hasAutoPolicy,
    hasHomePolicy,
  ])

  const tabs = [
    { id: 'personal', label: 'Datos Personales', icon: <User className="w-4 h-4" /> },
    { id: 'contacto', label: 'Contacto', icon: <Mail className="w-4 h-4" /> },
    { id: 'laboral', label: 'Laboral', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'familiar', label: 'Familiar', icon: <Users className="w-4 h-4" /> },
    { id: 'financiero', label: 'Financiero', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'educativo', label: 'Educación', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'vehiculo', label: 'Vehículo', icon: <Car className="w-4 h-4" /> },
    { id: 'vivienda', label: 'Vivienda', icon: <Home className="w-4 h-4" /> },
    { id: 'preferencias', label: 'Preferencias', icon: <Share2 className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Mi Perfil
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Gestiona toda tu información personal
        </p>
      </div>

      {/* Progress Bar */}
      <ProfileProgress percentage={profileCompletion} />

      {/* Tabs */}
      <Tabs defaultTab="personal" variant="pills">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <TabList className="flex gap-2 min-w-max">
            {tabs.map(tab => (
              <Tab key={tab.id} id={tab.id} icon={tab.icon}>
                <span className="whitespace-nowrap">{tab.label}</span>
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels className="mt-6">
          <TabPanel id="personal">
            <SectionDatosPersonales
              data={datosPersonales}
              setData={setDatosPersonales}
              errors={errorsPersonales}
              setErrors={setErrorsPersonales}
            />
          </TabPanel>

          <TabPanel id="contacto">
            <SectionDatosContacto
              data={datosContacto}
              setData={setDatosContacto}
              errors={errorsContacto}
              setErrors={setErrorsContacto}
            />
          </TabPanel>

          <TabPanel id="laboral">
            <SectionDatosLaborales
              data={datosLaborales}
              setData={setDatosLaborales}
              errors={errorsLaborales}
              setErrors={setErrorsLaborales}
            />
          </TabPanel>

          <TabPanel id="familiar">
            <SectionDatosFamiliares
              data={datosFamiliares}
              setData={setDatosFamiliares}
              errors={errorsFamiliares}
              setErrors={setErrorsFamiliares}
            />
          </TabPanel>

          <TabPanel id="financiero">
            <SectionDatosFinancieros
              data={datosFinancieros}
              setData={setDatosFinancieros}
              errors={errorsFinancieros}
              setErrors={setErrorsFinancieros}
            />
          </TabPanel>

          <TabPanel id="educativo">
            <SectionDatosEducativos
              data={datosEducativos}
              setData={setDatosEducativos}
              errors={errorsEducativos}
              setErrors={setErrorsEducativos}
            />
          </TabPanel>

          <TabPanel id="vehiculo">
            <SectionDatosVehiculo
              data={datosVehiculo}
              setData={setDatosVehiculo}
              errors={errorsVehiculo}
              setErrors={setErrorsVehiculo}
              hasAutoPolicy={hasAutoPolicy}
            />
          </TabPanel>

          <TabPanel id="vivienda">
            <SectionDatosVivienda
              data={datosVivienda}
              setData={setDatosVivienda}
              errors={errorsVivienda}
              setErrors={setErrorsVivienda}
              hasHomePolicy={hasHomePolicy}
            />
          </TabPanel>

          <TabPanel id="preferencias">
            <SectionDatosPreferencias
              data={datosPreferencias}
              setData={setDatosPreferencias}
              errors={errorsPreferencias}
              setErrors={setErrorsPreferencias}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}
