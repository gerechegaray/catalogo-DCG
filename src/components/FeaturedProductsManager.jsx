import React, { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'
import { getAllFeaturedProducts, addFeaturedProduct, removeFeaturedProduct } from '../services/featuredProductsService'

const FeaturedProductsManager = () => {
  const { products } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState('veterinarios')

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

  const handleToggleFeatured = async (product, section) => {
    try {
      const isFeatured = isProductFeatured(product.id, section)
      
      if (isFeatured) {
        const featuredProduct = featuredProducts.find(fp => fp.productId === product.id && fp.section === section)
        if (featuredProduct) {
          await removeFeaturedProduct(featuredProduct.id)
          setFeaturedProducts(prev => prev.filter(fp => fp.id !== featuredProduct.id))
        }
      } else {
        const newFeaturedProduct = await addFeaturedProduct({
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          productPrice: product.price,
          productStock: product.stock,
          productDescription: product.description,
          productCategory: product.category,
          section: section,
          order: featuredProducts.filter(fp => fp.section === section).length + 1
        })
        setFeaturedProducts(prev => [...prev, newFeaturedProduct])
      }
    } catch (error) {
      alert('Error guardando cambios. Intenta nuevamente.');
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedSection === 'veterinarios') {
      return matchesSearch && product.stock > 0
    } else if (selectedSection === 'petshops') {
      return matchesSearch && product.stock > 0 && 
             product.priceLists && product.priceLists.some(list => list.name === 'pet')
    }
    return matchesSearch
  })

  // Mostrar destacados primero en la lista filtrada
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aFeatured = isProductFeatured(a.id, selectedSection)
    const bFeatured = isProductFeatured(b.id, selectedSection)
    if (aFeatured && !bFeatured) return -1
    if (!aFeatured && bFeatured) return 1
    return 0
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Productos Destacados</h2>
        <p className="text-gray-500 mt-1">Selecciona qué productos quieres que aparezcan al principio de la página.</p>
      </div>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre detallado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="w-full md:w-64 shrink-0 bg-white p-1 rounded-lg border border-gray-300 flex text-sm font-medium shadow-sm">
          <button
            onClick={() => setSelectedSection('veterinarios')}
            className={`flex-1 py-2 text-center rounded-md transition-colors ${selectedSection === 'veterinarios' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Veterinarias
          </button>
          <button
            onClick={() => setSelectedSection('petshops')}
            className={`flex-1 py-2 text-center rounded-md transition-colors ${selectedSection === 'petshops' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Pet Shops
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-3 items-center">
        <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded-lg font-semibold text-sm border border-blue-100">
          ⭐ Tienes {featuredProducts.filter(fp => fp.section === selectedSection).length} destacados en esta sección
        </div>
        <div className="text-sm text-gray-500">
          (Los productos marcados aparecerán automáticamente en la página principal)
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500 font-medium">Buscando productos...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sortedProducts.map((product) => {
            const isFeatured = isProductFeatured(product.id, selectedSection);
            
            return (
              <div 
                key={product.id} 
                onClick={() => handleToggleFeatured(product, selectedSection)}
                className={`relative bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-1 ${
                  isFeatured ? 'border-blue-500 shadow-md bg-blue-50/10' : 'border-gray-200 hover:border-blue-300 shadow-sm hover:shadow'
                }`}
              >
                {/* Indicador Checkbox gigante en esquina superior */}
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${
                  isFeatured ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-transparent'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>

                <div className="h-28 bg-gray-50 rounded-xl mb-3 flex items-center justify-center p-2 border border-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                  ) : null}
                  <div className={`text-gray-300 text-3xl ${product.image ? 'hidden' : 'block'}`}>📦</div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 h-10 mb-1">
                    {product.name}
                  </h4>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-xs text-gray-500 font-medium">{product.category}</p>
                    <p className="font-bold text-blue-600">${product.price}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {sortedProducts.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No se encontraron productos con ese nombre.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FeaturedProductsManager
