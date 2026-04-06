import React, { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import cascadingFiltersService from '../services/cascadingFiltersService'
import { X } from 'lucide-react'
import { formatToTitle } from '../utils/textUtils'

const CascadingFilters = ({ section = 'veterinarios', selectedPath = [], onPathChange, products = [] }) => {
  const { filteredProducts, filters, setNavbarCategory, clearFilters } = useProducts()

  // Usar los productos pasados como prop, o filteredProducts como fallback
  const productsToUse = products.length > 0 ? products : filteredProducts

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
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Categorías</h2>
          {selectedPath.length > 0 && (
            <button
              onClick={goBack}
              className="group flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          )}
        </div>
        
        {/* Ruta actual / Breadcrumbs */}
        {selectedPath.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 border border-gray-100 p-3 rounded-2xl mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
               </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Sección</p>
              <span className="text-sm font-bold text-gray-700 truncate block leading-none">
                {cascadingFiltersService.getPathString(selectedPath)}
              </span>
            </div>
          </div>
        )}
        
        {/* Botón limpiar filtros */}
        {(selectedPath.length > 0 || filters.category || filters.subcategory) && (
          <button
            onClick={handleClearAll}
            className="w-full bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-100 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all mb-6 flex items-center justify-center gap-2 shadow-sm active:scale-95"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Etiqueta del nivel actual */}
      {isLabLevel && (
        <div className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] text-purple-700 bg-purple-50 px-4 py-3 rounded-xl border border-purple-100/50 shadow-sm shadow-purple-100/20">
          <span className="text-base">🔬</span>
          <span>Laboratorios</span>
        </div>
      )}

      {/* Opciones del nivel actual */}
      <div className="space-y-2">
        {currentOptions.map(option => {
          const count = currentCounts[option] || 0
          const isActive = selectedPath[selectedPath.length] === option
          
          return (
            <button
              key={option}
              onClick={() => handleFilterSelect(option)}
              className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md text-gray-700 hover:text-blue-700'
              }`}
            >
              <span className={`font-bold text-sm tracking-tight transition-transform duration-300 ${isActive ? '' : 'group-hover:translate-x-1'}`}>
                {formatToTitle(option)}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors border ${
                isActive 
                  ? 'bg-blue-500/50 text-white border-blue-400' 
                  : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 border-gray-100 group-hover:border-blue-100'
              }`}>
                {count}
              </span>
              {/* Subtle accent border for inactive on hover */}
              {!isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              )}
            </button>
          )
        })}
      </div>

      {/* Información de productos */}
      <div className="mt-10 p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catálogo</span>
            <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-100 text-sm font-black text-gray-900 shadow-sm">
              {filteredProducts.length}
            </span>
          </div>
          
          {selectedPath.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Filtro aplicado</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="font-bold text-blue-600 text-sm truncate">
                  {formatToTitle(selectedPath[selectedPath.length - 1])}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CascadingFilters
