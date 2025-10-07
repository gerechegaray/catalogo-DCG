import React, { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import whatsappService from '../services/whatsappService'

const ProductSelectionBar = () => {
  const { selectedProducts, updateProductQuantity, removeSelectedProduct, clearSelectedProducts } = useProducts()
  const [isExpanded, setIsExpanded] = useState(false)

  // Calcular total
  const total = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0)

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Manejar envío a WhatsApp
  const handleWhatsApp = async () => {
    try {
      await whatsappService.sendMessage(selectedProducts, {
        userType: 'vet' // Esto se puede mejorar para detectar automáticamente
      })
    } catch (error) {
      console.error('Error enviando a WhatsApp:', error)
      alert('Error al generar mensaje de WhatsApp')
    }
  }

  // Si no hay productos seleccionados, no mostrar la barra
  if (selectedProducts.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* Barra compacta */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Información compacta */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span className="text-lg">🛒</span>
              <span className="font-medium">
                {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''} seleccionado{selectedProducts.length !== 1 ? 's' : ''}
              </span>
              <span className="text-sm">
                {isExpanded ? '▲' : '▼'}
              </span>
            </button>
            
            <div className="text-lg font-bold text-blue-600">
              {formatPrice(total)}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📱 Enviar WhatsApp
            </button>
            
            <button
              onClick={clearSelectedProducts}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Panel expandido */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatPrice(product.price)} c/u
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeSelectedProduct(product.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {product.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="font-medium text-blue-600">
                      {formatPrice(product.price * product.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumen total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">
                  Total ({selectedProducts.length} productos):
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSelectionBar