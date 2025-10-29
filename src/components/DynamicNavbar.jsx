import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import categoryMappingService from '../services/categoryMappingService'
import { useProducts } from '../context/ProductContext'

const DynamicNavbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false)
  const { recordNavbarClick } = useProducts()
  
  // Cerrar el menú desplegable al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el click fue fuera de los botones de categoría
      if (!event.target.closest('[data-category-area]')) {
        setIsDesktopCategoriesOpen(false)
      }
    }
    
    if (isDesktopCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDesktopCategoriesOpen])
  
  // Determinar la sección actual y la URL base
  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')
  const isAdmin = location.pathname.startsWith('/admin')
  const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
  
  // Función para manejar clicks en navbar con contexto específico
  const handleNavbarClick = (linkName) => {
    const contextPrefix = isAdmin ? 'Admin' : isVeterinarios ? 'Veterinarios' : 'PetShops'
    const fullLinkName = `${contextPrefix} - ${linkName}`
    recordNavbarClick(fullLinkName)
  }
  
  // Colores según la sección
  const colors = isAdmin ? {
    bg: 'from-green-800 to-green-700',
    hover: 'hover:bg-white/20',
    separator: 'bg-white/30'
  } : isVeterinarios ? {
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
          {isAdmin ? (
            <>
              {/* Admin solo muestra VETERINARIOS, PET SHOPS y ADMIN */}
              <Link 
                to="/veterinarios" 
                onClick={() => handleNavbarClick('VETERINARIOS')}
                className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
              >
                VETERINARIOS
              </Link>
              <Link 
                to="/petshops" 
                onClick={() => handleNavbarClick('PET SHOPS')}
                className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
              >
                PET SHOPS
              </Link>
              <Link 
                to="/admin" 
                onClick={() => handleNavbarClick('ADMIN')}
                className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 ml-auto bg-white/10 whitespace-nowrap bg-white/20`}
              >
                ADMIN
              </Link>
            </>
          ) : (
            <>
              {/* Botón de categorías con menú desplegable */}
              <button
                onClick={() => setIsDesktopCategoriesOpen(!isDesktopCategoriesOpen)}
                className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center gap-2 whitespace-nowrap`}
                data-category-area
              >
                CATEGORÍAS
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDesktopCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Botones de categorías que se expanden en la navbar */}
              {isDesktopCategoriesOpen && (
                <div data-category-area>
                  {/* Categorías como botones inline */}
                  {(isPetShops ? categoryMappingService.getNavbarCategoriesForPetShops() : categoryMappingService.getNavbarCategories()).map((category, index) => (
                    <Link
                      key={category.id}
                      to={`${baseUrl}?category=${category.id}`}
                      onClick={() => {
                        handleNavbarClick(`CATEGORIA: ${category.name}`)
                        setIsDesktopCategoriesOpen(false)
                      }}
                      className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
                    >
                      {category.name}
                    </Link>
                  ))}
                  
                  {/* Botón Ver Todos al final */}
                  <Link
                    to={baseUrl}
                    onClick={() => {
                      handleNavbarClick('VER TODOS')
                      setIsDesktopCategoriesOpen(false)
                    }}
                    className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
                  >
                    VER TODOS
                  </Link>
                </div>
              )}
              
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
                to="/client/login" 
                onClick={() => handleNavbarClick('PORTAL CLIENTE')}
                className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
              >
                PORTAL CLIENTE
              </Link>
              
              {isPetShops && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    if (window.confirm('Estás a punto de acceder a la lista de alimentos con precios sugeridos al público. ¿Deseas continuar?')) {
                      handleNavbarClick('LISTA AL PÚBLICO')
                      window.location.href = '/publico'
                    }
                  }}
                  className={`${colors.hover} px-4 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 whitespace-nowrap`}
                >
                  LISTA AL PÚBLICO
                </button>
              )}
            </>
          )}
        </nav>

        {/* Versión Mobile - Menú desplegable */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-3 px-1">
            {isAdmin ? (
              <>
                {/* Admin solo muestra VETERINARIOS, PET SHOPS y ADMIN */}
                <div className="flex space-x-1">
                  <Link 
                    to="/veterinarios" 
                    onClick={() => handleNavbarClick('VETERINARIOS')}
                    className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-sm`}
                  >
                    VET
                  </Link>
                  <Link 
                    to="/petshops" 
                    onClick={() => handleNavbarClick('PET SHOPS')}
                    className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-sm`}
                  >
                    PETS
                  </Link>
                </div>
                <Link 
                  to="/admin" 
                  onClick={() => handleNavbarClick('ADMIN')}
                  className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-xs bg-white/10`}
                >
                  ADMIN
                </Link>
              </>
            ) : (
              <>
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
                    to="/client/login" 
                    onClick={() => handleNavbarClick('PORTAL CLIENTE')}
                    className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-xs`}
                  >
                    CLIENTE
                  </Link>
                  
                  {isPetShops && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (window.confirm('Estás a punto de acceder a la lista de alimentos con precios sugeridos al público. ¿Deseas continuar?')) {
                          handleNavbarClick('LISTA AL PÚBLICO')
                          window.location.href = '/publico'
                        }
                      }}
                      className={`${colors.hover} px-2 py-2 rounded-lg transition-all duration-300 font-semibold text-xs`}
                    >
                      LISTA
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Menú desplegable */}
          {isMobileMenuOpen && !isAdmin && (
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
