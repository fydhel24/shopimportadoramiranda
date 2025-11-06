import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../carrito/CarritoContext';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  fotos: string[];
  cantidad?: number;
}

interface Promotion {
  id: number;
  nombre: string;
  descripcion: string;
  precio_promocion: string;
  fotos: string[];
  productos: Product[];
  fecha_inicio: string;
  fecha_fin: string;
  sucursal: {
    nombre: string;
    direccion: string;
  };
}

const PromotionDetails = () => {
  const { promotionId } = useParams<{ promotionId: string }>();
  const { addToCart, cartItems } = useCart();
  const [promotionDetails, setPromotionDetails] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const response = await fetch(`https://importadoramiranda.com/api/promociones/${promotionId}`);
        if (!response.ok) throw new Error('Error al obtener los detalles de la promoción');
        const data = await response.json();
        setPromotionDetails(data.promocion);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (promotionId) {
      fetchPromotionDetails();
    }
  }, [promotionId]);

  const handleAddToCart = () => {
    if (!promotionDetails) return;
  
    // Crear detalles que incluyan los productos de la promoción
    const cartItems = promotionDetails.productos.map(producto => {
      return {
        id: producto.id, // Enviamos el id del producto
        name: producto.nombre,
        price: Number.parseFloat(promotionDetails.precio_promocion),
        img: producto.fotos[0]
          ? `https://importadoramiranda.com/storage/${producto.fotos[0]}`
          : "/placeholder.jpg",
        isPromotion: true, // Indicamos que es parte de una promoción
        promotionDetails: {
          name: promotionDetails.nombre,
          description: `Incluye: ${producto.nombre}`,
          idProducto: producto.id, // Aseguramos que el id del producto esté aquí
        }
      };
    });
  
    // Agregar cada producto individualmente al carrito
    cartItems.forEach(item => {
      addToCart(item);
    });
  
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  

  const isInCart = (promotionId: number) => cartItems.some(item => item.id === promotionId);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
    arrows: true,
    prevArrow: <ChevronLeft className="text-blue-600 w-8 h-8" />,
    nextArrow: <ChevronRight className="text-blue-600 w-8 h-8" />
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (error || !promotionDetails) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500">{error || 'No se encontraron detalles de la promoción'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4 py-8 mt-[3cm]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Galería de Imágenes */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Slider {...sliderSettings}>
                {promotionDetails.productos.flatMap(producto =>
                  producto.fotos.map((foto, index) => (
                    <div key={index} className="aspect-square">
                      <motion.img
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        src={`https://importadoramiranda.com/storage/${foto}`}
                        alt={`${producto.nombre} - Vista ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))
                )}
              </Slider>
            </div>
          </div>

          {/* Información de la Promoción */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {promotionDetails.nombre}
              </h1>

              {promotionDetails.descripcion && (
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {promotionDetails.descripcion}
                </p>
              )}

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  Bs {promotionDetails.precio_promocion}
                </span>
              </div>

              {promotionDetails.fecha_fin && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>Válido hasta: {new Date(promotionDetails.fecha_fin).toLocaleDateString()}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors ${addedToCart ? 'bg-green-500' : isInCart(promotionDetails.id) ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addedToCart ? '¡Añadido!' : isInCart(promotionDetails.id) ? 'En el Carrito' : 'Agregar al Carrito'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800"
                >
                  Comprar Ahora
                </motion.button>
              </div>
            </div>

            {/* Detalles Adicionales */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Detalles de la Promoción
              </h3>
              <ul className="space-y-3">
                <li>
                  <strong>Sucursal:</strong> {promotionDetails.sucursal.nombre} - {promotionDetails.sucursal.direccion}
                </li>
              </ul>
            </div>

            {/* Productos Incluidos */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Productos Incluidos
              </h3>
              <div className="space-y-4">
                {promotionDetails.productos.map((producto, index) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={producto.fotos[0] ? `https://importadoramiranda.com/storage/${producto.fotos[0]}` : "/placeholder.jpg"}
                      alt={producto.nombre}
                      className="w-20 h-20 object-cover rounded-lg shadow-md"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{producto.nombre}</p>
                      <p className="text-sm text-gray-600">{producto.descripcion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PromotionDetails;