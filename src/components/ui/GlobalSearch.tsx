'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, FileText, Shield, MessageSquare, AlertTriangle, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore, Policy, Document, Message, Claim } from '@/store/useStore'

interface SearchResults {
  policies: Policy[]
  documents: Document[]
  messages: Message[]
  claims: Claim[]
}

export function GlobalSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { policies, documents, messages, claims } = useStore()

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Search results
  const results: SearchResults | null = (() => {
    if (!debouncedQuery.trim()) return null
    const q = debouncedQuery.toLowerCase()

    return {
      policies: policies.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.number.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      ).slice(0, 5),
      documents: documents.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      ).slice(0, 5),
      messages: messages.filter(m =>
        m.subject.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q)
      ).slice(0, 5),
      claims: claims.filter(c =>
        c.type.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.policyNumber.toLowerCase().includes(q)
      ).slice(0, 5)
    }
  })()

  const totalResults = results
    ? results.policies.length + results.documents.length + results.messages.length + results.claims.length
    : 0

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const handleResultClick = (route: string) => {
    router.push(route)
    setIsOpen(false)
    setQuery('')
  }

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'policy':
        return <Shield className="w-5 h-5" />
      case 'document':
        return <FileText className="w-5 h-5" />
      case 'message':
        return <MessageSquare className="w-5 h-5" />
      case 'claim':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button - Desktop */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl w-72 bg-app-surface hover:bg-app-surfaceHover border border-app-border transition-all duration-200"
      >
        <Search className="w-4 h-4 text-t-muted" />
        <span className="text-sm text-t-muted flex-1 text-left">
          Buscar...
        </span>
        <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-app-elevated border border-app-border text-t-faint">
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </button>

      {/* Search Trigger Button - Mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2.5 rounded-xl bg-app-surface hover:bg-app-surfaceHover border border-app-border transition-all duration-200"
        aria-label="Buscar"
      >
        <Search className="w-5 h-5 text-t-muted" />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[91] w-full max-w-2xl mx-4 rounded-2xl bg-app-elevated border border-app-border shadow-elevated overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-app-divider">
                <Search className="w-5 h-5 text-t-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar pólizas, documentos, mensajes..."
                  className="flex-1 bg-transparent outline-none text-base text-t-strong placeholder:text-t-faint"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1.5 rounded-lg hover:bg-app-surface transition-colors"
                    aria-label="Limpiar"
                  >
                    <X className="w-4 h-4 text-t-muted" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-app-surface transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-t-muted" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!debouncedQuery.trim() ? (
                  <div className="px-6 py-12 text-center">
                    <Search className="w-16 h-16 mx-auto mb-4 text-t-faint" strokeWidth={1.5} />
                    <p className="text-sm text-t-muted mb-6">
                      Busca en tus pólizas, documentos, mensajes y siniestros
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-t-faint">
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 rounded-lg bg-app-surface border border-app-border">
                          <Command className="w-3 h-3 inline" /> K
                        </kbd>
                        <span>para abrir</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 rounded-lg bg-app-surface border border-app-border">Esc</kbd>
                        <span>para cerrar</span>
                      </div>
                    </div>
                  </div>
                ) : totalResults === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-t-muted">
                      No se encontraron resultados para <span className="font-medium text-t-strong">"{debouncedQuery}"</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Pólizas */}
                    {results?.policies && results.policies.length > 0 && (
                      <div className="border-b border-app-divider">
                        <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-t-faint bg-app-surface">
                          Pólizas ({results.policies.length})
                        </div>
                        {results.policies.map((policy) => (
                          <motion.button
                            key={policy.id}
                            onClick={() => handleResultClick('/polizas')}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-app-surface transition-colors text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                              {getCategoryIcon('policy')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-t-strong truncate">
                                {policy.name}
                              </div>
                              <div className="text-sm text-t-muted truncate">
                                {policy.number}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Documentos */}
                    {results?.documents && results.documents.length > 0 && (
                      <div className="border-b border-app-divider">
                        <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-t-faint bg-app-surface">
                          Documentos ({results.documents.length})
                        </div>
                        {results.documents.map((doc) => (
                          <motion.button
                            key={doc.id}
                            onClick={() => handleResultClick('/documentos')}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-app-surface transition-colors text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="w-10 h-10 rounded-lg bg-state-infoBg flex items-center justify-center text-state-info flex-shrink-0">
                              {getCategoryIcon('document')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-t-strong truncate">
                                {doc.name}
                              </div>
                              <div className="text-sm text-t-muted truncate">
                                {doc.date}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Mensajes */}
                    {results?.messages && results.messages.length > 0 && (
                      <div className="border-b border-app-divider">
                        <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-t-faint bg-app-surface">
                          Mensajes ({results.messages.length})
                        </div>
                        {results.messages.map((message) => (
                          <motion.button
                            key={message.id}
                            onClick={() => handleResultClick('/mensajes')}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-app-surface transition-colors text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="w-10 h-10 rounded-lg bg-state-successBg flex items-center justify-center text-state-success flex-shrink-0">
                              {getCategoryIcon('message')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-t-strong truncate">
                                {message.subject}
                              </div>
                              <div className="text-sm text-t-muted truncate">
                                {message.content.slice(0, 60)}...
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Siniestros */}
                    {results?.claims && results.claims.length > 0 && (
                      <div>
                        <div className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-t-faint bg-app-surface">
                          Siniestros ({results.claims.length})
                        </div>
                        {results.claims.map((claim) => (
                          <motion.button
                            key={claim.id}
                            onClick={() => handleResultClick('/siniestros')}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-app-surface transition-colors text-left"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <div className="w-10 h-10 rounded-lg bg-state-warningBg flex items-center justify-center text-state-warning flex-shrink-0">
                              {getCategoryIcon('claim')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-t-strong truncate">
                                {claim.type}
                              </div>
                              <div className="text-sm text-t-muted truncate">
                                {claim.description.slice(0, 60)}...
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {debouncedQuery.trim() && totalResults > 0 && (
                <div className="px-5 py-3 border-t border-app-divider flex items-center justify-between text-xs text-t-faint">
                  <span>
                    {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GlobalSearch
