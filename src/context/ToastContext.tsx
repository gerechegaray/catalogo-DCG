import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import ToastComponent, { Toast, ToastType } from '../components/Toast'

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: Toast = {
        id,
        message,
        type,
        duration
      }

      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration)
    },
    [showToast]
  )

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration || 7000) // Errores se muestran más tiempo
    },
    [showToast]
  )

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration)
    },
    [showToast]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration)
    },
    [showToast]
  )

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
      
      {/* Contenedor de toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

