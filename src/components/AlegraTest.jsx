import React, { useState } from 'react'
import alegraService from '../services/alegraService'

const AlegraTest = () => {
  const [status, setStatus] = useState('Listo para probar')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const testAlegraConnection = async () => {
    try {
      setLoading(true)
      setStatus('🔄 Probando conexión con Alegra...')
      
      // Probar obtener productos
      const alegraProducts = await alegraService.getAllProducts()
      
      setStatus(`✅ Conexión exitosa! ${alegraProducts.length} productos obtenidos`)
      setProducts(alegraProducts.slice(0, 5)) // Mostrar solo los primeros 5
      
    } catch (error) {
      console.error('Error:', error)
      setStatus(`❌ Error: ${error.message}`)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Prueba de Alegra</h2>
      
      <div className="mb-4">
        <p className="text-lg font-medium">Estado: {status}</p>
      </div>
      
      <button 
        onClick={testAlegraConnection}
        disabled={loading}
        className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? '🔄 Probando...' : '🛒 Probar Conexión Alegra'}
      </button>
      
      {products.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Primeros 5 productos:</h3>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={product.id || index} className="bg-gray-100 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm text-gray-500">Categoría: {product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      ${new Intl.NumberFormat('es-CO').format(product.price)}
                    </p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({ 
            totalProducts: products.length,
            apiKeyConfigured: !!import.meta.env.VITE_ALEGRA_API_KEY,
            baseUrl: import.meta.env.VITE_ALEGRA_BASE_URL
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default AlegraTest

