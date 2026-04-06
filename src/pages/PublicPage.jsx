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
        // Cargar productos desde cache
        const cachedProducts = await cacheService.getProductsFromCache()
        
        // Filtrar SOLO productos que tengan lista de precio "pet"
        const petProducts = cachedProducts.filter(product => {
          if (product.priceLists && Array.isArray(product.priceLists)) {
            return product.priceLists.some(pl => 
              pl.name && pl.name.toLowerCase().includes('pet')
            )
          }
          // Si viene del catálogo pet pre-filtrado, incluir
          if (product.userType === 'pet') return true
          return false
        })

        // Calcular el precio pet para cada producto
        const petProductsWithPrice = petProducts.map(product => {
          let petPrice = product.price
          
          if (product.priceLists && Array.isArray(product.priceLists)) {
            const petPriceList = product.priceLists.find(pl => 
              pl.name && pl.name.toLowerCase().includes('pet')
            )
            if (petPriceList) {
              petPrice = parseFloat(petPriceList.price)
            }
          }
          
          return { ...product, petPrice }
        })
        
        setProducts(petProductsWithPrice)
        
        // Aplicar filtros de sección petshops para alimento-perro y alimento-gato
        const alimentoPerroProducts = cascadingFiltersService.applyCascadingFilters('petshops', ['alimento-perro'], petProductsWithPrice)
        const alimentoGatoProducts = cascadingFiltersService.applyCascadingFilters('petshops', ['alimento-gato'], petProductsWithPrice)
        
        // Combinar ambos tipos de productos
        const publicProducts = [...alimentoPerroProducts, ...alimentoGatoProducts]
        
        // Eliminar duplicados (por si un producto matchea en ambas)
        const uniqueProducts = publicProducts.filter((product, index, self) =>
          index === self.findIndex(p => p.id === product.id)
        )
        
        // Ordenar por marca (description) y luego por nombre
        const sortedProducts = uniqueProducts.sort((a, b) => {
          const descA = (a.description || '').toLowerCase()
          const descB = (b.description || '').toLowerCase()
          if (descA !== descB) return descA.localeCompare(descB)
          return (a.name || '').localeCompare(b.name || '')
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
    let displayProds = filteredProducts

    // Filtrar por categoría principal
    if (selectedCategory !== 'all') {
      displayProds = cascadingFiltersService.applyCascadingFilters('petshops', [selectedCategory], filteredProducts)
    }

    // Filtrar por marca específica si está seleccionada
    if (selectedSubcategory !== 'all') {
      displayProds = displayProds.filter(product => {
        const productDescription = (product.description || '').toLowerCase()
        const selectedBrand = selectedSubcategory.toLowerCase()
        return productDescription.includes(selectedBrand)
      })
    }

    return displayProds
  }

  const displayProducts = getDisplayProducts()

  // Resetear subcategoría cuando cambie la categoría principal
  useEffect(() => {
    setSelectedSubcategory('all')
  }, [selectedCategory])

  // Obtener marcas disponibles dinámicamente según los productos filtrados
  const getAvailableBrands = () => {
    let sourceProducts = filteredProducts
    
    if (selectedCategory !== 'all') {
      sourceProducts = cascadingFiltersService.applyCascadingFilters('petshops', [selectedCategory], filteredProducts)
    }
    
    // Extraer marcas únicas de description
    const brandsSet = new Set()
    sourceProducts.forEach(p => {
      if (p.description) brandsSet.add(p.description.toLowerCase())
    })
    
    const brands = Array.from(brandsSet).sort()
    return [
      { id: 'all', name: 'Todas las marcas' },
      ...brands.map(b => ({ id: b, name: b.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }))
    ]
  }

  // Calcular el precio sugerido al público (+25%)
  const getSuggestedPrice = (product) => {
    const basePrice = product.petPrice || product.price || 0
    return Math.round(basePrice * 1.25)
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center space-x-4">
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
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Lista de Precios
              </h1>
              <p className="text-blue-100 text-lg">
                Alimentos para Mascotas — Precio Sugerido al Público
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a
              href="/petshops"
              className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </a>
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
                {getAvailableBrands().map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
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
                
                {/* Precio Sugerido al Público */}
                <div className="text-center">
                  <span className="text-lg font-bold text-blue-600">
                    ${getSuggestedPrice(product).toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">Precio sugerido al público</p>
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
