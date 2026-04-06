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
    <div className={`bg-gradient-to-r ${colors.bg} text-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative z-50`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Versión Desktop - Navegación horizontal */}
        <nav className="hidden lg:flex items-center space-x-1 py-4 overflow-x-auto scrollbar-hide">
          {isAdmin ? (
            <>
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
            </>
          ) : (
            <>
              {/* Botón de categorías con menú desplegable */}
              <div className="relative" data-category-area>
                <button
                  onClick={() => setIsDesktopCategoriesOpen(!isDesktopCategoriesOpen)}
                  className={`${colors.hover} px-5 py-3 rounded-2xl transition-all duration-300 font-bold text-sm tracking-tight flex items-center gap-2 whitespace-nowrap bg-white/5 border border-white/5 hover:border-white/20`}
                >
                  <Menu className="w-4 h-4" />
                  EXPLORAR CATEGORÍAS
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDesktopCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Menú desplegable Estilo Mega Menu */}
                {isDesktopCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-3 bg-white text-gray-900 shadow-2xl rounded-3xl border border-gray-100 p-6 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="mb-4">
                       <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Categorías principales</h3>
                       <div className="space-y-1">
                        {(isPetShops ? categoryMappingService.getNavbarCategoriesForPetShops() : categoryMappingService.getNavbarCategories()).map((category) => (
                          <Link
                            key={category.id}
                            to={`${baseUrl}?category=${category.id}`}
                            onClick={() => {
                              handleNavbarClick(`CATEGORIA: ${category.name}`)
                              setIsDesktopCategoriesOpen(false)
                            }}
                            className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-blue-600 font-bold text-sm transition-all group"
                          >
                            <span>{category.name}</span>
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-50">
                      <Link
                        to={baseUrl}
                        onClick={() => {
                          handleNavbarClick('VER TODOS')
                          setIsDesktopCategoriesOpen(false)
                        }}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isPetShops ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold'}`}
                      >
                        Ver todo el catálogo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1 pl-4">
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
            </>
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
