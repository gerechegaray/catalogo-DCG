import { ref, getDownloadURL, getBytes } from 'firebase/storage'
import { storage } from '../config/firebase'

/**
 * Servicio para descargar el catálogo de productos desde Firebase Storage
 * 
 * Este servicio reemplaza la lectura de Firestore por una descarga más eficiente
 * de un archivo JSON único desde Firebase Storage.
 */
class StorageService {
  constructor() {
    // Nombres de los archivos JSON en Storage
    this.vetCatalogPath = 'catalog/veterinarios.json'
    this.petCatalogPath = 'catalog/petshops.json'
    
    // Cache en memoria para evitar descargas repetidas
    this.memoryCache = {
      veterinarios: null,
      petshops: null,
      timestamp: null
    }
    
    // TTL del cache en memoria: 5 minutos
    this.cacheTTL = 5 * 60 * 1000
  }

  /**
   * Descargar catálogo de productos desde Firebase Storage
   * @param {string} userType - Tipo de usuario: 'vet' o 'pet'
   * @returns {Promise<Array>} - Array de productos
   */
  async downloadCatalog(userType = 'vet') {
    try {
      // Determinar qué archivo descargar según el tipo de usuario
      const filePath = userType === 'pet' ? this.petCatalogPath : this.vetCatalogPath
      const cacheKey = userType === 'pet' ? 'petshops' : 'veterinarios'
      
      // Verificar cache en memoria
      if (this.isMemoryCacheValid(cacheKey)) {
        console.log(`📖 Usando cache en memoria para ${userType}`)
        return this.memoryCache[cacheKey]
      }
      
      console.log(`📥 Descargando catálogo ${userType} desde url directa...`)
      
      // Construir la URL pública de Storage (saltamos el SDK para evitar error 412/CORS bugs)
      const bucketUrl = "https://firebasestorage.googleapis.com/v0/b/catalogo-veterinaria-alegra.firebasestorage.app/o/catalog%2F";
      const fileName = userType === 'pet' ? 'petshops.json' : 'veterinarios.json';
      const url = `${bucketUrl}${fileName}?alt=media`;
      
      // Añadir timestamp para evitar cache extrema
      const fetchUrl = `${url}&t=${Date.now()}`;
      
      const response = await fetch(fetchUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} fetching ${fileName}`);
      }
      
      const products = await response.json();
      
      console.log(`✅ Catálogo ${userType} descargado: ${products.length} productos`)
      
      // Guardar en cache en memoria
      this.memoryCache[cacheKey] = products
      this.memoryCache.timestamp = Date.now()
      
      return products
      
    } catch (error) {
      console.error(`❌ Error descargando catálogo ${userType}:`, error)
      
      // En caso de error, intentar con el otro tipo de usuario como fallback
      if (error.code === 'storage/object-not-found') {
        console.log('⚠️ Archivo no encontrado, intentando fallback...')
        const fallbackPath = userType === 'pet' ? this.vetCatalogPath : this.petCatalogPath
        const fallbackRef = ref(storage, fallbackPath)
        
        try {
          const fallbackBytes = await getBytes(fallbackRef)
          const fallbackText = new TextDecoder().decode(fallbackBytes)
          const products = JSON.parse(fallbackText)
          console.log('✅ Usando catálogo alternativo como fallback')
          return products
        } catch (fallbackError) {
          console.error('❌ Fallback también falló:', fallbackError)
          throw error
        }
      }
      
      throw error
    }
  }

  /**
   * Verificar si el cache en memoria es válido
   * @param {string} cacheKey - Clave del cache
   * @returns {boolean}
   */
  isMemoryCacheValid(cacheKey) {
    if (!this.memoryCache[cacheKey] || !this.memoryCache.timestamp) {
      return false
    }
    
    const now = Date.now()
    const age = now - this.memoryCache.timestamp
    
    return age < this.cacheTTL
  }

  /**
   * Limpiar cache en memoria
   */
  clearMemoryCache() {
    this.memoryCache = {
      veterinarios: null,
      petshops: null,
      timestamp: null
    }
    console.log('🗑️ Cache en memoria limpiado')
  }

  /**
   * Forzar recarga del catálogo (útil para actualizaciones manuales)
   * @param {string} userType - Tipo de usuario
   * @returns {Promise<Array>}
   */
  async refreshCatalog(userType = 'vet') {
    // Limpiar cache antes de descargar
    this.clearMemoryCache()
    return this.downloadCatalog(userType)
  }

  /**
   * Verificar si los archivos del catálogo existen en Storage
   * Esto es útil para debugging y para mostrar estados en el admin
   */
  async checkCatalogExists(userType = 'vet') {
    try {
      const filePath = userType === 'pet' ? this.petCatalogPath : this.vetCatalogPath
      const fileRef = ref(storage, filePath)
      await getDownloadURL(fileRef)
      return true
    } catch (error) {
      // Si el archivo no existe o hay error de CORS, retornar false para usar fallback
      console.log(`⚠️ Catálogo no disponible en Storage para ${userType}:`, error.code || error.message)
      return false
    }
  }

  /**
   * Obtener la URL de descarga directa del catálogo
   * @param {string} userType - Tipo de usuario
   * @returns {Promise<string>}
   */
  async getCatalogDownloadURL(userType = 'vet') {
    const filePath = userType === 'pet' ? this.petCatalogPath : this.vetCatalogPath
    const fileRef = ref(storage, filePath)
    return await getDownloadURL(fileRef)
  }
}

// Exportar instancia única del servicio
export default new StorageService()

