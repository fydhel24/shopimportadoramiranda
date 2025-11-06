import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from './prodcucto/ProductCard';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_descuento: string;
  stock: number;
  estado: number;
  fecha: string;
  id_cupo: number;
  id_tipo: number;
  id_categoria: number;
  id_marca: number;
  created_at: string;
  updated_at: string;
  precio_extra: string;
  stock_sucursal_1: number;
  categoria: {
    id: number;
    categoria: string;
  };
  marca: {
    id: number;
    marca: string;
  };
  tipo: {
    id: number;
    tipo: string;
  };
  cupo: {
    id: number;
    codigo: string;
    porcentaje: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
  };
  fotos: Array<{
    id: number;
    foto: string;
  }>;
  precio_productos: Array<{
    id: number;
    precio_unitario: string;
    precio_general: string;
    precio_extra: string;
  }>;
}

interface Categoria {
  id: number;
  categoria: string;
  productos: Producto[];
}

const CategoriaProductos: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set());
  const [fallingImages, setFallingImages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchProductosPorCategoria = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://www.importadoramiranda.com/api/lupe/categorias`);
      const categoriaEncontrada = response.data.find((categoria: Categoria) =>
        categoria.categoria.toLowerCase() === categoryName?.toLowerCase()
      );

      if (categoriaEncontrada) {
        setProductos(categoriaEncontrada.productos);
        setFilteredProductos(categoriaEncontrada.productos);
      } else {
        setError(`No se encontraron productos para la categoría: ${categoryName}`);
      }
      setLoading(false);
    } catch (error) {
      setError('No se pudieron cargar los productos de esta categoría.');
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProductosPorCategoria();
  }, [fetchProductosPorCategoria]);

  useEffect(() => {
    const imagesArray = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      size: Math.random() * 80 + 50,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFallingImages(imagesArray);
  }, []);

  useEffect(() => {
    const filteredResults = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProductos(filteredResults);
  }, [searchQuery, productos]);

  const observer = useCallback((node: HTMLElement) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleProducts((prev) => new Set(prev.add(parseInt(entry.target.id))));
        }
      });
    });
    if (node) io.observe(node);
  }, []);

  const productosOrdenados = filteredProductos.sort((a, b) => {
    if (a.stock_sucursal_1 === 0 && b.stock_sucursal_1 > 0) return 1;
    if (a.stock_sucursal_1 > 0 && b.stock_sucursal_1 === 0) return -1;
    return 0;
  });

  if (loading && productos.length === 0) {
    return <div className="text-center mt-10">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-20 mt-20 relative">

<div className="container mx-auto px-4">
<div className="text-center mb-4 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Productos en {categoryName}
            </h2>
          </div>
          <div className="sticky top-[5rem] z-10 bg-white/90 backdrop-blur-sm py-4 mb-6 shadow-sm">
          

          <div className="max-w-xl mx-auto">
          <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                window.scrollTo(0, 0);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg placeholder-gray-400 transition-all duration-300 ease-in-out hover:shadow-md"
            />
            <svg
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productosOrdenados.map((producto: Producto) => (
            <div
              key={producto.id}
              id={String(producto.id)}
              ref={(node) => observer(node!)}
              className={`product-card transition-opacity duration-1000 ${
                visibleProducts.has(producto.id) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ProductCard 
                producto={producto}
                index={producto.id}
                cartPosition={{ x: 0, y: 0 }}
              />
            </div>
          ))}
        </div>

        {loading && productos.length > 0 && (
          <div className="flex justify-center items-center py-4">
            <p className="text-lg text-gray-600">Cargando más productos...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriaProductos;