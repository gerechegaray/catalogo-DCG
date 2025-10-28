import { config } from '@/config/appConfig'
import type { AlegraContactInfo } from '@/types/client'

/**
 * Servicio para obtener información de clientes desde Alegra API
 */
class AlegraClientService {
  private baseURL: string
  private apiKey: string
  private headers: Record<string, string>

  constructor() {
    this.apiKey = config.alegra.apiKey
    this.baseURL = config.alegra.baseURL
    
    this.headers = {
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * Obtener información de un contacto/cliente desde Alegra
   * Usado en el formulario de aprobación para auto-completar datos
   */
  async getContactInfo(alegraId: string): Promise<AlegraContactInfo | null> {
    try {
      console.log('🔍 Buscando contacto en Alegra con ID:', alegraId)
      console.log('🔗 URL:', `${this.baseURL}/contacts/${alegraId}`)
      
      const response = await fetch(`${this.baseURL}/contacts/${alegraId}`, {
        headers: this.headers
      })

      console.log('📊 Response status:', response.status)

      if (!response.ok) {
        if (response.status === 404) {
          console.error('❌ Cliente no encontrado en Alegra')
          const errorText = await response.text()
          console.error('📄 Error response:', errorText)
          return null
        }
        const errorText = await response.text()
        console.error('❌ Error en Alegra API:', response.status, errorText)
        throw new Error(`Error en Alegra API: ${response.status}`)
      }

      const contact = await response.json()
      console.log('✅ Contacto encontrado:', contact)
      
      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phonePrimary || contact.phoneSecondary || undefined,
        address: contact.address ? `${contact.address.address || ''} ${contact.address.city || ''}`.trim() : undefined,
        type: contact.type,
        identificationNumber: contact.identificationObject?.number || undefined
      }
    } catch (error) {
      console.error('❌ Error obteniendo información del contacto:', error)
      return null
    }
  }

  /**
   * Obtener facturas de un cliente
   */
  async getClientInvoices(alegraId: string): Promise<any[]> {
    try {
      console.log('🔍 Buscando facturas para cliente ID:', alegraId)
      
      // Usamos client_id solo (sin paginación)
      const response = await fetch(`${this.baseURL}/invoices?client_id=${alegraId}`, {
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`Error en Alegra API: ${response.status}`)
      }

      const invoices = await response.json()
      console.log(`✅ Total facturas obtenidas para cliente ${alegraId}:`, invoices.length)
      
      return invoices
    } catch (error) {
      console.error('Error obteniendo facturas:', error)
      return []
    }
  }

  /**
   * Obtener pagos de un cliente
   */
  async getClientPayments(alegraId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/payments?client=${alegraId}`, {
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`Error en Alegra API: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo pagos:', error)
      return []
    }
  }

  /**
   * Calcular saldo de un cliente
   */
  async calculateClientBalance(alegraId: string): Promise<{
    total: number
    pending: number
    overdue: number
  }> {
    try {
      const invoices = await this.getClientInvoices(alegraId)
      
      let pending = 0
      let overdue = 0
      const today = new Date()

      invoices.forEach((invoice: any) => {
        const amount = parseFloat(invoice.total || 0)
        const status = invoice.status || ''

        if (status === 'open' && invoice.dueDate) {
          const dueDate = new Date(invoice.dueDate)
          if (dueDate < today) {
            overdue += amount
          }
          pending += amount
        }
      })

      return {
        total: pending + overdue,
        pending,
        overdue
      }
    } catch (error) {
      console.error('Error calculando saldo:', error)
      return { total: 0, pending: 0, overdue: 0 }
    }
  }

  /**
   * Obtener cotizaciones de un cliente
   */
  async getClientQuotes(alegraId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/estimates?client=${alegraId}`, {
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`Error en Alegra API: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo cotizaciones:', error)
      return []
    }
  }
}

// Exportar instancia singleton
const alegraClientService = new AlegraClientService()
export default alegraClientService
