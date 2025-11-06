import React, { useState, useEffect } from "react"
import axios from "axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useCart } from "./carrito/CarritoContext"
import { motion } from "framer-motion"
// In Promociones component, replace onClick={openModal} with navigation
import { useNavigate } from 'react-router-dom';

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

const Promociones: React.FC = () => {
  const navigate = useNavigate();
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPromocion, setSelectedPromocion] = useState<Promocion | null>(null)
  const { cartItems, addToCart, removeFromCart } = useCart()

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

  const handleComprar = (promocion: Promocion) => {
    const cartItemsToAdd = promocion.productos.map((producto) => {
      return {
        id: producto.id,  // Use the product's ID
        name: `${promocion.nombre} - ${producto.nombre}`,  // Add product name to differentiate
        price: Number.parseFloat(promocion.precio_promocion),  // Use the promotion's price for all products
        img: producto.fotos[0]
          ? `https://importadoramiranda.com/storage/${producto.fotos[0]}`
          : "/placeholder.jpg",
      };
    });
  
    cartItemsToAdd.forEach((cartItem) => {
      const existingItem = cartItems.find((item) => item.id === cartItem.id);
      if (existingItem) {
        removeFromCart(cartItem.id);
      } else {
        addToCart(cartItem);
      }
    });
  };
  
  
  
  const isInCart = (promocionId: number) => cartItems.some((item) => item.id === promocionId)

  const navigateToDetails = (promocion: Promocion) => {
    navigate(`/promocion/${promocion.id}`);
  };

  if (loading)
    return <div className="text-center py-4 text-2xl font-semibold text-gray-600">Cargando promociones...</div>
  if (error) return <div className="text-center py-4 text-2xl font-semibold text-red-600">{error}</div>

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    arrows: false,
  }

  return (
    <div className="p-4 min-h-screen" style={{ marginTop: "3cm", background: "transparent" }}>
      <h1 className="text-center mb-8 text-4xl font-bold text-gray-800 tracking-wide">Promociones Especiales</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {promociones.map((promocion) => {
          const uniqueImages = Array.from(
            new Set(
              promocion.productos.map((producto) =>
                producto.fotos.length > 0 ? `https://importadoramiranda.com/storage/${producto.fotos[0]}` : null,
              ),
            ),
          ).filter((image) => image !== null)

          return (
            <motion.div
              key={promocion.id}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigateToDetails(promocion)}
              style={{
                backgroundImage: `url('https://wallpapers.com/images/hd/purple-and-blue-background-1280-x-800-ajp62v7qahujohnv.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                className={`p-4 flex flex-col justify-between h-full ${isInCart(promocion.id) ? "bg-purple-300 bg-opacity-50" : "bg-white bg-opacity-55"}`}
              >
                <h2
                  className="text-xl font-extrabold mb-3 text-center px-3 py-2 rounded bg-purple-200 shadow-sm overflow-hidden"
                  style={{
                    color: "#1a202c",
                    textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "4rem",
                  }}
                >
                  {promocion.nombre}
                </h2>

                <div className="flex-grow mb-3">
                  {uniqueImages.length === 1 ? (
                    <img
                      src={(uniqueImages[0] as string) || "/placeholder.svg"}
                      alt={`Imagen promoción ${promocion.nombre}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <Slider {...settings} className="h-48">
                      {uniqueImages.map((image, index) => (
                        <div key={index}>
                          <img
                            src={(image as string) || "/placeholder.svg"}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>

                <div className="mt-auto">
                  <p className="text-2xl font-bold text-right mb-3">
                    <span
                      className="bg-blue-600 text-white px-3 py-1 rounded-full shadow-md"
                      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      Bs {promocion.precio_promocion}
                    </span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleComprar(promocion)
                    }}
                    className={`w-full py-2 px-4 text-white rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      isInCart(promocion.id)
                        ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    }`}
                  >
                    {isInCart(promocion.id) ? "Quitar del Carrito" : "Agregar al Carrito"}
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>


    </div>
  )
}

export default Promociones
