import { Timestamp } from 'firebase/firestore'

/**
 * Tipo de cliente
 * - vet: Veterinario
 * - pet: Pet Shop
 */
export type ClientType = 'vet' | 'pet'

/**
 * Interfaz completa del cliente en Firestore
 */
export interface Client {
  // ID de Firebase (UID de autenticación)
  id: string
  
  // Datos de Google Auth (auto-llenados)
  email: string
  displayName: string
  photoURL?: string
  
  // Datos asignados por Admin (manual)
  alegraId?: string
  type?: ClientType
  businessName?: string
  contactPhone?: string
  
  // Estado de la cuenta
  pendingApproval: boolean
  isActive: boolean
  approvedBy?: string
  approvedAt?: Timestamp
  
  // Metadata
  createdAt: Timestamp
  lastLogin?: Timestamp
  notes?: string
}

/**
 * Perfil público del cliente (datos básicos)
 */
export interface ClientProfile {
  id: string
  displayName: string
  photoURL?: string
  businessName?: string
  type?: ClientType
}

/**
 * Cliente pendiente de aprobación
 */
export interface PendingClient {
  id: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  pendingApproval: true
}

/**
 * Datos de usuario de Google Auth
 */
export interface GoogleUserInfo {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

/**
 * Datos de Alegra (para auto-completar)
 */
export interface AlegraContactInfo {
  id: number
  name: string
  phone?: string
  address?: string
  type?: string
  identificationNumber?: string
}

/**
 * Datos para el formulario de aprobación
 */
export interface ApproveClientData {
  alegraId: string
  type: ClientType
  businessName?: string
  contactPhone?: string
  notes?: string
}
