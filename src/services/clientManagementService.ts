import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Client, ClientType, ApproveClientData } from '@/types/client'

const COLLECTION_NAME = 'clients'

/**
 * Servicio para gestionar clientes desde el Admin
 */
class ClientManagementService {
  /**
   * Obtener todos los clientes pendientes
   */
  async getPendingClients(): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('pendingApproval', '==', true)
      )
      
      const querySnapshot = await getDocs(q)
      console.log('📊 Clientes pendientes encontrados:', querySnapshot.size)
      
      const clients: Client[] = []
      
      querySnapshot.forEach((doc) => {
        console.log('📄 Cliente:', doc.id, doc.data())
        clients.push({
          id: doc.id,
          ...doc.data()
        } as Client)
      })
      
      // Debug: Si no hay resultados, obtener todos para ver qué hay
      if (clients.length === 0) {
        console.log('⚠️ No hay clientes pendientes. Obteniendo todos los clientes...')
        const allSnapshot = await getDocs(collection(db, COLLECTION_NAME))
        allSnapshot.forEach((doc) => {
          console.log('📄 Todos los clientes:', doc.id, 'Data:', doc.data())
        })
      }
      
      return clients
    } catch (error) {
      console.error('Error obteniendo clientes pendientes:', error)
      throw error
    }
  }

  /**
   * Obtener todos los clientes activos
   */
  async getActiveClients(): Promise<Client[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('isActive', '==', true)
      )
      
      const querySnapshot = await getDocs(q)
      const clients: Client[] = []
      
      querySnapshot.forEach((doc) => {
        clients.push({
          id: doc.id,
          ...doc.data()
        } as Client)
      })
      
      return clients
    } catch (error) {
      console.error('Error obteniendo clientes activos:', error)
      throw error
    }
  }

  /**
   * Obtener todos los clientes
   */
  async getAllClients(): Promise<Client[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
      const clients: Client[] = []
      
      querySnapshot.forEach((doc) => {
        clients.push({
          id: doc.id,
          ...doc.data()
        } as Client)
      })
      
      return clients
    } catch (error) {
      console.error('Error obteniendo todos los clientes:', error)
      throw error
    }
  }

  /**
   * Obtener un cliente por ID
   */
  async getClientById(clientId: string): Promise<Client | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, clientId)
      const docSnap = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', clientId)))
      
      if (docSnap.empty) {
        return null
      }
      
      const clientDoc = docSnap.docs[0]
      return {
        id: clientDoc.id,
        ...clientDoc.data()
      } as Client
    } catch (error) {
      console.error('Error obteniendo cliente:', error)
      return null
    }
  }

  /**
   * Aprobar un cliente
   */
  async approveClient(
    clientId: string, 
    data: ApproveClientData,
    adminEmail: string
  ): Promise<void> {
    try {
      // Validar que el Alegra ID existe
      if (data.alegraId) {
        const { default: alegraClientService } = await import('./alegraClientService')
        const contactInfo = await alegraClientService.getContactInfo(data.alegraId)
        
        if (!contactInfo) {
          throw new Error(`El ID de Alegra (${data.alegraId}) no existe o no es válido`)
        }
        
        console.log('✅ Alegra ID validado:', contactInfo.name)
      }
      
      const clientRef = doc(db, COLLECTION_NAME, clientId)
      
      await updateDoc(clientRef, {
        alegraId: data.alegraId,
        type: data.type,
        businessName: data.businessName || '',
        contactPhone: data.contactPhone || '',
        pendingApproval: false,
        isActive: true,
        approvedBy: adminEmail,
        approvedAt: serverTimestamp(),
        notes: data.notes || ''
      })
      
      console.log(`Cliente ${clientId} aprobado exitosamente`)
    } catch (error) {
      console.error('Error aprobando cliente:', error)
      throw error
    }
  }

  /**
   * Rechazar un cliente
   */
  async rejectClient(clientId: string, reason: string): Promise<void> {
    try {
      const clientRef = doc(db, COLLECTION_NAME, clientId)
      
      await updateDoc(clientRef, {
        pendingApproval: false,
        isActive: false,
        notes: `RECHAZADO: ${reason}`
      })
      
      console.log(`Cliente ${clientId} rechazado`)
    } catch (error) {
      console.error('Error rechazando cliente:', error)
      throw error
    }
  }

  /**
   * Desactivar un cliente activo
   */
  async deactivateClient(clientId: string): Promise<void> {
    try {
      const clientRef = doc(db, COLLECTION_NAME, clientId)
      
      await updateDoc(clientRef, {
        isActive: false
      })
      
      console.log(`Cliente ${clientId} desactivado`)
    } catch (error) {
      console.error('Error desactivando cliente:', error)
      throw error
    }
  }

  /**
   * Reactivar un cliente
   */
  async reactivateClient(clientId: string): Promise<void> {
    try {
      const clientRef = doc(db, COLLECTION_NAME, clientId)
      
      await updateDoc(clientRef, {
        isActive: true
      })
      
      console.log(`Cliente ${clientId} reactivado`)
    } catch (error) {
      console.error('Error reactivando cliente:', error)
      throw error
    }
  }

  /**
   * Actualizar información de un cliente
   */
  async updateClient(clientId: string, updates: Partial<Client>): Promise<void> {
    try {
      const clientRef = doc(db, COLLECTION_NAME, clientId)
      
      await updateDoc(clientRef, {
        ...updates,
        // No actualizar campos que no deben cambiar
      } as any)
      
      console.log(`Cliente ${clientId} actualizado`)
    } catch (error) {
      console.error('Error actualizando cliente:', error)
      throw error
    }
  }
}

// Exportar instancia singleton
const clientManagementService = new ClientManagementService()
export default clientManagementService
