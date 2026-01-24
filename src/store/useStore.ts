import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserLevel = 'BRONCE' | 'PLATA' | 'ORO' | 'PLATINO'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  dni: string
  avatar?: string
  address: string
  city: string
  postalCode: string
  level: UserLevel
  points: number
  badges: Badge[]
  referralCode: string
  referralsCount: number
}

export interface Policy {
  id: string
  type: 'auto' | 'hogar' | 'vida' | 'salud' | 'decesos'
  number: string
  name: string
  status: 'active' | 'pending' | 'expired'
  premium: number
  startDate: string
  endDate: string
  nextPayment: string
  coverage: string[]
}

export interface ClaimTimelineEvent {
  id: string
  status: string
  title: string
  description: string
  date: string
  completed: boolean
}

export interface Claim {
  id: string
  policyId: string
  policyNumber: string
  type: string
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected'
  date: string
  description: string
  amount?: number
  documents: string[]
  timeline: ClaimTimelineEvent[]
  assignedAgent?: string
  estimatedResolution?: string
}

export interface Document {
  id: string
  name: string
  type: 'policy' | 'receipt' | 'claim' | 'other'
  policyId?: string
  date: string
  size: string
  url: string
}

export interface Message {
  id: string
  subject: string
  content: string
  date: string
  read: boolean
  from: 'soriano' | 'user'
}

export interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'points'
  title: string
  message: string
  date: string
  read: boolean
}

export type UserRole = 'CLIENTE' | 'EMPLEADO'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  userRole: UserRole | null
  policies: Policy[]
  claims: Claim[]
  documents: Document[]
  messages: Message[]
  notifications: Notification[]
  sidebarOpen: boolean
  isChatOpen: boolean

  login: (email: string, password: string, role?: UserRole) => Promise<boolean>
  logout: () => void
  toggleSidebar: () => void
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  markMessageAsRead: (id: string) => void
  addClaim: (claim: Omit<Claim, 'id' | 'timeline'>) => void
  addPoints: (points: number, reason: string) => void
  unlockBadge: (badge: Badge) => void
  markNotificationRead: (id: string) => void
  setUserRole: (role: UserRole) => void
}

// Mock data
const mockBadges: Badge[] = [
  { id: '1', name: 'Primeros Pasos', description: 'Completaste tu perfil', icon: '🎯', unlockedAt: '2024-01-15' },
  { id: '2', name: 'Previsor', description: 'Tienes 3+ pólizas activas', icon: '🛡️', unlockedAt: '2024-03-01' },
  { id: '3', name: 'Digital', description: 'Usaste el portal 10 veces', icon: '💻', unlockedAt: '2024-04-10' },
  { id: '4', name: 'Puntual', description: 'Todos los pagos al día', icon: '⏰', unlockedAt: '2024-05-01' },
]

const mockUser: User = {
  id: '1',
  name: 'Juan García López',
  email: 'juan.garcia@email.com',
  phone: '666 123 456',
  dni: '12345678A',
  address: 'Calle Mayor 15, 2º B',
  city: 'Villajoyosa',
  postalCode: '03570',
  level: 'ORO',
  points: 2850,
  badges: mockBadges,
  referralCode: 'JUAN2024',
  referralsCount: 3,
}

const mockPolicies: Policy[] = [
  {
    id: '1',
    type: 'auto',
    number: 'AUTO-2024-001234',
    name: 'Seguro Coche - Seat Ibiza',
    status: 'active',
    premium: 420,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    nextPayment: '2024-07-15',
    coverage: ['Responsabilidad civil', 'Lunas', 'Asistencia en carretera', 'Robo'],
  },
  {
    id: '2',
    type: 'hogar',
    number: 'HOG-2024-005678',
    name: 'Seguro Hogar - Piso Villajoyosa',
    status: 'active',
    premium: 280,
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    nextPayment: '2024-09-01',
    coverage: ['Continente', 'Contenido', 'RC', 'Asistencia hogar 24h'],
  },
  {
    id: '3',
    type: 'vida',
    number: 'VID-2023-009012',
    name: 'Seguro Vida - Fallecimiento',
    status: 'active',
    premium: 156,
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    nextPayment: '2024-06-01',
    coverage: ['Fallecimiento 100.000€', 'Invalidez absoluta'],
  },
  {
    id: '4',
    type: 'salud',
    number: 'SAL-2024-003456',
    name: 'Seguro Salud Familiar',
    status: 'active',
    premium: 890,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    nextPayment: '2024-08-01',
    coverage: ['Medicina general', 'Especialistas', 'Hospitalización', 'Urgencias 24h'],
  },
]

const mockClaims: Claim[] = [
  {
    id: '1',
    policyId: '1',
    policyNumber: 'AUTO-2024-001234',
    type: 'Daños propios',
    status: 'resolved',
    date: '2024-05-15',
    description: 'Golpe en el parachoques trasero en parking',
    amount: 450,
    documents: ['foto_dano.jpg', 'presupuesto.pdf'],
    assignedAgent: 'María López',
    timeline: [
      { id: '1', status: 'received', title: 'Siniestro recibido', description: 'Hemos recibido tu comunicación', date: '2024-05-15 09:30', completed: true },
      { id: '2', status: 'assigned', title: 'Agente asignado', description: 'María López gestiona tu caso', date: '2024-05-15 10:15', completed: true },
      { id: '3', status: 'documentation', title: 'Documentación revisada', description: 'Toda la documentación correcta', date: '2024-05-16 11:00', completed: true },
      { id: '4', status: 'assessment', title: 'Valoración completada', description: 'Peritaje: 450€', date: '2024-05-18 14:30', completed: true },
      { id: '5', status: 'resolved', title: 'Siniestro resuelto', description: 'Pago realizado en tu cuenta', date: '2024-05-22 09:00', completed: true },
    ],
  },
  {
    id: '2',
    policyId: '2',
    policyNumber: 'HOG-2024-005678',
    type: 'Daños por agua',
    status: 'in_progress',
    date: '2024-06-20',
    description: 'Fuga de agua en cocina afectando al suelo',
    documents: ['foto_fuga.jpg'],
    assignedAgent: 'Carlos Ruiz',
    estimatedResolution: '2024-07-05',
    timeline: [
      { id: '1', status: 'received', title: 'Siniestro recibido', description: 'Hemos recibido tu comunicación', date: '2024-06-20 16:45', completed: true },
      { id: '2', status: 'assigned', title: 'Agente asignado', description: 'Carlos Ruiz gestiona tu caso', date: '2024-06-20 17:30', completed: true },
      { id: '3', status: 'documentation', title: 'Esperando documentación', description: 'Necesitamos fotos adicionales', date: '2024-06-21 09:00', completed: true },
      { id: '4', status: 'assessment', title: 'Perito en camino', description: 'Visita programada para valoración', date: '2024-06-25 10:00', completed: false },
      { id: '5', status: 'resolved', title: 'Resolución', description: 'Pendiente de valoración', date: '', completed: false },
    ],
  },
]

const mockDocuments: Document[] = [
  { id: '1', name: 'Póliza Coche 2024', type: 'policy', policyId: '1', date: '2024-01-15', size: '1.2 MB', url: '#' },
  { id: '2', name: 'Recibo Enero 2024', type: 'receipt', policyId: '1', date: '2024-01-15', size: '245 KB', url: '#' },
  { id: '3', name: 'Póliza Hogar 2024', type: 'policy', policyId: '2', date: '2024-03-01', size: '1.5 MB', url: '#' },
  { id: '4', name: 'Condiciones Generales Auto', type: 'other', date: '2024-01-15', size: '3.2 MB', url: '#' },
  { id: '5', name: 'Póliza Vida 2023', type: 'policy', policyId: '3', date: '2023-06-01', size: '980 KB', url: '#' },
  { id: '6', name: 'Póliza Salud 2024', type: 'policy', policyId: '4', date: '2024-02-01', size: '2.1 MB', url: '#' },
]

const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Bienvenido a tu área de cliente',
    content: 'Hola Juan, bienvenido a tu nuevo portal e-SORI de Soriano Mediadores...',
    date: '2024-06-01',
    read: true,
    from: 'soriano',
  },
  {
    id: '2',
    subject: 'Tu siniestro ha sido resuelto',
    content: 'Te informamos que el siniestro AUTO-2024-001234-S1 ha sido resuelto satisfactoriamente...',
    date: '2024-06-10',
    read: true,
    from: 'soriano',
  },
  {
    id: '3',
    subject: 'Recordatorio: Próximo vencimiento',
    content: 'Te recordamos que tu póliza de vida vence el próximo 1 de junio...',
    date: '2024-06-18',
    read: false,
    from: 'soriano',
  },
]

const mockNotifications: Notification[] = [
  { id: '1', type: 'points', title: '+50 puntos', message: 'Por pago puntual de tu póliza', date: '2024-06-15', read: true },
  { id: '2', type: 'success', title: 'Siniestro resuelto', message: 'Tu siniestro AUTO-2024-001234 ha sido resuelto', date: '2024-05-22', read: true },
  { id: '3', type: 'info', title: 'Nuevo documento', message: 'Recibo de junio disponible para descargar', date: '2024-06-01', read: false },
  { id: '4', type: 'points', title: '+100 puntos', message: 'Por completar tu perfil al 100%', date: '2024-04-10', read: true },
]

const calculateLevel = (points: number): UserLevel => {
  if (points >= 5000) return 'PLATINO'
  if (points >= 2500) return 'ORO'
  if (points >= 1000) return 'PLATA'
  return 'BRONCE'
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      userRole: null,
      policies: mockPolicies,
      claims: mockClaims,
      documents: mockDocuments,
      messages: mockMessages,
      notifications: mockNotifications,
      sidebarOpen: true,
      isChatOpen: false,

      login: async (email: string, password: string, role: UserRole = 'CLIENTE') => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (email && password) {
          set({ user: mockUser, isAuthenticated: true, userRole: role })
          return true
        }
        return false
      },

      logout: () => set({ user: null, isAuthenticated: false, userRole: null, isChatOpen: false }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

      openChat: () => set({ isChatOpen: true }),

      closeChat: () => set({ isChatOpen: false }),

      setUserRole: (role: UserRole) => set({ userRole: role }),

      markMessageAsRead: (id: string) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, read: true } : m
          ),
        })),

      addClaim: (claim) =>
        set((state) => ({
          claims: [
            ...state.claims,
            {
              ...claim,
              id: Date.now().toString(),
              timeline: [
                {
                  id: '1',
                  status: 'received',
                  title: 'Siniestro recibido',
                  description: 'Hemos recibido tu comunicación',
                  date: new Date().toISOString(),
                  completed: true,
                },
              ],
            },
          ],
        })),

      addPoints: (points: number, reason: string) =>
        set((state) => {
          if (!state.user) return state
          const newPoints = state.user.points + points
          const newLevel = calculateLevel(newPoints)
          const levelChanged = newLevel !== state.user.level

          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'points',
            title: `+${points} puntos`,
            message: reason,
            date: new Date().toISOString().split('T')[0],
            read: false,
          }

          return {
            user: {
              ...state.user,
              points: newPoints,
              level: newLevel,
            },
            notifications: [newNotification, ...state.notifications],
          }
        }),

      unlockBadge: (badge: Badge) =>
        set((state) => {
          if (!state.user) return state
          const hasBadge = state.user.badges.some((b) => b.id === badge.id)
          if (hasBadge) return state

          const unlockedBadge = {
            ...badge,
            unlockedAt: new Date().toISOString().split('T')[0],
          }

          const newNotification: Notification = {
            id: Date.now().toString(),
            type: 'success',
            title: 'Nueva insignia desbloqueada',
            message: `Has conseguido: ${badge.name}`,
            date: new Date().toISOString().split('T')[0],
            read: false,
          }

          return {
            user: {
              ...state.user,
              badges: [...state.user.badges, unlockedBadge],
            },
            notifications: [newNotification, ...state.notifications],
          }
        }),

      markNotificationRead: (id: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: 'soriano-esori-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
      }),
    }
  )
)
