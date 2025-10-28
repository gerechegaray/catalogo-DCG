import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../config/firebase'
import clientAuthService from '../services/clientAuthService'
import type { Client } from '@/types/client'

interface ClientAuthContextType {
  user: any | null
  loading: boolean
  client: Client | null
  clientLoading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isClient: boolean
  isPending: boolean
  isActive: boolean
  refreshClient: () => Promise<void>
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined)

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth)
  const [client, setClient] = useState<Client | null>(null)
  const [clientLoading, setClientLoading] = useState(true)

  // Cargar datos del cliente cuando el usuario se autentica
  useEffect(() => {
    const loadClient = async () => {
      if (!user) {
        setClient(null)
        setClientLoading(false)
        return
      }

      setClientLoading(true)
      try {
        const clientData = await clientAuthService.getCurrentClient(user.uid)
        setClient(clientData)
      } catch (error) {
        console.error('Error cargando cliente:', error)
        setClient(null)
      } finally {
        setClientLoading(false)
      }
    }

    loadClient()
  }, [user])

  const loginWithGoogle = async () => {
    try {
      const googleUser = await clientAuthService.signInWithGoogle()
      await clientAuthService.createOrUpdateClientProfile(googleUser)
      // El cliente se cargará automáticamente por el useEffect
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await clientAuthService.logout()
      setClient(null)
    } catch (error) {
      console.error('Error en logout:', error)
      throw error
    }
  }

  const refreshClient = async () => {
    if (!user) return
    
    setClientLoading(true)
    try {
      const clientData = await clientAuthService.getCurrentClient(user.uid)
      setClient(clientData)
    } catch (error) {
      console.error('Error refrescando cliente:', error)
    } finally {
      setClientLoading(false)
    }
  }

  const value: ClientAuthContextType = {
    user,
    loading,
    client,
    clientLoading,
    loginWithGoogle,
    logout,
    isClient: !!client,
    isPending: client?.pendingApproval || false,
    isActive: client?.isActive || false,
    refreshClient
  }

  return (
    <ClientAuthContext.Provider value={value}>
      {children}
    </ClientAuthContext.Provider>
  )
}

export const useClientAuth = (): ClientAuthContextType => {
  const context = useContext(ClientAuthContext)
  if (!context) {
    throw new Error('useClientAuth debe usarse dentro de ClientAuthProvider')
  }
  return context
}

export default ClientAuthContext
