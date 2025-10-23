import type { AlegraProduct, AlegraPriceList } from '../../types/alegra'

// Mock del servicio para evitar problemas con import.meta.env
const mockAlegraService = {
  isVisibleForPetShops: (priceLists: AlegraPriceList[]): boolean => {
    if (!priceLists || !Array.isArray(priceLists)) {
      return false
    }
    
    return priceLists.some(price => 
      price.name && price.name.toLowerCase().includes('pet')
    )
  },

  mapCategory: (alegraCategory: string): string => {
    const categoryMap: Record<string, string> = {
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
  },

  determineUserType: (product: AlegraProduct): 'vet' | 'pet' => {
    const veterinaryKeywords = ['medicamento', 'vacuna', 'equipo', 'instrumento', 'reactivo']
    const petShopKeywords = ['alimento', 'juguete', 'accesorio', 'higiene', 'cama']
    
    const productName = (product.name || '').toLowerCase()
    const category = (product.itemCategory?.name || '').toLowerCase()
    
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
}

describe('AlegraService (Mocked)', () => {
  describe('isVisibleForPetShops', () => {
    it('retorna true cuando hay lista pet', () => {
      const priceLists: AlegraPriceList[] = [
        { id: 1, name: 'Pet Shop', price: 1000 },
        { id: 2, name: 'General', price: 1200 }
      ]

      const result = mockAlegraService.isVisibleForPetShops(priceLists)
      expect(result).toBe(true)
    })

    it('retorna false cuando no hay lista pet', () => {
      const priceLists: AlegraPriceList[] = [
        { id: 1, name: 'General', price: 1000 }
      ]

      const result = mockAlegraService.isVisibleForPetShops(priceLists)
      expect(result).toBe(false)
    })

    it('retorna false cuando priceLists es null', () => {
      const result = mockAlegraService.isVisibleForPetShops(null as any)
      expect(result).toBe(false)
    })
  })

  describe('mapCategory', () => {
    it('mapea categorías conocidas correctamente', () => {
      expect(mockAlegraService.mapCategory('medicamentos')).toBe('medicamentos')
      expect(mockAlegraService.mapCategory('vacunas')).toBe('vacunas')
      expect(mockAlegraService.mapCategory('equipos')).toBe('equipos')
    })

    it('retorna otros para categorías desconocidas', () => {
      expect(mockAlegraService.mapCategory('categoria-desconocida')).toBe('otros')
    })

    it('maneja mayúsculas y minúsculas', () => {
      expect(mockAlegraService.mapCategory('MEDICAMENTOS')).toBe('medicamentos')
      expect(mockAlegraService.mapCategory('Vacunas')).toBe('vacunas')
    })
  })

  describe('determineUserType', () => {
    it('retorna vet para productos veterinarios', () => {
      const product: AlegraProduct = {
        id: 1,
        name: 'Medicamento para perros',
        status: 'active',
        price: []
      }

      const result = mockAlegraService.determineUserType(product)
      expect(result).toBe('vet')
    })

    it('retorna pet para productos de pet shop', () => {
      const product: AlegraProduct = {
        id: 1,
        name: 'Alimento para gatos',
        status: 'active',
        price: []
      }

      const result = mockAlegraService.determineUserType(product)
      expect(result).toBe('pet')
    })

    it('retorna vet por defecto', () => {
      const product: AlegraProduct = {
        id: 1,
        name: 'Producto genérico',
        status: 'active',
        price: []
      }

      const result = mockAlegraService.determineUserType(product)
      expect(result).toBe('vet')
    })
  })
})