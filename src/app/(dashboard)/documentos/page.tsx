'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Search, Filter, File, Calendar } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatDateShort } from '@/lib/utils'

const typeLabels: Record<string, string> = {
  policy: 'Poliza',
  receipt: 'Recibo',
  claim: 'Siniestro',
  other: 'Otros',
}

const typeColors: Record<string, string> = {
  policy: 'text-blue-600 bg-blue-100',
  receipt: 'text-green-600 bg-green-100',
  claim: 'text-amber-600 bg-amber-100',
  other: 'text-gray-600 bg-gray-100',
}

export default function DocumentosPage() {
  const { documents, policies } = useStore()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredDocs = documents.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = !filterType || d.type === filterType
    return matchesSearch && matchesType
  })

  const getPolicyName = (policyId?: string) => {
    if (!policyId) return null
    const policy = policies.find(p => p.id === policyId)
    return policy?.name
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Documentos</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Accede a todos tus documentos</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar documento..."
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

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <tr>
                <th className="px-6 py-4 text-left table-header">Documento</th>
                <th className="px-6 py-4 text-left table-header">Tipo</th>
                <th className="px-6 py-4 text-left table-header">Póliza</th>
                <th className="px-6 py-4 text-left table-header">Fecha</th>
                <th className="px-6 py-4 text-left table-header">Tamaño</th>
                <th className="px-6 py-4 text-right table-header">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {filteredDocs.map((doc, i) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[doc.type]}`}>
                        <File className="w-5 h-5" />
                      </div>
                      <span className="font-medium" style={{ color: 'var(--color-text)' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge badge-gray">{typeLabels[doc.type]}</span>
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{getPolicyName(doc.policyId) || '-'}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{formatDateShort(doc.date)}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--color-text-secondary)' }}>{doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" className="btn-ghost"><Download className="w-4 h-4" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
