'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, FileText, Shield, MessageSquare, AlertTriangle, ArrowRight, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useGlobalSearch } from '@/hooks/useGlobalSearch'
import { cn } from '@/lib/utils'

interface ResultItemProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  category: string
  isSelected: boolean
  onClick: () => void
}

function ResultItem({ icon, title, subtitle, category, isSelected, onClick }: ResultItemProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        isSelected
          ? 'bg-occident/10'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center',
        isSelected ? 'bg-occident text-white' : 'bg-slate-100 dark:bg-slate-800'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
          {title}
        </div>
        <div className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>
          {subtitle}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800" style={{ color: 'var(--color-text-secondary)' }}>
          {category}
        </span>
        {isSelected && (
          <ArrowRight className="w-4 h-4 text-occident" />
        )}
      </div>
    </motion.button>
  )
}

export function GlobalSearch() {
  const router = useRouter()
  const { query, setQuery, results, totalResults, isOpen, setIsOpen, clearSearch } = useGlobalSearch()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Build flat list of all results for keyboard navigation
  const flatResults = results ? [
    ...results.policies.map(p => ({ type: 'policy' as const, item: p, route: '/polizas' })),
    ...results.documents.map(d => ({ type: 'document' as const, item: d, route: '/documentos' })),
    ...results.messages.map(m => ({ type: 'message' as const, item: m, route: '/mensajes' })),
    ...results.claims.map(c => ({ type: 'claim' as const, item: c, route: '/siniestros' })),
  ] : []

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

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
  }, [isOpen, setIsOpen])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      e.preventDefault()
      router.push(flatResults[selectedIndex].route)
      clearSearch()
    }
  }, [flatResults, selectedIndex, router, clearSearch])

  const handleResultClick = (route: string) => {
    router.push(route)
    clearSearch()
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

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'policy':
        return 'Poliza'
      case 'document':
        return 'Documento'
      case 'message':
        return 'Mensaje'
      case 'claim':
        return 'Siniestro'
      default:
        return 'Otro'
    }
  }

  const getItemTitle = (type: string, item: any) => {
    switch (type) {
      case 'policy':
        return item.name
      case 'document':
        return item.name
      case 'message':
        return item.subject
      case 'claim':
        return item.type
      default:
        return 'Sin titulo'
    }
  }

  const getItemSubtitle = (type: string, item: any) => {
    switch (type) {
      case 'policy':
        return item.number
      case 'document':
        return item.date
      case 'message':
        return item.content.slice(0, 50) + '...'
      case 'claim':
        return item.description.slice(0, 50) + '...'
      default:
        return ''
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          'hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl w-72 transition-all',
          isOpen
            ? 'ring-2 ring-occident shadow-lg'
            : 'hover:shadow-md'
        )}
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <Search className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
        <span className="text-sm flex-1 text-left" style={{ color: 'var(--color-text-secondary)' }}>
          Buscar polizas, documentos...
        </span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-700" style={{ color: 'var(--color-text-secondary)' }}>
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2.5 rounded-xl"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        aria-label="Buscar"
      >
        <Search className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
      </button>

      {/* Search Modal/Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'absolute z-50 overflow-hidden rounded-2xl shadow-2xl border',
                'left-0 right-0 md:left-0 md:right-auto md:w-[480px]',
                'top-0 md:top-full md:mt-2',
                'fixed md:absolute inset-4 md:inset-auto'
              )}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--color-border)'
              }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <Search className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar polizas, documentos, mensajes..."
                  className="flex-1 bg-transparent outline-none text-base"
                  style={{ color: 'var(--color-text)' }}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Limpiar busqueda"
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {!query.trim() ? (
                  <div className="px-4 py-8 text-center">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text-secondary)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Escribe para buscar en polizas, documentos, mensajes y siniestros
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">↑↓</kbd>
                      <span>para navegar</span>
                      <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Enter</kbd>
                      <span>para seleccionar</span>
                      <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Esc</kbd>
                      <span>para cerrar</span>
                    </div>
                  </div>
                ) : totalResults === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      No se encontraron resultados para "{query}"
                    </p>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {/* Policies Section */}
                    {results?.policies && results.policies.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-bg-secondary)' }}>
                          Polizas ({results.policies.length})
                        </div>
                        {results.policies.map((policy, index) => {
                          const globalIndex = index
                          return (
                            <ResultItem
                              key={policy.id}
                              icon={getCategoryIcon('policy')}
                              title={getItemTitle('policy', policy)}
                              subtitle={getItemSubtitle('policy', policy)}
                              category={getCategoryLabel('policy')}
                              isSelected={selectedIndex === globalIndex}
                              onClick={() => handleResultClick('/polizas')}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Documents Section */}
                    {results?.documents && results.documents.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-bg-secondary)' }}>
                          Documentos ({results.documents.length})
                        </div>
                        {results.documents.map((doc, index) => {
                          const globalIndex = (results?.policies?.length || 0) + index
                          return (
                            <ResultItem
                              key={doc.id}
                              icon={getCategoryIcon('document')}
                              title={getItemTitle('document', doc)}
                              subtitle={getItemSubtitle('document', doc)}
                              category={getCategoryLabel('document')}
                              isSelected={selectedIndex === globalIndex}
                              onClick={() => handleResultClick('/documentos')}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Messages Section */}
                    {results?.messages && results.messages.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-bg-secondary)' }}>
                          Mensajes ({results.messages.length})
                        </div>
                        {results.messages.map((message, index) => {
                          const globalIndex = (results?.policies?.length || 0) + (results?.documents?.length || 0) + index
                          return (
                            <ResultItem
                              key={message.id}
                              icon={getCategoryIcon('message')}
                              title={getItemTitle('message', message)}
                              subtitle={getItemSubtitle('message', message)}
                              category={getCategoryLabel('message')}
                              isSelected={selectedIndex === globalIndex}
                              onClick={() => handleResultClick('/mensajes')}
                            />
                          )
                        })}
                      </div>
                    )}

                    {/* Claims Section */}
                    {results?.claims && results.claims.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'var(--color-bg-secondary)' }}>
                          Siniestros ({results.claims.length})
                        </div>
                        {results.claims.map((claim, index) => {
                          const globalIndex = (results?.policies?.length || 0) + (results?.documents?.length || 0) + (results?.messages?.length || 0) + index
                          return (
                            <ResultItem
                              key={claim.id}
                              icon={getCategoryIcon('claim')}
                              title={getItemTitle('claim', claim)}
                              subtitle={getItemSubtitle('claim', claim)}
                              category={getCategoryLabel('claim')}
                              isSelected={selectedIndex === globalIndex}
                              onClick={() => handleResultClick('/siniestros')}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {query.trim() && totalResults > 0 && (
                <div className="px-4 py-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-tertiary)' }}>
                  <span>{totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}</span>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">Enter</kbd>
                    <span>para abrir</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
