import React from 'react'
import { useLocation } from 'react-router-dom'
import { getBrandsConfig } from '../config/brandsConfig'

const BrandsGrid = () => {
  const location = useLocation()
  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')

  // Obtener configuración según el tipo de usuario
  const userType = isVeterinarios ? 'veterinarios' : 'petshops'
  const config = getBrandsConfig(userType)

  const handleBrandClick = (brandName) => {
    // Redirigir a productos filtrados por marca
    const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
    window.location.href = `${baseUrl}?marca=${encodeURIComponent(brandName)}`
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
              onClick={() => handleBrandClick(brand.name)}
              className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-full h-20 flex items-center justify-center mb-4 bg-gray-50 rounded-lg">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
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
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
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

        <div className="text-center mt-12">
          <button
            onClick={() => {
              const baseUrl = isVeterinarios ? '/veterinarios/productos' : '/petshops/productos'
              window.location.href = baseUrl
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </section>
  )
}

export default BrandsGrid
