'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import {
  User, Mail, Phone, MapPin, Save, Camera, Briefcase,
  Users, CreditCard, GraduationCap, Share2, Car, Home,
  Check, AlertCircle, ChevronRight
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@/components/ui/Tabs'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

// ============================================
// ZOD SCHEMAS
// ============================================

const datosPersonalesSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido1: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  apellido2: z.string().optional(),
  dni: z.string(),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  genero: z.enum(['hombre', 'mujer', 'otro', 'prefiero_no_decir']),
  nacionalidad: z.string().min(2, 'La nacionalidad es obligatoria'),
  estadoCivil: z.enum(['soltero', 'casado', 'divorciado', 'viudo', 'pareja_de_hecho']),
  fotoPerfil: z.string().optional(),
})

const datosContactoSchema = z.object({
  emailPrincipal: z.string().email('Email no valido'),
  emailSecundario: z.string().email('Email no valido').optional().or(z.literal('')),
  telefonoMovil: z.string().min(9, 'El telefono debe tener al menos 9 digitos'),
  telefonoFijo: z.string().optional(),
  direccion: z.string().min(5, 'La direccion es obligatoria'),
  numeroPisoPuerta: z.string().optional(),
  codigoPostal: z.string().min(5, 'El codigo postal debe tener 5 digitos'),
  ciudad: z.string().min(2, 'La ciudad es obligatoria'),
  provincia: z.string().min(2, 'La provincia es obligatoria'),
  pais: z.string().min(2, 'El pais es obligatorio'),
})

const datosLaboralesSchema = z.object({
  situacionLaboral: z.enum(['empleado', 'autonomo', 'desempleado', 'jubilado', 'estudiante']),
  profesion: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  antiguedad: z.string().optional(),
  ingresosAnuales: z.enum(['menos_15000', '15000_30000', '30000_50000', '50000_75000', '75000_100000', 'mas_100000', 'prefiero_no_decir']),
  sector: z.string().optional(),
})

const datosFamiliaresSchema = z.object({
  numeroHijos: z.number().min(0),
  edadesHijos: z.string().optional(),
  personasACargo: z.number().min(0),
  convivientesHogar: z.number().min(1),
  tieneMascotas: z.boolean(),
  tipoMascotas: z.string().optional(),
  cantidadMascotas: z.number().min(0).optional(),
})

const datosFinancierosSchema = z.object({
  bancoPrincipal: z.string().optional(),
  iban: z.string().optional(),
  titularCuenta: z.string().optional(),
  formaPagoPreferida: z.enum(['domiciliacion', 'tarjeta', 'transferencia']),
})

const datosEducativosSchema = z.object({
  nivelEstudios: z.enum(['sin_estudios', 'primaria', 'secundaria', 'bachillerato', 'fp', 'grado', 'master', 'doctorado']),
  titulacion: z.string().optional(),
  centroEstudios: z.string().optional(),
})

const datosSocialesSchema = z.object({
  linkedin: z.string().url('URL no valida').optional().or(z.literal('')),
  comoNosConociste: z.string().optional(),
  preferenciaComunicacion: z.array(z.enum(['email', 'sms', 'whatsapp', 'llamada'])),
  horarioContacto: z.enum(['manana', 'tarde', 'noche', 'cualquiera']),
})

const datosVehiculoSchema = z.object({
  matricula: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.string().optional(),
  tipoCombustible: z.enum(['gasolina', 'diesel', 'hibrido', 'electrico', 'glp', 'otro']).optional(),
  usoVehiculo: z.enum(['particular', 'profesional', 'mixto']).optional(),
})

const datosViviendaSchema = z.object({
  tipoVivienda: z.enum(['piso', 'casa', 'chalet', 'atico', 'duplex', 'otro']).optional(),
  metrosCuadrados: z.number().min(0).optional(),
  anoConstruccion: z.string().optional(),
  regimen: z.enum(['propietario', 'alquiler', 'otro']).optional(),
  tieneAlarma: z.boolean(),
  tienePiscina: z.boolean(),
})

// ============================================
// TYPES
// ============================================

type DatosPersonales = z.infer<typeof datosPersonalesSchema>
type DatosContacto = z.infer<typeof datosContactoSchema>
type DatosLaborales = z.infer<typeof datosLaboralesSchema>
type DatosFamiliares = z.infer<typeof datosFamiliaresSchema>
type DatosFinancieros = z.infer<typeof datosFinancierosSchema>
type DatosEducativos = z.infer<typeof datosEducativosSchema>
type DatosSociales = z.infer<typeof datosSocialesSchema>
type DatosVehiculo = z.infer<typeof datosVehiculoSchema>
type DatosVivienda = z.infer<typeof datosViviendaSchema>

interface FormErrors {
  [key: string]: string | undefined
}

// ============================================
// INITIAL DATA
// ============================================

const initialDatosPersonales: DatosPersonales = {
  nombre: 'Juan',
  apellido1: 'Garcia',
  apellido2: 'Lopez',
  dni: '12345678A',
  fechaNacimiento: '1985-06-15',
  genero: 'hombre',
  nacionalidad: 'Espanola',
  estadoCivil: 'casado',
  fotoPerfil: '',
}

const initialDatosContacto: DatosContacto = {
  emailPrincipal: 'juan.garcia@email.com',
  emailSecundario: '',
  telefonoMovil: '666123456',
  telefonoFijo: '',
  direccion: 'Calle Mayor 15',
  numeroPisoPuerta: '2o B',
  codigoPostal: '03570',
  ciudad: 'Villajoyosa',
  provincia: 'Alicante',
  pais: 'Espana',
}

const initialDatosLaborales: DatosLaborales = {
  situacionLaboral: 'empleado',
  profesion: 'Ingeniero de Software',
  empresa: 'Tech Solutions S.L.',
  cargo: 'Senior Developer',
  antiguedad: '5 anos',
  ingresosAnuales: '30000_50000',
  sector: 'Tecnologia',
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
  titularCuenta: 'Juan Garcia Lopez',
  formaPagoPreferida: 'domiciliacion',
}

const initialDatosEducativos: DatosEducativos = {
  nivelEstudios: 'grado',
  titulacion: 'Ingenieria Informatica',
  centroEstudios: 'Universidad de Alicante',
}

const initialDatosSociales: DatosSociales = {
  linkedin: 'https://linkedin.com/in/juangarcia',
  comoNosConociste: 'Recomendacion de un amigo',
  preferenciaComunicacion: ['email', 'whatsapp'],
  horarioContacto: 'tarde',
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
  regimen: 'propietario',
  tieneAlarma: true,
  tienePiscina: false,
}

// ============================================
// HELPER COMPONENTS
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
}

const InputField = ({ label, name, type = 'text', value, onChange, error, disabled, required, placeholder }: InputFieldProps) => (
  <div>
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
        'input',
        disabled && 'bg-slate-50 dark:bg-slate-800 cursor-not-allowed',
        error && 'border-red-500 focus:ring-red-500/20'
      )}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1 flex items-center gap-1"
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
}

const SelectField = ({ label, name, value, onChange, options, error, required }: SelectFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={cn('input', error && 'border-red-500 focus:ring-red-500/20')}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 text-xs mt-1 flex items-center gap-1"
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
  <label className="flex items-center gap-3 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className={cn(
        'w-5 h-5 rounded border-2 transition-all duration-200',
        checked
          ? 'bg-red-500 border-red-500'
          : 'border-slate-300 dark:border-slate-600'
      )}>
        {checked && <Check className="w-4 h-4 text-white absolute top-0.5 left-0.5" />}
      </div>
    </div>
    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{label}</span>
  </label>
)

interface MultiCheckboxFieldProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}

const MultiCheckboxField = ({ label, options, selected, onChange }: MultiCheckboxFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>{label}</label>
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
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2',
              isSelected
                ? 'bg-red-500 border-red-500 text-white'
                : 'border-slate-200 dark:border-slate-700 hover:border-red-300'
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

const SaveButton = ({ onClick, loading }: { onClick: () => void; loading?: boolean }) => (
  <motion.button
    type="button"
    onClick={onClick}
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
    Guardar cambios
  </motion.button>
)

// ============================================
// SECTION COMPONENTS
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos personales guardados correctamente')
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
          <User className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos Personales</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Informacion basica de tu perfil</p>
        </div>
      </div>

      {/* Foto de perfil */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center overflow-hidden">
            {data.fotoPerfil ? (
              <img src={data.fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                {user?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <p className="font-medium" style={{ color: 'var(--color-text)' }}>Foto de perfil</p>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>JPG, PNG o GIF. Max 2MB</p>
          <button type="button" className="text-sm text-red-500 hover:text-red-600 mt-1 font-medium">
            Cambiar foto
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          label="DNI/NIE"
          name="dni"
          value={data.dni}
          onChange={handleChange}
          disabled
          required
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
          label="Genero"
          name="genero"
          value={data.genero}
          onChange={handleChange}
          options={[
            { value: 'hombre', label: 'Hombre' },
            { value: 'mujer', label: 'Mujer' },
            { value: 'otro', label: 'Otro' },
            { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
          ]}
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos de contacto guardados correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos de Contacto</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Como podemos contactarte</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
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
          label="Telefono Movil"
          name="telefonoMovil"
          type="tel"
          value={data.telefonoMovil}
          onChange={handleChange}
          error={errors.telefonoMovil}
          required
        />
        <InputField
          label="Telefono Fijo"
          name="telefonoFijo"
          type="tel"
          value={data.telefonoFijo || ''}
          onChange={handleChange}
        />
      </div>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>Direccion</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <InputField
              label="Direccion"
              name="direccion"
              value={data.direccion}
              onChange={handleChange}
              error={errors.direccion}
              required
              placeholder="Calle, Avenida, Plaza..."
            />
          </div>
          <InputField
            label="Numero/Piso/Puerta"
            name="numeroPisoPuerta"
            value={data.numeroPisoPuerta || ''}
            onChange={handleChange}
            placeholder="Ej: 15, 2o B"
          />
          <InputField
            label="Codigo Postal"
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
            label="Pais"
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos laborales guardados correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos Laborales</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Tu situacion profesional</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          label="Situacion Laboral"
          name="situacionLaboral"
          value={data.situacionLaboral}
          onChange={handleChange}
          options={[
            { value: 'empleado', label: 'Empleado/a' },
            { value: 'autonomo', label: 'Autonomo/a' },
            { value: 'desempleado', label: 'Desempleado/a' },
            { value: 'jubilado', label: 'Jubilado/a' },
            { value: 'estudiante', label: 'Estudiante' },
          ]}
          required
        />
        <InputField
          label="Profesion"
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
          label="Antiguedad"
          name="antiguedad"
          value={data.antiguedad || ''}
          onChange={handleChange}
          placeholder="Ej: 5 anos"
        />
        <SelectField
          label="Ingresos Anuales Aproximados"
          name="ingresosAnuales"
          value={data.ingresosAnuales}
          onChange={handleChange}
          options={[
            { value: 'menos_15000', label: 'Menos de 15.000 EUR' },
            { value: '15000_30000', label: '15.000 - 30.000 EUR' },
            { value: '30000_50000', label: '30.000 - 50.000 EUR' },
            { value: '50000_75000', label: '50.000 - 75.000 EUR' },
            { value: '75000_100000', label: '75.000 - 100.000 EUR' },
            { value: 'mas_100000', label: 'Mas de 100.000 EUR' },
            { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
          ]}
          required
        />
        <InputField
          label="Sector"
          name="sector"
          value={data.sector || ''}
          onChange={handleChange}
          placeholder="Ej: Tecnologia, Sanidad..."
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos familiares guardados correctamente')
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
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos Familiares</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Informacion sobre tu nucleo familiar</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Numero de Hijos"
          name="numeroHijos"
          type="number"
          value={data.numeroHijos}
          onChange={handleChange}
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
        />
        <InputField
          label="Convivientes en el Hogar"
          name="convivientesHogar"
          type="number"
          value={data.convivientesHogar}
          onChange={handleChange}
        />
      </div>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>Mascotas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <CheckboxField
              label="Tengo mascotas"
              name="tieneMascotas"
              checked={data.tieneMascotas}
              onChange={handleCheckbox}
            />
          </div>
          {data.tieneMascotas && (
            <>
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
            </>
          )}
        </div>
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos financieros guardados correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos Financieros</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Informacion de pago y cuenta bancaria</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="Banco Principal"
          name="bancoPrincipal"
          value={data.bancoPrincipal || ''}
          onChange={handleChange}
        />
        <InputField
          label="IBAN (enmascarado)"
          name="iban"
          value={data.iban || ''}
          onChange={handleChange}
          placeholder="ES91 2100 **** **** **** 1234"
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
            { value: 'domiciliacion', label: 'Domiciliacion Bancaria' },
            { value: 'tarjeta', label: 'Tarjeta de Credito/Debito' },
            { value: 'transferencia', label: 'Transferencia Bancaria' },
          ]}
          required
        />
      </div>

      <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Nota:</strong> Por seguridad, el IBAN se muestra parcialmente enmascarado.
          Para modificarlo, contacta con tu agente.
        </p>
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos educativos guardados correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos Educativos</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Tu formacion academica</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          label="Nivel de Estudios"
          name="nivelEstudios"
          value={data.nivelEstudios}
          onChange={handleChange}
          options={[
            { value: 'sin_estudios', label: 'Sin estudios' },
            { value: 'primaria', label: 'Educacion Primaria' },
            { value: 'secundaria', label: 'Educacion Secundaria (ESO)' },
            { value: 'bachillerato', label: 'Bachillerato' },
            { value: 'fp', label: 'Formacion Profesional' },
            { value: 'grado', label: 'Grado Universitario' },
            { value: 'master', label: 'Master' },
            { value: 'doctorado', label: 'Doctorado' },
          ]}
          required
        />
        <InputField
          label="Titulacion"
          name="titulacion"
          value={data.titulacion || ''}
          onChange={handleChange}
          placeholder="Ej: Ingenieria Informatica"
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

interface SectionDatosSocialesProps {
  data: DatosSociales
  setData: React.Dispatch<React.SetStateAction<DatosSociales>>
  errors: FormErrors
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
}

const SectionDatosSociales = ({ data, setData, errors, setErrors }: SectionDatosSocialesProps) => {
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = datosSocialesSchema.safeParse(data)
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
        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
          <Share2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Preferencias y Redes</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Como prefieres que te contactemos</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="LinkedIn"
          name="linkedin"
          value={data.linkedin || ''}
          onChange={handleChange}
          error={errors.linkedin}
          placeholder="https://linkedin.com/in/tu-perfil"
        />
        <InputField
          label="Como nos conociste"
          name="comoNosConociste"
          value={data.comoNosConociste || ''}
          onChange={handleChange}
          placeholder="Ej: Recomendacion, Internet..."
        />
      </div>

      <div className="mt-6">
        <MultiCheckboxField
          label="Preferencias de Comunicacion"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'sms', label: 'SMS' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'llamada', label: 'Llamada' },
          ]}
          selected={data.preferenciaComunicacion}
          onChange={(values) => setData(prev => ({
            ...prev,
            preferenciaComunicacion: values as ('email' | 'sms' | 'whatsapp' | 'llamada')[]
          }))}
        />
      </div>

      <div className="mt-6">
        <SelectField
          label="Horario Preferido de Contacto"
          name="horarioContacto"
          value={data.horarioContacto}
          onChange={handleChange}
          options={[
            { value: 'manana', label: 'Manana (9:00 - 14:00)' },
            { value: 'tarde', label: 'Tarde (14:00 - 20:00)' },
            { value: 'noche', label: 'Noche (20:00 - 22:00)' },
            { value: 'cualquiera', label: 'Cualquier horario' },
          ]}
          required
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos del vehiculo guardados correctamente')
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
          <Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos del Vehiculo</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {hasAutoPolicy
              ? 'Informacion de tu vehiculo asegurado'
              : 'Completa estos datos si tienes un vehiculo'
            }
          </p>
        </div>
      </div>

      {hasAutoPolicy && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Tienes una poliza de auto activa</span>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField
          label="Matricula"
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
          label="Ano de Matriculacion"
          name="ano"
          value={data.ano || ''}
          onChange={handleChange}
          placeholder="Ej: 2020"
        />
        <SelectField
          label="Tipo de Combustible"
          name="tipoCombustible"
          value={data.tipoCombustible || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'gasolina', label: 'Gasolina' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'hibrido', label: 'Hibrido' },
            { value: 'electrico', label: 'Electrico' },
            { value: 'glp', label: 'GLP/GNC' },
            { value: 'otro', label: 'Otro' },
          ]}
        />
        <SelectField
          label="Uso del Vehiculo"
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Datos de la vivienda guardados correctamente')
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
        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
          <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos de la Vivienda</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {hasHomePolicy
              ? 'Informacion de tu vivienda asegurada'
              : 'Completa estos datos si tienes una vivienda'
            }
          </p>
        </div>
      </div>

      {hasHomePolicy && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Tienes una poliza de hogar activa</span>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField
          label="Tipo de Vivienda"
          name="tipoVivienda"
          value={data.tipoVivienda || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'piso', label: 'Piso' },
            { value: 'casa', label: 'Casa' },
            { value: 'chalet', label: 'Chalet' },
            { value: 'atico', label: 'Atico' },
            { value: 'duplex', label: 'Duplex' },
            { value: 'otro', label: 'Otro' },
          ]}
        />
        <InputField
          label="Metros Cuadrados"
          name="metrosCuadrados"
          type="number"
          value={data.metrosCuadrados || ''}
          onChange={handleChange}
          placeholder="Ej: 90"
        />
        <InputField
          label="Ano de Construccion"
          name="anoConstruccion"
          value={data.anoConstruccion || ''}
          onChange={handleChange}
          placeholder="Ej: 2005"
        />
        <SelectField
          label="Regimen"
          name="regimen"
          value={data.regimen || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Selecciona...' },
            { value: 'propietario', label: 'Propietario' },
            { value: 'alquiler', label: 'Alquiler' },
            { value: 'otro', label: 'Otro' },
          ]}
        />
      </div>

      <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h3 className="font-medium mb-4" style={{ color: 'var(--color-text)' }}>Caracteristicas adicionales</h3>
        <div className="flex flex-wrap gap-6">
          <CheckboxField
            label="Dispone de alarma"
            name="tieneAlarma"
            checked={data.tieneAlarma}
            onChange={handleCheckbox}
          />
          <CheckboxField
            label="Dispone de piscina"
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

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

interface ProfileProgressProps {
  percentage: number
}

const ProfileProgress = ({ percentage }: ProfileProgressProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-6 mb-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Perfil completado</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Completa tu perfil para mejorar tu experiencia
        </p>
      </div>
      <div className="text-right">
        <span className="text-3xl font-bold text-red-500">{percentage}%</span>
      </div>
    </div>
    <div className="progress-bar">
      <motion.div
        className="progress-bar-fill"
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
  const [datosSociales, setDatosSociales] = useState<DatosSociales>(initialDatosSociales)
  const [datosVehiculo, setDatosVehiculo] = useState<DatosVehiculo>(initialDatosVehiculo)
  const [datosVivienda, setDatosVivienda] = useState<DatosVivienda>(initialDatosVivienda)

  // Errors state for each section
  const [errorsPersonales, setErrorsPersonales] = useState<FormErrors>({})
  const [errorsContacto, setErrorsContacto] = useState<FormErrors>({})
  const [errorsLaborales, setErrorsLaborales] = useState<FormErrors>({})
  const [errorsFamiliares, setErrorsFamiliares] = useState<FormErrors>({})
  const [errorsFinancieros, setErrorsFinancieros] = useState<FormErrors>({})
  const [errorsEducativos, setErrorsEducativos] = useState<FormErrors>({})
  const [errorsSociales, setErrorsSociales] = useState<FormErrors>({})
  const [errorsVehiculo, setErrorsVehiculo] = useState<FormErrors>({})
  const [errorsVivienda, setErrorsVivienda] = useState<FormErrors>({})

  // Check if user has specific policies
  const hasAutoPolicy = policies?.some(p => p.type === 'auto' && p.status === 'active') || false
  const hasHomePolicy = policies?.some(p => p.type === 'hogar' && p.status === 'active') || false

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    let completed = 0
    const total = 9

    // Check each section
    if (datosPersonales.nombre && datosPersonales.apellido1 && datosPersonales.fechaNacimiento) completed++
    if (datosContacto.emailPrincipal && datosContacto.telefonoMovil && datosContacto.direccion) completed++
    if (datosLaborales.situacionLaboral) completed++
    if (datosFamiliares.convivientesHogar > 0) completed++
    if (datosFinancieros.formaPagoPreferida) completed++
    if (datosEducativos.nivelEstudios) completed++
    if (datosSociales.preferenciaComunicacion.length > 0) completed++
    if (datosVehiculo.matricula || !hasAutoPolicy) completed++
    if (datosVivienda.tipoVivienda || !hasHomePolicy) completed++

    return Math.round((completed / total) * 100)
  }, [datosPersonales, datosContacto, datosLaborales, datosFamiliares, datosFinancieros, datosEducativos, datosSociales, datosVehiculo, datosVivienda, hasAutoPolicy, hasHomePolicy])

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
    { id: 'contacto', label: 'Contacto', icon: <Mail className="w-4 h-4" /> },
    { id: 'laboral', label: 'Laboral', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'familiar', label: 'Familiar', icon: <Users className="w-4 h-4" /> },
    { id: 'financiero', label: 'Financiero', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'educativo', label: 'Educativo', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'social', label: 'Preferencias', icon: <Share2 className="w-4 h-4" /> },
    { id: 'vehiculo', label: 'Vehiculo', icon: <Car className="w-4 h-4" /> },
    { id: 'vivienda', label: 'Vivienda', icon: <Home className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Mi Perfil</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Gestiona toda tu informacion personal</p>
      </div>

      {/* Progress Bar */}
      <ProfileProgress percentage={profileCompletion} />

      {/* Tabs */}
      <Tabs defaultTab="personal" variant="pills">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <TabList className="flex-nowrap min-w-max gap-2">
            {tabs.map(tab => (
              <Tab key={tab.id} id={tab.id} icon={tab.icon}>
                <span className="hidden sm:inline">{tab.label}</span>
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

          <TabPanel id="social">
            <SectionDatosSociales
              data={datosSociales}
              setData={setDatosSociales}
              errors={errorsSociales}
              setErrors={setErrorsSociales}
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
        </TabPanels>
      </Tabs>
    </div>
  )
}
