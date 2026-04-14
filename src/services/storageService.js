/**
 * Catálogo estático servido por el mismo origen del sitio (p. ej. Vercel):
 * GET /catalog/veterinarios.json y /catalog/petshops.json
 * (generados en el repo por GitHub Actions → scripts/syncAlegra.js).
 */

class StorageService {
  constructor() {
    this.memoryCache = {
      veterinarios: null,
      petshops: null,
      timestamp: null
    }
    this.cacheTTL = 5 * 60 * 1000
  }

  /**
   * @param {string} userType - 'vet' | 'pet'
   * @returns {Promise<Array>}
   */
  async downloadCatalog(userType = 'vet') {
    const fileName = userType === 'pet' ? 'petshops.json' : 'veterinarios.json'
    const cacheKey = userType === 'pet' ? 'petshops' : 'veterinarios'

    if (this.isMemoryCacheValid(cacheKey)) {
      console.log(`📖 Usando cache en memoria para ${userType}`)
      return this.memoryCache[cacheKey]
    }

    const url = `/catalog/${fileName}?t=${Date.now()}`
    console.log(`📥 Descargando catálogo ${userType} desde ${url.split('?')[0]}...`)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} al obtener ${fileName}`)
    }

    const products = await response.json()
    console.log(`✅ Catálogo ${userType}: ${products.length} productos`)

    this.memoryCache[cacheKey] = products
    this.memoryCache.timestamp = Date.now()
    return products
  }

  isMemoryCacheValid(cacheKey) {
    if (!this.memoryCache[cacheKey] || !this.memoryCache.timestamp) {
      return false
    }
    return Date.now() - this.memoryCache.timestamp < this.cacheTTL
  }

  clearMemoryCache() {
    this.memoryCache = {
      veterinarios: null,
      petshops: null,
      timestamp: null
    }
    console.log('🗑️ Cache en memoria del catálogo limpiado')
  }

  async refreshCatalog(userType = 'vet') {
    this.clearMemoryCache()
    return this.downloadCatalog(userType)
  }

  /**
   * Comprueba si el JSON del catálogo responde (misma ruta que en producción).
   * @param {string} userType
   * @returns {Promise<boolean>}
   */
  async checkStaticCatalogExists(userType = 'vet') {
    const fileName = userType === 'pet' ? 'petshops.json' : 'veterinarios.json'
    try {
      const res = await fetch(`/catalog/${fileName}?t=${Date.now()}`, { method: 'GET' })
      return res.ok
    } catch {
      return false
    }
  }
}

export default new StorageService()
