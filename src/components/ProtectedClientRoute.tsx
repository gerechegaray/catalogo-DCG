import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'
import clientAuthService from '../services/clientAuthService'

interface ProtectedClientRouteProps {
  children: React.ReactNode
}

const ProtectedClientRoute: React.FC<ProtectedClientRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth)
  const [checkingStatus, setCheckingStatus] = React.useState(true)
  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    const checkClient = async () => {
      if (!user) {
        setCheckingStatus(false)
        return
      }

      try {
        const status = await clientAuthService.checkClientStatus(user.uid)
        setIsActive(status.active && !status.pending)
      } catch (error) {
        console.error('Error verificando estado:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkClient()
  }, [user])

  if (loading || checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/client/login" replace />
  }

  if (!isActive) {
    return <Navigate to="/client/login" replace />
  }

  return <>{children}</>
}

export default ProtectedClientRoute
