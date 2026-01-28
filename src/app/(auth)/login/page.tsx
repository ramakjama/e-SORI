'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente a login de cliente (OAuth)
    router.push('/login-cliente')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--accent-blue)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Redirigiendo al login...</p>
      </div>
    </div>
  )
}
