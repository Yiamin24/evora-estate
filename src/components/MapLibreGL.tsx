import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// MapLibre GL JS - using CDN approach
declare global {
  interface Window {
    maplibregl: any;
  }
}

const MapLibreGL: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Evora Estate Location - Sector 40, Panipat
  const LOCATION = {
    lng: 79.1288,
    lat: 29.3910,
    name: 'Evora Estate',
    address: 'Sector 40, Panipat, Haryana'
  };

  useEffect(() => {
    // Load MapLibre GL CSS first
    if (!document.querySelector('link[href*="maplibre-gl.css"]')) {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.0.0/dist/maplibre-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // Load MapLibre GL JS
    if (!window.maplibregl) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4.0.0/dist/maplibre-gl.js';
      script.async = true;
      script.onload = () => {
        setTimeout(() => initializeMap(), 100);
      };
      script.onerror = () => {
        console.error('Failed to load MapLibre GL');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(() => initializeMap(), 100);
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || !window.maplibregl) return;

    try {
      // Initialize map with OpenStreetMap tiles
      map.current = new window.maplibregl.Map({
        container: mapContainer.current,
        style: 'https://demotiles.maplibre.org/style.json',
        center: [LOCATION.lng, LOCATION.lat],
        zoom: 14,
        pitch: 45,
        bearing: -60,
        antialias: true,
      });

      // Add navigation controls
      map.current.addControl(new window.maplibregl.NavigationControl(), 'top-right');

      // Wait for map to load
      map.current.on('load', () => {
        setIsLoading(false);

        // Add custom marker with modern design
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.innerHTML = `
          <div class="marker-pin">
            <div class="marker-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3" fill="white"></circle>
              </svg>
            </div>
            <div class="marker-pulse"></div>
          </div>
        `;

        // Add marker to map
        const popup = new window.maplibregl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div class="popup-content">
            <h3 class="popup-title">${LOCATION.name}</h3>
            <p class="popup-address">${LOCATION.address}</p>
            <div class="popup-coords">
              <span>${LOCATION.lat.toFixed(4)}°N</span>
              <span>${LOCATION.lng.toFixed(4)}°E</span>
            </div>
          </div>
        `);

        new window.maplibregl.Marker({
          element: markerElement,
          anchor: 'bottom',
        })
          .setLngLat([LOCATION.lng, LOCATION.lat])
          .setPopup(popup)
          .addTo(map.current)
          .togglePopup();

        // Add geolocation control
        map.current.addControl(
          new window.maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: false
            },
            trackUserLocation: false,
            showUserHeading: true
          }),
          'top-right'
        );

        // Smooth animation to location
        map.current.flyTo({
          center: [LOCATION.lng, LOCATION.lat],
          zoom: 14,
          duration: 2000,
          pitch: 45,
          bearing: -60,
        });
      });

      map.current.on('error', (e: any) => {
        console.error('Map error:', e);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100"
        style={{ height: '500px', minHeight: '500px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Badge */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-30 flex items-center gap-3 border border-gray-200 pointer-events-none"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</p>
            <p className="text-sm font-semibold text-gray-900">{LOCATION.address}</p>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 z-30 text-xs text-gray-700 max-w-xs border border-gray-200 pointer-events-none"
        >
          <p className="font-semibold text-gray-900 mb-2 text-xs">Interactive Map</p>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              Drag to pan
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              Scroll to zoom
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              Click marker for details
            </li>
          </ul>
        </motion.div>
      )}

      {/* Styles */}
      <style>{`
        .maplibregl-canvas {
          outline: none !important;
        }

        .maplibregl-canvas-container {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
        }

        .custom-marker {
          position: relative;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .marker-pin {
          position: relative;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: markerBounce 2s ease-in-out infinite;
        }

        .marker-inner {
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .marker-pulse {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid #3B82F6;
          transform: rotate(-45deg);
          animation: markerPulse 2s ease-out infinite;
          opacity: 0;
        }

        @keyframes markerBounce {
          0%, 100% {
            transform: rotate(-45deg) translateY(0);
          }
          50% {
            transform: rotate(-45deg) translateY(-10px);
          }
        }

        @keyframes markerPulse {
          0% {
            transform: rotate(-45deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotate(-45deg) scale(1.5);
            opacity: 0;
          }
        }

        .maplibregl-popup-content {
          padding: 0 !important;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .popup-content {
          background: white;
          padding: 12px 16px;
          font-family: 'Sora', sans-serif;
        }

        .popup-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: #1F2937;
          margin: 0 0 4px 0;
        }

        .popup-address {
          font-size: 12px;
          color: #6B7280;
          margin: 0 0 8px 0;
        }

        .popup-coords {
          display: flex;
          gap: 12px;
          font-size: 11px;
          color: #9CA3AF;
          border-top: 1px solid #E5E7EB;
          padding-top: 8px;
        }

        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-top-color: white;
        }

        .maplibregl-ctrl-group {
          background-color: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .maplibregl-ctrl-group button {
          width: 40px;
          height: 40px;
          border: none;
          background: white;
          color: #3B82F6;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .maplibregl-ctrl-group button:hover {
          background-color: #F3F4F6;
          color: #1E40AF;
        }

        .maplibregl-ctrl-group button:not(:last-child) {
          border-bottom: 1px solid #E5E7EB;
        }

        .maplibregl-ctrl-geolocate {
          color: #3B82F6;
        }

        .maplibregl-ctrl-geolocate.active {
          color: #1E40AF;
        }
      `}</style>
    </div>
  );
};

export default MapLibreGL;
