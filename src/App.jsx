import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ClientAuthProvider } from './context/ClientAuthContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import CartHeader from './components/CartHeader'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedClientRoute from './components/ProtectedClientRoute'
import ProductSelectionBar from './components/ProductSelectionBar'
import PageTracker from './components/PageTracker'

// Lazy loading de páginas
const RestrictedAccessPage = React.lazy(() => import('./pages/RestrictedAccessPage'))
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'))
const VeterinariosLandingPage = React.lazy(() => import('./pages/VeterinariosLandingPage'))
const VeterinariosProductosPage = React.lazy(() => import('./pages/VeterinariosPage'))
const PetShopsLandingPage = React.lazy(() => import('./pages/PetShopsLandingPage'))
const PetShopsProductosPage = React.lazy(() => import('./pages/PetShopsPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage')) 
const PublicPage = React.lazy(() => import('./pages/PublicPage'))
const ClientLoginPage = React.lazy(() => import('./pages/ClientLoginPage'))
const ClientDashboardPage = React.lazy(() => import('./pages/ClientDashboardPage'))
const ClientProfilePage = React.lazy(() => import('./pages/ClientProfilePage'))
const ClientAccountPage = React.lazy(() => import('./pages/ClientAccountPage'))
const ClientPromotionsPage = React.lazy(() => import('./pages/ClientPromotionsPage'))

// Componente de loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <ClientAuthProvider>
              <ProductProvider>
                <div className="min-h-screen bg-white">
              <Routes>
              {/* Acceso restringido - Raíz */}
              <Route path="/" element={
                <PageTracker>
                  <Suspense fallback={<LoadingSpinner />}>
                    <RestrictedAccessPage />
                  </Suspense>
                </PageTracker>
              } />
              
              {/* Páginas de presentación */}
              <Route path="/veterinarios" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <PageTracker>
                      <div>
                        <CartHeader />
                        <Suspense fallback={<LoadingSpinner />}>
                          <VeterinariosLandingPage />
                        </Suspense>
                        <Footer />
                      </div>
                    </PageTracker>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/petshops" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <PageTracker>
                      <div>
                        <CartHeader />
                        <Suspense fallback={<LoadingSpinner />}>
                          <PetShopsLandingPage />
                        </Suspense>
                        <Footer />
                      </div>
                    </PageTracker>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              {/* Páginas de productos */}
              <Route path="/veterinarios/productos" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <PageTracker>
                      <div>
                        <CartHeader />
                        <Suspense fallback={<LoadingSpinner />}>
                          <VeterinariosProductosPage />
                        </Suspense>
                        <Footer />
                      </div>
                    </PageTracker>
                  </CartProvider>
                </ProtectedRoute>
              } />
            
            <Route path="/petshops/productos" element={
              <ProtectedRoute requireAuth={true}>
                <CartProvider>
                  <PageTracker>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <PetShopsProductosPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </PageTracker>
                </CartProvider>
              </ProtectedRoute>
            } />
            
            {/* Páginas de detalle de producto */}
            <Route path="/veterinarios/productos/:productId" element={
              <ProtectedRoute requireAuth={true}>
                <CartProvider>
                  <PageTracker>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProductDetailPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </PageTracker>
                </CartProvider>
              </ProtectedRoute>
            } />
            
            <Route path="/petshops/productos/:productId" element={
              <ProtectedRoute requireAuth={true}>
                <CartProvider>
                  <PageTracker>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProductDetailPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </PageTracker>
                </CartProvider>
              </ProtectedRoute>
            } />
            
            {/* Contacto */}
            <Route path="/contacto" element={
              <PageTracker>
                <div>
                  <Header />
                  <Suspense fallback={<LoadingSpinner />}>
                    <ContactPage />
                  </Suspense>
                  <Footer />
                </div>
              </PageTracker>
            } />
            
            {/* Página Pública */}
            <Route path="/publico" element={
              <PageTracker>
                <Suspense fallback={<LoadingSpinner />}>
                  <PublicPage />
                </Suspense>
              </PageTracker>
            } />
            
            {/* Admin */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <CartProvider>
                  <PageTracker>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </PageTracker>
                </CartProvider>
              </ProtectedRoute>
            } />
            
            {/* Portal de Clientes */}
            <Route path="/client" element={<Navigate to="/client/login" replace />} />
            
            <Route path="/client/login" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ClientLoginPage />
              </Suspense>
            } />
            
            <Route path="/client/dashboard" element={
              <ProtectedClientRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ClientDashboardPage />
                </Suspense>
              </ProtectedClientRoute>
            } />
            
            <Route path="/client/profile" element={
              <ProtectedClientRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ClientProfilePage />
                </Suspense>
              </ProtectedClientRoute>
            } />
            
            <Route path="/client/account" element={
              <ProtectedClientRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ClientAccountPage />
                </Suspense>
              </ProtectedClientRoute>
            } />
            
            <Route path="/client/promotions" element={
              <ProtectedClientRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ClientPromotionsPage />
                </Suspense>
              </ProtectedClientRoute>
            } />
            
            {/* Página 404 para rutas no encontradas */}
            <Route path="*" element={
              <PageTracker>
                <Suspense fallback={<LoadingSpinner />}>
                  <NotFoundPage />
                </Suspense>
              </PageTracker>
            } />
          </Routes>
          
          {/* Barra de productos seleccionados */}
          {/* <ProductSelectionBar /> */}
        </div>
                </ProductProvider>
              </ClientAuthProvider>
            </AuthProvider>
          </Router>
        </ToastProvider>
      </ErrorBoundary>
  )
}

export default App