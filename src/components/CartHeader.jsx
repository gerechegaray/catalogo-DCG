import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DynamicNavbar from './DynamicNavbar'
import CartSidebar from './CartSidebar'
import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'

const CartHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()
  
  // Determinar el subtítulo basado en la ruta actual
  const getSubtitle = () => {
    if (location.pathname.startsWith('/veterinarios')) {
      return 'Línea Veterinaria'
    } else if (location.pathname.startsWith('/petshops')) {
      return 'Pet Shops'
    } else {
      return 'Línea Veterinaria' // Default
    }
  }

  // Función para manejar la búsqueda
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      if (location.pathname.startsWith('/veterinarios')) {
        navigate(`/veterinarios/productos?search=${encodeURIComponent(searchTerm)}`)
      } else if (location.pathname.startsWith('/petshops')) {
        navigate(`/petshops/productos?search=${encodeURIComponent(searchTerm)}`)
      } else {
        navigate(`/veterinarios/productos?search=${encodeURIComponent(searchTerm)}`) // Default
      }
    }
  }

  // Determinar la URL del logo basada en la ruta actual
  const getLogoUrl = () => {
    if (location.pathname.startsWith('/veterinarios')) {
      return '/veterinarios'
    } else if (location.pathname.startsWith('/petshops')) {
      return '/petshops'
    } else {
      return '/veterinarios' // Default
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-2xl">
      {/* Header principal */}
      <div className="w-full px-2 sm:px-4 lg:container lg:mx-auto py-4 sm:py-6">
        {/* Layout móvil: título arriba, búsqueda abajo */}
        <div className="lg:hidden space-y-4">
          {/* Logo y título móvil */}
          <div className="flex items-center justify-between">
            <Link to={getLogoUrl()} className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
                <img 
                  src="/DCG JPG-01.jpg" 
                  alt="DCG Distribuciones" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white drop-shadow-lg">DCG DISTRIBUCIONES</h1>
                {getSubtitle() && <p className="text-blue-100 font-medium text-xs">{getSubtitle()}</p>}
              </div>
            </Link>

            {/* Carrito móvil */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Búsqueda móvil - debajo del título */}
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="¿Qué producto está buscando?..."
                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-white/50 focus:border-white shadow-xl text-gray-800 placeholder-gray-500 pr-12 text-base"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value)
                  }
                }}
              />
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-lg"
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="producto"]')
                  handleSearch(input.value)
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Layout desktop: todo en una fila */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <Link to={getLogoUrl()} className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
              <img 
                src="/DCG JPG-01.jpg" 
                alt="DCG Distribuciones" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">DCG DISTRIBUCIONES</h1>
              {getSubtitle() && <p className="text-blue-100 font-medium">{getSubtitle()}</p>}
            </div>
          </Link>

          {/* Buscador */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="¿Qué producto está buscando?..."
                className="w-full px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-white/50 focus:border-white shadow-xl text-gray-800 placeholder-gray-500 pr-14"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.target.value)
                  }
                }}
              />
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors shadow-lg"
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="producto"]')
                  handleSearch(input.value)
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carrito */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors backdrop-blur-sm"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navbar dinámica */}
      <DynamicNavbar />
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

export default CartHeader