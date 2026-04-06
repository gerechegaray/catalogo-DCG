import React, { useState, useEffect } from 'react'
import { X, Download, Filter, Check, FileText, FileSpreadsheet } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import pdfService from '../services/pdfService'
import excelService from '../services/excelService'

const ExportModal = ({ isOpen, onClose }) => {
  const { products, filters, setCategory, setSubcategory, setNavbarCategory, clearFilters } = useProducts()
  const [selectedFilters, setSelectedFilters] = useState({
    navbarCategory: '',
    categories: [], // Array para múltiples categorías
    subcategories: [] // Array para múltiples subcategorías
  })
  const [exportFormat, setExportFormat] = useState('pdf') // 'pdf' o 'excel'
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

      const config = {
        includeSuggestedPrice: true,
        companyName: 'DCG Veterinaria',
        companyLogo: true,
        groupBy: determineGroupBy(selectedFilters)
      }

      if (exportFormat === 'pdf') {
        // Generar PDF
        await pdfService.generatePriceList(filteredProducts, config)
        console.log('✅ PDF exportado exitosamente')
      } else {
        // Generar Excel
        await excelService.generatePriceList(filteredProducts, config)
        console.log('✅ Excel exportado exitosamente')
      }
      
      onClose() // Cerrar modal después de exportar
      
    } catch (error) {
      console.error(`❌ Error exportando ${exportFormat.toUpperCase()}:`, error)
      alert(`Error al generar el ${exportFormat.toUpperCase()}. Intenta nuevamente.`)
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Exportar Lista de Precios</h2>
              <p className="text-xs text-gray-500 mt-0.5">Configura tu descarga personalizada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          {/* Formato de Exportación */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-300"></span>
              1. Seleccionar Formato
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 group ${
                  exportFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-white'
                }`}
              >
                {exportFormat === 'pdf' && (
                  <div className="absolute top-3 right-3 bg-blue-600 rounded-full p-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <FileText className={`w-10 h-10 mb-3 transition-colors ${exportFormat === 'pdf' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`} />
                <span className={`font-bold transition-colors ${exportFormat === 'pdf' ? 'text-blue-900' : 'text-gray-500'}`}>Formato PDF</span>
                <span className="text-[10px] text-gray-400 mt-1">Ideal para imprimir</span>
              </button>

              <button
                onClick={() => setExportFormat('excel')}
                className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 group ${
                  exportFormat === 'excel'
                    ? 'border-green-600 bg-green-50 shadow-md'
                    : 'border-gray-100 bg-gray-50 hover:border-green-200 hover:bg-white'
                }`}
              >
                {exportFormat === 'excel' && (
                  <div className="absolute top-3 right-3 bg-green-600 rounded-full p-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <FileSpreadsheet className={`w-10 h-10 mb-3 transition-colors ${exportFormat === 'excel' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-400'}`} />
                <span className={`font-bold transition-colors ${exportFormat === 'excel' ? 'text-green-900' : 'text-gray-500'}`}>Formato Excel</span>
                <span className="text-[10px] text-gray-400 mt-1">Editable en planillas</span>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-gray-300"></span>
                2. Configurar Filtros
              </h3>
              
              <div className="space-y-4">
                {/* Categoría Principal */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                    Categoría Principal
                  </label>
                  <div className="relative">
                    <select
                      value={selectedFilters.navbarCategory}
                      onChange={(e) => handleFilterChange('navbarCategory', e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium text-gray-700"
                    >
                      <option value="">Todas las categorías</option>
                      {navbarCategories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Filter className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Múltiples Categorías/Marcas */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                      Marcas/Laboratorios
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50/50 custom-scrollbar">
                      {categories.map(category => (
                        <label key={category} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-200/50 ${selectedFilters.categories.includes(category) ? 'bg-white shadow-sm' : ''}`}>
                          <input
                            type="checkbox"
                            checked={selectedFilters.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            disabled={selectedFilters.navbarCategory !== ''}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
                          />
                          <span className={`text-xs font-medium ${selectedFilters.categories.includes(category) ? 'text-blue-700' : 'text-gray-600'}`}>
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Múltiples Subcategorías */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 ml-1">
                      Subcategorías
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50/50 custom-scrollbar">
                      {subcategories.map(subcategory => (
                        <label key={subcategory} className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-200/50 ${selectedFilters.subcategories.includes(subcategory) ? 'bg-white shadow-sm' : ''}`}>
                          <input
                            type="checkbox"
                            checked={selectedFilters.subcategories.includes(subcategory)}
                            onChange={() => handleSubcategoryToggle(subcategory)}
                            disabled={selectedFilters.categories.length > 0}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30"
                          />
                          <span className={`text-xs font-medium ${selectedFilters.subcategories.includes(subcategory) ? 'text-blue-700' : 'text-gray-600'}`}>
                            {subcategory}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selección rápida */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedFilters(prev => ({
                        ...prev,
                        categories: categories.slice(0, 3),
                        navbarCategory: '',
                        subcategories: []
                      }))
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Top 3 Marcas
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilters(prev => ({
                        ...prev,
                        categories: categories,
                        navbarCategory: '',
                        subcategories: []
                      }))
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-green-100 hover:text-green-700 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    Todas las Marcas
                  </button>
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ml-auto"
                  >
                    Borrar Filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Vista previa */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider leading-none">Vista Previa</h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {filteredProducts.length} items
                </span>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-4 py-2.5 text-right font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.slice(0, 5).map((product, index) => (
                      <tr key={product.id || index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-gray-700 truncate max-w-[200px]">{product.name}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-blue-600">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(product.price || 0)}
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="2" className="px-4 py-8 text-center text-gray-400 italic">No hay productos que coincidan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 flex items-start gap-2 px-1">
                <div className="bg-gray-200 p-1 rounded-full mt-0.5">
                  <Check className="w-2.5 h-2.5 text-gray-500" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Se excluyen automáticamente productos sin precio o stock.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-grow text-center md:text-left">
              <span className={`text-sm font-bold ${filteredProducts.length > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {filteredProducts.length > 0 
                  ? `✓ ${filteredProducts.length} productos listos para exportar`
                  : '⚠ Selecciona filtros para obtener resultados'}
              </span>
              <p className="text-[11px] text-gray-400 mt-0.5">La descarga comenzará automáticamente</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={onClose}
                className="flex-1 md:flex-none px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl font-bold text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || filteredProducts.length === 0}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  exportFormat === 'excel'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100 disabled:bg-gray-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 disabled:bg-gray-200'
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Exportando...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{exportFormat === 'pdf' ? 'Exportar PDF' : 'Descargar Excel'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
}

export default ExportModal
