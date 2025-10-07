import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Plus } from 'lucide-react'

const ProductCardWithCart = ({ product }) => {
  const location = useLocation()
  const { addSelectedProduct, selectedProducts, recordProductView } = useProducts()
  const { addToCart, removeFromCart } = useCart()
  const [isSelected, setIsSelected] = useState(false)
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

  // Verificar si el producto está seleccionado
  React.useEffect(() => {
    const selected = selectedProducts.find(p => p.id === product.id)
    setIsSelected(!!selected)
  }, [selectedProducts, product.id])

  // Manejar selección de producto
  const handleSelect = () => {
    addSelectedProduct(product)
    recordProductView(product.id)
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      {/* Imagen del producto - Enlace a detalle */}
      <Link to={getProductUrl()}>
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
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
          {product.name}
        </h3>

        {/* Precio */}
        <div className="text-lg font-bold text-blue-600">
          {formatPrice(product.price)}
        </div>

        {/* Stock - Sí/No */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Stock:</span>
          <span className={`text-sm font-medium ${
            product.stock > 0 ? 'text-green-600' : 'text-red-600'
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
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              product.stock > 0 && !isAddingToCart
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

          {/* Botón de selección (mantener para compatibilidad) */}
          <button
            onClick={handleSelect}
            disabled={product.stock <= 0}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
              isSelected
                ? 'bg-green-100 text-green-700 border border-green-300'
                : product.stock > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSelected ? '✓ Seleccionado' : product.stock > 0 ? 'Seleccionar' : 'Sin Stock'}
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
                <span className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
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