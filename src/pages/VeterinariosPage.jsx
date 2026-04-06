import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCardWithCart from '../components/ProductCardWithCart'
import ProductDebug from '../components/ProductDebug'
import CascadingFilters from '../components/CascadingFilters'
import MobileCascadingFilters from '../components/MobileCascadingFilters'
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
  const [viewMode, setViewMode] = useState('grid')

  // Manejar parámetros de URL para filtros de navbar y búsqueda
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const navbarCategory = urlParams.get('category')
    const searchParam = urlParams.get('search')
    
    if (navbarCategory) {
      // Convertir categoría del navbar a selectedPath
      setSelectedPath([navbarCategory])
      // console.log('🔍 Categoría del navbar detectada:', navbarCategory)
    } else {
      setSelectedPath([])
    }
    
    if (searchParam) {
      setSearchTerm(searchParam)
      setSearch(searchParam)
    }
  }, [location.search, setSearch])

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
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
        <div className="w-full lg:flex-1 lg:flex lg:flex-col min-w-0">
        {/* Barra superior con búsqueda */}
        <div className="bg-white border-b p-2 sm:p-4">
          {/* Layout móvil: búsqueda en fila separada */}
          <div className="lg:hidden space-y-3">
            {/* Filtros móvil */}
            <MobileCascadingFilters 
              section="veterinarios" 
              selectedPath={selectedPath}
              onPathChange={setSelectedPath}
              products={getDisplayProducts()}
            />
            
            {/* Búsqueda móvil */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
          </div>

          {/* Layout desktop: todo en una fila */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Filtros móvil */}
            <MobileCascadingFilters 
              section="veterinarios" 
              selectedPath={selectedPath}
              onPathChange={setSelectedPath}
              products={getDisplayProducts()}
            />
            
            {/* Búsqueda */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6 min-w-0">
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
              {/* Contador de resultados y vista */}
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 sm:px-4 rounded-xl shadow-sm border border-gray-150">
                <p className="text-gray-600 text-sm">
                  <span className="font-bold text-gray-900">{sortedProducts.length}</span> producto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
                  {selectedPath.length > 0 && ` en "${cascadingFiltersService.getPathString(selectedPath)}"`}
                  {searchTerm && ` que contienen "${searchTerm}"`}
                </p>
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 border border-gray-200/60' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    title="Vista de cuadrícula"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600 border border-gray-200/60' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    title="Vista de lista"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Grid/Lista de productos */}
              {sortedProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCardWithCart key={product.id} product={product} viewMode="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {sortedProducts.map((product) => (
                        <ProductCardWithCart key={product.id} product={product} viewMode="list" />
                    ))}
                  </div>
                )
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
    </div>
  )
}

export default VeterinariosProductosPage