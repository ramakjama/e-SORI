'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderArchive, Upload, Search, Filter, X, Download, Eye, Edit2, Trash2,
  Zap, Wifi, DollarSign, Car, Home, User, Briefcase, MoreHorizontal,
  Calendar, AlertTriangle, FileText, Image, File, Plus, ChevronDown, ChevronRight,
  Clock, CheckCircle, Bell
} from 'lucide-react'
import { cn, formatDateShort } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import { ConfirmModal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import Progress from '@/components/ui/Progress'

// Types
interface PersonalDocument {
  id: string
  name: string
  category: DocumentCategory
  subcategory: string
  uploadDate: string
  expirationDate?: string
  size: string
  sizeBytes: number
  type: 'pdf' | 'jpg' | 'png' | 'doc' | 'docx'
  url: string
  thumbnail?: string
}

type DocumentCategory =
  | 'suministros'
  | 'telecomunicaciones'
  | 'financieros'
  | 'vehiculos'
  | 'hogar'
  | 'personales'
  | 'laborales'
  | 'otros'

// Category Configuration
const categories: Record<DocumentCategory, {
  label: string
  icon: typeof Zap
  color: string
  bgColor: string
  subcategories: string[]
}> = {
  suministros: {
    label: 'Suministros',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    subcategories: ['Contrato de luz', 'Contrato de gas', 'Contrato de agua', 'Facturas de suministros']
  },
  telecomunicaciones: {
    label: 'Telecomunicaciones',
    icon: Wifi,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    subcategories: ['Contrato de internet/fibra', 'Contrato de movil', 'Facturas de telecomunicaciones']
  },
  financieros: {
    label: 'Financieros',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    subcategories: ['Prestamos personales', 'Creditos', 'Hipoteca', 'Extractos bancarios', 'Declaracion de la renta']
  },
  vehiculos: {
    label: 'Vehiculos',
    icon: Car,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    subcategories: ['Permiso de circulacion', 'Ficha tecnica (ITV)', 'Contrato de renting', 'Contrato de leasing', 'Facturas de mantenimiento']
  },
  hogar: {
    label: 'Hogar',
    icon: Home,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    subcategories: ['Escritura de la vivienda', 'Contrato de alquiler', 'Contrato de alarma', 'Comunidad de propietarios']
  },
  personales: {
    label: 'Personales',
    icon: User,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    subcategories: ['DNI/NIE', 'Pasaporte', 'Carnet de conducir', 'Tarjeta sanitaria', 'Libro de familia', 'Certificados (nacimiento, matrimonio, etc.)']
  },
  laborales: {
    label: 'Laborales',
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    subcategories: ['Contrato de trabajo', 'Nominas', 'Vida laboral', 'Certificados de empresa']
  },
  otros: {
    label: 'Otros',
    icon: MoreHorizontal,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    subcategories: ['Documentos varios']
  }
}

// File type icons
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />
    case 'jpg':
    case 'png':
      return <Image className="w-5 h-5 text-blue-500" />
    case 'doc':
    case 'docx':
      return <File className="w-5 h-5 text-blue-600" />
    default:
      return <File className="w-5 h-5 text-gray-500" />
  }
}

// Mock data
const mockDocuments: PersonalDocument[] = [
  {
    id: '1',
    name: 'DNI Juan Garcia.pdf',
    category: 'personales',
    subcategory: 'DNI/NIE',
    uploadDate: '2024-01-15',
    expirationDate: '2030-05-20',
    size: '1.2 MB',
    sizeBytes: 1258291,
    type: 'pdf',
    url: '#'
  },
  {
    id: '2',
    name: 'Contrato Luz Iberdrola.pdf',
    category: 'suministros',
    subcategory: 'Contrato de luz',
    uploadDate: '2024-03-10',
    size: '856 KB',
    sizeBytes: 876544,
    type: 'pdf',
    url: '#'
  },
  {
    id: '3',
    name: 'Ficha tecnica ITV.pdf',
    category: 'vehiculos',
    subcategory: 'Ficha tecnica (ITV)',
    uploadDate: '2024-02-20',
    expirationDate: '2025-02-20',
    size: '2.3 MB',
    sizeBytes: 2411724,
    type: 'pdf',
    url: '#'
  },
  {
    id: '4',
    name: 'Nomina Enero 2024.pdf',
    category: 'laborales',
    subcategory: 'Nominas',
    uploadDate: '2024-01-31',
    size: '145 KB',
    sizeBytes: 148480,
    type: 'pdf',
    url: '#'
  },
  {
    id: '5',
    name: 'Escritura Vivienda.pdf',
    category: 'hogar',
    subcategory: 'Escritura de la vivienda',
    uploadDate: '2023-06-15',
    size: '5.8 MB',
    sizeBytes: 6082150,
    type: 'pdf',
    url: '#'
  },
  {
    id: '6',
    name: 'Carnet de conducir.jpg',
    category: 'personales',
    subcategory: 'Carnet de conducir',
    uploadDate: '2024-01-05',
    expirationDate: '2026-03-15',
    size: '980 KB',
    sizeBytes: 1003520,
    type: 'jpg',
    url: '#'
  },
  {
    id: '7',
    name: 'Factura Vodafone Marzo.pdf',
    category: 'telecomunicaciones',
    subcategory: 'Facturas de telecomunicaciones',
    uploadDate: '2024-03-05',
    size: '234 KB',
    sizeBytes: 239616,
    type: 'pdf',
    url: '#'
  },
  {
    id: '8',
    name: 'Extracto BBVA Febrero.pdf',
    category: 'financieros',
    subcategory: 'Extractos bancarios',
    uploadDate: '2024-03-01',
    size: '456 KB',
    sizeBytes: 466944,
    type: 'pdf',
    url: '#'
  }
]

// Upload Modal Component
interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[], category: DocumentCategory, subcategory: string, expirationDate?: string) => void
}

function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [expirationDate, setExpirationDate] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
      const validSize = file.size <= 10 * 1024 * 1024 // 10MB
      return validTypes.includes(ext || '') && validSize
    })
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
        const validSize = file.size <= 10 * 1024 * 1024
        return validTypes.includes(ext || '') && validSize
      })
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleUpload = async () => {
    if (!selectedCategory || !selectedSubcategory || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150))
      setUploadProgress(i)
    }

    onUpload(files, selectedCategory, selectedSubcategory, expirationDate || undefined)

    // Reset state
    setUploading(false)
    setUploadProgress(0)
    setFiles([])
    setSelectedCategory(null)
    setSelectedSubcategory('')
    setExpirationDate('')
    onClose()
  }

  const resetModal = () => {
    setFiles([])
    setSelectedCategory(null)
    setSelectedSubcategory('')
    setExpirationDate('')
    setUploading(false)
    setUploadProgress(0)
  }

  useEffect(() => {
    if (!isOpen) {
      resetModal()
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subir Documentos" size="lg">
      <div className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-occident bg-occident/10'
              : 'border-slate-300 dark:border-slate-600 hover:border-occident hover:bg-slate-50 dark:hover:bg-slate-800'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className={cn('w-12 h-12 mx-auto mb-4', isDragging ? 'text-occident' : 'text-slate-400')} />
          <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>
            Arrastra tus archivos aqui
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            o haz clic para seleccionar
          </p>
          <p className="text-xs mt-3 text-slate-400">
            PDF, JPG, PNG, DOC (Max. 10MB por archivo)
          </p>
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
              Archivos seleccionados ({files.length})
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name.split('.').pop() || '')}
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]" style={{ color: 'var(--color-text)' }}>
                        {file.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Categoria *
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value as DocumentCategory)
                setSelectedSubcategory('')
              }}
              className="input w-full"
            >
              <option value="">Selecciona categoria</option>
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Tipo de documento *
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
              className="input w-full"
            >
              <option value="">Selecciona tipo</option>
              {selectedCategory && categories[selectedCategory].subcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            Fecha de vencimiento (opcional)
          </label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="input w-full"
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'var(--color-text-secondary)' }}>Subiendo...</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} variant="default" size="md" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedCategory || !selectedSubcategory || files.length === 0 || uploading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Subiendo...' : `Subir ${files.length > 0 ? `(${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Preview Modal Component
interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  document: PersonalDocument | null
}

function PreviewModal({ isOpen, onClose, document }: PreviewModalProps) {
  if (!document) return null

  const isImage = ['jpg', 'png'].includes(document.type)
  const isPdf = document.type === 'pdf'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={document.name} size="full">
      <div className="h-[70vh] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl">
        {isImage ? (
          <div className="text-center">
            <Image className="w-24 h-24 mx-auto text-slate-400 mb-4" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Vista previa de imagen</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text)' }}>{document.name}</p>
          </div>
        ) : isPdf ? (
          <div className="text-center">
            <FileText className="w-24 h-24 mx-auto text-red-400 mb-4" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Vista previa de PDF</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text)' }}>{document.name}</p>
          </div>
        ) : (
          <div className="text-center">
            <File className="w-24 h-24 mx-auto text-slate-400 mb-4" />
            <p style={{ color: 'var(--color-text-secondary)' }}>Vista previa no disponible</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text)' }}>{document.name}</p>
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onClose} className="flex-1 btn-secondary">
          Cerrar
        </button>
        <button className="flex-1 btn-primary flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          Descargar
        </button>
      </div>
    </Modal>
  )
}

// Edit Name Modal Component
interface EditNameModalProps {
  isOpen: boolean
  onClose: () => void
  document: PersonalDocument | null
  onSave: (id: string, newName: string) => void
}

function EditNameModal({ isOpen, onClose, document, onSave }: EditNameModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (document) {
      setName(document.name)
    }
  }, [document])

  if (!document) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave(document.id, name.trim())
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar nombre" size="sm">
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full"
          placeholder="Nombre del documento"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Document Card Component
interface DocumentCardProps {
  document: PersonalDocument
  onView: () => void
  onDownload: () => void
  onEdit: () => void
  onDelete: () => void
}

function DocumentCard({ document, onView, onDownload, onEdit, onDelete }: DocumentCardProps) {
  const category = categories[document.category]
  const Icon = category.icon

  const isExpiringSoon = () => {
    if (!document.expirationDate) return false
    const expDate = new Date(document.expirationDate)
    const today = new Date()
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 30
  }

  const isExpired = () => {
    if (!document.expirationDate) return false
    return new Date(document.expirationDate) < new Date()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="card p-4 group"
    >
      {/* Thumbnail / Icon */}
      <div className={cn(
        'aspect-[4/3] rounded-lg flex items-center justify-center mb-4 relative overflow-hidden',
        category.bgColor
      )}>
        <Icon className={cn('w-12 h-12', category.color)} />

        {/* Expiration Badge */}
        {isExpiringSoon() && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Bell className="w-3 h-3" />
            <span>Pronto</span>
          </div>
        )}
        {isExpired() && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Vencido</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
          <button
            onClick={onView}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Ver"
          >
            <Eye className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Descargar"
          >
            <Download className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Document Info */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          {getFileIcon(document.type)}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }} title={document.name}>
              {document.name}
            </h4>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-secondary)' }}>
              {document.subcategory}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDateShort(document.uploadDate)}</span>
          </div>
          <span>{document.size}</span>
        </div>

        {document.expirationDate && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            isExpired() ? 'text-red-500' : isExpiringSoon() ? 'text-amber-500' : 'text-green-500'
          )}>
            <Clock className="w-3 h-3" />
            <span>
              {isExpired()
                ? `Vencido el ${formatDateShort(document.expirationDate)}`
                : `Vence: ${formatDateShort(document.expirationDate)}`
              }
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Category Accordion Component
interface CategoryAccordionProps {
  categoryKey: DocumentCategory
  documents: PersonalDocument[]
  isExpanded: boolean
  onToggle: () => void
  onViewDocument: (doc: PersonalDocument) => void
  onDownloadDocument: (doc: PersonalDocument) => void
  onEditDocument: (doc: PersonalDocument) => void
  onDeleteDocument: (doc: PersonalDocument) => void
}

function CategoryAccordion({
  categoryKey,
  documents,
  isExpanded,
  onToggle,
  onViewDocument,
  onDownloadDocument,
  onEditDocument,
  onDeleteDocument
}: CategoryAccordionProps) {
  const category = categories[categoryKey]
  const Icon = category.icon
  const docCount = documents.length

  const expiringCount = documents.filter(d => {
    if (!d.expirationDate) return false
    const expDate = new Date(d.expirationDate)
    const today = new Date()
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 30
  }).length

  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', category.bgColor)}>
            <Icon className={cn('w-5 h-5', category.color)} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
              {category.label}
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {docCount} documento{docCount !== 1 ? 's' : ''}
              {expiringCount > 0 && (
                <span className="ml-2 text-amber-500">
                  ({expiringCount} por vencer)
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {expiringCount > 0 && (
            <span className="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Bell className="w-3 h-3" />
              {expiringCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
          ) : (
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FolderArchive className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    No hay documentos en esta categoria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                  {documents.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onView={() => onViewDocument(doc)}
                      onDownload={() => onDownloadDocument(doc)}
                      onEdit={() => onEditDocument(doc)}
                      onDelete={() => onDeleteDocument(doc)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Empty State Component
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-12 text-center"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-occident/20 to-occident/5 rounded-full flex items-center justify-center">
        <FolderArchive className="w-12 h-12 text-occident" />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        Tu archivo esta vacio
      </h2>
      <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
        Organiza todos tus documentos personales en un solo lugar. Sube contratos, facturas, documentos de identidad y mucho mas.
      </p>
      <button
        onClick={onUpload}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Subir primer documento
      </button>
    </motion.div>
  )
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="rounded" width={150} height={44} />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="rounded" width="100%" height={48} className="flex-1" />
        <Skeleton variant="rounded" width={150} height={48} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card p-4">
            <Skeleton variant="rounded" height={120} className="mb-4" />
            <Skeleton variant="text" width="80%" className="mb-2" />
            <Skeleton variant="text" width="60%" height={12} />
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Page Component
export default function MiArchivoPage() {
  const [documents, setDocuments] = useState<PersonalDocument[]>(mockDocuments)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<DocumentCategory | null>(null)
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'expiration'>('date')
  const [viewMode, setViewMode] = useState<'accordion' | 'grid'>('accordion')
  const [expandedCategories, setExpandedCategories] = useState<Set<DocumentCategory>>(new Set())

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<PersonalDocument | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter and sort documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.subcategory.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || doc.category === filterCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'expiration':
        if (!a.expirationDate) return 1
        if (!b.expirationDate) return -1
        return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  // Group documents by category
  const documentsByCategory = Object.keys(categories).reduce((acc, cat) => {
    acc[cat as DocumentCategory] = filteredDocuments.filter(d => d.category === cat)
    return acc
  }, {} as Record<DocumentCategory, PersonalDocument[]>)

  // Count expiring documents
  const expiringDocuments = documents.filter(d => {
    if (!d.expirationDate) return false
    const expDate = new Date(d.expirationDate)
    const today = new Date()
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 30
  })

  // Handlers
  const toggleCategory = (category: DocumentCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const handleUpload = (files: File[], category: DocumentCategory, subcategory: string, expirationDate?: string) => {
    const newDocs: PersonalDocument[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      category,
      subcategory,
      uploadDate: new Date().toISOString().split('T')[0],
      expirationDate,
      size: file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(0)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sizeBytes: file.size,
      type: file.name.split('.').pop()?.toLowerCase() as PersonalDocument['type'],
      url: '#'
    }))
    setDocuments(prev => [...newDocs, ...prev])
    setExpandedCategories(prev => new Set([...prev, category]))
  }

  const handleViewDocument = (doc: PersonalDocument) => {
    setSelectedDocument(doc)
    setPreviewModalOpen(true)
  }

  const handleDownloadDocument = (doc: PersonalDocument) => {
    // In a real app, this would trigger a download
    console.log('Downloading:', doc.name)
  }

  const handleEditDocument = (doc: PersonalDocument) => {
    setSelectedDocument(doc)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (doc: PersonalDocument) => {
    setSelectedDocument(doc)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedDocument) {
      setDocuments(prev => prev.filter(d => d.id !== selectedDocument.id))
    }
    setDeleteModalOpen(false)
    setSelectedDocument(null)
  }

  const handleSaveName = (id: string, newName: string) => {
    setDocuments(prev => prev.map(d =>
      d.id === id ? { ...d, name: newName } : d
    ))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
            <FolderArchive className="w-8 h-8 text-occident" />
            Mi Archivo
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Organiza y gestiona todos tus documentos personales
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Subir documento
        </button>
      </div>

      {/* Expiring Documents Alert */}
      {expiringDocuments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                Documentos por vencer
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Tienes {expiringDocuments.length} documento{expiringDocuments.length > 1 ? 's' : ''} que vence{expiringDocuments.length > 1 ? 'n' : ''} en los proximos 30 dias
              </p>
            </div>
            <button
              onClick={() => {
                setFilterCategory(null)
                setSortBy('expiration')
              }}
              className="text-sm font-medium text-amber-700 dark:text-amber-300 hover:underline"
            >
              Ver todos
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {documents.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Documentos
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {Object.keys(categories).filter(cat =>
                  documents.some(d => d.category === cat)
                ).length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Categorias
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {expiringDocuments.length}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Por vencer
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FolderArchive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {(documents.reduce((acc, d) => acc + d.sizeBytes, 0) / (1024 * 1024)).toFixed(1)}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                MB usados
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
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
        <div className="flex gap-2">
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value as DocumentCategory || null)}
            className="input w-40"
          >
            <option value="">Todas las categorias</option>
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input w-40"
          >
            <option value="date">Por fecha</option>
            <option value="name">Por nombre</option>
            <option value="expiration">Por vencimiento</option>
          </select>
        </div>
      </div>

      {/* Documents */}
      {documents.length === 0 ? (
        <EmptyState onUpload={() => setUploadModalOpen(true)} />
      ) : filteredDocuments.length === 0 ? (
        <div className="card p-12 text-center">
          <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Sin resultados
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No se encontraron documentos que coincidan con tu busqueda
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(documentsByCategory).map(([cat, docs]) => {
            if (docs.length === 0 && filterCategory) return null
            return (
              <CategoryAccordion
                key={cat}
                categoryKey={cat as DocumentCategory}
                documents={docs}
                isExpanded={expandedCategories.has(cat as DocumentCategory)}
                onToggle={() => toggleCategory(cat as DocumentCategory)}
                onViewDocument={handleViewDocument}
                onDownloadDocument={handleDownloadDocument}
                onEditDocument={handleEditDocument}
                onDeleteDocument={handleDeleteClick}
              />
            )
          })}
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUpload}
      />

      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false)
          setSelectedDocument(null)
        }}
        document={selectedDocument}
      />

      <EditNameModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedDocument(null)
        }}
        document={selectedDocument}
        onSave={handleSaveName}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedDocument(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Eliminar documento"
        message={`¿Estas seguro de que quieres eliminar "${selectedDocument?.name}"? Esta accion no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  )
}
