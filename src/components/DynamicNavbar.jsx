import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Plus } from 'lucide-react'
import categoryMappingService from '../services/categoryMappingService'
import { useProducts } from '../context/ProductContext'

const DynamicNavbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { recordNavbarClick } = useProducts()
  
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
    <div className={`bg-gradient-to-r ${colors.bg} text-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative z-50`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Versión Desktop - Navegación horizontal */}
        <nav className="hidden lg:flex items-center py-2 overflow-x-auto scrollbar-hide">
          {isAdmin ? (
            <div className="flex items-center space-x-1 w-full">
              {/* Admin solo muestra VETERINARIOS, PET SHOPS y ADMIN */}
              <Link 
                to="/veterinarios" 
                onClick={() => handleNavbarClick('VETERINARIOS')}
                className={`${colors.hover} px-5 py-3 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight active:scale-95 whitespace-nowrap`}
              >
                VETERINARIOS
              </Link>
              <Link 
                to="/petshops" 
                onClick={() => handleNavbarClick('PET SHOPS')}
                className={`${colors.hover} px-5 py-3 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight active:scale-95 whitespace-nowrap`}
              >
                PET SHOPS
              </Link>
              <Link 
                to="/admin" 
                onClick={() => handleNavbarClick('ADMIN')}
                className={`${colors.hover} px-5 py-3 rounded-2xl transition-all duration-300 font-black text-sm tracking-widest ml-auto bg-white/20 whitespace-nowrap shadow-sm border border-white/10`}
              >
                ADMIN
              </Link>
            </div>
          ) : (
            <div className="flex items-center w-full">
              {/* Categorías Directas en el Escritorio */}
              <div className="flex items-center space-x-1">
                {(isPetShops ? categoryMappingService.getNavbarCategoriesForPetShops() : categoryMappingService.getNavbarCategories()).map((category) => (
                  <Link
                    key={category.id}
                    to={`${baseUrl}?category=${category.id}`}
                    onClick={() => handleNavbarClick(`CATEGORIA: ${category.name}`)}
                    className={`${colors.hover} px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-[13px] uppercase tracking-wide whitespace-nowrap active:scale-95`}
                  >
                    {category.name}
                  </Link>
                ))}
                
                {/* Botón Ver Todo */}
                <Link
                  to={baseUrl}
                  onClick={() => handleNavbarClick('VER TODOS')}
                  className={`${colors.hover} px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-[13px] uppercase tracking-wide whitespace-nowrap active:scale-95 border border-transparent hover:border-white/10`}
                >
                  VER TODO EL CATÁLOGO
                </Link>
              </div>
              
              {/* Espaciador y Enlaces Adicionales */}
              <div className="flex items-center space-x-1 ml-auto pl-4">
                <Link 
                  to="/contacto" 
                  onClick={() => handleNavbarClick('CONTACTO')}
                  className={`${colors.hover} px-5 py-3 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight active:scale-95 whitespace-nowrap`}
                >
                  CONTACTO
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
                    className="bg-white/20 hover:bg-white/30 px-5 py-3 rounded-2xl transition-all duration-300 font-black text-sm tracking-tight active:scale-95 whitespace-nowrap shadow-sm border border-white/10"
                  >
                    LISTA AL PÚBLICO
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Versión Mobile - Menú desplegable */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-3 px-1">
            {isAdmin ? (
              <>
                <div className="flex bg-white/10 p-1 rounded-2xl">
                  <Link 
                    to="/veterinarios" 
                    onClick={() => handleNavbarClick('VETERINARIOS')}
                    className={`${colors.hover} px-4 py-2.5 rounded-xl transition-all duration-300 font-black text-xs tracking-tighter`}
                  >
                    VET
                  </Link>
                  <Link 
                    to="/petshops" 
                    onClick={() => handleNavbarClick('PET SHOPS')}
                    className={`${colors.hover} px-4 py-2.5 rounded-xl transition-all duration-300 font-black text-xs tracking-tighter`}
                  >
                    PETS
                  </Link>
                </div>
                <Link 
                  to="/admin" 
                  onClick={() => handleNavbarClick('ADMIN')}
                  className="bg-white/30 px-4 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] tracking-[0.2em] uppercase border border-white/20"
                >
                  ADMIN
                </Link>
              </>
            ) : (
              <>
                {/* Botón de menú desplegable */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="bg-white/10 px-4 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] tracking-widest flex items-center gap-2 border border-white/10"
                >
                  <Menu className="w-4 h-4" />
                  CATEGORÍAS
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center gap-2">
                  <Link 
                    to="/contacto" 
                    onClick={() => handleNavbarClick('CONTACTO')}
                    className="px-3 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs"
                  >
                    CONTACTO
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
                      className="bg-white/20 px-3 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] tracking-tighter"
                    >
                      LISTA
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Menú desplegable Mobile */}
          {isMobileMenuOpen && !isAdmin && (
            <div className="bg-white text-gray-900 rounded-3xl p-5 mb-4 mx-1 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="mb-4 flex items-center justify-between px-2">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Explorar catálogo</h3>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400"><X className="w-4 h-4" /></button>
               </div>
              <div className="grid grid-cols-2 gap-2">
                {(isPetShops ? categoryMappingService.getNavbarCategoriesForPetShops() : categoryMappingService.getNavbarCategories()).map(category => (
                  <Link
                    key={category.id}
                    to={`${baseUrl}?category=${category.id}`}
                    onClick={() => {
                      handleNavbarClick(`CATEGORIA: ${category.name}`)
                      setIsMobileMenuOpen(false)
                    }}
                    className="bg-gray-50 hover:bg-blue-50 px-3 py-4 rounded-2xl transition-all duration-300 font-bold text-center text-xs tracking-tight text-gray-700 hover:text-blue-600 border border-gray-100 active:scale-95"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to={baseUrl}
                  onClick={() => {
                    handleNavbarClick('VER TODOS')
                    setIsMobileMenuOpen(false)
                  }}
                  className={`col-span-2 mt-2 px-3 py-4 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest text-center shadow-sm ${isPetShops ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'}`}
                >
                  Ver todo el catálogo
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DynamicNavbar
