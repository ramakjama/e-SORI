'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins, Gift, Tag, Sparkles, ShoppingBag, Star,
  CheckCircle, Clock, History, Filter, Search,
  CreditCard, Percent, Headphones, Utensils, Heart,
  Tv, Music, ShoppingCart, Award, TrendingUp,
  ChevronRight, X, AlertCircle, PartyPopper
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import Modal from '@/components/ui/Modal'

// Types
type RewardCategory = 'all' | 'vouchers' | 'perks' | 'experiencias'

interface Reward {
  id: string
  name: string
  description: string
  category: Exclude<RewardCategory, 'all'>
  coins: number
  euroValue?: number
  icon: React.ElementType
  gradient: string
  available: boolean
  featured?: boolean
  stock?: number
  expiresIn?: string
}

interface RedemptionRecord {
  id: string
  rewardId: string
  rewardName: string
  coins: number
  date: string
  status: 'completed' | 'pending' | 'processing'
  code?: string
}

// Rewards Data
const rewards: Reward[] = [
  // VOUCHERS
  {
    id: 'v1',
    name: 'Amazon 10EUR',
    description: 'Tarjeta regalo Amazon de 10EUR para gastar en millones de productos',
    category: 'vouchers',
    coins: 200,
    euroValue: 10,
    icon: ShoppingCart,
    gradient: 'from-orange-500 to-amber-500',
    available: true,
    featured: true,
    stock: 50
  },
  {
    id: 'v2',
    name: 'Amazon 25EUR',
    description: 'Tarjeta regalo Amazon de 25EUR para compras premium',
    category: 'vouchers',
    coins: 500,
    euroValue: 25,
    icon: ShoppingCart,
    gradient: 'from-orange-500 to-amber-500',
    available: true,
    stock: 30
  },
  {
    id: 'v3',
    name: 'Netflix 1 mes',
    description: 'Disfruta de un mes completo de Netflix Premium',
    category: 'vouchers',
    coins: 180,
    euroValue: 9,
    icon: Tv,
    gradient: 'from-red-600 to-red-700',
    available: true,
    featured: true,
    stock: 100
  },
  {
    id: 'v4',
    name: 'Spotify 3 meses',
    description: 'Musica sin limites durante 3 meses con Spotify Premium',
    category: 'vouchers',
    coins: 600,
    euroValue: 30,
    icon: Music,
    gradient: 'from-green-500 to-emerald-600',
    available: true,
    stock: 40
  },
  // PERKS
  {
    id: 'p1',
    name: 'Descuento 5%',
    description: 'Aplicable a tu proxima renovacion de poliza',
    category: 'perks',
    coins: 400,
    icon: Percent,
    gradient: 'from-blue-500 to-cyan-500',
    available: true,
    expiresIn: '6 meses'
  },
  {
    id: 'p2',
    name: 'Descuento 10%',
    description: 'Descuento premium aplicable a cualquier poliza nueva',
    category: 'perks',
    coins: 800,
    icon: Percent,
    gradient: 'from-purple-500 to-violet-600',
    available: true,
    featured: true,
    expiresIn: '6 meses'
  },
  {
    id: 'p3',
    name: 'Soporte Prioritario',
    description: 'Atencion preferente durante 1 ano con linea directa',
    category: 'perks',
    coins: 600,
    icon: Headphones,
    gradient: 'from-indigo-500 to-blue-600',
    available: true,
    expiresIn: '12 meses'
  },
  // EXPERIENCIAS
  {
    id: 'e1',
    name: 'Dia SPA',
    description: 'Circuito completo de SPA para 2 personas en centros seleccionados',
    category: 'experiencias',
    coins: 2000,
    euroValue: 100,
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    available: true,
    featured: true,
    stock: 10
  },
  {
    id: 'e2',
    name: 'Cena Michelin',
    description: 'Menu degustacion para 2 en restaurante con estrella Michelin',
    category: 'experiencias',
    coins: 3000,
    euroValue: 150,
    icon: Utensils,
    gradient: 'from-amber-500 to-yellow-500',
    available: true,
    stock: 5
  }
]

// Mock redemption history
const mockRedemptionHistory: RedemptionRecord[] = [
  {
    id: 'r1',
    rewardId: 'v1',
    rewardName: 'Amazon 10EUR',
    coins: 200,
    date: '2024-06-15',
    status: 'completed',
    code: 'AMZN-XXXX-YYYY-ZZZZ'
  },
  {
    id: 'r2',
    rewardId: 'v3',
    rewardName: 'Netflix 1 mes',
    coins: 180,
    date: '2024-06-01',
    status: 'completed',
    code: 'NFLX-ABCD-EFGH'
  },
  {
    id: 'r3',
    rewardId: 'p1',
    rewardName: 'Descuento 5%',
    coins: 400,
    date: '2024-05-20',
    status: 'completed'
  }
]

// Confetti Component
const Confetti = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    color: string
    delay: number
    rotation: number
  }>>([])

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'][Math.floor(Math.random() * 7)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => setParticles([]), 3000)
      return () => clearTimeout(timer)
    }
  }, [active])

  if (!active || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            y: -20,
            x: `${particle.x}vw`,
            rotate: 0,
            opacity: 1,
            scale: 1
          }}
          animate={{
            y: '100vh',
            rotate: particle.rotation + 720,
            opacity: 0,
            scale: 0.5
          }}
          transition={{
            duration: 2.5 + Math.random(),
            delay: particle.delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  )
}

// Tab Component
const TabButton = ({
  active,
  onClick,
  children,
  count
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
}) => (
  <button
    onClick={onClick}
    className={cn(
      'relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200',
      active
        ? 'bg-occident text-white shadow-lg shadow-occident/25'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
    )}
    style={{ color: active ? undefined : 'var(--color-text)' }}
  >
    <span className="flex items-center gap-2">
      {children}
      {count !== undefined && (
        <span className={cn(
          'px-1.5 py-0.5 rounded-full text-xs',
          active
            ? 'bg-white/20 text-white'
            : 'bg-slate-200 dark:bg-slate-700'
        )}>
          {count}
        </span>
      )}
    </span>
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-occident rounded-xl -z-10"
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      />
    )}
  </button>
)

// Reward Card Component
const RewardCard = ({
  reward,
  userCoins,
  onRedeem
}: {
  reward: Reward
  userCoins: number
  onRedeem: (reward: Reward) => void
}) => {
  const canAfford = userCoins >= reward.coins
  const Icon = reward.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative group rounded-2xl overflow-hidden border-2 transition-all duration-300',
        canAfford
          ? 'border-transparent hover:border-occident/30 cursor-pointer'
          : 'border-transparent opacity-75'
      )}
      style={{ backgroundColor: 'var(--color-card)' }}
    >
      {/* Featured Badge */}
      {reward.featured && (
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3" />
            Popular
          </div>
        </div>
      )}

      {/* Stock Badge */}
      {reward.stock && reward.stock <= 10 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="px-2 py-1 bg-red-500/90 rounded-full text-white text-xs font-semibold">
            Quedan {reward.stock}
          </div>
        </div>
      )}

      {/* Gradient Header */}
      <div className={cn(
        'h-28 bg-gradient-to-br flex items-center justify-center relative overflow-hidden',
        reward.gradient
      )}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
          {reward.name}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {reward.description}
        </p>

        {/* Price & Value */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {reward.coins.toLocaleString()}
            </span>
          </div>
          {reward.euroValue && (
            <span className="text-sm font-medium px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              Valor {reward.euroValue}EUR
            </span>
          )}
          {reward.expiresIn && (
            <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
              Valido {reward.expiresIn}
            </span>
          )}
        </div>

        {/* Redeem Button */}
        <motion.button
          whileHover={canAfford ? { scale: 1.02 } : {}}
          whileTap={canAfford ? { scale: 0.98 } : {}}
          onClick={() => canAfford && onRedeem(reward)}
          disabled={!canAfford}
          className={cn(
            'w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
            canAfford
              ? 'bg-gradient-to-r from-occident to-red-600 text-white hover:shadow-lg hover:shadow-occident/25'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
          )}
        >
          {canAfford ? (
            <>
              <Gift className="w-4 h-4" />
              Canjear ahora
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Coins insuficientes
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function MarketplacePage() {
  const { user, addPoints } = useStore()

  // State
  const [activeTab, setActiveTab] = useState<RewardCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>(mockRedemptionHistory)
  const [showHistoryPanel, setShowHistoryPanel] = useState(false)

  // Simulated user coins (using points from store, multiplied for demo purposes)
  const userCoins = user?.points || 0

  // Euro equivalent (20 coins = 1EUR)
  const euroEquivalent = useMemo(() => (userCoins / 20).toFixed(2), [userCoins])

  // Filtered rewards
  const filteredRewards = useMemo(() => {
    let result = rewards

    // Filter by category
    if (activeTab !== 'all') {
      result = result.filter(r => r.category === activeTab)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.coins - b.coins)
        break
      case 'price_desc':
        result = [...result].sort((a, b) => b.coins - a.coins)
        break
      case 'popular':
      default:
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [activeTab, searchQuery, sortBy])

  // Category counts
  const categoryCounts = useMemo(() => ({
    all: rewards.length,
    vouchers: rewards.filter(r => r.category === 'vouchers').length,
    perks: rewards.filter(r => r.category === 'perks').length,
    experiencias: rewards.filter(r => r.category === 'experiencias').length,
  }), [])

  // Handle redeem click
  const handleRedeemClick = useCallback((reward: Reward) => {
    setSelectedReward(reward)
    setShowConfirmModal(true)
  }, [])

  // Confirm redemption
  const confirmRedemption = useCallback(async () => {
    if (!selectedReward || !user) return

    setIsRedeeming(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Deduct coins (negative points)
    addPoints(-selectedReward.coins, `Canje: ${selectedReward.name}`)

    // Add to history
    const newRedemption: RedemptionRecord = {
      id: `r${Date.now()}`,
      rewardId: selectedReward.id,
      rewardName: selectedReward.name,
      coins: selectedReward.coins,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      code: selectedReward.category === 'vouchers'
        ? `${selectedReward.name.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        : undefined
    }
    setRedemptionHistory(prev => [newRedemption, ...prev])

    setIsRedeeming(false)
    setShowConfirmModal(false)
    setShowSuccessModal(true)
    setShowConfetti(true)

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000)
  }, [selectedReward, user, addPoints])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Confetti Effect */}
      <Confetti active={showConfetti} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-occident/10 rounded-full mb-4">
          <ShoppingBag className="w-5 h-5 text-occident" />
          <span className="font-medium" style={{ color: 'var(--color-text)' }}>Tienda de recompensas</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Marketplace
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Canjea tus COINS por premios exclusivos
        </p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 md:p-8 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-white/80 mb-1 text-sm font-medium">Tu saldo actual</p>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <Coins className="w-8 h-8" />
              </motion.div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  {userCoins.toLocaleString()}
                </h2>
                <p className="text-white/80 text-sm">COINS disponibles</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
              <p className="text-white/80 text-xs mb-1">Equivalente en EUR</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <CreditCard className="w-5 h-5" />
                {euroEquivalent} EUR
              </p>
            </div>
            <p className="text-white/70 text-xs">20 COINS = 1 EUR</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{redemptionHistory.length}</p>
            <p className="text-white/70 text-xs">Canjes realizados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {redemptionHistory.reduce((acc, r) => acc + r.coins, 0).toLocaleString()}
            </p>
            <p className="text-white/70 text-xs">COINS canjeados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{rewards.filter(r => userCoins >= r.coins).length}</p>
            <p className="text-white/70 text-xs">Premios disponibles</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <TabButton
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              count={categoryCounts.all}
            >
              TODOS
            </TabButton>
            <TabButton
              active={activeTab === 'vouchers'}
              onClick={() => setActiveTab('vouchers')}
              count={categoryCounts.vouchers}
            >
              <Gift className="w-4 h-4" />
              VOUCHERS
            </TabButton>
            <TabButton
              active={activeTab === 'perks'}
              onClick={() => setActiveTab('perks')}
              count={categoryCounts.perks}
            >
              <Tag className="w-4 h-4" />
              PERKS
            </TabButton>
            <TabButton
              active={activeTab === 'experiencias'}
              onClick={() => setActiveTab('experiencias')}
              count={categoryCounts.experiencias}
            >
              <Sparkles className="w-4 h-4" />
              EXPERIENCIAS
            </TabButton>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                placeholder="Buscar premios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-occident/20 text-sm"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)'
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-occident/20 text-sm"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)'
              }}
            >
              <option value="popular">Mas populares</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>

            <button
              onClick={() => setShowHistoryPanel(true)}
              className="p-2 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
              title="Historial de canjes"
            >
              <History className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Rewards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredRewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <RewardCard
                reward={reward}
                userCoins={userCoins}
                onRedeem={handleRedeemClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredRewards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <Search className="w-10 h-10" style={{ color: 'var(--color-text-tertiary)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            No se encontraron premios
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Intenta con otros filtros o terminos de busqueda
          </p>
        </motion.div>
      )}

      {/* How to earn more coins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <TrendingUp className="w-5 h-5 text-occident" />
          Como ganar mas COINS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { action: 'Completar quiz diario', coins: '+50', icon: Award },
            { action: 'Referir amigos', coins: '+150', icon: Gift },
            { action: 'Pago puntual', coins: '+50', icon: CheckCircle },
            { action: 'Renovar poliza', coins: '+100', icon: Star },
          ].map((item, index) => (
            <motion.div
              key={item.action}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: 'var(--color-background)' }}
            >
              <div className="w-10 h-10 mx-auto mb-2 bg-occident/10 rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-occident" />
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                {item.action}
              </p>
              <p className="text-lg font-bold text-amber-500">{item.coins}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isRedeeming && setShowConfirmModal(false)}
        variant="premium"
        size="md"
      >
        {selectedReward && (
          <div className="text-center">
            <div className={cn(
              'w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center',
              selectedReward.gradient
            )}>
              <selectedReward.icon className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Confirmar canje
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Estas a punto de canjear <strong>{selectedReward.name}</strong>
            </p>

            <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'var(--color-background)' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: 'var(--color-text-secondary)' }}>Coste</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {selectedReward.coins.toLocaleString()} COINS
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: 'var(--color-text-secondary)' }}>Tu saldo actual</span>
                <span className="font-medium" style={{ color: 'var(--color-text)' }}>
                  {userCoins.toLocaleString()} COINS
                </span>
              </div>
              <div className="h-px my-2" style={{ backgroundColor: 'var(--color-border)' }} />
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-secondary)' }}>Saldo despues del canje</span>
                <span className="font-bold text-emerald-500">
                  {(userCoins - selectedReward.coins).toLocaleString()} COINS
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isRedeeming}
                className="flex-1 py-3 rounded-xl font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)'
                }}
              >
                Cancelar
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmRedemption}
                disabled={isRedeeming}
                className={cn(
                  'flex-1 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
                  'bg-gradient-to-r from-occident to-red-600',
                  isRedeeming && 'opacity-75 cursor-not-allowed'
                )}
              >
                {isRedeeming ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Confirmar canje
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        variant="default"
        size="md"
      >
        {selectedReward && (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center"
            >
              <PartyPopper className="w-12 h-12 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Canje exitoso!
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
              Has canjeado <strong>{selectedReward.name}</strong> correctamente
            </p>

            {selectedReward.category === 'vouchers' && (
              <div className="p-4 rounded-xl mb-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                  Tu codigo de canje:
                </p>
                <code className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-300 tracking-wider">
                  {redemptionHistory[0]?.code || 'XXXX-XXXX-XXXX'}
                </code>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                  Tambien lo recibiras por email
                </p>
              </div>
            )}

            {selectedReward.category === 'perks' && (
              <div className="p-4 rounded-xl mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  El beneficio ha sido activado en tu cuenta y se aplicara automaticamente.
                </p>
              </div>
            )}

            {selectedReward.category === 'experiencias' && (
              <div className="p-4 rounded-xl mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Nuestro equipo se pondra en contacto contigo en 24-48h para coordinar tu experiencia.
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowSuccessModal(false)
                setSelectedReward(null)
              }}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-occident to-red-600"
            >
              Genial!
            </motion.button>
          </div>
        )}
      </Modal>

      {/* History Panel (Slide-over) */}
      <AnimatePresence>
        {showHistoryPanel && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryPanel(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md shadow-2xl"
              style={{ backgroundColor: 'var(--color-card)' }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-occident/10 rounded-xl flex items-center justify-center">
                      <History className="w-5 h-5 text-occident" />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: 'var(--color-text)' }}>
                        Historial de canjes
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {redemptionHistory.length} canjes realizados
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHistoryPanel(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {redemptionHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
                      </div>
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                        Sin canjes todavia
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Tus canjes apareceran aqui
                      </p>
                    </div>
                  ) : (
                    redemptionHistory.map((record, index) => (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl border"
                        style={{
                          backgroundColor: 'var(--color-background)',
                          borderColor: 'var(--color-border)'
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                              {record.rewardName}
                            </h4>
                            <p className="text-sm flex items-center gap-1" style={{ color: 'var(--color-text-secondary)' }}>
                              <Clock className="w-3 h-3" />
                              {formatDate(record.date)}
                            </p>
                          </div>
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            record.status === 'completed' && 'bg-emerald-500/10 text-emerald-600',
                            record.status === 'pending' && 'bg-amber-500/10 text-amber-600',
                            record.status === 'processing' && 'bg-blue-500/10 text-blue-600'
                          )}>
                            {record.status === 'completed' && 'Completado'}
                            {record.status === 'pending' && 'Pendiente'}
                            {record.status === 'processing' && 'Procesando'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-amber-600 flex items-center gap-1">
                            <Coins className="w-3 h-3" />
                            -{record.coins.toLocaleString()} COINS
                          </span>
                          {record.code && (
                            <code className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800" style={{ color: 'var(--color-text-secondary)' }}>
                              {record.code}
                            </code>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
