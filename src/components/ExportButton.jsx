import React, { useState } from 'react'
import { Download, FileText, Loader } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import ExportModal from './ExportModal'

const ExportButton = ({ className = '', variant = 'default' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { filteredProducts, filters } = useProducts()

  // Manejar apertura del modal
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  // Manejar cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Obtener información de filtros activos
  const getActiveFiltersInfo = () => {
    const activeFilters = []
    
    if (filters.navbarCategory) {
      activeFilters.push(`Categoría: ${filters.navbarCategory}`)
    }
    if (filters.category) {
      activeFilters.push(`Marca: ${filters.category}`)
    }
    if (filters.subcategory) {
      activeFilters.push(`Subcategoría: ${filters.subcategory}`)
    }
    if (filters.search) {
      activeFilters.push(`Búsqueda: "${filters.search}"`)
    }
    
    return activeFilters
  }

  // Renderizar botón según la variante
  const renderButton = () => {
    const baseClasses = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
    
    if (variant === 'sidebar') {
      return (
        <button
          onClick={handleOpenModal}
          className={`${baseClasses} w-full bg-green-600 hover:bg-green-700 text-white ${className}`}
        >
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      )
    }
    
    if (variant === 'floating') {
      return (
        <button
          onClick={handleOpenModal}
          className={`${baseClasses} fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50 ${className}`}
          title="Exportar lista de precios"
        >
          <FileText className="w-5 h-5" />
        </button>
      )
    }
    
    // Variante por defecto
    return (
      <button
        onClick={handleOpenModal}
        className={`${baseClasses} bg-blue-600 hover:bg-blue-700 text-white ${className}`}
      >
        <Download className="w-4 h-4" />
        Exportar Lista de Precios
      </button>
    )
  }

  return (
    <div className="export-button-container">
      {renderButton()}
      
      {/* Modal de exportación */}
      <ExportModal isOpen={isModalOpen} onClose={handleCloseModal} />
      
      {/* Información de productos filtrados (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500">
          <div>Productos filtrados: {filteredProducts.length}</div>
          {getActiveFiltersInfo().length > 0 && (
            <div className="mt-1">
              Filtros activos: {getActiveFiltersInfo().join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ExportButton
