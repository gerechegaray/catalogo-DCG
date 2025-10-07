import { db } from '../config/firebase'
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'

const COLLECTION_NAME = 'brands'

// Obtener todas las marcas
export const getAllBrands = async () => {
  try {
    const brandsRef = collection(db, COLLECTION_NAME)
    const q = query(brandsRef, orderBy('name'))
    const querySnapshot = await getDocs(q)
    
    const brands = []
    querySnapshot.forEach((doc) => {
      brands.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return brands
  } catch (error) {
    console.error('Error al obtener marcas:', error)
    throw error
  }
}

// Guardar marca
export const saveBrand = async (brandData) => {
  try {
    const brandsRef = collection(db, COLLECTION_NAME)
    const docRef = await addDoc(brandsRef, {
      ...brandData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error al guardar marca:', error)
    throw error
  }
}

// Actualizar marca
export const updateBrand = async (brandId, brandData) => {
  try {
    const brandRef = doc(db, COLLECTION_NAME, brandId)
    await updateDoc(brandRef, {
      ...brandData,
      updatedAt: new Date()
    })
    
    return true
  } catch (error) {
    console.error('Error al actualizar marca:', error)
    throw error
  }
}

// Eliminar marca
export const deleteBrand = async (brandId) => {
  try {
    const brandRef = doc(db, COLLECTION_NAME, brandId)
    await deleteDoc(brandRef)
    
    return true
  } catch (error) {
    console.error('Error al eliminar marca:', error)
    throw error
  }
}

// Guardar configuración completa de marcas
export const saveBrandsConfig = async (config) => {
  try {
    const configRef = collection(db, 'brandsConfig')
    await addDoc(configRef, {
      config,
      createdAt: new Date(),
      version: Date.now()
    })
    
    return true
  } catch (error) {
    console.error('Error al guardar configuración de marcas:', error)
    throw error
  }
}

