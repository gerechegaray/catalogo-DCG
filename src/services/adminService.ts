import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Verifica si un usuario es administrador
 */
export const checkIfAdmin = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) return false
    
    const adminDoc = await getDoc(doc(db, 'admins', userId))
    
    if (!adminDoc.exists()) {
      console.log('⚠️ Usuario no encontrado en colección admins:', userId)
      return false
    }
    
    const adminData = adminDoc.data()
    const isAdmin = adminData?.isAdmin === true
    
    console.log(`🔍 Usuario ${userId} es admin:`, isAdmin)
    return isAdmin
  } catch (error) {
    console.error('❌ Error verificando admin:', error)
    return false
  }
}

/**
 * Obtiene todos los administradores
 */
export const getAllAdmins = async () => {
  try {
    const { getDocs, collection } = await import('firebase/firestore')
    const snapshot = await getDocs(collection(db, 'admins'))
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error obteniendo admins:', error)
    return []
  }
}

