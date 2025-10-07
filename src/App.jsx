import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartHeader from './components/CartHeader'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ProductSelectionBar from './components/ProductSelectionBar'
import HomePage from './pages/HomePage'
import VeterinariosLandingPage from './pages/VeterinariosLandingPage'
import VeterinariosProductosPage from './pages/VeterinariosPage'
import PetShopsLandingPage from './pages/PetShopsLandingPage'
import PetShopsProductosPage from './pages/PetShopsPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Página pública */}
              <Route path="/" element={<HomePage />} />
              
              {/* Páginas de presentación */}
              <Route path="/veterinarios" element={
                <ProtectedRoute requireAuth={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <VeterinariosLandingPage />
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
                      <PetShopsLandingPage />
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
                      <VeterinariosProductosPage />
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
                      <PetShopsProductosPage />
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
                      <ProductDetailPage />
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
                      <ProductDetailPage />
                      <Footer />
                    </div>
                  </CartProvider>
                </ProtectedRoute>
              } />
              
              {/* Contacto */}
              <Route path="/contacto" element={
                <div>
                  <Header />
                  <ContactPage />
                  <Footer />
                </div>
              } />
              
              {/* Admin */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <CartProvider>
                    <div>
                      <CartHeader />
                      <AdminPage />
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