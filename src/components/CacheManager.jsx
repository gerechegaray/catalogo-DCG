import React, { useState } from 'react'
import cacheService from '../services/cacheService'

const CacheManager = () => {
  const [status, setStatus] = useState('Listo')

  const clearCache = async () => {
    try {
      setStatus('🔄 Limpiando cache...')
      await cacheService.clearAll()
      setStatus('✅ Cache limpiado. Recarga la página para sincronizar con Alegra.')
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="p-4 bg-orange-100 border border-orange-300 rounded-md">
      <h3 className="text-lg font-semibold text-orange-800 mb-2">
        🗑️ Gestión de Cache
      </h3>
      <p className="text-orange-700 mb-3">
        Si los precios y stock aparecen en $0, limpia el cache para forzar una nueva sincronización con Alegra.
      </p>
      <div className="flex items-center space-x-4">
        <button
          onClick={clearCache}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Limpiar Cache
        </button>
        <span className="text-sm text-orange-600">{status}</span>
      </div>
    </div>
  )
}

export default CacheManager
