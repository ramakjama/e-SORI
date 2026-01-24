'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Shield, Calendar, CreditCard, ChevronRight, Download } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDateShort } from '@/lib/utils'

const typeLabels: Record<string, string> = {
  auto: 'Coche',
  hogar: 'Hogar',
  vida: 'Vida',
  salud: 'Salud',
  decesos: 'Decesos',
}

const typeColors: Record<string, { bg: string; text: string; badge: string }> = {
  auto: { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-500' },
  hogar: { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-500' },
  vida: { bg: 'bg-rose-100', text: 'text-rose-600', badge: 'bg-rose-500' },
  salud: { bg: 'bg-violet-100', text: 'text-violet-600', badge: 'bg-violet-500' },
  decesos: { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-500' },
}

export default function PolizasPage() {
  const { policies } = useStore()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.number.toLowerCase().includes(search.toLowerCase())
    const matchesType = !filterType || p.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Mis Pólizas</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Gestiona todas tus pólizas de seguro</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar poliza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 w-full"
          />
        </div>
        <select
          value={filterType || ''}
          onChange={(e) => setFilterType(e.target.value || null)}
          className="input w-full sm:w-48"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(typeLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredPolicies.map((policy, i) => {
          const colors = typeColors[policy.type] || typeColors.decesos
          return (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.bg}`}>
                  <Shield className={`w-7 h-7 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{policy.name}</h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{policy.number}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium text-white rounded-full ${colors.badge}`}>
                      {typeLabels[policy.type]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Prima anual</div>
                      <div className="font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(policy.premium)}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Vencimiento</div>
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>{formatDateShort(policy.endDate)}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Próximo pago</div>
                      <div className="font-medium" style={{ color: 'var(--color-text)' }}>{formatDateShort(policy.nextPayment)}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Estado</div>
                      <span className="badge badge-success">Activa</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {policy.coverage.slice(0, 3).map((cov) => (
                      <span key={cov} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">{cov}</span>
                    ))}
                    {policy.coverage.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">+{policy.coverage.length - 3} más</span>
                    )}
                  </div>
                </div>
                <button type="button" className="btn-ghost"><Download className="w-5 h-5" /></button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
