'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderOpen, Upload, Search, Grid3x3, List, Download, Eye, Trash2,
  X, FileText, Calendar, StickyNote, HardDrive, Filter, ChevronDown,
  Home, Wifi, CreditCard, Car, Shield, FileCheck, Dumbbell, Scale,
  Heart, GraduationCap, Briefcase, FolderArchive, ChevronUp
} from 'lucide-react'

// Categorías con iconos
const categories = [
  { id: 'hogar', name: 'Hogar', icon: Home, color: 'from-blue-500 to-blue-600', docs: [] as Document[] },
  { id: 'telecomunicaciones', name: 'Telecomunicaciones', icon: Wifi, color: 'from-purple-500 to-purple-600', docs: [] as Document[] },
  { id: 'financiero', name: 'Financiero', icon: CreditCard, color: 'from-green-500 to-green-600', docs: [] as Document[] },
  { id: 'vehiculos', name: 'Vehículos', icon: Car, color: 'from-red-500 to-red-600', docs: [] as Document[] },
  { id: 'seguridad', name: 'Seguridad', icon: Shield, color: 'from-yellow-500 to-yellow-600', docs: [] as Document[] },
  { id: 'renting', name: 'Renting/Leasing', icon: FileCheck, color: 'from-indigo-500 to-indigo-600', docs: [] as Document[] },
  { id: 'suscripciones', name: 'Suscripciones', icon: Dumbbell, color: 'from-pink-500 to-pink-600', docs: [] as Document[] },
  { id: 'legal', name: 'Legal', icon: Scale, color: 'from-gray-600 to-gray-700', docs: [] as Document[] },
  { id: 'salud', name: 'Salud', icon: Heart, color: 'from-rose-500 to-rose-600', docs: [] as Document[] },
  { id: 'educacion', name: 'Educación', icon: GraduationCap, color: 'from-cyan-500 to-cyan-600', docs: [] as Document[] },
  { id: 'laboral', name: 'Laboral', icon: Briefcase, color: 'from-orange-500 to-orange-600', docs: [] as Document[] },
  { id: 'otros', name: 'Otros', icon: FolderArchive, color: 'from-slate-500 to-slate-600', docs: [] as Document[] },
]

interface Document {
  id: string
  name: string
  category: string
  date: string
  uploadDate: string
  size: string
  notes?: string
  type: 'pdf' | 'image' | 'doc'
}

// Mock data
const mockDocuments: Document[] = [
  // Hogar
  { id: '1', name: 'Contrato Endesa Luz', category: 'hogar', date: '2024-01-15', uploadDate: '2024-01-20', size: '2.3 MB', type: 'pdf', notes: 'Contrato anual renovable' },
  { id: '2', name: 'Recibo Agua Enero 2024', category: 'hogar', date: '2024-01-10', uploadDate: '2024-01-12', size: '856 KB', type: 'pdf' },
  { id: '3', name: 'Contrato Comunidad', category: 'hogar', date: '2023-06-01', uploadDate: '2023-06-05', size: '1.8 MB', type: 'pdf' },
  { id: '4', name: 'Factura Gas Natural', category: 'hogar', date: '2024-02-01', uploadDate: '2024-02-03', size: '1.2 MB', type: 'pdf' },

  // Telecomunicaciones
  { id: '5', name: 'Contrato Fibra Movistar', category: 'telecomunicaciones', date: '2023-09-01', uploadDate: '2023-09-05', size: '3.1 MB', type: 'pdf', notes: 'Fibra 600MB + TV' },
  { id: '6', name: 'Factura Móvil Diciembre', category: 'telecomunicaciones', date: '2023-12-15', uploadDate: '2023-12-20', size: '654 KB', type: 'pdf' },
  { id: '7', name: 'Cambio Tarifa Orange', category: 'telecomunicaciones', date: '2024-01-10', uploadDate: '2024-01-12', size: '892 KB', type: 'pdf' },

  // Financiero
  { id: '8', name: 'Contrato Hipoteca', category: 'financiero', date: '2020-03-15', uploadDate: '2020-03-20', size: '8.5 MB', type: 'pdf', notes: 'Hipoteca variable Euribor + 0.99%' },
  { id: '9', name: 'Préstamo Personal BBVA', category: 'financiero', date: '2023-07-01', uploadDate: '2023-07-05', size: '2.8 MB', type: 'pdf' },
  { id: '10', name: 'Tarjeta Crédito Visa', category: 'financiero', date: '2024-01-01', uploadDate: '2024-01-03', size: '1.1 MB', type: 'pdf' },
  { id: '11', name: 'Extracto Cuenta Enero', category: 'financiero', date: '2024-02-01', uploadDate: '2024-02-02', size: '756 KB', type: 'pdf' },

  // Vehículos
  { id: '12', name: 'ITV Pasada 2024', category: 'vehiculos', date: '2024-01-15', uploadDate: '2024-01-16', size: '1.5 MB', type: 'pdf', notes: 'Próxima ITV: Enero 2026' },
  { id: '13', name: 'Permiso Circulación', category: 'vehiculos', date: '2020-05-10', uploadDate: '2023-01-15', size: '892 KB', type: 'image' },
  { id: '14', name: 'Ficha Técnica Vehículo', category: 'vehiculos', date: '2020-05-10', uploadDate: '2023-01-15', size: '2.1 MB', type: 'pdf' },

  // Seguridad
  { id: '15', name: 'Contrato Alarma Securitas', category: 'seguridad', date: '2023-03-01', uploadDate: '2023-03-05', size: '2.4 MB', type: 'pdf', notes: 'Mantenimiento incluido' },
  { id: '16', name: 'Manual Cámaras Seguridad', category: 'seguridad', date: '2023-06-15', uploadDate: '2023-06-16', size: '5.2 MB', type: 'pdf' },
  { id: '17', name: 'Garantía Cerradura Digital', category: 'seguridad', date: '2024-01-20', uploadDate: '2024-01-22', size: '1.3 MB', type: 'pdf' },

  // Renting
  { id: '18', name: 'Contrato Renting Audi A4', category: 'renting', date: '2023-04-01', uploadDate: '2023-04-05', size: '4.2 MB', type: 'pdf', notes: 'Vencimiento: Abril 2027' },
  { id: '19', name: 'Factura Renting Enero', category: 'renting', date: '2024-01-01', uploadDate: '2024-01-05', size: '856 KB', type: 'pdf' },
  { id: '20', name: 'Leasing Equipos Oficina', category: 'renting', date: '2023-09-01', uploadDate: '2023-09-10', size: '3.1 MB', type: 'pdf' },

  // Suscripciones
  { id: '21', name: 'Abono Gimnasio GO fit', category: 'suscripciones', date: '2023-01-15', uploadDate: '2023-01-20', size: '1.2 MB', type: 'pdf', notes: 'Anual con descuento' },
  { id: '22', name: 'Suscripción Netflix Premium', category: 'suscripciones', date: '2023-06-01', uploadDate: '2023-06-01', size: '456 KB', type: 'pdf' },
  { id: '23', name: 'Adobe Creative Cloud', category: 'suscripciones', date: '2023-11-01', uploadDate: '2023-11-01', size: '892 KB', type: 'pdf' },

  // Legal
  { id: '24', name: 'Testamento Notaría', category: 'legal', date: '2022-05-10', uploadDate: '2022-05-15', size: '6.8 MB', type: 'pdf', notes: 'Documento original en notaría' },
  { id: '25', name: 'Poder Notarial General', category: 'legal', date: '2023-02-15', uploadDate: '2023-02-20', size: '3.2 MB', type: 'pdf' },
  { id: '26', name: 'Escritura Vivienda', category: 'legal', date: '2020-03-15', uploadDate: '2020-03-20', size: '12.5 MB', type: 'pdf' },

  // Salud
  { id: '27', name: 'Analítica Sangre 2024', category: 'salud', date: '2024-01-10', uploadDate: '2024-01-12', size: '1.8 MB', type: 'pdf', notes: 'Todos los valores normales' },
  { id: '28', name: 'Informe Médico Traumatólogo', category: 'salud', date: '2023-11-20', uploadDate: '2023-11-22', size: '2.3 MB', type: 'pdf' },
  { id: '29', name: 'Receta Medicación Crónica', category: 'salud', date: '2024-02-01', uploadDate: '2024-02-01', size: '654 KB', type: 'image' },
  { id: '30', name: 'Cartilla Vacunación', category: 'salud', date: '2023-06-01', uploadDate: '2023-06-05', size: '1.1 MB', type: 'pdf' },

  // Educación
  { id: '31', name: 'Título Universitario', category: 'educacion', date: '2015-07-01', uploadDate: '2023-01-10', size: '4.5 MB', type: 'pdf', notes: 'Grado en Administración' },
  { id: '32', name: 'Certificado Master', category: 'educacion', date: '2018-09-15', uploadDate: '2023-01-10', size: '3.8 MB', type: 'pdf' },
  { id: '33', name: 'Curso Google Analytics', category: 'educacion', date: '2023-05-20', uploadDate: '2023-05-22', size: '1.2 MB', type: 'pdf' },

  // Laboral
  { id: '34', name: 'Contrato Trabajo Actual', category: 'laboral', date: '2021-09-01', uploadDate: '2021-09-10', size: '2.8 MB', type: 'pdf', notes: 'Indefinido a jornada completa' },
  { id: '35', name: 'Nómina Enero 2024', category: 'laboral', date: '2024-01-31', uploadDate: '2024-02-01', size: '456 KB', type: 'pdf' },
  { id: '36', name: 'Vida Laboral 2024', category: 'laboral', date: '2024-01-15', uploadDate: '2024-01-16', size: '892 KB', type: 'pdf' },
  { id: '37', name: 'Certificado Empresa', category: 'laboral', date: '2023-12-20', uploadDate: '2023-12-22', size: '654 KB', type: 'pdf' },

  // Otros
  { id: '38', name: 'Garantía Electrodomésticos', category: 'otros', date: '2023-08-15', uploadDate: '2023-08-20', size: '2.1 MB', type: 'pdf' },
  { id: '39', name: 'Manual Usuario TV', category: 'otros', date: '2023-11-01', uploadDate: '2023-11-05', size: '8.5 MB', type: 'pdf' },
  { id: '40', name: 'Recibo Donación ONG', category: 'otros', date: '2024-01-10', uploadDate: '2024-01-12', size: '456 KB', type: 'pdf' },
]

export default function MiArchivoPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '',
    date: '',
    notes: '',
    file: null as File | null
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Estadísticas
  const stats = useMemo(() => {
    const totalDocs = documents.length
    const categoriesUsed = new Set(documents.map(d => d.category)).size
    const lastUploaded = documents.sort((a, b) =>
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )[0]?.uploadDate || 'N/A'

    const totalSize = documents.reduce((acc, doc) => {
      const size = parseFloat(doc.size)
      const unit = doc.size.includes('MB') ? 1024 : 1
      return acc + (size * unit)
    }, 0)

    return {
      total: totalDocs,
      categories: categoriesUsed,
      lastUploaded,
      totalSize: (totalSize / 1024).toFixed(1) + ' GB',
      usedPercentage: Math.min((totalSize / (1024 * 10)) * 100, 100) // Max 10GB
    }
  }, [documents])

  // Filtrar y ordenar documentos
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size)
        case 'date':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      }
    })

    return filtered
  }, [documents, searchQuery, selectedCategory, sortBy])

  // Agrupar documentos por categoría
  const documentsByCategory = useMemo(() => {
    const grouped = categories.map(cat => ({
      ...cat,
      docs: filteredDocuments.filter(doc => doc.category === cat.id)
    }))
    return grouped
  }, [filteredDocuments])

  // Manejar upload
  const handleUpload = () => {
    if (!uploadForm.name || !uploadForm.category || !uploadForm.file) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simular upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)

          // Añadir documento
          const newDoc: Document = {
            id: Date.now().toString(),
            name: uploadForm.name,
            category: uploadForm.category,
            date: uploadForm.date || new Date().toISOString().split('T')[0],
            uploadDate: new Date().toISOString().split('T')[0],
            size: `${(uploadForm.file!.size / 1024 / 1024).toFixed(2)} MB`,
            notes: uploadForm.notes,
            type: uploadForm.file!.type.includes('pdf') ? 'pdf' :
                  uploadForm.file!.type.includes('image') ? 'image' : 'doc'
          }

          setDocuments(prev => [newDoc, ...prev])
          setShowUploadModal(false)
          setIsUploading(false)
          setUploadProgress(0)
          setUploadForm({ name: '', category: '', date: '', notes: '', file: null })

          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id))
      setSelectedDocument(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm(prev => ({ ...prev, file, name: prev.name || file.name }))
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass p-6 rounded-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-occident to-occident-600 rounded-xl flex items-center justify-center shadow-glow">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                    Mi Archivo
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Todos tus documentos en un solo lugar
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              <Upload className="w-5 h-5" />
              Subir documento
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="card-glass p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                {stats.total}
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Total documentos
              </div>
            </div>

            <div className="card-glass p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                {stats.categories}
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Categorías usadas
              </div>
            </div>

            <div className="card-glass p-4 rounded-xl">
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                {new Date(stats.lastUploaded).toLocaleDateString()}
              </div>
              <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Último subido
              </div>
            </div>

            <div className="card-glass p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  {stats.totalSize} / 10 GB
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${stats.usedPercentage}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass p-4 rounded-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>

            {/* Filtro categoría */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="input-field pl-10 pr-10 appearance-none cursor-pointer"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            {/* Ordenar */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="input-field pr-10 appearance-none cursor-pointer"
              >
                <option value="date">Más reciente</option>
                <option value="name">Nombre</option>
                <option value="size">Tamaño</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--color-text-secondary)' }} />
            </div>

            {/* Vista */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-occident text-white'
                    : 'bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-occident text-white'
                    : 'bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contenido principal */}
        {viewMode === 'grid' ? (
          // Vista Grid - Categorías
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documentsByCategory.map((category, index) => {
              const Icon = category.icon
              const isExpanded = expandedCategory === category.id

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`card-glass rounded-2xl overflow-hidden ${
                    isExpanded ? 'col-span-full' : ''
                  }`}
                >
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className="w-full p-6 text-left hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                      ) : (
                        <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                      {category.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {category.docs.length} documento{category.docs.length !== 1 ? 's' : ''}
                      </span>
                      {category.docs.length > 0 && (
                        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          {new Date(category.docs[0].uploadDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Lista de documentos expandida */}
                  <AnimatePresence>
                    {isExpanded && category.docs.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t overflow-hidden" style={{ borderColor: 'var(--color-border)' }}
                      >
                        <div className="p-4 space-y-2">
                          {category.docs.map(doc => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }} />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                                    {doc.name}
                                  </p>
                                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                                    {doc.size} • {new Date(doc.uploadDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedDocument(doc)
                                  }}
                                  className="p-2 rounded-lg hover:bg-occident/20 transition-colors"
                                  title="Ver"
                                >
                                  <Eye className="w-4 h-4" style={{ color: 'var(--color-text)' }} />
                                </button>
                                <button
                                  className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                                  title="Descargar"
                                >
                                  <Download className="w-4 h-4 text-blue-500" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(doc.id)
                                  }}
                                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        ) : (
          // Vista Lista
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-glass rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <tr>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--color-text)' }}>Documento</th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--color-text)' }}>Categoría</th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--color-text)' }}>Fecha</th>
                    <th className="text-left p-4 font-semibold" style={{ color: 'var(--color-text)' }}>Tamaño</th>
                    <th className="text-right p-4 font-semibold" style={{ color: 'var(--color-text)' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc, index) => {
                    const category = categories.find(c => c.id === doc.category)
                    const Icon = category?.icon || FileText

                    return (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                        style={{ borderColor: 'var(--color-border)' }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                            <div>
                              <p className="font-medium" style={{ color: 'var(--color-text)' }}>{doc.name}</p>
                              {doc.notes && (
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{doc.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                              {category?.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {doc.size}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedDocument(doc)}
                              className="p-2 rounded-lg hover:bg-occident/20 transition-colors"
                              title="Ver"
                            >
                              <Eye className="w-4 h-4" style={{ color: 'var(--color-text)' }} />
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                              title="Descargar"
                            >
                              <Download className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Modal subir documento */}
        <AnimatePresence>
          {showUploadModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isUploading && setShowUploadModal(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="card-glass rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                      Subir documento
                    </h2>
                    {!isUploading && (
                      <button
                        onClick={() => setShowUploadModal(false)}
                        className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Dropzone */}
                    <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-occident transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--color-border)' }}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                        {uploadForm.file ? uploadForm.file.name : 'Arrastra y suelta tu archivo aquí'}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        o haz clic para seleccionar
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>

                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                        Nombre del documento *
                      </label>
                      <input
                        type="text"
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field w-full"
                        placeholder="Ej: Contrato Endesa Luz"
                      />
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                        Categoría *
                      </label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field w-full"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                        Fecha del documento
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                        <input
                          type="date"
                          value={uploadForm.date}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, date: e.target.value }))}
                          className="input-field w-full pl-10"
                        />
                      </div>
                    </div>

                    {/* Notas */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                        Notas (opcional)
                      </label>
                      <div className="relative">
                        <StickyNote className="absolute left-3 top-3 w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                        <textarea
                          value={uploadForm.notes}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                          className="input-field w-full pl-10 min-h-[100px]"
                          placeholder="Añade cualquier información relevante..."
                        />
                      </div>
                    </div>

                    {/* Progress bar */}
                    {isUploading && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                            Subiendo...
                          </span>
                          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowUploadModal(false)}
                        disabled={isUploading}
                        className="btn-secondary flex-1"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={isUploading || !uploadForm.name || !uploadForm.category || !uploadForm.file}
                        className="btn-primary flex-1"
                      >
                        {isUploading ? 'Subiendo...' : 'Subir documento'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modal ver documento */}
        <AnimatePresence>
          {selectedDocument && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDocument(null)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div
                  className="card-glass rounded-2xl p-6 max-w-2xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                      Detalles del documento
                    </h2>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/30 dark:bg-white/5">
                      <FileText className="w-12 h-12" style={{ color: 'var(--color-text-secondary)' }} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
                          {selectedDocument.name}
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {categories.find(c => c.id === selectedDocument.category)?.name}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="card-glass p-4 rounded-xl">
                        <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Fecha documento
                        </p>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {new Date(selectedDocument.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="card-glass p-4 rounded-xl">
                        <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Fecha subida
                        </p>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="card-glass p-4 rounded-xl">
                        <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Tamaño
                        </p>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {selectedDocument.size}
                        </p>
                      </div>

                      <div className="card-glass p-4 rounded-xl">
                        <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          Tipo
                        </p>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {selectedDocument.type.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {selectedDocument.notes && (
                      <div className="card-glass p-4 rounded-xl">
                        <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                          Notas
                        </p>
                        <p style={{ color: 'var(--color-text)' }}>
                          {selectedDocument.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Descargar
                      </button>
                      <button
                        onClick={() => handleDelete(selectedDocument.id)}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
