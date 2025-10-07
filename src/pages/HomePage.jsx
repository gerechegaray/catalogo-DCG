import React from 'react'
import Header from '../components/Header'
import HeroCarousel from '../components/HeroCarousel'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <Header />

      {/* Carrusel Hero */}
      <HeroCarousel />

      {/* Sección de productos destacados */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Los productos más consultados y mejor valorados por nuestros clientes profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Veterinarios */}
            <div className="group bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">👨‍⚕️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
                  Para Veterinarios
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Medicamentos especializados, equipos médicos y reactivos de laboratorio
                </p>
                <ul className="text-left text-gray-500 mb-8 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Medicamentos especializados
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Vacunas e inmunológicos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Equipos médicos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Instrumentos quirúrgicos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Reactivos de laboratorio
                  </li>
                </ul>
                <a
                  href="/veterinarios"
                  className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Ver Catálogo Veterinarios
                </a>
              </div>
            </div>

            {/* Pet Shops */}
            <div className="group bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">🛍️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors">
                  Para Pet Shops
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Alimentos premium, accesorios y productos para el cuidado de mascotas
                </p>
                <ul className="text-left text-gray-500 mb-8 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Alimentos premium
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Juguetes y accesorios
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Productos de higiene
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Camas y casas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Collares y correas
                  </li>
                </ul>
                <a
                  href="/petshops"
                  className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Ver Catálogo Pet Shops
                </a>
              </div>
            </div>

            {/* Administración */}
            <div className="group bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-purple-600 transition-colors">
                  Administración
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Dashboard con estadísticas y productos más consultados
                </p>
                <ul className="text-left text-gray-500 mb-8 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Productos más vistos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Estadísticas de uso
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Reportes de consultas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Gestión de sincronización
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Configuración del sistema
                  </li>
                </ul>
                <a
                  href="/admin"
                  className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Ver Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de características */}
      <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              ¿Por qué elegirnos?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Características que nos hacen únicos en el mercado veterinario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🔄</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                Sincronización en Tiempo Real
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Precios y stock actualizados automáticamente desde Alegra
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📱</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                Integración WhatsApp
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Genera mensajes automáticos para pedidos con un solo clic
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                Analytics Avanzados
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Reportes detallados de productos más consultados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default HomePage