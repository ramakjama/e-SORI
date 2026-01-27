'use client'

import { Toaster } from 'react-hot-toast'

export function ToastNotification() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--card-bg)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          maxWidth: '500px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #10b981',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            border: '1px solid #ef4444',
          },
        },
        loading: {
          iconTheme: {
            primary: '#E30613',
            secondary: '#ffffff',
          },
        },
      }}
    />
  )
}
