import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Plus, Eye } from 'lucide-react'

const ProductCardWithCart = ({ product, viewMode = 'grid' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { recordProductView, recordViewProductClick } = useProducts()
  const { addToCart } = useCart()
  const [showImageModal, setShowImageModal] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Determinar la URL base para el enlace del producto
  const getProductUrl = () => {
    if (location.pathname.startsWith('/petshops')) {
      return `/petshops/productos/${product.id}`
    } else {
      return `/veterinarios/productos/${product.id}`
    }
  }

  // Manejar vista de producto (cuando se hace clic en imagen o nombre)
  const handleProductView = () => {
    recordProductView(product.id)
  }

  // Manejar click en "Ver Producto"
  const handleViewProduct = (e) => {
    // Si viene de un evento, prevenir default si es necesario, aunque Link lo maneja
    console.log('🔍 Debug handleViewProduct (WithCart):', {
      productId: product.id,
      productName: product.name,
      product: product,
      url: getProductUrl()
    })

    if (!product.id) {
      console.error('❌ Error: product.id es undefined', product)
      return
    }

    recordViewProductClick(product.id, product.name || `Producto ${product.id}`)
    const productUrl = getProductUrl()
    console.log('🚀 Navigating to:', productUrl)
    navigate(productUrl)
  }

  // Manejar agregar al carrito
  const handleAddToCart = async () => {
    if (isAddingToCart) return

    setIsAddingToCart(true)

    // Agregar la cantidad especificada
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    // Resetear cantidad después de agregar
    setTimeout(() => {
      setIsAddingToCart(false)
      setQuantity(1)
    }, 500)
  }

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  // Formatear precio
  const formatPrice = (price) => {
    // Manejar diferentes formatos de precio
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''))
      return isNaN(numericPrice) ? '$0' : `$${numericPrice.toLocaleString('es-CO')}`
    }

    if (typeof price === 'number') {
      return `$${price.toLocaleString('es-CO')}`
    }

    return '$0'
  }

  // --- RENDERING PARA VISTA DE LISTA ---
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
        {/* Imagen del producto (Pequeña) */}
        <Link to={getProductUrl()} onClick={handleProductView} className="shrink-0 w-full sm:w-32 h-32">
          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group border border-gray-100">
            {product.image ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity rounded-lg">
                  <Eye className="w-6 h-6 text-gray-700" />
                </div>
              </>
            ) : (
              <div className="text-3xl text-gray-400">📦</div>
            )}
          </div>
        </Link>

        {/* Información Principal */}
        <div className="flex-1 flex flex-col justify-center min-w-0 w-full text-center sm:text-left">
          <Link to={getProductUrl()} onClick={handleProductView}>
            <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors cursor-pointer truncate">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-center justify-center sm:justify-start gap-3">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.stock > 0 ? 'En Stock' : 'Sin Stock'}
            </span>
          </div>
          {product.description && (
            <p className="text-gray-500 text-sm mt-2 line-clamp-2 hidden md:block">
              {product.description}
            </p>
          )}
        </div>

        {/* Controles de Carrito (Derecha) */}
        <div className="shrink-0 w-full sm:w-auto flex flex-row sm:flex-col items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-6">
          {product.stock > 0 ? (
            <>
              {/* Selector de cantidad compacto */}
              <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded disabled:opacity-50 transition-all"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 text-center bg-transparent border-none text-sm font-medium focus:ring-0 p-0"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded disabled:opacity-50 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Botón Agregar compacto */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-colors"
              >
                {isAddingToCart ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span className="sm:hidden lg:inline">Agregar</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleViewProduct}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-500 px-4 py-2.5 rounded-lg font-medium"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Info</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  // --- RENDERING PARA VISTA DE CUADRÍCULA (GRID) ---
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Imagen del producto - Enlace a detalle */}
      <Link to={getProductUrl()} onClick={handleProductView}>
        <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group">
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Overlay con ícono de información */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="text-6xl text-gray-400">
              📦
            </div>
          )}
        </div>
      </Link>

      {/* Información del producto */}
      <div className="space-y-3">
        {/* Nombre */}
        <Link to={getProductUrl()} onClick={handleProductView}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Precio */}
        <div className="text-lg font-bold text-blue-600">
          {formatPrice(product.price)}
        </div>

        {/* Stock - Sí/No */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Stock:</span>
          <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {product.stock > 0 ? 'Sí' : 'No'}
          </span>
        </div>

        {/* Controles de cantidad y botones */}
        <div className="space-y-3">
          {/* Selector de cantidad */}
          {product.stock > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border border-gray-300 rounded-lg py-1 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAddingToCart}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${product.stock > 0 && !isAddingToCart
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Agregando...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar ({quantity})</span>
              </>
            )}
          </button>

          {/* Botón de ver producto */}
          <button
            onClick={handleViewProduct}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <Eye className="w-4 h-4" />
            <span>{product.stock > 0 ? 'Ver Producto' : 'Sin Stock'}</span>
          </button>
        </div>
      </div>

      {/* Modal para imagen expandida */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {/* Botón de cerrar */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Información del producto en el modal */}
            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  Stock: {product.stock > 0 ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCardWithCart