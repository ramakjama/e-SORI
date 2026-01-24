'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Save, Lock, Bell } from 'lucide-react'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'

export default function PerfilPage() {
  const { user } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
  })

  const handleSave = () => {
    toast.success('Perfil actualizado correctamente')
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Mi Perfil</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Gestiona tu información personal</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Datos personales</h2>
              {!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="btn-ghost">Editar</button>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Nombre completo</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>DNI/NIE</label>
                <input type="text" value={user?.dni} disabled className="input bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Teléfono</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Dirección</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Ciudad</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} disabled={!isEditing} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Código Postal</label>
                <input type="text" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} disabled={!isEditing} className="input" />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={handleSave} className="btn-primary"><Save className="w-4 h-4 mr-2" />Guardar cambios</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancelar</button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">{user?.name.charAt(0)}</span>
              </div>
              <div>
                <div className="font-semibold" style={{ color: 'var(--color-text)' }}>{user?.name}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Cliente desde 2023</div>
              </div>
            </div>
            <button type="button" className="btn-secondary w-full">Cambiar foto</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Seguridad</h3>
            <div className="space-y-3">
              <button type="button" className="btn-secondary w-full justify-start"><Lock className="w-4 h-4 mr-2" />Cambiar contraseña</button>
              <button type="button" className="btn-secondary w-full justify-start"><Bell className="w-4 h-4 mr-2" />Notificaciones</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
