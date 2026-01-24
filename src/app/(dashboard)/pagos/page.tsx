'use client'

import { motion } from 'framer-motion'
import { CreditCard, Calendar, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDateShort } from '@/lib/utils'

export default function PagosPage() {
  const { policies } = useStore()

  const totalAnnual = policies.reduce((sum, p) => sum + p.premium, 0)

  const payments = policies.map(p => ({
    id: p.id,
    policy: p.name,
    amount: p.premium / 2,
    dueDate: p.nextPayment,
    status: new Date(p.nextPayment) > new Date() ? 'pending' : 'paid',
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Pagos</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Gestiona tus pagos y recibos</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CreditCard className="w-8 h-8 mb-4" />
          <div className="text-sm text-white/80">Total anual</div>
          <div className="text-2xl font-bold">{formatCurrency(totalAnnual)}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <CheckCircle className="w-8 h-8 mb-4 text-green-500" />
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Pagos realizados</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{payments.filter(p => p.status === 'paid').length}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <Clock className="w-8 h-8 mb-4 text-amber-500" />
          <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Pagos pendientes</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{payments.filter(p => p.status === 'pending').length}</div>
        </motion.div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Próximos pagos</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {payments.map((payment, i) => (
            <motion.div key={payment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium" style={{ color: 'var(--color-text)' }}>{payment.policy}</div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Calendar className="w-4 h-4" />
                  {formatDateShort(payment.dueDate)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold" style={{ color: 'var(--color-text)' }}>{formatCurrency(payment.amount)}</div>
                <span className={`badge ${payment.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                  {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                </span>
              </div>
              <button type="button" className="btn-ghost"><Download className="w-5 h-5" /></button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
