import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User
} from 'firebase/auth'
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import type { Client, GoogleUserInfo } from '@/types/client'

const COLLECTION_NAME = 'clients'

/**
 * Servicio de autenticación de clientes
 */
class ClientAuthService {
  private googleProvider: GoogleAuthProvider

  constructor() {
    this.googleProvider = new GoogleAuthProvider()
    // Opcional: agregar scopes adicionales
    this.googleProvider.addScope('email')
    this.googleProvider.addScope('profile')
  }

  /**
   * Iniciar sesión con Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider)
      return result.user
    } catch (error: any) {
      console.error('Error en signInWithGoogle:', error)
      
      // Manejo de errores comunes
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('El popup fue cerrado. Por favor intenta de nuevo.')
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('El popup fue bloqueado. Por favor permite popups para este sitio.')
      }
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Este dominio no está autorizado. Contacta al administrador.')
      }
      
      throw error
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error en logout:', error)
      throw error
    }
  }

  /**
   * Obtener información del usuario de Google
   */
  getUserInfo(user: User): GoogleUserInfo {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || undefined
    }
  }

  /**
   * Crear o actualizar perfil del cliente en Firestore
   * Se llama automáticamente después del signIn
   */
  async createOrUpdateClientProfile(user: User): Promise<Client> {
    const userInfo = this.getUserInfo(user)
    
    try {
      const clientRef = doc(db, COLLECTION_NAME, user.uid)
      const clientSnap = await getDoc(clientRef)
      
      // Si el cliente NO existe, crearlo
      if (!clientSnap.exists()) {
        const newClient: Omit<Client, 'id'> = {
          email: userInfo.email || '',
          displayName: userInfo.displayName || '',
          photoURL: userInfo.photoURL,
          pendingApproval: true,  // ← Estado por defecto: pendiente
          isActive: false,         // ← Inactivo hasta que admin apruebe
          createdAt: serverTimestamp() as Timestamp
        }
        
        await setDoc(clientRef, newClient)
        
        return {
          id: user.uid,
          ...newClient,
          createdAt: new Date() as Timestamp  // Para TypeScript
        }
      } 
      
      // Si el cliente SÍ existe, actualizar lastLogin
      else {
        const existingClient = clientSnap.data() as Client
        await setDoc(clientRef, {
          ...existingClient,
          lastLogin: serverTimestamp()
        }, { merge: true })
        
        return existingClient
      }
    } catch (error) {
      console.error('Error creando/actualizando perfil:', error)
      throw error
    }
  }

  /**
   * Obtener el perfil del cliente actual
   */
  async getCurrentClient(userId: string): Promise<Client | null> {
    try {
      const clientRef = doc(db, COLLECTION_NAME, userId)
      const clientSnap = await getDoc(clientRef)
      
      if (!clientSnap.exists()) {
        return null
      }
      
      return {
        id: clientSnap.id,
        ...clientSnap.data()
      } as Client
    } catch (error) {
      console.error('Error obteniendo cliente:', error)
      return null
    }
  }

  /**
   * Verificar estado del cliente
   */
  async checkClientStatus(userId: string): Promise<{
    pending: boolean
    active: boolean
  }> {
    const client = await this.getCurrentClient(userId)
    
    if (!client) {
      return { pending: false, active: false }
    }
    
    return {
      pending: client.pendingApproval,
      active: client.isActive
    }
  }
}

// Exportar instancia singleton
const clientAuthService = new ClientAuthService()
export default clientAuthService
