import React, { useState, useEffect } from 'react'
import { getAllBrands, saveBrand, updateBrand, deleteBrand, saveBrandsConfig } from '../services/brandsService'
import { populateInitialBrands } from '../utils/populateBrands'
import { replaceConfigFile, showConfigContent, applyConfigChanges } from '../utils/configFileManager'
import { ref, uploadBytes, getDownloadURL, uploadString } from 'firebase/storage'
import { storage } from '../config/firebase'

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
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [logoFile, setLogoFile] = useState(null)

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
      // Si hay un archivo de logo, subirlo primero
      let logoUrl = newBrand.logo
      if (logoFile) {
        logoUrl = await uploadLogoToStorage(logoFile, newBrand.name)
      }
      
      await saveBrand({ ...newBrand, logo: logoUrl })
      await loadBrands()
      
      // Actualizar automáticamente la configuración en Storage
      await updateBrandsConfigInStorage()
      
      setNewBrand({
        name: '',
        logo: '',
        color: '#0066CC',
        description: '',
        category: 'veterinarios'
      })
      setLogoPreview(null)
      setLogoFile(null)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error al agregar marca:', error)
      alert('❌ Error al agregar marca: ' + error.message)
    }
  }

  const handleUpdateBrand = async () => {
    try {
      // Si hay un archivo de logo nuevo, subirlo primero
      let logoUrl = editingBrand.logo
      if (logoFile) {
        logoUrl = await uploadLogoToStorage(logoFile, editingBrand.name)
      }
      
      await updateBrand(editingBrand.id, { ...editingBrand, logo: logoUrl })
      await loadBrands()
      
      // Actualizar automáticamente la configuración en Storage
      await updateBrandsConfigInStorage()
      
      setEditingBrand(null)
      setLogoPreview(null)
      setLogoFile(null)
    } catch (error) {
      console.error('Error al actualizar marca:', error)
      alert('❌ Error al actualizar marca: ' + error.message)
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

  // Función para actualizar la configuración en Storage automáticamente
  const updateBrandsConfigInStorage = async () => {
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

      // Guardar en Firestore
      await saveBrandsConfig(config)
      
      // Subir a Firebase Storage en producción
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1'
      
      if (!isDevelopment && storage) {
        try {
          console.log('📤 Actualizando configuración en Firebase Storage...')
          const configJson = JSON.stringify(config, null, 2)
          const storageRef = ref(storage, 'config/brandsConfig.json')
          await uploadString(storageRef, configJson, 'raw')
          console.log('✅ Configuración actualizada en Firebase Storage')
        } catch (storageError) {
          console.error('Error subiendo a Storage:', storageError)
          // No mostrar error al usuario, solo log
        }
      }
    } catch (error) {
      console.error('Error actualizando configuración:', error)
      // No mostrar error al usuario, solo log
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

      // Guardar en Firestore
      await saveBrandsConfig(config)
      
      // Subir a Firebase Storage en producción
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1'
      
      if (!isDevelopment && storage) {
        try {
          console.log('📤 Subiendo configuración a Firebase Storage...')
          const configJson = JSON.stringify(config, null, 2)
          const storageRef = ref(storage, 'config/brandsConfig.json')
          await uploadString(storageRef, configJson, 'raw')
          console.log('✅ Configuración subida a Firebase Storage exitosamente')
          
          alert('✅ Configuración actualizada correctamente!\n\nLos cambios se verán reflejados en la página de veterinarios y petshops.')
        } catch (storageError) {
          console.error('Error subiendo a Storage:', storageError)
          alert('⚠️ Configuración guardada en Firestore pero error al subir a Storage.\n\nPor favor, verifica los permisos de Firebase Storage.')
        }
      }
      
      // En desarrollo, descargar archivo para reemplazo manual
      if (isDevelopment) {
        await applyConfigChanges(config)
      }
      
    } catch (error) {
      console.error('Error al generar configuración:', error)
      alert('❌ Error al generar configuración: ' + error.message)
    }
  }

  // Función para subir logo a Firebase Storage
  const uploadLogoToStorage = async (file, brandName) => {
    try {
      setUploadingLogo(true)
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen')
      }
      
      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('La imagen no debe superar los 2MB')
      }
      
      // Crear nombre único para el archivo
      const timestamp = Date.now()
      const sanitizedName = brandName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const fileExtension = file.name.split('.').pop()
      const fileName = `brands/${sanitizedName}_${timestamp}.${fileExtension}`
      
      // Crear referencia en Storage
      const storageRef = ref(storage, fileName)
      
      // Subir archivo
      await uploadBytes(storageRef, file)
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef)
      
      console.log('✅ Logo subido exitosamente:', downloadURL)
      return downloadURL
      
    } catch (error) {
      console.error('❌ Error subiendo logo:', error)
      throw error
    } finally {
      setUploadingLogo(false)
    }
  }

  // Manejar selección de archivo
  const handleLogoFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('❌ El archivo debe ser una imagen (JPG, PNG, etc.)')
      return
    }
    
    // Validar tamaño
    if (file.size > 2 * 1024 * 1024) {
      alert('❌ La imagen no debe superar los 2MB')
      return
    }
    
    setLogoFile(file)
    
    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Limpiar preview y archivo
  const clearLogoSelection = () => {
    setLogoFile(null)
    setLogoPreview(null)
    // Resetear input file
    const fileInput = document.getElementById('logo-file-input')
    if (fileInput) fileInput.value = ''
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
                Logo de la Marca
              </label>
              
              {/* Opción 1: Subir archivo */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Subir logo desde tu computadora:
                </label>
                <input
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={uploadingLogo}
                />
                {logoFile && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-600">{logoFile.name}</span>
                    <button
                      type="button"
                      onClick={clearLogoSelection}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                )}
                {uploadingLogo && (
                  <div className="mt-2 text-xs text-blue-600">
                    ⏳ Subiendo logo...
                  </div>
                )}
              </div>
              
              {/* Preview del logo */}
              {(logoPreview || (editingBrand ? editingBrand.logo : newBrand.logo)) && (
                <div className="mb-3">
                  <label className="block text-xs text-gray-600 mb-1">
                    Vista previa:
                  </label>
                  <div className="w-32 h-16 bg-white border border-gray-300 rounded-md flex items-center justify-center p-2">
                    <img
                      src={logoPreview || (editingBrand ? editingBrand.logo : newBrand.logo)}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="hidden items-center justify-center text-gray-400 text-xs">
                      Imagen no disponible
                    </div>
                  </div>
                </div>
              )}
              
              {/* Opción 2: URL manual (alternativa) */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  O ingresar URL manualmente:
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
                    // Si se ingresa URL manual, limpiar archivo seleccionado
                    if (e.target.value) {
                      clearLogoSelection()
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://ejemplo.com/logo.png (opcional si subes archivo)"
                  disabled={!!logoFile}
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Si subes un archivo, se usará ese logo. La URL solo se usa si no hay archivo.
                </p>
              </div>
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
                clearLogoSelection()
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
              disabled={uploadingLogo}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {uploadingLogo ? '⏳ Subiendo...' : (editingBrand ? 'Actualizar' : 'Agregar')}
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
                  onClick={() => {
                    setEditingBrand(brand)
                    setLogoPreview(null)
                    setLogoFile(null)
                  }}
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
