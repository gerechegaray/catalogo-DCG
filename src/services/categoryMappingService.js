// Servicio para mapear marcas/laboratorios a categorías específicas
class CategoryMappingService {
  constructor() {
    // Mapeo de marcas a categorías
    this.brandToCategoryMap = {
      // Descartables
      'euromix': 'descartables',
      'alfolatex': 'descartables',
      'pharma': 'descartables',
      'ecco': 'descartables',
      'belen': 'descartables',
      'angiocat': 'descartables',
      
      // Medicamentos
      'generar': 'medicamentos',
      'elmer': 'medicamentos',
      'zoovet': 'medicamentos',
      'leon pharma': 'medicamentos',
      'jenner': 'medicamentos',
      'ruminal': 'medicamentos',
      'tecnovax': 'medicamentos',
      
      // Ortopedia
      'troquelados': 'ortopedia',
      
      // Alimento Perro
      'origen perro': 'alimento-perro',
      'old prince premium perro': 'alimento-perro',
      'old prince equilibrium perro': 'alimento-perro',
      'old prince noveles perro': 'alimento-perro',
      'manada': 'alimento-perro',
      'seguidor': 'alimento-perro',
      'company perro': 'alimento-perro',
      'fawna perro': 'alimento-perro',
      
      // Alimento Gato
      'old prince premium gato': 'alimento-gato',
      'old prince equilibrium gato': 'alimento-gato',
      'fawna gato': 'alimento-gato',
      'origen gato': 'alimento-gato',
      'company gato': 'alimento-gato'
    }
    
     // Categorías disponibles para la navbar
     this.navbarCategories = [
       { id: 'descartables', name: 'DESCARTABLES', brands: ['euromix', 'alfolatex', 'pharma', 'ecco', 'belen', 'angiocat'] }, // Pharma (no Leon Pharma)
       { id: 'medicamentos', name: 'MEDICAMENTOS', brands: ['generar', 'elmer', 'zoovet', 'leon pharma', 'jenner', 'ruminal', 'tecnovax', 'mervak', 'zoetis'] },
       { id: 'ortopedia', name: 'ORTOPEDIA', brands: ['troquelados'] },
       { id: 'alimento-perro', name: 'ALIMENTO PERRO', brands: ['origen perro', 'old prince premium perro', 'old prince equilibrium perro', 'old prince noveles perro', 'manada', 'seguidor', 'company perro', 'fawna perro'] },
       { id: 'alimento-gato', name: 'ALIMENTO GATO', brands: ['old prince premium gato', 'old prince equilibrium gato', 'fawna gato', 'origen gato', 'company gato'] }
     ]
     
     // Categorías específicas para Pet Shops
     this.petshopsNavbarCategories = [
       { id: 'salud-comportamiento', name: 'SALUD Y COMPORTAMIENTO', brands: ['frontline', 'advantix', 'drontal', 'royal canin', 'hills', 'generar', 'elmer', 'zoovet', 'leon pharma', 'jenner', 'ruminal', 'tecnovax', 'mervak', 'zoetis'] },
       { id: 'alimento-perro', name: 'ALIMENTO PERRO', brands: ['origen perro', 'old prince premium perro', 'old prince equilibrium perro', 'old prince noveles perro', 'manada', 'seguidor', 'company perro', 'fawna perro'] },
       { id: 'alimento-gato', name: 'ALIMENTO GATO', brands: ['old prince premium gato', 'old prince equilibrium gato', 'fawna gato', 'origen gato', 'company gato'] }
     ]
  }

  // Obtener categoría de una marca
  getCategoryFromBrand(brandName) {
    if (!brandName) return null
    
    const normalizedBrand = brandName.toLowerCase().trim()
    
    // Buscar coincidencia exacta
    if (this.brandToCategoryMap[normalizedBrand]) {
      return this.brandToCategoryMap[normalizedBrand]
    }
    
    // Buscar coincidencia parcial (para casos como "Old Prince Premium Perro")
    for (const [brand, category] of Object.entries(this.brandToCategoryMap)) {
      if (normalizedBrand.includes(brand) || brand.includes(normalizedBrand)) {
        return category
      }
    }
    
    return null
  }

   // Obtener todas las categorías para la navbar
   getNavbarCategories() {
     return this.navbarCategories
   }
   
   // Obtener categorías específicas para Pet Shops
   getNavbarCategoriesForPetShops() {
     return this.petshopsNavbarCategories
   }

  // Obtener marcas de una categoría
  getBrandsForCategory(categoryId, isPetShop = false) {
    const categories = isPetShop ? this.petshopsNavbarCategories : this.navbarCategories
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.brands : []
  }

  // Filtrar productos por categoría de navbar
  filterProductsByNavbarCategory(products, categoryId) {
    const brands = this.getBrandsForCategory(categoryId)
    if (!brands.length) return products
    
    return products.filter(product => {
      // Usar tanto product.category como product.description para la marca
      const productBrand = (product.category || product.description || '').toLowerCase().trim()
      return brands.some(brand => 
        productBrand.includes(brand.toLowerCase()) || 
        brand.toLowerCase().includes(productBrand)
      )
    })
  }

  // Obtener estadísticas de productos por categoría
  getCategoryStats(products) {
    const stats = {}
    
    this.navbarCategories.forEach(category => {
      const filteredProducts = this.filterProductsByNavbarCategory(products, category.id)
      stats[category.id] = {
        name: category.name,
        count: filteredProducts.length,
        brands: category.brands
      }
    })
    
    return stats
  }
}

export default new CategoryMappingService()
