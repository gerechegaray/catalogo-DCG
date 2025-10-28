import React, { useEffect, useState } from 'react'
import { ArrowLeft, DollarSign, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClientAuth } from '../context/ClientAuthContext'
import alegraClientService from '../services/alegraClientService'

interface InvoiceData {
  id: number
  date: string
  number: string
  total: number
  balance: number
  status: string
  dueDate?: string
  payments?: Array<{
    id: number
    date: string
    amount: number
    paymentMethod: string
  }>
}

const ClientAccountPage: React.FC = () => {
  const navigate = useNavigate()
  const { client } = useClientAuth()
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState({ total: 0, pending: 0, overdue: 0 })
  const [invoices, setInvoices] = useState<InvoiceData[]>([])

  useEffect(() => {
    const loadAccountData = async () => {
      if (!client?.alegraId) {
        setLoading(false)
        return
      }

      try {
        // Obtener facturas y filtrar solo pendientes
        const allInvoices = await alegraClientService.getClientInvoices(client.alegraId)
        console.log('📋 Total de facturas recibidas:', allInvoices.length)
        
        const pendingInvoices = allInvoices
          .filter((invoice: any) => invoice.status === 'open')
          .map((invoice: any) => {
            // Extraer número de factura con múltiples fallbacks
            const invoiceNumber = invoice.numberTemplate?.formattedNumber || 
                                  invoice.numberTemplate?.number || 
                                  invoice.number || 
                                  invoice.id.toString()
            
            console.log(`📄 Factura ${invoice.id} - número:`, invoiceNumber)
            
            return {
              id: invoice.id,
              date: invoice.date,
              number: invoiceNumber,
              total: parseFloat(invoice.total || 0),
              balance: parseFloat(invoice.balance || invoice.total || 0),
              status: invoice.status,
              dueDate: invoice.dueDate,
              payments: invoice.payments || []
            }
          })
        
        console.log('✅ Facturas pendientes después del filtro:', pendingInvoices.length)
        setInvoices(pendingInvoices)
        
        // Calcular saldos correctamente aquí (después de obtener las facturas)
        const today = new Date()
        let totalPending = 0
        let totalOverdue = 0
        
        pendingInvoices.forEach((invoice) => {
          const balance = invoice.balance
          totalPending += balance
          
          if (invoice.dueDate) {
            const dueDate = new Date(invoice.dueDate)
            if (dueDate < today) {
              totalOverdue += balance
            }
          }
        })
        
        setBalance({
          total: totalPending,
          pending: totalPending - totalOverdue,
          overdue: totalOverdue
        })
      } catch (error) {
        console.error('Error cargando datos de cuenta:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAccountData()
  }, [client])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estado de cuenta...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-AR')
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
          <h1 className="text-2xl font-bold text-gray-900">Estado de Cuenta</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Resumen de Saldos */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Resumen de Saldos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm mb-1">Total Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance.total)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 text-sm mb-1">Próximos a Vencer</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(balance.pending)}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-red-600 text-sm mb-1">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(balance.overdue)}</p>
            </div>
          </div>
        </div>

        {/* Facturas */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Facturas Pendientes</h2>
          </div>
          
          {invoices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay facturas pendientes
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Factura</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagos</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Pendiente</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => {
                    const totalPayments = invoice.payments?.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0) || 0
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{invoice.number}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">
                          {totalPayments > 0 ? formatCurrency(totalPayments) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-600">
                          {formatCurrency(invoice.balance)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mensaje de Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            ℹ️ <strong>Nota:</strong> Los datos se sincronizan automáticamente con Alegra
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientAccountPage
