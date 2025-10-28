import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import alegraService from '../services/alegraService'
import cacheService from '../services/cacheService'
import type { 
  ProductContextType, 
  ProductProviderProps, 
  ProductState, 
  ProductAction, 
  CartItem, 
  NormalizedProduct,
  UserType 
} from '@/types/contexts'

// Estado inicial
const initialState: ProductState = {
  // Productos
  products: [],
  filteredProducts: [],
  loading: false,
  error: null,
  
  // Productos seleccionados
  selectedProducts: [],
  
  // Filtros
  filters: {
    category: '',
    subcategory: '',
    search: '',
    userType: 'vet',
    navbarCategory: ''
  },
  
  // Cache
  cacheStatus: 'checking', // checking, valid, expired, error
  
  // Analytics
  analytics: {
    totalProducts: 0,
    totalViews: 0,
    totalSelections: 0,
    topViewedProducts: [],
    topSelectedProducts: [],
    cacheStatus: 'checking'
  }
}

// Tipos de acciones
const actionTypes = {
  SET_LOADING: 'SET_LOADING' as const,
  SET_ERROR: 'SET_ERROR' as const,
  SET_PRODUCTS: 'SET_PRODUCTS' as const,
  SET_FILTERED_PRODUCTS: 'SET_FILTERED_PRODUCTS' as const,
  SET_FILTERS: 'SET_FILTERS' as const,
  SET_CATEGORY: 'SET_CATEGORY' as const,
  SET_SUBCATEGORY: 'SET_SUBCATEGORY' as const,
  SET_SEARCH: 'SET_SEARCH' as const,
  SET_NAVBAR_CATEGORY: 'SET_NAVBAR_CATEGORY' as const,
  CLEAR_FILTERS: 'CLEAR_FILTERS' as const,
  ADD_SELECTED_PRODUCT: 'ADD_SELECTED_PRODUCT' as const,
  REMOVE_SELECTED_PRODUCT: 'REMOVE_SELECTED_PRODUCT' as const,
  CLEAR_SELECTED_PRODUCTS: 'CLEAR_SELECTED_PRODUCTS' as const,
  UPDATE_PRODUCT_QUANTITY: 'UPDATE_PRODUCT_QUANTITY' as const,
  SET_CACHE_STATUS: 'SET_CACHE_STATUS' as const,
  SET_ANALYTICS: 'SET_ANALYTICS' as const
}

// Reducer
function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case actionTypes.SET_PRODUCTS:
      return { 
        ...state, 
        products: action.payload,
        filteredProducts: action.payload,
        loading: false,
        error: null
      }
    
    case actionTypes.SET_FILTERED_PRODUCTS:
      return { ...state, filteredProducts: action.payload }
    
    case actionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    
    case actionTypes.SET_CATEGORY:
      return { 
        ...state, 
        filters: { ...state.filters, category: action.payload, subcategory: '' } // Limpiar subcategoría al cambiar categoría
      }
    
    case actionTypes.SET_SUBCATEGORY:
      return { 
        ...state, 
        filters: { ...state.filters, subcategory: action.payload } 
      }
    
    case actionTypes.SET_SEARCH:
      return { 
        ...state, 
        filters: { ...state.filters, search: action.payload } 
      }
    
    case actionTypes.SET_NAVBAR_CATEGORY:
      return { 
        ...state, 
        filters: { ...state.filters, navbarCategory: action.payload, category: '', subcategory: '' } // Limpiar filtros secundarios
      }
    
    case actionTypes.CLEAR_FILTERS:
      return { 
        ...state, 
        filters: { category: '', subcategory: '', search: '', navbarCategory: '', userType: state.filters.userType }
      }
    
    case actionTypes.ADD_SELECTED_PRODUCT:
      const existingProduct = state.selectedProducts.find(p => p.id === action.payload.id)
      if (existingProduct) {
        return {
          ...state,
          selectedProducts: state.selectedProducts.map(p =>
            p.id === action.payload.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          )
        }
      }
      return {
        ...state,
        selectedProducts: [...state.selectedProducts, { ...action.payload, quantity: 1 }]
      }
    
    case actionTypes.REMOVE_SELECTED_PRODUCT:
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(p => p.id !== action.payload)
      }
    
    case actionTypes.CLEAR_SELECTED_PRODUCTS:
      return { ...state, selectedProducts: [] }
    
    case actionTypes.UPDATE_PRODUCT_QUANTITY:
      return {
        ...state,
        selectedProducts: state.selectedProducts.map(p =>
          p.id === action.payload.id
            ? { ...p, quantity: action.payload.quantity }
            : p
        )
      }
    
    case actionTypes.SET_CACHE_STATUS:
      return { ...state, cacheStatus: action.payload }
    
    case actionTypes.SET_ANALYTICS:
      return { ...state, analytics: action.payload }
    
    default:
      return state
  }
}

// Context
const ProductContext = createContext<ProductContextType | undefined>(undefined)

// Provider
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState)
  const { getFilteredProducts, userType } = useAuth()

  // Cargar productos al inicializar
  useEffect(() => {
    // No cargar si es 'public' - solo cargar para vet, pet o admin
    if (userType && userType !== 'public') {
      loadProducts()
    }
  }, [userType])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (state.products.length > 0) {
      applyFilters()
    }
  }, [state.products.length, state.filters.category, state.filters.subcategory, state.filters.search, userType])

  // Normalizar datos de Alegra
  const normalizeAlegraProduct = (product: any): NormalizedProduct => {
    // Función auxiliar para extraer precio
    const extractPrice = (product: any): number => {
      // Si ya viene procesado desde alegraService, usar directamente
      if (typeof product.price === 'number') return product.price
      
      // Si viene con priceLists, usar la lógica de Alegra
      if (product.priceLists && Array.isArray(product.priceLists)) {
        const userType = product.userType || 'vet'
        let targetPriceList = null
        
        if (userType === 'pet') {
          targetPriceList = product.priceLists.find((price: any) => 
            price.name && price.name.toLowerCase().includes('pet')
          )
        } else {
          targetPriceList = product.priceLists.find((price: any) => 
            price.name && price.name.toLowerCase().includes('general')
          )
        }
        
        if (!targetPriceList) {
          targetPriceList = product.priceLists.find((price: any) => price.main === true)
        }
        
        if (!targetPriceList && product.priceLists.length > 0) {
          targetPriceList = product.priceLists[0]
        }
        
        return targetPriceList ? parseFloat(targetPriceList.price) : 0
      }
      
      // Fallback a campos antiguos
      if (product.price && product.price !== 0) return parseFloat(product.price)
      if (product.priceList && product.priceList[0] && product.priceList[0].price) return parseFloat(product.priceList[0].price)
      if (product.sellingPrice) return parseFloat(product.sellingPrice)
      if (product.cost) return parseFloat(product.cost)
      return 0
    }

    // Función auxiliar para extraer stock
    const extractStock = (product: any): number => {
      // Si ya viene procesado desde alegraService, usar directamente
      if (typeof product.stock === 'number') return product.stock
      
      // Usar availableQuantity de Alegra
      if (product.inventory && product.inventory.availableQuantity) return parseInt(product.inventory.availableQuantity)
      if (product.stock && product.stock !== 0) return parseInt(product.stock)
      if (product.quantity) return parseInt(product.quantity)
      return 0
    }

    return {
      id: product.id || product.reference || Math.random().toString(36),
      name: product.name || product.description || 'Producto sin nombre',
      description: product.description || product.name || '', // Marca/Laboratorio
      price: extractPrice(product),
      stock: extractStock(product),
      category: product.description || product.category?.name || product.category || 'otros', // Marca/Laboratorio
      subcategory: product.itemCategory?.name || product.subcategory || '', // Subcategoría específica
      supplier: product.description || product.supplier?.name || product.supplier || '', // Marca/Laboratorio
      code: product.reference || product.code || '',
      image: product.images?.[0]?.url || product.image || product.images?.[0] || null,
      userType: product.userType || 'vet', // Por defecto veterinarios
      unit: product.inventory?.unit || product.unit || 'unidad',
      // Mantener datos originales para debug
      originalData: product
    }
  }

  // Cargar productos desde cache o Alegra
  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      
      // NUEVO: Usar el método híbrido que intenta Storage primero
      // Este método intenta descargar desde Firebase Storage (más eficiente)
      // y si falla, usa Firestore como fallback (para retrocompatibilidad)
      const products = await cacheService.getProductsHybrid(userType)
      
      if (products && products.length > 0) {
        // Productos obtenidos exitosamente desde Storage o Firestore
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: products })
        dispatch({ type: actionTypes.SET_CACHE_STATUS, payload: 'valid' })
      } else {
        // Si no hay productos en cache, obtener desde Alegra API
        console.log('🔄 No hay cache disponible, sincronizando con Alegra...')
        const alegraProducts = await alegraService.getAllProducts()
        
        // Guardar en cache de Firestore (compatibilidad temporal)
        // NOTA: Ya no guardaremos en Firestore en producción cuando la Cloud Function esté activa
        await cacheService.saveProductsToCache(alegraProducts)
        
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: alegraProducts })
        dispatch({ type: actionTypes.SET_CACHE_STATUS, payload: 'valid' })
      }
      
    } catch (error: any) {
      console.error('❌ Error cargando productos:', error)
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      dispatch({ type: actionTypes.SET_CACHE_STATUS, payload: 'error' })
    }
  }, [userType, getFilteredProducts])

  // Aplicar filtros
  const applyFilters = (): void => {
    let filtered = [...state.products]
    
    // Filtro automático por tipo de usuario (desde AuthContext)
    filtered = getFilteredProducts(filtered)
    
    // Filtro por categoría (marca/laboratorio)
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category && product.category === state.filters.category)
    }

    // Filtro por subcategoría
    if (state.filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory && product.subcategory === state.filters.subcategory)
    }

    // Filtro por búsqueda
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.supplier && product.supplier.toLowerCase().includes(searchTerm)) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm))
      )
    }
    
    dispatch({ type: actionTypes.SET_FILTERED_PRODUCTS, payload: filtered })
  }

  // Acciones con useCallback para evitar recreaciones
  const setUserType = useCallback((userType: UserType): void => {
    dispatch({ type: actionTypes.SET_FILTERS, payload: { userType } })
  }, [])
  
  const setCategory = useCallback((category: string): void => {
    dispatch({ type: actionTypes.SET_CATEGORY, payload: category })
  }, [])
  
  const setSubcategory = useCallback((subcategory: string): void => {
    dispatch({ type: actionTypes.SET_SUBCATEGORY, payload: subcategory })
  }, [])
  
  const setSearch = useCallback((search: string): void => {
    dispatch({ type: actionTypes.SET_SEARCH, payload: search })
  }, [])
  
  const setNavbarCategory = useCallback((navbarCategory: string): void => {
    dispatch({ type: actionTypes.SET_NAVBAR_CATEGORY, payload: navbarCategory })
  }, [])
  
  const clearFilters = useCallback((): void => {
    dispatch({ type: actionTypes.CLEAR_FILTERS })
  }, [])
  
  const addSelectedProduct = useCallback((product: NormalizedProduct): void => {
    dispatch({ type: actionTypes.ADD_SELECTED_PRODUCT, payload: product })
    cacheService.recordProductSelection(product.id, state.filters.userType)
  }, [state.filters.userType])
  
  const removeSelectedProduct = useCallback((productId: string): void => {
    dispatch({ type: actionTypes.REMOVE_SELECTED_PRODUCT, payload: productId })
  }, [])
  
  const updateProductQuantity = useCallback((productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeSelectedProduct(productId)
    } else {
      dispatch({ 
        type: actionTypes.UPDATE_PRODUCT_QUANTITY, 
        payload: { id: productId, quantity } 
      })
    }
  }, [removeSelectedProduct])
  
  const clearSelectedProducts = useCallback((): void => {
    dispatch({ type: actionTypes.CLEAR_SELECTED_PRODUCTS })
  }, [])
  
  const reloadProducts = useCallback((): void => {
    loadProducts()
  }, [loadProducts])
  
  const loadAnalytics = useCallback(async (): Promise<void> => {
    try {
      const analyticsData = await cacheService.getAnalytics(state.products)
      dispatch({ type: actionTypes.SET_ANALYTICS, payload: analyticsData })
    } catch (error) {
      console.error('Error al cargar analytics:', error)
      // Mantener analytics por defecto en caso de error
    }
  }, [state.products])
  
  const recordProductView = useCallback((productId: string): void => {
    cacheService.recordProductView(productId, state.filters.userType)
  }, [state.filters.userType])

  const recordPageView = useCallback((pageName: string): void => {
    cacheService.recordPageView(pageName, state.filters.userType)
  }, [state.filters.userType])

  const recordNavbarClick = useCallback((linkName: string): void => {
    cacheService.recordNavbarClick(linkName, state.filters.userType)
  }, [state.filters.userType])

  const recordAdClick = useCallback((adId: string, adTitle: string): void => {
    cacheService.recordAdClick(adId, adTitle, state.filters.userType)
  }, [state.filters.userType])

  const recordFeaturedProductClick = useCallback((productId: string, productName: string): void => {
    cacheService.recordFeaturedProductClick(productId, productName, state.filters.userType)
  }, [state.filters.userType])

  const recordViewProductClick = useCallback((productId: string, productName: string): void => {
    cacheService.recordViewProductClick(productId, productName, state.filters.userType)
  }, [state.filters.userType])

  const recordAddToCart = useCallback((productId: string, productName: string, quantity: number = 1): void => {
    cacheService.recordAddToCart(productId, productName, quantity, state.filters.userType)
  }, [state.filters.userType])

  const recordWhatsAppOrder = useCallback((productIds: string[], productNames: string[]): void => {
    cacheService.recordWhatsAppOrder(productIds, productNames, state.filters.userType)
  }, [state.filters.userType])

  const actions = {
    setUserType,
    setCategory,
    setSubcategory,
    setSearch,
    setNavbarCategory,
    clearFilters,
    addSelectedProduct,
    removeSelectedProduct,
    updateProductQuantity,
    clearSelectedProducts,
    reloadProducts,
    loadAnalytics,
    recordProductView,
    recordPageView,
    recordNavbarClick,
    recordAdClick,
    recordFeaturedProductClick,
    recordViewProductClick,
    recordAddToCart,
    recordWhatsAppOrder
  }

  const value: ProductContextType = {
    ...state,
    ...actions
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

// Hook para usar el contexto
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts debe usarse dentro de ProductProvider')
  }
  return context
}

export default ProductContext
