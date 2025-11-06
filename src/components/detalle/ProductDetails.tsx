import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../carrito/CarritoContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductToCart {
  id: number;
  name: string;
  price: number;
  img: string;
}
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_descuento: string;
  stock: number;
  estado: number;
  categoria: { id: string; categoria: string };
  marca: { id: string; marca: string };
  tipo: { id: string; tipo: string };
  precio_productos: Array<{
    precio_extra: string;
    precio_general: string;
    precio_unitario: string;
  }>;
}
interface Foto {
  identificacion: number;
  foto: string;
}
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  fotos: Foto[];
  imageUrl?: string; // Añadimos imageUrl aquí
}

const ProductDetails: React.FC = () => {

  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [product] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const navigate = useNavigate(); // Inicializa useNavigate para navegar entre rutas

  const manejarClicImagen = (id: number) => {
    console.log(`ID del producto seleccionado: ${id}`);
    console.log(`Nombre del producto seleccionado: ${product?.nombre}`);
    
    // Navega a la página de detalles del producto con el ID seleccionado
    navigate(`/producto/${id}`);
  };

  

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`https://importadoramiranda.com/api/producto/${productId}`);
          if (!response.ok) throw new Error('Error al obtener los detalles del producto');
          const data = await response.json();
          setProductDetails(data);
  
          // Mostrar el precio_extra en la consola
          if (data.precio_extra) {
            console.log("Precio extra:", data.precio_extra);
          } else {
            console.log("No se encontró precio extra.");
          }
  
          // Mostrar el ID de la categoría en la consola
          if (data.categoria && data.categoria.id) {
            console.log("ID de la categoría:", data.categoria.id);
          } else {
            console.log("El producto no tiene una categoría asociada.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    }
  }, [productId]);
  
  
  useEffect(() => {
    if (productDetails?.categoria?.id) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await fetch(
            `https://importadoramiranda.com/api/lupe/filtro_categorias?id_categoria=${productDetails.categoria.id}`
          );
  
          if (!response.ok) throw new Error("Error al obtener productos relacionados");
  
          const data = await response.json();
  
          if (data.length > 0 && data[0].productos) {
            // Filtrar para que no aparezca el producto actual
            const filteredProducts = data[0].productos
              .filter((prod: Product) => prod.id !== productDetails.id)
              .map((prod: Product) => ({
                ...prod,
                imageUrl: prod.fotos.length > 0 
                  ? `https://importadoramiranda.com/storage/${prod.fotos[0].foto}` 
                  : "https://via.placeholder.com/150" // Imagen de respaldo
              }));
  
            setRelatedProducts(filteredProducts);
          } else {
            setRelatedProducts([]);
          }
        } catch (err) {
          console.error("Error cargando productos relacionados:", err);
          setRelatedProducts([]);
        }
      };
  
      fetchRelatedProducts();
    }
  }, [productDetails]);

  
// In the handleAddToCart function, update the price parsing
const handleAddToCart = () => {
  if (!productDetails?.fotos?.[0]?.foto) return;

  // Extract precio_extra from the first item in precio_productos
  const precioExtra = productDetails.precio_productos?.[0]?.precio_extra || productDetails.precio;

  const productToAdd: ProductToCart = {
    id: parseInt(productDetails.id),
    name: productDetails.nombre,
    price: parseFloat(precioExtra), 
    img: `https://importadoramiranda.com/storage/${productDetails.fotos[0].foto}`,
  };

  addToCart(productToAdd);
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
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
  if (error || !productDetails) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500">{error || 'No se encontraron detalles'}</p>
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
          <div className="space-y-4">
            <motion.div 
              layoutId={`product-image-${selectedImage}`}
              className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {productDetails.fotos?.[selectedImage]?.foto && (
                <img
                  src={`https://importadoramiranda.com/storage/${productDetails.fotos[selectedImage].foto}`}
                  alt={productDetails.nombre}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  onClick={() => setShowZoom(true)}
                />
              )}
            </motion.div>
            
            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-2">
              {productDetails.fotos?.map((foto: any, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  } hover:shadow-lg transition-all duration-300`}
                >
                  <img
                    src={`https://importadoramiranda.com/storage/${foto.foto}`}
                    alt={`${productDetails.nombre} - Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Información del Producto */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold mb-2">{productDetails.nombre}</h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-400'}`} />
                </motion.div>
              ))}
              <span className="text-gray-500">(1 Review)</span>
            </div>

            <motion.p 
              className="text-gray-700 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {productDetails.descripcion}
            </motion.p>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <motion.div 
                className="flex items-baseline gap-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
<span className="text-4xl font-bold text-blue-600">
  Bs.{productDetails.precio_productos?.[0]?.precio_extra || productDetails.precio || '0.00'}
</span>
{productDetails.precio_productos?.[0]?.precio_extra && (
  <span className="text-xl text-gray-500 line-through">
    Bs.{(parseFloat(productDetails.precio_productos[0].precio_extra) + 100).toFixed(2)}
  </span>
)}


              </motion.div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-blue-100 text-blue-600"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-5 w-5" />
                  </motion.button>
                  <span className="text-2xl font-semibold min-w-[3ch] text-center">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-blue-100 text-blue-600"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-colors ${
                      addedToCart ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {addedToCart ? '¡Añadido!' : 'Agregar al Carrito'}
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
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Categoría', value: productDetails.categoria?.categoria },
                { label: 'Marca', value: productDetails.marca?.marca },
                { label: 'Tipo', value: productDetails.tipo?.tipo },
                { label: 'stock_sucursal_1', value: `${productDetails.stock_sucursal_1} unidades` }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow"
                >
                  <span className="block font-medium text-gray-600">{item.label}</span>
                  <span className="text-gray-900">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
{/* Productos relacionados */}
{/* Productos relacionados */}
<div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Productos Sugerencias</h2>
        <motion.div className="relative" whileTap={{ cursor: "grabbing" }}>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            drag="x"
            dragConstraints={{ left: -1000, right: 0 }}
            dragElastic={0.2}
          >
            {relatedProducts.slice(0, 5).map((prod) => (
                <motion.div
                  key={prod.id}
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
                  onClick={() => manejarClicImagen(prod.id)}
                  whileHover={{ y: -5 }}
                >
                 
                  <div className="p-1">
                  <img src={prod.imageUrl || "/placeholder.svg"} alt={prod.nombre} className="w-full h-60 object-cover" />
                  </div>
                </motion.div>
              ))}
            <motion.div
              className="relative bg-gradient-to-r from-blue-500 to-blue-500 rounded-lg shadow-lg overflow-hidden cursor-pointer flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (productDetails.categoria?.categoria) {
                  const categoryName = encodeURIComponent(productDetails.categoria.categoria);
                  console.log("Redirigiendo a:", `/categoriamayor/${categoryName}`);
                  navigate(`/categorias/${categoryName}`);  // Asegúrate de que esta es la ruta correcta
                } else {
                  console.error("Categoría no encontrada");
                }
              }}
            >

              <div className="text-white text-center p-4">
                <h3 className="text-2xl font-bold mb-2">Ver más</h3>
                <p>Descubre más productos</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>



      {/* Modal de zoom */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={() => setShowZoom(false)}
          >
            <motion.img
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              src={`https://importadoramiranda.com/storage/${productDetails.fotos[selectedImage].foto}`}
              alt={productDetails.nombre}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default ProductDetails;