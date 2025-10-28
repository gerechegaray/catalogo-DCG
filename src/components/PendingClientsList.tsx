import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { auth } from '../config/firebase'
import clientManagementService from '../services/clientManagementService'
import type { Client } from '@/types/client'
import ApproveClientForm from './ApproveClientForm'

const PendingClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [adminEmail, setAdminEmail] = useState<string>('admin@example.com')

  // Obtener email del admin autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setAdminEmail(user.email)
      }
    })
    return () => unsubscribe()
  }, [])

  const loadClients = async () => {
    setLoading(true)
    try {
      const pendingClients = await clientManagementService.getPendingClients()
      setClients(pendingClients)
    } catch (error) {
      console.error('Error cargando clientes pendientes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleApprove = () => {
    setSelectedClient(null)
    loadClients()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes pendientes</h3>
        <p className="text-gray-500">Todos los clientes han sido procesados</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Clientes Pendientes ({clients.length})
          </h2>
        </div>
        <div className="divide-y">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedClient(client)}
            >
              <div className="flex items-center gap-4">
                {client.photoURL && (
                  <img 
                    src={client.photoURL} 
                    alt={client.displayName}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{client.displayName}</h3>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Pendiente
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedClient && (
        <ApproveClientForm
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onApprove={handleApprove}
          adminEmail={adminEmail}
        />
      )}
    </>
  )
}

export default PendingClientsList
