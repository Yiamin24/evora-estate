import React from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

interface LocationMarker {
  id: string;
  name: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
  delay: number;
}

const StaticMap: React.FC = () => {
  const locations: LocationMarker[] = [
    {
      id: 'evora',
      name: 'Evora Estate',
      description: 'Sector 40, Panipat',
      x: 52,
      y: 48,
      delay: 0.2,
    },
    {
      id: 'delhi',
      name: 'Delhi-NCR',
      description: '60–70 minutes',
      x: 35,
      y: 25,
      delay: 0.4,
    },
    {
      id: 'karnal',
      name: 'Karnal',
      description: '40 minutes',
      x: 65,
      y: 35,
      delay: 0.6,
    },
  ];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
      {/* Static Map Image */}
      <Image
        src="https://static.wixstatic.com/media/cef78c_e7378617b52449968c9e6fc4a877d85b~mv2.png?originWidth=1152&originHeight=768"
        alt="Map of Panipat showing Evora Estate location in Sector 40 with connectivity to Delhi-NCR and Karnal"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Location Markers */}
      {locations.map((location) => (
        <motion.div
          key={location.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: location.delay,
            duration: 0.6,
            type: 'spring',
            stiffness: 100,
          }}
        >
          {/* Outer Pulse Ring */}
          <motion.div
            className="absolute w-16 h-16 rounded-full border-2 border-gold-accent/40"
            style={{
              left: '-32px',
              top: '-32px',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Main Pointer Pin */}
          <div className="relative">
            {/* Pin Shadow */}
            <div className="absolute inset-0 blur-md bg-gold-accent/30 rounded-full w-10 h-10" />

            {/* Gold Pointer */}
            <motion.div
              className="relative w-10 h-10 bg-gradient-to-b from-gold-accent to-[#D4AF37] rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Inner Circle */}
              <div className="w-3 h-3 bg-white rounded-full" />

              {/* Shine Effect */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm" />
            </motion.div>

            {/* Location Label */}
            <motion.div
              className="absolute left-14 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-3 min-w-max border border-gold-accent/20 z-10"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: location.delay + 0.3,
                duration: 0.5,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-heading text-sm font-bold text-primary">
                {location.name}
              </h3>
              <p className="text-xs text-foreground/60 mt-1">
                {location.description}
              </p>
            </motion.div>
          </div>
        </motion.div>
      ))}

      {/* Info Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-30 flex items-center gap-3 border border-gold-accent/30"
      >
        <div className="w-2 h-2 rounded-full bg-gold-accent animate-pulse" />
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            Location
          </p>
          <p className="text-sm font-semibold text-foreground">
            Sector 40, Panipat
          </p>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 z-30 text-xs text-foreground max-w-xs border border-gold-accent/30"
      >
        <p className="font-semibold text-foreground mb-2 text-xs">
          Strategic Location
        </p>
        <ul className="space-y-1.5 text-xs text-foreground/70">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gold-accent" />
            Prime NH44 GT Road access
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gold-accent" />
            Central Panipat connectivity
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gold-accent" />
            Excellent regional connectivity
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default StaticMap;
