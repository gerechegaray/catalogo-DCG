import React from 'react'
import Footer from '../components/Footer'

const RestrictedAccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      
      {/* Logo de la empresa */}
      <div className="pt-12 pb-8">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-white rounded-十九条 flex items-center justify-center shadow-2xl border-4 border-white overflow-hidden">
              <img 
                src="/DCG JPG-01.jpg" 
                alt="DCG Distribuciones" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-blue-900 drop-shadow-lg">DCG DISTRIBUCIONES</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center flex-grow px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icono de acceso restringido */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-6xl">🔒</span>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Acceso Restringido
          </h2>

          {/* Subtítulo */}
          <p className="text-xl text-gray-600 mb-4 leading-relaxed">
            Has llegado al lugar equivocado.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Esta es un área privada del catálogo. Debes tener una URL específica para acceder.
          </p>

          {/* Información simple */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ¿Necesitas acceso?
            </h3>
            <p className="text-gray-600">
              Contacta con tu proveedor para obtener la URL específica de tu sección.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default RestrictedAccessPage
