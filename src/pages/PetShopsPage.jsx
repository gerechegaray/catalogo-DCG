import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import ProductCardWithCart from '../components/ProductCardWithCart'
import ProductDebug from '../components/ProductDebug'
import CascadingFilters from '../components/CascadingFilters'
import MobileCascadingFilters from '../components/MobileCascadingFilters'
import cascadingFiltersService from '../services/cascadingFiltersService'
import { formatToTitle } from '../utils/textUtils'

const PetShopsProductosPage = () => {
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
      products = cascadingFiltersService.applyCascadingFilters('petshops', selectedPath, products)
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
          section="petshops" 
          selectedPath={selectedPath}
          onPathChange={setSelectedPath}
          products={getDisplayProducts()}
        />

        {/* Contenido principal */}
        <div className="w-full lg:flex-1 lg:flex lg:flex-col min-w-0">
        {/* Barra superior con búsqueda */}
        <div className="bg-white/70 backdrop-blur-md border-b sticky top-0 z-40 p-3 sm:p-5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
            {/* Filtros móvil */}
            <div className="w-full md:w-auto lg:hidden">
              <MobileCascadingFilters 
                section="petshops" 
                selectedPath={selectedPath}
                onPathChange={setSelectedPath}
                products={getDisplayProducts()}
              />
            </div>
            
            {/* Búsqueda */}
            <div className="relative w-full flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, marca o categoría..."
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-11 pr-4 py-3 border-gray-200 border bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-400 rounded-2xl transition-all duration-300 text-sm font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Selector de modo de vista */}
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100 shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Cuadrícula"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Lista"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header de Resultados */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {selectedPath.length > 0 ? formatToTitle(selectedPath[selectedPath.length - 1]) : 'Catálogo Pet Shops'}
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">
                <span className="text-orange-600 font-bold">{sortedProducts.length}</span> resultados encontrados
                {searchTerm && <span> para "<span className="text-gray-900">{searchTerm}</span>"</span>}
              </p>
            </div>
          </div>

          {/* Estado de carga */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Cargando catálogo</h2>
              <p className="text-gray-500 max-w-xs mx-auto">Estamos preparando los mejores productos para tus mascotas...</p>
            </div>
          )}

          {/* Productos */}
          {!loading && !error && (
            <>
              {/* Grid/Lista de productos */}
              {sortedProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {sortedProducts.map((product) => (
                        <ProductCardWithCart key={product.id} product={product} viewMode="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedProducts.map((product) => (
                        <ProductCardWithCart key={product.id} product={product} viewMode="list" />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 mb-2">No se encontraron productos</h2>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">Intenta cambiar los filtros o realizar otra búsqueda</p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedPath([])
                      clearFilters()
                      window.history.pushState({}, '', '/petshops/productos')
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-orange-100"
                  >
                    Borrar todos los filtros
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

export default PetShopsProductosPage