// Servicio para integrar con Alegra API
class AlegraService {
  constructor() {
    // Configuración de Alegra - TEMPORAL para pruebas
    this.baseURL = 'https://api.alegra.com/api/v1'
    this.apiKey = 'gerechegaray@gmail.com:79e207afe8c4464a8d90'
    
    // Configuración alternativa desde variables de entorno (si están disponibles)
    const envApiKey = import.meta.env.VITE_ALEGRA_API_KEY
    const envBaseUrl = import.meta.env.VITE_ALEGRA_BASE_URL
    
    if (envApiKey && envApiKey !== 'tu-api-key-de-alegra') {
      this.apiKey = envApiKey
      this.baseURL = envBaseUrl || this.baseURL
      console.log('✅ API Key de Alegra cargada desde variables de entorno')
    } else {
      console.log('⚠️ Usando API Key de Alegra hardcodeada (temporal)')
    }
    
    this.headers = {
      'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
      'Content-Type': 'application/json'
    }
  }

  // Obtener todos los productos con paginación automática
  async getAllProducts() {
    try {
      console.log('🔄 Iniciando sincronización con Alegra...')
      
      let allProducts = []
      let page = 1
      let hasMore = true
      
      while (hasMore) {
        console.log(`📄 Obteniendo página ${page}...`)
        
        const response = await fetch(`${this.baseURL}/items?start=${(page - 1) * 30}&limit=30`, {
          headers: this.headers
        })
        
        if (!response.ok) {
          throw new Error(`Error en Alegra API: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Procesar productos de esta página
        const processedProducts = this.processProducts(data)
        allProducts = [...allProducts, ...processedProducts]
        
        // Verificar si hay más páginas
        hasMore = data.length === 30 // Si devuelve menos de 30, no hay más páginas
        
        page++
        
        // Evitar loops infinitos
        if (page > 50) {
          console.warn('⚠️ Límite de páginas alcanzado')
          break
        }
      }
      
      console.log(`✅ Sincronización completa: ${allProducts.length} productos obtenidos`)
      return allProducts
      
    } catch (error) {
      console.error('❌ Error en sincronización con Alegra:', error)
      throw error
    }
  }

  // Procesar productos de Alegra al formato de nuestra app
  processProducts(alegraProducts) {
    return alegraProducts
      .filter(product => product.status === 'active') // Solo productos activos
      .map(product => {
      // Determinar tipo de usuario basado en las listas de precios
      const userType = this.determineUserTypeFromPriceLists(product.price)
      
      // Obtener precio según el tipo de usuario
      const price = this.getPriceForUserType(product.price, userType)
      
      return {
        id: product.id,
        name: product.name,
        description: product.description, // Marca/Laboratorio
        price: price,
        stock: product.inventory?.availableQuantity || 0,
        category: product.description || '', // Marca/Laboratorio como categoría principal
        subcategory: product.itemCategory?.name || '', // Subcategoría específica
        supplier: product.description || '', // Marca/Laboratorio
        userType: userType,
        image: product.images?.[0]?.url || '',
        code: product.reference || '',
        unit: product.inventory?.unit || 'unidad',
        // Campos específicos de Alegra
        alegraId: product.id,
        lastUpdated: new Date().toISOString(),
        // Datos adicionales
        status: product.status,
        warehouses: product.inventory?.warehouses || [],
        priceLists: product.price || []
      }
    })
  }

  // Determinar tipo de usuario basado en las listas de precios
  determineUserTypeFromPriceLists(priceLists) {
    if (!priceLists || !Array.isArray(priceLists)) {
      return 'vet' // Por defecto veterinarios
    }
    
    // TODOS los productos son para veterinarios (tienen lista "General")
    // Los productos con lista "pet" también son visibles para pet shops
    // Pero el filtrado se hace en el contexto, no aquí
    return 'vet'
  }

  // Determinar si un producto es visible para pet shops
  isVisibleForPetShops(priceLists) {
    if (!priceLists || !Array.isArray(priceLists)) {
      return false
    }
    
    // Buscar lista "pet" para pet shops
    return priceLists.some(price => 
      price.name && price.name.toLowerCase().includes('pet')
    )
  }

  // Obtener precio según el tipo de usuario
  getPriceForUserType(priceLists, userType) {
    if (!priceLists || !Array.isArray(priceLists)) {
      return 0
    }
    
    let targetPriceList = null
    
    if (userType === 'pet') {
      // Para pet shops, buscar lista "pet" (precio específico para pet shops)
      targetPriceList = priceLists.find(price => 
        price.name && price.name.toLowerCase().includes('pet')
      )
    } else {
      // Para veterinarios, buscar lista "general" (precio general)
      targetPriceList = priceLists.find(price => 
        price.name && price.name.toLowerCase().includes('general')
      )
    }
    
    // Si no encuentra la lista específica, usar la principal
    if (!targetPriceList) {
      targetPriceList = priceLists.find(price => price.main === true)
    }
    
    // Si aún no encuentra nada, usar el primer precio disponible
    if (!targetPriceList && priceLists.length > 0) {
      targetPriceList = priceLists[0]
    }
    
    return targetPriceList ? parseFloat(targetPriceList.price) : 0
  }

  // Mapear categorías de Alegra a nuestras categorías
  mapCategory(alegraCategory) {
    const categoryMap = {
      'medicamentos': 'medicamentos',
      'vacunas': 'vacunas',
      'equipos': 'equipos',
      'instrumentos': 'instrumentos',
      'alimentos': 'alimentos',
      'accesorios': 'accesorios',
      'juguetes': 'juguetes',
      'higiene': 'higiene'
    }
    
    return categoryMap[alegraCategory.toLowerCase()] || 'otros'
  }

  // Determinar si el producto es para veterinarios o pet shops
  determineUserType(product) {
    const veterinaryKeywords = ['medicamento', 'vacuna', 'equipo', 'instrumento', 'reactivo']
    const petShopKeywords = ['alimento', 'juguete', 'accesorio', 'higiene', 'cama']
    
    const productName = (product.name || '').toLowerCase()
    const category = (product.category?.name || '').toLowerCase()
    
    // Verificar palabras clave veterinarias
    if (veterinaryKeywords.some(keyword => 
      productName.includes(keyword) || category.includes(keyword)
    )) {
      return 'vet'
    }
    
    // Verificar palabras clave pet shop
    if (petShopKeywords.some(keyword => 
      productName.includes(keyword) || category.includes(keyword)
    )) {
      return 'pet'
    }
    
    // Por defecto, veterinarios
    return 'vet'
  }

  // Obtener productos por tipo de usuario
  async getProductsForUserType(userType) {
    const allProducts = await this.getAllProducts()
    return allProducts.filter(product => product.userType === userType)
  }

  // Obtener productos por categoría
  async getProductsByCategory(category) {
    const allProducts = await this.getAllProducts()
    return allProducts.filter(product => product.category === category)
  }

  // Buscar productos por nombre
  async searchProducts(query) {
    const allProducts = await this.getAllProducts()
    const searchTerm = query.toLowerCase()
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.supplier.toLowerCase().includes(searchTerm)
    )
  }
}

// Exportar instancia única del servicio
export default new AlegraService()
