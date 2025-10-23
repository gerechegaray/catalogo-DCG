import React, { createContext, useContext, useReducer } from 'react'
import type { CartContextType, CartProviderProps, CartState, CartAction, CartItem, NormalizedProduct } from '@/types/contexts'

// Tipos de acciones del carrito
const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART' as const,
  REMOVE_FROM_CART: 'REMOVE_FROM_CART' as const,
  UPDATE_QUANTITY: 'UPDATE_QUANTITY' as const,
  CLEAR_CART: 'CLEAR_CART' as const,
  SET_CART: 'SET_CART' as const
}

// Estado inicial del carrito
const initialState: CartState = {
  items: [], // Array de productos en el carrito
  totalItems: 0,
  totalPrice: 0
}

// Reducer del carrito
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        // Si el producto ya existe, incrementar cantidad
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        }
      } else {
        // Si es un producto nuevo, agregarlo
        const newItem: CartItem = { ...action.payload, quantity: 1 }
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        }
      }

    case actionTypes.REMOVE_FROM_CART:
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state
      
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      
      return {
        ...state,
        items: filteredItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
      }

    case actionTypes.UPDATE_QUANTITY:
      const itemToUpdate = state.items.find(item => item.id === action.payload.id)
      if (!itemToUpdate) return state
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      
      const quantityDifference = action.payload.quantity - itemToUpdate.quantity
      const priceDifference = quantityDifference * itemToUpdate.price
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDifference,
        totalPrice: state.totalPrice + priceDifference
      }

    case actionTypes.CLEAR_CART:
      return initialState

    case actionTypes.SET_CART:
      return action.payload

    default:
      return state
  }
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}

// Provider del contexto
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState)

  // Acciones del carrito
  const addToCart = (product: NormalizedProduct): void => {
    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: product
    })
  }

  const removeFromCart = (productId: string): void => {
    dispatch({
      type: actionTypes.REMOVE_FROM_CART,
      payload: productId
    })
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    dispatch({
      type: actionTypes.UPDATE_QUANTITY,
      payload: { id: productId, quantity }
    })
  }

  const clearCart = (): void => {
    dispatch({
      type: actionTypes.CLEAR_CART
    })
  }

  const setCart = (cartData: CartState): void => {
    dispatch({
      type: actionTypes.SET_CART,
      payload: cartData
    })
  }

  // Valor del contexto
  const value: CartContextType = {
    // Estado
    items: cartState.items,
    totalItems: cartState.totalItems,
    totalPrice: cartState.totalPrice,
    
    // Acciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
