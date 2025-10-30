import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getBrandsConfig } from '../config/brandsConfig'
import { ref, getBytes } from 'firebase/storage'
import { storage } from '../config/firebase'

const BrandsGrid = () => {
  const location = useLocation()
  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')
  
  const [config, setConfig] = useState({
    title: 'Laboratorios y Marcas',
    subtitle: '',
    brands: []
  })
  const [loading, setLoading] = useState(true)

  // Obtener configuración según el tipo de usuario
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        const userType = isVeterinarios ? 'veterinarios' : 'petshops'
        
        // Intentar cargar desde Firebase Storage
        const isDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1'
        
        if (!isDevelopment && storage) {
          try {
            console.log('📥 Intentando cargar configuración desde Firebase Storage...')
            const storageRef = ref(storage, 'config/brandsConfig.json')
            const bytes = await getBytes(storageRef)
            const text = new TextDecoder().decode(bytes)
            const configData = JSON.parse(text)
            console.log('✅ Configuración cargada desde Firebase Storage')
            
            const brandsConfig = configData[userType] || configData.veterinarios
            setConfig(brandsConfig)
            setLoading(false)
            return
          } catch (storageError) {
            console.warn('⚠️ Error cargando desde Storage, usando configuración estática:', storageError)
            // Fallback a configuración estática
          }
        }
        
        // Usar configuración estática como fallback
        const brandsConfig = getBrandsConfig(userType)
        setConfig(brandsConfig)
      } catch (error) {
        console.error('Error cargando configuración de marcas:', error)
        // Usar configuración por defecto
        const brandsConfig = getBrandsConfig(isVeterinarios ? 'veterinarios' : 'petshops')
        setConfig(brandsConfig)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [isVeterinarios, isPetShops])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {config.brands.map((brand, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-full h-20 flex items-center justify-center mb-4 bg-gray-50 rounded-lg">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div 
                    className="hidden w-full h-full items-center justify-center text-lg font-bold text-white rounded-lg"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.name}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandsGrid
