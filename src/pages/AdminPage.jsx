import React, { useEffect, useState, Suspense } from 'react'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import ExportButton from '../components/ExportButton'
import cacheService from '../services/cacheService'

// Lazy loading de componentes pesados
const CommunicationsManager = React.lazy(() => import('../components/CommunicationsManager'))
const BrandManager = React.lazy(() => import('../components/BrandManager'))
const FeaturedProductsManager = React.lazy(() => import('../components/FeaturedProductsManager'))

// Loading spinner
const SectionLoading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
    <span className="text-gray-600">Cargando...</span>
  </div>
)

const AdminPage = () => {
  const { products, loading, reloadProducts, loadAnalytics, analytics } = useProducts()
  const { logoutAdmin } = useAuth()
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [activeSection, setActiveSection] = useState(null) // null, 'banners', 'brands', 'featured', 'analytics'

  useEffect(() => {
    loadAnalyticsData()
  }, [products])

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
    if (window.confirm('¿Limpiar cache y forzar nueva sincronización con Alegra?')) {
      try {
        await cacheService.clearAll()
        await reloadProducts()
        await loadAnalyticsData()
        alert('Cache limpiado y datos actualizados.')
      } catch (error) {
        alert('Error: ' + error.message)
      }
    }
  }

  const handleClearAnalytics = async () => {
    if (window.confirm('⚠️ ¿Eliminar TODAS las analytics?\n\nEsta acción NO se puede deshacer.')) {
      try {
        await cacheService.clearAllAnalytics()
        await loadAnalyticsData()
        alert('Analytics limpiadas.')
      } catch (error) {
        alert('Error: ' + error.message)
      }
    }
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  // Navigation items for the admin sidebar
  const navItems = [
    { key: 'banners', icon: '📢', label: 'Banners y Avisos', color: 'blue' },
    { key: 'featured', icon: '⭐', label: 'Productos Destacados', color: 'yellow' },
    { key: 'brands', icon: '🏷️', label: 'Marcas y Laboratorios', color: 'purple' },
    { key: 'analytics', icon: '📊', label: 'Analytics', color: 'green' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-500 mt-1">Gestiona tu catálogo desde aquí.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? '🔄 Actualizando...' : '🔄 Actualizar Datos'}
              </button>
              <ExportButton variant="default" />
              <button
                onClick={() => { logoutAdmin(); window.location.href = '/' }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Productos</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalProducts || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Cache</p>
            <p className={`text-lg font-bold mt-1 ${analytics.cacheStatus === 'valid' ? 'text-green-600' : 'text-orange-600'}`}>
              {analytics.cacheStatus === 'valid' ? '✅ Actualizado' : '⚠️ Expirado'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pedidos WhatsApp</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{analytics.whatsappOrders || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Top Producto</p>
            <p className="text-sm font-bold text-gray-900 mt-1 truncate">
              {analytics.topViewedProducts?.[0]?.productName || '—'}
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => toggleSection(item.key)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                activeSection === item.key 
                  ? 'bg-blue-50 border-blue-500 shadow-md' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className={`font-bold text-sm ${activeSection === item.key ? 'text-blue-700' : 'text-gray-800'}`}>
                {item.label}
              </p>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        {activeSection === 'banners' && (
          <div className="mb-6">
            <Suspense fallback={<SectionLoading />}>
              <CommunicationsManager />
            </Suspense>
          </div>
        )}

        {activeSection === 'featured' && (
          <div className="mb-6">
            <Suspense fallback={<SectionLoading />}>
              <FeaturedProductsManager />
            </Suspense>
          </div>
        )}

        {activeSection === 'brands' && (
          <div className="mb-6">
            <Suspense fallback={<SectionLoading />}>
              <BrandManager />
            </Suspense>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="mb-6 space-y-6">
            {/* Analytics Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">📊 Analytics Detalladas</h2>
                <div className="flex gap-2">
                  <button
                    onClick={loadAnalyticsData}
                    disabled={loadingAnalytics}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {loadingAnalytics ? 'Cargando...' : '🔄 Actualizar'}
                  </button>
                  <button
                    onClick={handleClearCache}
                    className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🗑️ Limpiar Cache
                  </button>
                  <button
                    onClick={handleClearAnalytics}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🗑️ Resetear Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Top Productos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">📈 Productos Más Interactuados</h3>
              {analytics.topViewedProducts && analytics.topViewedProducts.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topViewedProducts.map((item, index) => (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.productImage && (
                          <img src={item.productImage} alt="" className="w-8 h-8 object-contain rounded shrink-0" onError={(e) => e.target.style.display = 'none'} />
                        )}
                        <div className="min-w-0">
                          <span className="font-medium text-gray-700 block text-sm truncate">
                            {index + 1}. {item.productName || `ID: ${item.productId}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-sm font-bold text-blue-600">{item.totalInteractions}</span>
                        <span className="text-xs text-gray-500 block">({item.views}v + {item.clicks}c)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin datos aún.</p>
              )}
            </div>

            {/* Grids de analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Páginas Visitadas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">📄 Páginas Más Visitadas</h3>
                {analytics.pageViews && analytics.pageViews.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.pageViews.map((item, i) => (
                      <div key={item.pageName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 text-sm">{i+1}. {item.pageName}</span>
                        <span className="text-sm text-gray-500 font-semibold">{item.views}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Sin datos.</p>}
              </div>

              {/* Navbar Clicks */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">🧭 Clicks en Navbar</h3>
                {analytics.navbarClicks && analytics.navbarClicks.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.navbarClicks.map((item, i) => (
                      <div key={item.linkName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 text-sm">{i+1}. {item.linkName}</span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Sin datos.</p>}
              </div>

              {/* Clicks en Anuncios */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">📢 Clicks en Anuncios</h3>
                {analytics.adClicks && analytics.adClicks.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.adClicks.map((item, i) => (
                      <div key={item.adTitle} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 text-sm">{i+1}. {item.adTitle}</span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Sin datos.</p>}
              </div>

              {/* Carrito */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">🛒 Agregados al Carrito</h3>
                {analytics.addToCartClicks && analytics.addToCartClicks.length > 0 ? (
                  <div className="space-y-2">
                    {analytics.addToCartClicks.slice(0, 10).map((item, i) => (
                      <div key={item.productName} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 text-sm">{i+1}. {item.productName}</span>
                        <span className="text-sm text-gray-500 font-semibold">{item.clicks}x</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Sin datos.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Empty state when no section selected */}
        {!activeSection && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-3">👆</p>
            <p className="text-gray-500 font-medium">Selecciona una sección de arriba para comenzar a administrar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage