import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  referencia: string;
  lat: number;
  lng: number;
}

const SucursalesSection: React.FC = () => {
  const sucursales: Sucursal[] = [
    {
      id: 1,
      nombre: "SUCURSAL 1",
      direccion: "Caparazón Mall Center Planta Baja, Local Nº29",
      referencia: "Garaje al lado de los cajeros, Pleno Puente Vita",
      lat: -16.49319177048459,
      lng: -68.14515779980108,
    },
    {
      id: 2,
      nombre: "SUCURSAL 2",
      direccion: "Plaza Bonita local 13",
      referencia: "Cerca al puente vita, Av. Buenos Aires",
      lat: -16.493553526008537,
      lng: -68.1443435673565,
    },
    {
      id: 3,
      nombre: "SUCURSAL 3",
      direccion: "Galería las Vegas, Puesto Nº3",
      referencia: "",
      lat: -16.494375469251963,
      lng: -68.14420556176381,
    },
    {
      id: 4,
      nombre: "SUCURSAL 4",
      direccion: "Uyustus Frente al Banco Fie, Av. Buenos Aires",
      referencia: "",
      lat: -16.493852973686316,
      lng: -68.14422361307435,
    },
  ];

  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number | null>(1);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Función para inicializar el mapa con Leaflet
  useEffect(() => {
    // Verificar que estamos en el cliente y que el mapRef existe
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Cargar Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const leafletCss = document.createElement('link');
        leafletCss.rel = 'stylesheet';
        leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        leafletCss.crossOrigin = '';
        document.head.appendChild(leafletCss);
      }

      // Inicializar mapa
      const initMap = () => {
        if (!mapRef.current) return;
        
        // Calcular el centro del mapa
        const centerLat = sucursales.reduce((sum, s) => sum + s.lat, 0) / sucursales.length;
        const centerLng = sucursales.reduce((sum, s) => sum + s.lng, 0) / sucursales.length;
        
        // Crear el mapa - Solución al problema de typescript
        const map = L.map(mapRef.current as HTMLElement).setView([centerLat, centerLng], 17);
        
        // Agregar tiles de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Guardar la instancia del mapa
        mapInstanceRef.current = map;
        
        // Crear marcadores para cada sucursal
        sucursales.forEach((sucursal) => {
          createMarker(sucursal);
        });
      };

      // Función para crear un marcador
      const createMarker = (sucursal: Sucursal) => {
        if (!mapInstanceRef.current) return;
        
        const isSelected = sucursal.id === sucursalSeleccionada;
        
        // Crear un icono personalizado
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${isSelected ? '#FF0000' : '#0000FF'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">${String.fromCharCode(64 + sucursal.id)}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        // Crear el marcador
        const marker = L.marker([sucursal.lat, sucursal.lng], { icon }).addTo(mapInstanceRef.current);
        
        // Agregar popup
        marker.bindPopup(`
          <div>
            <h3 style="font-weight: bold; margin-bottom: 5px;">${sucursal.nombre}</h3>
            <p>${sucursal.direccion}</p>
            ${sucursal.referencia ? `<p><small>${sucursal.referencia}</small></p>` : ''}
          </div>
        `);
        
        // Agregar evento de clic
        marker.on('click', () => {
          setSucursalSeleccionada(sucursal.id);
        });
        
        // Guardar el marcador
        markersRef.current.push(marker);
      };
      
      // Inicializar el mapa
      initMap();
    }
    
    // Limpieza al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Actualizar los marcadores cuando cambia la sucursal seleccionada
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Actualizar los marcadores
    markersRef.current.forEach((marker, index) => {
      const sucursal = sucursales[index];
      const isSelected = sucursal.id === sucursalSeleccionada;
      
      // Actualizar el icono
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${isSelected ? '#FF0000' : '#0000FF'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">${String.fromCharCode(64 + sucursal.id)}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      marker.setIcon(icon);
      
      // Si es la sucursal seleccionada, centrar el mapa en ella
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [sucursalSeleccionada]);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">VISITA NUESTRAS SUCURSALES</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lista de sucursales */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              {sucursales.map((sucursal) => (
                <div 
                  key={sucursal.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-purple-100 ${
                    sucursalSeleccionada === sucursal.id ? 'bg-purple-100 border-l-4 border-purple-600' : ''
                  }`}
                  onClick={() => setSucursalSeleccionada(sucursal.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-8 h-8 rounded-full ${sucursalSeleccionada === sucursal.id ? 'bg-red-600' : 'bg-purple-600'} text-white flex items-center justify-center`}>
                        <div className="font-bold">{String.fromCharCode(64 + sucursal.id)}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-purple-800">{sucursal.nombre}</h3>
                      <p className="text-gray-700">{sucursal.direccion}</p>
                      {sucursal.referencia && <p className="text-gray-600 text-sm">{sucursal.referencia}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mapa con todos los marcadores */}
          <div className="lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-300 relative">
              <div ref={mapRef} style={{ width: '100%', height: '100%',position: 'relative', zIndex: 1}}></div>
            </div>
            <div className="p-4 bg-purple-800 text-white">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {sucursalSeleccionada ? 
                    `${sucursales.find(s => s.id === sucursalSeleccionada)?.nombre} - ${sucursales.find(s => s.id === sucursalSeleccionada)?.direccion}` : 
                    'Nuestras sucursales en La Paz'
                  }
                </p>
                <div className="flex space-x-2">
                  {sucursales.map(sucursal => (
                    <div 
                      key={`marker-${sucursal.id}`}
                      className={`w-6 h-6 rounded-full cursor-pointer ${sucursalSeleccionada === sucursal.id ? 'bg-red-600' : 'bg-blue-600'} text-white flex items-center justify-center text-xs font-bold`}
                      onClick={() => setSucursalSeleccionada(sucursal.id)}
                    >
                      {String.fromCharCode(64 + sucursal.id)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SucursalesSection;