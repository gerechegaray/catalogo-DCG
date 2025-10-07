import React, { useState, useEffect } from 'react'
import { 
  getAllCommunications, 
  addCommunication, 
  updateCommunication, 
  deleteCommunication, 
  toggleCommunicationStatus 
} from '../services/communicationsService'

const CommunicationsManager = () => {
  const [communications, setCommunications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingComm, setEditingComm] = useState(null)

  const [newComm, setNewComm] = useState({
    title: '',
    subtitle: '',
    type: 'producto-nuevo',
    description: '',
    image: '',
    buttonText: 'Ver Más',
    buttonLink: '',
    badge: 'NUEVO',
    section: 'veterinarios',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 días desde hoy
  })

  // Cargar comunicados al montar el componente
  useEffect(() => {
    loadCommunications()
  }, [])

  const loadCommunications = async () => {
    try {
      setLoading(true)
      const comms = await getAllCommunications()
      setCommunications(comms)
    } catch (error) {
      console.error('Error al cargar comunicados:', error)
      alert('Error al cargar comunicados: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCommunication = async () => {
    if (!newComm.title || !newComm.image) {
      alert('❌ Por favor completa todos los campos obligatorios (Título e Imagen)')
      return
    }

    try {
      await addCommunication(newComm)
      await loadCommunications() // Recargar la lista
      setNewComm({
        title: '',
        subtitle: '',
        type: 'producto-nuevo',
        description: '',
        image: '',
        buttonText: 'Ver Más',
        buttonLink: '',
        badge: 'NUEVO',
        section: 'veterinarios',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
      setShowAddForm(false)
      alert('✅ Comunicado agregado exitosamente')
    } catch (error) {
      console.error('Error al agregar comunicado:', error)
      alert('❌ Error al agregar comunicado: ' + error.message)
    }
  }

  const handleToggleActive = async (id, currentActive) => {
    try {
      await toggleCommunicationStatus(id, !currentActive)
      await loadCommunications() // Recargar la lista
      alert(`✅ Comunicado ${!currentActive ? 'activado' : 'desactivado'} exitosamente`)
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert('❌ Error al cambiar estado: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comunicado?')) {
      try {
        await deleteCommunication(id)
        await loadCommunications() // Recargar la lista
        alert('🗑️ Comunicado eliminado exitosamente')
      } catch (error) {
        console.error('Error al eliminar comunicado:', error)
        alert('❌ Error al eliminar comunicado: ' + error.message)
      }
    }
  }

  const handlePopulateExamples = async () => {
    if (window.confirm('¿Quieres agregar comunicados de ejemplo? Esto agregará 4 comunicados de prueba.')) {
      try {
        const exampleCommunications = [
          {
            title: "NUEVO PRODUCTO ELMER",
            subtitle: "MEDICAMENTOS CONDUCTUALES",
            type: "producto-nuevo",
            description: "Descubre la nueva línea de productos para el manejo del comportamiento animal",
            image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            buttonText: "Ver Productos",
            buttonLink: "/veterinarios/productos",
            badge: "NUEVO",
            section: "veterinarios",
            validFrom: "2024-01-01",
            validUntil: "2025-12-31",
            active: true
          },
          {
            title: "AUMENTO PRECIOS VACUNAS",
            subtitle: "VIGENTE DESDE 15/01",
            type: "aumento-precios",
            description: "Informamos los nuevos precios de la línea de vacunas e inmunológicos",
            image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            buttonText: "Ver Precios",
            buttonLink: "/veterinarios/productos",
            badge: "IMPORTANTE",
            section: "veterinarios",
            validFrom: "2024-01-15",
            validUntil: "2025-12-31",
            active: true
          },
          {
            title: "ALIMENTOS PREMIUM",
            subtitle: "OLD PRINCE & COMPANY",
            type: "producto-nuevo",
            description: "Nueva llegada de alimentos premium para perros y gatos",
            image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            buttonText: "Ver Alimentos",
            buttonLink: "/petshops/productos",
            badge: "NUEVO",
            section: "petshops",
            validFrom: "2024-01-01",
            validUntil: "2025-12-31",
            active: true
          },
          {
            title: "PROMOCIÓN ESPECIAL",
            subtitle: "DESCUENTOS EN ACCESORIOS",
            type: "promocion",
            description: "Aprovecha nuestros descuentos especiales en juguetes y accesorios para mascotas",
            image: "https://drive.google.com/uc?export=view&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            buttonText: "Ver Ofertas",
            buttonLink: "/petshops/productos",
            badge: "PROMO",
            section: "petshops",
            validFrom: "2024-01-01",
            validUntil: "2025-12-31",
            active: true
          }
        ]
        
        for (const comm of exampleCommunications) {
          await addCommunication(comm)
        }
        
        await loadCommunications() // Recargar la lista
        alert('🎉 Comunicados de ejemplo agregados exitosamente!')
      } catch (error) {
        console.error('Error al poblar comunicados:', error)
        alert('❌ Error al agregar comunicados de ejemplo: ' + error.message)
      }
    }
  }

  const handleUpdateExpiredDates = async () => {
    if (window.confirm('¿Quieres actualizar las fechas de los comunicados existentes para que sean válidas?')) {
      try {
        const today = new Date().toISOString().split('T')[0]
        const nextYear = new Date().getFullYear() + 1
        
        for (const comm of communications) {
          // Actualizar fechas que ya expiraron
          if (comm.validUntil < today) {
            await updateCommunication(comm.id, {
              validFrom: today,
              validUntil: `${nextYear}-12-31`
            })
            console.log(`✅ Actualizado: ${comm.title}`)
          }
        }
        
        await loadCommunications() // Recargar la lista
        alert('🎉 Fechas actualizadas exitosamente!')
      } catch (error) {
        console.error('Error al actualizar fechas:', error)
        alert('❌ Error al actualizar fechas: ' + error.message)
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'producto-nuevo': return '🆕'
      case 'aumento-precios': return '💰'
      case 'promocion': return '🎉'
      case 'aviso-importante': return '⚠️'
      default: return '📢'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Comunicados</h2>
        <p className="text-gray-600">Administra los comunicados que aparecen en el carousel de cada sección</p>
      </div>

      {/* Botones de acción */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          ➕ Agregar Nuevo Comunicado
        </button>
        
        <button
          onClick={handlePopulateExamples}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          🎯 Agregar Ejemplos
        </button>
        
        <button
          onClick={handleUpdateExpiredDates}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          📅 Actualizar Fechas
        </button>
        
        <button
          onClick={loadCommunications}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          🔄 Recargar Lista
        </button>
      </div>

      {/* Formulario para agregar comunicado */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">Nuevo Comunicado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input
                type="text"
                value={newComm.title}
                onChange={(e) => setNewComm({...newComm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: NUEVO PRODUCTO ELMER"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <input
                type="text"
                value={newComm.subtitle}
                onChange={(e) => setNewComm({...newComm, subtitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: MEDICAMENTOS CONDUCTUALES"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={newComm.type}
                onChange={(e) => setNewComm({...newComm, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="producto-nuevo">🆕 Producto Nuevo</option>
                <option value="aumento-precios">💰 Aumento de Precios</option>
                <option value="promocion">🎉 Promoción</option>
                <option value="aviso-importante">⚠️ Aviso Importante</option>
                <option value="comunicado-general">📢 Comunicado General</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
              <select
                value={newComm.badge}
                onChange={(e) => setNewComm({...newComm, badge: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="NUEVO">NUEVO</option>
                <option value="IMPORTANTE">IMPORTANTE</option>
                <option value="PROMO">PROMO</option>
                <option value="OFERTA">OFERTA</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sección</label>
              <select
                value={newComm.section}
                onChange={(e) => setNewComm({...newComm, section: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="veterinarios">Veterinarios</option>
                <option value="petshops">Pet Shops</option>
                <option value="ambos">Ambas Secciones</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen (Google Drive) *</label>
              <input
                type="url"
                value={newComm.image}
                onChange={(e) => setNewComm({...newComm, image: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://drive.google.com/uc?export=view&id=TU_ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Texto del Botón</label>
              <input
                type="text"
                value={newComm.buttonText}
                onChange={(e) => setNewComm({...newComm, buttonText: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ver Productos"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enlace del Botón</label>
              <input
                type="text"
                value={newComm.buttonLink}
                onChange={(e) => setNewComm({...newComm, buttonLink: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="/veterinarios/productos"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Válido Desde</label>
              <input
                type="date"
                value={newComm.validFrom}
                onChange={(e) => setNewComm({...newComm, validFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Válido Hasta</label>
              <input
                type="date"
                value={newComm.validUntil}
                onChange={(e) => setNewComm({...newComm, validUntil: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={newComm.description}
              onChange={(e) => setNewComm({...newComm, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del comunicado..."
            />
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleAddCommunication}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              ✅ Guardar Comunicado
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de comunicados */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Comunicados Actuales</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando comunicados...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comunicado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sección</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {communications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      No hay comunicados creados aún. ¡Agrega el primero!
                    </td>
                  </tr>
                ) : (
                  communications.map((comm) => (
                <tr key={comm.id} className={comm.active ? '' : 'opacity-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={comm.image}
                          alt={comm.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48/cccccc/666666?text=IMG'
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getTypeIcon(comm.type)} {comm.title}
                        </div>
                        <div className="text-sm text-gray-500">{comm.subtitle}</div>
                        <div className={`inline-block px-2 py-1 text-xs font-bold text-white rounded-full ${getBadgeColor(comm.badge)}`}>
                          {comm.badge}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comm.section === 'ambos' ? 'Ambas' : comm.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {comm.validFrom} - {comm.validUntil}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      comm.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {comm.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(comm.id, comm.active)}
                        className={`px-3 py-1 text-xs rounded ${
                          comm.active 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {comm.active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDelete(comm.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">📋 Instrucciones para Google Drive:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Sube tu imagen a Google Drive</li>
          <li>2. Haz clic derecho → "Obtener enlace"</li>
          <li>3. Cambia el enlace de: <code>https://drive.google.com/file/d/ID/view</code></li>
          <li>4. Por: <code>https://drive.google.com/uc?export=view&id=ID</code></li>
          <li>5. Usa ese enlace en el campo "URL de Imagen"</li>
        </ol>
      </div>
    </div>
  )
}

export default CommunicationsManager
