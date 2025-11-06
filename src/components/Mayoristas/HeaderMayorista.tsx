import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderMayorista = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Estado para el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Paleta de colores personalizada
  const primaryColor = "#4e04f6"; // Morado oscuro
  const secondaryColor = "#8004f5"; // Púrpura vibrante
  const accentColor = "#b707e9"; // Magenta
  const highlightColor = "#e10ade"; // Rosado fuerte
  const backgroundGradient = `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${highlightColor})`;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 shadow-md"
      style={{ background: backgroundGradient }}
    >
      <div className="container mx-auto px-8 py-6 md:py-8 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-4"
        >
          <Link to="/main" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Importadora Miranda"
              className="h-12 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-white">Importadora Miranda</h1>
              <p className="text-sm text-pink-200">Productos de calidad</p>
            </div>
          </Link>
        </motion.div>

        {/* Navegación en desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { path: '/main', label: 'Inicio' },
            { path: '/categoriamayor', label: 'Categorías' },
            { path: '/productosmayoristas', label: 'Productos' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative group ${
                currentPath === item.path
                  ? 'text-white font-semibold'
                  : 'text-pink-200 hover:text-white'
              } transition-colors duration-300`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 w-full h-0.5 bg-pink-400 transform transition-transform duration-300 ${
                  currentPath === item.path
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Botón del menú móvil */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden text-white text-center overflow-hidden"
            style={{ background: backgroundGradient }}
          >
            {[
              { path: '/main', label: 'Inicio' },
              { path: '/categoriamayor', label: 'Categorías' },
              { path: '/productosmayoristas', label: 'Productos' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-3 ${
                  currentPath === item.path
                    ? 'bg-opacity-20 font-semibold'
                    : 'hover:bg-opacity-30'
                } transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default HeaderMayorista;
