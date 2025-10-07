import React from 'react'
import { useProducts } from '../context/ProductContext'
import categoryMappingService from '../services/categoryMappingService'

const FilterSidebar = () => {
  const { 
    filteredProducts, 
    filters, 
    setCategory, 
    setSubcategory, 
    setNavbarCategory,
    clearFilters 
  } = useProducts()

  // Función para formatear texto a título (primera letra mayúscula, resto minúsculas)
  const formatToTitle = (text) => {
    if (!text) return ''
    return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  // Obtener productos filtrados por categoría navbar si está activa
  const getFilteredProductsForSidebar = () => {
    let products = filteredProducts
    
    // Si hay una categoría navbar activa, filtrar por esa categoría primero
    if (filters.navbarCategory) {
      products = categoryMappingService.filterProductsByNavbarCategory(products, filters.navbarCategory)
    }
    
    return products
  }

  const sidebarProducts = getFilteredProductsForSidebar()

  // Obtener categorías únicas de los productos filtrados del sidebar
  const categories = [...new Set(sidebarProducts.map(p => p.category).filter(Boolean))]
  const subcategories = [...new Set(sidebarProducts.map(p => p.subcategory).filter(Boolean))]

  // Contar productos por categoría
  const getCategoryCount = (category) => {
    return sidebarProducts.filter(p => p.category === category).length
  }

  // Contar productos por subcategoría
  const getSubcategoryCount = (subcategory) => {
    return sidebarProducts.filter(p => p.subcategory === subcategory).length
  }

  // Obtener estadísticas de categorías navbar
  const navbarStats = categoryMappingService.getCategoryStats(sidebarProducts)
  const navbarCategories = categoryMappingService.getNavbarCategories()

  return (
    <div className="w-80 bg-gray-900 text-white p-6 h-screen overflow-y-auto hidden lg:block">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Filtros</h2>
        
        {/* Botón limpiar filtros */}
        {(filters.category || filters.subcategory) && (
          <button
            onClick={clearFilters}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-4"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Categorías Navbar */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-300">Categorías</h3>
        <div className="space-y-2">
          {navbarCategories.map(category => {
            const isActive = filters.navbarCategory === category.id
            const count = navbarStats[category.id]?.count || 0
            
            return (
              <button
                key={category.id}
                onClick={() => setNavbarCategory(category.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{formatToTitle(category.name)}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    isActive ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Marcas/Laboratorios */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-300">Marcas</h3>
        <div className="space-y-2">
          {categories.map(category => {
            const isActive = filters.category === category
            const count = getCategoryCount(category)
            
            return (
              <button
                key={category}
                onClick={() => setCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{formatToTitle(category)}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    isActive ? 'bg-blue-500' : 'bg-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Subcategorías */}
      {subcategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Subcategorías</h3>
          <div className="space-y-2">
            {subcategories.map(subcategory => {
              const isActive = filters.subcategory === subcategory
              const count = getSubcategoryCount(subcategory)
              
              return (
                <button
                  key={subcategory}
                  onClick={() => setSubcategory(subcategory)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-600 text-white font-medium' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{formatToTitle(subcategory)}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      isActive ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      {count}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Información de productos */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400">
          <div className="flex justify-between mb-2">
            <span>Total productos:</span>
            <span className="font-semibold text-white">{filteredProducts.length}</span>
          </div>
          {filters.navbarCategory && (
            <div className="flex justify-between mb-2">
              <span>Categoría Navbar:</span>
              <span className="font-semibold text-blue-400">{formatToTitle(filters.navbarCategory)}</span>
            </div>
          )}
          {filters.category && (
            <div className="flex justify-between mb-2">
              <span>Categoría:</span>
              <span className="font-semibold text-blue-400">{formatToTitle(filters.category)}</span>
            </div>
          )}
          {filters.subcategory && (
            <div className="flex justify-between">
              <span>Subcategoría:</span>
              <span className="font-semibold text-green-400">{formatToTitle(filters.subcategory)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar
