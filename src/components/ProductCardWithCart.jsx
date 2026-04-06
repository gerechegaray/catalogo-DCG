import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Plus, Eye, X } from 'lucide-react'

const ProductCardWithCart = ({ product, viewMode = 'grid' }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { recordProductView, recordViewProductClick } = useProducts()
  const { addToCart } = useCart()
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

  // Manejar vista de producto
  const handleProductView = () => {
    recordProductView(product.id)
  }

  // Manejar click en "Ver Producto"
  const handleViewProduct = (e) => {
    if (!product.id) return
    recordViewProductClick(product.id, product.name || `Producto ${product.id}`)
    navigate(getProductUrl())
  }

  // Manejar agregar al carrito
  const handleAddToCart = async () => {
    if (isAddingToCart) return
    setIsAddingToCart(true)
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setTimeout(() => {
      setIsAddingToCart(false)
      setQuantity(1)
    }, 500)
  }

  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 999)) {
      setQuantity(newQuantity)
    }
  }

  // Formatear precio
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''))
      return isNaN(numericPrice) ? '$0' : `$${numericPrice.toLocaleString('es-AR')}`
    }
    if (typeof price === 'number') {
      return `$${price.toLocaleString('es-AR')}`
    }
    return '$0'
  }

  // --- RENDERING PARA VISTA DE LISTA ---
  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 p-4 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-300 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center relative overflow-hidden">
        {/* Badge de Stock (Desktop) */}
        {!product.stock && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider transform -rotate-45 -translate-x-4 translate-y-2.5 z-10 hidden sm:block">
            Agotado
          </div>
        )}

        {/* Imagen del producto */}
        <Link 
          to={getProductUrl()} 
          onClick={handleProductView} 
          className="shrink-0 w-full sm:w-40 h-40 relative group/img"
        >
          <div className="w-full h-full bg-gray-50/50 rounded-2xl flex items-center justify-center cursor-pointer transition-colors duration-300 group-hover:bg-blue-50/30 overflow-hidden border border-gray-100/50">
            {product.image ? (
              <>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover/img:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-blue-600/5 backdrop-blur-[1px] transition-all duration-300">
                  <Eye className="w-8 h-8 text-blue-600 drop-shadow-sm" />
                </div>
              </>
            ) : (
              <div className="text-5xl opacity-40 filter grayscale">📦</div>
            )}
          </div>
        </Link>

        {/* Información Principal */}
        <div className="flex-1 flex flex-col justify-center min-w-0 w-full text-center sm:text-left">
          <div className="mb-1">
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
              {product.subcategory || 'General'}
            </span>
          </div>
          <Link to={getProductUrl()} onClick={handleProductView}>
            <h3 className="font-bold text-gray-900 text-xl hover:text-blue-600 transition-colors cursor-pointer leading-tight mb-2 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <span className="text-2xl font-black text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tight ${
              product.stock > 0 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {product.stock > 0 ? `En Stock (${product.stock})` : 'Agotado'}
            </span>
          </div>
          
          {product.description && (
            <p className="text-gray-500 text-sm mt-3 line-clamp-2 hidden md:block leading-relaxed max-w-xl">
              {product.description}
            </p>
          )}
        </div>

        {/* Controles de Carrito */}
        <div className="shrink-0 w-full sm:w-auto flex flex-row sm:flex-col items-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-8">
          {product.stock > 0 ? (
            <>
              {/* Selector de cantidad premium */}
              <div className="flex items-center bg-gray-100/80 p-1.5 rounded-xl border border-gray-200/50">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-lg disabled:opacity-30 transition-all font-bold text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-12 text-center bg-transparent border-none text-base font-bold focus:ring-0 p-0 text-gray-900"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-lg disabled:opacity-30 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Botón Agregar Principal */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-200/50 min-w-[160px]"
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al carrito</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleViewProduct}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-gray-800"
            >
              <Eye className="w-5 h-5" />
              <span>Ver Info</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  // --- RENDERING PARA VISTA DE CUADRÍCULA (GRID) ---
  return (
    <div className="group bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 p-5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative flex flex-col h-full overflow-hidden">
      {/* Badge de Stock */}
      <div className={`absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
        product.stock > 0 
          ? 'bg-emerald-50/90 text-emerald-600 border-emerald-100' 
          : 'bg-red-50/90 text-red-600 border-red-100'
      }`}>
        {product.stock > 0 ? 'Disponible' : 'Agotado'}
      </div>

      {/* Imagen del producto */}
      <Link to={getProductUrl()} onClick={handleProductView} className="relative block">
        <div className="w-full aspect-square bg-gray-50/50 rounded-2xl mb-5 flex items-center justify-center cursor-pointer transition-colors duration-300 group-hover:bg-blue-50/20 border border-gray-100/50 overflow-hidden relative">
          {product.image ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              {/* Click to details overlay */}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 backdrop-blur-[0px] group-hover:backdrop-blur-[1px] transition-all duration-300 flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full shadow-xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </>
          ) : (
            <div className="text-7xl opacity-40">📦</div>
          )}
        </div>
      </Link>

      {/* Información del producto */}
      <div className="flex-1 flex flex-col">
        {/* Categoría y Nombre */}
        <div className="mb-3">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.1em] mb-1 block">
            {product.subcategory || 'General'}
          </span>
          <Link to={getProductUrl()} onClick={handleProductView}>
            <h3 className="font-bold text-gray-900 line-clamp-2 text-base leading-snug group-hover:text-blue-600 transition-colors h-[2.5em]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Precio - Grande y destacado */}
        <div className="mb-5">
          <div className="text-[13px] text-gray-400 font-medium mb-0.5">Precio de lista</div>
          <div className="text-2xl font-black text-gray-900 tracking-tighter">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Controles y Botones */}
        <div className="mt-auto space-y-3">
          {product.stock > 0 ? (
            <>
              {/* Selector de cantidad compacto premium */}
              <div className="flex items-center bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 bg-white hover:bg-gray-100 disabled:opacity-30 rounded-xl flex items-center justify-center transition-all border border-gray-200/50 shadow-sm active:scale-90"
                >
                  <span className="text-xl font-bold leading-none">−</span>
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="flex-1 text-center bg-transparent border-none text-base font-black text-gray-800 p-0 focus:ring-0"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-9 h-9 bg-white hover:bg-gray-100 disabled:opacity-30 rounded-xl flex items-center justify-center transition-all border border-gray-200/50 shadow-sm active:scale-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Botón Principal Agregar */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2 bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-md shadow-orange-100"
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Agregar al pedido</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleViewProduct}
              className="w-full py-4 px-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Sin Stock</span>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCardWithCart