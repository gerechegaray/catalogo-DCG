import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { getFeaturedProducts } from '../services/featuredProductsService'

const FeaturedProducts = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { products, loading, recordFeaturedProductClick } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState([])
  
  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')

  useEffect(() => {
    loadFeaturedProducts()
  }, [isVeterinarios, isPetShops])

  const loadFeaturedProducts = async () => {
    try {
      const section = isVeterinarios ? 'veterinarios' : 'petshops'
      const featuredData = await getFeaturedProducts(section)
      
      // Convertir datos de Firebase a formato de productos
      const convertedProducts = featuredData.map(fp => ({
        id: fp.productId,
        name: fp.productName,
        image: fp.productImage,
        price: fp.productPrice,
        stock: fp.productStock,
        description: fp.productDescription,
        category: fp.productCategory
      }))
      
      setFeaturedProducts(convertedProducts)
    } catch (error) {
      console.error('Error al cargar productos destacados:', error)
      // Fallback a productos automáticos si falla
      if (products && products.length > 0) {
        let filteredProducts = products
        
        if (isPetShops) {
          filteredProducts = products.filter(product => 
            product.priceLists && product.priceLists.some(list => list.name === 'pet')
          )
        }
        
        const fallbackProducts = filteredProducts
          .filter(product => product.stock > 0)
          .slice(0, 8)
        
        setFeaturedProducts(fallbackProducts)
      }
    }
  }

  // Determinar la URL del producto
  const getProductUrl = (productId) => {
    if (isPetShops) {
      return `/petshops/productos/${productId}`
    } else {
      return `/veterinarios/productos/${productId}`
    }
  }

  const handleProductClick = (product) => {
    // Registrar click en producto destacado
    recordFeaturedProductClick(product.id, product.name)
    
    // Navegar directamente al producto usando React Router
    const productUrl = getProductUrl(product.id)
    navigate(productUrl)
  }

  const sectionTitle = 'Productos Destacados'
  const sectionSubtitle = 'Productos más vendidos y novedades'

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="w-full px-2 sm:px-4 lg:container lg:mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="w-full px-2 sm:px-4 lg:container lg:mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <Link to={getProductUrl(product.id)} className="block">
                  <div className="relative">
                    {product.image && product.image.trim() !== '' ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.svg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <div className="text-center text-blue-600">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-medium">Sin imagen</p>
                        </div>
                      </div>
                    )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      DESTACADO
                    </span>
                  </div>
                  </div>
                </Link>
                
                <div className="p-4 sm:p-6">
                  <Link to={getProductUrl(product.id)}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                    {product.category && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="hidden sm:inline">Ver Producto</span>
                    <span className="sm:hidden">Ver</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No hay productos destacados disponibles en este momento.
            </div>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => {
              const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
              navigate(baseUrl)
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
