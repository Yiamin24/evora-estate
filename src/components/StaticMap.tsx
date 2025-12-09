import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

interface LocationMarker {
  id: string;
  name: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
  delay: number;
  icon: string;
}

const StaticMap: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [mapScale, setMapScale] = useState(1);

  const locations: LocationMarker[] = [
    {
      id: 'evora',
      name: 'Evora Estate',
      description: 'Sector 40, Panipat',
      x: 50,
      y: 50,
      delay: 0.2,
      icon: '🏘️',
    },
    {
      id: 'school',
      name: 'International School of Excellence',
      description: 'Nearby Education Hub',
      x: 25,
      y: 20,
      delay: 0.4,
      icon: '🎓',
    },
    {
      id: 'hospital',
      name: 'Apollo Hospitals',
      description: 'Healthcare Facility',
      x: 70,
      y: 65,
      delay: 0.6,
      icon: '🏥',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const markerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  } as const;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100 group">
      {/* Map Image with Zoom Effect */}
      <motion.div
        className="absolute inset-0 origin-center"
        animate={{ scale: mapScale }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src="https://static.wixstatic.com/media/cef78c_4eb8389129164d20ae5f84d56138b12c~mv2.png"
          alt="Map showing Evora Estate location with nearby amenities including International School of Excellence and Apollo Hospitals"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/0 via-transparent to-black/10"
        animate={{
          opacity: hoveredLocation ? 0.3 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Location Markers Container */}
      <motion.div
        className="absolute inset-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {locations.map((location) => (
          <motion.div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
            }}
            variants={markerVariants}
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
              className="absolute w-20 h-20 rounded-full border-2 border-gold-accent/50 bg-gold-accent/5"
              style={{
                left: '-40px',
                top: '-40px',
              }}
              animate={{
                scale: hoveredLocation === location.id ? [1, 1.4, 1] : [1, 1.2, 1],
                opacity: hoveredLocation === location.id ? [0.8, 0.3, 0.8] : [0.4, 0.15, 0.4],
              }}
              transition={{
                duration: hoveredLocation === location.id ? 1.2 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Secondary Pulse Ring */}
            <motion.div
              className="absolute w-16 h-16 rounded-full border border-gold-accent/30"
              style={{
                left: '-32px',
                top: '-32px',
              }}
              animate={{
                scale: hoveredLocation === location.id ? [1, 1.3, 1] : [1, 1.15, 1],
                opacity: hoveredLocation === location.id ? [0.6, 0.2, 0.6] : [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: hoveredLocation === location.id ? 1 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Main Pointer Pin */}
            <motion.div
              className="relative"
              animate={{
                y: hoveredLocation === location.id ? -8 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Pin Shadow */}
              <motion.div
                className="absolute inset-0 blur-md bg-gold-accent/40 rounded-full w-10 h-10"
                animate={{
                  opacity: hoveredLocation === location.id ? 0.8 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Gold Pointer with Enhanced Gradient */}
              <motion.div
                className="relative w-10 h-10 bg-gradient-to-br from-gold-accent via-[#FFD700] to-[#D4AF37] rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.25, boxShadow: '0 0 30px rgba(184, 134, 11, 0.6)' }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Inner Circle */}
                <motion.div
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    scale: hoveredLocation === location.id ? 1.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Shine Effect */}
                <motion.div
                  className="absolute top-1 left-1 w-2 h-2 bg-white/80 rounded-full blur-sm"
                  animate={{
                    opacity: hoveredLocation === location.id ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Location Label with Enhanced Animation */}
              <motion.div
                className="absolute left-16 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 min-w-max border-2 border-gold-accent/40 z-20 backdrop-blur-sm"
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
                style={{ pointerEvents: hoveredLocation === location.id ? 'auto' : 'none' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{location.icon}</span>
                  <h3 className="font-heading text-sm font-bold text-primary">
                    {location.name}
                  </h3>
                </div>
                <p className="text-xs text-foreground/70">
                  {location.description}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg z-30 flex items-center gap-3 border-2 border-gold-accent/40 hover:border-gold-accent/70 transition-colors"
      >
        <motion.div
          className="w-3 h-3 rounded-full bg-gold-accent"
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

      {/* Animated Instructions Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
        className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-5 z-30 text-xs text-foreground max-w-xs border-2 border-gold-accent/40 hover:border-gold-accent/70 transition-colors"
      >
        <p className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wide">
          ✨ Strategic Location
        </p>
        <ul className="space-y-2.5 text-xs text-foreground/70">
          <motion.li
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gold-accent flex-shrink-0"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            Prime NH44 GT Road access
          </motion.li>
          <motion.li
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gold-accent flex-shrink-0"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            Central Panipat connectivity
          </motion.li>
          <motion.li
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-gold-accent flex-shrink-0"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
            Excellent regional connectivity
          </motion.li>
        </ul>
      </motion.div>

      {/* Hover Instruction Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredLocation ? 0 : 0.6 }}
        transition={{ duration: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
      >
        <p className="text-white text-sm font-medium drop-shadow-lg">
          Hover over markers to explore
        </p>
      </motion.div>
    </div>
  );
};

export default StaticMap;
