import React from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import whatsappService from '../services/whatsappService'
import { handleError } from '../utils/errorHandler'

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { userType } = useAuth()
  const { showSuccess, showError, showWarning } = useToast()

  // Generar mensaje de WhatsApp con el pedido
  const generateWhatsAppMessage = () => {
    let message = `📦 *PEDIDO DCG DISTRIBUCIONES*\n`
    message += `📋 *Productos solicitados:*\n\n`
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   - Cantidad: ${item.quantity}\n`
      message += `   - Precio: $${item.price.toLocaleString()}\n\n`
    })
    
    message += `💰 *Total estimado:* $${totalPrice.toLocaleString()}\n\n`
    message += `¡Hola! Me gustaría realizar este pedido.\n`
    message += `📝 *Nombre del cliente:* [Por favor completar]\n`
    message += `¿Podrían confirmarme disponibilidad y total?`
    
    return encodeURIComponent(message)
  }

  // Enviar pedido por WhatsApp
  const handleSendWhatsApp = async () => {
    if (items.length === 0) {
      showWarning('El pedido está vacío. Agrega productos antes de enviar.')
      return
    }

    try {
      // Convertir items del carrito al formato esperado por whatsappService
      const whatsappProducts = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        supplier: 'DCG Distribuciones' // Puedes ajustar esto según tus datos
      }))

      // Usar el servicio de WhatsApp con tracking
      await whatsappService.sendMessage(whatsappProducts, {
        userType: userType || 'unknown'
      })
      
      // Limpiar pedido después de enviar
      clearCart()
      onClose()
      showSuccess('✅ Pedido enviado por WhatsApp exitosamente')
    } catch (error) {
      const errorMessage = handleError(error, {
        component: 'CartSidebar',
        action: 'handleSendWhatsApp'
      })
      showError(errorMessage)
    }
  }

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="mr-2" /> Tu Pedido ({totalItems})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <ShoppingCart size={48} className="mb-4" />
            <p className="text-lg">Tu pedido está vacío.</p>
            <p className="text-sm">Agrega productos para empezar.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center border-b py-4 last:border-b-0">
                  <img
                    src={item.image || '/placeholder-product.svg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 border rounded-md hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 border rounded-md hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 p-1 rounded-md"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-800">Total Estimado:</span>
                <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 text-center">
                El total estimado es calculado según precios de lista, no está aplicado ningún descuento ni promoción.
              </p>
              <button
                onClick={handleSendWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Enviar Pedido por WhatsApp
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 text-red-500 hover:text-red-700 py-2 px-4 rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
              >
                Vaciar Pedido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartSidebar