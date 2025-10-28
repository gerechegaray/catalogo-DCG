import { db } from '../config/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'

const COLLECTION_NAME = 'communications'

// Obtener todos los comunicados
export const getAllCommunications = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error al obtener comunicados:', error)
    return []
  }
}

// Obtener comunicados activos por sección
export const getActiveCommunications = async (section) => {
  try {
    const now = new Date().toISOString().split('T')[0]
    // console.log('🔍 Buscando comunicados activos para sección:', section, 'fecha:', now)
    
    // Consulta optimizada con índice compuesto
    const q = query(
      collection(db, COLLECTION_NAME),
      where('active', '==', true),
      where('validFrom', '<=', now),
      where('validUntil', '>=', now),
      orderBy('createdAt', 'desc')
    )
    
    // console.log('🔍 Ejecutando consulta Firebase...') // Debug log
    const querySnapshot = await getDocs(q)
    // console.log('📊 QuerySnapshot size:', querySnapshot.size) // Debug log
    
    const allCommunications = querySnapshot.docs.map(doc => {
      const data = doc.data()
      // console.log('📄 Comunicado encontrado:', {
      //   id: doc.id,
      //   title: data.title,
      //   section: data.section,
      //   active: data.active,
      //   validFrom: data.validFrom,
      //   validUntil: data.validUntil
      // }) // Debug log
      return {
        id: doc.id,
        ...data
      }
    })
    
    // console.log('📋 Comunicados encontrados:', allCommunications.length)
    
    // Filtrar por sección
    const filteredCommunications = allCommunications.filter(comm => 
      comm.section === section || comm.section === 'ambos'
    )
    
    // console.log(`🎯 Comunicados para ${section}:`, filteredCommunications.length)
    return filteredCommunications
  } catch (error) {
    console.error('❌ Error al obtener comunicados activos:', error)
    return []
  }
}

// Agregar nuevo comunicado
export const addCommunication = async (communicationData) => {
  try {
    // console.log('➕ Agregando comunicado:', communicationData.title) // Debug log
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...communicationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    // console.log('✅ Comunicado agregado con ID:', docRef.id) // Debug log
    return { id: docRef.id, ...communicationData }
  } catch (error) {
    console.error('❌ Error al agregar comunicado:', error)
    throw error
  }
}

// Actualizar comunicado
export const updateCommunication = async (id, updateData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    })
    return { id, ...updateData }
  } catch (error) {
    console.error('Error al actualizar comunicado:', error)
    throw error
  }
}

// Eliminar comunicado
export const deleteCommunication = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
    return true
  } catch (error) {
    console.error('Error al eliminar comunicado:', error)
    throw error
  }
}

// Activar/Desactivar comunicado
export const toggleCommunicationStatus = async (id, active) => {
  try {
    return await updateCommunication(id, { active })
  } catch (error) {
    console.error('Error al cambiar estado del comunicado:', error)
    throw error
  }
}

// Obtener comunicaciones para un cliente específico
export const getClientCommunications = async (clientId, clientType) => {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Obtener comunicados activos
    const q = query(
      collection(db, COLLECTION_NAME),
      where('active', '==', true),
      where('validFrom', '<=', now),
      where('validUntil', '>=', now),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const allCommunications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    // Filtrar por cliente específico o tipo de cliente
    const clientCommunications = allCommunications.filter(comm => {
      // Si tiene targetClients definido, verificar que incluya este cliente
      if (comm.targetClients && Array.isArray(comm.targetClients)) {
        return comm.targetClients.includes(clientId) || comm.targetClients.length === 0
      }
      
      // Si no tiene targetClients, aplicar filtro por tipo (section)
      if (comm.section && clientType) {
        const isTypeMatch = comm.section === clientType || comm.section === 'ambos'
        return isTypeMatch
      }
      
      // Si no hay ningún filtro específico, incluir
      return true
    })
    
    return clientCommunications
  } catch (error) {
    console.error('Error al obtener comunicaciones del cliente:', error)
    return []
  }
}

// Obtener promociones destacadas para dashboard
export const getFeaturedPromotions = async (clientId, clientType, limit = 3) => {
  try {
    const communications = await getClientCommunications(clientId, clientType)
    
    // Filtrar solo promociones (no comunicados generales)
    const promotions = communications.filter(comm => 
      comm.type === 'promocion' || comm.type === 'producto-nuevo' || comm.badge
    )
    
    // Ordenar por fecha y limitar
    return promotions.slice(0, limit)
  } catch (error) {
    console.error('Error al obtener promociones destacadas:', error)
    return []
  }
}
