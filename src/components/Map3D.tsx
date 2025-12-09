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

  // Points of Interest - Modern Minimalist Color Palette
  const pois: POI[] = [
    {
      id: 'school-1',
      name: 'Delhi Public School',
      type: 'school',
      position: [2, 3, 0],
      description: 'Premium educational institution',
      distance: '2.5 km',
      icon: <GraduationCap className="w-4 h-4" />,
      color: '#3B82F6', // Modern Blue
      hexColor: 0x3B82F6,
    },
    {
      id: 'hospital-1',
      name: 'Fortis Healthcare',
      type: 'hospital',
      position: [-2, 2, 0],
      description: 'Multi-specialty hospital',
      distance: '1.8 km',
      icon: <Heart className="w-4 h-4" />,
      color: '#EF4444', // Clean Red
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
      color: '#F59E0B', // Warm Amber
      hexColor: 0xF59E0B,
    },
    {
      id: 'park-1',
      name: 'Green Valley Park',
      type: 'park',
      position: [-3, -2, 0],
      description: 'Recreational green space',
      distance: '1.5 km',
      icon: <MapPin className="w-4 h-4" />,
      color: '#10B981', // Fresh Green
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
      color: '#8B5CF6', // Modern Purple
      hexColor: 0x8B5CF6,
    },
    {
      id: 'market-1',
      name: 'Local Market',
      type: 'market',
      position: [-1, 3, 0],
      description: 'Daily essentials & groceries',
      distance: '0.8 km',
      icon: <Building2 className="w-4 h-4" />,
      color: '#06B6D4', // Cyan
      hexColor: 0x06B6D4,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup - Modern Minimalist Theme
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF); // Clean white background
    scene.fog = new THREE.Fog(0xFFFFFF, 30, 60);
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
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Modern Minimalist Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6); // Neutral white light
    scene.add(ambientLight);

    // Key Light - Soft, directional
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
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

    // Fill Light - Subtle
    const fillLight = new THREE.DirectionalLight(0xF0F0F0, 0.3);
    fillLight.position.set(-8, 6, -8);
    scene.add(fillLight);

    // Ground Plane - Minimalist
    const groundGeometry = new THREE.PlaneGeometry(16, 16);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xF9FAFB, // Very light gray
      metalness: 0.05,
      roughness: 0.9,
      envMapIntensity: 0.2,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.position.z = -0.1;
    scene.add(ground);

    // Subtle Grid Pattern
    const gridHelper = new THREE.GridHelper(16, 16, 0xE5E7EB, 0xF3F4F6);
    gridHelper.position.z = 0.01;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    scene.add(gridHelper);

    // Marker Group
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    markerGroupRef.current = markerGroup;

    // Create Modern Minimalist Markers for POIs
    pois.forEach((poi) => {
      // Main Marker Sphere - Clean, minimal design
      const markerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: poi.hexColor,
        metalness: 0.3,
        roughness: 0.6,
        emissive: poi.hexColor,
        emissiveIntensity: 0.3,
        envMapIntensity: 0.5,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(...poi.position);
      marker.castShadow = true;
      marker.receiveShadow = true;
      marker.userData = { poiId: poi.id };

      // Subtle Outer Ring - Minimal design
      const ringGeometry = new THREE.TorusGeometry(0.5, 0.04, 16, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: poi.hexColor,
        metalness: 0.2,
        roughness: 0.7,
        emissive: poi.hexColor,
        emissiveIntensity: 0.2,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(marker.position);
      ring.rotation.x = Math.PI / 3.5;
      ring.castShadow = true;

      // Soft Glow Ring - Very subtle
      const glowGeometry = new THREE.TorusGeometry(0.7, 0.02, 16, 100);
      const glowMaterial = new THREE.MeshStandardMaterial({
        color: poi.hexColor,
        metalness: 0.1,
        roughness: 0.8,
        emissive: poi.hexColor,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.4,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(marker.position);
      glow.rotation.x = Math.PI / 2.5;

      // Container
      const container = new THREE.Group();
      container.add(marker);
      container.add(ring);
      container.add(glow);
      container.userData = { poiId: poi.id };

      markerGroup.add(container);
      markersRef.current.set(poi.id, container);
    });

    // Center Marker - Minimalist design
    const centerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1F2937, // Dark gray/charcoal
      metalness: 0.2,
      roughness: 0.7,
      emissive: 0x1F2937,
      emissiveIntensity: 0.2,
      envMapIntensity: 0.4,
    });
    const centerMarker = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMarker.position.set(0, 0, 0);
    centerMarker.castShadow = true;
    centerMarker.receiveShadow = true;

    // Center Ring - Single, clean ring
    const centerRingGeometry = new THREE.TorusGeometry(0.7, 0.05, 16, 100);
    const centerRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1F2937,
      metalness: 0.15,
      roughness: 0.75,
      emissive: 0x1F2937,
      emissiveIntensity: 0.25,
    });
    const centerRing = new THREE.Mesh(centerRingGeometry, centerRingMaterial);
    centerRing.position.copy(centerMarker.position);
    centerRing.rotation.x = Math.PI / 3;
    centerRing.castShadow = true;

    const centerContainer = new THREE.Group();
    centerContainer.add(centerMarker);
    centerContainer.add(centerRing);
    markerGroup.add(centerContainer);

    // Subtle Connection Lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xD1D5DB, // Light gray
      transparent: true,
      opacity: 0.2,
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

      // Highlight hovered marker with subtle scale
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData.poiId) {
          parent = parent.parent;
        }
        if (parent && parent.userData.poiId) {
          parent.scale.set(1.3, 1.3, 1.3); // Subtle 30% scale
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

      // Very subtle rotation of marker group
      if (markerGroup) {
        markerGroup.rotation.z += 0.00005;
      }

      // Minimal floating animation for markers
      markerGroup.children.forEach((child) => {
        if (child instanceof THREE.Group && child !== centerContainer) {
          const time = Date.now() * 0.001;
          
          // Very subtle floating animation
          const originalY = pois.find(p => p.id === child.userData.poiId)?.position[1] || 0;
          child.position.y = originalY + Math.sin(time * 0.8) * 0.08;
          
          // Minimal ring rotation
          child.children.forEach((subChild) => {
            if (subChild instanceof THREE.Mesh && subChild.geometry instanceof THREE.TorusGeometry) {
              subChild.rotation.z += 0.008;
              subChild.rotation.x += 0.004;
            }
          });
        }
      });

      // Center marker minimal animation
      const time = Date.now() * 0.001;
      centerContainer.rotation.z += 0.003;
      centerContainer.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          child.rotation.z += 0.01;
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
      {/* 3D Canvas - Clean White Background */}
      <div
        ref={containerRef}
        className="w-full h-[500px] rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-white"
      />

      {/* Location Badge - Minimalist */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md z-30 flex items-center gap-3 border border-gray-200"
      >
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</p>
          <p className="text-sm font-semibold text-gray-900">Sector 40, Panipat</p>
        </div>
      </motion.div>

      {/* Info Panel - Clean Design */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 30 }}
        animate={{ 
          opacity: selectedPOI ? 1 : 0, 
          x: selectedPOI ? 0 : -30,
          y: selectedPOI ? 0 : 30
        }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-6 left-6 bg-white/98 backdrop-blur-sm rounded-lg shadow-lg p-5 max-w-sm z-40 border border-gray-200"
        style={{ pointerEvents: selectedPOI ? 'auto' : 'none' }}
      >
        {selectedPOI && (
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
                  style={{ backgroundColor: selectedPOI.color }}
                >
                  {selectedPOI.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedPOI.name}</h3>
                  <p className="text-xs text-gray-600">{selectedPOI.distance} away</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPOI(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">{selectedPOI.description}</p>
            <div className="h-px bg-gray-200 mb-3" />
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>Click markers to explore</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Legend Panel - Minimalist */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 z-30 max-w-xs border border-gray-200"
      >
        <h3 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wider">Nearby Places</h3>
        <div className="space-y-2">
          {pois.map((poi) => (
            <motion.div
              key={poi.id}
              whileHover={{ x: 2 }}
              className={`flex items-center gap-2 p-2 rounded transition-all cursor-pointer ${
                hoveredPOI === poi.id 
                  ? 'bg-gray-100 border border-gray-300' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: poi.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-xs truncate">{poi.name}</p>
                <p className="text-xs text-gray-600">{poi.distance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Instructions - Subtle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-4 z-30 text-xs text-gray-700 max-w-xs border border-gray-200"
      >
        <p className="font-semibold text-gray-900 mb-2 text-xs">Interactive Map</p>
        <ul className="space-y-1.5 text-xs text-gray-600">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            Hover to highlight locations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            Click to view details
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            Smooth 3D interactions
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Map3D;
