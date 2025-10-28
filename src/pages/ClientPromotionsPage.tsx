import React, { useEffect, useState } from 'react'
import { ArrowLeft, Gift, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClientAuth } from '../context/ClientAuthContext'
import { getClientCommunications } from '../services/communicationsService'

const ClientPromotionsPage: React.FC = () => {
  const navigate = useNavigate()
  const { client } = useClientAuth()
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const loadPromotions = async () => {
      if (!client?.id || !client?.type) {
        setLoading(false)
        return
      }

      try {
        const allPromotions = await getClientCommunications(client.id, client.type)
        setPromotions(allPromotions)
      } catch (error) {
        console.error('Error cargando promociones:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPromotions()
  }, [client])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    )
  }

  const filteredPromotions = promotions.filter((promo: any) => {
    if (filter === 'all') return true
    return promo.type === filter
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'promocion': 'Promoción',
      'producto-nuevo': 'Producto Nuevo',
      'descuento': 'Descuento',
      'destacado': 'Destacado'
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'promocion': 'bg-purple-100 text-purple-800',
      'producto-nuevo': 'bg-green-100 text-green-800',
      'descuento': 'bg-red-100 text-red-800',
      'destacado': 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/client/dashboard')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="bg-purple-100 rounded-lg p-2">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones Especiales</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('promocion')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'promocion'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            Promociones
          </button>
          <button
            onClick={() => setFilter('producto-nuevo')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'producto-nuevo'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            Productos Nuevos
          </button>
          <button
            onClick={() => setFilter('descuento')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'descuento'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            Descuentos
          </button>
        </div>

        {/* Lista de Promociones */}
        {filteredPromotions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay promociones disponibles
            </h3>
            <p className="text-gray-500">
              Próximamente habrá promociones exclusivas para tu negocio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promo: any) => (
              <div
                key={promo.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={promo.image || '/placeholder-product.svg'}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.svg'
                    }}
                  />
                  {/* Badge */}
                  {promo.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                        {promo.badge}
                      </span>
                    </div>
                  )}
                  {/* Tipo */}
                  <div className="absolute top-3 right-3">
                    <span className={`${getTypeColor(promo.type)} text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1`}>
                      <Tag className="w-3 h-3" />
                      {getTypeLabel(promo.type)}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {promo.title}
                  </h3>
                  {promo.subtitle && (
                    <p className="text-sm text-gray-600 mb-3">{promo.subtitle}</p>
                  )}
                  
                  {promo.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                      {promo.description}
                    </p>
                  )}

                  {/* Botón */}
                  {promo.buttonLink && (
                    <a
                      href={promo.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
                    >
                      {promo.buttonText || 'Ver Más'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientPromotionsPage

