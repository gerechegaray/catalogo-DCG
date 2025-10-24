import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { getFeaturedProducts } from '../services/featuredProductsService'

const FeaturedProducts = () => {
  const location = useLocation()
  const { products, loading } = useProducts()
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
    // Generar mensaje de WhatsApp
    const message = `Hola! Me interesa el producto: ${product.name}\nPrecio: $${product.price}\nStock: ${product.stock} unidades\n\n¿Podrían enviarme más información?`
    const whatsappUrl = `https://wa.me/5492645438284?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const sectionTitle = 'Productos Destacados'
  const sectionSubtitle = 'Productos más vendidos y novedades'

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
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
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <Link to={getProductUrl(product.id)} className="block">
                  <div className="relative">
                    <img
                      src={product.image || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.svg'
                      }}
                    />
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      NUEVO
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Stock: {product.stock}
                    </span>
                  </div>
                  </div>
                </Link>
                
                <div className="p-6">
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
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4h3a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h3V4z" clipRule="evenodd" />
                    </svg>
                    Consultar por WhatsApp
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

        <div className="text-center mt-12">
          <button
            onClick={() => {
              const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
              window.location.href = baseUrl
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
