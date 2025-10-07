import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Servicio para manejar cache y analytics en Firebase
class CacheService {
  constructor() {
    this.productsCollection = 'products'
    this.analyticsCollection = 'analytics'
    this.cacheExpiry = 24 * 60 * 60 * 1000 // 24 horas en milisegundos
  }

  // Guardar productos en cache
  async saveProductsToCache(products) {
    try {
      console.log('💾 Guardando productos en cache...')
      
      // Limpiar cache anterior
      await this.clearProductsCache()
      
      // Guardar cada producto
      const promises = products.map(product => {
        const productRef = doc(collection(db, this.productsCollection), product.id.toString())
        return setDoc(productRef, {
          ...product,
          cachedAt: serverTimestamp(),
          expiresAt: new Date(Date.now() + this.cacheExpiry)
        })
      })
      
      await Promise.all(promises)
      console.log(`✅ ${products.length} productos guardados en cache`)
      
    } catch (error) {
      console.error('❌ Error guardando productos en cache:', error)
      throw error
    }
  }

  // Obtener productos del cache
  async getProductsFromCache() {
    try {
      console.log('📖 Obteniendo productos del cache...')
      
      const productsRef = collection(db, this.productsCollection)
      const q = query(productsRef, orderBy('cachedAt', 'desc'))
      
      const snapshot = await getDocs(q)
      const products = []
      
      snapshot.forEach(doc => {
        const data = doc.data()
        // Verificar si el cache no ha expirado
        if (data.expiresAt && new Date(data.expiresAt.toDate()) > new Date()) {
          products.push({
            id: doc.id,
            ...data
          })
        }
      })
      
      console.log(`📖 ${products.length} productos obtenidos del cache`)
      return products
      
    } catch (error) {
      console.error('❌ Error obteniendo productos del cache:', error)
      return []
    }
  }

  // Limpiar cache de productos
  async clearProductsCache() {
    try {
      console.log('🗑️ Limpiando cache de productos...')
      
      const productsRef = collection(db, this.productsCollection)
      const snapshot = await getDocs(productsRef)
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      console.log('✅ Cache de productos limpiado')
      
    } catch (error) {
      console.error('❌ Error limpiando cache:', error)
    }
  }

  // Limpiar todo el cache (productos y analytics)
  async clearAll() {
    try {
      console.log('🗑️ Limpiando todo el cache...')
      
      // Limpiar productos
      await this.clearProductsCache()
      
      // Limpiar analytics
      const analyticsRef = collection(db, this.analyticsCollection)
      const snapshot = await getDocs(analyticsRef)
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      console.log('✅ Todo el cache limpiado')
      
    } catch (error) {
      console.error('❌ Error limpiando todo el cache:', error)
      throw error
    }
  }

  // Registrar vista de producto (analytics)
  async recordProductView(productId, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'product_view',
        productId: productId.toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      })
    } catch (error) {
      console.error('❌ Error registrando vista de producto:', error)
    }
  }

  // Registrar selección de producto (analytics)
  async recordProductSelection(productId, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'product_selection',
        productId: productId.toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando selección de producto:', error)
    }
  }

  // Registrar click en WhatsApp (analytics)
  async recordWhatsAppClick(productIds, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'whatsapp_click',
        productIds: productIds.map(id => id.toString()),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando click de WhatsApp:', error)
    }
  }

  // Obtener analytics de productos más vistos
  async getTopViewedProducts(limitCount = 10) {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_view'),
        orderBy('timestamp', 'desc'),
        limit(1000) // Obtener últimos 1000 registros para procesar
      )
      
      const snapshot = await getDocs(q)
      const productViews = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const productId = data.productId
        
        if (!productViews[productId]) {
          productViews[productId] = 0
        }
        productViews[productId]++
      })
      
      // Convertir a array y ordenar
      const topProducts = Object.entries(productViews)
        .map(([productId, views]) => ({ productId, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limitCount)
      
      return topProducts
      
    } catch (error) {
      console.error('❌ Error obteniendo productos más vistos:', error)
      return []
    }
  }

  // Obtener analytics de productos más seleccionados
  async getTopSelectedProducts(limitCount = 10) {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_selection'),
        orderBy('timestamp', 'desc'),
        limit(1000)
      )
      
      const snapshot = await getDocs(q)
      const productSelections = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const productId = data.productId
        
        if (!productSelections[productId]) {
          productSelections[productId] = 0
        }
        productSelections[productId]++
      })
      
      const topProducts = Object.entries(productSelections)
        .map(([productId, selections]) => ({ productId, selections }))
        .sort((a, b) => b.selections - a.selections)
        .slice(0, limitCount)
      
      return topProducts
      
    } catch (error) {
      console.error('❌ Error obteniendo productos más seleccionados:', error)
      return []
    }
  }

  // Verificar si el cache está actualizado
  async isCacheUpToDate() {
    try {
      const productsRef = collection(db, this.productsCollection)
      const snapshot = await getDocs(productsRef)
      
      if (snapshot.empty) {
        return false
      }
      
      // Verificar si hay productos expirados
      const now = new Date()
      for (const doc of snapshot.docs) {
        const data = doc.data()
        if (data.expiresAt && new Date(data.expiresAt.toDate()) <= now) {
          return false
        }
      }
      
      return true
      
    } catch (error) {
      console.error('❌ Error verificando cache:', error)
      return false
    }
  }
}

// Exportar instancia única del servicio
export default new CacheService()
