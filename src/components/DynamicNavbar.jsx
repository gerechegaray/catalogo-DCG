import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import categoryMappingService from '../services/categoryMappingService'
import { useProducts } from '../context/ProductContext'

const DynamicNavbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { recordNavbarClick } = useProducts()
  
  // Determinar la sección actual y la URL base
  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')
  const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
  
  // Función para manejar clicks en navbar con contexto específico
  const handleNavbarClick = (linkName) => {
    const contextPrefix = isVeterinarios ? 'Veterinarios' : 'PetShops'
    const fullLinkName = `${contextPrefix} - ${linkName}`
    recordNavbarClick(fullLinkName)
  }
  
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
    <div className={`bg-gradient-to-r ${colors.bg} text-white shadow-lg relative z-50`}>
      <div className="w-full px-2 sm:px-4">
        {/* Versión Desktop - Navegación horizontal */}
        <nav className="hidden lg:flex items-center space-x-2 py-4 overflow-x-auto scrollbar-hide">
          {/* Enlaces principales */}
          <Link 
            to="/veterinarios" 
            onClick={() => handleNavbarClick('VETERINARIOS')}
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap ${
              isVeterinarios ? 'bg-white/20' : ''
            }`}
          >
            VETERINARIOS
          </Link>
          <Link 
            to="/petshops" 
            onClick={() => handleNavbarClick('PET SHOPS')}
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
              onClick={() => handleNavbarClick(`CATEGORIA: ${category.name}`)}
              className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
            >
              {category.name}
            </Link>
          ))}
          
          {/* Enlaces adicionales */}
          <div className={`w-px h-8 ${colors.separator} mx-2`}></div>
          <Link 
            to="/contacto" 
            onClick={() => handleNavbarClick('CONTACTO')}
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
          >
            CONTACTO
          </Link>
          <Link 
            to="/admin" 
            onClick={() => handleNavbarClick('ADMIN')}
            className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 ml-auto bg-white/10 whitespace-nowrap`}
          >
            ADMIN
          </Link>
        </nav>

        {/* Versión Mobile - Menú desplegable */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-3 px-1">
            {/* Enlaces principales móvil */}
            <div className="flex space-x-1">
              <Link 
                to="/veterinarios" 
                onClick={() => handleNavbarClick('VETERINARIOS')}
                className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-sm ${
                  isVeterinarios ? 'bg-white/20' : ''
                }`}
              >
                VET
              </Link>
              <Link 
                to="/petshops" 
                onClick={() => handleNavbarClick('PET SHOPS')}
                className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-sm ${
                  isPetShops ? 'bg-white/20' : ''
                }`}
              >
                PETS
              </Link>
            </div>

            {/* Botón de menú desplegable */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${colors.hover} px-3 py-2 rounded-lg transition-all duration-300 font-semibold text-sm flex items-center gap-1`}
            >
              CATEGORÍAS
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Enlaces adicionales móvil */}
            <div className="flex space-x-1">
              <Link 
                to="/contacto" 
                onClick={() => handleNavbarClick('CONTACTO')}
                className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-xs`}
              >
                CONTACTO
              </Link>
              <Link 
                to="/admin" 
                onClick={() => handleNavbarClick('ADMIN')}
                className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-xs bg-white/10`}
              >
                ADMIN
              </Link>
            </div>
          </div>

          {/* Menú desplegable */}
          {isMobileMenuOpen && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-2 mx-1">
              <div className="grid grid-cols-1 gap-2">
                {(isPetShops ? categoryMappingService.getNavbarCategoriesForPetShops() : categoryMappingService.getNavbarCategories()).map(category => (
                  <Link
                    key={category.id}
                    to={`${baseUrl}?category=${category.id}`}
                    onClick={() => {
                      handleNavbarClick(`CATEGORIA: ${category.name}`)
                      setIsMobileMenuOpen(false)
                    }}
                    className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-all duration-300 font-semibold text-center text-sm"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DynamicNavbar
