import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'; // Importamos iconos de las redes sociales

const Footer: React.FC = () => {
  const [showAlert, setShowAlert] = useState(true); // Estado para manejar la alerta

  // Efecto para hacer desaparecer la alerta después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false); // Desaparece la alerta después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpiar el timer cuando el componente se desmonte
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false); // Función para cerrar la alerta manualmente
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      {/* Alerta en la parte superior */}
      {showAlert && (
        <div className="bg-yellow-500 text-black py-2 px-4 absolute top-0 left-0 right-0 text-center z-10">
          <span>¡Hola! Bienvenido a Importadora Miranda</span>
          <button
            onClick={handleCloseAlert}
            className="ml-4 text-lg font-bold text-black hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 md:space-x-12">
        {/* Información de la tienda */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">Importadora Miranda</h2>
          <p className="text-gray-400">Av. Buenos Aires 122, La Paz, Bolivia</p>
          <p className="text-gray-400">Lunes a Sábado: 09:00 a.m. - 08:00 p.m.</p>
          <p className="text-gray-400">Teléfono: +591 70621016</p>
        </div>

        {/* Redes sociales */}
        <div className="flex space-x-6">
          <a href="https://www.facebook.com/profile.php?id=100063558189871" className="text-gray-400 hover:text-purple-400 transition duration-200">
            <FaFacebookF size={24} /> {/* Icono de Facebook */}
          </a>
          <a href="https://www.instagram.com/importadoramiranda777/" className="text-gray-400 hover:text-purple-400 transition duration-200">
            <FaInstagram size={24} /> {/* Icono de Instagram */}
          </a>
          <a href="https://www.tiktok.com/@importadoramiranda777" className="text-gray-400 hover:text-purple-400 transition duration-200">
            <FaTiktok size={24} /> {/* Icono de TikTok */}
          </a>
        </div>

      </div>

      {/* Derechos reservados */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          © 2024 Importadora Miranda. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;