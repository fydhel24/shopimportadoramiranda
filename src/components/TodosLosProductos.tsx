import type React from "react"
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import ProductCard from "./prodcucto/ProductCard"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: string
  precio_descuento: string
  stock: number
  estado: number
  fecha: string
  id_cupo: number
  id_tipo: number
  id_categoria: number
  id_marca: number
  created_at: string
  updated_at: string
  precio_extra: string
  stock_sucursal_1: number
  categoria: {
    id: number
    categoria: string
  }
  marca: {
    id: number
    marca: string
  }
  tipo: {
    id: number
    tipo: string
  }
  cupo: {
    id: number
    codigo: string
    porcentaje: string
    estado: string
    fecha_inicio: string
    fecha_fin: string
  }
  fotos: Array<{
    id: number
    foto: string
  }>
  precio_productos: Array<{
    id: number
    precio_unitario: string
    precio_general: string
    precio_extra: string
  }>
}

const TodosLosProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([])
  const [visibleCount, setVisibleCount] = useState<number>(20)

  const fetchTodosLosProductos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://www.importadoramiranda.com/api/lupe/categorias")
      const productos = response.data.flatMap((categoria: any) => categoria.productos)
      setProductos(productos)
      setFilteredProductos(productos)
      setLoading(false)
    } catch (error) {
      setError("No se pudieron cargar los productos.")
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodosLosProductos()
  }, [fetchTodosLosProductos])

  const observer = useCallback((node: HTMLElement) => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleProducts((prev) => new Set(prev.add(Number.parseInt(entry.target.id))))
        }
      })
    })
    if (node) io.observe(node)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase()
    setFilteredProductos(
      productos
        .filter((producto) => producto.nombre.toLowerCase().includes(lowerCaseQuery))
        .sort((a, b) => {
          if (a.estado === 1 && b.estado !== 1) return -1
          if (a.estado !== 1 && b.estado === 1) return 1
          if (a.stock_sucursal_1 > 0 && b.stock_sucursal_1 === 0) return -1
          if (a.stock_sucursal_1 === 0 && b.stock_sucursal_1 > 0) return 1
          return 0
        }),
    )
  }, [searchQuery, productos])

  const showMoreProducts = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 20, filteredProductos.length))
  }

  const showLessProducts = () => {
    setVisibleCount((prevCount) => Math.max(prevCount - 20, 20))
  }

  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.querySelector(".sticky")
      if (searchBar) {
        if (window.scrollY > 100) {
          searchBar.classList.add("compact")
        } else {
          searchBar.classList.remove("compact")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (loading && productos.length === 0) {
    return <div className="text-center mt-10">Cargando productos...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>
  }

  return (
    <section>
       <div className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 z-10 shadow-lg py-6 mb-6 mt-[3cm] transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-purple-800 transition-all duration-300 ease-in-out">
            Todos los productos
          </h2>
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-purple-200 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-300 blur-lg"></div>
            <input
              type="text"
              id="search"
              aria-label="Buscar productos"
              placeholder="Busca entre miles de productos..."
              className="w-full px-6 py-3 border-2 border-purple-200 rounded-full 
              focus:outline-none focus:ring-4 focus:ring-purple-300 
              text-lg text-gray-700 placeholder-purple-400 
              bg-white/80 backdrop-blur-sm 
              transition-all duration-300 ease-in-out 
              hover:shadow-xl group-hover:border-purple-300
              relative z-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute right-6 top-1/2 transform -translate-y-1/2 
              text-purple-400 group-hover:text-purple-600 
              transition-colors duration-300 z-20"
              width="28"
              height="28"
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
            {searchQuery && (
              <span className="absolute right-16 top-1/2 transform -translate-y-1/2 
              text-gray-400 text-sm z-20 
              transition-all duration-300">
                {filteredProductos.length} resultados
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="py-6">
        <div className="container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProductos.slice(0, visibleCount).map((producto: Producto) => (
            <div
              key={producto.id}
              id={String(producto.id)}
              ref={(node) => {
                if (node) observer(node)
              }}
              className={`product-card transition-opacity duration-500 transform ${
                visibleProducts.has(producto.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <ProductCard
                producto={{
                  ...producto,
                  stock: producto.stock ?? 0,
                  precio_extra: producto.precio_extra || producto.precio,
                }}
                index={producto.id}
                cartPosition={{ x: 0, y: 0 }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center py-4 space-x-4">
          {visibleCount < filteredProductos.length && (
            <button
              onClick={showMoreProducts}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ease-in-out duration-300 transform hover:scale-105"
            >
              Ver más
            </button>
          )}
          {visibleCount > 20 && (
            <button
              onClick={showLessProducts}
              className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ease-in-out duration-300 transform hover:scale-105"
            >
              Ver menos
            </button>
          )}
        </div>
      </section>
    </section>
  )
}

export default TodosLosProductos

