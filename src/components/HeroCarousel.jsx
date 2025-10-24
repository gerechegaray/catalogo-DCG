import React, { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { recordAdClick } = useProducts()

  const slides = [
    {
      id: 1,
      title: "NUEVOS PRODUCTOS ELMER",
      subtitle: "MEDICAMENTOS CONDUCTUALES",
      description: "Descubre la nueva línea de productos para el manejo del comportamiento animal",
      image: "/placeholder-product.svg",
      buttonText: "Ver Productos",
      buttonLink: "/veterinarios",
      badge: "NUEVO"
    },
    {
      id: 2,
      title: "PROMOCIÓN VACUNAS",
      subtitle: "DESCUENTOS ESPECIALES",
      description: "Aprovecha nuestros descuentos en vacunas e inmunológicos para el mes de enero",
      image: "/placeholder-product.svg",
      buttonText: "Ver Promociones",
      buttonLink: "/veterinarios",
      badge: "PROMO"
    },
    {
      id: 3,
      title: "ALIMENTOS PREMIUM",
      subtitle: "OLD PRINCE & COMPANY",
      description: "Nueva llegada de alimentos premium para perros y gatos con descuentos especiales",
      image: "/placeholder-product.svg",
      buttonText: "Ver Alimentos",
      buttonLink: "/petshops",
      badge: "NUEVO"
    },
    {
      id: 4,
      title: "EQUIPOS MÉDICOS",
      subtitle: "TECNOLOGÍA AVANZADA",
      description: "Instrumentos y equipos de última generación para clínicas veterinarias",
      image: "/placeholder-product.svg",
      buttonText: "Ver Equipos",
      buttonLink: "/veterinarios",
      badge: "OFERTA"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

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
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/70"></div>
            </div>
            
            {/* Contenido */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center mb-4">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold mr-4 ${
                        slide.badge === 'NUEVO' ? 'bg-green-500 text-white' :
                        slide.badge === 'PROMO' ? 'bg-orange-500 text-white' :
                        slide.badge === 'OFERTA' ? 'bg-red-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
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
                        recordAdClick(slide.id.toString(), slide.title)
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

      {/* Badges promocionales */}
      <div className="absolute top-8 right-8 flex flex-col space-y-3">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          💳 CRÉDITOS CON DNI
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          🚚 ENVÍO GRATIS
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          📞 WHATSAPP DIRECTO
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
