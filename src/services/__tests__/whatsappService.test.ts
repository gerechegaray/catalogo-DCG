import whatsappService from '../whatsappService'
import type { WhatsAppProduct, ClientInfo } from '../../types/whatsapp'

describe('WhatsAppService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMessage', () => {
    it('genera mensaje correctamente con productos básicos', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto Test',
          price: 1000,
          quantity: 2
        }
      ]

      const result = whatsappService.generateMessage(products)

      expect(result.message).toContain('Producto Test')
      expect(result.message).toContain('$1.000')
      expect(result.message).toContain('Cantidad: 2')
      expect(result.message).toContain('Subtotal: $2.000')
      expect(result.totalPrice).toBe(2000)
      expect(result.productCount).toBe(1)
    })

    it('genera mensaje con información del cliente', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto Test',
          price: 1000,
          quantity: 1
        }
      ]

      const clientInfo: ClientInfo = {
        name: 'Dr. García',
        phone: '3001234567',
        userType: 'vet'
      }

      const result = whatsappService.generateMessage(products, clientInfo)

      expect(result.message).toContain('Cliente: Dr. García')
      expect(result.message).toContain('Teléfono: 3001234567')
    })

    it('genera mensaje con código y proveedor', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto Test',
          price: 1000,
          quantity: 1,
          code: 'TEST-001',
          supplier: 'Test Supplier'
        }
      ]

      const result = whatsappService.generateMessage(products)

      expect(result.message).toContain('Código: TEST-001')
      expect(result.message).toContain('Proveedor: Test Supplier')
    })

    it('calcula total correctamente con múltiples productos', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto 1',
          price: 1000,
          quantity: 2
        },
        {
          id: 2,
          name: 'Producto 2',
          price: 1500,
          quantity: 1
        }
      ]

      const result = whatsappService.generateMessage(products)

      expect(result.totalPrice).toBe(3500) // (1000*2) + (1500*1)
      expect(result.message).toContain('Total estimado: $3.500')
    })

    it('lanza error cuando no hay productos', () => {
      expect(() => {
        whatsappService.generateMessage([])
      }).toThrow('No hay productos seleccionados')
    })

    it('lanza error cuando productos es null', () => {
      expect(() => {
        whatsappService.generateMessage(null as any)
      }).toThrow('No hay productos seleccionados')
    })
  })

  describe('formatPrice', () => {
    it('formatea precio correctamente', () => {
      expect(whatsappService.formatPrice(1000)).toBe('1.000')
      expect(whatsappService.formatPrice(25000)).toBe('25.000')
      expect(whatsappService.formatPrice(1000000)).toBe('1.000.000')
    })
  })

  describe('openWhatsApp', () => {
    it('abre WhatsApp con número específico', () => {
      const message = 'Mensaje de prueba'
      const phoneNumber = '3001234567'

      whatsappService.openWhatsApp(message, phoneNumber)

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('wa.me/3001234567'),
        '_blank'
      )
    })

    it('abre WhatsApp Web cuando no hay número', () => {
      const message = 'Mensaje de prueba'

      whatsappService.openWhatsApp(message)

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('web.whatsapp.com'),
        '_blank'
      )
    })

    it('limpia número de teléfono correctamente', () => {
      const message = 'Mensaje de prueba'
      const phoneNumber = '+57 300 123 4567'

      whatsappService.openWhatsApp(message, phoneNumber)

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('wa.me/573001234567'),
        '_blank'
      )
    })
  })

  describe('validateProducts', () => {
    it('valida productos correctamente', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto Test',
          price: 1000,
          quantity: 1
        }
      ]

      expect(whatsappService.validateProducts(products)).toBe(true)
    })

    it('lanza error cuando productos no es array', () => {
      expect(() => {
        whatsappService.validateProducts(null as any)
      }).toThrow('Los productos deben ser un array')
    })

    it('lanza error cuando array está vacío', () => {
      expect(() => {
        whatsappService.validateProducts([])
      }).toThrow('Debe seleccionar al menos un producto')
    })

    it('lanza error cuando hay más de 20 productos', () => {
      const products = Array(21).fill(null).map((_, index) => ({
        id: index,
        name: `Producto ${index}`,
        price: 1000,
        quantity: 1
      }))

      expect(() => {
        whatsappService.validateProducts(products)
      }).toThrow('Máximo 20 productos por pedido')
    })

    it('lanza error cuando falta nombre del producto', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: '',
          price: 1000,
          quantity: 1
        }
      ]

      expect(() => {
        whatsappService.validateProducts(products)
      }).toThrow('Producto 1: Falta el nombre')
    })

    it('lanza error cuando precio es inválido', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto Test',
          price: 0,
          quantity: 1
        }
      ]

      expect(() => {
        whatsappService.validateProducts(products)
      }).toThrow('Producto 1: Precio inválido')
    })

    it('lanza error cuando cantidad es inválida', () => {
      const products: WhatsAppProduct[] = [
        {
          id: 1,
          name: 'Producto Test',
          price: 1000,
          quantity: 0
        }
      ]

      expect(() => {
        whatsappService.validateProducts(products)
      }).toThrow('Producto 1: Cantidad inválida')
    })
  })

  describe('generateTestMessage', () => {
    it('genera mensaje de prueba correctamente', () => {
      const result = whatsappService.generateTestMessage()

      expect(result.message).toContain('Antiparasitario Canino')
      expect(result.message).toContain('Vacuna Triple Felina')
      expect(result.message).toContain('Dr. García')
      expect(result.message).toContain('Teléfono: 3001234567')
      expect(result.productCount).toBe(2)
      expect(result.totalPrice).toBe(85000) // (25000*2) + (35000*1)
    })
  })
})
