'use client'

import { Skeleton } from './Skeleton'

/**
 * Skeleton loaders for different components
 * Provides consistent loading states across the app
 */

// ============================================
// POLICY CARD SKELETON
// ============================================

export function PolicyCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <Skeleton variant="rounded" width={56} height={56} />
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
          
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Skeleton variant="text" width="50%" height={12} className="mb-1" />
              <Skeleton variant="text" width="70%" height={20} />
            </div>
            <div className="flex-1">
              <Skeleton variant="text" width="50%" height={12} className="mb-1" />
              <Skeleton variant="text" width="70%" height={20} />
            </div>
          </div>
        </div>

        {/* Badge */}
        <Skeleton variant="rounded" width={80} height={28} />
      </div>
    </div>
  )
}

export function PolicyListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <PolicyCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================
// DOCUMENT CARD SKELETON
// ============================================

export function DocumentCardSkeleton() {
  return (
    <div className="card p-4">
      {/* Thumbnail */}
      <Skeleton variant="rounded" height={120} className="mb-4" />
      
      {/* Title */}
      <div className="flex items-start gap-2 mb-2">
        <Skeleton variant="rounded" width={20} height={20} />
        <Skeleton variant="text" width="80%" height={16} />
      </div>
      
      {/* Subtitle */}
      <Skeleton variant="text" width="60%" height={12} className="mb-3" />
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={80} height={12} />
        <Skeleton variant="text" width={60} height={12} />
      </div>
    </div>
  )
}

export function DocumentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================
// MESSAGE CARD SKELETON
// ============================================

export function MessageCardSkeleton() {
  return (
    <div className="card p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Skeleton variant="circular" width={40} height={40} />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Skeleton variant="text" width="40%" height={16} />
            <Skeleton variant="text" width={80} height={12} />
          </div>
          <Skeleton variant="text" width="90%" height={14} className="mb-1" />
          <Skeleton variant="text" width="70%" height={14} />
        </div>

        {/* Unread badge */}
        <Skeleton variant="circular" width={8} height={8} />
      </div>
    </div>
  )
}

export function MessageListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <MessageCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================
// CLAIM CARD SKELETON
// ============================================

export function ClaimCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" width={48} height={48} />
          <div>
            <Skeleton variant="text" width={150} height={20} className="mb-1" />
            <Skeleton variant="text" width={100} height={14} />
          </div>
        </div>
        <Skeleton variant="rounded" width={90} height={28} />
      </div>

      {/* Timeline */}
      <div className="space-y-3 ml-6 border-l-2 border-slate-200 dark:border-slate-700 pl-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative">
            <Skeleton variant="circular" width={12} height={12} className="absolute -left-[33px]" />
            <Skeleton variant="text" width="70%" height={14} className="mb-1" />
            <Skeleton variant="text" width="50%" height={12} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// STATS CARD SKELETON
// ============================================

export function StatsCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="rounded" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width={100} height={32} className="mb-1" />
          <Skeleton variant="text" width={120} height={14} />
        </div>
      </div>
    </div>
  )
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================
// TABLE SKELETON
// ============================================

export function TableSkeleton({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number
  columns?: number 
}) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex gap-4">
          {[...Array(columns)].map((_, i) => (
            <Skeleton 
              key={i} 
              variant="text" 
              width={i === 0 ? '30%' : '20%'} 
              height={16} 
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex gap-4">
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant="text" 
                  width={colIndex === 0 ? '30%' : '20%'} 
                  height={14} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// PROFILE SECTION SKELETON
// ============================================

export function ProfileSectionSkeleton() {
  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton variant="rounded" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" width={200} height={20} className="mb-1" />
          <Skeleton variant="text" width={150} height={14} />
        </div>
      </div>

      {/* Form fields */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <Skeleton variant="text" width={100} height={14} className="mb-2" />
            <Skeleton variant="rounded" height={44} />
          </div>
        ))}
      </div>

      {/* Button */}
      <Skeleton variant="rounded" width={150} height={44} className="mt-6" />
    </div>
  )
}

// ============================================
// DASHBOARD SKELETON
// ============================================

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton variant="text" width={250} height={32} className="mb-2" />
        <Skeleton variant="text" width={400} height={16} />
      </div>

      {/* Stats */}
      <StatsGridSkeleton count={4} />

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PolicyListSkeleton count={3} />
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <Skeleton variant="text" width={150} height={20} className="mb-4" />
            <Skeleton variant="rounded" height={200} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// EXPORT ALL
// ============================================

export const SkeletonLoaders = {
  PolicyCard: PolicyCardSkeleton,
  PolicyList: PolicyListSkeleton,
  DocumentCard: DocumentCardSkeleton,
  DocumentGrid: DocumentGridSkeleton,
  MessageCard: MessageCardSkeleton,
  MessageList: MessageListSkeleton,
  ClaimCard: ClaimCardSkeleton,
  StatsCard: StatsCardSkeleton,
  StatsGrid: StatsGridSkeleton,
  Table: TableSkeleton,
  ProfileSection: ProfileSectionSkeleton,
  Dashboard: DashboardSkeleton,
}
