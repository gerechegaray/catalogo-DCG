import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../AuthContext'
import type { UserType } from '../../types/contexts'

// Componente de prueba para AuthContext
const TestAuthComponent = () => {
  const auth = useAuth()
  return (
    <div>
      <div data-testid="user-type">{auth.userType}</div>
      <div data-testid="is-admin">{auth.isAdmin.toString()}</div>
      <div data-testid="is-authenticated">{auth.isAuthenticated.toString()}</div>
      <button 
        data-testid="authenticate-admin" 
        onClick={() => auth.authenticateAdmin('ADMIN2025')}
      >
        Login Admin
      </button>
      <button 
        data-testid="logout-admin" 
        onClick={() => auth.logoutAdmin()}
      >
        Logout Admin
      </button>
    </div>
  )
}

// Wrapper para tests con router
const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('AuthContext Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('inicia con usuario público en ruta raíz', () => {
      render(
        <TestWrapper initialEntries={['/']}>
          <TestAuthComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('user-type')).toHaveTextContent('public')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
    })

    it('detecta usuario veterinario en ruta /veterinarios', () => {
      render(
        <TestWrapper initialEntries={['/veterinarios']}>
          <TestAuthComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('user-type')).toHaveTextContent('vet')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
    })

    it('detecta usuario pet shop en ruta /petshops', () => {
      render(
        <TestWrapper initialEntries={['/petshops']}>
          <TestAuthComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('user-type')).toHaveTextContent('pet')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
    })
  })

  describe('Admin Authentication', () => {
    it('autentica admin con código correcto', () => {
      render(
        <TestWrapper initialEntries={['/admin']}>
          <TestAuthComponent />
        </TestWrapper>
      )

      // Inicialmente no autenticado
      expect(screen.getByTestId('user-type')).toHaveTextContent('public')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false')

      // Autenticar admin
      act(() => {
        screen.getByTestId('authenticate-admin').click()
      })

      expect(screen.getByTestId('user-type')).toHaveTextContent('admin')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
    })

    it('mantiene autenticación admin en localStorage', () => {
      // Simular que ya está autenticado
      localStorage.setItem('admin_authenticated', 'true')

      render(
        <TestWrapper initialEntries={['/admin']}>
          <TestAuthComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('user-type')).toHaveTextContent('admin')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
    })

    it('cierra sesión admin correctamente', () => {
      // Autenticar primero
      localStorage.setItem('admin_authenticated', 'true')

      render(
        <TestWrapper initialEntries={['/admin']}>
          <TestAuthComponent />
        </TestWrapper>
      )

      // Verificar que está autenticado
      expect(screen.getByTestId('user-type')).toHaveTextContent('admin')

      // Cerrar sesión
      act(() => {
        screen.getByTestId('logout-admin').click()
      })

      expect(screen.getByTestId('user-type')).toHaveTextContent('public')
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false')
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
    })
  })

  describe('Access Control', () => {
    it('permite acceso a veterinarios en ruta /veterinarios', () => {
      const TestAccessComponent = () => {
        const auth = useAuth()
        return (
          <div data-testid="can-access-vet">
            {auth.canAccess('/veterinarios').toString()}
          </div>
        )
      }

      render(
        <TestWrapper initialEntries={['/veterinarios']}>
          <TestAccessComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('can-access-vet')).toHaveTextContent('true')
    })

    it('permite acceso a pet shops en ruta /petshops', () => {
      const TestAccessComponent = () => {
        const auth = useAuth()
        return (
          <div data-testid="can-access-pet">
            {auth.canAccess('/petshops').toString()}
          </div>
        )
      }

      render(
        <TestWrapper initialEntries={['/petshops']}>
          <TestAccessComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('can-access-pet')).toHaveTextContent('true')
    })

    it('solo permite acceso a admin en ruta /admin', () => {
      const TestAccessComponent = () => {
        const auth = useAuth()
        return (
          <div data-testid="can-access-admin">
            {auth.canAccess('/admin').toString()}
          </div>
        )
      }

      // Sin autenticación admin
      render(
        <TestWrapper initialEntries={['/admin']}>
          <TestAccessComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('can-access-admin')).toHaveTextContent('false')

      // Con autenticación admin
      act(() => {
        screen.getByTestId('authenticate-admin').click()
      })

      expect(screen.getByTestId('can-access-admin')).toHaveTextContent('true')
    })
  })

  describe('Product Filtering', () => {
    it('filtra productos correctamente para veterinarios', () => {
      const TestFilterComponent = () => {
        const auth = useAuth()
        const mockProducts = [
          { id: '1', name: 'Producto 1', priceLists: [{ name: 'General', price: 100 }] },
          { id: '2', name: 'Producto 2', priceLists: [{ name: 'Pet', price: 80 }] }
        ]
        const filtered = auth.getFilteredProducts(mockProducts as any)
        return <div data-testid="filtered-count">{filtered.length}</div>
      }

      render(
        <TestWrapper initialEntries={['/veterinarios']}>
          <TestFilterComponent />
        </TestWrapper>
      )

      // Veterinarios ven todos los productos
      expect(screen.getByTestId('filtered-count')).toHaveTextContent('2')
    })

    it('filtra productos correctamente para pet shops', () => {
      const TestFilterComponent = () => {
        const auth = useAuth()
        const mockProducts = [
          { id: '1', name: 'Producto 1', priceLists: [{ name: 'General', price: 100 }] },
          { id: '2', name: 'Producto 2', priceLists: [{ name: 'Pet', price: 80 }] }
        ]
        const filtered = auth.getFilteredProducts(mockProducts as any)
        return <div data-testid="filtered-count">{filtered.length}</div>
      }

      render(
        <TestWrapper initialEntries={['/petshops']}>
          <TestFilterComponent />
        </TestWrapper>
      )

      // Pet shops solo ven productos con lista "pet"
      expect(screen.getByTestId('filtered-count')).toHaveTextContent('1')
    })

    it('admin ve todos los productos', () => {
      const TestFilterComponent = () => {
        const auth = useAuth()
        const mockProducts = [
          { id: '1', name: 'Producto 1', priceLists: [{ name: 'General', price: 100 }] },
          { id: '2', name: 'Producto 2', priceLists: [{ name: 'Pet', price: 80 }] }
        ]
        const filtered = auth.getFilteredProducts(mockProducts as any)
        return <div data-testid="filtered-count">{filtered.length}</div>
      }

      render(
        <TestWrapper initialEntries={['/admin']}>
          <TestFilterComponent />
        </TestWrapper>
      )

      // Autenticar admin
      act(() => {
        screen.getByTestId('authenticate-admin').click()
      })

      // Admin ve todos los productos
      expect(screen.getByTestId('filtered-count')).toHaveTextContent('2')
    })
  })
})
