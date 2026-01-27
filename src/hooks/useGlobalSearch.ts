'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useStore, Policy, Document, Message, Claim } from '@/store/useStore'

export interface SearchResults {
  policies: Policy[]
  documents: Document[]
  messages: Message[]
  claims: Claim[]
}

export function useGlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { policies, documents, messages, claims } = useStore()

  const results = useMemo<SearchResults | null>(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()

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
      ).slice(0, 5),
    }
  }, [query, policies, documents, messages, claims])

  const totalResults = useMemo(() => {
    if (!results) return 0
    return results.policies.length + results.documents.length + results.messages.length + results.claims.length
  }, [results])

  const clearSearch = useCallback(() => {
    setQuery('')
    setIsOpen(false)
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Keyboard shortcut Cmd+K / Ctrl+K
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

  return {
    query,
    setQuery,
    results,
    totalResults,
    isOpen,
    setIsOpen,
    open,
    close,
    clearSearch
  }
}
