"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

interface Product {
  id: number
  nombre: string
  precio_extra: string
  fotos: {
    id: number
    foto: string
  }[]
}

interface Category {
  id: number
  categoria: string
  productos: Product[]
}

const Categorias: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://importadoramiranda.com/api/lupe/categorias")
        setCategories(response.data)
        setLoading(false)
      } catch (error) {
        setError("No se pudieron cargar las categorías.")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const filteredCategories = categories.filter((category) =>
    category.categoria.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCategoryClick = (category: Category) => {
    navigate(`/categoriamayor/${category.categoria}`)
  }

  if (loading) return <div className="text-center py-10 text-blue-600">Cargando categorías...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <section className=" relative min-h-screen bg-gradient-to-b from-blue-100 to-white">

      <div className="container mx-auto text-center mb-8 relative z-10">
        {/* Buscador estático */}

        {/* Buscador fijo */}
        <section className="py-10 mt-20 relative min-h-screen bg-gradient-to-b from-blue-100 to-white">
  {/* Sección estática con título */}
  <div className="container mx-auto text-center mb-8 relative z-10">
    <h2 className="text-4xl font-bold text-blue-800">Categorías Mayoristas</h2>
    <p className="text-gray-600 ">Elige una categoría para explorar productos</p>
  </div>

  {/* Buscador fijo */}
  <div className="sticky top-[2.1cm] z-50 bg-white py-4 shadow-md transition-all duration-300 transform hover:scale-105">
  <input
  type="text"
  placeholder="Buscar categoría..."
  
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    window.scrollTo(0, 0); // Esto hará que la página se desplace hacia arriba
  }}
  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg placeholder-gray-400 transition-all duration-300 ease-in-out hover:shadow-md compact:text-base compact:py-1.5"
/>

    <svg
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

  {/* Contenedor de productos */}
  <div className="container mx-auto px-4 mt-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredCategories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-blue-500"
          onClick={() => handleCategoryClick(category)}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
              Las mejores ofertas para ti en {category.categoria.toLowerCase()}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {category.productos.slice(0, 4).map((product) => (
                <div key={product.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                    {product.fotos.length > 0 ? (
                      <img
                        src={`https://importadoramiranda.com/storage/${product.fotos[0].foto}`}
                        alt={product.nombre}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                    )}
                  </div>

                  <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">{product.nombre}</h3>

                  <p className="text-sm text-gray-500">${product.precio_extra}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <span className="text-blue-600 hover:text-blue-700 font-medium">Ver Colección</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-blue-500"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
                  Las mejores ofertas para ti en {category.categoria.toLowerCase()}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {category.productos.slice(0, 4).map((product) => (
                    <div key={product.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                        {product.fotos.length > 0 ? (
                          <img
                            src={`https://importadoramiranda.com/storage/${product.fotos[0].foto}`}
                            alt={product.nombre}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
                        )}
                      </div>

                      <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">{product.nombre}</h3>

                      <p className="text-sm text-gray-500">${product.precio_extra}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">Ver Colección</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categorias
