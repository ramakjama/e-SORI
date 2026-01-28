'use client'

/**
 * MARKETPLACE - Versión Optimizada
 * Sistema simplificado de recompensas sin animaciones pesadas
 */

import { useState } from 'react'
import {
  Coins, Gift, ShoppingCart, Tv, Music, Utensils,
  CheckCircle, Clock, X, ShoppingBag
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

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
  stock?: number
}

// Recompensas simplificadas
const rewards: Reward[] = [
  {
    id: 'v1',
    name: 'Amazon 10EUR',
    description: 'Tarjeta regalo Amazon de 10EUR',
    category: 'vouchers',
    coins: 200,
    euroValue: 10,
    icon: ShoppingCart,
    gradient: 'from-orange-500 to-amber-500',
    available: true,
    stock: 50
  },
  {
    id: 'v2',
    name: 'Amazon 25EUR',
    description: 'Tarjeta regalo Amazon de 25EUR',
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
    description: 'Un mes completo de Netflix Premium',
    category: 'vouchers',
    coins: 180,
    euroValue: 9,
    icon: Tv,
    gradient: 'from-red-600 to-red-700',
    available: true,
    stock: 100
  },
  {
    id: 'v4',
    name: 'Spotify 3 meses',
    description: 'Música sin límites durante 3 meses',
    category: 'vouchers',
    coins: 600,
    euroValue: 30,
    icon: Music,
    gradient: 'from-green-500 to-emerald-600',
    available: true,
    stock: 40
  },
  {
    id: 'p1',
    name: 'Descuento Renovación',
    description: '10% descuento en tu próxima renovación',
    category: 'perks',
    coins: 150,
    icon: Gift,
    gradient: 'from-purple-500 to-pink-500',
    available: true,
    stock: 999
  },
  {
    id: 'p2',
    name: 'Revisión Premium',
    description: 'Revisión personalizada de tus pólizas',
    category: 'perks',
    coins: 250,
    icon: CheckCircle,
    gradient: 'from-blue-500 to-cyan-500',
    available: true,
    stock: 50
  },
  {
    id: 'e1',
    name: 'Cena para 2',
    description: 'Cena en restaurante seleccionado',
    category: 'experiencias',
    coins: 800,
    euroValue: 40,
    icon: Utensils,
    gradient: 'from-yellow-500 to-orange-500',
    available: true,
    stock: 20
  },
  {
    id: 'e2',
    name: 'Spa Premium',
    description: 'Experiencia de spa para 2 personas',
    category: 'experiencias',
    coins: 1200,
    euroValue: 60,
    icon: ShoppingBag,
    gradient: 'from-pink-500 to-rose-500',
    available: true,
    stock: 15
  },
]

const categoryLabels: Record<RewardCategory, string> = {
  all: 'Todas',
  vouchers: 'Vales',
  perks: 'Ventajas',
  experiencias: 'Experiencias'
}

export default function MarketplacePage() {
  const { user, coins } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory>('all')
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [redeeming, setRedeeming] = useState(false)

  const filteredRewards = selectedCategory === 'all'
    ? rewards
    : rewards.filter(r => r.category === selectedCategory)

  const handleRedeem = async () => {
    if (!selectedReward) return

    if (coins < selectedReward.coins) {
      toast.error('No tienes suficientes monedas')
      return
    }

    setRedeeming(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`¡${selectedReward.name} canjeado correctamente!`)
      setSelectedReward(null)
    } catch (error) {
      toast.error('Error al canjear la recompensa')
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marketplace</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Canjea tus monedas por recompensas exclusivas
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl text-white">
          <Coins className="w-6 h-6" />
          <div>
            <div className="text-sm opacity-90">Tus Monedas</div>
            <div className="text-2xl font-bold">{coins}</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(categoryLabels) as RewardCategory[]).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all',
              selectedCategory === cat
                ? 'bg-occident text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRewards.map(reward => {
          const Icon = reward.icon
          const canAfford = coins >= reward.coins

          return (
            <div
              key={reward.id}
              className={cn(
                'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 transition-all hover:shadow-lg',
                !canAfford && 'opacity-60'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br',
                reward.gradient
              )}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {reward.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {reward.description}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {reward.coins}
                    </span>
                  </div>
                  {reward.euroValue && (
                    <span className="text-sm text-slate-500">
                      ≈ {reward.euroValue}€
                    </span>
                  )}
                </div>

                {reward.stock && reward.stock < 50 && (
                  <div className="text-xs text-amber-600 dark:text-amber-400">
                    Solo quedan {reward.stock}
                  </div>
                )}
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() => setSelectedReward(reward)}
                disabled={!canAfford || !reward.available}
                className={cn(
                  'w-full py-2.5 rounded-lg font-semibold transition-all',
                  canAfford && reward.available
                    ? 'bg-occident text-white hover:bg-red-700'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                )}
              >
                {!canAfford ? 'Monedas insuficientes' : 'Canjear'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Modal de confirmación */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Confirmar Canje
              </h2>
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={cn(
                'w-20 h-20 mx-auto rounded-xl flex items-center justify-center bg-gradient-to-br',
                selectedReward.gradient
              )}>
                {(() => {
                  const Icon = selectedReward.icon
                  return <Icon className="w-10 h-10 text-white" />
                })()}
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedReward.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {selectedReward.description}
                </p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Coste:</span>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Coins className="w-4 h-4 text-amber-500" />
                    {selectedReward.coins}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Tus monedas:</span>
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Coins className="w-4 h-4 text-amber-500" />
                    {coins}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Después del canje:</span>
                  <div className="flex items-center gap-2 font-bold text-emerald-600">
                    <Coins className="w-4 h-4" />
                    {coins - selectedReward.coins}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Recibirás tu código por email en las próximas 24 horas
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="flex-1 py-3 rounded-xl font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRedeem}
                disabled={redeeming}
                className="flex-1 py-3 rounded-xl font-semibold bg-occident text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {redeeming ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Canjeando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirmar Canje
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
