import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Tipos de usuario
const USER_TYPES = {
  VET: 'vet',
  PET: 'pet', 
  ADMIN: 'admin',
  PUBLIC: 'public'
}

// Contexto de autenticación
const AuthContext = createContext()

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const location = useLocation()
  const [userType, setUserType] = useState(USER_TYPES.PUBLIC)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Detectar tipo de usuario basado en la URL
  useEffect(() => {
    const path = location.pathname
    
    // Limpiar estado primero
    setIsAdmin(false)
    
    if (path.includes('/veterinarios')) {
      setUserType(USER_TYPES.VET)
      setIsAuthenticated(true)
    } else if (path.includes('/petshops')) {
      setUserType(USER_TYPES.PET)
      setIsAuthenticated(true)
    } else if (path.includes('/admin')) {
      // Para admin, verificar si ya está autenticado
      const adminAuth = localStorage.getItem('admin_authenticated')
      if (adminAuth === 'true') {
        setUserType(USER_TYPES.ADMIN)
        setIsAdmin(true)
        setIsAuthenticated(true)
      } else {
        setUserType(USER_TYPES.PUBLIC)
        setIsAuthenticated(false)
      }
    } else {
      setUserType(USER_TYPES.PUBLIC)
      setIsAuthenticated(false)
    }
  }, [location.pathname])

  // Función para autenticar admin
  const authenticateAdmin = (code) => {
    if (code === 'ADMIN2025') {
      setIsAdmin(true)
      setUserType(USER_TYPES.ADMIN)
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      return true
    }
    return false
  }

  // Función para cerrar sesión admin
  const logoutAdmin = () => {
    setIsAdmin(false)
    setUserType(USER_TYPES.PUBLIC)
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
  }

  // Función para verificar si puede acceder a una ruta
  const canAccess = (route) => {
    switch (route) {
      case '/veterinarios':
        return userType === USER_TYPES.VET || userType === USER_TYPES.ADMIN
      case '/petshops':
        return userType === USER_TYPES.PET || userType === USER_TYPES.ADMIN
      case '/admin':
        return userType === USER_TYPES.ADMIN
      default:
        return true
    }
  }

  // Función para obtener productos filtrados por tipo de usuario
  const getFilteredProducts = (products) => {
    if (userType === USER_TYPES.ADMIN) {
      return products // Admin ve todo
    } else if (userType === USER_TYPES.VET) {
      // Veterinarios ven TODOS los productos (todos tienen lista "General")
      return products
    } else if (userType === USER_TYPES.PET) {
      // Pet Shops ven SOLO productos que tienen lista "pet"
      return products.filter(product => {
        // Buscar en priceLists directo
        if (product.priceLists && Array.isArray(product.priceLists)) {
          const hasPet = product.priceLists.some(price => 
            price.name && price.name.toLowerCase().includes('pet')
          )
          if (hasPet) return true
        }
        
        // Buscar en originalData.priceLists
        if (product.originalData && product.originalData.priceLists) {
          const hasPet = product.originalData.priceLists.some(price => 
            price.name && price.name.toLowerCase().includes('pet')
          )
          if (hasPet) return true
        }
        
        return false
      })
    }
    return products // Público ve todo
  }

  const value = {
    userType,
    isAdmin,
    isAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    canAccess,
    getFilteredProducts,
    USER_TYPES
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export default AuthContext
