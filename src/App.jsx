import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartHeader from './components/CartHeader'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ProductSelectionBar from './components/ProductSelectionBar'

// Lazy loading de páginas
const HomePage = React.lazy(() => import('./pages/HomePage'))
const VeterinariosLandingPage = React.lazy(() => import('./pages/VeterinariosLandingPage'))
const VeterinariosProductosPage = React.lazy(() => import('./pages/VeterinariosPage'))
const PetShopsLandingPage = React.lazy(() => import('./pages/PetShopsLandingPage'))
const PetShopsProductosPage = React.lazy(() => import('./pages/PetShopsPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'))

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
    <Router>
      <AuthProvider>
        <ProductProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Página pública */}
              <Route path="/" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HomePage />
                </Suspense>
              } />
              
              {/* Páginas de presentación */}
              <Route path="/veterinarios" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <VeterinariosLandingPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/petshops" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <PetShopsLandingPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              {/* Páginas de productos */}
              <Route path="/veterinarios/productos" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <VeterinariosProductosPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/petshops/productos" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <PetShopsProductosPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              {/* Páginas de detalle de producto */}
              <Route path="/veterinarios/productos/:productId" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProductDetailPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              <Route path="/petshops/productos/:productId" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProductDetailPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              {/* Contacto */}
              <Route path="/contacto" element={
                <div>
                  <Header />
                  <Suspense fallback={<LoadingSpinner />}>
                    <ContactPage />
                  </Suspense>
                  <Footer />
                </div>
              } />
              
              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <Suspense fallback={<LoadingSpinner />}>
                        <AdminPage />
                      </Suspense>
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Barra de productos seleccionados */}
            {/* <ProductSelectionBar /> */}
          </div>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App