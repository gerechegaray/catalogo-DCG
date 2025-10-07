import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import cacheService from '../services/cacheService'
import CommunicationsManager from '../components/CommunicationsManager'
import BrandManager from '../components/BrandManager'
import FeaturedProductsManager from '../components/FeaturedProductsManager'

const AdminPage = () => {
  const { products, loading, reloadProducts, loadAnalytics, analytics } = useProducts()
  const { logoutAdmin } = useAuth()
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [products]) // Recargar analytics cuando los productos cambien

  const loadAnalyticsData = async () => {
    setLoadingAnalytics(true)
    await loadAnalytics()
    setLoadingAnalytics(false)
  }

  const handleRefreshData = async () => {
    await reloadProducts()
    await loadAnalyticsData()
  }

  const handleClearCache = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todo el cache? Esto forzará una nueva sincronización con Alegra.')) {
      try {
        await cacheService.clearAll()
        await reloadProducts() // Recargar productos después de limpiar el cache
        await loadAnalyticsData()
        alert('Cache limpiado y datos actualizados.')
      } catch (error) {
        console.error('Error al limpiar el cache:', error)
        alert('Error al limpiar el cache: ' + error.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido del Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Panel de Administración
        </h1>

        {/* Acciones Rápidas */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🛠️ Acciones Rápidas
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Actualizando...' : '🔄 Actualizar Datos'}
              </button>
              
              <button
                onClick={handleClearCache}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🗑️ Limpiar Cache
              </button>
              
                  <button
                    onClick={loadAnalyticsData}
                    disabled={loadingAnalytics}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAnalytics ? '📊 Cargando...' : '📊 Actualizar Analytics'}
                  </button>
                  
                  <button
                    onClick={() => {
                      logoutAdmin()
                      window.location.href = '/'
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    🚪 Cerrar Sesión
                  </button>
            </div>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total productos */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📦</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
              </div>
            </div>
          </div>

          {/* Total vistas */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👁️</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Vistas</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
              </div>
            </div>
          </div>

          {/* Total selecciones */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🛒</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Selecciones</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalSelections}</p>
              </div>
            </div>
          </div>

          {/* Estado del cache */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">
                {analytics.cacheStatus === 'valid' ? '✅' : '⚠️'}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Estado Cache</p>
                <p className="text-lg font-bold text-gray-900">
                  {analytics.cacheStatus === 'valid' ? 'Actualizado' : 'Expirado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Productos más vistos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Productos Más Vistos
            </h3>
            {analytics.topViewedProducts && analytics.topViewedProducts.length > 0 ? (
              <ul className="space-y-3">
                {analytics.topViewedProducts.map((item, index) => (
                  <li key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">
                      {index + 1}. {item.productId}
                    </span>
                    <span className="text-sm text-gray-500">{item.views} vistas</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay datos de productos más vistos.</p>
            )}
          </div>

          {/* Productos más seleccionados */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🛒 Productos Más Seleccionados
            </h3>
            {analytics.topSelectedProducts && analytics.topSelectedProducts.length > 0 ? (
              <ul className="space-y-3">
                {analytics.topSelectedProducts.map((item, index) => (
                  <li key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">
                      {index + 1}. {item.productId}
                    </span>
                    <span className="text-sm text-gray-500">{item.selections} selecciones</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay datos de productos más seleccionados.</p>
            )}
          </div>
        </div>

        {/* Gestión de Comunicados */}
        <div className="mb-8">
          <CommunicationsManager />
        </div>

        {/* Gestión de Marcas */}
        <div className="mb-8">
          <BrandManager />
        </div>

        {/* Gestión de Productos Destacados */}
        <div className="mb-8">
          <FeaturedProductsManager />
        </div>
      </div>
    </div>
  )
}

export default AdminPage