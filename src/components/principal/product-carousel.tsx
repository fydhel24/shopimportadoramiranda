import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useCart } from "../carrito/CarritoContext";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio_extra: string;
  imageUrl: string;
  stock: number;
}

export function AnimatedCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30"
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-blue-300/30 to-green-300/30"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 20, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  );
}

export function ProductCarousel({ products }: { products: Product[] }) {
  const availableProducts = products.filter((product) => product.stock > 0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (availableProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availableProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [availableProducts.length]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setCurrentIndex((prev) => (prev - 1 + availableProducts.length) % availableProducts.length);
    } else if (info.offset.x < -100) {
      setCurrentIndex((prev) => (prev + 1) % availableProducts.length);
    }
  };

  const handleAddToCart = () => {
    const product = availableProducts[currentIndex];
    addToCart({
      id: product.id,
      name: product.nombre,
      price: Number.parseFloat(product.precio_extra),
      img: product.imageUrl || "/placeholder.jpg",
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 overflow-hidden pt-16 pb-8 md:pb-10 mt-[2.5cm] h-auto">
      <AnimatedCircles />
      {availableProducts.length > 0 ? (
        <div ref={containerRef} className="relative h-full container mx-auto px-4 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={containerRef}
              onDragEnd={handleDragEnd}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full"
            >
              <div className="text-white space-y-4 md:space-y-6 order-2 md:order-1">
                <motion.div className="text-yellow-300 font-medium text-sm md:text-base">Oferta Especial</motion.div>
                <motion.h1 className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight">
                  {availableProducts[currentIndex].nombre}
                </motion.h1>
                <motion.p className="text-gray-200 text-sm md:text-base max-w-lg">
                  {availableProducts[currentIndex].descripcion.split("\r\n").slice(0, 2).join(" ")}
                </motion.p>
                <motion.div className="flex justify-center md:justify-start">
                  <button
                    onClick={handleAddToCart}
                    className="bg-white text-purple-600 px-6 py-2 md:px-8 md:py-3 rounded-full font-medium hover:bg-yellow-300 transition-colors inline-flex items-center space-x-2 shadow-lg text-sm md:text-base"
                  >
                    <span>Comprar ahora</span>
                    <span className="text-lg md:text-xl font-bold">Bs.{availableProducts[currentIndex].precio_extra}</span>
                  </button>
                </motion.div>
              </div>
              <motion.div className="relative aspect-square order-1 md:order-2 mb-4 md:mb-0">
                <img
                  src={availableProducts[currentIndex].imageUrl || "/placeholder.svg"}
                  alt={availableProducts[currentIndex].nombre}
                  className="object-contain w-full h-full mx-auto rounded-lg shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-white text-lg">No hay productos disponibles en este momento.</p>
      )}
    </div>
  );
}
