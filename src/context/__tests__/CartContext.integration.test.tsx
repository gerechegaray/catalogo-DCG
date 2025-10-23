import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import type { NormalizedProduct } from '../../types/alegra'

// Componente de prueba para CartContext
const TestCartComponent = () => {
  const cart = useCart()
  
  const mockProduct: NormalizedProduct = {
    id: '1',
    name: 'Producto Test',
    description: 'Descripción test',
    price: 1000,
    stock: 10,
    category: 'test',
    subcategory: 'test',
    supplier: 'test',
    userType: 'vet',
    image: null,
    code: 'TEST001',
    unit: 'unidad',
    alegraId: 1,
    lastUpdated: new Date().toISOString(),
    status: 'active',
    warehouses: [],
    priceLists: [],
    originalData: {} as any
  }

  return (
    <div>
      <div data-testid="total-items">{cart.totalItems}</div>
      <div data-testid="total-price">{cart.totalPrice}</div>
      <div data-testid="items-count">{cart.items.length}</div>
      
      <button 
        data-testid="add-to-cart" 
        onClick={() => cart.addToCart(mockProduct)}
      >
        Agregar al Carrito
      </button>
      
      <button 
        data-testid="remove-from-cart" 
        onClick={() => cart.removeFromCart('1')}
      >
        Remover del Carrito
      </button>
      
      <button 
        data-testid="update-quantity" 
        onClick={() => cart.updateQuantity('1', 3)}
      >
        Actualizar Cantidad a 3
      </button>
      
      <button 
        data-testid="update-quantity-zero" 
        onClick={() => cart.updateQuantity('1', 0)}
      >
        Actualizar Cantidad a 0
      </button>
      
      <button 
        data-testid="clear-cart" 
        onClick={() => cart.clearCart()}
      >
        Limpiar Carrito
      </button>

      {/* Mostrar items del carrito */}
      <div data-testid="cart-items">
        {cart.items.map(item => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            {item.name} - Cantidad: {item.quantity} - Precio: {item.price}
          </div>
        ))}
      </div>
    </div>
  )
}

describe('CartContext Integration Tests', () => {
  beforeEach(() => {
    // Limpiar estado antes de cada test
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('inicia con carrito vacío', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      expect(screen.getByTestId('total-items')).toHaveTextContent('0')
      expect(screen.getByTestId('total-price')).toHaveTextContent('0')
      expect(screen.getByTestId('items-count')).toHaveTextContent('0')
    })
  })

  describe('Add to Cart', () => {
    it('agrega producto nuevo al carrito', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      act(() => {
        screen.getByTestId('add-to-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('1')
      expect(screen.getByTestId('total-price')).toHaveTextContent('1000')
      expect(screen.getByTestId('items-count')).toHaveTextContent('1')
      expect(screen.getByTestId('item-1')).toBeInTheDocument()
    })

    it('incrementa cantidad cuando se agrega producto existente', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      // Agregar producto dos veces
      act(() => {
        screen.getByTestId('add-to-cart').click()
        screen.getByTestId('add-to-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('2')
      expect(screen.getByTestId('total-price')).toHaveTextContent('2000')
      expect(screen.getByTestId('items-count')).toHaveTextContent('1') // Solo un item pero con cantidad 2
    })
  })

  describe('Remove from Cart', () => {
    it('remueve producto del carrito', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      // Agregar producto primero
      act(() => {
        screen.getByTestId('add-to-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('1')

      // Remover producto
      act(() => {
        screen.getByTestId('remove-from-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('0')
      expect(screen.getByTestId('total-price')).toHaveTextContent('0')
      expect(screen.getByTestId('items-count')).toHaveTextContent('0')
    })

    it('no afecta carrito si producto no existe', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      // Intentar remover producto que no existe
      act(() => {
        screen.getByTestId('remove-from-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('0')
      expect(screen.getByTestId('total-price')).toHaveTextContent('0')
    })
  })

  describe('Update Quantity', () => {
    it('actualiza cantidad de producto existente', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      // Agregar producto primero
      act(() => {
        screen.getByTestId('add-to-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('1')

      // Actualizar cantidad
      act(() => {
        screen.getByTestId('update-quantity').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('3')
      expect(screen.getByTestId('total-price')).toHaveTextContent('3000')
    })

    it('remueve producto si cantidad es 0', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      // Agregar producto primero
      act(() => {
        screen.getByTestId('add-to-cart').click()
      })

      // Actualizar cantidad a 0
      act(() => {
        screen.getByTestId('update-quantity-zero').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('0')
      expect(screen.getByTestId('total-price')).toHaveTextContent('0')
    })
  })

  describe('Clear Cart', () => {
    it('limpia todo el carrito', () => {
      render(
        <CartProvider>
          <TestCartComponent />
        </CartProvider>
      )

      // Agregar varios productos
      act(() => {
        screen.getByTestId('add-to-cart').click()
        screen.getByTestId('add-to-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('2')

      // Limpiar carrito
      act(() => {
        screen.getByTestId('clear-cart').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('0')
      expect(screen.getByTestId('total-price')).toHaveTextContent('0')
      expect(screen.getByTestId('items-count')).toHaveTextContent('0')
    })
  })

  describe('Multiple Products', () => {
    it('maneja múltiples productos diferentes correctamente', () => {
      const TestMultipleProductsComponent = () => {
        const cart = useCart()
        
        const product1: NormalizedProduct = {
          id: '1',
          name: 'Producto 1',
          description: 'Descripción 1',
          price: 1000,
          stock: 10,
          category: 'test',
          subcategory: 'test',
          supplier: 'test',
          userType: 'vet',
          image: null,
          code: 'TEST001',
          unit: 'unidad',
          alegraId: 1,
          lastUpdated: new Date().toISOString(),
          status: 'active',
          warehouses: [],
          priceLists: [],
          originalData: {} as any
        }

        const product2: NormalizedProduct = {
          id: '2',
          name: 'Producto 2',
          description: 'Descripción 2',
          price: 2000,
          stock: 5,
          category: 'test',
          subcategory: 'test',
          supplier: 'test',
          userType: 'vet',
          image: null,
          code: 'TEST002',
          unit: 'unidad',
          alegraId: 2,
          lastUpdated: new Date().toISOString(),
          status: 'active',
          warehouses: [],
          priceLists: [],
          originalData: {} as any
        }

        return (
          <div>
            <div data-testid="total-items">{cart.totalItems}</div>
            <div data-testid="total-price">{cart.totalPrice}</div>
            <div data-testid="items-count">{cart.items.length}</div>
            
            <button 
              data-testid="add-product-1" 
              onClick={() => cart.addToCart(product1)}
            >
              Agregar Producto 1
            </button>
            
            <button 
              data-testid="add-product-2" 
              onClick={() => cart.addToCart(product2)}
            >
              Agregar Producto 2
            </button>
          </div>
        )
      }

      render(
        <CartProvider>
          <TestMultipleProductsComponent />
        </CartProvider>
      )

      // Agregar ambos productos
      act(() => {
        screen.getByTestId('add-product-1').click()
        screen.getByTestId('add-product-2').click()
      })

      expect(screen.getByTestId('total-items')).toHaveTextContent('2')
      expect(screen.getByTestId('total-price')).toHaveTextContent('3000') // 1000 + 2000
      expect(screen.getByTestId('items-count')).toHaveTextContent('2')
    })
  })
})
