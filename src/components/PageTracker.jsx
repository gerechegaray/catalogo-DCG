import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'

const PageTracker = ({ children }) => {
  const location = useLocation()
  const { recordPageView } = useProducts()
  const lastTrackedPath = useRef(null)
  const trackingTimeout = useRef(null)

  useEffect(() => {
    // Limpiar timeout anterior si existe
    if (trackingTimeout.current) {
      clearTimeout(trackingTimeout.current)
    }

    // Mapear rutas a nombres más específicos y detallados
    const getPageName = (pathname) => {
      if (pathname === '/') return 'Home'
      
      // Veterinarios con detalles específicos
      if (pathname === '/veterinarios') return 'Veterinarios - Página Principal'
      if (pathname === '/veterinarios/productos') return 'Veterinarios - Todos los Productos'
      if (pathname.startsWith('/veterinarios/productos/')) return 'Veterinarios - Detalle de Producto'
      
      // PetShops con detalles específicos
      if (pathname === '/petshops') return 'PetShops - Página Principal'
      if (pathname === '/petshops/productos') return 'PetShops - Todos los Productos'
      if (pathname.startsWith('/petshops/productos/')) return 'PetShops - Detalle de Producto'
      
      if (pathname === '/contacto') return 'Contacto'
      if (pathname === '/admin') return 'Admin'
      return 'Otra Página'
    }

    const pageName = getPageName(location.pathname)
    
    // Solo trackear si es una nueva página o después de un delay
    if (lastTrackedPath.current !== location.pathname) {
      // Trackear inmediatamente para nueva página
      recordPageView(pageName)
      lastTrackedPath.current = location.pathname
      console.log('📍 PageTracker: Nueva página detectada:', pageName)
    } else {
      // Si es la misma página, usar debounce para evitar doble conteo
      trackingTimeout.current = setTimeout(() => {
        // Solo trackear si realmente es una nueva visita (no re-render)
        console.log('📍 PageTracker: Debounce activado para:', pageName)
      }, 1000) // 1 segundo de debounce
    }

    // Cleanup
    return () => {
      if (trackingTimeout.current) {
        clearTimeout(trackingTimeout.current)
      }
    }
  }, [location.pathname, recordPageView])

  return children
}

export default PageTracker
