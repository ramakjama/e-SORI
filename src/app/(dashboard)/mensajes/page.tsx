'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MailOpen, ChevronRight, Clock } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatDateShort } from '@/lib/utils'

export default function MensajesPage() {
  const { messages, markMessageAsRead } = useStore()
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  const selected = messages.find(m => m.id === selectedMessage)

  const handleSelect = (id: string) => {
    setSelectedMessage(id)
    markMessageAsRead(id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Mensajes</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Tu bandeja de entrada</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card overflow-hidden">
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {messages.map((message) => (
              <button
                type="button"
                key={message.id}
                onClick={() => handleSelect(message.id)}
                className={`w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedMessage === message.id ? 'bg-red-50 dark:bg-red-950/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.read ? 'bg-slate-100 dark:bg-slate-800' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {message.read ? <MailOpen className="w-5 h-5 text-slate-500 dark:text-slate-400" /> : <Mail className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium" style={{ color: message.read ? 'var(--color-text-secondary)' : 'var(--color-text)' }}>{message.subject}</span>
                      {!message.read && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                    </div>
                    <p className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{message.content}</p>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{formatDateShort(message.date)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          {selected ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="border-b pb-4 mb-4" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>{selected.subject}</h2>
                <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  {formatDateShort(selected.date)}
                </div>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p style={{ color: 'var(--color-text-secondary)' }} className="whitespace-pre-line">{selected.content}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64" style={{ color: 'var(--color-text-secondary)' }}>
              Selecciona un mensaje para leerlo
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
