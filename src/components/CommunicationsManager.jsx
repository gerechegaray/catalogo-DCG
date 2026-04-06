import React, { useState, useEffect } from 'react'
import { 
  getAllCommunications, 
  addCommunication, 
  deleteCommunication, 
  toggleCommunicationStatus 
} from '../services/communicationsService'

const CommunicationsManager = () => {
  const [communications, setCommunications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: 'Ver Productos',
    buttonLink: '',
    badge: 'NUEVO',
    section: 'veterinarios',
    active: true,
    // defaults needed for the database structure
    type: 'comunicado-general',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  const [newComm, setNewComm] = useState(initialFormState)

  useEffect(() => {
    loadCommunications()
  }, [])

  const loadCommunications = async () => {
    try {
      setLoading(true)
      const comms = await getAllCommunications()
      setCommunications(comms)
    } catch (error) {
      console.error('Error al cargar comunicaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCommunication = async () => {
    if (!newComm.title || !newComm.image) {
      alert('Por favor agrega un Título y una URL de Imagen')
      return
    }

    try {
      await addCommunication(newComm)
      await loadCommunications()
      setNewComm(initialFormState)
      setShowAddForm(false)
    } catch (error) {
      alert('Error al guardar: ' + error.message)
    }
  }

  const handleToggleActive = async (id, currentActive) => {
    try {
      await toggleCommunicationStatus(id, !currentActive)
      await loadCommunications()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este banner permanentemente?')) {
      try {
        await deleteCommunication(id)
        await loadCommunications()
      } catch (error) {
        console.error('Error al eliminar:', error)
      }
    }
  }

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'NUEVO': return 'bg-green-500'
      case 'IMPORTANTE': return 'bg-red-500'
      case 'PROMO': return 'bg-orange-500'
      case 'OFERTA': return 'bg-purple-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Avisos y Banners Principales</h2>
          <p className="text-gray-500 mt-1">Configura las promociones que aparecen al inicio de cada catálogo.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          {showAddForm ? '❌ Cancelar' : '➕ Nuevo Banner'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detalles del Nuevo Banner</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Título Principal *</label>
              <input
                type="text"
                value={newComm.title}
                onChange={(e) => setNewComm({...newComm, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. NUEVA PROMOCIÓN"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtítulo</label>
              <input
                type="text"
                value={newComm.subtitle}
                onChange={(e) => setNewComm({...newComm, subtitle: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Solo por este mes"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción corta</label>
            <textarea
              value={newComm.description}
              onChange={(e) => setNewComm({...newComm, description: e.target.value})}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe algo interesante para tus clientes..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link de la Imagen *</label>
              <input
                type="url"
                value={newComm.image}
                onChange={(e) => setNewComm({...newComm, image: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Etiqueta Colorida</label>
              <select
                value={newComm.badge}
                onChange={(e) => setNewComm({...newComm, badge: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="NUEVO">🟩 NUEVO</option>
                <option value="IMPORTANTE">🟥 IMPORTANTE</option>
                <option value="PROMO">🟧 PROMO</option>
                <option value="OFERTA">🟪 OFERTA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 pb-6 border-b border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">¿Dónde se muestra?</label>
              <select
                value={newComm.section}
                onChange={(e) => setNewComm({...newComm, section: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="veterinarios">🐶 Catálogo Veterinarios</option>
                <option value="petshops">🏪 Catálogo Pet Shops</option>
                <option value="ambos">✨ Ambos Catálogos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Texto del Botón</label>
              <input
                type="text"
                value={newComm.buttonText}
                onChange={(e) => setNewComm({...newComm, buttonText: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link del Botón</label>
              <input
                type="text"
                value={newComm.buttonLink}
                onChange={(e) => setNewComm({...newComm, buttonLink: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="/veterinarios/productos"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddCommunication}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Guardar y Publicar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500 font-medium">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communications.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
              No tienes ningún banner activo. ¡Crea uno para que tus clientes lo vean!
            </div>
          ) : (
            communications.map((comm) => (
              <div key={comm.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md ${comm.active ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
                <div className="h-40 bg-gray-100 relative overflow-hidden group">
                  {comm.image ? (
                    <img src={comm.image} alt={comm.title} className="w-full h-full object-cover" onError={(e) => e.target.src = '/placeholder-product.svg'} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">📸</div>
                  )}
                  <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold text-white rounded-md shadow-sm ${getBadgeColor(comm.badge)}`}>
                    {comm.badge}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-gray-700 rounded-md shadow-sm border border-white/20">
                    {comm.section === 'ambos' ? 'Ambos' : (comm.section === 'petshops' ? 'Pet Shop' : 'Vet')}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 truncate">{comm.title}</h3>
                  <p className="text-sm text-gray-500 truncate mb-1">{comm.subtitle || 'Sin subtítulo'}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-2 h-8">{comm.description}</p>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(comm.id, comm.active)}
                      className={`text-sm font-semibold flex items-center gap-2 ${comm.active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${comm.active ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                      {comm.active ? 'Desactivar' : 'Reactivar'}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(comm.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CommunicationsManager
