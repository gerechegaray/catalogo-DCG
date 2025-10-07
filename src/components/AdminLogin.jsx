import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const AdminLogin = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { authenticateAdmin } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (authenticateAdmin(code)) {
      // Redirigir a admin
      window.location.href = '/admin'
    } else {
      setError('Código incorrecto')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-white to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Acceso Administrativo
          </h1>
          <p className="text-blue-200">
            Ingresa el código de acceso para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Código de Acceso
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ingresa el código..."
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {error && (
              <p className="text-red-300 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Acceder al Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-blue-200 hover:text-white transition-colors text-sm"
          >
            ← Volver al catálogo público
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

