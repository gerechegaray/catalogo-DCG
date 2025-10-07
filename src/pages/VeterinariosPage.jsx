import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCardWithCart from '../components/ProductCardWithCart'
import ProductDebug from '../components/ProductDebug'
import CascadingFilters from '../components/CascadingFilters'
import MobileCascadingFilters from '../components/MobileCascadingFilters'
import cacheService from '../services/cacheService'
import cascadingFiltersService from '../services/cascadingFiltersService'

const VeterinariosProductosPage = () => {
  const location = useLocation()
  const { 
    filteredProducts, 
    loading, 
    error, 
    filters, 
    setUserType, 
    setSearch,
    clearFilters,
    reloadProducts
  } = useProducts()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPath, setSelectedPath] = useState([])
  const [clearingCache, setClearingCache] = useState(false)

  // Manejar parámetros de URL para filtros de navbar y búsqueda
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const navbarCategory = urlParams.get('category')
    const searchParam = urlParams.get('search')
    
    if (navbarCategory) {
      // Convertir categoría del navbar a selectedPath
      setSelectedPath([navbarCategory])
      console.log('🔍 Categoría del navbar detectada:', navbarCategory)
    } else {
      setSelectedPath([])
    }
    
    if (searchParam) {
      setSearchTerm(searchParam)
      setSearch(searchParam)
    }
  }, [location.search, setSearch])

  // Función para limpiar cache y recargar datos
  const handleClearCache = async () => {
    if (window.confirm('¿Limpiar cache y recargar datos desde Alegra? Esto puede tomar unos minutos.')) {
      setClearingCache(true)
      try {
        await cacheService.clearAll()
        await reloadProducts()
        alert('✅ Cache limpiado y datos actualizados desde Alegra')
      } catch (error) {
        console.error('Error:', error)
        alert('❌ Error al limpiar cache: ' + error.message)
      } finally {
        setClearingCache(false)
      }
    }
  }

  // Ya no necesitamos configurar userType manualmente
  // Se detecta automáticamente desde la URL

  // Manejar búsqueda
  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setSearch(value)
  }

  // Ya no necesitamos estas variables con filtros escalonados

  // Filtrar productos usando filtros escalonados
  const getDisplayProducts = () => {
    let products = filteredProducts
    
    // Aplicar filtros escalonados si hay una ruta seleccionada
    if (selectedPath.length > 0) {
      products = cascadingFiltersService.applyCascadingFilters('veterinarios', selectedPath, products)
    }
    
    return products
  }

  const displayProducts = getDisplayProducts()

  // Ordenar productos alfabéticamente
  const sortedProducts = [...displayProducts].sort((a, b) => 
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Debug de productos - Oculto para no interferir con el layout */}
      {/* {process.env.NODE_ENV === 'development' && <ProductDebug />} */}

      {/* Sidebar de filtros escalonados */}
      <CascadingFilters 
        section="veterinarios" 
        selectedPath={selectedPath}
        onPathChange={setSelectedPath}
        products={getDisplayProducts()}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra superior con búsqueda */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-4">
            {/* Filtros móvil */}
            <MobileCascadingFilters 
              section="veterinarios" 
              selectedPath={selectedPath}
              onPathChange={setSelectedPath}
              products={getDisplayProducts()}
            />
            
            {/* Búsqueda */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Botón para limpiar cache */}
            <button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {clearingCache ? '🔄 Limpiando...' : '🗑️ Limpiar Cache'}
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-6">
          {/* Estado de carga */}
          {loading && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔄</div>
              <h2 className="text-xl font-semibold text-gray-700">
                Cargando productos...
              </h2>
              <p className="text-gray-600">
                Sincronizando con Alegra
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-red-700">
                Error al cargar productos
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Productos */}
          {!loading && !error && (
            <>
              {/* Contador de resultados */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
                  {selectedPath.length > 0 && ` en "${cascadingFiltersService.getPathString(selectedPath)}"`}
                  {searchTerm && ` que contienen "${searchTerm}"`}
                </p>
              </div>

              {/* Grid de productos */}
              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProducts.map((product) => (
                      <ProductCardWithCart key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">🔍</div>
                  <h2 className="text-xl font-semibold text-gray-700">
                    No se encontraron productos
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedPath([])
                      clearFilters()
                      window.history.pushState({}, '', '/veterinarios/productos')
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VeterinariosProductosPage