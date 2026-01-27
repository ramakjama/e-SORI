'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ============================================================================
// Types
// ============================================================================

export interface Policy {
  id: string
  number: string
  name: string
  type: string
  status: 'active' | 'pending' | 'expired' | 'cancelled'
  premium: number
  startDate: string
  endDate: string
  nextPayment: string
  company: string
  coverages: string[]
}

export interface Claim {
  id: string
  policyNumber: string
  type: string
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected'
  date: string
  description: string
  assignedAgent?: string
  timeline: {
    id: string
    title: string
    date?: string
    completed: boolean
  }[]
}

export interface Document {
  id: string
  name: string
  type: 'policy' | 'receipt' | 'claim' | 'other'
  policyNumber?: string
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
  from: 'user' | 'agent'
  agentName?: string
}

export interface WalletData {
  balance: number
  pendingRewards: number
  transactions: {
    id: string
    type: 'earned' | 'spent' | 'pending'
    amount: number
    description: string
    date: string
  }[]
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  points: number
  level: string
  rank: number
  isCurrentUser?: boolean
}

// ============================================================================
// API Fetchers
// ============================================================================

async function fetchPolicies(): Promise<Policy[]> {
  const response = await fetch('/api/policies')
  if (!response.ok) {
    throw new Error('Error fetching policies')
  }
  return response.json()
}

async function fetchClaims(): Promise<Claim[]> {
  const response = await fetch('/api/claims')
  if (!response.ok) {
    throw new Error('Error fetching claims')
  }
  return response.json()
}

async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch('/api/documents')
  if (!response.ok) {
    throw new Error('Error fetching documents')
  }
  return response.json()
}

async function fetchMessages(): Promise<Message[]> {
  const response = await fetch('/api/messages')
  if (!response.ok) {
    throw new Error('Error fetching messages')
  }
  return response.json()
}

async function fetchWallet(): Promise<WalletData> {
  const response = await fetch('/api/wallet')
  if (!response.ok) {
    throw new Error('Error fetching wallet')
  }
  return response.json()
}

async function fetchLeaderboard(period: string): Promise<LeaderboardEntry[]> {
  const response = await fetch(`/api/leaderboard?period=${period}`)
  if (!response.ok) {
    throw new Error('Error fetching leaderboard')
  }
  return response.json()
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook for fetching user policies with caching
 * Stale time: 5 minutes - policies don't change frequently
 */
export function usePolicies() {
  return useQuery({
    queryKey: ['policies'],
    queryFn: fetchPolicies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook for fetching user claims with caching
 * Stale time: 2 minutes - claims might update more frequently
 */
export function useClaims() {
  return useQuery({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook for fetching user documents with caching
 * Stale time: 10 minutes - documents rarely change
 */
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook for fetching user messages with caching
 * Stale time: 1 minute - messages are time-sensitive
 */
export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: true, // Refetch messages on focus
  })
}

/**
 * Hook for fetching wallet data with caching
 * Stale time: 2 minutes - wallet balance might change
 */
export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook for fetching leaderboard data with period filter
 * Stale time: 5 minutes - leaderboard updates periodically
 */
export function useLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'weekly') {
  return useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => fetchLeaderboard(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// ============================================================================
// Mutation Hooks for data updates
// ============================================================================

/**
 * Hook for marking a message as read
 */
export function useMarkMessageAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      })
      if (!response.ok) {
        throw new Error('Error marking message as read')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

/**
 * Hook for submitting a new claim
 */
export function useSubmitClaim() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (claimData: Partial<Claim>) => {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData),
      })
      if (!response.ok) {
        throw new Error('Error submitting claim')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch claims
      queryClient.invalidateQueries({ queryKey: ['claims'] })
    },
  })
}

// ============================================================================
// Prefetch Utilities
// ============================================================================

/**
 * Prefetch policies data for faster navigation
 */
export function usePrefetchPolicies() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['policies'],
      queryFn: fetchPolicies,
      staleTime: 5 * 60 * 1000,
    })
  }
}

/**
 * Prefetch claims data for faster navigation
 */
export function usePrefetchClaims() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['claims'],
      queryFn: fetchClaims,
      staleTime: 2 * 60 * 1000,
    })
  }
}

/**
 * Prefetch documents data for faster navigation
 */
export function usePrefetchDocuments() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['documents'],
      queryFn: fetchDocuments,
      staleTime: 10 * 60 * 1000,
    })
  }
}
