import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from '../AuthContext'

// Componente de prueba simplificado para AuthContext
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

// Wrapper con router (necesario para useLocation)
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('AuthContext Simple Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
  })

  describe('Admin Authentication', () => {
    it('autentica admin con código correcto', () => {
      render(
        <TestWrapper>
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
        <TestWrapper>
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
        <TestWrapper>
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
    it('permite acceso a rutas públicas', () => {
      const TestAccessComponent = () => {
        const auth = useAuth()
        return (
          <div data-testid="can-access-public">
            {auth.canAccess('/').toString()}
          </div>
        )
      }

      render(
        <TestWrapper>
          <TestAccessComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('can-access-public')).toHaveTextContent('true')
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
        <TestWrapper>
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
    it('filtra productos correctamente para admin', () => {
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
        <TestWrapper>
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

    it('filtra productos correctamente para usuario público', () => {
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
        <TestWrapper>
          <TestFilterComponent />
        </TestWrapper>
      )

      // Usuario público ve todos los productos
      expect(screen.getByTestId('filtered-count')).toHaveTextContent('2')
    })
  })
})
