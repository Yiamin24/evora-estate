import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { MapPin, Building2, GraduationCap, Heart, ShoppingCart, Zap, X } from 'lucide-react';

interface POI {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'mall' | 'park' | 'metro' | 'market';
  position: [number, number, number];
  description: string;
  distance: string;
  icon: React.ReactNode;
  color: string;
  hexColor: number;
}

const Map3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);
  const [hoveredPOI, setHoveredPOI] = useState<string | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const markersRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 8));

  // Points of Interest around Evora Estate - Luxury Color Palette
  const pois: POI[] = [
    {
      id: 'school-1',
      name: 'Delhi Public School',
      type: 'school',
      position: [2, 3, 0],
      description: 'Premium educational institution',
      distance: '2.5 km',
      icon: <GraduationCap className="w-4 h-4" />,
      color: '#6366F1',
      hexColor: 0x6366F1,
    },
    {
      id: 'hospital-1',
      name: 'Fortis Healthcare',
      type: 'hospital',
      position: [-2, 2, 0],
      description: 'Multi-specialty hospital',
      distance: '1.8 km',
      icon: <Heart className="w-4 h-4" />,
      color: '#EF4444',
      hexColor: 0xEF4444,
    },
    {
      id: 'mall-1',
      name: 'Panipat Central Mall',
      type: 'mall',
      position: [3, -2, 0],
      description: 'Shopping & entertainment hub',
      distance: '3.2 km',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: '#F97316',
      hexColor: 0xF97316,
    },
    {
      id: 'park-1',
      name: 'Green Valley Park',
      type: 'park',
      position: [-3, -2, 0],
      description: 'Recreational green space',
      distance: '1.5 km',
      icon: <MapPin className="w-4 h-4" />,
      color: '#10B981',
      hexColor: 0x10B981,
    },
    {
      id: 'metro-1',
      name: 'Metro Station',
      type: 'metro',
      position: [1, -3, 0],
      description: 'Public transport hub',
      distance: '2.1 km',
      icon: <Zap className="w-4 h-4" />,
      color: '#A855F7',
      hexColor: 0xA855F7,
    },
    {
      id: 'market-1',
      name: 'Local Market',
      type: 'market',
      position: [-1, 3, 0],
      description: 'Daily essentials & groceries',
      distance: '0.8 km',
      icon: <Building2 className="w-4 h-4" />,
      color: '#EC4899',
      hexColor: 0xEC4899,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup - Luxury Dark Theme
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F172A); // Deep navy
    scene.fog = new THREE.Fog(0x0F172A, 20, 50);
    sceneRef.current = scene;

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 10);
    cameraRef.current = camera;

    // Renderer Setup - High Quality
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luxury Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(8, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill Light (Gold accent)
    const fillLight = new THREE.DirectionalLight(0xFFD700, 0.3);
    fillLight.position.set(-8, 6, -8);
    scene.add(fillLight);

    // Back Light (Rim light)
    const rimLight = new THREE.DirectionalLight(0x87CEEB, 0.2);
    rimLight.position.set(0, 8, -10);
    scene.add(rimLight);

    // Ground Plane - Luxury Material
    const groundGeometry = new THREE.PlaneGeometry(16, 16);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      metalness: 0.3,
      roughness: 0.7,
      envMapIntensity: 0.5,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.position.z = -0.1;
    scene.add(ground);

    // Subtle Grid Pattern
    const gridHelper = new THREE.GridHelper(16, 16, 0x475569, 0x334155);
    gridHelper.position.z = 0.01;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);

    // Marker Group
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    markerGroupRef.current = markerGroup;

    // Create Luxury Markers for POIs
    pois.forEach((poi) => {
      // Main Marker Sphere - Premium Material
      const markerGeometry = new THREE.SphereGeometry(0.35, 64, 64);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: poi.hexColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: poi.hexColor,
        emissiveIntensity: 0.6,
        envMapIntensity: 1,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(...poi.position);
      marker.castShadow = true;
      marker.receiveShadow = true;
      marker.userData = { poiId: poi.id };

      // Outer Glow Ring
      const ringGeometry = new THREE.TorusGeometry(0.6, 0.06, 32, 200);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: poi.hexColor,
        metalness: 0.9,
        roughness: 0.1,
        emissive: poi.hexColor,
        emissiveIntensity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(marker.position);
      ring.rotation.x = Math.PI / 3.5;
      ring.castShadow = true;

      // Halo Effect (Larger transparent ring)
      const haloGeometry = new THREE.TorusGeometry(0.9, 0.03, 32, 200);
      const haloMaterial = new THREE.MeshStandardMaterial({
        color: poi.hexColor,
        metalness: 0.7,
        roughness: 0.3,
        emissive: poi.hexColor,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      halo.position.copy(marker.position);
      halo.rotation.x = Math.PI / 2.5;

      // Container
      const container = new THREE.Group();
      container.add(marker);
      container.add(ring);
      container.add(halo);
      container.userData = { poiId: poi.id };

      markerGroup.add(container);
      markersRef.current.set(poi.id, container);
    });

    // Evora Estate Center Marker - Premium Gold
    const centerGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0xB8860B,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0xFFD700,
      emissiveIntensity: 0.8,
      envMapIntensity: 1.2,
    });
    const centerMarker = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMarker.position.set(0, 0, 0);
    centerMarker.castShadow = true;
    centerMarker.receiveShadow = true;

    // Center Rings (Multiple for luxury effect)
    const createCenterRing = (radius: number, color: number, intensity: number) => {
      const ringGeometry = new THREE.TorusGeometry(radius, 0.08, 32, 200);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.95,
        roughness: 0.05,
        emissive: color,
        emissiveIntensity: intensity,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(centerMarker.position);
      ring.castShadow = true;
      return ring;
    };

    const centerRing1 = createCenterRing(0.8, 0xFFD700, 0.9);
    centerRing1.rotation.x = Math.PI / 3;

    const centerRing2 = createCenterRing(1.1, 0xB8860B, 0.6);
    centerRing2.rotation.x = Math.PI / 2.5;
    centerRing2.rotation.z = Math.PI / 4;

    const centerContainer = new THREE.Group();
    centerContainer.add(centerMarker);
    centerContainer.add(centerRing1);
    centerContainer.add(centerRing2);
    markerGroup.add(centerContainer);

    // Premium Connection Lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xFFD700,
      transparent: true,
      opacity: 0.25,
      linewidth: 1,
    });

    pois.forEach((poi) => {
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(...poi.position),
      ];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, linesMaterial);
      markerGroup.add(line);
    });

    // Mouse Events with Smooth Interaction
    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(markerGroup.children, true);

      // Reset all markers
      markersRef.current.forEach((marker) => {
        marker.scale.set(1, 1, 1);
      });
      setHoveredPOI(null);

      // Highlight hovered marker
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData.poiId) {
          parent = parent.parent;
        }
        if (parent && parent.userData.poiId) {
          parent.scale.set(1.4, 1.4, 1.4);
          setHoveredPOI(parent.userData.poiId);
          
          // Smooth camera movement towards marker
          const markerPos = parent.position;
          cameraTargetRef.current.lerp(
            new THREE.Vector3(markerPos.x * 0.3, markerPos.y * 0.3 + 2, 10),
            0.05
          );
        }
      } else {
        // Return to default camera position
        cameraTargetRef.current.lerp(new THREE.Vector3(0, 2, 10), 0.05);
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(markerGroup.children, true);

      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData.poiId) {
          parent = parent.parent;
        }
        if (parent && parent.userData.poiId) {
          const poi = pois.find((p) => p.id === parent.userData.poiId);
          setSelectedPOI(poi || null);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Handle Resize
    const onWindowResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onWindowResize);

    // Animation Loop with Smooth Camera Movement
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera movement
      camera.position.lerp(cameraTargetRef.current, 0.08);
      camera.lookAt(0, 0, 0);

      // Rotate marker group slowly
      if (markerGroup) {
        markerGroup.rotation.z += 0.00015;
      }

      // Enhanced pulse animation for markers
      markerGroup.children.forEach((child) => {
        if (child instanceof THREE.Group && child !== centerContainer) {
          const time = Date.now() * 0.001;
          
          // Subtle floating animation
          const originalY = pois.find(p => p.id === child.userData.poiId)?.position[1] || 0;
          child.position.y = originalY + Math.sin(time * 1.5) * 0.15;
          
          // Ring rotation
          child.children.forEach((subChild) => {
            if (subChild instanceof THREE.Mesh && subChild.geometry instanceof THREE.TorusGeometry) {
              subChild.rotation.z += 0.015;
              subChild.rotation.x += 0.008;
            }
          });
        }
      });

      // Center marker animation
      const time = Date.now() * 0.001;
      centerContainer.rotation.z += 0.008;
      centerContainer.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          child.rotation.z += 0.02;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[500px] rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      />

      {/* Premium Location Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full shadow-2xl z-30 flex items-center gap-3 border border-white/20"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <div>
          <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider">Location</p>
          <p className="text-sm font-bold text-primary">Sector 40, Panipat</p>
        </div>
      </motion.div>

      {/* Premium Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 30 }}
        animate={{ 
          opacity: selectedPOI ? 1 : 0, 
          x: selectedPOI ? 0 : -30,
          y: selectedPOI ? 0 : 30
        }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-6 left-6 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm z-40 border border-white/30"
        style={{ pointerEvents: selectedPOI ? 'auto' : 'none' }}
      >
        {selectedPOI && (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: selectedPOI.color }}
                >
                  {selectedPOI.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{selectedPOI.name}</h3>
                  <p className="text-sm text-foreground/60 font-medium">{selectedPOI.distance} away</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPOI(null)}
                className="text-foreground/40 hover:text-foreground/80 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed mb-4">{selectedPOI.description}</p>
            <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-4" />
            <div className="flex items-center gap-2 text-xs text-foreground/60">
              <MapPin className="w-4 h-4" />
              <span>Click on other markers to explore</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Elegant Legend Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 z-30 max-w-xs border border-white/30"
      >
        <h3 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Nearby Places</h3>
        <div className="space-y-3">
          {pois.map((poi) => (
            <motion.div
              key={poi.id}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                hoveredPOI === poi.id 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-md"
                style={{ backgroundColor: poi.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{poi.name}</p>
                <p className="text-xs text-foreground/60">{poi.distance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Premium Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 z-30 text-xs text-foreground/70 max-w-xs border border-white/30"
      >
        <p className="font-heading font-bold text-primary mb-3 text-sm">✨ Interactive Map</p>
        <ul className="space-y-2 text-xs text-foreground/70">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Hover to highlight locations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Click to view details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            Watch the 3D animation
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Map3D;
