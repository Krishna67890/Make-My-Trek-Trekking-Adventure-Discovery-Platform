import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Compass,
  RotateCcw,
  MapPin,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  Eye,
  Search,
  Navigation,
  Globe as GlobeIcon,
  Sparkles,
  Clock,
  IndianRupee,
  ChevronRight,
  X,
  Layers,
  Crosshair,
  CreditCard,
  Radio,
  Sliders,
} from 'lucide-react';

interface EarthGlobeViewerProps {
  onExploreLocalMap?: () => void;
  onOpenBookingModal?: (
    trekId: string,
    customPrice?: number,
    travelOrigin?: string,
    travelDistanceKm?: number
  ) => void;
}

// Major Origins for Route Navigation
export const START_ORIGINS = [
  { id: 'mumbai', name: 'Mumbai (Gateway of India)', lat: 18.9220, lng: 72.8347 },
  { id: 'nashik', name: 'Nashik City (CBS Central)', lat: 19.9975, lng: 73.7898 },
  { id: 'pune', name: 'Pune (Shivajinagar)', lat: 18.5314, lng: 73.8446 },
  { id: 'delhi', name: 'Delhi (India Gate)', lat: 28.6139, lng: 77.2090 },
  { id: 'bengaluru', name: 'Bengaluru (MG Road)', lat: 12.9716, lng: 77.5946 },
  { id: 'hyderabad', name: 'Hyderabad (Charminar)', lat: 17.3616, lng: 78.4747 },
  { id: 'ahmedabad', name: 'Ahmedabad (Sabarmati)', lat: 23.0225, lng: 72.5714 },
  { id: 'kolkata', name: 'Kolkata (Victoria Memorial)', lat: 22.5726, lng: 88.3639 },
];

// 16+ Curated Top Trek Destinations across Sahyadri, Himalayas & Beyond
export const GLOBE_DESTINATIONS = [
  // 1. Sahyadri & Maharashtra Range
  {
    id: 'trek-anjeneri-hills',
    name: 'Anjaneri Hills',
    region: 'Nashik, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 19.9213,
    lng: 73.5714,
    altitude: 1280,
    elevationFt: '4,200 ft',
    description: 'Sacred birthplace of Lord Hanuman in the Trimbakeshwar range with ancient Jain caves and divine footprint lake.',
    basePrice: 850,
    duration: '2h 45m hike • 1 Day',
    difficulty: 'Easy-Moderate',
    liveSpots: 24,
    imageUrl: '/Assets/Anjenery-hills-1.png',
    isPrimary: true,
  },
  {
    id: 'trek-kalsubai-peak',
    name: 'Kalsubai Peak',
    region: 'Bhandardara, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 19.6015,
    lng: 73.7088,
    altitude: 1646,
    elevationFt: '5,400 ft',
    description: 'The Everest of Maharashtra — Highest peak in the Sahyadri range with steel ladders and endless cloud horizons.',
    basePrice: 1250,
    duration: '4-5 hrs hike • 1 Day',
    difficulty: 'Moderate-Hard',
    liveSpots: 18,
    imageUrl: '/Assets/Mountains-1.png',
    isPrimary: false,
  },
  {
    id: 'trek-harishchandragad-konkan-kada',
    name: 'Harishchandragad (Kokankada)',
    region: 'Ahmednagar, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 19.3855,
    lng: 73.7761,
    altitude: 1424,
    elevationFt: '4,670 ft',
    description: 'Ancient hill fort famous for the colossal concave Kokankada cliff and 6th-century Harishchandreshwar temple caves.',
    basePrice: 1350,
    duration: '2 Days / 1 Night',
    difficulty: 'Challenging',
    liveSpots: 14,
    imageUrl: '/Assets/3.png',
    isPrimary: false,
  },
  {
    id: 'trek-rajgad-fort',
    name: 'Rajgad Fort',
    region: 'Pune, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 18.2572,
    lng: 73.6826,
    altitude: 1375,
    elevationFt: '4,510 ft',
    description: 'Historical royal capital of Chhatrapati Shivaji Maharaj featuring the breathtaking Suvela and Sanjeevani Machi ridges.',
    basePrice: 1100,
    duration: '1-2 Days',
    difficulty: 'Moderate',
    liveSpots: 22,
    imageUrl: '/Assets/Mountains-1.png',
    isPrimary: false,
  },
  {
    id: 'trek-torna-fort',
    name: 'Torna Fort (Prachandagad)',
    region: 'Pune, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 18.2778,
    lng: 73.6194,
    altitude: 1403,
    elevationFt: '4,603 ft',
    description: 'The first fort captured by Shivaji Maharaj at age 16 with formidable sheer basalt drops into Velhe valley.',
    basePrice: 1100,
    duration: '1 Day',
    difficulty: 'Moderate-Strenuous',
    liveSpots: 16,
    imageUrl: '/Assets/3.png',
    isPrimary: false,
  },
  {
    id: 'sinhagad-fort',
    name: 'Sinhagad Fort',
    region: 'Pune, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 18.3663,
    lng: 73.7558,
    altitude: 1312,
    elevationFt: '4,304 ft',
    description: 'Fabled mountain fortress made famous by Tanaji Malusare with iconic stone ramparts and panoramic views over Khadakwasla.',
    basePrice: 950,
    duration: '2-3 hrs hike • 1 Day',
    difficulty: 'Easy',
    liveSpots: 28,
    imageUrl: '/Assets/Mountains-1.png',
    isPrimary: false,
  },
  {
    id: 'amk-trek',
    name: 'Alang Madan Kulang (AMK)',
    region: 'Igatpuri, Maharashtra',
    zone: 'Sahyadri',
    country: 'India',
    lat: 19.5833,
    lng: 73.6500,
    altitude: 1478,
    elevationFt: '4,850 ft',
    description: 'The toughest technical trek in Maharashtra featuring vertical rock climbs, narrow ledges, and sheer 2,000-ft drops.',
    basePrice: 2400,
    duration: '3 Days / 2 Nights',
    difficulty: 'Extreme Hard',
    liveSpots: 10,
    imageUrl: '/Assets/3.png',
    isPrimary: false,
  },

  // 2. South & Western Ghats
  {
    id: 'kudremukh-peak',
    name: 'Kudremukh Peak',
    region: 'Chikkamagaluru, Karnataka',
    zone: 'South India',
    country: 'India',
    lat: 13.2167,
    lng: 75.2500,
    altitude: 1894,
    elevationFt: '6,214 ft',
    description: 'Horse-faced mountain sanctuary famous for rolling emerald shola grasslands and misty cloud forests.',
    basePrice: 3850,
    duration: '2 Days / 1 Night',
    difficulty: 'Moderate',
    liveSpots: 16,
    imageUrl: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=600&q=80',
    isPrimary: false,
  },
  {
    id: 'meesapulimala',
    name: 'Meesapulimala Peak',
    region: 'Munnar, Kerala',
    zone: 'South India',
    country: 'India',
    lat: 10.0967,
    lng: 77.1950,
    altitude: 2640,
    elevationFt: '8,661 ft',
    description: 'Second highest peak in South India with rhodo-covered slopes, high-altitude lakes, and tea estate horizons.',
    basePrice: 4200,
    duration: '2 Days / 1 Night',
    difficulty: 'Moderate',
    liveSpots: 12,
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80',
    isPrimary: false,
  },

  // 3. Himalayas & North
  {
    id: 'valley-of-flowers',
    name: 'Valley of Flowers',
    region: 'Garhwal Himalayas, Uttarakhand',
    zone: 'Himalayas',
    country: 'India',
    lat: 30.7280,
    lng: 79.5990,
    altitude: 3658,
    elevationFt: '12,000 ft',
    description: 'UNESCO World Heritage alpine floral valley carpeted in endemic alpine blooms & misty glacial streams.',
    basePrice: 12800,
    duration: '6 Days',
    difficulty: 'Moderate',
    liveSpots: 18,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80',
    isPrimary: false,
  },
  {
    id: 'kedarkantha-peak',
    name: 'Kedarkantha Peak',
    region: 'Sankri, Uttarakhand',
    zone: 'Himalayas',
    country: 'India',
    lat: 31.0210,
    lng: 78.1720,
    altitude: 3810,
    elevationFt: '12,500 ft',
    description: 'Iconic winter snow summit trek with 360-degree vistas of the Black Peak, Swargarohini, and Bandarpoonch.',
    basePrice: 8900,
    duration: '5 Days',
    difficulty: 'Moderate',
    liveSpots: 20,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    isPrimary: false,
  },
  {
    id: 'kashmir-great-lakes',
    name: 'Kashmir Great Lakes',
    region: 'Sonamarg, Kashmir',
    zone: 'Himalayas',
    country: 'India',
    lat: 34.3160,
    lng: 75.3180,
    altitude: 4191,
    elevationFt: '13,750 ft',
    description: 'Seven pristine turquoise alpine glacial lakes nestled between jagged snow-clad Himalayan passes.',
    basePrice: 21500,
    duration: '8 Days',
    difficulty: 'Hard',
    liveSpots: 14,
    imageUrl: 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?w=600&q=80',
    isPrimary: false,
  },
  {
    id: 'markha-valley',
    name: 'Markha Valley',
    region: 'Leh, Ladakh',
    zone: 'Himalayas',
    country: 'India',
    lat: 33.8500,
    lng: 77.4000,
    altitude: 5150,
    elevationFt: '16,896 ft',
    description: 'High desert trans-Himalayan trail through Hemis National Park, Buddhist chortens, and the Kang Yatse base.',
    basePrice: 19800,
    duration: '7 Days',
    difficulty: 'Strenuous',
    liveSpots: 12,
    imageUrl: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=600&q=80',
    isPrimary: false,
  },
  {
    id: 'mount-everest',
    name: 'Everest Base Camp',
    region: 'Khumbu, Sagarmatha',
    zone: 'Himalayas',
    country: 'Nepal',
    lat: 27.9881,
    lng: 86.9250,
    altitude: 5364,
    elevationFt: '17,598 ft',
    description: 'The global high-altitude mountaineering pinnacle through the Khumbu icefall with views of the roof of the world.',
    basePrice: 95000,
    duration: '14 Days',
    difficulty: 'Extreme',
    liveSpots: 8,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    isPrimary: false,
  },
  {
    id: 'annapurna-circuit',
    name: 'Annapurna Circuit',
    region: 'Gandaki, Annapurna',
    zone: 'Himalayas',
    country: 'Nepal',
    lat: 28.5900,
    lng: 83.9300,
    altitude: 5416,
    elevationFt: '17,769 ft',
    description: 'Classic circuit crossing the high Thorong La pass with dramatic transition from subtropical forests to Tibetan plateau.',
    basePrice: 38000,
    duration: '12 Days',
    difficulty: 'Strenuous',
    liveSpots: 15,
    imageUrl: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=600&q=80',
    isPrimary: false,
  },

  // 4. Global
  {
    id: 'mount-kilimanjaro',
    name: 'Mount Kilimanjaro (Uhuru Peak)',
    region: 'Kilimanjaro, Tanzania',
    zone: 'Global',
    country: 'Tanzania',
    lat: -3.0674,
    lng: 37.3556,
    altitude: 5895,
    elevationFt: '19,341 ft',
    description: 'The highest freestanding mountain on Earth and the crown of Africa rising through five ecological climatic zones.',
    basePrice: 185000,
    duration: '7 Days',
    difficulty: 'High Altitude Extreme',
    liveSpots: 6,
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    isPrimary: false,
  },
];

// Helper: Convert Lat/Lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Haversine distance calculator in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Calculate dynamic expedition fare as per traveling distance
function calculateGlobePriceByDistance(baseTrekPrice: number, distanceKm: number): {
  basePrice: number;
  transitFee: number;
  totalAmount: number;
  transitLabel: string;
} {
  let transitFee = 0;
  let transitLabel = 'Local trailhead approach';

  if (distanceKm <= 15) {
    transitFee = 0;
    transitLabel = 'Local on-foot approach';
  } else if (distanceKm <= 50) {
    transitFee = 150;
    transitLabel = 'Shared local road shuttle transit';
  } else if (distanceKm <= 250) {
    transitFee = 550;
    transitLabel = 'Regional Express AC road travel';
  } else if (distanceKm <= 800) {
    transitFee = 1200;
    transitLabel = 'Inter-state superfast transit/rail pickup';
  } else {
    transitFee = Math.min(2800, Math.round(distanceKm * 1.8));
    transitLabel = `Long-distance travel & base camp transfer (${distanceKm} km)`;
  }

  return {
    basePrice: baseTrekPrice,
    transitFee,
    totalAmount: baseTrekPrice + transitFee,
    transitLabel,
  };
}

// Generate procedural Canvas Earth texture for 0ms immediate render
function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#0a192f');
  oceanGrad.addColorStop(0.5, '#0e2b4d');
  oceanGrad.addColorStop(1, '#071526');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 214, 10, 0.12)';
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  const toPix = (lat: number, lng: number): [number, number] => [
    ((lng + 180) / 360) * canvas.width,
    ((90 - lat) / 180) * canvas.height,
  ];

  const drawPoly = (points: [number, number][], fill = '#1c3d2e', stroke = '#2f5e47') => {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach(([lat, lng], i) => {
      const [x, y] = toPix(lat, lng);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Indian Subcontinent
  drawPoly(
    [
      [36, 73], [34, 78], [28, 88], [25, 93], [22, 90],
      [16, 82], [10, 80], [8, 77.5], [12, 75], [19, 72.8],
      [24, 69], [28, 70], [35, 72],
    ],
    '#254b38',
    '#FED547'
  );

  // Sahyadri Mountain Ridge
  ctx.strokeStyle = '#FFD60A';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const [wg1X, wg1Y] = toPix(21, 73.5);
  const [wg2X, wg2Y] = toPix(15, 74.0);
  const [wg3X, wg3Y] = toPix(9, 77.0);
  ctx.moveTo(wg1X, wg1Y);
  ctx.lineTo(wg2X, wg2Y);
  ctx.lineTo(wg3X, wg3Y);
  ctx.stroke();

  // Eurasia
  drawPoly([
    [70, 30], [72, 80], [65, 140], [55, 140], [40, 120], [35, 105],
    [25, 100], [15, 100], [20, 110], [22, 115], [30, 85], [40, 50],
    [45, 30], [55, 20], [65, 25],
  ]);

  // Africa & Americas
  drawPoly([[36, -5], [32, 32], [12, 50], [-5, 40], [-34, 18], [-34, 25], [5, 10], [15, -17], [30, -10]]);
  drawPoly([[70, -160], [70, -70], [45, -60], [30, -80], [20, -105], [35, -120], [60, -140]]);
  drawPoly([[10, -75], [-5, -35], [-22, -42], [-55, -68], [-40, -73], [-10, -80]]);
  drawPoly([[-12, 130], [-15, 145], [-35, 150], [-38, 140], [-32, 115], [-20, 115]]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

export const EarthGlobeViewer: React.FC<EarthGlobeViewerProps> = ({
  onExploreLocalMap,
  onOpenBookingModal,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Origin & Destination state
  const [selectedOriginId, setSelectedOriginId] = useState<string>('mumbai');
  const [selectedDestId, setSelectedDestId] = useState<string>('trek-anjeneri-hills');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState<boolean>(false);

  // Live GPS user location state
  const [userGpsCoords, setUserGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsOriginActive, setIsGpsOriginActive] = useState<boolean>(false);
  const [gpsDetecting, setGpsDetecting] = useState<boolean>(false);

  // Hovered destination for tooltip (matching makemytrek hover style)
  const [hoveredDest, setHoveredDest] = useState<typeof GLOBE_DESTINATIONS[0] | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const arcCurveRef = useRef<THREE.QuadraticBezierCurve3 | null>(null);
  const pulseMeshRef = useRef<THREE.Mesh | null>(null);
  const arcLineRef = useRef<THREE.Line | null>(null);
  const originMarkerMeshRef = useRef<THREE.Mesh | null>(null);
  const originGpsPulseMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const markerMeshesRef = useRef<{ mesh: THREE.Mesh; dest: typeof GLOBE_DESTINATIONS[0] }[]>([]);

  // Target camera position & globe rotation for smooth animation transitions
  const targetCamZRef = useRef<number>(9.2);

  const GLOBE_RADIUS = 3.6;

  // Active Origin
  const activeOrigin = isGpsOriginActive && userGpsCoords
    ? {
        id: 'my-live-gps',
        name: `My Live GPS (${userGpsCoords.lat.toFixed(3)}°, ${userGpsCoords.lng.toFixed(3)}°)`,
        lat: userGpsCoords.lat,
        lng: userGpsCoords.lng,
      }
    : START_ORIGINS.find((o) => o.id === selectedOriginId) || START_ORIGINS[0];

  const activeDest =
    GLOBE_DESTINATIONS.find((d) => d.id === selectedDestId) || GLOBE_DESTINATIONS[0];

  const routeDistanceKm = haversineKm(
    activeOrigin.lat,
    activeOrigin.lng,
    activeDest.lat,
    activeDest.lng
  );

  const priceDetails = calculateGlobePriceByDistance(activeDest.basePrice, routeDistanceKm);

  // Redraw Great-Circle Flight & Ground GPS Route
  const updateFlightArc = useCallback((orig = activeOrigin, dest = activeDest) => {
    if (!globeGroupRef.current) return;

    const startV = latLngToVector3(orig.lat, orig.lng, GLOBE_RADIUS);
    const endV = latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS);

    const midV = new THREE.Vector3().addVectors(startV, endV).multiplyScalar(0.5);
    const midDistance = startV.distanceTo(endV);
    const altitudeOffset = Math.min(1.4, Math.max(0.35, midDistance * 0.35));
    midV.normalize().multiplyScalar(GLOBE_RADIUS + altitudeOffset);

    const curve = new THREE.QuadraticBezierCurve3(startV, midV, endV);
    arcCurveRef.current = curve;

    const points = curve.getPoints(70);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    if (arcLineRef.current) {
      globeGroupRef.current.remove(arcLineRef.current);
      arcLineRef.current.geometry.dispose();
    }

    const material = new THREE.LineBasicMaterial({
      color: 0xffd60a,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
    });

    const arcLine = new THREE.Line(geometry, material);
    globeGroupRef.current.add(arcLine);
    arcLineRef.current = arcLine;

    // Update Live Origin Marker Position on Globe
    if (originMarkerMeshRef.current) {
      originMarkerMeshRef.current.position.copy(
        latLngToVector3(orig.lat, orig.lng, GLOBE_RADIUS + 0.05)
      );
    }
  }, [activeOrigin, activeDest]);

  // Focus and Zoom camera into a specific destination
  const focusOnDestination = useCallback((dest = activeDest, customZoomZ?: number) => {
    setIsAutoRotating(false);
    if (!globeGroupRef.current || !cameraRef.current) return;

    const targetY = -((dest.lng + 90) * (Math.PI / 180));
    const targetX = (dest.lat * (Math.PI / 180)) * 0.35;

    globeGroupRef.current.rotation.y = targetY;
    globeGroupRef.current.rotation.x = targetX;

    if (customZoomZ) {
      cameraRef.current.position.z = customZoomZ;
      targetCamZRef.current = customZoomZ;
    }

    updateFlightArc(activeOrigin, dest);
  }, [activeOrigin, activeDest, updateFlightArc]);

  // Fly and Zoom to specific regional zones
  const zoomToRegion = (zone: 'Sahyadri' | 'Himalayas' | 'South India' | 'Global') => {
    setIsAutoRotating(false);
    if (!globeGroupRef.current || !cameraRef.current) return;

    if (zone === 'Sahyadri') {
      globeGroupRef.current.rotation.y = -((73.5714 + 90) * (Math.PI / 180));
      globeGroupRef.current.rotation.x = (19.9213 * (Math.PI / 180)) * 0.35;
      cameraRef.current.position.z = 4.4; // Close Zoom!
    } else if (zone === 'Himalayas') {
      globeGroupRef.current.rotation.y = -((84.0 + 90) * (Math.PI / 180));
      globeGroupRef.current.rotation.x = (30.0 * (Math.PI / 180)) * 0.35;
      cameraRef.current.position.z = 5.0;
    } else if (zone === 'South India') {
      globeGroupRef.current.rotation.y = -((76.5 + 90) * (Math.PI / 180));
      globeGroupRef.current.rotation.x = (12.5 * (Math.PI / 180)) * 0.35;
      cameraRef.current.position.z = 5.0;
    } else {
      cameraRef.current.position.z = 9.2;
      setIsAutoRotating(true);
    }
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(
      3.85, // DEEP CLOSE ZOOM
      Math.min(18.0, cameraRef.current.position.z + delta)
    );
  };

  // Detect Live User GPS Coordinates
  const detectLiveGpsLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserGpsCoords({ lat: latitude, lng: longitude });
        setIsGpsOriginActive(true);
        setGpsDetecting(false);

        // Fly route from user GPS to active destination
        updateFlightArc(
          { id: 'live-gps', name: 'My Live GPS Location', lat: latitude, lng: longitude },
          activeDest
        );
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsDetecting(false);
        // Fallback to Mumbai
        setSelectedOriginId('mumbai');
        setIsGpsOriginActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Mount Three.js 3D Earth Globe
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const getWidth = () => container.clientWidth || container.offsetWidth || 800;
    const getHeight = () => container.clientHeight || container.offsetHeight || 580;

    let width = getWidth();
    let height = getHeight();

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with expanded near/far bounds for deep zoom
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 120);
    camera.position.set(0, 1.2, 9.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL init fallback:', e);
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5d0, 1.9);
    dirLight.position.set(14, 10, 10);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    backLight.position.set(-14, -8, -10);
    scene.add(backLight);

    // 5. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 6. Earth Sphere Geometry
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const initialTexture = createProceduralEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: initialTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Load High-Res Blue Marble Satellite Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/Assets/earth-blue-marble.jpg',
      (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        loadedTexture.needsUpdate = true;
        earthMat.map = loadedTexture;
        earthMat.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Local Earth texture fallback active:', err);
      }
    );

    // 7. Atmospheric Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.008, 48, 48);
    const cloudsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    textureLoader.load(
      '/Assets/earth-clouds.png',
      (cloudTex) => {
        cloudTex.wrapS = THREE.RepeatWrapping;
        cloudTex.wrapT = THREE.ClampToEdgeWrapping;
        cloudsMat.map = cloudTex;
        cloudsMat.transparent = true;
        cloudsMat.opacity = 0.38;
        cloudsMat.needsUpdate = true;
      },
      undefined,
      () => {}
    );

    // 8. Outer Atmospheric Glow Halo
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // 9. Add All 16+ Mountain Trek Markers on Globe with Raycasting
    markerMeshesRef.current = [];
    GLOBE_DESTINATIONS.forEach((dest) => {
      const pos = latLngToVector3(dest.lat, dest.lng, GLOBE_RADIUS + 0.05);
      const isAnjaneri = dest.id === 'trek-anjeneri-hills';

      // Pin Mesh
      const pinGeo = new THREE.SphereGeometry(isAnjaneri ? 0.17 : 0.11, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: isAnjaneri ? 0xffd60a : 0xfed547,
        emissive: isAnjaneri ? 0xff9900 : 0xd79700,
        emissiveIntensity: 0.85,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      markerMeshesRef.current.push({ mesh: pinMesh, dest });

      // Pulsing Beacon Rings on Anjaneri & Major Peaks
      if (isAnjaneri || dest.isPrimary) {
        const ringGeo = new THREE.RingGeometry(0.18, 0.34, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xffd60a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos.clone().multiplyScalar(1.008));
        ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
        globeGroup.add(ringMesh);
      }
    });

    // 10. Origin / User GPS Live Beacon Marker
    const originPinGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const originPinMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00b0ff,
      emissiveIntensity: 0.9,
    });
    const originMesh = new THREE.Mesh(originPinGeo, originPinMat);
    const initOriginPos = latLngToVector3(START_ORIGINS[0].lat, START_ORIGINS[0].lng, GLOBE_RADIUS + 0.05);
    originMesh.position.copy(initOriginPos);
    globeGroup.add(originMesh);
    originMarkerMeshRef.current = originMesh;

    // Glowing GPS Pulse Beacon on Origin
    const gpsPulseGeo = new THREE.RingGeometry(0.14, 0.28, 32);
    const gpsPulseMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const gpsPulseMesh = new THREE.Mesh(gpsPulseGeo, gpsPulseMat);
    gpsPulseMesh.position.copy(initOriginPos.clone().multiplyScalar(1.008));
    gpsPulseMesh.lookAt(new THREE.Vector3(0, 0, 0));
    globeGroup.add(gpsPulseMesh);
    originGpsPulseMeshRef.current = gpsPulseMesh;

    // 11. Light Pulse particle travelling along flight arc
    const pulseGeo = new THREE.SphereGeometry(0.13, 16, 16);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    globeGroup.add(pulseMesh);
    pulseMeshRef.current = pulseMesh;

    // Initial flight arc
    updateFlightArc(START_ORIGINS[0], GLOBE_DESTINATIONS[0]);

    // Initial orientation focusing toward India & Western Ghats
    globeGroup.rotation.y = -((73.5714 + 90) * (Math.PI / 180));
    globeGroup.rotation.x = (19.9213 * (Math.PI / 180)) * 0.35;

    setIsLoading(false);

    // 12. Mouse & Touch Controls with Smooth Wheel Zooming
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let idleCounter = 0;
    let touchDistance = 0;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsAutoRotating(false);
      idleCounter = 0;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      idleCounter = 0;

      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targets = markerMeshesRef.current.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        const hit = markerMeshesRef.current.find((m) => m.mesh === intersects[0].object);
        if (hit) {
          dom.style.cursor = 'pointer';
          setHoveredDest(hit.dest);
          setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      } else {
        dom.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      if (!isDragging || !globeGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      globeGroupRef.current.rotation.y += deltaX * 0.0055;
      globeGroupRef.current.rotation.x = Math.max(
        -1.15,
        Math.min(1.15, globeGroupRef.current.rotation.x + deltaY * 0.0055)
      );
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Smooth Mouse Wheel Zoom (Enables deep zoom in and out)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      idleCounter = 0;
      const zoomFactor = e.deltaY * 0.004;
      camera.position.z = Math.max(
        3.85, // Closest zoom right above mountains
        Math.min(18.0, camera.position.z + zoomFactor)
      );
    };

    // Mobile Touch Drag & Pinch-to-Zoom
    const onTouchStart = (e: TouchEvent) => {
      idleCounter = 0;
      setIsAutoRotating(false);
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      idleCounter = 0;
      if (e.touches.length === 1 && isDragging && globeGroupRef.current) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;

        globeGroupRef.current.rotation.y += deltaX * 0.0065;
        globeGroupRef.current.rotation.x = Math.max(
          -1.15,
          Math.min(1.15, globeGroupRef.current.rotation.x + deltaY * 0.0065)
        );
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDistance = Math.sqrt(dx * dx + dy * dy);
        const diff = touchDistance - newDistance;
        touchDistance = newDistance;

        camera.position.z = Math.max(
          3.85,
          Math.min(18.0, camera.position.z + diff * 0.015)
        );
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 13. Dynamic ResizeObserver
    const updateSize = (w: number, h: number) => {
      if (w > 20 && h > 20 && cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: rw, height: rh } = entry.contentRect;
        updateSize(rw, rh);
      }
    });
    resizeObserver.observe(container);

    const onWindowResize = () => {
      updateSize(getWidth(), getHeight());
    };
    window.addEventListener('resize', onWindowResize);

    // 14. Animation Render Loop
    let pulseT = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      idleCounter++;
      if (idleCounter > 200 && !isDragging) {
        setIsAutoRotating(true);
      }

      if (isAutoRotating && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.002;
      }

      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0006;
      }

      if (arcCurveRef.current && pulseMeshRef.current) {
        pulseT = (pulseT + 0.007) % 1;
        const pt = arcCurveRef.current.getPoint(pulseT);
        pulseMeshRef.current.position.copy(pt);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onWindowResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [updateFlightArc]);

  const filteredDestinations = GLOBE_DESTINATIONS.filter(
    (d) =>
      (selectedZoneFilter === 'All' || d.zone === selectedZoneFilter) &&
      (d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="relative w-full h-[620px] sm:h-[720px] rounded-[32px] overflow-hidden border-4 border-black shadow-2xl bg-neutral-950 select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none"
        title="Interactive 3D Earth Globe: Scroll mouse wheel to zoom in/out, drag to rotate, hover peaks for trek details"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30">
          <div className="w-12 h-12 border-4 border-brand-primaryYellow border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-white text-xs font-bold tracking-widest uppercase">
            Rendering 3D Earth Globe...
          </p>
        </div>
      )}

      {/* Top Left: Title Badge & Inspiration from makemytrek */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primaryYellow text-black text-[11px] font-extrabold uppercase tracking-wider shadow-md mb-1.5">
          <GlobeIcon className="w-3.5 h-3.5" />
          <span>Interactive 3D Earth Globe</span>
        </div>
        <h3 className="font-heading text-3xl sm:text-4xl text-white leading-none drop-shadow-md">
          THE WORLD, ON A STRING
        </h3>
        <p className="text-xs uppercase font-extrabold tracking-widest text-brand-primaryYellow mt-1">
          Scroll wheel / Pinch to zoom &bull; 16+ Mountain Peaks
        </p>
      </div>

      {/* Top Right: Quick Controls & Regional Zoom Pills */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
        {/* Regional Quick-Zoom Shortcuts */}
        <div className="flex bg-black/85 p-1 rounded-full border border-neutral-700 shadow-xl backdrop-blur-md">
          <button
            onClick={() => zoomToRegion('Sahyadri')}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition hover:bg-brand-primaryYellow hover:text-black text-brand-primaryYellow"
            title="Deep zoom into Sahyadri Peaks"
          >
            Zoom Sahyadri
          </button>
          <button
            onClick={() => zoomToRegion('Himalayas')}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition hover:bg-brand-primaryYellow hover:text-black text-neutral-300"
            title="Zoom into Himalayan Ranges"
          >
            Himalayas
          </button>
          <button
            onClick={() => zoomToRegion('South India')}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition hover:bg-brand-primaryYellow hover:text-black text-neutral-300"
            title="Zoom into South India"
          >
            South India
          </button>
          <button
            onClick={() => zoomToRegion('Global')}
            className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition hover:bg-brand-primaryYellow hover:text-black text-neutral-300"
            title="Reset to World View"
          >
            World
          </button>
        </div>

        {/* Live GPS & Focus Buttons */}
        <div className="flex gap-1.5">
          <button
            onClick={detectLiveGpsLocation}
            disabled={gpsDetecting}
            className={`px-3 py-1.5 rounded-full shadow-lg text-xs font-extrabold flex items-center gap-1.5 transition border ${
              isGpsOriginActive
                ? 'bg-sky-500 text-white border-white animate-pulse'
                : 'bg-black/85 text-sky-400 hover:bg-black border-sky-400/50'
            }`}
            title="Use My Live GPS Location as Departure Point"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{gpsDetecting ? 'Detecting GPS...' : isGpsOriginActive ? 'Live GPS Active' : 'Use My GPS'}</span>
          </button>

          <button
            onClick={() => {
              setSelectedDestId('trek-anjeneri-hills');
              focusOnDestination(GLOBE_DESTINATIONS[0], 4.4);
            }}
            className="px-3 py-1.5 bg-brand-primaryYellow hover:bg-brand-orange text-black rounded-full shadow-lg text-xs font-extrabold flex items-center gap-1.5 transition transform hover:scale-105"
            title="Fly Camera to Anjaneri Hills"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Focus Anjaneri</span>
          </button>
        </div>

        {/* Deep Zoom Buttons */}
        <div className="flex gap-1.5">
          <button
            onClick={() => handleZoom(-1.4)}
            className="p-2 bg-black/85 hover:bg-black text-white rounded-full shadow-lg transition border border-neutral-700 hover:scale-105"
            title="Zoom In Closely (+)"
          >
            <ZoomIn className="w-4 h-4 text-brand-primaryYellow" />
          </button>
          <button
            onClick={() => handleZoom(1.4)}
            className="p-2 bg-black/85 hover:bg-black text-white rounded-full shadow-lg transition border border-neutral-700 hover:scale-105"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4 text-brand-primaryYellow" />
          </button>
          <button
            onClick={() => zoomToRegion('Global')}
            className="p-2 bg-black/85 hover:bg-black text-white rounded-full shadow-lg transition border border-neutral-700"
            title="Reset Auto-Orbit"
          >
            <RotateCcw className="w-4 h-4 text-brand-primaryYellow" />
          </button>
        </div>
      </div>

      {/* Interactive Mountain Hover Tooltip (Matching makemytrek.vercel.app style) */}
      {hoveredDest && (
        <div
          className="absolute z-30 pointer-events-auto transition-all duration-200"
          style={{
            left: hoverPos ? Math.min(Math.max(16, hoverPos.x - 120), window.innerWidth > 640 ? 520 : 220) : 16,
            top: hoverPos ? Math.max(80, Math.min(hoverPos.y - 190, 420)) : 80,
          }}
        >
          <div className="w-68 bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl shadow-2xl overflow-hidden font-sans transform hover:scale-102 transition">
            <div className="relative h-28 bg-neutral-900 overflow-hidden">
              <img
                src={hoveredDest.imageUrl}
                alt={hoveredDest.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/Assets/Anjenery-hills-1.png';
                }}
              />
              <button
                onClick={() => setHoveredDest(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/80 text-brand-primaryYellow text-[10px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{hoveredDest.liveSpots} Trekkers live</span>
              </div>
            </div>

            <div className="p-3.5">
              <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                {hoveredDest.region} &bull; {hoveredDest.country}
              </p>
              <h4 className="font-heading text-lg text-black mt-0.5 leading-tight">
                {hoveredDest.name}
              </h4>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-700 font-semibold">
                <span>▲ {hoveredDest.elevationFt}</span>
                <span>&bull;</span>
                <span>{hoveredDest.difficulty}</span>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-200">
                <div>
                  <span className="text-[9px] text-neutral-500 block">From Base</span>
                  <span className="font-heading text-base text-black font-extrabold">
                    ₹{hoveredDest.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedDestId(hoveredDest.id);
                      focusOnDestination(hoveredDest, 4.4);
                      if (hoveredDest.id === 'trek-anjeneri-hills' && onExploreLocalMap) {
                        onExploreLocalMap();
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-full bg-black text-brand-primaryYellow hover:bg-neutral-800 text-[10px] font-extrabold uppercase transition"
                  >
                    View Map
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenBookingModal) {
                        onOpenBookingModal(
                          hoveredDest.id,
                          calculateGlobePriceByDistance(hoveredDest.basePrice, routeDistanceKm).totalAmount,
                          activeOrigin.name,
                          routeDistanceKm
                        );
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-brand-primaryYellow text-black hover:bg-brand-orange hover:text-white text-[10px] font-extrabold uppercase transition shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom HUD: Origin Selector, Destination Search, Traveling Distance & Razorpay Booking */}
      <div className="absolute bottom-4 inset-x-4 z-20">
        <div className="bg-black/90 backdrop-blur-md border-2 border-neutral-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* 1. Origin / Location Selector */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-cyan-400" />
                  <span>Your Starting Location</span>
                </label>
                {isGpsOriginActive && (
                  <span className="text-[9px] text-cyan-400 font-extrabold uppercase">Live GPS</span>
                )}
              </div>

              {!isGpsOriginActive ? (
                <select
                  value={selectedOriginId}
                  onChange={(e) => {
                    setSelectedOriginId(e.target.value);
                    const orig = START_ORIGINS.find((o) => o.id === e.target.value);
                    if (orig) updateFlightArc(orig, activeDest);
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-brand-primaryYellow"
                >
                  {START_ORIGINS.map((orig) => (
                    <option key={orig.id} value={orig.id}>
                      {orig.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-1.5 bg-neutral-900 border border-cyan-500 rounded-xl flex items-center justify-between text-xs font-bold">
                  <span className="text-cyan-400 truncate">My Live GPS Location</span>
                  <button
                    onClick={() => setIsGpsOriginActive(false)}
                    className="text-[10px] text-neutral-400 hover:text-white"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* 2. Destination Search Dropdown */}
            <div className="md:col-span-3 relative">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1 mb-1">
                <Search className="w-3 h-3 text-brand-primaryYellow" />
                <span>Search Trek Mountain Peak</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Anjaneri, Kalsubai, Everest..."
                  value={searchQuery}
                  onFocus={() => setSearchDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchDropdownOpen(true);
                  }}
                  className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold placeholder-neutral-500 focus:outline-none focus:border-brand-primaryYellow"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchDropdownOpen(false);
                    }}
                    className="absolute right-2.5 top-2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown with 16+ Peaks */}
              {searchDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-full max-h-60 bg-neutral-900 border-2 border-brand-primaryYellow rounded-xl overflow-y-auto shadow-2xl z-30">
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        setSelectedDestId(dest.id);
                        setSearchQuery(dest.name);
                        setSearchDropdownOpen(false);
                        focusOnDestination(dest, 4.4);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-neutral-800 border-b border-neutral-800 last:border-b-0 flex items-center justify-between transition"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{dest.name}</p>
                        <p className="text-[10px] text-neutral-400">{dest.region}</p>
                      </div>
                      <span className="text-[11px] font-extrabold text-brand-primaryYellow">
                        ₹{dest.basePrice}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Live Telemetry Card: Distance & Amount as per Distance */}
            <div className="md:col-span-3 flex items-center justify-between sm:justify-around bg-neutral-900/90 rounded-xl px-3 py-2 border border-neutral-800">
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-neutral-400 block">Distance</span>
                <span className="font-heading text-sm text-cyan-400 font-extrabold">
                  {routeDistanceKm} km
                </span>
                <span className="text-[9px] text-neutral-500 block truncate max-w-[80px]">
                  {priceDetails.transitLabel.split('(')[0].trim()}
                </span>
              </div>

              <div className="h-7 w-px bg-neutral-800" />

              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-neutral-400 block">Hike Time</span>
                <span className="font-heading text-xs text-brand-primaryYellow font-extrabold block">
                  {activeDest.duration.split('•')[0].trim()}
                </span>
                <span className="text-[9px] text-neutral-500 block">
                  {activeDest.elevationFt}
                </span>
              </div>

              <div className="h-7 w-px bg-neutral-800" />

              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-neutral-400 block">Total Amount</span>
                <span className="font-heading text-sm text-emerald-400 font-extrabold block">
                  ₹{priceDetails.totalAmount}
                </span>
                <span className="text-[8px] text-neutral-400 block">
                  (₹{priceDetails.basePrice} + ₹{priceDetails.transitFee})
                </span>
              </div>
            </div>

            {/* 4. Action Buttons with Verified Razorpay Booking */}
            <div className="md:col-span-3 flex gap-2">
              {activeDest.id === 'trek-anjeneri-hills' && onExploreLocalMap ? (
                <button
                  onClick={onExploreLocalMap}
                  className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-[11px] uppercase transition border border-neutral-600 flex items-center justify-center gap-1"
                  title="Switch to actual local topographic map"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-primaryYellow" />
                  <span className="hidden sm:inline">Local Map</span>
                </button>
              ) : null}

              <button
                onClick={() => {
                  if (onOpenBookingModal) {
                    onOpenBookingModal(
                      activeDest.id,
                      priceDetails.totalAmount,
                      activeOrigin.name,
                      routeDistanceKm
                    );
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-brand-primaryYellow hover:bg-brand-orange text-black hover:text-white font-extrabold text-[11px] uppercase transition shadow-md flex items-center justify-center gap-1.5 border border-black"
                title="Proceed with Verified Expedition Booking via Razorpay"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Book with Razorpay &bull; ₹{priceDetails.totalAmount}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
