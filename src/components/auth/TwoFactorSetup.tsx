'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Smartphone, Key, Download, Copy, Check, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface TwoFactorSetupProps {
  onComplete?: () => void
  onCancel?: () => void
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'intro' | 'scan' | 'verify' | 'backup' | 'complete'>('intro')
  const [qrCode, setQRCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)
  const [copiedBackup, setCopiedBackup] = useState(false)

  const handleStart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to setup 2FA')

      const data = await response.json()
      setQRCode(data.qrCode)
      setSecret(data.secret)
      setBackupCodes(data.backupCodes)
      setStep('scan')
    } catch (error) {
      toast.error('Error al configurar 2FA')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error('El código debe tener 6 dígitos')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      })

      if (!response.ok) throw new Error('Invalid code')

      toast.success('2FA verificado correctamente')
      setStep('backup')
    } catch (error) {
      toast.error('Código incorrecto. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopiedSecret(true)
    toast.success('Secret copiado')
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    setCopiedBackup(true)
    toast.success('Códigos copiados')
    setTimeout(() => setCopiedBackup(false), 2000)
  }

  const downloadBackupCodes = () => {
    const blob = new Blob([backupCodes.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'soriano-backup-codes.txt'
    a.click()
    toast.success('Códigos descargados')
  }

  const handleComplete = () => {
    setStep('complete')
    setTimeout(() => {
      onComplete?.()
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {/* Intro */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Autenticación de Dos Factores
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Añade una capa extra de seguridad a tu cuenta
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--color-border)' }}>
                <div className="flex gap-3">
                  <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                      Aplicación de autenticación
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Usa Google Authenticator, Authy o similar
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--color-border)' }}>
                <div className="flex gap-3">
                  <Key className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                      Códigos de respaldo
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Guárdalos en un lugar seguro por si pierdes el acceso
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleStart}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Comenzar'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Scan QR */}
        {step === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Escanea el código QR
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Abre tu app de autenticación y escanea este código
              </p>
            </div>

            {/* QR Code */}
            <div className="p-6 bg-white rounded-2xl border-2" style={{ borderColor: 'var(--color-border)' }}>
              {qrCode && (
                <Image
                  src={qrCode}
                  alt="QR Code"
                  width={256}
                  height={256}
                  className="mx-auto"
                />
              )}
            </div>

            {/* Manual entry */}
            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                O introduce el código manualmente:
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <code className="flex-1 text-sm font-mono" style={{ color: 'var(--color-text)' }}>
                  {secret}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {copiedSecret ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('verify')}
              className="w-full px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Continuar
            </button>
          </motion.div>
        )}

        {/* Verify Code */}
        {step === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Verifica el código
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Introduce el código de 6 dígitos de tu app
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-4 text-center text-2xl font-mono rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--card-bg)', color: 'var(--color-text)' }}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('scan')}
                  className="flex-1 px-4 py-3 rounded-xl border-2 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Verificar'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Backup Codes */}
        {step === 'backup' && (
          <motion.div
            key="backup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Códigos de Respaldo
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Guarda estos códigos en un lugar seguro
              </p>
            </div>

            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl space-y-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm text-center py-2" style={{ color: 'var(--color-text)' }}>
                  {code}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyBackupCodes}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {copiedBackup ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copiar
              </button>
              <button
                type="button"
                onClick={downloadBackupCodes}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>

            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Importante:</strong> Cada código solo se puede usar una vez. Guárdalos en un lugar seguro y accesible.
              </p>
            </div>

            <button
              type="button"
              onClick={handleComplete}
              className="w-full px-4 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all"
            >
              Completar Configuración
            </button>
          </motion.div>
        )}

        {/* Complete */}
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              ¡Todo listo!
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              2FA activado correctamente en tu cuenta
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
