import React from 'react'
import { Stethoscope, ShoppingBag, Lock, ArrowRight } from 'lucide-react'
import Footer from '../components/Footer'

const RestrictedAccessPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">

      {/* Header */}
      <div className="pt-12 pb-8">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 overflow-hidden">
              <img
                src="/DCG JPG-01.jpg"
                alt="DCG Distribuciones"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-blue-900 tracking-tight">DCG DISTRIBUCIONES</h1>
              <p className="text-sm text-blue-600 font-medium mt-0.5">Catálogo Digital</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full mx-auto">

          {/* Título */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-md border border-gray-100 mb-5">
              <Lock className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Acceso por link directo
            </h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              Este catálogo está disponible a través de un link específico para cada canal.
              Pedile el tuyo a tu vendedor.
            </p>
          </div>

          {/* Canales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {/* Veterinarios */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Veterinarios</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Productos medicinales, insumos clínicos, vacunas y equipamiento veterinario.
              </p>
            </div>

            {/* Pet Shops */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pet Shops</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Alimentos premium, accesorios, higiene y cuidado para mascotas.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
            <p className="text-gray-700 font-medium mb-1">¿No tenés tu link?</p>
            <p className="text-sm text-gray-500 mb-4">
              Contactá a tu vendedor de DCG para que te comparta el acceso a tu sección.
            </p>
            <a
              href="https://wa.me/5492645438284"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Contactar por WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default RestrictedAccessPage
