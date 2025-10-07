import React, { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'
import { getAllFeaturedProducts, addFeaturedProduct, removeFeaturedProduct, saveFeaturedProductsConfig } from '../services/featuredProductsService'

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
        // Remover de destacados
        const featuredProduct = featuredProducts.find(fp => fp.productId === product.id && fp.section === section)
        if (featuredProduct) {
          await removeFeaturedProduct(featuredProduct.id)
          // Actualizar estado local inmediatamente
          setFeaturedProducts(prev => prev.filter(fp => fp.id !== featuredProduct.id))
        }
      } else {
        // Agregar a destacados
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
        // Actualizar estado local inmediatamente
        setFeaturedProducts(prev => [...prev, newFeaturedProduct])
      }
      
      // Recargar para sincronizar con Firebase
      setTimeout(() => loadFeaturedProducts(), 500)
    } catch (error) {
      console.error('Error al cambiar estado destacado:', error)
      // Recargar en caso de error para sincronizar
      await loadFeaturedProducts()
    }
  }

  const generateStaticConfig = async () => {
    try {
      const veterinariosFeatured = featuredProducts.filter(fp => fp.section === 'veterinarios')
      const petshopsFeatured = featuredProducts.filter(fp => fp.section === 'petshops')

      const config = {
        veterinarios: veterinariosFeatured.map(fp => ({
          id: fp.productId,
          name: fp.productName,
          image: fp.productImage,
          price: fp.productPrice,
          stock: fp.productStock,
          description: fp.productDescription,
          category: fp.productCategory
        })),
        petshops: petshopsFeatured.map(fp => ({
          id: fp.productId,
          name: fp.productName,
          image: fp.productImage,
          price: fp.productPrice,
          stock: fp.productStock,
          description: fp.productDescription,
          category: fp.productCategory
        }))
      }

      // Guardar en Firebase
      await saveFeaturedProductsConfig(config)
      
      alert('✅ Configuración de productos destacados guardada exitosamente')
      
    } catch (error) {
      console.error('Error al generar configuración:', error)
      alert('❌ Error al generar configuración: ' + error.message)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedSection === 'veterinarios') {
      return matchesSearch && product.stock > 0
    } else if (selectedSection === 'petshops') {
      return matchesSearch && product.stock > 0 && 
             product.priceLists && product.priceLists.some(list => list.name === 'pet')
    }
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos Destacados</h2>
        <button
          onClick={generateStaticConfig}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Aplicar Cambios
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="veterinarios">Veterinarios</option>
              <option value="petshops">Pet Shops</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">Total Productos</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredProducts.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-900">Destacados Veterinarios</h3>
          <p className="text-2xl font-bold text-green-600">
            {featuredProducts.filter(fp => fp.section === 'veterinarios').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-900">Destacados Pet Shops</h3>
          <p className="text-2xl font-bold text-purple-600">
            {featuredProducts.filter(fp => fp.section === 'petshops').length}
          </p>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  ${product.price} • Stock: {product.stock}
                </p>
                {product.category && (
                  <p className="text-xs text-blue-600 mt-1">
                    {product.category}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 ml-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isProductFeatured(product.id, 'veterinarios')}
                    onChange={() => handleToggleFeatured(product, 'veterinarios')}
                    className="mr-1"
                  />
                  <span className="text-xs text-blue-600">Vet</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isProductFeatured(product.id, 'petshops')}
                    onChange={() => handleToggleFeatured(product, 'petshops')}
                    className="mr-1"
                  />
                  <span className="text-xs text-green-600">Pet</span>
                </label>
              </div>
            </div>
            
            {product.image && (
              <div className="mb-2">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
            
            {product.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron productos que coincidan con los filtros.
        </div>
      )}
    </div>
  )
}

export default FeaturedProductsManager
