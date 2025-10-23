// Servicio para generar mensajes de WhatsApp
import type { WhatsAppProduct, ClientInfo, WhatsAppMessage } from '@/types/whatsapp'

class WhatsAppService {
  private baseMessage: string
  private footerMessage: string

  constructor() {
    this.baseMessage = '🛒 *Nuevo Pedido*'
    this.footerMessage = '\n\n¿Te interesa alguno de estos productos?'
  }

  // Generar mensaje de WhatsApp con productos seleccionados
  generateMessage(selectedProducts: WhatsAppProduct[], clientInfo: ClientInfo = {}): WhatsAppMessage {
    try {
      if (!selectedProducts || selectedProducts.length === 0) {
        throw new Error('No hay productos seleccionados')
      }

      let message = this.baseMessage
      
      // Agregar información del cliente si está disponible
      if (clientInfo.name) {
        message += `\n\n👤 Cliente: ${clientInfo.name}`
      }
      
      if (clientInfo.phone) {
        message += `\n📞 Teléfono: ${clientInfo.phone}`
      }

      // Agregar productos
      message += '\n\n📦 *Productos seleccionados:*'
      
      let total = 0
      selectedProducts.forEach((product, index) => {
        const quantity = product.quantity || 1
        const subtotal = product.price * quantity
        total += subtotal
        
        message += `\n${index + 1}. ${product.name}`
        message += `\n   💰 Precio: $${this.formatPrice(product.price)}`
        message += `\n   📊 Cantidad: ${quantity}`
        message += `\n   💵 Subtotal: $${this.formatPrice(subtotal)}`
        
        if (product.code) {
          message += `\n   🏷️ Código: ${product.code}`
        }
        
        if (product.supplier) {
          message += `\n   🏢 Proveedor: ${product.supplier}`
        }
        
        message += '\n'
      })

      // Agregar total
      message += `\n💰 *Total estimado: $${this.formatPrice(total)}*`

      // Agregar información adicional
      message += '\n\n📋 *Información adicional:*'
      message += `\n📅 Fecha: ${new Date().toLocaleDateString('es-CO')}`
      message += `\n🕒 Hora: ${new Date().toLocaleTimeString('es-CO')}`
      
      // Agregar footer
      message += this.footerMessage

      return {
        message,
        encodedMessage: encodeURIComponent(message),
        productCount: selectedProducts.length,
        totalPrice: total
      }
      
    } catch (error) {
      console.error('❌ Error generando mensaje de WhatsApp:', error)
      throw error
    }
  }

  // Formatear precio en pesos colombianos
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO').format(price)
  }

  // Abrir WhatsApp con el mensaje generado
  openWhatsApp(message: string, phoneNumber: string | null = null): void {
    try {
      // Codificar el mensaje para URL
      const encodedMessage = encodeURIComponent(message)
      
      // Construir URL de WhatsApp
      let whatsappUrl: string
      if (phoneNumber) {
        // Si hay número específico, abrir chat directo
        const cleanPhone = phoneNumber.replace(/\D/g, '') // Solo números
        whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      } else {
        // Si no hay número, abrir WhatsApp Web para que el usuario elija
        whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`
      }
      
      // Abrir en nueva pestaña
      window.open(whatsappUrl, '_blank')
      
      console.log('📱 WhatsApp abierto con mensaje generado')
      
    } catch (error) {
      console.error('❌ Error abriendo WhatsApp:', error)
      throw error
    }
  }

  // Generar y enviar mensaje completo
  async sendMessage(
    selectedProducts: WhatsAppProduct[], 
    clientInfo: ClientInfo = {}, 
    phoneNumber: string | null = null
  ): Promise<WhatsAppMessage> {
    try {
      // Generar mensaje
      const messageData = this.generateMessage(selectedProducts, clientInfo)
      
      // Abrir WhatsApp
      this.openWhatsApp(messageData.message, phoneNumber)
      
      // Registrar analytics
      if (window.cacheService) {
        const productIds = selectedProducts.map(p => p.id)
        await window.cacheService.recordWhatsAppClick(productIds, clientInfo.userType || 'unknown')
      }
      
      return messageData
      
    } catch (error) {
      console.error('❌ Error enviando mensaje de WhatsApp:', error)
      throw error
    }
  }

  // Generar mensaje de prueba
  generateTestMessage(): WhatsAppMessage {
    const testProducts: WhatsAppProduct[] = [
      {
        id: 1,
        name: 'Antiparasitario Canino',
        price: 25000,
        quantity: 2,
        code: 'ANT-001',
        supplier: 'VetPharma'
      },
      {
        id: 2,
        name: 'Vacuna Triple Felina',
        price: 35000,
        quantity: 1,
        code: 'VAC-002',
        supplier: 'VetVacunas'
      }
    ]
    
    const testClientInfo: ClientInfo = {
      name: 'Dr. García',
      phone: '3001234567',
      userType: 'vet'
    }
    
    return this.generateMessage(testProducts, testClientInfo)
  }

  // Validar productos seleccionados
  validateProducts(products: WhatsAppProduct[]): boolean {
    if (!Array.isArray(products)) {
      throw new Error('Los productos deben ser un array')
    }
    
    if (products.length === 0) {
      throw new Error('Debe seleccionar al menos un producto')
    }
    
    if (products.length > 20) {
      throw new Error('Máximo 20 productos por pedido')
    }
    
    // Validar cada producto
    products.forEach((product, index) => {
      if (!product.name) {
        throw new Error(`Producto ${index + 1}: Falta el nombre`)
      }
      
      if (!product.price || product.price <= 0) {
        throw new Error(`Producto ${index + 1}: Precio inválido`)
      }
      
      if (!product.quantity || product.quantity <= 0) {
        throw new Error(`Producto ${index + 1}: Cantidad inválida`)
      }
    })
    
    return true
  }
}

// Exportar instancia única del servicio
export default new WhatsAppService()

