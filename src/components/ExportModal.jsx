import React, { useState, useEffect } from 'react'
import { X, Download, Filter, Check } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import pdfService from '../services/pdfService'

const ExportModal = ({ isOpen, onClose }) => {
  const { products, filters, setCategory, setSubcategory, setNavbarCategory, clearFilters } = useProducts()
  const [selectedFilters, setSelectedFilters] = useState({
    navbarCategory: '',
    categories: [], // Array para múltiples categorías
    subcategories: [] // Array para múltiples subcategorías
  })
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isExporting, setIsExporting] = useState(false)

  // Obtener opciones únicas para filtros
  // Obtener categorías y subcategorías únicas ordenadas alfabéticamente
  const navbarCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort()
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort()
  const subcategories = [...new Set(products.map(p => p.subcategory).filter(Boolean))].sort()

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let filtered = [...products]

    // Filtro por categoría principal (navbar)
    if (selectedFilters.navbarCategory) {
      filtered = filtered.filter(p => p.category === selectedFilters.navbarCategory)
    }
    
    // Filtro por múltiples categorías
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(p => selectedFilters.categories.includes(p.category))
    }
    
    // Filtro por múltiples subcategorías
    if (selectedFilters.subcategories.length > 0) {
      filtered = filtered.filter(p => selectedFilters.subcategories.includes(p.subcategory))
    }

    // Filtros adicionales: excluir productos sin precio o sin stock
    filtered = filtered.filter(product => {
      // Excluir productos con precio = 0 o sin precio
      if (!product.price || product.price === 0) {
        return false
      }
      
      // Excluir productos sin stock (stock = 0 o undefined)
      if (!product.stock || product.stock === 0) {
        return false
      }
      
      return true
    })

    setFilteredProducts(filtered)
  }, [selectedFilters, products])

  // Manejar cambio de filtros
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev }
      
      if (filterType === 'navbarCategory') {
        newFilters.navbarCategory = value
        newFilters.categories = [] // Limpiar filtros dependientes
        newFilters.subcategories = []
      }
      
      return newFilters
    })
  }

  // Manejar selección múltiple de categorías
  const handleCategoryToggle = (category) => {
    setSelectedFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
      
      return {
        ...prev,
        categories: newCategories,
        navbarCategory: '', // Limpiar categoría principal si se seleccionan múltiples
        subcategories: [] // Limpiar subcategorías
      }
    })
  }

  // Manejar selección múltiple de subcategorías
  const handleSubcategoryToggle = (subcategory) => {
    setSelectedFilters(prev => {
      const newSubcategories = prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
      
      return {
        ...prev,
        subcategories: newSubcategories,
        navbarCategory: '', // Limpiar categoría principal
        categories: [] // Limpiar categorías
      }
    })
  }

  // Determinar cómo agrupar según la selección
  const determineGroupBy = (filters) => {
    // Si se seleccionaron múltiples categorías, agrupar por categoría
    if (filters.categories.length > 0) {
      return 'category'
    }
    
    // Si se seleccionaron múltiples subcategorías, agrupar por subcategoría
    if (filters.subcategories.length > 0) {
      return 'subcategory'
    }
    
    // Si se seleccionó una categoría principal, agrupar por categoría
    if (filters.navbarCategory) {
      return 'category'
    }
    
    // Por defecto, agrupar por categoría
    return 'category'
  }

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setSelectedFilters({
      navbarCategory: '',
      categories: [],
      subcategories: []
    })
  }

  // Manejar exportación
  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      if (filteredProducts.length === 0) {
        alert('No hay productos filtrados para exportar. Selecciona algunos filtros.')
        return
      }

      // Configuración del PDF
      const pdfConfig = {
        includeSuggestedPrice: true,
        companyName: 'DCG Veterinaria',
        companyLogo: true,
        groupBy: determineGroupBy(selectedFilters) // Determinar cómo agrupar
      }

      // Generar PDF con los productos filtrados
      await pdfService.generatePriceList(filteredProducts, pdfConfig)
      
      console.log('✅ PDF exportado exitosamente')
      onClose() // Cerrar modal después de exportar
      
    } catch (error) {
      console.error('❌ Error exportando PDF:', error)
      alert('Error al generar el PDF. Intenta nuevamente.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Download className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Exportar Lista de Precios</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Información */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Total de productos disponibles:</strong> {products.length}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Productos filtrados:</strong> {filteredProducts.length}
            </p>
          </div>

          {/* Filtros */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Seleccionar Filtros
              </h3>
              
              {/* Categoría Principal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría Principal
                </label>
                <select
                  value={selectedFilters.navbarCategory}
                  onChange={(e) => handleFilterChange('navbarCategory', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {navbarCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Múltiples Categorías/Marcas */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Marcas/Laboratorios (múltiple)
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        disabled={selectedFilters.navbarCategory !== ''}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                {selectedFilters.categories.length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    Seleccionadas: {selectedFilters.categories.join(', ')}
                  </div>
                )}
              </div>

              {/* Múltiples Subcategorías */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Subcategorías (múltiple)
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                  {subcategories.map(subcategory => (
                    <label key={subcategory} className="flex items-center space-x-2 py-1 hover:bg-gray-100 rounded px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.subcategories.includes(subcategory)}
                        onChange={() => handleSubcategoryToggle(subcategory)}
                        disabled={selectedFilters.categories.length > 0}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subcategory}</span>
                    </label>
                  ))}
                </div>
                {selectedFilters.subcategories.length > 0 && (
                  <div className="mt-2 text-xs text-blue-600">
                    Seleccionadas: {selectedFilters.subcategories.join(', ')}
                  </div>
                )}
              </div>

              {/* Botones de selección rápida */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selección Rápida
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedFilters(prev => ({
                        ...prev,
                        categories: categories.slice(0, 3), // Primeras 3 categorías
                        navbarCategory: '',
                        subcategories: []
                      }))
                    }}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition-colors"
                  >
                    Top 3 Marcas
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilters(prev => ({
                        ...prev,
                        categories: categories, // Todas las categorías
                        navbarCategory: '',
                        subcategories: []
                      }))
                    }}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs font-medium transition-colors"
                  >
                    Todas las Marcas
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilters(prev => ({
                        ...prev,
                        subcategories: subcategories.slice(0, 5), // Primeras 5 subcategorías
                        navbarCategory: '',
                        categories: []
                      }))
                    }}
                    className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs font-medium transition-colors"
                  >
                    Top 5 Subcategorías
                  </button>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {(selectedFilters.navbarCategory || selectedFilters.categories.length > 0 || selectedFilters.subcategories.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>

            {/* Vista previa de productos */}
            {filteredProducts.length > 0 && (
              <div>
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Filtros automáticos aplicados:</strong> Se excluyen automáticamente productos sin precio (precio = 0) y productos sin stock (stock = 0).
                  </p>
                </div>
                <h3 className="text-lg font-semibold mb-3">Vista Previa</h3>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Producto</th>
                        <th className="px-3 py-2 text-left">Categoría</th>
                        <th className="px-3 py-2 text-right">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.slice(0, 10).map((product, index) => (
                        <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2">{product.name}</td>
                          <td className="px-3 py-2">{product.category}</td>
                          <td className="px-3 py-2 text-right">
                            {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              minimumFractionDigits: 0
                            }).format(product.price || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length > 10 && (
                    <div className="px-3 py-2 text-sm text-gray-500 bg-gray-50">
                      ... y {filteredProducts.length - 10} productos más
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredProducts.length > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ {filteredProducts.length} productos listos para exportar
              </span>
            ) : (
              <span className="text-red-600">
                No hay productos disponibles (recuerda que se excluyen productos sin precio o sin stock)
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || filteredProducts.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Exportar PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
