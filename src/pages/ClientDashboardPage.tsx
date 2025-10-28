import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, CreditCard, AlertCircle, TrendingDown } from 'lucide-react'
import { useClientAuth } from '../context/ClientAuthContext'
import alegraClientService from '../services/alegraClientService'
import { getFeaturedPromotions } from '../services/communicationsService'

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { client, logout } = useClientAuth()
  const [stats, setStats] = useState({
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalBalance: 0,
    overdueBalance: 0,
    recentOrders: []
  })
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!client?.alegraId) {
        setLoading(false)
        return
      }

      try {
        const invoices = await alegraClientService.getClientInvoices(client.alegraId)
        
        // Calcular saldos correctamente (igual que en AccountPage)
        const pendingInvoices = invoices.filter((inv: any) => inv.status === 'open')
        
        const today = new Date()
        let totalBalance = 0
        let overdueBalance = 0
        let overdueCount = 0
        
        pendingInvoices.forEach((invoice: any) => {
          const balance = parseFloat(invoice.balance || invoice.total || 0)
          totalBalance += balance
          
          if (invoice.dueDate) {
            const dueDate = new Date(invoice.dueDate)
            if (dueDate < today) {
              overdueBalance += balance
              overdueCount++
            }
          }
        })
        
        setStats({
          pendingInvoices: pendingInvoices.length,
          overdueInvoices: overdueCount,
          totalBalance: totalBalance,
          overdueBalance: overdueBalance,
          recentOrders: []
        })
        
        // Cargar promociones destacadas
        if (client.id && client.type) {
          const featuredPromos = await getFeaturedPromotions(client.id, client.type, 3)
          setPromotions(featuredPromos)
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [client])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/client/login')
    } catch (error) {
      console.error('Error en logout:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simple */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portal del Cliente</h1>
            {client && (
              <p className="text-sm text-gray-600">{client.displayName}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg text-white p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta{client ? `, ${client.displayName.split(' ')[0]}` : ''}!</h2>
          <p className="text-blue-100">Tu información y estado de cuenta actualizado</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => navigate('/client/account')}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Saldo Pendiente</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.totalBalance.toLocaleString('es-AR')}
            </p>
          </div>

          <div 
            onClick={() => navigate('/client/account')}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-lg p-3">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Facturas Pendientes</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingInvoices}</p>
          </div>

          <div 
            onClick={() => navigate('/client/account')}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 rounded-lg p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Facturas Vencidas</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.overdueInvoices}</p>
          </div>

          <div 
            onClick={() => navigate('/client/account')}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 rounded-lg p-3">
                <TrendingDown className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Saldo Vencido</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${stats.overdueBalance.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Estado de Cuenta Rápido */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Cuenta</h3>
            <div className="space-y-4">
              {client?.alegraId ? (
                <>
                  <p className="text-gray-600">Saldo total pendiente:</p>
                  <p className="text-3xl font-bold text-blue-600">${stats.totalBalance.toLocaleString('es-AR')}</p>
                  <p className="text-sm text-gray-500">{stats.pendingInvoices} facturas pendientes</p>
                </>
              ) : (
                <p className="text-gray-500">No hay datos de cuenta disponibles</p>
              )}
              <button
                onClick={() => navigate('/client/account')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Estado Completo
              </button>
            </div>
          </div>

          {/* Promociones Especiales */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-sm border p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Promociones Especiales</h3>
            <div className="space-y-4">
              {promotions.length === 0 ? (
                <p className="text-purple-100">
                  No hay promociones disponibles en este momento.
                </p>
              ) : (
                <div className="space-y-2">
                  {promotions.slice(0, 2).map((promo: any) => (
                    <div key={promo.id} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        {promo.badge && (
                          <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-0.5 rounded">
                            {promo.badge}
                          </span>
                        )}
                        <span className="text-sm font-medium truncate">{promo.title}</span>
                      </div>
                      <p className="text-xs text-purple-100 line-clamp-2">{promo.subtitle}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate('/client/promotions')}
                className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Ver Todas las Promociones
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboardPage
