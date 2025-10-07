import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getActiveCommunications } from '../services/communicationsService'

const SectionCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const isVeterinarios = location.pathname.startsWith('/veterinarios')
  const isPetShops = location.pathname.startsWith('/petshops')

  // Cargar comunicados activos para la sección actual
  useEffect(() => {
    const loadCommunications = async () => {
      try {
        setLoading(true)
        let section = null
        if (isVeterinarios) {
          section = 'veterinarios'
        } else if (isPetShops) {
          section = 'petshops'
        }
        
        console.log('🎠 SectionCarousel: Cargando comunicados para sección:', section)
        
        if (section) {
          const comms = await getActiveCommunications(section)
          console.log('🎠 SectionCarousel: Comunicados recibidos:', comms.length)
          setSlides(comms)
        } else {
          console.log('🎠 SectionCarousel: No hay sección definida')
          setSlides([])
        }
      } catch (error) {
        console.error('❌ SectionCarousel: Error al cargar comunicados:', error)
        setSlides([])
      } finally {
        setLoading(false)
      }
    }

    loadCommunications()
  }, [isVeterinarios, isPetShops])

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, 5000)

      return () => clearInterval(timer)
    }
  }, [slides.length])

  // Si está cargando o no hay slides, no renderizar nada
  if (loading) {
    return (
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Cargando comunicados...</p>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    console.log('🎠 SectionCarousel: No hay slides, no renderizando carousel')
    return null
  }

  console.log('🎠 SectionCarousel: Renderizando carousel con', slides.length, 'slides')
  console.log('🎠 SectionCarousel: Slides data:', slides.map(s => ({ title: s.title, section: s.section })))
  console.log('🎠 SectionCarousel: Iniciando renderizado del carousel') // Debug log
  console.log('🎠 SectionCarousel: Slide actual:', slides[currentSlide]) // Debug log
  console.log('🎠 SectionCarousel: Imagen del slide actual:', slides[currentSlide]?.image) // Debug log

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'NUEVO': return 'bg-green-500 text-white'
      case 'IMPORTANTE': return 'bg-red-500 text-white'
      case 'PROMO': return 'bg-orange-500 text-white'
      case 'OFERTA': return 'bg-purple-500 text-white'
      default: return 'bg-blue-500 text-white'
    }
  }

  return (
    <div className="relative h-[500px] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className="relative h-full">
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <img
                src={slide.image || 'https://i.imgur.com/placeholder.jpg'}
                alt={slide.title}
                className="w-full h-full object-cover"
                onLoad={() => console.log('✅ Imagen cargada:', slide.image)}
                onError={(e) => {
                  console.log('❌ Error cargando imagen:', slide.image)
                  // Cambiar a imagen de fallback
                  e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=500&fit=crop'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/70"></div>
            </div>
            
            {/* Contenido */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center mb-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold mr-4 ${getBadgeColor(slide.badge)}`}>
                        {slide.badge}
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                      {slide.title}
                    </h2>
                    <h3 className="text-3xl font-semibold text-blue-200 mb-6 drop-shadow-lg">
                      {slide.subtitle}
                    </h3>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <a
                      href={slide.buttonLink}
                      className="inline-block bg-gradient-to-r from-white to-blue-100 text-blue-800 px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-100 hover:to-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = slide.buttonLink
                      }}
                    >
                      {slide.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default SectionCarousel