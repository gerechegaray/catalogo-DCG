import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'
import clientAuthService from '../services/clientAuthService'
import GoogleAuthButton from '../components/GoogleAuthButton'
import PendingApprovalMessage from '../components/PendingApprovalMessage'
import { Loader } from 'lucide-react'

const ClientLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [user, loading] = useAuthState(auth)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [clientStatus, setClientStatus] = useState<{
    pending: boolean
    active: boolean
  } | null>(null)

  // Debug
  console.log('🔍 ClientLoginPage - user:', user, 'loading:', loading, 'checkingStatus:', checkingStatus)

  // Verificar estado del cliente cuando se autentica
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return

      setCheckingStatus(true)
      
      try {
        const status = await clientAuthService.checkClientStatus(user.uid)
        setClientStatus(status)

        // Si está aprobado y activo, redirigir a dashboard
        if (!status.pending && status.active) {
          navigate('/client/dashboard')
        }
      } catch (error) {
        console.error('Error verificando estado:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkStatus()
  }, [user, navigate])

  // Mostrar loading solo si está checkingStatus (verificando cliente), NO si loading inicial
  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando...</p>
        </div>
      </div>
    )
  }

  // Si loading inicial y no hay user, mostrar la página de login normalmente

  // Si está autenticado pero pendiente de aprobación
  if (user && clientStatus?.pending) {
    return <PendingApprovalMessage />
  }

  // Si NO está autenticado, mostrar página de login
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Logo o título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Portal de Clientes
          </h1>
          <p className="text-gray-600">
            DCG Distribuciones
          </p>
        </div>

        {/* Botón de Google Auth */}
        <div className="mb-6">
          <GoogleAuthButton
            onSuccess={() => {
              // El redirect se maneja en el useEffect
              console.log('Login exitoso')
            }}
            onError={(error) => {
              console.error('Error en login:', error)
            }}
          />
        </div>

        {/* Botón de Cerrar Sesión si hay user */}
        {user && (
          <div className="mb-4">
            <button
              onClick={async () => {
                await clientAuthService.logout()
                window.location.reload()
              }}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Cerrar Sesión (Sesión Activa Detectada)
            </button>
          </div>
        )}

        {/* Información adicional */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 text-center">
            🔐 Inicia sesión con tu cuenta de Google para acceder a tu portal personalizado.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientLoginPage
