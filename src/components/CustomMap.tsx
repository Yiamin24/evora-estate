import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Stethoscope, BookOpen } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'project' | 'school' | 'hospital';
  x: number; // percentage position
  y: number; // percentage position
  distance: string;
  description: string;
}

const CustomMap: React.FC = () => {
  const [activeMarker, setActiveMarker] = useState<string>('project');
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const locations: Location[] = [
    {
      id: 'project',
      name: 'Evora Estate',
      type: 'project',
      x: 50,
      y: 45,
      distance: 'Your Location',
      description: 'Premium Resort-Style Plotted Development',
    },
    {
      id: 'school',
      name: 'International School of Excellence',
      type: 'school',
      x: 65,
      y: 25,
      distance: '8 km away',
      description: 'Premium Educational Institution',
    },
    {
      id: 'hospital',
      name: 'Apollo Hospitals',
      type: 'hospital',
      x: 35,
      y: 60,
      distance: '5 km away',
      description: 'Multi-Specialty Healthcare Facility',
    },
  ];

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Building2 className="w-5 h-5" />;
      case 'school':
        return <BookOpen className="w-5 h-5" />;
      case 'hospital':
        return <Stethoscope className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-primary text-white';
      case 'school':
        return 'bg-blue-500 text-white';
      case 'hospital':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const activeLocation = locations.find((loc) => loc.id === activeMarker);

  return (
    <div className="relative w-full h-full">
      {/* Map Background */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-light-gold/40 via-white to-light-gold/20">
        {/* Decorative Grid Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B8860B" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Decorative Roads/Paths */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          {/* NH44 Highway */}
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#B8860B" strokeWidth="3" strokeDasharray="10,5" />
          {/* Secondary Roads */}
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#B8860B" strokeWidth="2" strokeDasharray="8,4" opacity="0.6" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.4" />
        </svg>

        {/* Decorative Green Zones */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-green-200/20 blur-3xl" />

        {/* Markers */}
        {locations.map((location) => (
          <motion.div
            key={location.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            onMouseEnter={() => setHoveredMarker(location.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            onClick={() => setActiveMarker(location.id)}
          >
            {/* Pulse Ring */}
            <motion.div
              className={`absolute -inset-4 rounded-full border-2 ${
                activeMarker === location.id ? 'border-primary' : 'border-primary/30'
              }`}
              animate={{
                scale: activeMarker === location.id ? [1, 1.3, 1] : 1,
                opacity: activeMarker === location.id ? [0.6, 0.2, 0.6] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Main Marker */}
            <motion.div
              className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${getMarkerColor(
                location.type
              )} border-2 border-white`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: hoveredMarker === location.id ? -8 : 0,
              }}
            >
              {getMarkerIcon(location.type)}
            </motion.div>

            {/* Label */}
            <motion.div
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: hoveredMarker === location.id ? 1 : 0.7,
                y: hoveredMarker === location.id ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-primary/20">
                <p className="text-xs font-semibold text-primary">{location.distance}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Info Panel */}
      <motion.div
        className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-primary/20"
        layout
      >
        <motion.div
          key={activeMarker}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeLocation && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getMarkerColor(activeLocation.type)}`}>
                  {getMarkerIcon(activeLocation.type)}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-primary">{activeLocation.name}</h3>
                  <p className="text-sm text-foreground/60">{activeLocation.distance}</p>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">{activeLocation.description}</p>

              {/* Location Tabs */}
              <div className="flex gap-2 pt-2">
                {locations.map((loc) => (
                  <motion.button
                    key={loc.id}
                    onClick={() => setActiveMarker(loc.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeMarker === loc.id
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-foreground/70 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loc.type === 'project' && '🏢'}
                    {loc.type === 'school' && '🎓'}
                    {loc.type === 'hospital' && '🏥'}
                    <span className="ml-1">{loc.name.split(' ')[0]}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-primary/20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Nearby Amenities</p>
        <div className="space-y-2">
          {locations.map((loc) => (
            <div key={loc.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getMarkerColor(loc.type)}`} />
              <span className="text-xs text-foreground/70">{loc.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* NH44 Label */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold text-primary/40 uppercase tracking-widest">NH44 GT Road</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomMap;
