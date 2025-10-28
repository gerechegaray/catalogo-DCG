import React from 'react'
import { ArrowLeft, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClientAuth } from '../context/ClientAuthContext'

const ClientProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { client, clientLoading } = useClientAuth()

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se pudo cargar el perfil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center mb-6">
            {client.photoURL ? (
              <img 
                src={client.photoURL} 
                alt={client.displayName}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-100"
              />
            ) : (
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-blue-600" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{client.displayName}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{client.email}</p>
            </div>
            
            {client.businessName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
                <p className="text-gray-900">{client.businessName}</p>
              </div>
            )}
            
            {client.type && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cliente</label>
                <p className="text-gray-900 capitalize">{client.type === 'vet' ? 'Veterinario' : 'Pet Shop'}</p>
              </div>
            )}
            
            {client.contactPhone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <p className="text-gray-900">{client.contactPhone}</p>
              </div>
            )}

            {client.alegraId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Alegra</label>
                <p className="text-gray-900 font-mono">{client.alegraId}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado de cuenta</span>
                {client.isActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activo
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pendiente
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientProfilePage
