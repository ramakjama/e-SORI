'use client'

import { useState, useEffect, useCallback } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STORAGE_KEY = 'sori_chat_history'
const MAX_MESSAGES = 100

export function useChatPersistence() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          const messagesWithDates = parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
          setMessages(messagesWithDates)
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  const saveMessages = useCallback((newMessages: Message[]) => {
    if (typeof window !== 'undefined') {
      try {
        const toSave = newMessages.slice(-MAX_MESSAGES)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
        setMessages(toSave)
      } catch (error) {
        console.error('Error saving chat history:', error)
      }
    }
  }, [])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const updated = [...prev, message]
      saveMessages(updated)
      return updated
    })
  }, [saveMessages])

  const clearHistory = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      setMessages([])
    }
  }, [])

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(messages, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `sori_chat_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [messages])

  return {
    messages,
    isLoaded,
    addMessage,
    saveMessages,
    clearHistory,
    exportHistory,
  }
}
