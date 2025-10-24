import React, { useEffect, useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import ExportButton from '../components/ExportButton'
import cacheService from '../services/cacheService'

// Lazy loading de componentes pesados
const CommunicationsManager = React.lazy(() => import('../components/CommunicationsManager'))
const BrandManager = React.lazy(() => import('../components/BrandManager'))
const FeaturedProductsManager = React.lazy(() => import('../components/FeaturedProductsManager'))

// Componente de loading para componentes admin
const AdminLoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">Cargando componente...</span>
  </div>
)

const AdminPage = () => {
  const { products, loading, reloadProducts, loadAnalytics, analytics } = useProducts()
  const { logoutAdmin } = useAuth()
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [showManagers, setShowManagers] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    enabled: false
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [products]) // Recargar analytics cuando los productos cambien

  const loadAnalyticsData = async () => {
    setLoadingAnalytics(true)
    await loadAnalytics()
    setLoadingAnalytics(false)
  }

  const loadAnalyticsWithDateFilter = async () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      alert('Por favor selecciona fechas de inicio y fin')
      return
    }
    
    setLoadingAnalytics(true)
    try {
      const analyticsData = await cacheService.getAnalyticsWithDateFilter(
        dateFilter.startDate, 
        dateFilter.endDate, 
        products
      )
      // Actualizar analytics en el contexto
      const { dispatch } = useProducts()
      dispatch({ type: 'SET_ANALYTICS', payload: analyticsData })
    } catch (error) {
      console.error('Error cargando analytics con filtro:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const clearDateFilter = () => {
    setDateFilter({
      startDate: '',
      endDate: '',
      enabled: false
    })
    loadAnalyticsData()
  }

  const handleClearAnalytics = async () => {
    if (window.confirm('⚠️ ¿Estás seguro de que quieres limpiar TODAS las analytics?\n\nEsta acción eliminará:\n• Todas las vistas de páginas\n• Todos los clicks en navbar\n• Todos los clicks en productos\n• Todos los clicks en anuncios\n• Todos los pedidos por WhatsApp\n\nEsta acción NO se puede deshacer.')) {
      try {
        await cacheService.clearAllAnalytics()
        await loadAnalyticsData()
        alert('✅ Analytics limpiadas exitosamente')
      } catch (error) {
        console.error('Error al limpiar analytics:', error)
        alert('❌ Error al limpiar analytics: ' + error.message)
      }
    }
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

  const handleCleanCorruptedData = async () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar los datos corruptos?\n\nEsto eliminará:\n• Productos con ID undefined\n• Productos con nombre undefined\n• Datos malformados\n\nEsta acción NO se puede deshacer.')) {
      try {
        await cacheService.cleanCorruptedAnalytics()
        await loadAnalyticsData()
        alert('✅ Datos corruptos limpiados exitosamente')
      } catch (error) {
        console.error('Error al limpiar datos corruptos:', error)
        alert('❌ Error al limpiar datos corruptos: ' + error.message)
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
                onClick={handleClearAnalytics}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🗑️ Limpiar Analytics
              </button>
              
              <button
                onClick={handleCleanCorruptedData}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🧹 Limpiar Datos Corruptos
              </button>
              
              <button
                onClick={() => setShowManagers(!showManagers)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {showManagers ? '📋 Ocultar Gestores' : '📋 Mostrar Gestores'}
              </button>
              
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {showAnalytics ? '📊 Ocultar Analytics' : '📊 Mostrar Analytics'}
              </button>
              
              {/* Botón de Exportación PDF */}
              <ExportButton variant="default" />
              
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {/* Analytics - Solo se muestra cuando está habilitado */}
        {showAnalytics && (
          <div>
            {/* Filtros de Fecha para Analytics */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  📅 Filtros de Fecha para Analytics
                </h2>
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={dateFilter.startDate}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={dateFilter.endDate}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={loadAnalyticsWithDateFilter}
                    disabled={loadingAnalytics || !dateFilter.startDate || !dateFilter.endDate}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingAnalytics ? '📊 Filtrando...' : '📊 Filtrar Analytics'}
                  </button>
                  
                  <button
                    onClick={clearDateFilter}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    🗑️ Limpiar Filtro
                  </button>
                </div>
                
                {analytics.dateRange && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📊 Mostrando analytics del {analytics.dateRange.startDate} al {analytics.dateRange.endDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Productos más vistos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📈 Productos Más Interactuados
                </h3>
                {analytics.topViewedProducts && analytics.topViewedProducts.length > 0 ? (
                  <ul className="space-y-3">
                    {analytics.topViewedProducts.map((item, index) => (
                      <li key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {item.productImage && (
                            <img 
                              src={item.productImage} 
                              alt={item.productName}
                              className="w-8 h-8 object-contain rounded"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          )}
                          <div>
                            <span className="font-medium text-gray-700 block">
                              {index + 1}. {item.productName || `Producto ${item.productId}`}
                            </span>
                            <span className="text-xs text-gray-500">ID: {item.productId}</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 font-semibold">
                          {item.totalInteractions} interacciones
                          <span className="text-xs block">
                            ({item.views} vistas + {item.clicks} clicks)
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay datos de productos más vistos.</p>
                )}
              </div>
            </div>

            {/* Analytics Detalladas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Vistas de Páginas */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📄 Páginas Más Visitadas
                </h3>
                {analytics.pageViews && analytics.pageViews.length > 0 ? (
                  <ul className="space-y-3">
                    {analytics.pageViews.map((item, index) => (
                      <li key={item.pageName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          {index + 1}. {item.pageName}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">{item.views} vistas</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay datos de páginas visitadas.</p>
                )}
              </div>

              {/* Clicks en Navbar */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🧭 Clicks en Navbar
                </h3>
                {analytics.navbarClicks && analytics.navbarClicks.length > 0 ? (
                  <ul className="space-y-3">
                    {analytics.navbarClicks.map((item, index) => (
                      <li key={item.linkName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          {index + 1}. {item.linkName}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks} clicks</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay datos de clicks en navbar.</p>
                )}
              </div>
            </div>

            {/* Analytics de Interacciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Clicks en Anuncios */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📢 Clicks en Anuncios
                </h3>
                {analytics.adClicks && analytics.adClicks.length > 0 ? (
                  <ul className="space-y-3">
                    {analytics.adClicks.map((item, index) => (
                      <li key={item.adTitle} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          {index + 1}. {item.adTitle}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks} clicks</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay datos de clicks en anuncios.</p>
                )}
              </div>

              {/* Clicks en Productos Destacados */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  ⭐ Clicks en Productos Destacados
                </h3>
                {analytics.featuredClicks && analytics.featuredClicks.length > 0 ? (
                  <ul className="space-y-3">
                    {analytics.featuredClicks.map((item, index) => (
                      <li key={item.productName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          {index + 1}. {item.productName}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks} clicks</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay datos de clicks en productos destacados.</p>
                )}
              </div>
            </div>

            {/* Analytics de Productos */}
            <div className="mb-8">
              {/* Agregar al Carrito */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  🛒 Productos Agregados al Carrito
                </h3>
                {analytics.addToCartClicks && analytics.addToCartClicks.length > 0 ? (
                  <ul className="space-y-3">
                    {analytics.addToCartClicks.slice(0, 10).map((item, index) => (
                      <li key={item.productName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700">
                          {index + 1}. {item.productName}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks} veces</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No hay datos de productos agregados al carrito.</p>
                )}
              </div>
            </div>

            {/* Estadísticas de WhatsApp */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📱 Pedidos por WhatsApp
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {analytics.whatsappOrders || 0}
                  </div>
                  <p className="text-gray-600">Total de pedidos enviados por WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestión de Comunicados - Solo se carga cuando se necesita */}
        {showManagers && (
          <div className="mb-8">
            <Suspense fallback={<AdminLoadingSpinner />}>
              <CommunicationsManager />
            </Suspense>
          </div>
        )}

        {/* Gestión de Marcas - Solo se carga cuando se necesita */}
        {showManagers && (
          <div className="mb-8">
            <Suspense fallback={<AdminLoadingSpinner />}>
              <BrandManager />
            </Suspense>
          </div>
        )}

        {/* Gestión de Productos Destacados - Solo se carga cuando se necesita */}
        {showManagers && (
          <div className="mb-8">
            <Suspense fallback={<AdminLoadingSpinner />}>
              <FeaturedProductsManager />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage