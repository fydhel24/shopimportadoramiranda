import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../protec/AuthContext";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

const CatalogoMayoristas: React.FC = () => {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const { authorize } = useAuth();
  const navigate = useNavigate();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodigo(e.target.value);
  };

  const validarCodigo = async () => {
    if (!codigo.trim()) {
      setMensaje("Por favor, ingresa un código válido.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const response = await axios.get(
        "https://importadoramiranda.com/api/cupos"
      );
      const cupones = response.data;

      const cuponValido = cupones.find(
        (cupon: any) => cupon.codigo === codigo && cupon.estado === "Activo"
      );

      if (cuponValido) {
        authorize();
        navigate("/main");
      } else {
        setMensaje("Código no válido o inactivo.");
      }
    } catch (error) {
      setMensaje("Error al validar el código. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Generate random positions for floating elements
  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 40 + 20,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="fixed inset-0"
        animate={{
          background: [
            "linear-gradient(90deg, #4e04f6, #8004f5, #b707e9, #e10ade)",
            "linear-gradient(90deg, #8004f5, #b707e9, #e10ade, #4e04f6)",
            "linear-gradient(90deg, #b707e9, #e10ade, #4e04f6, #8004f5)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Floating background elements */}
      {floatingElements.map(({ id, initialX, initialY, size, duration }) => (
        <motion.div
          key={id}
          className="fixed rounded-full bg-white/10"
          style={{
            width: size,
            height: size,
          }}
          initial={{ x: `${initialX}vw`, y: `${initialY}vh` }}
          animate={{
            x: [`${initialX}vw`, `${(initialX + 20) % 100}vw`],
            y: [`${initialY}vh`, `${(initialY + 20) % 100}vh`],
            rotate: [0, 360],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}

      {/* Main content */}
      <div className="min-h-screen flex relative z-10">
        {/* Left side - Login form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4">
          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              {/* Logo and title */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="flex items-center justify-center mb-6"
                >
                  <img
                    className="w-16 h-16"
                    src="https://www.importadoramiranda.com/images/logo.png"
                    alt="logo"
                  />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Importadora Miranda
                </h2>
                <p className="text-white/80">
                  Introduce tu código de mayorista
                </p>
              </div>

              {/* Login form */}
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  validarCodigo();
                }}
              >
                <div className="relative">
                  <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={codigo}
                    onChange={manejarCambio}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Ingresa tu código aquí"
                    required
                  />
                </div>

                {mensaje && (
                  <motion.p
                    className="text-sm text-red-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {mensaje}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8004f5] via-[#8004f5] to-[#8004f5] text-white rounded-lg py-3 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <motion.span
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span className="ml-2">Validando...</span>
                    </span>
                  ) : (
                    "Ingresar"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
        {/* Right side - Image */}
        <div className="hidden md:flex w-1/8 items-center justify-center">
          <img
            src="https://www.importadoramiranda.com/images/logo.png"
            alt="Descripción de la imagen"
            className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl object-contain -translate-y-[72px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogoMayoristas;
