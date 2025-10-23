// Tipos para los contextos de la aplicación
import type { ReactNode } from 'react'
import type { NormalizedProduct } from './alegra'

// Tipos de usuario
export type UserType = 'vet' | 'pet' | 'admin' | 'public'

// Tipos para AuthContext
export interface AuthContextType {
  userType: UserType
  isAdmin: boolean
  isAuthenticated: boolean
  authenticateAdmin: (code: string) => boolean
  logoutAdmin: () => void
  canAccess: (route: string) => boolean
  getFilteredProducts: (products: NormalizedProduct[]) => NormalizedProduct[]
  USER_TYPES: {
    VET: 'vet'
    PET: 'pet'
    ADMIN: 'admin'
    PUBLIC: 'public'
  }
}

export interface AuthProviderProps {
  children: ReactNode
}

// Tipos para CartContext
export interface CartItem extends NormalizedProduct {
  quantity: number
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export type CartActionType = 
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'UPDATE_QUANTITY'
  | 'CLEAR_CART'
  | 'SET_CART'

export interface CartAction {
  type: CartActionType
  payload?: any
}

export interface CartContextType {
  // Estado
  items: CartItem[]
  totalItems: number
  totalPrice: number
  
  // Acciones
  addToCart: (product: NormalizedProduct) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setCart: (cartData: CartState) => void
}

export interface CartProviderProps {
  children: ReactNode
}

// Tipos para ProductContext
export interface ProductFilters {
  category: string
  subcategory: string
  search: string
  userType: UserType
  navbarCategory: string
}

export interface ProductAnalytics {
  totalProducts: number
  totalViews: number
  totalSelections: number
  topViewedProducts: Array<{ productId: string; views: number }>
  topSelectedProducts: Array<{ productId: string; selections: number }>
  cacheStatus: 'checking' | 'valid' | 'expired' | 'error'
}

export interface ProductState {
  // Productos
  products: NormalizedProduct[]
  filteredProducts: NormalizedProduct[]
  loading: boolean
  error: string | null
  
  // Productos seleccionados
  selectedProducts: CartItem[]
  
  // Filtros
  filters: ProductFilters
  
  // Cache
  cacheStatus: 'checking' | 'valid' | 'expired' | 'error'
  
  // Analytics
  analytics: ProductAnalytics
}

export type ProductActionType =
  | 'SET_LOADING'
  | 'SET_ERROR'
  | 'SET_PRODUCTS'
  | 'SET_FILTERED_PRODUCTS'
  | 'SET_FILTERS'
  | 'SET_CATEGORY'
  | 'SET_SUBCATEGORY'
  | 'SET_SEARCH'
  | 'SET_NAVBAR_CATEGORY'
  | 'CLEAR_FILTERS'
  | 'ADD_SELECTED_PRODUCT'
  | 'REMOVE_SELECTED_PRODUCT'
  | 'CLEAR_SELECTED_PRODUCTS'
  | 'UPDATE_PRODUCT_QUANTITY'
  | 'SET_CACHE_STATUS'
  | 'SET_ANALYTICS'

export interface ProductAction {
  type: ProductActionType
  payload?: any
}

export interface ProductContextType extends ProductState {
  // Acciones de filtros
  setUserType: (userType: UserType) => void
  setCategory: (category: string) => void
  setSubcategory: (subcategory: string) => void
  setSearch: (search: string) => void
  setNavbarCategory: (navbarCategory: string) => void
  clearFilters: () => void
  
  // Acciones de productos seleccionados
  addSelectedProduct: (product: NormalizedProduct) => void
  removeSelectedProduct: (productId: string) => void
  updateProductQuantity: (productId: string, quantity: number) => void
  clearSelectedProducts: () => void
  
  // Acciones de datos
  reloadProducts: () => void
  loadAnalytics: () => Promise<void>
  recordProductView: (productId: string) => void
}

export interface ProductProviderProps {
  children: ReactNode
}
