import React from 'react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header simple solo con logo y nombre */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white overflow-hidden">
            <img 
              src="/DCG JPG-01.jpg" 
              alt="DCG Distribuciones" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">DCG DISTRIBUCIONES</h1>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center min-h-[90vh] px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Número 404 */}
          <div className="mb-8">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              404
            </h1>
          </div>

          {/* Título */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Página No Encontrada
          </h2>

          {/* Descripción */}
          <p className="text-xl text-gray-600">
            Lo sentimos, la página que estás buscando no existe.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

