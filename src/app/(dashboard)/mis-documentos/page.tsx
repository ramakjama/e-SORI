'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Upload,
  Download,
  Eye,
  Share2,
  Trash2,
  Filter,
  Search,
  Grid3x3,
  List,
  File,
  FileImage,
  FilePdf,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface Document {
  id: string
  name: string
  type: string
  category: string
  size: number
  url: string
  policyId?: string
  policyNumber?: string
  claimId?: string
  createdAt: string
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [filterCategory])

  async function fetchDocuments() {
    try {
      setLoading(true)
      let url = '/api/documents?limit=100'

      if (filterCategory !== 'all') {
        url += `&category=${filterCategory}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'POLICY', label: 'Pólizas' },
    { value: 'CLAIM', label: 'Siniestros' },
    { value: 'CONTRACT', label: 'Contratos' },
    { value: 'ID_DOCUMENT', label: 'Identificación' },
    { value: 'RECEIPT', label: 'Recibos' },
    { value: 'OTHER', label: 'Otros' },
  ]

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FilePdf
    if (type.includes('image')) return FileImage
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.policyNumber || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-8 h-8 animate-spin mx-auto mb-4 text-occident" />
            <p className="text-gray-600 dark:text-gray-400">Cargando documentos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Documentos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Accede a todos tus documentos de seguros
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
        >
          <Upload className="w-5 h-5" />
          Subir Documento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold">{documents.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pólizas</p>
          <p className="text-2xl font-bold">
            {documents.filter(d => d.category === 'POLICY').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Siniestros</p>
          <p className="text-2xl font-bold">
            {documents.filter(d => d.category === 'CLAIM').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Recibos</p>
          <p className="text-2xl font-bold">
            {documents.filter(d => d.category === 'RECEIPT').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setFilterCategory(category.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCategory === category.value
                  ? 'bg-occident text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o número de póliza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-occident focus:border-transparent"
            />
          </div>

          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Vista en cuadrícula"
              title="Vista en cuadrícula"
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-occident'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="Vista en lista"
              title="Vista en lista"
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-occident'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No hay documentos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Aún no has subido ningún documento
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 bg-occident text-white rounded-lg hover:bg-occident/90 transition-colors font-semibold"
          >
            <Upload className="w-5 h-5" />
            Subir Primer Documento
          </button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.type)
            return (
              <Card key={doc.id} className="p-4 hover:shadow-lg transition-all">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-occident/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-6 h-6 text-occident" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {doc.category}
                    </Badge>
                  </div>

                  <h4 className="font-medium mb-1 line-clamp-2 text-sm">{doc.name}</h4>
                  {doc.policyNumber && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-mono">
                      {doc.policyNumber}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
                    <Clock className="w-3 h-3" />
                    {new Date(doc.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(doc.size)}
                  </p>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/mis-documentos/${doc.id}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver
                    </Link>
                    <button
                      type="button"
                      title="Descargar documento"
                      className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Compartir documento"
                      className="flex items-center justify-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocuments.map((doc) => {
            const FileIcon = getFileIcon(doc.type)
            return (
              <Card key={doc.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-occident/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 text-occident" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium mb-1 truncate">{doc.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      {doc.policyNumber && (
                        <>
                          <span className="font-mono">{doc.policyNumber}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>

                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {doc.category}
                  </Badge>

                  <div className="flex gap-2">
                    <Link
                      href={`/mis-documentos/${doc.id}`}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Ver documento"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      title="Descargar documento"
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Compartir documento"
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
