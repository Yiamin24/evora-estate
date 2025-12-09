import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Type declarations for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
      };
    };
  }
}

interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  type: 'project' | 'school' | 'hospital';
}

const GoogleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Evora Estate - Sector 40, Panipat
  const locations: MapLocation[] = [
    {
      name: 'Evora Estate',
      lat: 29.3910,
      lng: 79.1288,
      type: 'project',
    },
    {
      name: 'International School of Excellence',
      lat: 29.4050,
      lng: 79.1450,
      type: 'school',
    },
    {
      name: 'Apollo Hospitals',
      lat: 29.3750,
      lng: 79.1100,
      type: 'hospital',
    },
  ];

  const getMarkerIcon = (type: string): string => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/micons/';
    switch (type) {
      case 'project':
        return baseUrl + 'gold.png';
      case 'school':
        return baseUrl + 'blue.png';
      case 'hospital':
        return baseUrl + 'red.png';
      default:
        return baseUrl + 'red.png';
    }
  };

  const getMarkerTitle = (type: string): string => {
    switch (type) {
      case 'project':
        return 'Evora Estate - Premium Resort-Style Township';
      case 'school':
        return 'International School of Excellence - Premium Educational Institution';
      case 'hospital':
        return 'Apollo Hospitals - Multi-Specialty Healthcare Facility';
      default:
        return '';
    }
  };

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        // Create script tag for Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDemoKey'}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setTimeout(() => initializeMap(), 100);
        };
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) return;

      try {
        // Center on Evora Estate
        const center = {
          lat: locations[0].lat,
          lng: locations[0].lng,
        };

        // Create map
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 14,
          center: center,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#616161' }],
            },
            {
              featureType: 'all',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#f5f5f5' }],
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#bdbdbd' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry.fill',
              stylers: [{ color: '#e5e5e5' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.fill',
              stylers: [{ color: '#ffffff' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#616161' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry.fill',
              stylers: [{ color: '#e5e5e5' }],
            },
            {
              featureType: 'transit',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#757575' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#c9c9c9' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9e9e9e' }],
            },
          ],
        });

        mapInstanceRef.current = map;

        // Add markers for all locations
        locations.forEach((location) => {
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: getMarkerIcon(location.type),
          });

          // Create info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; font-family: 'Sora', sans-serif; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: #1F2937;">
                  ${location.name}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #6B7280;">
                  ${getMarkerTitle(location.type).split(' - ')[1] || ''}
                </p>
                <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                  Lat: ${location.lat.toFixed(4)}°N<br/>
                  Lng: ${location.lng.toFixed(4)}°E
                </p>
              </div>
            `,
          });

          // Open info window on marker click
          marker.addListener('click', () => {
            // Close all other info windows
            markersRef.current.forEach((m) => {
              if (m.infoWindow) {
                m.infoWindow.close();
              }
            });
            infoWindow.open(map, marker);
          });

          // Store info window reference on marker
          (marker as any).infoWindow = infoWindow;

          // Open info window for Evora Estate by default
          if (location.type === 'project') {
            infoWindow.open(map, marker);
          }

          markersRef.current.push(marker);
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-3xl"
        style={{ minHeight: '500px' }}
      />

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-3xl"
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading map...</p>
          </div>
        </motion.div>
      )}

      {/* Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg z-30 flex items-center gap-4 border-2 border-primary/40 hover:border-primary/70 transition-colors"
      >
        <motion.div
          className="w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            📍 Location
          </p>
          <p className="text-sm font-bold text-foreground">
            Sector 40, Panipat
          </p>
        </div>
      </motion.div>

      {/* Instructions Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 z-30 text-xs text-foreground max-w-sm border-2 border-primary/40 hover:border-primary/70 transition-colors"
      >
        <p className="font-semibold text-foreground mb-4 text-xs uppercase tracking-wide">
          ✨ Map Features
        </p>
        <ul className="space-y-3 text-xs text-foreground/70">
          <motion.li
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
            <span className="font-medium">Click markers for details</span>
          </motion.li>
          <motion.li
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
            <span className="font-medium">Drag to pan the map</span>
          </motion.li>
          <motion.li
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
            <span className="font-medium">Scroll to zoom in/out</span>
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
};

export default GoogleMap;
