import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="flex items-center justify-center min-h-[80vh] px-4">
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
          <p className="text-xl text-gray-600 mb-8">
            Lo sentimos, la URL que estás buscando no existe o ha sido movida.
          </p>

          {/* Información */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Verifica que tengas acceso a:
            </h3>
            
            <div className="space-y-3 text-left">
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold text-gray-900">📍 /veterinarios</span>
                <span className="text-gray-600 ml-2">- Catálogo para veterinarios</span>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <span className="font-semibold text-gray-900">📍 /petshops</span>
                <span className="text-gray-600 ml-2">- Catálogo para pet shops</span>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <span className="font-semibold text-gray-900">📍 /publico</span>
                <span className="text-gray-600 ml-2">- Catálogo público</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🏠 Ir al Inicio
            </Link>
            <a
              href="/contacto"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            >
              📧 Contactar
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFoundPage

