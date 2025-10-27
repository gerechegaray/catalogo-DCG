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
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '../config/firebase'
import storageService from './storageService'

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
      // console.log('💾 Guardando productos en cache...')
      
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
      // console.log(`✅ ${products.length} productos guardados en cache`)
      
    } catch (error) {
      console.error('❌ Error guardando productos en cache:', error)
      throw error
    }
  }

  // Obtener productos del cache
  async getProductsFromCache() {
    try {
      // console.log('📖 Obteniendo productos del cache...')
      
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
      
      // console.log(`📖 ${products.length} productos obtenidos del cache`)
      return products
      
    } catch (error) {
      console.error('❌ Error obteniendo productos del cache:', error)
      return []
    }
  }

  // Limpiar cache de productos
  async clearProductsCache() {
    try {
      // console.log('🗑️ Limpiando cache de productos...')
      
      const productsRef = collection(db, this.productsCollection)
      const snapshot = await getDocs(productsRef)
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      // console.log('✅ Cache de productos limpiado')
      
    } catch (error) {
      console.error('❌ Error limpiando cache:', error)
    }
  }

  // Limpiar todo el cache (productos y analytics)
  async clearAll() {
    try {
      // console.log('🗑️ Limpiando todo el cache...')
      
      // Limpiar productos
      await this.clearProductsCache()
      
      // Limpiar analytics
      const analyticsRef = collection(db, this.analyticsCollection)
      const snapshot = await getDocs(analyticsRef)
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      // console.log('✅ Todo el cache limpiado')
      
    } catch (error) {
      console.error('❌ Error limpiando todo el cache:', error)
      throw error
    }
  }

  // Registrar vista de producto (analytics)
  async recordProductView(productId, userType = 'unknown') {
    try {
      // Validar que productId no sea undefined o null
      if (!productId) {
        console.warn('⚠️ recordProductView: productId es undefined o null')
        return
      }
      
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

  // Registrar navegación entre páginas
  async recordPageView(pageName, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'page_view',
        pageName: pageName.toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando vista de página:', error)
    }
  }

  // Registrar click en navbar
  async recordNavbarClick(linkName, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'navbar_click',
        linkName: linkName.toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando click en navbar:', error)
    }
  }

  // Registrar click en anuncio/comunicado
  async recordAdClick(adId, adTitle, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'ad_click',
        adId: adId.toString(),
        adTitle: adTitle.toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando click en anuncio:', error)
    }
  }

  // Registrar click en producto destacado
  async recordFeaturedProductClick(productId, productName, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'featured_product_click',
        productId: productId.toString(),
        productName: productName.toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando click en producto destacado:', error)
    }
  }

  // Registrar click en "Ver Producto"
  async recordViewProductClick(productId, productName, userType = 'unknown') {
    try {
      console.log('🔍 Debug recordViewProductClick:', {
        productId,
        productName,
        userType,
        productIdType: typeof productId,
        productNameType: typeof productName
      })
      
      // Validar que productId no sea undefined o null
      if (!productId) {
        console.warn('⚠️ recordViewProductClick: productId es undefined o null')
        return
      }
      
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'view_product_click',
        productId: productId.toString(),
        productName: (productName || `Producto ${productId}`).toString(),
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
      
      console.log('✅ recordViewProductClick guardado exitosamente')
    } catch (error) {
      console.error('❌ Error registrando click en ver producto:', error)
    }
  }

  // Registrar agregar al carrito
  async recordAddToCart(productId, productName, quantity = 1, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'add_to_cart',
        productId: productId.toString(),
        productName: productName.toString(),
        quantity: quantity,
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando agregar al carrito:', error)
    }
  }

  // Registrar envío de pedido por WhatsApp
  async recordWhatsAppOrder(productIds, productNames, userType = 'unknown') {
    try {
      const analyticsRef = doc(collection(db, this.analyticsCollection))
      await setDoc(analyticsRef, {
        type: 'whatsapp_order',
        productIds: productIds.map(id => id.toString()),
        productNames: productNames,
        userType,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('❌ Error registrando pedido por WhatsApp:', error)
    }
  }

  // Obtener analytics de productos más vistos
  async getTopViewedProducts(limitCount = 10) {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_view')
        // Removemos orderBy para evitar problemas de índice
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

  // Obtener analytics completas con nombres de productos
  async getAnalytics(products = []) {
    try {
      const [
        topViewed, 
        pageViews,
        navbarClicks,
        adClicks,
        featuredClicks,
        viewProductClicks,
        addToCartClicks,
        whatsappOrders
      ] = await Promise.all([
        this.getTopViewedProducts(10),
        this.getPageViews(),
        this.getNavbarClicks(),
        this.getAdClicks(),
        this.getFeaturedProductClicks(),
        this.getViewProductClicks(),
        this.getAddToCartClicks(),
        this.getWhatsAppOrders()
      ])

      // Crear mapa de productos para obtener nombres
      const productsMap = {}
      products.forEach(product => {
        productsMap[product.id] = product
      })

      // Combinar vistas de productos y clicks en "Ver Producto"
      const combinedProductViews = {}
      
      // Agregar vistas de productos
      topViewed.forEach(item => {
        combinedProductViews[item.productId] = {
          productId: item.productId,
          views: item.views || 0,
          clicks: 0
        }
      })
      
      // Agregar clicks en "Ver Producto"
      viewProductClicks.forEach(item => {
        if (combinedProductViews[item.productId]) {
          combinedProductViews[item.productId].clicks = item.clicks || 0
          // Asegurar que tenemos el nombre del producto
          if (!combinedProductViews[item.productId].productName) {
            combinedProductViews[item.productId].productName = item.productName
          }
        } else {
          combinedProductViews[item.productId] = {
            productId: item.productId,
            views: 0,
            clicks: item.clicks || 0,
            productName: item.productName // Usar el nombre que viene de analytics
          }
        }
      })
      
      // Convertir a array y enriquecer con nombres
      const enrichedCombinedViews = Object.values(combinedProductViews)
        .map(item => ({
          ...item,
          totalInteractions: item.views + item.clicks,
          productName: item.productName || productsMap[item.productId]?.name || `Producto ${item.productId}`,
          productImage: productsMap[item.productId]?.image || null
        }))
        .sort((a, b) => b.totalInteractions - a.totalInteractions)
        .slice(0, 10)

      return {
        totalProducts: products.length,
        topViewedProducts: enrichedCombinedViews,
        pageViews: pageViews.slice(0, 10), // Mostrar todas las páginas con detalles específicos
        navbarClicks: navbarClicks.slice(0, 10),
        adClicks: adClicks.slice(0, 10),
        featuredClicks: featuredClicks.slice(0, 10),
        addToCartClicks: addToCartClicks.slice(0, 10),
        whatsappOrders,
        cacheStatus: await this.isCacheUpToDate() ? 'valid' : 'expired'
      }

    } catch (error) {
      console.error('❌ Error obteniendo analytics:', error)
      return {
        totalProducts: products.length,
        topViewedProducts: [],
        pageViews: [],
        navbarClicks: [],
        adClicks: [],
        featuredClicks: [],
        viewProductClicks: [],
        addToCartClicks: [],
        whatsappOrders: [],
        cacheStatus: 'error'
      }
    }
  }

  // Obtener total de vistas
  async getTotalViews() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_view')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.size
      
    } catch (error) {
      console.error('❌ Error obteniendo total de vistas:', error)
      return 0
    }
  }

  // Obtener total de selecciones
  async getTotalSelections() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_selection')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.size
      
    } catch (error) {
      console.error('❌ Error obteniendo total de selecciones:', error)
      return 0
    }
  }

  // Obtener vistas de páginas
  async getPageViews() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'page_view')
      )
      
      const snapshot = await getDocs(q)
      const pageViews = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const pageName = data.pageName
        
        if (!pageViews[pageName]) {
          pageViews[pageName] = 0
        }
        pageViews[pageName]++
      })
      
      return Object.entries(pageViews)
        .map(([pageName, views]) => ({ pageName, views }))
        .sort((a, b) => b.views - a.views)
      
    } catch (error) {
      console.error('❌ Error obteniendo vistas de páginas:', error)
      return []
    }
  }

  // Obtener clicks en navbar
  async getNavbarClicks() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'navbar_click')
      )
      
      const snapshot = await getDocs(q)
      const navbarClicks = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const linkName = data.linkName
        
        if (!navbarClicks[linkName]) {
          navbarClicks[linkName] = 0
        }
        navbarClicks[linkName]++
      })
      
      return Object.entries(navbarClicks)
        .map(([linkName, clicks]) => ({ linkName, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
      
    } catch (error) {
      console.error('❌ Error obteniendo clicks en navbar:', error)
      return []
    }
  }

  // Obtener clicks en anuncios
  async getAdClicks() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'ad_click')
      )
      
      const snapshot = await getDocs(q)
      const adClicks = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const adTitle = data.adTitle
        
        if (!adClicks[adTitle]) {
          adClicks[adTitle] = 0
        }
        adClicks[adTitle]++
      })
      
      return Object.entries(adClicks)
        .map(([adTitle, clicks]) => ({ adTitle, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
      
    } catch (error) {
      console.error('❌ Error obteniendo clicks en anuncios:', error)
      return []
    }
  }

  // Obtener clicks en productos destacados
  async getFeaturedProductClicks() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'featured_product_click')
      )
      
      const snapshot = await getDocs(q)
      const featuredClicks = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const productName = data.productName
        
        if (!featuredClicks[productName]) {
          featuredClicks[productName] = 0
        }
        featuredClicks[productName]++
      })
      
      return Object.entries(featuredClicks)
        .map(([productName, clicks]) => ({ productName, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
      
    } catch (error) {
      console.error('❌ Error obteniendo clicks en productos destacados:', error)
      return []
    }
  }

  // Obtener clicks en "Ver Producto"
  async getViewProductClicks() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'view_product_click')
      )
      
      const snapshot = await getDocs(q)
      const viewClicks = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const productId = data.productId
        const productName = data.productName
        
        if (!viewClicks[productId]) {
          viewClicks[productId] = {
            productId,
            productName,
            clicks: 0
          }
        }
        viewClicks[productId].clicks++
      })
      
      return Object.values(viewClicks)
        .sort((a, b) => b.clicks - a.clicks)
      
    } catch (error) {
      console.error('❌ Error obteniendo clicks en ver producto:', error)
      return []
    }
  }

  // Obtener agregar al carrito
  async getAddToCartClicks() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'add_to_cart')
      )
      
      const snapshot = await getDocs(q)
      const cartClicks = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const productName = data.productName
        
        if (!cartClicks[productName]) {
          cartClicks[productName] = 0
        }
        cartClicks[productName]++
      })
      
      return Object.entries(cartClicks)
        .map(([productName, clicks]) => ({ productName, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
      
    } catch (error) {
      console.error('❌ Error obteniendo agregar al carrito:', error)
      return []
    }
  }

  // Obtener pedidos por WhatsApp
  async getWhatsAppOrders() {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'whatsapp_order')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.size
      
    } catch (error) {
      console.error('❌ Error obteniendo pedidos por WhatsApp:', error)
      return 0
    }
  }

  // Limpiar todas las analytics
  async clearAllAnalytics() {
    try {
      console.log('🗑️ Limpiando todas las analytics...')
      
      const analyticsRef = collection(db, this.analyticsCollection)
      const snapshot = await getDocs(analyticsRef)
      
      const batch = writeBatch(db)
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref)
      })
      
      await batch.commit()
      console.log('✅ Analytics limpiadas exitosamente')
      
    } catch (error) {
      console.error('❌ Error limpiando analytics:', error)
      throw error
    }
  }

  // Obtener analytics con filtros de fecha
  async getAnalyticsWithDateFilter(startDate, endDate, products = []) {
    try {
      const startTimestamp = new Date(startDate)
      const endTimestamp = new Date(endDate)
      endTimestamp.setHours(23, 59, 59, 999) // Incluir todo el día final

      const [topViewed] = await Promise.all([
        this.getTopViewedProductsWithDateFilter(startTimestamp, endTimestamp, 10)
      ])

      // Crear mapa de productos para obtener nombres
      const productsMap = {}
      products.forEach(product => {
        productsMap[product.id] = product
      })

      // Enriquecer datos con nombres de productos
      const enrichedTopViewed = topViewed.map(item => ({
        ...item,
        productName: productsMap[item.productId]?.name || `Producto ${item.productId}`,
        productImage: productsMap[item.productId]?.image || null
      }))

      return {
        totalProducts: products.length,
        topViewedProducts: enrichedTopViewed,
        cacheStatus: await this.isCacheUpToDate() ? 'valid' : 'expired',
        dateRange: { startDate, endDate }
      }

    } catch (error) {
      console.error('❌ Error obteniendo analytics con filtro de fecha:', error)
      return {
        totalProducts: products.length,
        topViewedProducts: [],
        cacheStatus: 'error',
        dateRange: { startDate, endDate }
      }
    }
  }

  // Obtener productos más vistos con filtro de fecha
  async getTopViewedProductsWithDateFilter(startDate, endDate, limitCount = 10) {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_view')
        // Simplificamos la consulta para evitar problemas de índice
      )
      
      const snapshot = await getDocs(q)
      const productViews = {}
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const productId = data.productId
        const timestamp = data.timestamp?.toDate()
        
        // Filtrar por fecha en el cliente
        if (timestamp && timestamp >= startDate && timestamp <= endDate) {
          if (!productViews[productId]) {
            productViews[productId] = 0
          }
          productViews[productId]++
        }
      })
      
      // Convertir a array y ordenar
      const topProducts = Object.entries(productViews)
        .map(([productId, views]) => ({ productId, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limitCount)
      
      return topProducts
      
    } catch (error) {
      console.error('❌ Error obteniendo productos más vistos con filtro:', error)
      return []
    }
  }

  // Obtener total de vistas con filtro de fecha
  async getTotalViewsWithDateFilter(startDate, endDate) {
    try {
      const analyticsRef = collection(db, this.analyticsCollection)
      const q = query(
        analyticsRef,
        where('type', '==', 'product_view')
      )
      
      const snapshot = await getDocs(q)
      let count = 0
      
      snapshot.forEach(doc => {
        const data = doc.data()
        const timestamp = data.timestamp?.toDate()
        
        // Filtrar por fecha en el cliente
        if (timestamp && timestamp >= startDate && timestamp <= endDate) {
          count++
        }
      })
      
      return count
      
    } catch (error) {
      console.error('❌ Error obteniendo total de vistas con filtro:', error)
      return 0
    }
  }

  // Limpiar datos corruptos de analytics
  async cleanCorruptedAnalytics() {
    try {
      // Obtener todos los documentos de analytics
      const analyticsRef = collection(db, this.analyticsCollection)
      const snapshot = await getDocs(analyticsRef)
      
      const batch = writeBatch(db)
      let deletedCount = 0
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        
        // Eliminar documentos con productId undefined, null o vacío
        if (!data.productId || data.productId === 'undefined' || data.productId === 'null' || data.productId === '') {
          batch.delete(doc.ref)
          deletedCount++
        }
        
        // Eliminar documentos con productName undefined o null
        if (data.productName === 'undefined' || data.productName === 'null') {
          batch.delete(doc.ref)
          deletedCount++
        }
      })
      
      if (deletedCount > 0) {
        await batch.commit()
        console.log(`✅ Eliminados ${deletedCount} documentos corruptos`)
      } else {
        console.log('✅ No se encontraron documentos corruptos')
      }
      
    } catch (error) {
      console.error('❌ Error limpiando datos corruptos:', error)
      throw error
    }
  }

  // ============================================
  // NUEVOS MÉTODOS: USANDO FIREBASE STORAGE
  // ============================================
  
  /**
   * Obtener productos desde Firebase Storage
   * Este es el nuevo método que reemplaza la lectura desde Firestore
   * @param {string} userType - 'vet' o 'pet'
   * @returns {Promise<Array>} - Array de productos
   */
  async getProductsFromStorage(userType = 'vet') {
    try {
      console.log(`📥 Obteniendo productos desde Storage para ${userType}...`)
      const products = await storageService.downloadCatalog(userType)
      console.log(`✅ ${products.length} productos obtenidos desde Storage`)
      return products
    } catch (error) {
      console.error('❌ Error obteniendo productos desde Storage:', error)
      // Fallback: intentar obtener desde Firestore
      console.log('🔄 Intentando fallback con Firestore...')
      return this.getProductsFromCache()
    }
  }

  /**
   * Verificar si los archivos del catálogo existen en Storage
   * @param {string} userType - 'vet' o 'pet'
   * @returns {Promise<boolean>}
   */
  async isStorageCatalogAvailable(userType = 'vet') {
    try {
      return await storageService.checkCatalogExists(userType)
    } catch (error) {
      console.error('❌ Error verificando catálogo en Storage:', error)
      return false
    }
  }

  /**
   * Método híbrido: intenta Storage primero, luego Firestore
   * @param {string} userType - 'vet' o 'pet'
   * @returns {Promise<Array>} - Array de productos
   */
  async getProductsHybrid(userType = 'vet') {
    try {
      // Intentar obtener desde Storage primero
      const storageAvailable = await this.isStorageCatalogAvailable(userType)
      
      if (storageAvailable) {
        console.log('✅ Usando Storage como fuente principal')
        return await this.getProductsFromStorage(userType)
      } else {
        console.log('⚠️ Storage no disponible, usando Firestore')
        return await this.getProductsFromCache()
      }
    } catch (error) {
      console.error('❌ Error en método híbrido:', error)
      // Último fallback: leer desde Firestore
      return this.getProductsFromCache()
    }
  }

  /**
   * Verificar si el cache está actualizado
   * Nueva versión que verifica tanto Storage como Firestore
   * @returns {Promise<boolean>}
   */
  async isCacheUpToDateHybrid(userType = 'vet') {
    try {
      // Verificar primero si existe catálogo en Storage
      const storageExists = await this.isStorageCatalogAvailable(userType)
      
      if (storageExists) {
        // Si existe en Storage, considerar que está actualizado
        // (la actualización diaria se hace desde la Cloud Function)
        return true
      }
      
      // Si no existe en Storage, verificar el cache viejo de Firestore
      return await this.isCacheUpToDate()
    } catch (error) {
      console.error('❌ Error verificando cache híbrido:', error)
      return false
    }
  }

  /**
   * Forzar recarga del catálogo desde Storage
   * Útil para actualizaciones manuales en el admin
   * @param {string} userType - 'vet' o 'pet'
   * @returns {Promise<Array>} - Array de productos
   */
  async refreshCatalogFromStorage(userType = 'vet') {
    try {
      console.log(`🔄 Forzando recarga del catálogo ${userType}...`)
      return await storageService.refreshCatalog(userType)
    } catch (error) {
      console.error('❌ Error recargando catálogo desde Storage:', error)
      throw error
    }
  }
}

// Exportar instancia única del servicio
export default new CacheService()
