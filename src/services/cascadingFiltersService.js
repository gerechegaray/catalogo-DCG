import categoryMappingService from './categoryMappingService'

// Servicio para manejar filtros escalonados (en cascada)
class CascadingFiltersService {
  constructor() {
    // Estructura de filtros escalonados para Veterinarios
    this.veterinariosFilters = {
      'medicamentos': {
        'antibioticos': {
          'zoetis': [],
          'pfizer': [],
          'merck': [],
          'generar': []
        },
        'vacunas': {
          'zoetis': [],
          'pfizer': [],
          'merck': [],
          'tecnovax': []
        },
        'analgesicos': {
          'zoetis': [],
          'pfizer': [],
          'merck': []
        },
        'antiparasitarios': {
          'zoetis': [],
          'pfizer': [],
          'merck': []
        }
      },
      'descartables': {
        'jeringas': {
          'euromix': [],
          'alfolatex': [],
          'pharma': []
        },
        'agujas': {
          'euromix': [],
          'alfolatex': [],
          'pharma': []
        },
        'guantes': {
          'ecco': [],
          'belen': [],
          'angiocat': []
        },
        'gasas': {
          'ecco': [],
          'belen': [],
          'angiocat': []
        }
      },
      'ortopedia': {
        'férulas': {
          'troquelados': []
        },
        'vendas': {
          'troquelados': []
        },
        'soportes': {
          'troquelados': []
        }
      },
      'alimento-perro': {
        'premium': {
          'old prince premium perro': [],
          'origen perro': []
        },
        'equilibrium': {
          'old prince equilibrium perro': []
        },
        'noveles': {
          'old prince noveles perro': []
        },
        'economico': {
          'manada': [],
          'seguidor': [],
          'company perro': [],
          'fawna perro': []
        }
      },
      'alimento-gato': {
        'premium': {
          'old prince premium gato': [],
          'origen gato': []
        },
        'equilibrium': {
          'old prince equilibrium gato': []
        },
        'economico': {
          'fawna gato': [],
          'company gato': []
        }
      }
    }

    // Estructura de filtros escalonados para Pet Shops
    this.petshopsFilters = {
      'salud-comportamiento': {
        'antiparasitarios': {
          'frontline': [],
          'advantix': [],
          'drontal': []
        },
        'higiene': {
          'royal canin': [],
          'hills': []
        },
        'comportamiento': {
          'royal canin': [],
          'hills': []
        }
      },
      'alimento-perro': {
        'premium': {
          'old prince premium perro': [],
          'origen perro': []
        },
        'equilibrium': {
          'old prince equilibrium perro': []
        },
        'noveles': {
          'old prince noveles perro': []
        },
        'economico': {
          'manada': [],
          'seguidor': [],
          'company perro': [],
          'fawna perro': []
        }
      },
      'alimento-gato': {
        'premium': {
          'old prince premium gato': [],
          'origen gato': []
        },
        'equilibrium': {
          'old prince equilibrium gato': []
        },
        'economico': {
          'fawna gato': [],
          'company gato': []
        }
      }
    }
  }

  // Obtener filtros para una sección específica
  getFiltersForSection(section) {
    return section === 'veterinarios' ? this.veterinariosFilters : this.petshopsFilters
  }

  // Categorías que tienen un nivel extra de "Laboratorio" antes de subcategoría
  hasLabLevel(section, mainCategory) {
    if (section === 'veterinarios' && mainCategory === 'medicamentos') return true
    if (section === 'petshops' && mainCategory === 'salud-comportamiento') return true
    return false
  }

  // Obtener opciones dinámicas para el nivel actual (basado en datos reales de Alegra)
  getCurrentLevelOptions(section, selectedPath = [], products = []) {
    if (selectedPath.length === 0) {
      // Nivel 1: categorías principales
      const options = Object.keys(this.getFiltersForSection(section))
      return options
    }

    const mainCategory = selectedPath[0]
    const usesLabLevel = this.hasLabLevel(section, mainCategory)

    if (usesLabLevel) {
      // --- CATEGORÍAS CON NIVEL LABORATORIO ---
      if (selectedPath.length === 1) {
        // Nivel 2: Laboratorios (description de Alegra)
        const filteredProducts = this.filterByMainCategory(section, mainCategory, products)
        const labs = [...new Set(
          filteredProducts
            .map(product => product.description)
            .filter(d => d)
        )]
        return labs.sort()
      } else if (selectedPath.length === 2) {
        // Nivel 3: Subcategorías dentro de ese laboratorio
        const lab = selectedPath[1]
        let filteredProducts = this.filterByMainCategory(section, mainCategory, products)
        filteredProducts = filteredProducts.filter(p => (p.description || '').toLowerCase() === lab.toLowerCase())
        const subcategories = [...new Set(
          filteredProducts
            .map(product => product.subcategory)
            .filter(s => s)
        )]
        return subcategories.length > 0 ? subcategories.sort() : null
      }
      return null
    } else {
      // --- CATEGORÍAS NORMALES (sin nivel laboratorio) ---
      if (selectedPath.length === 1) {
        // Nivel 2: subcategorías
        const filteredProducts = this.filterByMainCategory(section, mainCategory, products)
        const subcategories = [...new Set(
          filteredProducts
            .map(product => product.subcategory)
            .filter(subcategory => subcategory)
        )]
        return subcategories.sort()
      } else if (selectedPath.length === 2) {
        // Nivel 3: marcas/laboratorios (description de Alegra)
        const subcategory = selectedPath[1]
        let filteredProducts = this.filterByMainCategory(section, mainCategory, products)
        filteredProducts = this.filterBySubcategory(section, mainCategory, subcategory, filteredProducts)
        const brands = [...new Set(
          filteredProducts
            .map(product => product.description)
            .filter(description => description)
        )]
        return brands.sort()
      }
      return []
    }
  }

  // Verificar si el nivel actual tiene productos (es el último nivel)
  isLastLevel(section, selectedPath = []) {
    let current = this.getFiltersForSection(section)
    
    selectedPath.forEach(level => {
      if (current && current[level]) {
        current = current[level]
      }
    })
    
    return Array.isArray(current)
  }

  // Obtener la ruta completa como string para mostrar
  getPathString(selectedPath) {
    if (selectedPath.length === 0) return 'Categorías'
    
    return selectedPath.map(level => 
      level.charAt(0).toUpperCase() + level.slice(1).replace(/-/g, ' ')
    ).join(' → ')
  }

  // Contar productos en un nivel específico
  countProductsInLevel(section, selectedPath = [], products = []) {
    if (selectedPath.length === 0) {
      // Contar productos por categoría principal
      const filters = this.getFiltersForSection(section)
      const counts = {}
      
      Object.keys(filters).forEach(category => {
        counts[category] = this.countProductsInCategory(section, [category], products)
      })
      
      return counts
    }
    
    // Contar productos en el nivel actual
    const currentOptions = this.getCurrentLevelOptions(section, selectedPath, products)
    if (!currentOptions) return {}
    
    const counts = {}
    currentOptions.forEach(option => {
      counts[option] = this.countProductsInCategory(section, [...selectedPath, option], products)
    })
    
    return counts
  }

  // Contar productos en una categoría específica
  countProductsInCategory(section, path, products) {
    if (path.length === 0) return products.length
    
    let filteredProducts = products
    const mainCategory = path[0]
    const usesLabLevel = this.hasLabLevel(section, mainCategory)
    
    // Aplicar filtros progresivos
    path.forEach((level, index) => {
      if (index === 0) {
        filteredProducts = this.filterByMainCategory(section, level, filteredProducts)
      } else if (index === 1) {
        if (usesLabLevel) {
          // Nivel 2 = Laboratorio (description)
          filteredProducts = filteredProducts.filter(p => (p.description || '').toLowerCase() === level.toLowerCase())
        } else {
          filteredProducts = this.filterBySubcategory(section, path[0], level, filteredProducts)
        }
      } else if (index === 2) {
        if (usesLabLevel) {
          // Nivel 3 = Subcategory dentro de un lab
          filteredProducts = this.filterBySubcategory(section, path[0], level, filteredProducts)
        } else {
          filteredProducts = this.filterByBrand(section, path[0], path[1], level, filteredProducts)
        }
      }
    })
    
    return filteredProducts.length
  }

  // Filtrar productos por categoría principal (basado en marcas específicas)
  filterByMainCategory(section, category, products) {
    const filtered = products.filter(product => {
      // Para Pet Shops, usar description (marca/laboratorio) como categoría principal
      const productCategory = section === 'petshops' 
        ? (product.description || product.category || '').toLowerCase()
        : (product.category || product.description || '').toLowerCase()
      const productName = (product.name || '').toLowerCase()
      
       // Mapeo basado en las marcas específicas que me diste
       let matches = false
       switch (category) {
         case 'salud-comportamiento':
           // Para Pet Shops: usar las marcas definidas en categoryMappingService
           const brandsForSalud = section === 'petshops' 
             ? categoryMappingService.getBrandsForCategory('salud-comportamiento', true)
             : categoryMappingService.getBrandsForCategory('salud-comportamiento', false)
           
           // Verificar si el producto pertenece a alguna de las marcas definidas
           matches = brandsForSalud.some(brand => 
             productCategory.includes(brand.toLowerCase()) || 
             productName.includes(brand.toLowerCase())
           )
           break
         
         case 'medicamentos':
          // Generar, Elmer, Zoovet, Leon Pharma, Jenner, Ruminal, Tecnovax, Mervak, Zoetis
          matches = productCategory.includes('generar') || 
                   productCategory.includes('elmer') ||
                   productCategory.includes('zoovet') ||
                   productCategory.includes('leon pharma') ||
                   productCategory.includes('jenner') ||
                   productCategory.includes('ruminal') ||
                   productCategory.includes('tecnovax') ||
                   productCategory.includes('mervak') ||
                   productCategory.includes('zoetis') ||
                   productName.includes('generar') ||
                   productName.includes('elmer') ||
                   productName.includes('zoovet') ||
                   productName.includes('leon pharma') ||
                   productName.includes('jenner') ||
                   productName.includes('ruminal') ||
                   productName.includes('tecnovax') ||
                   productName.includes('mervak') ||
                   productName.includes('zoetis') ||
                   // Palabras clave genéricas para medicamentos
                   productName.includes('antidiarreico') ||
                   productName.includes('antibiotico') ||
                   productName.includes('vacuna') ||
                   productName.includes('analgesico') ||
                   productName.includes('antiparasitario') ||
                   productName.includes('medicamento')
          break
        
        case 'descartables':
          // Euromix, Alfolatex, Pharma, ECCO, Belen, Angiocat
          matches = productCategory.includes('euromix') || 
                   productCategory.includes('alfolatex') ||
                   (productCategory.includes('pharma') && !productCategory.includes('leon pharma')) ||
                   productCategory.includes('ecco') ||
                   productCategory.includes('belen') ||
                   productCategory.includes('angiocat') ||
                   productName.includes('euromix') ||
                   productName.includes('alfolatex') ||
                   (productName.includes('pharma') && !productName.includes('leon pharma')) ||
                   productName.includes('ecco') ||
                   productName.includes('belen') ||
                   productName.includes('angiocat') ||
                   // Palabras clave genéricas para descartables
                   productName.includes('jeringa') ||
                   productName.includes('aguja') ||
                   productName.includes('guante') ||
                   productName.includes('gasa') ||
                   productName.includes('descartable')
          break
        
        case 'ortopedia':
          // Troquelados
          matches = productCategory.includes('troquelados') || 
                   productName.includes('troquelados') ||
                   // Palabras clave genéricas para ortopedia
                   productName.includes('ferula') ||
                   productName.includes('venda') ||
                   productName.includes('soporte') ||
                   productName.includes('ortopedia')
          break
        
        case 'alimento-perro':
          // Origen perro, Old Prince Premium perro, Old Prince Equilibrium perro, Old Prince Noveles perro, Manada, Seguidor, Company perro, Fawna perro
          matches = (productCategory.includes('origen') && productCategory.includes('perro')) ||
                   (productCategory.includes('old prince') && productCategory.includes('perro')) ||
                   productCategory.includes('manada') ||
                   productCategory.includes('seguidor') ||
                   (productCategory.includes('company') && productCategory.includes('perro')) ||
                   (productCategory.includes('fawna') && productCategory.includes('perro')) ||
                   (productName.includes('origen') && productName.includes('perro')) ||
                   (productName.includes('old prince') && productName.includes('perro')) ||
                   productName.includes('manada') ||
                   productName.includes('seguidor') ||
                   (productName.includes('company') && productName.includes('perro')) ||
                   (productName.includes('fawna') && productName.includes('perro')) ||
                   // Palabras clave genéricas para alimento perro
                   (productName.includes('alimento') && productName.includes('perro')) ||
                   (productName.includes('food') && productName.includes('perro'))
          break
        
        case 'alimento-gato':
          // Old Prince Premium gato, Old Prince Equilibrium gato, Fawna gato, Origen gato, Company gato
          matches = (productCategory.includes('old prince') && productCategory.includes('gato')) ||
                   (productCategory.includes('fawna') && productCategory.includes('gato')) ||
                   (productCategory.includes('origen') && productCategory.includes('gato')) ||
                   (productCategory.includes('company') && productCategory.includes('gato')) ||
                   (productName.includes('old prince') && productName.includes('gato')) ||
                   (productName.includes('fawna') && productName.includes('gato')) ||
                   (productName.includes('origen') && productName.includes('gato')) ||
                   (productName.includes('company') && productName.includes('gato')) ||
                   // Palabras clave genéricas para alimento gato
                   (productName.includes('alimento') && productName.includes('gato')) ||
                   (productName.includes('food') && productName.includes('gato'))
          break
        
        default:
          matches = false
      }
      
      return matches
    })
    
    return filtered
  }

  // Filtrar productos por subcategoría (usando subcategory procesado por alegraService)
  filterBySubcategory(section, mainCategory, subcategory, products) {
    const filtered = products.filter(product => {
      // Usar subcategory procesado por alegraService
      const productSubcategory = (product.subcategory || '').toLowerCase()
      const subcategoryLower = subcategory.toLowerCase()
      
      return productSubcategory === subcategoryLower
    })
    
    return filtered
  }

  // Filtrar productos por marca/laboratorio (usando description de Alegra)
  filterByBrand(section, mainCategory, subcategory, brand, products) {
    const filtered = products.filter(product => {
      // Usar description de Alegra para la marca/laboratorio
      const productDescription = (product.description || '').toLowerCase()
      const brandLower = brand.toLowerCase()
      
      return productDescription === brandLower
    })
    
    return filtered
  }

  // Aplicar filtros escalonados a una lista de productos
  applyCascadingFilters(section, selectedPath, products) {
    if (selectedPath.length === 0) return products
    
    let filteredProducts = products
    const mainCategory = selectedPath[0]
    const usesLabLevel = this.hasLabLevel(section, mainCategory)
    
    selectedPath.forEach((level, index) => {
      if (index === 0) {
        filteredProducts = this.filterByMainCategory(section, level, filteredProducts)
      } else if (index === 1) {
        if (usesLabLevel) {
          // Nivel 2 = Laboratorio (description)
          filteredProducts = filteredProducts.filter(p => (p.description || '').toLowerCase() === level.toLowerCase())
        } else {
          filteredProducts = this.filterBySubcategory(section, selectedPath[0], level, filteredProducts)
        }
      } else if (index === 2) {
        if (usesLabLevel) {
          // Nivel 3 = Subcategory dentro de un lab
          filteredProducts = this.filterBySubcategory(section, selectedPath[0], level, filteredProducts)
        } else {
          filteredProducts = this.filterByBrand(section, selectedPath[0], selectedPath[1], level, filteredProducts)
        }
      }
    })
    
    return filteredProducts
  }
}

export default new CascadingFiltersService()
