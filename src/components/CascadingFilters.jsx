import React, { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import cascadingFiltersService from '../services/cascadingFiltersService'

const CascadingFilters = ({ section = 'veterinarios', selectedPath = [], onPathChange, products = [] }) => {
  const { filteredProducts, filters, setNavbarCategory, clearFilters } = useProducts()

  // Usar los productos pasados como prop, o filteredProducts como fallback
  const productsToUse = products.length > 0 ? products : filteredProducts

  // Función para formatear texto a título (primera letra mayúscula, resto minúsculas)
  const formatToTitle = (text) => {
    if (!text) return ''
    return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  // Obtener opciones del nivel actual
  const getCurrentOptions = () => {
    return cascadingFiltersService.getCurrentLevelOptions(section, selectedPath, productsToUse)
  }

  // Obtener conteos para las opciones actuales
  const getCurrentCounts = () => {
    return cascadingFiltersService.countProductsInLevel(section, selectedPath, productsToUse)
  }

  // Manejar selección de filtro
  const handleFilterSelect = (filter) => {
    const newPath = [...selectedPath, filter]
    if (onPathChange) {
      onPathChange(newPath)
    }
  }

  // Volver al nivel anterior
  const goBack = () => {
    if (selectedPath.length > 0) {
      const newPath = selectedPath.slice(0, -1)
      if (onPathChange) {
        onPathChange(newPath)
      }
    }
  }

  // Limpiar todos los filtros
  const handleClearAll = () => {
    if (onPathChange) {
      onPathChange([])
    }
    clearFilters()
  }

  // Obtener opciones y conteos actuales
  const currentOptions = getCurrentOptions()
  const currentCounts = getCurrentCounts()

  if (!currentOptions) {
    return (
      <div className="w-80 bg-gray-900 text-white p-6 h-screen overflow-y-auto hidden lg:block">
        <div className="text-center text-gray-400">
          <p>No hay más opciones disponibles</p>
          <button
            onClick={goBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gray-900 text-white p-6 h-screen overflow-y-auto hidden lg:block">
      {/* Header con navegación */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Filtros</h2>
          {selectedPath.length > 0 && (
            <button
              onClick={goBack}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          )}
        </div>
        
        {/* Ruta actual */}
        <div className="text-sm text-gray-400 mb-4">
          {cascadingFiltersService.getPathString(selectedPath)}
        </div>
        
        {/* Botón limpiar filtros */}
        {(selectedPath.length > 0 || filters.category || filters.subcategory) && (
          <button
            onClick={handleClearAll}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-4"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Opciones del nivel actual */}
      <div className="space-y-2">
        {currentOptions.map(option => {
          const count = currentCounts[option] || 0
          const isActive = selectedPath[selectedPath.length] === option
          
          return (
            <button
              key={option}
              onClick={() => handleFilterSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{formatToTitle(option)}</span>
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

      {/* Información de productos */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400">
          <div className="flex justify-between mb-2">
            <span>Total productos:</span>
            <span className="font-semibold text-white">{filteredProducts.length}</span>
          </div>
          {selectedPath.length > 0 && (
            <div className="flex justify-between mb-2">
              <span>Filtro activo:</span>
              <span className="font-semibold text-blue-400">
                {formatToTitle(selectedPath[selectedPath.length - 1])}
              </span>
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

export default CascadingFilters
