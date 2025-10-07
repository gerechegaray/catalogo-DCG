import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart, Share2 } from 'lucide-react'

const ProductDetailPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { products } = useProducts()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Encontrar el producto por ID
  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      // Redirigir si no se encuentra el producto
      navigate(-1)
    }
  }, [productId, products, navigate])

  // Generar enlace del producto
  const generateProductLink = () => {
    const currentUrl = window.location.href
    return currentUrl
  }

  // Compartir producto
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Mira este producto: ${product.name}`,
          url: generateProductLink()
        })
      } catch (error) {
        console.log('Error al compartir:', error)
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(generateProductLink())
      alert('Enlace copiado al portapapeles')
    }
  }


  // Agregar al carrito
  const handleAddToCart = async () => {
    if (isAddingToCart || !product) return
    
    setIsAddingToCart(true)
    
    // Agregar la cantidad especificada
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imágenes del producto */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="w-full h-96 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain p-4"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-6xl rounded-2xl" style={{display: product.image ? 'none' : 'flex'}}>
                📦
              </div>
            </div>

            {/* Miniaturas (si hay múltiples imágenes) */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Nombre y acciones */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Botones de acción */}
              <div className="flex items-center space-x-3 mt-4">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Precio */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-gray-500">c/u</span>
              </div>
              
              {/* Precio sugerido para Alimento Perro y Alimento Gato */}
              {(product.category?.toLowerCase().includes('alimento perro') || 
                product.category?.toLowerCase().includes('alimento gato') ||
                product.description?.toLowerCase().includes('alimento perro') ||
                product.description?.toLowerCase().includes('alimento gato') ||
                product.name?.toLowerCase().includes('perro') ||
                product.name?.toLowerCase().includes('gato')) && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-700 font-medium">Precio sugerido de venta:</span>
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-bold text-green-600">
                      ${Math.round(product.price * 1.25).toLocaleString()}
                    </span>
                    <span className="text-sm text-green-600">(+25%)</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Precio recomendado para venta al público
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Cantidad y botones */}
            {product.stock > 0 && (
              <div className="space-y-4">
                {/* Selector de cantidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Botón de agregar al carrito */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    !isAddingToCart
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Agregando al Pedido...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Agregar al Pedido ({quantity})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage