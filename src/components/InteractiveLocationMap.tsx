import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, GraduationCap, Heart, ExternalLink, X } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  type: 'project' | 'school' | 'hospital';
  description: string;
  distance?: string;
  x: number; // percentage from left
  y: number; // percentage from top
  icon: React.ReactNode;
  color: string;
  externalLink?: string;
  details: string[];
}

const InteractiveLocationMap: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapScale, setMapScale] = useState(1);

  const locations: Location[] = [
    {
      id: 'evora',
      name: 'Evora Estate',
      type: 'project',
      description: 'Premium Resort-Style Township',
      x: 50,
      y: 50,
      icon: <Building2 className="w-5 h-5" />,
      color: '#B8860B',
      details: [
        '43 acres of luxury development',
        '750 exclusive premium plots',
        'RERA Approved: RERA-PKL-1860-2025',
        'Resort-style amenities',
        'Master-planned community'
      ]
    },
    {
      id: 'school',
      name: 'International School of Excellence',
      type: 'school',
      description: 'Premium Educational Institution',
      distance: '~3 km away',
      x: 25,
      y: 25,
      icon: <GraduationCap className="w-5 h-5" />,
      color: '#3B82F6',
      externalLink: 'https://www.google.com/maps/search/International+School+of+Excellence+Panipat',
      details: [
        'World-class educational facilities',
        'International curriculum',
        'State-of-the-art infrastructure',
        'Experienced faculty',
        'Close proximity to Evora Estate'
      ]
    },
    {
      id: 'hospital',
      name: 'Apollo Hospitals',
      type: 'hospital',
      description: 'Multi-Specialty Healthcare Facility',
      distance: '~5 km away',
      x: 70,
      y: 70,
      icon: <Heart className="w-5 h-5" />,
      color: '#EF4444',
      externalLink: 'https://www.google.com/maps/search/Apollo+Hospitals+Panipat',
      details: [
        'Advanced medical facilities',
        'Emergency services 24/7',
        'Experienced medical professionals',
        'Multi-specialty departments',
        'Accessible healthcare nearby'
      ]
    }
  ];

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleExternalLink = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gray-100 group">
      {/* Map Background Image */}
      <motion.div
        className="absolute inset-0 origin-center"
        animate={{ scale: mapScale }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src="https://static.wixstatic.com/media/cef78c_4eb8389129164d20ae5f84d56138b12c~mv2.png"
          alt="Interactive map showing Evora Estate, International School of Excellence, and Apollo Hospitals locations"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/0 via-transparent to-black/10"
        animate={{
          opacity: hoveredLocation || selectedLocation ? 0.3 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Location Markers */}
      <div className="absolute inset-0">
        {locations.map((location) => (
          <motion.div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
            }}
            onMouseEnter={() => {
              setHoveredLocation(location.id);
              setMapScale(1.05);
            }}
            onMouseLeave={() => {
              setHoveredLocation(null);
              setMapScale(1);
            }}
          >
            {/* Animated Glow Ring */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border-2 border-white/50 bg-white/5"
              style={{
                left: '-48px',
                top: '-48px',
              }}
              animate={{
                scale: hoveredLocation === location.id ? [1, 1.5, 1] : [1, 1.3, 1],
                opacity: hoveredLocation === location.id ? [0.8, 0.2, 0.8] : [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: hoveredLocation === location.id ? 1 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Secondary Pulse Ring */}
            <motion.div
              className="absolute w-20 h-20 rounded-full border border-white/30"
              style={{
                left: '-40px',
                top: '-40px',
              }}
              animate={{
                scale: hoveredLocation === location.id ? [1, 1.4, 1] : [1, 1.2, 1],
                opacity: hoveredLocation === location.id ? [0.6, 0.15, 0.6] : [0.3, 0.08, 0.3],
              }}
              transition={{
                duration: hoveredLocation === location.id ? 1 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Main Pointer Pin */}
            <motion.div
              className="relative cursor-pointer"
              animate={{
                y: hoveredLocation === location.id ? -10 : 0,
              }}
              transition={{ duration: 0.3 }}
              onClick={() => handleLocationClick(location)}
            >
              {/* Pin Shadow */}
              <motion.div
                className="absolute inset-0 blur-md rounded-full w-12 h-12"
                style={{ backgroundColor: `${location.color}40` }}
                animate={{
                  opacity: hoveredLocation === location.id ? 0.9 : 0.4,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Main Pin Circle */}
              <motion.div
                className="relative w-12 h-12 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: location.color }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Icon */}
                <div className="text-white">
                  {location.icon}
                </div>

                {/* Shine Effect */}
                <motion.div
                  className="absolute top-2 left-2 w-2.5 h-2.5 bg-white/80 rounded-full blur-sm"
                  animate={{
                    opacity: hoveredLocation === location.id ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Location Label */}
              <motion.div
                className="absolute left-16 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 min-w-max border-2 z-20 backdrop-blur-sm"
                style={{ 
                  borderColor: `${location.color}60`,
                  pointerEvents: hoveredLocation === location.id ? 'auto' : 'none'
                }}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{
                  opacity: hoveredLocation === location.id ? 1 : 0,
                  x: hoveredLocation === location.id ? 0 : -20,
                  scale: hoveredLocation === location.id ? 1 : 0.8,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: location.color }}
                  >
                    {location.icon}
                  </div>
                  <h3 className="font-heading text-sm font-bold" style={{ color: location.color }}>
                    {location.name}
                  </h3>
                </div>
                <p className="text-xs text-foreground/70">
                  {location.description}
                </p>
                {location.distance && (
                  <p className="text-xs text-foreground/60 mt-1">
                    {location.distance}
                  </p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Location Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg z-30 flex items-center gap-4 border-2 border-primary/40 hover:border-primary/70 transition-colors"
      >
        <motion.div
          className="w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            📍 Strategic Location
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
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6 z-30 text-xs text-foreground max-w-sm border-2 border-primary/40 hover:border-primary/70 transition-colors"
      >
        <p className="font-semibold text-foreground mb-4 text-xs uppercase tracking-wide">
          ✨ Key Locations
        </p>
        <ul className="space-y-3 text-xs text-foreground/70">
          {locations.map((location) => (
            <motion.li
              key={location.id}
              className="flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors"
              onClick={() => handleLocationClick(location)}
              whileHover={{ x: 4 }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: location.color }}
              />
              <span className="font-medium">{location.name}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Hover Instruction Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredLocation || selectedLocation ? 0 : 0.7 }}
        transition={{ duration: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <p className="text-white text-base font-medium drop-shadow-lg">
          Click on markers to explore locations
        </p>
      </motion.div>

      {/* Location Details Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-2"
              style={{ borderColor: `${selectedLocation.color}40` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-6 text-white relative overflow-hidden"
                style={{ backgroundColor: selectedLocation.color }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>

                <div className="relative flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      {selectedLocation.icon}
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold">
                        {selectedLocation.name}
                      </h2>
                      <p className="text-white/90 text-sm">
                        {selectedLocation.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedLocation.distance && (
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    {selectedLocation.distance}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3 mb-6">
                  {selectedLocation.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: selectedLocation.color }}
                      />
                      <span className="text-sm text-foreground/80">
                        {detail}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedLocation.externalLink && (
                    <Button
                      onClick={() => handleExternalLink(selectedLocation.externalLink)}
                      className="flex-1 gap-2 text-white"
                      style={{ backgroundColor: selectedLocation.color }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Maps
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedLocation(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveLocationMap;
