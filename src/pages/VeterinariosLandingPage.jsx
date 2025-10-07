import React from 'react'
import SectionCarousel from '../components/SectionCarousel'
import BrandsGrid from '../components/BrandsGrid'
import FeaturedProducts from '../components/FeaturedProducts'

const VeterinariosLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Carrusel Hero dinámico */}
      <SectionCarousel />

      {/* Sección de marcas */}
      <BrandsGrid />

      {/* Productos destacados */}
      <FeaturedProducts />
    </div>
  )
}

export default VeterinariosLandingPage
