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
        // Cargar catálogo PET específicamente (no depende de la URL)
        const cachedProducts = await cacheService.getProductsHybrid('pet')
        
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Premium */}
      <header className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 shadow-2xl relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16 relative z-10 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-white p-1 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
               <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                <img 
                  src="/DCG JPG-01.jpg" 
                  alt="DCG Logo" 
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="hidden w-16 h-16 bg-blue-600 rounded-full items-center justify-center text-white font-black text-xl">
                  DCG
                </div>
               </div>
            </div>
            
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tighter leading-tight uppercase">
                Lista de Precios <span className="text-blue-300">DCG</span>
              </h1>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-blue-100 text-sm font-bold tracking-wide">
                 <span className="mr-2">✨</span> Alimentos para Mascotas — Precio Sugerido al Público
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/petshops"
                className="group flex items-center px-8 py-3.5 bg-white text-blue-900 font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 hover:shadow-xl active:scale-95"
              >
                <svg className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al catálogo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros Profesionales */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-5 font-bold">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center">
            {/* Filtro por categoría */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Especie:</span>
              <div className="flex bg-gray-100 p-1.5 rounded-2xl gap-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-tight transition-all active:scale-95 ${
                    selectedCategory === 'all'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedCategory('alimento-perro')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-tight transition-all active:scale-95 ${
                    selectedCategory === 'alimento-perro'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  🐕 Perro
                </button>
                <button
                  onClick={() => setSelectedCategory('alimento-gato')}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-tight transition-all active:scale-95 ${
                    selectedCategory === 'alimento-gato'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  🐱 Gato
                </button>
              </div>
            </div>

            {/* Filtro por marca */}
            <div className="flex items-center gap-4 w-full md:w-auto min-w-[240px]">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Marca:</span>
              <div className="relative flex-1">
                 <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full appearance-none px-6 py-3 bg-gray-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-sm text-gray-800 cursor-pointer"
                >
                  {getAvailableBrands().map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                   <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Info de Resultados */}
        <div className="mb-10 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
             <h2 className="text-lg font-black text-gray-900 tracking-tight">Catálogo sugerido</h2>
           </div>
           <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            {displayProducts.length} productos
          </p>
        </div>

        {/* Grid de Productos Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 right-4 bg-emerald-50/90 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 z-10">
                 En Stock
              </div>

              {/* Imagen del Producto */}
              <div className="aspect-square p-6 relative bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                
                <div 
                  className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center"
                  style={{ display: product.image ? 'none' : 'flex' }}
                >
                   <div className="text-blue-200">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Información del Producto */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-1">
                    {product.description || 'Alimento'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-snug min-h-[2.8em] group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h3>
                </div>
                
                {/* Precio Sugerido al Público */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Precio sugerido</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900 tracking-tighter">
                      ${getSuggestedPrice(product).toLocaleString('es-AR')}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">IVA Inc.</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic font-medium">* Precio de referencia para clientes</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje de cortesía / Pie */}
        <div className="mt-20 py-12 px-6 bg-white rounded-[40px] border border-gray-100 shadow-sm text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">¿Deseas realizar un pedido?</h4>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed mb-8">
              Ponte en contacto con nosotros para gestionar tus compras y consultar promociones por volumen.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <a href="/contacto" className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-95">
                 Contactar ventas
               </a>
            </div>
        </div>

        {/* Mensaje si no hay productos */}
        {displayProducts.length === 0 && !loading && (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Sin productos disponibles</h3>
            <p className="text-gray-500 max-w-xs mx-auto">No se encontraron productos con los filtros seleccionados.</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 py-10 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
           © {new Date().getFullYear()} DCG Veterinaria & Mascotas
         </p>
      </footer>
    </div>
  )
}

export default PublicPage
