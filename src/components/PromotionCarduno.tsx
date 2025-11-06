import React, { useState, useEffect } from "react"
import axios from "axios"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { useNavigate, Link } from "react-router-dom"
import { AiOutlineArrowRight as AiRightIcon } from "react-icons/ai"

type Producto = {
  id: number
  nombre: string
  cantidad: number
  fotos: string[]
}

type Promocion = {
  id: number
  nombre: string
  precio_promocion: string
  productos: Producto[]
}

const PromocionesCarduno: React.FC = () => {
  const navigate = useNavigate()
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await axios.get("https://importadoramiranda.com/api/promociones")
        setPromociones(response.data.promociones)
      } catch (err) {
        setError("Error al cargar las promociones.")
      } finally {
        setLoading(false)
      }
    }
    fetchPromociones()
  }, [])

  const navigateToDetails = (promocion: Promocion) => {
    navigate(`/promocion/${promocion.id}`)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500"></div>
    </div>
  )

  if (error) return (
    <div className="text-center text-red-500 py-10">
      {error}
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 h-auto p-4 pb-8 md:pb-10">
      <h1 
        className="text-center mb-8 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse font-['Lilita_One']"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
      >
        Promociones Especiales
      </h1>

      {/* Desktop View */}
      <div className="hidden md:block relative">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={3}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="mySwiper"
        >
          {promociones.map((promocion) => {
            const imageUrl = promocion.productos[0]?.fotos[0] 
              ? `https://importadoramiranda.com/storage/${promocion.productos[0].fotos[0]}`
              : "/placeholder.svg"

            return (
              <SwiperSlide key={promocion.id}>
                <div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer"
                  onClick={() => navigateToDetails(promocion)}
                >
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-3 text-center text-gray-800 h-16">
                      {promocion.nombre}
                    </h2>

                    <div className="mb-4 h-48">
                      <img 
                        src={imageUrl} 
                        alt={promocion.nombre}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">
                        Bs {promocion.precio_promocion}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
        
        {/* Custom Navigation */}
        <div className="swiper-button-prev absolute top-1/2 left-0 z-10 text-purple-600 bg-white rounded-full p-2 shadow-lg -translate-y-1/2"></div>
        <div className="swiper-button-next absolute top-1/2 right-0 z-10 text-purple-600 bg-white rounded-full p-2 shadow-lg -translate-y-1/2"></div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={1}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination]}
          className="mySwiper"
        >
          {promociones.map((promocion) => {
            const imageUrl = promocion.productos[0]?.fotos[0] 
              ? `https://importadoramiranda.com/storage/${promocion.productos[0].fotos[0]}`
              : "/placeholder.svg"

            return (
              <SwiperSlide key={promocion.id}>
                <div 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer"
                  onClick={() => navigateToDetails(promocion)}
                >
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-3 text-center text-gray-800 h-16">
                      {promocion.nombre}
                    </h2>

                    <div className="mb-4 h-48">
                      <img 
                        src={imageUrl} 
                        alt={promocion.nombre}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">
                        Bs {promocion.precio_promocion}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <div className="flex justify-center mt-12">
        <Link
          to="/promociones"
          className="group relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-purple-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md hover:shadow-lg hover:bg-purple-500 hover:text-white"
        >
          <span className="absolute inset-0 flex items-center justify-center text-purple-600 transition-all duration-300 transform group-hover:translate-x-full ease">
            <AiRightIcon className="h-6 w-6" />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            Ver todas las promociones
          </span>
          <span className="relative invisible">Ver todas las promociones</span>
        </Link>
      </div>

      <style>{`
        .swiper-button-prev::after,
        .swiper-button-next::after {
          content: '';
        }
      `}</style>
    </div>
  )
}

export default PromocionesCarduno;