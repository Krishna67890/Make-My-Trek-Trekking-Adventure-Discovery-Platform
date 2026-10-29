import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MapPin, Eye, Compass, RotateCcw, Calendar, Check, ExternalLink, ArrowRight } from 'lucide-react';

export interface MarkerData {
  id: string;
  name: string;
  altitude: string;
  level: string;
  description: string;
  coordinates: { lat: number; lng: number };
  position3D: [number, number, number];
}

interface TerrainViewerProps {
  onSelectMarker?: (marker: MarkerData) => void;
  selectedMarkerId?: string;
  scrollProgress?: number;
  onOpenBookingModal?: (trekId: string) => void;
}

export const ANJANERI_MARKERS: MarkerData[] = [
  {
    id: 'base-camp',
    name: 'Anjaneri Base Village',
    altitude: '1,950 ft (594 m)',
    level: 'Trailhead & Parking',
    description: 'Starting point off the Nashik-Trimbakeshwar highway with parking, local village guides, and fresh water wells.',
    coordinates: { lat: 19.9315, lng: 73.5712 },
    position3D: [-3.2, 0.15, 2.0],
  },
  {
    id: 'jain-caves',
    name: '12th Century Rock Caves',
    altitude: '2,600 ft (792 m)',
    level: 'Lower Cliff Ridge',
    description: 'Ancient rock-cut caves featuring Jain Tirthankara relief carvings, sculpted pillars, and natural cold water cisterns.',
    coordinates: { lat: 19.9275, lng: 73.5732 },
    position3D: [-2.1, 0.75, 1.2],
  },
  {
    id: 'footprint-lake',
    name: 'Footprint Plateau Lake',
    altitude: '3,800 ft (1,158 m)',
    level: 'Upper Plateau Basin',
    description: 'Iconic perennial water reservoir naturally contoured in the shape of a divine right footprint surrounded by seasonal endemic flora.',
    coordinates: { lat: 19.9245, lng: 73.5765 },
    position3D: [-1.2, 1.42, -0.6],
  },
  {
    id: 'anjaneri-summit',
    name: 'Anjaneri Hills Summit',
    altitude: '4,200 ft (1,280 m)',
    level: 'Peak Plateau Level',
    description: 'Sacred birthplace of Lord Hanuman with the ancient Anjani Mata temple, offering 360° panoramas of Brahmagiri and the Western Ghats.',
    coordinates: { lat: 19.9238, lng: 73.5786 },
    position3D: [0.0, 2.22, 0.0],
  },
];

// Predefined cinematic camera waypoints corresponding to scroll progression
const CAMERA_WAYPOINTS = [
  // 0. Regional Overview (Trimbakeshwar range high aerial)
  { pos: new THREE.Vector3(6.5, 6.2, 7.5), target: new THREE.Vector3(0, 1.1, 0) },
  // 1. Approach Base Village Trailhead
  { pos: new THREE.Vector3(-4.2, 1.9, 3.8), target: new THREE.Vector3(-2.8, 0.4, 1.8) },
  // 2. Ascending 12th Century Caves
  { pos: new THREE.Vector3(-2.8, 2.2, 2.4), target: new THREE.Vector3(-1.8, 0.9, 0.8) },
  // 3. Circling Footprint Plateau Lake
  { pos: new THREE.Vector3(0.7, 3.0, -1.5), target: new THREE.Vector3(-1.2, 1.4, -0.6) },
  // 4. Summit Anjani Mata Temple & Horizon
  { pos: new THREE.Vector3(2.6, 3.4, 2.8), target: new THREE.Vector3(0.0, 2.2, 0.0) },
];

export const AnjaneriTerrainViewer: React.FC<TerrainViewerProps> = ({
  onSelectMarker,
  scrollProgress = 0,
  onOpenBookingModal,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData>(ANJANERI_MARKERS[3]); // Default to Summit
  const [isRotating, setIsRotating] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const markerObjectsRef = useRef<{ [key: string]: THREE.Group }>({});
  const pulseParticleRef = useRef<THREE.Mesh | null>(null);
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Dynamic camera target
  const currentCameraPos = useRef<THREE.Vector3>(CAMERA_WAYPOINTS[0].pos.clone());
  const currentLookAt = useRef<THREE.Vector3>(CAMERA_WAYPOINTS[0].target.clone());
  const manualTargetPos = useRef<THREE.Vector3>(CAMERA_WAYPOINTS[0].pos.clone());
  const manualLookAt = useRef<THREE.Vector3>(CAMERA_WAYPOINTS[0].target.clone());

  // Initialize Scene
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Warm Atmospheric Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FED547');
    scene.fog = new THREE.FogExp2('#FED547', 0.048);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(currentCameraPos.current);
    camera.lookAt(currentLookAt.current);
    cameraRef.current = camera;

    // 3. Renderer with high performance antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // 4. Balanced Lighting (Golden Sahyadri Sun)
    const ambientLight = new THREE.AmbientLight(0xfff5dd, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffae8, 1.35);
    sunLight.position.set(9, 13, 7);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 30;
    scene.add(sunLight);

    const goldenFill = new THREE.PointLight(0xd79700, 1.1, 24);
    goldenFill.position.set(-6, 5, -5);
    scene.add(goldenFill);

    // 5. Procedural 3D Terrain: Anjaneri Hills Deccan Plateau
    const terrainGeo = new THREE.PlaneGeometry(9.5, 9.5, 72, 72);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      const dist = Math.sqrt(x * x + z * z);
      let y = 0;

      if (dist < 4.2) {
        // Main basalt cliff body
        y = Math.cos((dist / 4.2) * (Math.PI / 2)) * 2.35;

        // Characteristic tableland flattening (Anjaneri high plateau)
        if (y > 1.8) {
          y = 1.8 + (y - 1.8) * 0.38;
        }

        // Footprint Plateau Lake depression feature
        const lakeDist = Math.hypot(x - (-1.2), z - (-0.6));
        if (lakeDist < 0.75) {
          y -= (0.75 - lakeDist) * 0.42;
        }

        // Basalt terrace steps
        y += Math.sin(x * 3.8) * Math.cos(z * 3.8) * 0.07;
      }
      posAttr.setY(i, Math.max(0, y));
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xe8b42a, // Golden orange Sahyadri clay
      roughness: 0.65,
      metalness: 0.08,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = true;
    scene.add(terrainMesh);

    // 6. Footprint Lake Water Surface inside plateau depression
    const lakeGeo = new THREE.CircleGeometry(0.56, 32);
    lakeGeo.rotateX(-Math.PI / 2);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x1d6d48, // Lush emerald Sahyadri reservoir water
      roughness: 0.22,
      metalness: 0.75,
      transparent: true,
      opacity: 0.92,
    });
    const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
    lakeMesh.position.set(-1.2, 1.40, -0.6);
    scene.add(lakeMesh);

    // 7. Route Line (Trail from Base Camp -> Caves -> Footprint Lake -> Summit)
    const curvePoints = ANJANERI_MARKERS.map((m) => new THREE.Vector3(...m.position3D));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    curveRef.current = curve;

    const tubeGeo = new THREE.TubeGeometry(curve, 70, 0.038, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x7c4b23, // Brown mountain trail color matching Canva
      roughness: 0.5,
    });
    const trailLine = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(trailLine);

    // 8. Animated Trekker Light Pulse along Route
    const pulseGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    scene.add(pulseMesh);
    pulseParticleRef.current = pulseMesh;

    // 9. 3D Interactive Checkpoint Markers
    ANJANERI_MARKERS.forEach((m) => {
      const markerGroup = new THREE.Group();
      markerGroup.position.set(...m.position3D);
      markerGroup.name = m.id;

      // Pin Head
      const isSummit = m.id === 'anjaneri-summit';
      const pinGeo = new THREE.SphereGeometry(isSummit ? 0.15 : 0.12, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: isSummit ? 0xffffff : 0x000000,
        emissive: isSummit ? 0xffc800 : 0xd79700,
        emissiveIntensity: 0.35,
        roughness: 0.3,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.y = isSummit ? 0.32 : 0.24;

      // Pin Stem
      const stemGeo = new THREE.CylinderGeometry(0.018, 0.018, isSummit ? 0.42 : 0.32, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = (isSummit ? 0.42 : 0.32) / 2;

      // Pulsing Beacon Ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.24, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isSummit ? 0xffffff : 0xffc800,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.y = 0.02;

      markerGroup.add(pinMesh);
      markerGroup.add(stemMesh);
      markerGroup.add(ringMesh);

      scene.add(markerGroup);
      markerObjectsRef.current[m.id] = markerGroup;
    });

    // 10. Mouse Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 8.2, theta: 0.85, phi: 0.85 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsUserInteracting(true);
      setIsRotating(false);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.007;
      spherical.phi = Math.max(0.25, Math.min(Math.PI / 2 - 0.08, spherical.phi + deltaY * 0.007));

      manualTargetPos.current.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      manualTargetPos.current.y = spherical.radius * Math.cos(spherical.phi);
      manualTargetPos.current.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      manualLookAt.current.set(0, 1.2, 0);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 11. Raycasting for Clicking 3D Pins
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let parent = hit.object.parent;
        while (parent && parent !== scene) {
          if (parent.name && ANJANERI_MARKERS.some((m) => m.id === parent?.name)) {
            const found = ANJANERI_MARKERS.find((m) => m.id === parent?.name);
            if (found) {
              flyToMarker(found);
              return;
            }
          }
          parent = parent.parent;
        }
      }
    };

    domEl.addEventListener('click', handleClick);

    // 12. Main Animation Loop
    let angle = 0;
    let trailProgress = 0;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      // Trekker pulse particle moving along curve
      if (curveRef.current && pulseParticleRef.current) {
        trailProgress = (trailProgress + 0.0035) % 1;
        const pt = curveRef.current.getPointAt(trailProgress);
        pulseParticleRef.current.position.copy(pt);
        pulseParticleRef.current.position.y += 0.08;
      }

      // Camera motion decision: User drag / fly-to vs Auto-rotation vs Scroll Progress
      if (isUserInteracting || !isRotating) {
        currentCameraPos.current.lerp(manualTargetPos.current, 0.05);
        currentLookAt.current.lerp(manualLookAt.current, 0.05);
      } else {
        // Continuous ambient rotation
        angle += 0.0025;
        manualTargetPos.current.x = Math.sin(angle) * 7.6;
        manualTargetPos.current.z = Math.cos(angle) * 7.6;
        manualTargetPos.current.y = 4.6;
        manualLookAt.current.set(0, 1.2, 0);

        currentCameraPos.current.lerp(manualTargetPos.current, 0.04);
        currentLookAt.current.lerp(manualLookAt.current, 0.04);
      }

      camera.position.copy(currentCameraPos.current);
      camera.lookAt(currentLookAt.current);

      // Marker beacon ring pulsing
      const time = Date.now() * 0.003;
      Object.entries(markerObjectsRef.current).forEach(([id, grp], idx) => {
        const ring = grp.children[2] as THREE.Mesh;
        if (ring) {
          const scale = 1 + Math.sin(time * 2 + idx) * 0.25;
          ring.scale.set(scale, scale, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 13. Window Resize Handler
    const handleResize = () => {
      if (!currentMount || !rendererRef.current || !cameraRef.current) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('click', handleClick);

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      renderer.dispose();
      currentMount.innerHTML = '';
    };
  }, []);

  // Update camera on scrollProgress change (when not dragging)
  useEffect(() => {
    if (isUserInteracting || !isRotating) return;

    // Map scrollProgress [0, 1] across the 5 waypoints
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    const segmentCount = CAMERA_WAYPOINTS.length - 1;
    const scaled = clampedProgress * segmentCount;
    const index = Math.floor(scaled);
    const subProgress = scaled - index;

    if (index >= 0 && index < segmentCount) {
      const p1 = CAMERA_WAYPOINTS[index].pos;
      const p2 = CAMERA_WAYPOINTS[index + 1].pos;
      const t1 = CAMERA_WAYPOINTS[index].target;
      const t2 = CAMERA_WAYPOINTS[index + 1].target;

      manualTargetPos.current.lerpVectors(p1, p2, subProgress);
      manualLookAt.current.lerpVectors(t1, t2, subProgress);
    }
  }, [scrollProgress, isUserInteracting, isRotating]);

  const flyToMarker = useCallback((marker: MarkerData) => {
    setSelectedMarker(marker);
    if (onSelectMarker) onSelectMarker(marker);
    setIsUserInteracting(true);
    setIsRotating(false);

    const [x, y, z] = marker.position3D;
    // Set camera offset tailored to that altitude
    manualTargetPos.current.set(x + 2.4, y + 2.0, z + 2.6);
    manualLookAt.current.set(x, y + 0.3, z);
  }, [onSelectMarker]);

  const resetView = () => {
    setIsUserInteracting(false);
    setIsRotating(true);
    manualTargetPos.current.set(6.5, 6.2, 7.5);
    manualLookAt.current.set(0, 1.1, 0);
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[640px] rounded-3xl overflow-hidden border-4 border-black shadow-2xl bg-[#FED547] select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none"
        title="Click and drag to rotate the 3D Anjaneri Hills terrain"
      />

      {/* Top Left: Canva Header Tag */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none">
        <h3 className="font-heading text-4xl sm:text-5xl text-black leading-none drop-shadow-sm">
          LIVE<br />MAP
        </h3>
        <p className="text-xs uppercase font-extrabold tracking-widest text-neutral-900 mt-1">
          Anjaneri Hills, Nashik (19.9238° N, 73.5786° E)
        </p>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-black/85 text-brand-primaryYellow text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Real Elevation Model &bull; 1,280 m Peak</span>
        </div>
      </div>

      {/* Top Right: Interactive Controls */}
      <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
        <button
          onClick={resetView}
          className="p-2.5 bg-black/85 hover:bg-black text-white rounded-full shadow-lg transition transform hover:scale-105 backdrop-blur-sm"
          title="Reset Camera & Auto Rotate"
        >
          <RotateCcw className="w-4 h-4 text-brand-primaryYellow" />
        </button>

        <button
          onClick={() => {
            setIsRotating(!isRotating);
            if (!isRotating) setIsUserInteracting(false);
          }}
          className={`p-2.5 rounded-full shadow-lg transition transform hover:scale-105 backdrop-blur-sm ${
            isRotating ? 'bg-brand-primaryYellow text-black' : 'bg-black/85 text-white hover:bg-black'
          }`}
          title="Toggle Auto Rotation"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Right: Selected Marker Detail HUD matching Canva & booking integration */}
      <div className="absolute bottom-5 right-5 z-20 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primaryYellow border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <MapPin className="w-5 h-5 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-xl sm:text-2xl text-black leading-snug truncate">
                {selectedMarker.name}
              </h4>
            </div>
            <p className="text-xs font-bold text-brand-orange mt-0.5">
              {selectedMarker.altitude} &bull; {selectedMarker.level}
            </p>
            <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">
              {selectedMarker.description}
            </p>
          </div>
        </div>

        {/* Trail Checkpoint Selector Pills */}
        <div className="mt-3 pt-3 border-t border-neutral-200">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
            Trail Checkpoints:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ANJANERI_MARKERS.map((m) => (
              <button
                key={m.id}
                onClick={() => flyToMarker(m)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition ${
                  selectedMarker.id === m.id
                    ? 'bg-black text-brand-primaryYellow ring-1 ring-black'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                }`}
              >
                {m.name.replace('Anjaneri Hills ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Action: Book This Trek */}
        <div className="mt-3 pt-2.5 border-t border-neutral-200 flex items-center justify-between gap-2">
          <div className="text-left">
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">Standard Pass</span>
            <span className="text-base font-extrabold text-black">₹850 <span className="text-[10px] font-normal text-neutral-600">/ person</span></span>
          </div>

          <button
            onClick={() => onOpenBookingModal ? onOpenBookingModal('trek-anjeneri-hills') : null}
            className="px-4 py-2 bg-brand-primaryYellow hover:bg-brand-orange text-white text-xs font-extrabold uppercase rounded-full shadow-md transition transform hover:scale-105 flex items-center gap-1.5"
          >
            <span>Book Trek</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Left: Mouse helper notice */}
      <div className="absolute bottom-5 left-5 z-20 hidden sm:flex items-center gap-2 bg-black/75 text-white text-[11px] px-3.5 py-1.5 rounded-full backdrop-blur-sm pointer-events-none border border-white/10">
        <Eye className="w-3.5 h-3.5 text-brand-primaryYellow" />
        <span>Drag to rotate 3D mountain &bull; Click checkpoints to fly</span>
      </div>
    </div>
  );
};
