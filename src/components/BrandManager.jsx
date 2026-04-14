import React, { useState, useEffect } from 'react'
import { getAllBrands, saveBrand, updateBrand, deleteBrand } from '../services/brandsService'

const BrandManager = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [saving, setSaving] = useState(false)
  const [selectedSection, setSelectedSection] = useState('veterinarios')

  const emptyForm = {
    name: '',
    logo: '',
    color: '#0066CC',
    description: '',
    category: 'veterinarios'
  }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      setLoading(true)
      const data = await getAllBrands()
      setBrands(data)
    } catch (error) {
      console.error('Error cargando marcas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Escribe un nombre para la marca')
      return
    }
    try {
      setSaving(true)
      if (editingBrand) {
        await updateBrand(editingBrand.id, form)
      } else {
        await saveBrand(form)
      }
      await loadBrands()
      setForm(emptyForm)
      setShowForm(false)
      setEditingBrand(null)
    } catch (error) {
      alert('Error al guardar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (brand) => {
    setForm({
      name: brand.name || '',
      logo: brand.logo || '',
      color: brand.color || '#0066CC',
      description: brand.description || '',
      category: brand.category || 'veterinarios'
    })
    setEditingBrand(brand)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta marca?')) return
    try {
      await deleteBrand(id)
      await loadBrands()
    } catch (error) {
      alert('Error eliminando: ' + error.message)
    }
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setShowForm(false)
    setEditingBrand(null)
  }

  const filteredBrands = brands.filter(b =>
    b.category === selectedSection || b.category === 'ambos'
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marcas y Laboratorios</h2>
          <p className="text-gray-500 mt-1">Configura las marcas que aparecen en la página principal del catálogo.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingBrand(null); setForm(emptyForm) }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          {showForm ? '❌ Cancelar' : '➕ Nueva Marca'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-5">
            {editingBrand ? 'Editar Marca' : 'Agregar Nueva Marca'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: ZOETIS"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Medicamentos veterinarios"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL del Logo</label>
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm({...form, logo: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Podes usar URLs de ImgBB, Imgur o Google Drive (formato: https://drive.google.com/uc?export=view&id=TU_ID)
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">¿Dónde se muestra?</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="veterinarios">🐶 Veterinarias</option>
                <option value="petshops">🏪 Pet Shops</option>
                <option value="ambos">✨ Ambos</option>
              </select>
            </div>
          </div>

          {/* Preview del logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Color de fondo (si no hay logo)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({...form, color: e.target.value})}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <span className="text-sm text-gray-500">{form.color}</span>
              </div>
            </div>
            {form.logo && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Vista previa</label>
                <div className="w-40 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                  <img
                    src={form.logo}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : (editingBrand ? 'Actualizar' : 'Agregar Marca')}
            </button>
          </div>
        </div>
      )}

      {/* Selector de sección */}
      <div className="mb-6 bg-gray-50 p-1.5 rounded-lg border border-gray-200 inline-flex text-sm font-medium">
        <button
          onClick={() => setSelectedSection('veterinarios')}
          className={`px-5 py-2 rounded-md transition-colors ${selectedSection === 'veterinarios' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🐶 Veterinarias ({brands.filter(b => b.category === 'veterinarios' || b.category === 'ambos').length})
        </button>
        <button
          onClick={() => setSelectedSection('petshops')}
          className={`px-5 py-2 rounded-md transition-colors ${selectedSection === 'petshops' ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🏪 Pet Shops ({brands.filter(b => b.category === 'petshops' || b.category === 'ambos').length})
        </button>
      </div>

      {/* Lista de marcas */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando marcas...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredBrands.map((brand) => (
            <div key={brand.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
              {/* Logo area */}
              <div className="h-24 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full items-center justify-center text-white text-sm font-bold rounded-lg ${brand.logo ? 'hidden' : 'flex'}`}
                  style={{ backgroundColor: brand.color }}
                >
                  {brand.name}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 text-center">
                <h4 className="font-bold text-gray-900 text-sm truncate">{brand.name}</h4>
                {brand.description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{brand.description}</p>
                )}
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    brand.category === 'ambos' ? 'bg-purple-100 text-purple-700' :
                    brand.category === 'petshops' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {brand.category === 'ambos' ? 'Ambos' : brand.category === 'petshops' ? 'Pet Shop' : 'Vet'}
                  </span>
                </div>
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <button
                  onClick={() => handleEdit(brand)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors shadow"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors shadow"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {filteredBrands.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No hay marcas en esta sección. ¡Crea una!
            </div>
          )}
        </div>
      )}

      {/* Instrucciones de logos */}
      <div className="mt-8 bg-blue-50 p-5 rounded-xl border border-blue-100">
        <h4 className="text-sm font-bold text-blue-900 mb-2">💡 ¿Cómo subir logos fácilmente?</h4>
        <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
          <li>Andá a <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">imgbb.com</a> (gratis, no requiere cuenta)</li>
          <li>Subí tu imagen del logo</li>
          <li>Copiá el "Link directo a la imagen" que te da</li>
          <li>Pegalo en el campo "URL del Logo" acá arriba</li>
        </ol>
        <p className="text-xs text-blue-600 mt-3">También sirven: Imgur, Google Drive o cualquier URL pública de imagen.</p>
      </div>
    </div>
  )
}

export default BrandManager

