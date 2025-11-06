import React, { useState, useEffect } from 'react';
import { useCart } from './CarritoContext'; // Importamos el contexto del carrito 
import { useNavigate, useLocation } from 'react-router-dom';
import './FloatingCart.css';



// Define las propiedades esperadas por el componente
interface FloatingCartProps {
  isCartOpen: boolean; // Indica si el carrito está abierto
  onClose: () => void; // Función para cerrar el carrito
}

const FloatingCart: React.FC<FloatingCartProps> = ({ isCartOpen, onClose }) => {
  const { cartItems, getTotal, incrementQuantity, decrementQuantity, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // Obtenemos la ubicación actual
  const [isBouncing, setIsBouncing] = useState(false);

  // Verificar si la ruta es una de las rutas mayoristas
  const isMayoristaRoute =
    location.pathname.startsWith('/categoriamayor') ||
    location.pathname.startsWith('/productosmayoristas') ||
    location.pathname.startsWith('/main') ||
    location.pathname.startsWith('/productomayor');

  

  const handleCheckout = () => {
    onClose(); // Cerrar el carrito
    
    // Redireccionar según el color del carrito
    if (isMayoristaRoute) {
      // Si estamos en una ruta mayorista (carrito azul), redirigir a pago1
      navigate('/pago1');
    } else {
      // Si estamos en una ruta normal (carrito lila), redirigir a pago
      navigate('/pago');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full relative"
        style={{ minWidth: '350px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tu Carrito</h2>
          <button className="text-red-500 font-bold text-xl" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Productos en el carrito */}
        <ul className="space-y-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
          {cartItems.length === 0 ? (
            <li className="text-gray-500">No hay productos en el carrito.</li>
          ) : (
            cartItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-300 px-2 rounded text-lg"
                      onClick={() => decrementQuantity(item.id)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="bg-gray-300 px-2 rounded text-lg"
                      onClick={() => incrementQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="mt-6">
          <h4 className="text-xl font-bold">Total: Bs.{getTotal()}</h4>
          <button
            className={`${
              isMayoristaRoute ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
            } text-white px-4 py-2 rounded-lg w-full mt-4`}
            onClick={handleCheckout}
          >
            {isMayoristaRoute ? 'Ir a Pagar (Mayorista)' : 'Ir a Pagar'}
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-full mt-2 hover:bg-gray-300"
            onClick={onClose} // Botón para seguir comprando
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingCart;