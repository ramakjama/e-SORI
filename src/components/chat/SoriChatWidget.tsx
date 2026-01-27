'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Bot, User, Sparkles,
  Minimize2, Maximize2, RotateCcw, Loader2, Volume2,
  VolumeX, Phone, Mail, Mic, Paperclip, ThumbsUp, ThumbsDown,
  ChevronDown
} from 'lucide-react'
import Image from 'next/image'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { formatMessageForChat } from '@/lib/sanitize'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  feedback?: 'positive' | 'negative'
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '¡Hola! 👋 Soy **SORI**, tu asistente virtual de Soriano Mediadores.\n\n¿En qué puedo ayudarte hoy?',
    timestamp: new Date(),
  },
]

const QUICK_ACTIONS = [
  { label: '📋 Pólizas', action: 'Quiero ver mis pólizas activas' },
  { label: '🚨 Siniestro', action: '¿Cómo comunico un siniestro?' },
  { label: '💳 Pagos', action: '¿Cuándo es mi próximo pago?' },
  { label: '🏆 Club', action: '¿Cómo funciona el programa de fidelidad?' },
]

const SUGGESTIONS_AFTER_RESPONSE = [
  'Cuéntame más',
  '¿Algo más?',
  'Ver mis pólizas',
  'Contactar agente',
]

export function SoriChatWidget() {
  const { user, policies, claims, isChatOpen, closeChat, openChat } = useStore()
  // Use store state for open/close
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isChatOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isChatOpen, isMinimized])

  // Play notification sound
  const playSound = useCallback(() => {
    if (soundEnabled && typeof window !== 'undefined') {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQ0AKZG4x7JzHwAsnrPLsXkjACuauM23fCQALJ+717OBIgArnLzRuYMiACygu9W4fyMALJ2917qBIgAsnbrWuoIjACyevNe5gCIALZ671biCIwAsn7vVuYIiACyfute5gSIALJ+617mBIgAsn7rXuYEjACyfu9e5gSIALZ+717mCIgAsn7vXuYEiACyfu9e5gSIALZ+717mBIgAsn7vXuYEiAC2fu9e5gSIALJ+717mBIgAsn7vXuYEiAA==')
      audio.volume = 0.3
      audio.play().catch(() => {})
    }
  }, [soundEnabled])

  const sendToAPI = async (messageText: string): Promise<string> => {
    try {
      // Build user context
      const userContext = user ? {
        name: user.name,
        level: user.level,
        points: user.points,
        policiesCount: policies.length,
        openClaims: claims.filter(c => c.status === 'in_progress' || c.status === 'pending').length,
      } : null

      // Build conversation history
      const conversationHistory = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationHistory,
          userContext,
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error('SORI API Error:', error)
      // Fallback to local responses
      return getFallbackResponse(messageText)
    }
  }

  const getFallbackResponse = (message: string): string => {
    const lower = message.toLowerCase()

    if (lower.includes('póliza') || lower.includes('poliza')) {
      const count = policies.length
      return `Tienes **${count} pólizas activas**. Puedes ver los detalles en la sección "Mis Pólizas" del menú lateral.\n\n¿Quieres que te cuente sobre alguna en particular?`
    }

    if (lower.includes('siniestro')) {
      return `Para comunicar un siniestro:\n\n1. Ve a "Siniestros" en el menú\n2. Haz clic en "Comunicar siniestro"\n3. Selecciona la póliza afectada\n4. Describe lo ocurrido\n\nUn agente se pondrá en contacto contigo en **menos de 24 horas**. ¿Necesitas ayuda?`
    }

    if (lower.includes('pago') || lower.includes('recibo')) {
      return `Puedes ver todos tus pagos y descargar recibos en la sección **"Pagos"**.\n\nPara domiciliación bancaria o dudas de facturación, llama al **966 810 290**.`
    }

    if (lower.includes('club') || lower.includes('punto') || lower.includes('nivel')) {
      const level = user?.level || 'BRONCE'
      const points = user?.points || 0
      return `¡Eres nivel **${level}** con **${points} puntos**! 🏆\n\nGana puntos por:\n• Contratar pólizas (+200)\n• Renovaciones (+100)\n• Pagos puntuales (+50)\n• Referir amigos (+150)\n\nVe a "Soriano Club" para ver todos tus beneficios.`
    }

    if (lower.includes('hola') || lower.includes('buenos') || lower.includes('hey')) {
      const name = user?.name?.split(' ')[0] || ''
      return `¡Hola${name ? ` ${name}` : ''}! 👋\n\nSoy **SORI**, tu asistente virtual. Puedo ayudarte con:\n\n• 📋 Consultas de pólizas\n• 🚨 Siniestros\n• 💳 Pagos y recibos\n• 🏆 Programa de fidelidad\n\n¿Qué necesitas hoy?`
    }

    if (lower.includes('gracias') || lower.includes('perfecto') || lower.includes('genial')) {
      return '¡De nada! 😊 Estoy aquí para ayudarte siempre. Si tienes más dudas, no dudes en preguntar.\n\n¡Que tengas un excelente día!'
    }

    if (lower.includes('teléfono') || lower.includes('llamar') || lower.includes('contacto')) {
      return `📞 **Contacta con nosotros:**\n\n• Teléfono: **966 810 290**\n• Email: info@sorianomediadores.es\n• Horario: L-V 9:00-14:00 y 16:00-19:00\n\nTambién puedes enviar un mensaje desde la sección "Mensajes".`
    }

    return `Entiendo tu consulta. Para asistencia personalizada:\n\n📞 Llama al **966 810 290**\n📧 O envía un mensaje desde el portal\n\n¿Puedo ayudarte con algo más específico?`
  }

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const response = await sendToAPI(messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      playSound()
      setShowSuggestions(true)
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo o llama al **966 810 290**.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, feedback } : m
      )
    )
  }

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES)
    setShowSuggestions(false)
  }

  const formatMessage = (content: string) => {
    // Sanitize HTML to prevent XSS attacks using our custom sanitizer
    // This replaces DOMPurify with a regex-based solution
    return formatMessageForChat(content)
  }

  const unreadCount = 1 // Could be dynamic based on notifications

  return (
    <>
      {/* Chat Button - Only visible on desktop when chat is closed */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openChat}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-occident via-occident-600 to-purple-600 rounded-full shadow-glow hidden lg:flex items-center justify-center text-white group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - Full screen on mobile, floating on desktop */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed z-[60] flex flex-col overflow-hidden',
              'bg-white dark:bg-slate-900',
              // Mobile: full screen
              'inset-0',
              // Desktop: floating window
              'lg:inset-auto lg:bottom-6 lg:right-6 lg:w-[420px] lg:h-[650px] lg:max-h-[85vh] lg:rounded-3xl lg:shadow-2xl lg:border lg:border-slate-200 lg:dark:border-slate-800',
              isMinimized && 'lg:h-auto'
            )}
          >
            {/* Header - Mobile optimized */}
            <div className="bg-gradient-to-r from-occident via-red-500 to-red-600 text-white safe-area-top">
              <div className="px-4 py-3 lg:py-4">
                <div className="flex items-center justify-between">
                  {/* Left: Back button on mobile, Avatar on desktop */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      onClick={closeChat}
                      whileTap={{ scale: 0.9 }}
                      className="lg:hidden w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.button>
                    <div className="relative hidden lg:block">
                      <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2 text-lg">
                        SORI
                        <Sparkles className="w-4 h-4 text-yellow-300 lg:hidden" />
                      </h3>
                      <p className="text-xs text-white/80">Asistente IA • En línea</p>
                    </div>
                  </div>

                  {/* Right: Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
                      title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
                    >
                      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
                      title="Nueva conversación"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="hidden lg:flex p-2.5 hover:bg-white/20 rounded-xl transition-colors"
                      title={isMinimized ? 'Maximizar' : 'Minimizar'}
                    >
                      {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={closeChat}
                      className="hidden lg:flex p-2.5 hover:bg-white/20 rounded-xl transition-colors"
                      title="Cerrar chat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages - Mobile optimized scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 overscroll-contain">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex items-end gap-2',
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-occident to-red-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <div
                          className={cn(
                            'px-4 py-3 text-sm leading-relaxed',
                            message.role === 'assistant'
                              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'
                              : 'bg-gradient-to-r from-occident to-red-500 text-white rounded-2xl rounded-br-md shadow-md'
                          )}
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        {message.role === 'assistant' && index > 0 && (
                          <div className="flex items-center gap-2 ml-2">
                            <button
                              type="button"
                              onClick={() => handleFeedback(message.id, 'positive')}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                message.feedback === 'positive'
                                  ? 'text-green-500 bg-green-50 dark:bg-green-950'
                                  : 'text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950'
                              )}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(message.id, 'negative')}
                              className={cn(
                                'p-1.5 rounded-lg transition-colors',
                                message.feedback === 'negative'
                                  ? 'text-red-500 bg-red-50 dark:bg-red-950'
                                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950'
                              )}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-end gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-occident to-red-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className="w-2 h-2 bg-occident rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 bg-occident rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 bg-occident rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions - Mobile optimized */}
                {messages.length <= 2 && !isLoading && (
                  <div className="px-4 pb-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                      ¿Cómo puedo ayudarte?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_ACTIONS.map((action) => (
                        <motion.button
                          type="button"
                          key={action.label}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSend(action.action)}
                          className="px-4 py-3 text-sm bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 active:from-occident/10 active:to-occident/5 text-slate-700 dark:text-slate-300 rounded-xl transition-all font-medium shadow-sm text-left"
                        >
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Options */}
                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6">
                  <a
                    href="tel:+34966810290"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-occident active:text-occident transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    966 810 290
                  </a>
                  <a
                    href="mailto:info@sorianomediadores.es"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-occident active:text-occident transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>

                {/* Input - Mobile optimized with safe area */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 safe-area-bottom">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-occident/30 text-slate-900 dark:text-white placeholder-slate-500 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      whileTap={{ scale: 0.9 }}
                      className="w-14 h-14 bg-gradient-to-r from-occident to-red-500 disabled:from-slate-300 disabled:to-slate-400 disabled:dark:from-slate-700 disabled:dark:to-slate-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg disabled:shadow-none"
                    >
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                    </motion.button>
                  </form>
                  <p className="text-center text-[10px] text-slate-400 mt-3">
                    Powered by Claude AI • Soriano Mediadores © 2026
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
