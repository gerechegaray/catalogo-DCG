import { db } from '../config/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'

const COLLECTION_NAME = 'featuredProducts'

// Obtener productos destacados por sección
export const getFeaturedProducts = async (section) => {
  try {
    const featuredRef = collection(db, COLLECTION_NAME)
    const q = query(featuredRef, where('section', '==', section), orderBy('order', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const featuredProducts = []
    querySnapshot.forEach((doc) => {
      featuredProducts.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return featuredProducts
  } catch (error) {
    console.error('Error al obtener productos destacados:', error)
    throw error
  }
}

// Obtener todos los productos destacados
export const getAllFeaturedProducts = async () => {
  try {
    const featuredRef = collection(db, COLLECTION_NAME)
    const q = query(featuredRef, orderBy('section'), orderBy('order', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const featuredProducts = []
    querySnapshot.forEach((doc) => {
      featuredProducts.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return featuredProducts
  } catch (error) {
    console.error('Error al obtener todos los productos destacados:', error)
    throw error
  }
}

// Agregar producto destacado
export const addFeaturedProduct = async (productData) => {
  try {
    const featuredRef = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(featuredRef, {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Devolver el objeto completo con el ID
    return {
      id: docRef.id,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  } catch (error) {
    console.error('Error al agregar producto destacado:', error)
    throw error
  }
}

// Actualizar producto destacado
export const updateFeaturedProduct = async (featuredId, productData) => {
  try {
    const featuredRef = doc(db, COLLECTION_NAME, featuredId)
    await updateDoc(featuredRef, {
      ...productData,
      updatedAt: new Date()
    })
    
    return true
  } catch (error) {
    console.error('Error al actualizar producto destacado:', error)
    throw error
  }
}

// Eliminar producto destacado
export const removeFeaturedProduct = async (featuredId) => {
  try {
    const featuredRef = doc(db, COLLECTION_NAME, featuredId)
    await deleteDoc(featuredRef)
    
    return true
  } catch (error) {
    console.error('Error al eliminar producto destacado:', error)
    throw error
  }
}

// Guardar configuración completa de productos destacados
export const saveFeaturedProductsConfig = async (config) => {
  try {
    const configRef = collection(db, 'featuredProductsConfig')
    await addDoc(configRef, {
      config,
      createdAt: new Date(),
      version: Date.now()
    })
    
    return true
  } catch (error) {
    console.error('Error al guardar configuración de productos destacados:', error)
    throw error
  }
}
