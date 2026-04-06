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

  // Determinar si estamos en el nivel de laboratorios
  const isLabLevel = selectedPath.length === 1 && cascadingFiltersService.hasLabLevel(section, selectedPath[0])

  // Obtener opciones y conteos actuales
  const currentOptions = getCurrentOptions()
  const currentCounts = getCurrentCounts()

  if (!currentOptions || (Array.isArray(currentOptions) && currentOptions.length === 0)) {
    return (
      <div className="w-72 bg-white border-r border-gray-200 text-gray-800 p-6 h-screen overflow-y-auto hidden lg:block sticky top-0">
        <div className="text-center text-gray-500 mt-10">
          <p>Mostrando todos los productos</p>
          <button
            onClick={goBack}
            className="mt-4 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← Volver Atrás
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 text-gray-800 p-6 h-screen overflow-y-auto hidden lg:block sticky top-0 custom-scrollbar">
      {/* Header con navegación */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Categorías</h2>
          {selectedPath.length > 0 && (
            <button
              onClick={goBack}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          )}
        </div>
        
        {/* Ruta actual */}
        {selectedPath.length > 0 && (
          <div className="text-sm font-medium text-blue-800 bg-blue-50 px-3 py-2 rounded-lg mb-4 border border-blue-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="truncate">{cascadingFiltersService.getPathString(selectedPath)}</span>
          </div>
        )}
        
        {/* Botón limpiar filtros */}
        {(selectedPath.length > 0 || filters.category || filters.subcategory) && (
          <button
            onClick={handleClearAll}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Etiqueta del nivel actual */}
      {isLabLevel && (
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-100">
          <span>🔬</span>
          <span>Filtrar por Laboratorio</span>
        </div>
      )}

      {/* Opciones del nivel actual */}
      <div className="space-y-1.5">
        {currentOptions.map(option => {
          const count = currentCounts[option] || 0
          const isActive = selectedPath[selectedPath.length] === option
          
          return (
            <button
              key={option}
              onClick={() => handleFilterSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex justify-between items-center group ${
                isActive 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm text-gray-700 hover:text-blue-700 shadow-sm'
              }`}
            >
              <span className={`font-medium ${isActive ? '' : 'group-hover:translate-x-1 transition-transform'}`}>
                {formatToTitle(option)}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isActive ? 'bg-blue-500 text-white border border-blue-400' : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Información de productos */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <div className="text-sm">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
            <span className="text-gray-600">Total productos:</span>
            <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
              {filteredProducts.length}
            </span>
          </div>
          {selectedPath.length > 0 && (
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
              <span className="text-gray-600">Filtro activo:</span>
              <span className="font-medium text-blue-600 text-right max-w-[140px] truncate">
                {formatToTitle(selectedPath[selectedPath.length - 1])}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CascadingFilters
