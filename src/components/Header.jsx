import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DynamicNavbar from './DynamicNavbar'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Determinar el subtítulo basado en la ruta actual
  const getSubtitle = () => {
    if (location.pathname === '/contacto') {
      return null // No mostrar subtítulo en contacto
    } else if (location.pathname.startsWith('/veterinarios')) {
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
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
        </div>
      </div>

      {/* Navbar dinámica */}
      <DynamicNavbar />
    </div>
  )
}

export default Header