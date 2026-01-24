'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Receipt, Download, CheckCircle, Clock, AlertTriangle,
  FileText, CreditCard, Calendar, Building2, Car, Home,
  Heart, Shield, Filter, Search, ChevronRight, Eye,
  Printer, Mail, Share2, MoreVertical, Check, X
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDateShort, cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type ReceiptStatus = 'paid' | 'pending' | 'overdue' | 'processing'

interface ReceiptItem {
  id: string
  number: string
  policyId: string
  policyNumber: string
  policyName: string
  policyType: 'auto' | 'hogar' | 'vida' | 'salud' | 'decesos'
  company: 'Occident' | 'Soriano'
  amount: number
  dueDate: Date
  paidDate?: Date
  status: ReceiptStatus
  period: string
  paymentMethod?: string
  documents: {
    receipt: boolean
    certificate: boolean
    policy: boolean
    conditions: boolean
  }
}

const mockReceipts: ReceiptItem[] = [
  {
    id: 'rec-1',
    number: 'REC-2024-001234',
    policyId: 'pol-1',
    policyNumber: 'POL-AUTO-2024-5678',
    policyName: 'Seguro Coche - Toyota Corolla',
    policyType: 'auto',
    company: 'Occident',
    amount: 324.50,
    dueDate: new Date('2024-01-15'),
    paidDate: new Date('2024-01-10'),
    status: 'paid',
    period: '01/2024 - 06/2024',
    paymentMethod: 'Domiciliación bancaria',
    documents: { receipt: true, certificate: true, policy: true, conditions: true }
  },
  {
    id: 'rec-2',
    number: 'REC-2024-001235',
    policyId: 'pol-2',
    policyNumber: 'POL-HOGAR-2024-1234',
    policyName: 'Seguro Hogar - C/ Mayor 15',
    policyType: 'hogar',
    company: 'Occident',
    amount: 189.00,
    dueDate: new Date('2024-02-01'),
    status: 'pending',
    period: '02/2024 - 02/2025',
    documents: { receipt: false, certificate: true, policy: true, conditions: true }
  },
  {
    id: 'rec-3',
    number: 'REC-2024-001236',
    policyId: 'pol-3',
    policyNumber: 'POL-VIDA-2024-9012',
    policyName: 'Seguro Vida - Capital 100.000€',
    policyType: 'vida',
    company: 'Occident',
    amount: 96.00,
    dueDate: new Date('2024-01-05'),
    status: 'overdue',
    period: '01/2024 - 01/2025',
    documents: { receipt: false, certificate: true, policy: true, conditions: true }
  },
  {
    id: 'rec-4',
    number: 'REC-2024-001237',
    policyId: 'pol-4',
    policyNumber: 'POL-SALUD-2024-3456',
    policyName: 'Seguro Salud Familiar',
    policyType: 'salud',
    company: 'Occident',
    amount: 156.00,
    dueDate: new Date('2024-01-20'),
    paidDate: new Date('2024-01-18'),
    status: 'paid',
    period: '01/2024 - 02/2024',
    paymentMethod: 'Tarjeta de crédito',
    documents: { receipt: true, certificate: true, policy: true, conditions: true }
  },
]

const policyIcons: Record<string, React.ElementType> = {
  auto: Car,
  hogar: Home,
  vida: Heart,
  salud: Shield,
  decesos: Building2,
}

const statusConfig: Record<ReceiptStatus, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  paid: { label: 'Pagado', color: 'text-emerald-600', icon: CheckCircle, bg: 'bg-emerald-100 dark:bg-emerald-950' },
  pending: { label: 'Pendiente', color: 'text-amber-600', icon: Clock, bg: 'bg-amber-100 dark:bg-amber-950' },
  overdue: { label: 'Vencido', color: 'text-red-600', icon: AlertTriangle, bg: 'bg-red-100 dark:bg-red-950' },
  processing: { label: 'Procesando', color: 'text-blue-600', icon: Clock, bg: 'bg-blue-100 dark:bg-blue-950' },
}

export default function RecibosPage() {
  const [filter, setFilter] = useState<ReceiptStatus | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState<string | null>(null)

  const filteredReceipts = mockReceipts.filter(receipt => {
    const matchesFilter = filter === 'all' || receipt.status === filter
    const matchesSearch = receipt.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.number.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: mockReceipts.length,
    paid: mockReceipts.filter(r => r.status === 'paid').length,
    pending: mockReceipts.filter(r => r.status === 'pending').length,
    overdue: mockReceipts.filter(r => r.status === 'overdue').length,
    totalAmount: mockReceipts.reduce((sum, r) => sum + r.amount, 0),
    paidAmount: mockReceipts.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0),
  }

  const handleDownload = (receiptId: string, docType: 'receipt' | 'certificate' | 'policy' | 'conditions') => {
    // Simular descarga
    const docNames = {
      receipt: 'Recibo',
      certificate: 'Certificado',
      policy: 'Póliza',
      conditions: 'Condiciones Generales'
    }
    alert(`Descargando ${docNames[docType]}...`)
    setShowDownloadMenu(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recibos</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestiona y descarga tus recibos y documentos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-slate-500">Total recibos</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.paid}</p>
              <p className="text-xs text-slate-500">Pagados</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pendientes</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              <p className="text-xs text-slate-500">Vencidos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="default" className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por póliza o número de recibo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-occident/20 focus:border-occident"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(['all', 'paid', 'pending', 'overdue'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  filter === status
                    ? 'bg-occident text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {status === 'all' ? 'Todos' : statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Receipts List */}
      <div className="space-y-4">
        {filteredReceipts.map((receipt, index) => {
          const Icon = policyIcons[receipt.policyType]
          const status = statusConfig[receipt.status]
          const StatusIcon = status.icon

          return (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="elevated" hover="lift" className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Policy Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      receipt.policyType === 'auto' && 'bg-blue-100 dark:bg-blue-950',
                      receipt.policyType === 'hogar' && 'bg-emerald-100 dark:bg-emerald-950',
                      receipt.policyType === 'vida' && 'bg-rose-100 dark:bg-rose-950',
                      receipt.policyType === 'salud' && 'bg-violet-100 dark:bg-violet-950',
                      receipt.policyType === 'decesos' && 'bg-slate-100 dark:bg-slate-800',
                    )}>
                      <Icon className={cn(
                        'w-6 h-6',
                        receipt.policyType === 'auto' && 'text-blue-600',
                        receipt.policyType === 'hogar' && 'text-emerald-600',
                        receipt.policyType === 'vida' && 'text-rose-600',
                        receipt.policyType === 'salud' && 'text-violet-600',
                        receipt.policyType === 'decesos' && 'text-slate-600',
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {receipt.policyName}
                        </h3>
                        <Badge variant={receipt.company === 'Occident' ? 'primary' : 'secondary'} size="xs">
                          {receipt.company}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{receipt.number}</p>
                      <p className="text-xs text-slate-400 mt-1">Período: {receipt.period}</p>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex items-center gap-6 lg:gap-8">
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(receipt.amount)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {receipt.status === 'paid' ? 'Pagado' : 'Vence'}: {formatDateShort(receipt.status === 'paid' ? receipt.paidDate! : receipt.dueDate)}
                      </p>
                    </div>

                    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', status.bg)}>
                      <StatusIcon className={cn('w-4 h-4', status.color)} />
                      <span className={cn('text-sm font-medium', status.color)}>{status.label}</span>
                    </div>

                    {/* Actions */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDownloadMenu(showDownloadMenu === receipt.id ? null : receipt.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>

                      {/* Download Menu */}
                      <AnimatePresence>
                        {showDownloadMenu === receipt.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                          >
                            <div className="p-2">
                              <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Descargar documentos</p>

                              <button
                                onClick={() => handleDownload(receipt.id, 'receipt')}
                                disabled={!receipt.documents.receipt}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                  receipt.documents.receipt
                                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    : 'opacity-50 cursor-not-allowed'
                                )}
                              >
                                <Receipt className="w-4 h-4 text-occident" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Recibo PDF</span>
                                {receipt.documents.receipt && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                              </button>

                              <button
                                onClick={() => handleDownload(receipt.id, 'certificate')}
                                disabled={!receipt.documents.certificate}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                  receipt.documents.certificate
                                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    : 'opacity-50 cursor-not-allowed'
                                )}
                              >
                                <Shield className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Certificado Póliza</span>
                                {receipt.documents.certificate && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                              </button>

                              <button
                                onClick={() => handleDownload(receipt.id, 'policy')}
                                disabled={!receipt.documents.policy}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                  receipt.documents.policy
                                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    : 'opacity-50 cursor-not-allowed'
                                )}
                              >
                                <FileText className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Póliza Completa</span>
                                {receipt.documents.policy && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                              </button>

                              <button
                                onClick={() => handleDownload(receipt.id, 'conditions')}
                                disabled={!receipt.documents.conditions}
                                className={cn(
                                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                                  receipt.documents.conditions
                                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    : 'opacity-50 cursor-not-allowed'
                                )}
                              >
                                <FileText className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-slate-700 dark:text-slate-300">Condiciones Generales</span>
                                {receipt.documents.conditions && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                              </button>

                              <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors">
                                  <Mail className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-700 dark:text-slate-300">Enviar por email</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors">
                                  <Printer className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm text-slate-700 dark:text-slate-300">Imprimir</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Payment Info (if paid) */}
                {receipt.status === 'paid' && receipt.paymentMethod && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">{receipt.paymentMethod}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Pagado el {formatDateShort(receipt.paidDate!)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pay Now Button (if pending/overdue) */}
                {(receipt.status === 'pending' || receipt.status === 'overdue') && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-occident text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Pagar ahora
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          )
        })}

        {filteredReceipts.length === 0 && (
          <Card variant="default" className="p-12 text-center">
            <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No se encontraron recibos</p>
          </Card>
        )}
      </div>

      {/* Summary Card */}
      <Card variant="premium" className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Resumen de Pagos</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total facturado</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Total pagado</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.paidAmount)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Pendiente de pago</p>
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.totalAmount - stats.paidAmount)}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
