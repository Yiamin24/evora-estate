import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { MapPin, Building2, GraduationCap, Heart, ShoppingCart, Zap } from 'lucide-react';

interface POI {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'mall' | 'park' | 'metro' | 'market';
  position: [number, number, number];
  description: string;
  distance: string;
  icon: React.ReactNode;
  color: number;
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

  // Points of Interest around Evora Estate
  const pois: POI[] = [
    {
      id: 'school-1',
      name: 'Delhi Public School',
      type: 'school',
      position: [2, 3, 0],
      description: 'Premium educational institution',
      distance: '2.5 km',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 0x4F46E5,
    },
    {
      id: 'hospital-1',
      name: 'Fortis Healthcare',
      type: 'hospital',
      position: [-2, 2, 0],
      description: 'Multi-specialty hospital',
      distance: '1.8 km',
      icon: <Heart className="w-4 h-4" />,
      color: 0xDC2626,
    },
    {
      id: 'mall-1',
      name: 'Panipat Central Mall',
      type: 'mall',
      position: [3, -2, 0],
      description: 'Shopping & entertainment hub',
      distance: '3.2 km',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 0xF59E0B,
    },
    {
      id: 'park-1',
      name: 'Green Valley Park',
      type: 'park',
      position: [-3, -2, 0],
      description: 'Recreational green space',
      distance: '1.5 km',
      icon: <MapPin className="w-4 h-4" />,
      color: 0x10B981,
    },
    {
      id: 'metro-1',
      name: 'Metro Station',
      type: 'metro',
      position: [1, -3, 0],
      description: 'Public transport hub',
      distance: '2.1 km',
      icon: <Zap className="w-4 h-4" />,
      color: 0x8B5CF6,
    },
    {
      id: 'market-1',
      name: 'Local Market',
      type: 'market',
      position: [-1, 3, 0],
      description: 'Daily essentials & groceries',
      distance: '0.8 km',
      icon: <Building2 className="w-4 h-4" />,
      color: 0xEC4899,
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    sceneRef.current = scene;

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground Plane (Map Base)
    const groundGeometry = new THREE.PlaneGeometry(12, 12);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xE0F2FE,
      metalness: 0.1,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(12, 12, 0xB8860B, 0xFFD700);
    gridHelper.position.z = 0.01;
    scene.add(gridHelper);

    // Marker Group
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    markerGroupRef.current = markerGroup;

    // Create Markers for POIs
    pois.forEach((poi) => {
      // Marker Sphere
      const markerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: poi.color,
        metalness: 0.6,
        roughness: 0.4,
        emissive: poi.color,
        emissiveIntensity: 0.3,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(...poi.position);
      marker.castShadow = true;
      marker.receiveShadow = true;
      marker.userData = { poiId: poi.id };

      // Glow Ring
      const ringGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: poi.color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: poi.color,
        emissiveIntensity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(marker.position);
      ring.rotation.x = Math.PI / 4;
      ring.castShadow = true;

      // Pulse Animation Container
      const container = new THREE.Group();
      container.add(marker);
      container.add(ring);
      container.userData = { poiId: poi.id };

      markerGroup.add(container);
      markersRef.current.set(poi.id, container);
    });

    // Evora Estate Center Marker
    const centerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      color: 0xB8860B,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0xB8860B,
      emissiveIntensity: 0.5,
    });
    const centerMarker = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMarker.position.set(0, 0, 0);
    centerMarker.castShadow = true;
    centerMarker.receiveShadow = true;

    // Center Ring
    const centerRingGeometry = new THREE.TorusGeometry(0.7, 0.08, 16, 100);
    const centerRingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xFFD700,
      emissiveIntensity: 0.8,
    });
    const centerRing = new THREE.Mesh(centerRingGeometry, centerRingMaterial);
    centerRing.position.copy(centerMarker.position);
    centerRing.rotation.x = Math.PI / 4;
    centerRing.castShadow = true;

    const centerContainer = new THREE.Group();
    centerContainer.add(centerMarker);
    centerContainer.add(centerRing);
    markerGroup.add(centerContainer);

    // Connection Lines
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xB8860B,
      transparent: true,
      opacity: 0.3,
      linewidth: 2,
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

    // Mouse Events
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
          parent.scale.set(1.3, 1.3, 1.3);
          setHoveredPOI(parent.userData.poiId);
        }
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

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate marker group
      if (markerGroup) {
        markerGroup.rotation.z += 0.0003;
      }

      // Pulse animation for markers
      markerGroup.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          const time = Date.now() * 0.001;
          const scale = 1 + Math.sin(time * 2) * 0.1;
          child.children.forEach((subChild) => {
            if (subChild instanceof THREE.Mesh && subChild.geometry instanceof THREE.TorusGeometry) {
              subChild.rotation.z += 0.01;
            }
          });
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
        className="w-full h-[500px] rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100"
      />

      {/* Location Badge */}
      <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-full shadow-lg z-30 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        <span className="text-sm font-bold text-primary">Sector 40, Panipat</span>
      </div>

      {/* POI Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: selectedPOI ? 1 : 0, y: selectedPOI ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-6 left-6 bg-white rounded-xl shadow-2xl p-6 max-w-sm z-40 pointer-events-none"
        style={{ pointerEvents: selectedPOI ? 'auto' : 'none' }}
      >
        {selectedPOI && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: `#${selectedPOI.color.toString(16).padStart(6, '0')}` }}
              >
                {selectedPOI.icon}
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{selectedPOI.name}</h3>
                <p className="text-sm text-foreground/60">{selectedPOI.distance} away</p>
              </div>
            </div>
            <p className="text-sm text-foreground/70">{selectedPOI.description}</p>
            <button
              onClick={() => setSelectedPOI(null)}
              className="mt-4 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <div className="absolute top-6 left-6 bg-white/95 backdrop-blur rounded-xl shadow-lg p-4 z-30 max-w-xs">
        <h3 className="font-heading font-bold text-primary mb-3">Nearby Places</h3>
        <div className="space-y-2 text-xs">
          {pois.map((poi) => (
            <div
              key={poi.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${
                hoveredPOI === poi.id ? 'bg-primary/10' : 'hover:bg-gray-50'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: `#${poi.color.toString(16).padStart(6, '0')}` }}
              />
              <span className="font-medium text-foreground">{poi.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 z-30 text-xs text-foreground/70 max-w-xs">
        <p className="font-semibold text-foreground mb-1">💡 Interact with the map:</p>
        <ul className="space-y-1 text-xs">
          <li>• Hover over markers to highlight</li>
          <li>• Click to view details</li>
          <li>• Watch the 3D visualization</li>
        </ul>
      </div>
    </div>
  );
};

export default Map3D;
