import React, { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'
import { getAllFeaturedProducts, addFeaturedProduct, removeFeaturedProduct } from '../services/featuredProductsService'

const FeaturedProductsManager = () => {
  const { products } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState('veterinarios')
  const [activeTab, setActiveTab] = useState('current') // 'current' or 'add'

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      const featuredData = await getAllFeaturedProducts()
      setFeaturedProducts(featuredData)
    } catch (error) {
      console.error('Error al cargar productos destacados:', error)
    } finally {
      setLoading(false)
    }
  }

  const isProductFeatured = (productId, section) => {
    return featuredProducts.some(fp => fp.productId === productId && fp.section === section)
  }

  const handleAddFeatured = async (product) => {
    try {
      const newFeaturedProduct = await addFeaturedProduct({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productPrice: product.price,
        productStock: product.stock,
        productDescription: product.description,
        productCategory: product.category,
        section: selectedSection,
        order: featuredProducts.filter(fp => fp.section === selectedSection).length + 1
      })
      setFeaturedProducts(prev => [...prev, newFeaturedProduct])
    } catch (error) {
      alert('Error al agregar destacado: ' + error.message)
    }
  }

  const handleRemoveFeatured = async (featuredId) => {
    try {
      await removeFeaturedProduct(featuredId)
      setFeaturedProducts(prev => prev.filter(fp => fp.id !== featuredId))
    } catch (error) {
      alert('Error al eliminar destacado: ' + error.message)
    }
  }

  // Featured products for the current section
  const currentFeatured = featuredProducts.filter(fp => fp.section === selectedSection)

  // Products available to add (not already featured)
  const availableProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const notFeatured = !isProductFeatured(product.id, selectedSection)
    
    if (selectedSection === 'petshops') {
      return matchesSearch && notFeatured && product.stock > 0 && 
             product.priceLists && product.priceLists.some(list => list.name === 'pet')
    }
    return matchesSearch && notFeatured && product.stock > 0
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
        <p className="text-gray-500 mt-1">Los productos destacados aparecen en la página principal del catálogo.</p>
      </div>

      {/* Selector de sección */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-200 inline-flex text-sm font-medium">
          <button
            onClick={() => setSelectedSection('veterinarios')}
            className={`px-5 py-2 rounded-md transition-colors ${selectedSection === 'veterinarios' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🐶 Veterinarias
          </button>
          <button
            onClick={() => setSelectedSection('petshops')}
            className={`px-5 py-2 rounded-md transition-colors ${selectedSection === 'petshops' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🏪 Pet Shops
          </button>
        </div>

        {/* Tabs: Actuales vs Agregar */}
        <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-200 inline-flex text-sm font-medium">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-5 py-2 rounded-md transition-colors ${activeTab === 'current' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ⭐ Actuales ({currentFeatured.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-5 py-2 rounded-md transition-colors ${activeTab === 'add' ? 'bg-white text-green-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ➕ Agregar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500 font-medium">Cargando...</div>
      ) : (
        <>
          {/* === TAB: PRODUCTOS DESTACADOS ACTUALES === */}
          {activeTab === 'current' && (
            <div>
              {currentFeatured.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-3">No hay productos destacados en esta sección.</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    ➕ Agregar Productos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentFeatured.map((fp) => {
                    // Check if the product still exists in the catalog
                    const liveProduct = products.find(p => p.id === fp.productId)
                    const hasStock = liveProduct ? liveProduct.stock > 0 : (fp.productStock > 0)
                    const currentPrice = liveProduct ? liveProduct.price : fp.productPrice

                    return (
                      <div 
                        key={fp.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          hasStock ? 'bg-white border-gray-200' : 'bg-red-50 border-red-200'
                        }`}
                      >
                        {/* Image */}
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                          {fp.productImage ? (
                            <img src={fp.productImage} alt={fp.productName} className="w-full h-full object-contain p-1" onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <span className="text-2xl">📦</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{fp.productName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-blue-600 font-bold text-sm">${currentPrice}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              hasStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {hasStock ? 'En Stock' : '⚠️ SIN STOCK'}
                            </span>
                            {fp.productCategory && (
                              <span className="text-xs text-gray-400">{fp.productCategory}</span>
                            )}
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveFeatured(fp.id)}
                          className="shrink-0 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2.5 rounded-lg transition-colors border border-red-200"
                          title="Quitar de destacados"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* === TAB: AGREGAR NUEVOS DESTACADOS === */}
          {activeTab === 'add' && (
            <div>
              {/* Búsqueda */}
              <div className="mb-5 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar producto por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {availableProducts.slice(0, 40).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleAddFeatured(product)}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer transition-all hover:border-green-400 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="h-24 bg-gray-50 rounded-lg mb-3 flex items-center justify-center p-2 border border-gray-100">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.target.style.display = 'none' }} />
                      ) : (
                        <span className="text-3xl text-gray-300">📦</span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 h-10 mb-1">{product.name}</h4>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-xs text-gray-500">{product.category}</span>
                      <span className="font-bold text-blue-600">${product.price}</span>
                    </div>
                    <div className="mt-3 text-center text-xs text-green-600 font-medium bg-green-50 py-1.5 rounded-lg border border-green-100">
                      Click para destacar ⭐
                    </div>
                  </div>
                ))}

                {availableProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    {searchTerm ? 'No se encontraron productos con ese nombre.' : 'Todos los productos ya están destacados.'}
                  </div>
                )}
              </div>

              {availableProducts.length > 40 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Mostrando los primeros 40 resultados. Usa la búsqueda para filtrar.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FeaturedProductsManager
