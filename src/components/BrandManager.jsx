import React, { useState, useEffect } from 'react'
import { getAllBrands, saveBrand, updateBrand, deleteBrand, saveBrandsConfig } from '../services/brandsService'
import { populateInitialBrands } from '../utils/populateBrands'
import { replaceConfigFile, showConfigContent, applyConfigChanges } from '../utils/configFileManager'

const BrandManager = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo: '',
    color: '#0066CC',
    description: '',
    category: 'veterinarios' // veterinarios o petshops
  })

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const brandsData = await getAllBrands()
      setBrands(brandsData)
    } catch (error) {
      console.error('Error al cargar marcas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBrand = async () => {
    try {
      await saveBrand(newBrand)
      await loadBrands()
      setNewBrand({
        name: '',
        logo: '',
        color: '#0066CC',
        description: '',
        category: 'veterinarios'
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Error al agregar marca:', error)
    }
  }

  const handleUpdateBrand = async () => {
    try {
      await updateBrand(editingBrand.id, editingBrand)
      await loadBrands()
      setEditingBrand(null)
    } catch (error) {
      console.error('Error al actualizar marca:', error)
    }
  }

  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      try {
        await deleteBrand(brandId)
        await loadBrands()
      } catch (error) {
        console.error('Error al eliminar marca:', error)
      }
    }
  }

  const handlePopulateInitialBrands = async () => {
    if (window.confirm('¿Estás seguro de que quieres agregar las marcas iniciales? Esto agregará todas las marcas predefinidas.')) {
      try {
        await populateInitialBrands()
        await loadBrands()
        alert('✅ Marcas iniciales agregadas exitosamente')
      } catch (error) {
        console.error('Error al poblar marcas iniciales:', error)
        alert('❌ Error al agregar marcas iniciales: ' + error.message)
      }
    }
  }

  const generateStaticConfig = async () => {
    try {
      const veterinariosBrands = brands.filter(brand => 
        brand.category === 'veterinarios' || brand.category === 'ambos'
      )
      const petshopsBrands = brands.filter(brand => 
        brand.category === 'petshops' || brand.category === 'ambos'
      )

      const config = {
        veterinarios: {
          title: 'Laboratorios y Marcas',
          subtitle: '',
          brands: veterinariosBrands.map(brand => ({
            name: brand.name,
            logo: brand.logo,
            color: brand.color,
            description: brand.description
          }))
        },
        petshops: {
          title: 'Laboratorios y Marcas',
          subtitle: '',
          brands: petshopsBrands.map(brand => ({
            name: brand.name,
            logo: brand.logo,
            color: brand.color,
            description: brand.description
          }))
        }
      }

      // Aplicar cambios automáticamente (desarrollo o producción)
      await applyConfigChanges(config)
      
      // Guardar en Firebase también
      await saveBrandsConfig(config)
      
    } catch (error) {
      console.error('Error al generar configuración:', error)
      alert('❌ Error al generar configuración: ' + error.message)
    }
  }

  const showConfigModal = () => {
    const veterinariosBrands = brands.filter(brand => 
      brand.category === 'veterinarios' || brand.category === 'ambos'
    )
    const petshopsBrands = brands.filter(brand => 
      brand.category === 'petshops' || brand.category === 'ambos'
    )

    const config = {
      veterinarios: {
        title: 'Laboratorios y Marcas',
        subtitle: '',
        brands: veterinariosBrands.map(brand => ({
          name: brand.name,
          logo: brand.logo,
          color: brand.color,
          description: brand.description
        }))
      },
      petshops: {
        title: 'Laboratorios y Marcas',
        subtitle: '',
        brands: petshopsBrands.map(brand => ({
          name: brand.name,
          logo: brand.logo,
          color: brand.color,
          description: brand.description
        }))
      }
    }

    showConfigContent(config)
  }

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
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Marcas y Laboratorios</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Agregar Marca/Laboratorio
          </button>
          <button
            onClick={handlePopulateInitialBrands}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Poblar Marcas/Laboratorios
          </button>
          <button
            onClick={generateStaticConfig}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔄 Aplicar Cambios
          </button>
          <button
            onClick={showConfigModal}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            👁️ Ver Config
          </button>
        </div>
      </div>

      {/* Formulario para agregar/editar marca */}
      {(showAddForm || editingBrand) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingBrand ? 'Editar Marca/Laboratorio' : 'Agregar Nueva Marca/Laboratorio'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Marca/Laboratorio
              </label>
              <input
                type="text"
                value={editingBrand ? editingBrand.name : newBrand.name}
                onChange={(e) => {
                  if (editingBrand) {
                    setEditingBrand({ ...editingBrand, name: e.target.value })
                  } else {
                    setNewBrand({ ...newBrand, name: e.target.value })
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: ZOETIS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del Logo
              </label>
              <input
                type="url"
                value={editingBrand ? editingBrand.logo : newBrand.logo}
                onChange={(e) => {
                  if (editingBrand) {
                    setEditingBrand({ ...editingBrand, logo: e.target.value })
                  } else {
                    setNewBrand({ ...newBrand, logo: e.target.value })
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Fallback
              </label>
              <input
                type="color"
                value={editingBrand ? editingBrand.color : newBrand.color}
                onChange={(e) => {
                  if (editingBrand) {
                    setEditingBrand({ ...editingBrand, color: e.target.value })
                  } else {
                    setNewBrand({ ...newBrand, color: e.target.value })
                  }
                }}
                className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={editingBrand ? editingBrand.category : newBrand.category}
                onChange={(e) => {
                  if (editingBrand) {
                    setEditingBrand({ ...editingBrand, category: e.target.value })
                  } else {
                    setNewBrand({ ...newBrand, category: e.target.value })
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="veterinarios">Veterinarios</option>
                <option value="petshops">Pet Shops</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={editingBrand ? editingBrand.description : newBrand.description}
                onChange={(e) => {
                  if (editingBrand) {
                    setEditingBrand({ ...editingBrand, description: e.target.value })
                  } else {
                    setNewBrand({ ...newBrand, description: e.target.value })
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Descripción de la marca..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingBrand(null)
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {editingBrand ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </div>
      )}

      {/* Lista de marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{brand.name}</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingBrand(brand)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteBrand(brand.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.substring(0, 3)}
              </div>
              <div className="flex gap-1">
                {brand.category === 'ambos' ? (
                  <>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Vet</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Pet</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-600 capitalize">
                    {brand.category}
                  </span>
                )}
              </div>
            </div>
            
            {brand.description && (
              <p className="text-sm text-gray-600">{brand.description}</p>
            )}
            
            {brand.logo && (
              <div className="mt-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-16 h-8 object-contain bg-white rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay marcas/laboratorios configurados. Agrega el primero.
        </div>
      )}
    </div>
  )
}

export default BrandManager
