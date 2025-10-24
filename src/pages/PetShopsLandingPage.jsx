import React from 'react'
import SectionCarousel from '../components/SectionCarousel'
import BrandsGrid from '../components/BrandsGrid'
import FeaturedProducts from '../components/FeaturedProducts'

const PetShopsLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
      {/* Carrusel Hero dinámico */}
      <SectionCarousel />

      {/* Productos destacados */}
      <FeaturedProducts />

      {/* Sección de marcas */}
      <BrandsGrid />
    </div>
  )
}

export default PetShopsLandingPage