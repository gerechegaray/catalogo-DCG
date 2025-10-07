import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import categoryMappingService from '../services/categoryMappingService'

const DynamicNavbar = () => {
  const location = useLocation()
  
  // Determinar la sección actual y la URL base
  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')
  const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
  
  // Colores según la sección
  const colors = isVeterinarios ? {
    bg: 'from-blue-700 to-blue-600',
    hover: 'hover:bg-white/20',
    separator: 'bg-white/30'
  } : {
    bg: 'from-orange-700 to-orange-600',
    hover: 'hover:bg-white/20',
    separator: 'bg-white/30'
  }

  return (
    <div className={`bg-gradient-to-r ${colors.bg} text-white shadow-lg`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center space-x-2 py-4 overflow-x-auto">
          {/* Enlaces principales */}
          <Link 
            to="/veterinarios" 
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap ${
              isVeterinarios ? 'bg-white/20' : ''
            }`}
          >
            VETERINARIOS
          </Link>
          <Link 
            to="/petshops" 
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap ${
              isPetShops ? 'bg-white/20' : ''
            }`}
          >
            PET SHOPS
          </Link>
          
          {/* Separador */}
          <div className={`w-px h-8 ${colors.separator} mx-2`}></div>
          
          {/* Categorías de productos específicas para la sección actual */}
          {(isPetShops ? categoryMappingService.getNavbarCategoriesForPetShops() : categoryMappingService.getNavbarCategories()).map(category => (
            <Link
              key={category.id}
              to={`${baseUrl}?category=${category.id}`}
              className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
            >
              {category.name}
            </Link>
          ))}
          
          {/* Enlaces adicionales */}
          <div className={`w-px h-8 ${colors.separator} mx-2`}></div>
          <Link 
            to="/contacto" 
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
          >
            CONTACTO
          </Link>
          <Link 
            to="/admin" 
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 ml-auto bg-white/10 whitespace-nowrap`}
          >
            ADMIN
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default DynamicNavbar
