import React, { useState, useEffect } from 'react'
import cacheService from '../services/cacheService'
import cascadingFiltersService from '../services/cascadingFiltersService'

const PublicPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all') // 'all', 'alimento-perro', 'alimento-gato'
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Cargar productos desde Firebase cache (no desde Alegra)
        const cachedProducts = await cacheService.getProductsFromCache()
        setProducts(cachedProducts)
        
        // Usar el mismo sistema de filtros que las otras páginas
        // Aplicar filtros para mostrar solo alimento-perro y alimento-gato
        const alimentoPerroProducts = cascadingFiltersService.applyCascadingFilters('veterinarios', ['alimento-perro'], cachedProducts)
        const alimentoGatoProducts = cascadingFiltersService.applyCascadingFilters('veterinarios', ['alimento-gato'], cachedProducts)
        
        // Combinar ambos tipos de productos
        const publicProducts = [...alimentoPerroProducts, ...alimentoGatoProducts]
        
        // Ordenar por categoría y luego por nombre
        const sortedProducts = publicProducts.sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category)
          }
          return a.name.localeCompare(b.name)
        })
        
        setFilteredProducts(sortedProducts)
      } catch (error) {
        console.error('Error cargando productos:', error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrar productos según categoría y subcategoría seleccionadas
  const getDisplayProducts = () => {
    let products = filteredProducts

    // Filtrar por categoría principal usando cascadingFiltersService
    if (selectedCategory !== 'all') {
      products = cascadingFiltersService.applyCascadingFilters('veterinarios', [selectedCategory], filteredProducts)
      console.log('🔍 Filtro por categoría:', selectedCategory, 'Productos encontrados:', products.length)
    }

    // Filtrar por marca específica si está seleccionada
    if (selectedSubcategory !== 'all') {
      products = products.filter(product => {
        // Buscar la marca en la descripción del producto
        const productDescription = (product.description || '').toLowerCase()
        const selectedBrand = selectedSubcategory.toLowerCase()
        
        // Mapeo de marcas para búsqueda más flexible
        const brandMappings = {
          'manada': 'manada',
          'seguidor': 'seguidor',
          'old prince premium': 'old prince premium',
          'old prince equilibrium': 'old prince equilibrium',
          'old prince noveles': 'old prince noveles',
          'company': 'company',
          'origen': 'origen',
          'fawna': 'fawna'
        }
        
        const searchTerm = brandMappings[selectedBrand] || selectedBrand
        const isMatch = productDescription.includes(searchTerm)
        
        if (isMatch) {
          console.log('✅ Producto encontrado:', product.name, 'Marca:', searchTerm)
        }
        
        return isMatch
      })
      console.log('🔍 Filtro por marca:', selectedSubcategory, 'Productos encontrados:', products.length)
    }

    return products
  }

  const displayProducts = getDisplayProducts()

  // Resetear subcategoría cuando cambie la categoría principal
  useEffect(() => {
    setSelectedSubcategory('all')
  }, [selectedCategory])

  // Obtener subcategorías disponibles según la categoría seleccionada
  const getAvailableSubcategories = () => {
    if (selectedCategory === 'all') {
      return [
        { id: 'all', name: 'Todas las marcas' },
        { id: 'manada', name: 'Manada' },
        { id: 'seguidor', name: 'Seguidor' },
        { id: 'old prince premium', name: 'Old Prince Premium' },
        { id: 'old prince equilibrium', name: 'Old Prince Equilibrium' },
        { id: 'old prince noveles', name: 'Old Prince Noveles' },
        { id: 'company', name: 'Company' },
        { id: 'origen', name: 'Origen' },
        { id: 'fawna', name: 'Fawna' }
      ]
    }
    
    if (selectedCategory === 'alimento-perro') {
      return [
        { id: 'all', name: 'Todas las marcas' },
        { id: 'manada', name: 'Manada' },
        { id: 'seguidor', name: 'Seguidor' },
        { id: 'old prince premium perro', name: 'Old Prince Premium' },
        { id: 'old prince equilibrium perro', name: 'Old Prince Equilibrium' },
        { id: 'old prince noveles perro', name: 'Old Prince Noveles' },
        { id: 'company perro', name: 'Company' },
        { id: 'origen perro', name: 'Origen' },
        { id: 'fawna perro', name: 'Fawna' }
      ]
    }
    
    if (selectedCategory === 'alimento-gato') {
      return [
        { id: 'all', name: 'Todas las marcas' },
        { id: 'old prince premium gato', name: 'Old Prince Premium' },
        { id: 'old prince equilibrium gato', name: 'Old Prince Equilibrium' },
        { id: 'company gato', name: 'Company' },
        { id: 'origen gato', name: 'Origen' },
        { id: 'fawna gato', name: 'Fawna' }
      ]
    }
    
    return [{ id: 'all', name: 'Todas las marcas' }]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logo y diseño elegante */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-4">
            {/* Logo */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/DCG JPG-01.jpg" 
                alt="DCG Logo" 
                className="w-12 h-12 object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ display: 'none' }}>
                DCG
              </div>
            </div>
            
            {/* Título */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Lista de Precios
              </h1>
              <p className="text-blue-100 text-lg">
                Alimentos para Mascotas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Filtro por categoría */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Categoría:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedCategory('alimento-perro')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'alimento-perro'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐕 Perro
                </button>
                <button
                  onClick={() => setSelectedCategory('alimento-gato')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === 'alimento-gato'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  🐱 Gato
                </button>
              </div>
            </div>

            {/* Filtro por marca */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Marca:
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {getAvailableSubcategories().map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Contador de productos */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Mostrando {displayProducts.length} producto{displayProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
            >
              {/* Imagen del Producto */}
              <div className="aspect-square p-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                
                {/* Placeholder si no hay imagen */}
                <div 
                  className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center"
                  style={{ display: product.image ? 'none' : 'flex' }}
                >
                  <div className="text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">Sin imagen</p>
                  </div>
                </div>
              </div>

              {/* Información del Producto */}
              <div className="p-4 pt-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Precio Sugerido */}
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price ? `$${Math.round(product.price * 1.25).toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay productos */}
        {displayProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-500">
              No se encontraron productos con los filtros seleccionados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicPage
