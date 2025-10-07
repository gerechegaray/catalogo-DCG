import React from 'react'
import { useProducts } from '../context/ProductContext'
import cacheService from '../services/cacheService'
import categoryMappingService from '../services/categoryMappingService'

const ProductDebug = () => {
  const { products, filteredProducts, reloadProducts } = useProducts()

  const handleClearCache = async () => {
    if (window.confirm('¿Limpiar cache y recargar desde Alegra?')) {
      try {
        await cacheService.clearAll()
        await reloadProducts()
        alert('Cache limpiado y productos recargados')
      } catch (error) {
        console.error('Error:', error)
        alert('Error al limpiar cache: ' + error.message)
      }
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <strong>Debug:</strong> No hay productos cargados
        <button 
          onClick={handleClearCache}
          className="ml-4 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
        >
          Recargar desde Alegra
        </button>
      </div>
    )
  }

  // Mostrar estadísticas
  const vetProducts = products.filter(p => p.userType === 'vet')
  const petProducts = products.filter(p => p.userType === 'pet')
  
  // Productos que tienen lista "pet" (visibles para pet shops)
  const petListProducts = products.filter(p => {
    // Buscar en priceLists directo
    if (p.priceLists && Array.isArray(p.priceLists)) {
      const hasPet = p.priceLists.some(price => 
        price.name && price.name.toLowerCase().includes('pet')
      )
      if (hasPet) return true
    }
    
    // Buscar en originalData.priceLists
    if (p.originalData && p.originalData.priceLists) {
      const hasPet = p.originalData.priceLists.some(price => 
        price.name && price.name.toLowerCase().includes('pet')
      )
      if (hasPet) return true
    }
    
    return false
  })
  
  // Productos que tienen lista "General" (visibles para veterinarios)
  const generalListProducts = products.filter(p => {
    // Buscar en priceLists directo
    if (p.priceLists && Array.isArray(p.priceLists)) {
      const hasGeneral = p.priceLists.some(price => 
        price.name && price.name.toLowerCase().includes('general')
      )
      if (hasGeneral) return true
    }
    
    // Buscar en originalData.priceLists
    if (p.originalData && p.originalData.priceLists) {
      const hasGeneral = p.originalData.priceLists.some(price => 
        price.name && price.name.toLowerCase().includes('general')
      )
      if (hasGeneral) return true
    }
    
    return false
  })
  
  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const subcategories = [...new Set(products.map(p => p.subcategory).filter(Boolean))]

  // Estadísticas por categoría de navbar
  const navbarStats = categoryMappingService.getCategoryStats(products)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-800">🔍 Debug de Productos</h3>
        <button 
          onClick={handleClearCache}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
        >
          🗑️ Limpiar Cache
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        {/* Estadísticas generales */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-700 mb-2">📊 Distribución por Listas</h4>
          <ul className="space-y-1 text-gray-600">
            <li>Total productos: <span className="font-semibold">{products.length}</span></li>
            <li>Con lista "General": <span className="font-semibold text-blue-600">{generalListProducts.length}</span></li>
            <li>Con lista "pet": <span className="font-semibold text-green-600">{petListProducts.length}</span></li>
            <li>Veterinarios ven: <span className="font-semibold text-blue-600">{products.length}</span></li>
            <li>Pet Shops ven: <span className="font-semibold text-green-600">{petListProducts.length}</span></li>
            <li>Filtrados: <span className="font-semibold">{filteredProducts.length}</span></li>
          </ul>
        </div>

        {/* Categorías */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-700 mb-2">🏷️ Marcas/Laboratorios</h4>
          <div className="max-h-32 overflow-y-auto">
            {categories.slice(0, 10).map((cat, index) => (
              <div key={index} className="text-xs text-gray-600 py-1">
                {cat}
              </div>
            ))}
            {categories.length > 10 && (
              <div className="text-xs text-gray-500 italic">
                +{categories.length - 10} más...
              </div>
            )}
          </div>
        </div>

        {/* Subcategorías */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-700 mb-2">📂 Subcategorías</h4>
          <div className="max-h-32 overflow-y-auto">
            {subcategories.slice(0, 10).map((subcat, index) => (
              <div key={index} className="text-xs text-gray-600 py-1">
                {subcat}
              </div>
            ))}
            {subcategories.length > 10 && (
              <div className="text-xs text-gray-500 italic">
                +{subcategories.length - 10} más...
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas por categoría de navbar */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-700 mb-2">📂 Categorías Navbar</h4>
          <div className="space-y-1 text-gray-600">
            {Object.entries(navbarStats).map(([categoryId, stats]) => (
              <div key={categoryId} className="flex justify-between items-center">
                <span className="text-xs">{stats.name}:</span>
                <span className="font-semibold text-blue-600">{stats.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ejemplo de producto */}
      {products.length > 0 && (
        <div className="mt-4 bg-white p-3 rounded border">
          <h4 className="font-semibold text-gray-700 mb-2">📦 Ejemplo de Producto</h4>
          <div className="text-sm text-gray-600">
            <div><strong>Nombre:</strong> {products[0].name}</div>
            <div><strong>Marca:</strong> {products[0].description}</div>
            <div><strong>Subcategoría:</strong> {products[0].subcategory}</div>
            <div><strong>Tipo:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                products[0].userType === 'vet' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {products[0].userType === 'vet' ? 'Veterinarios' : 'Pet Shops'}
              </span>
            </div>
            <div><strong>Precio:</strong> ${products[0].price}</div>
            <div><strong>Stock:</strong> {products[0].stock}</div>
            <div><strong>Código:</strong> {products[0].code}</div>
            <div><strong>Imagen:</strong> {products[0].image ? '✅' : '❌'}</div>
            <div><strong>PriceLists:</strong> {products[0].priceLists ? `✅ (${products[0].priceLists.length})` : '❌'}</div>
            <div><strong>OriginalData:</strong> {products[0].originalData ? '✅' : '❌'}</div>
          </div>
          
          {/* Información de estructura de datos */}
          <div className="mt-3 bg-yellow-50 p-2 rounded border">
            <h5 className="font-semibold text-yellow-800 mb-2">🔍 Estructura de Datos</h5>
            <div className="text-xs text-yellow-700">
              <div>• priceLists: {products[0].priceLists ? 'Disponible' : 'No disponible'}</div>
              <div>• originalData: {products[0].originalData ? 'Disponible' : 'No disponible'}</div>
              {products[0].priceLists && (
                <div>• Listas de precios: {products[0].priceLists.map(p => p.name).join(', ')}</div>
              )}
            </div>
          </div>
          
          {/* Datos originales para debug */}
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
              Ver datos originales
            </summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(products[0].originalData, null, 2)}
            </pre>
          </details>
          
          {/* PriceLists para debug */}
          {products[0].priceLists && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                Ver priceLists
              </summary>
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                {JSON.stringify(products[0].priceLists, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductDebug