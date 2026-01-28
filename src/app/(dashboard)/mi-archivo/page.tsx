'use client'

/**
 * MI ARCHIVO - Versión Optimizada
 * Sistema de gestión documental simplificado
 */

import { useState, useMemo } from 'react'
import {
  FolderOpen, Upload, Search, Download, Eye, FileText,
  Home, Wifi, CreditCard, Car, Shield, Heart, Briefcase,
  Calendar, HardDrive, Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Document {
  id: string
  name: string
  category: string
  date: string
  size: string
  notes?: string
  type: 'pdf' | 'image' | 'doc'
}

const categories = [
  { id: 'hogar', name: 'Hogar', icon: Home, color: 'bg-blue-500' },
  { id: 'telecomunicaciones', name: 'Telecomunicaciones', icon: Wifi, color: 'bg-purple-500' },
  { id: 'financiero', name: 'Financiero', icon: CreditCard, color: 'bg-green-500' },
  { id: 'vehiculos', name: 'Vehículos', icon: Car, color: 'bg-red-500' },
  { id: 'seguridad', name: 'Seguridad', icon: Shield, color: 'bg-yellow-500' },
  { id: 'salud', name: 'Salud', icon: Heart, color: 'bg-rose-500' },
  { id: 'laboral', name: 'Laboral', icon: Briefcase, color: 'bg-orange-500' },
]

// Mock data simplificado
const mockDocuments: Document[] = [
  { id: '1', name: 'Contrato Endesa Luz', category: 'hogar', date: '2024-01-15', size: '2.3 MB', type: 'pdf', notes: 'Contrato anual renovable' },
  { id: '2', name: 'Recibo Agua Enero 2024', category: 'hogar', date: '2024-01-10', size: '856 KB', type: 'pdf' },
  { id: '5', name: 'Contrato Fibra Movistar', category: 'telecomunicaciones', date: '2023-09-01', size: '3.1 MB', type: 'pdf' },
  { id: '6', name: 'Factura Móvil Diciembre', category: 'telecomunicaciones', date: '2023-12-15', size: '654 KB', type: 'pdf' },
  { id: '8', name: 'Contrato Hipoteca', category: 'financiero', date: '2020-03-15', size: '8.5 MB', type: 'pdf', notes: 'Hipoteca variable' },
  { id: '10', name: 'Tarjeta Crédito Visa', category: 'financiero', date: '2024-01-01', size: '1.1 MB', type: 'pdf' },
  { id: '12', name: 'ITV Pasada 2024', category: 'vehiculos', date: '2024-01-15', size: '1.5 MB', type: 'pdf' },
  { id: '13', name: 'Permiso Circulación', category: 'vehiculos', date: '2020-05-10', size: '892 KB', type: 'image' },
  { id: '15', name: 'Contrato Alarma Securitas', category: 'seguridad', date: '2023-03-01', size: '2.4 MB', type: 'pdf' },
  { id: '27', name: 'Analítica Sangre 2024', category: 'salud', date: '2024-01-10', size: '1.8 MB', type: 'pdf' },
  { id: '28', name: 'Informe Médico', category: 'salud', date: '2023-11-20', size: '2.3 MB', type: 'pdf' },
  { id: '34', name: 'Contrato Trabajo Actual', category: 'laboral', date: '2021-09-01', size: '2.8 MB', type: 'pdf' },
  { id: '35', name: 'Nómina Enero 2024', category: 'laboral', date: '2024-01-31', size: '456 KB', type: 'pdf' },
]

export default function MiArchivoPage() {
  const [documents] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Stats
  const stats = useMemo(() => {
    const totalDocs = documents.length
    const categoriesUsed = new Set(documents.map(d => d.category)).size
    const totalSize = documents.reduce((acc, doc) => {
      const size = parseFloat(doc.size)
      const unit = doc.size.includes('MB') ? 1024 : 1
      return acc + (size * unit)
    }, 0)

    return {
      total: totalDocs,
      categories: categoriesUsed,
      totalSize: (totalSize / 1024).toFixed(1) + ' GB',
    }
  }, [documents])

  // Filtrar documentos
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || doc.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [documents, searchQuery, selectedCategory])

  // Agrupar por categoría
  const documentsByCategory = useMemo(() => {
    const grouped: Record<string, Document[]> = {}
    filteredDocuments.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = []
      }
      grouped[doc.category].push(doc)
    })
    return grouped
  }, [filteredDocuments])

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-occident" />
            Mi Archivo
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestiona tus documentos personales
          </p>
        </div>
        <button
          type="button"
          className="px-6 py-3 bg-occident text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Subir Documento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <FileText className="w-8 h-8 text-blue-500 mb-3" />
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Documentos</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <FolderOpen className="w-8 h-8 text-purple-500 mb-3" />
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.categories}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Categorías</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <HardDrive className="w-8 h-8 text-emerald-500 mb-3" />
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSize}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Almacenamiento</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          />
        </div>

        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Documents by Category */}
      <div className="space-y-6">
        {Object.entries(documentsByCategory).map(([categoryId, docs]) => {
          const category = categories.find(c => c.id === categoryId)
          if (!category) return null

          const Icon = category.icon

          return (
            <div key={categoryId} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className={cn('p-5 flex items-center gap-3', category.color, 'bg-opacity-10')}>
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', category.color, 'text-white')}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{category.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{docs.length} documentos</p>
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {docs.map(doc => (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">{doc.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {doc.date}
                        </span>
                        <span>{doc.size}</span>
                        {doc.notes && (
                          <span className="truncate">{doc.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDocument(doc)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Ver documento"
                      >
                        <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        type="button"
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Descargar documento"
                      >
                        <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No se encontraron documentos
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedDocument.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Categoría:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {categories.find(c => c.id === selectedDocument.category)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Fecha:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedDocument.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Tamaño:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedDocument.size}</span>
              </div>
              {selectedDocument.notes && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 block mb-2">Notas:</span>
                  <p className="text-slate-900 dark:text-white">{selectedDocument.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Ver Documento
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl font-semibold bg-occident text-white hover:bg-red-700 transition-colors"
              >
                Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
