import React from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from './AdminLogin'

const ProtectedRoute = ({ children, requireAuth = false, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, userType } = useAuth()

  // Si requiere admin y no está autenticado como admin
  if (requireAdmin && !isAdmin) {
    return <AdminLogin />
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-6">
            Esta sección es solo para usuarios autorizados
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute

