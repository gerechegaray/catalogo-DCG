import React, { useState } from 'react'
import { X, CheckCircle, XCircle } from 'lucide-react'
import clientManagementService from '../services/clientManagementService'
import alegraClientService from '../services/alegraClientService'
import type { Client, ApproveClientData } from '@/types/client'

interface ApproveClientFormProps {
  client: Client
  onClose: () => void
  onApprove: () => void
  adminEmail?: string
}

const ApproveClientForm: React.FC<ApproveClientFormProps> = ({
  client,
  onClose,
  onApprove,
  adminEmail = 'admin@example.com'
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ApproveClientData>({
    alegraId: '',
    type: 'vet',
    businessName: client.businessName || '',
    contactPhone: client.contactPhone || '',
    notes: ''
  })

  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [loadingAlegra, setLoadingAlegra] = useState(false)

  // Auto-completar datos cuando se ingresa AlegraId
  const handleAlegraIdChange = async (alegraId: string) => {
    setFormData({ ...formData, alegraId })
    
    if (alegraId && alegraId.length > 2) {
      setLoadingAlegra(true)
      try {
        const contactInfo = await alegraClientService.getContactInfo(alegraId)
        
        if (contactInfo) {
          // Auto-completar campos
          setFormData(prev => ({
            ...prev,
            alegraId,
            businessName: contactInfo.name || prev.businessName,
            contactPhone: contactInfo.phone || prev.contactPhone
          }))
          
          console.log('✅ Datos cargados desde Alegra:', contactInfo)
        } else {
          console.warn('⚠️ Cliente no encontrado en Alegra')
        }
      } catch (error) {
        console.error('Error cargando datos de Alegra:', error)
      } finally {
        setLoadingAlegra(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.alegraId) {
      alert('Por favor ingresa el ID de Alegra')
      return
    }

    setLoading(true)
    try {
      await clientManagementService.approveClient(client.id, formData, adminEmail)
      alert('✅ Cliente aprobado exitosamente')
      onApprove()
      onClose()
    } catch (error) {
      console.error('Error aprobando cliente:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`❌ Error al aprobar cliente: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Por favor ingresa una razón para rechazar')
      return
    }

    setLoading(true)
    try {
      await clientManagementService.rejectClient(client.id, rejectReason)
      alert('❌ Cliente rechazado')
      onApprove()
      onClose()
    } catch (error) {
      console.error('Error rechazando cliente:', error)
      alert('Error al rechazar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
感觉 <h2 className="text-2xl font-bold text-gray-900">Aprobar Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Client Info */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-4">
            {client.photoURL && (
              <img 
                src={client.photoURL} 
                alt={client.displayName}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{client.displayName}</h3>
              <p className="text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-500">
                Fecha de solicitud: {client.createdAt?.toDate()?.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Alegra ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de Alegra <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.alegraId}
                onChange={(e) => handleAlegraIdChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 123"
                required
              />
              {loadingAlegra && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ID del cliente en Alegra ERP
            </p>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cliente <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'vet' | 'pet' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="vet">Veterinario</option>
              <option value="pet">Pet Shop</option>
            </select>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la clínica o tienda"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
уж <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+57 300 123 4567"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas Internas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Notas sobre el cliente..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            {!showRejectForm ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5" />
                  Rechazar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 ml-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  {loading ? 'Procesando...' : 'Aprobar Cliente'}
                </button>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón del Rechazo
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Explica por qué se rechaza la solicitud..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowRejectForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Confirmar Rechazo'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApproveClientForm
